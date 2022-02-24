import { Bip39, Random } from '@iov/crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Secp256k1Pen, pubkeyToAddress, encodeSecp256k1Pubkey } from 'secretjs';

/*
This endpoint will generate a mnemonic and secret public address. 
// visit fuacet to get tokens: https://faucet.secrettestnet.io/
*/

type ResponseT = {
  mnemonic: string;
  address: string;
};

export default async function connect(
  _req: NextApiRequest,
  res: NextApiResponse<ResponseT | string>
) {
  try {
    const mnemonic = Bip39.encode(Random.getBytes(16)).toString();
    const signingPen = await Secp256k1Pen.fromMnemonic(mnemonic);
    const pubkey = encodeSecp256k1Pubkey(signingPen.pubkey);
    const address = pubkeyToAddress(pubkey, 'secret');

    res.status(200).json({ mnemonic, address });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown Error';
    res.status(500).json(errorMessage);
  }
}
