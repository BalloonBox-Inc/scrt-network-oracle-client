import fs from 'fs';

import { Bip39, Random } from '@iov/crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  Secp256k1Pen,
  encodeSecp256k1Pubkey,
  pubkeyToAddress,
  EnigmaUtils,
  SigningCosmWasmClient,
} from 'secretjs';

import {
  CUSTOM_FEES,
  REST_URL,
  SECRET_CONTRACT_ADDR,
} from '@scrtsybil/src/constants';

const CONTRACT_PATH = './contract/secret_template.wasm';
const AUTO_DEPLOY = true;
const QUERY = false;
const SETTER = false;

export default async function handleDeploy(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const wasm = fs.readFileSync(CONTRACT_PATH);

  if (AUTO_DEPLOY) {
    // If you have key pairs use them here. Or generate them w/ api/account endpoint
    const mnemonic =
      'hamster oblige matrix rhythm access immune wrestle human draft polar ketchup visa';
    const signingPen = await Secp256k1Pen.fromMnemonic(mnemonic);
    const address = 'secret1x8lcy6gr2tfpx703v4872atcqf6lpg2t4g66k4';
    // Upload client
    const txEncryptionSeed = EnigmaUtils.GenerateNewSeed();
    const client = new SigningCosmWasmClient(
      REST_URL,
      address,
      (signBytes) => signingPen.sign(signBytes),
      txEncryptionSeed,
      CUSTOM_FEES
    );
    // UPLOAD:
    const uploadReceipt = await client.upload(wasm, {});

    const initMsg = { max_size: 1000 };
    const receipt = await client.instantiate(
      uploadReceipt.codeId,
      initMsg,
      address.slice(6)
    );
    if (!QUERY && !SETTER) {
      res.status(200).json({
        mnemonic,
        address,
        receipt,
        uploadReceipt,
      });
    }

    if (QUERY) {
      // QUERY:
      const getterMsg = { get_stats: {} };
      const response = await client.queryContractSmart(
        SECRET_CONTRACT_ADDR,
        getterMsg
      );

      if (!SETTER) {
        res.status(200).json({
          mnemonic,
          address,
          response,
        });
      }
    }
  } else {
    try {
      const wasmJson = await wasm.toJSON();
      res.send(wasmJson);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown Error';
      res.status(500).json(errorMessage);
    }
  }
}
