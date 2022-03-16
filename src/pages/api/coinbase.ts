import { NextApiRequest, NextApiResponse } from 'next';

const CLIENT_ID = process.env.COINBASE_CLIENT_ID;
const { COINBASE_CLIENT_SECRET } = process.env;
const REDIRECT_URL = `${process.env.NEXT_BASE_URL}/applicant/generate`;

const COINBASE_TOKEN_URL = 'https://api.coinbase.com/oauth/token';
const AUTHORIZE_URL = `${process.env.COINBASE_BASE_AUTHORIZE_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}`;

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
  if (req.query?.code) {
    try {
      const tokenRes = await fetch(
        `${COINBASE_TOKEN_URL}?grant_type=authorization_code&code=${req.query.code}&client_id=${CLIENT_ID}&client_secret=${COINBASE_CLIENT_SECRET}&redirect_uri=${process.env.NEXT_BASE_URL}/applicant/generate`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
        }
      );
      const tokenResJson = await tokenRes.json();
      console.log({ tokenResJson });
      res.send({ ...tokenResJson });
    } catch (error: unknown | ICoinbaseTokenError) {
      res.send({ error });
    }
  } else {
    res.send({ url });
  }
}
