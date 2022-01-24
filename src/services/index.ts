import { ITokenExchangeProps } from '../pages/api/plaid';

const post = (url: string, body?: any) =>
  fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: {
      'content-type': 'application/json',
    },
    body: body || undefined,
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    throw new Error('Something went wrong.');
  });

export const handleCoinbaseCode = (code: string) =>
  post(`/api/coinbase?code=${code}`);

export const exchangePlaidToken = ({ publicToken }: ITokenExchangeProps) => {
  try {
    return post('/api/plaid?exchange=true', JSON.stringify({ publicToken }));
  } catch (error: any) {
    return error;
  }
};
