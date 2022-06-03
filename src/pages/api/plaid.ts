import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const ENV_URL = process.env.PLAID_URL_SANDBOX;
const CLIENT_ID = process.env.PLAID_CLIENT_ID;
const SECRET_KEY = process.env.PLAID_SECRET_KEY_SANDBOX;
const { COINMARKET_KEY } = process.env;
const PLAID_ENDPOINT = `${process.env.BACKEND_BASE_URL}/credit_score/plaid`;

const clientConfiguration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': CLIENT_ID,
      'PLAID-SECRET': SECRET_KEY,
    },
  },
});

export interface IPlaidTokenCreateResponse {
  expiration: string; // 4 hours (given in UTC)
  link_token: string;
  request_id: string;
  status: number;
}

export interface ITokenExchangeProps {
  publicToken: string;
  // institution: any,
  // accounts: PlaidLinkOnSuccessMetadata['accounts'],
  // userId: number
}

const config = {
  client_id: CLIENT_ID,
  secret: SECRET_KEY,
  client_name: 'Insert Client name here',
  country_codes: ['US'],
  language: 'en',
  user: {
    client_user_id: 'unique_user_id',
  },
  products: ['auth'],
  redirect_uri: `${process.env.NEXT_BASE_URL}/applicant/generate`,
};

async function get_plaid_data(
  req: NextApiRequest,
  res: NextApiResponse,
  body: any
) {
  try {
    const backend_response = await fetch(PLAID_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const responseJson = await backend_response.json();
    return responseJson;
  } catch (error) {
    return error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = `https://${ENV_URL}/link/token/create`;
  const isExchange = req.query.exchange;

  if (isExchange) {
    try {
      const plaidClient = new PlaidApi(clientConfiguration);
      const { publicToken }: ITokenExchangeProps = req.body;
      const response = await plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });

      const access_token = await response.data.access_token;

      const body = {
        keplr_token: 'not-needed-yet',
        plaid_token: access_token,
        plaid_client_id: CLIENT_ID,
        plaid_client_secret: SECRET_KEY,
        coinmarketcap_key: COINMARKET_KEY,
      };

      let plaid_score_res = await get_plaid_data(req, res, body);
      // Seems to be failing on first attempt - need to fix this on API side
      if (plaid_score_res.status === 'error') {
        setTimeout(async () => {
          plaid_score_res = await get_plaid_data(req, res, body);
          res.send({ plaid_score_res });
        }, 3000);
      } else res.send({ plaid_score_res });

      return;
    } catch (error) {
      res.send({ error });
    }
  }

  try {
    const clientTokenRes = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(config),
    });
    const data: IPlaidTokenCreateResponse = await clientTokenRes.json();

    res.send({
      ...data,
      status: clientTokenRes.status,
    });
  } catch (error) {
    res.send({ error });
  }
}
