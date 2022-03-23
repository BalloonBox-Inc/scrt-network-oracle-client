import { NextApiRequest, NextApiResponse } from 'next';

const { COINBASE_CLIENT_SECRET, COINBASE_CLIENT_ID, COINMARKET_KEY } =
  process.env;
const REDIRECT_URL = `${process.env.NEXT_BASE_URL}/applicant/generate`;
const COINBASE_ENDPOINT = `${process.env.BACKEND_BASE_URL}/credit_score/coinbase`;
const COINBASE_TOKEN_URL = 'https://api.coinbase.com/oauth/token';
const AUTHORIZE_URL = `${process.env.COINBASE_BASE_AUTHORIZE_URL}?response_type=code&client_id=${COINBASE_CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=wallet:accounts:read,wallet:accounts:read,wallet:addresses:read,wallet:buys:read,wallet:deposits:read,wallet:payment-methods:read,wallet:transactions:read,wallet:user:read,wallet:withdrawals:read,wallet:user:update`;

export interface ICoinbaseTokenCreateResponse {
  access_token: string;
  created_at: number;
  refresh_token: string;
  token_type: 'string';
}

export interface ICoinbaseTokenError {
  error: string;
  error_description: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = AUTHORIZE_URL;
  if (req.query?.access_token) {
    try {
      const body = {
        keplr_token: 'not-needed-yet',
        coinbase_access_token: req.query?.access_token,
        coinbase_refresh_token: req.query?.refresh_token,
        coinmarketcap_key: COINMARKET_KEY,
      };

      const backend_response = await fetch(COINBASE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const coinbaseScore = await backend_response.json();

      res.send({ coinbaseScore });
    } catch (error) {
      res.send({ error });
    }
  } else if (req.query?.code) {
    try {
      const tokenRes = await fetch(
        `${COINBASE_TOKEN_URL}?grant_type=authorization_code&code=${req.query.code}&client_id=${COINBASE_CLIENT_ID}&client_secret=${COINBASE_CLIENT_SECRET}&redirect_uri=${process.env.NEXT_BASE_URL}/applicant/generate`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
        }
      );
      const tokenResJson = await tokenRes.json();
      res.send({ ...tokenResJson });
    } catch (error: unknown | ICoinbaseTokenError) {
      res.send({ error });
    }
  } else {
    res.send({ url });
  }
}
