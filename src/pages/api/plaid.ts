import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const ENV_URL = process.env.PLAID_URL_SANDBOX;
const CLIENT_ID = process.env.PLAID_CLIENT_ID;
const SECRET_KEY = process.env.PLAID_SECRET_KEY_SANDBOX;

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
};

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

      res.send({ access_token });
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
    });
  } catch (error) {
    res.send({ error });
  }
}
