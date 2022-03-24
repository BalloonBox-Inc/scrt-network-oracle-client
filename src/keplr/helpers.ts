import { notification } from 'antd';
import { without } from 'ramda';
import { SigningCosmWasmClient } from 'secretjs';
import { StdSignature } from 'secretjs/types/types';

import {
  REST_URL,
  CUSTOM_FEES,
  SECRET_CONTRACT_ADDR,
  CHAIN_ID,
} from '../constants';
import { IChainActivity } from '../context';
import { IScoreResponsePlaid, IScoreResponseCoinbase } from '../types/types';

export const handleSetScore = async ({
  setStatus,
  scoreResponse,
  setChainActivity,
  chainActivity,
}: {
  setStatus: (s: 'loading' | 'error' | 'success' | undefined) => void;
  scoreResponse: IScoreResponsePlaid | IScoreResponseCoinbase | undefined;
  setChainActivity: React.Dispatch<React.SetStateAction<IChainActivity | null>>;
  chainActivity: IChainActivity | null;
}) => {
  if (scoreResponse) {
    setStatus('loading');
    try {
      // @ts-ignore
      const keplrOfflineSigner = window.getOfflineSigner(CHAIN_ID);
      const accounts = await keplrOfflineSigner.getAccounts();
      // @ts-ignore
      const addr = accounts[0].address;

      const cosmJS = new SigningCosmWasmClient(
        REST_URL,
        addr,
        keplrOfflineSigner as any,
        // @ts-ignore
        window.getEnigmaUtils(CHAIN_ID),
        CUSTOM_FEES
      );

      const handleMsg = {
        record: {
          score: Math.round(scoreResponse.score),
          description: scoreResponse.message,
        },
      };
      const response = await cosmJS.execute(SECRET_CONTRACT_ADDR, handleMsg);
      const str = Buffer.from(response.data.buffer).toString();

      if (str.includes('Score recorded')) {
        setStatus('success');
        setChainActivity({
          ...chainActivity,
          scoreAmount: scoreResponse.score,
          scoreSubmitted: true,
          dataProvider: 'coinbase',
        });

        return notification.success({
          message: 'Score recorded to blockchain 🎉',
        });
      }
      return null;
    } catch (error) {
      setStatus('error');
      return notification.error({
        message: 'Score was not recorded.',
      });
    }
  }
  return null;
};

export const handleGeneratePermissionQuery = async ({
  permissionName,
  setPermissionSig,
}: {
  permissionName: string;
  setPermissionSig: ({ pub_key, signature }: StdSignature) => void;
}) => {
  try {
    const allowedTokens = [SECRET_CONTRACT_ADDR];
    const permissions = ['balance'];
    // @ts-ignore
    const keplrOfflineSigner = window.getOfflineSigner(CHAIN_ID);
    const accounts = await keplrOfflineSigner.getAccounts();
    // @ts-ignore
    const addr = accounts[0].address;
    if (typeof window !== 'undefined') {
      // @ts-ignore
      const { signature }: { signature: StdSignature } =
        // eslint-disable-next-line no-unsafe-optional-chaining
        await window.keplr?.signAmino(
          CHAIN_ID,
          addr,
          {
            chain_id: CHAIN_ID,
            account_number: '0', // Must be 0
            sequence: '0', // Must be 0
            fee: {
              amount: [{ denom: 'uscrt', amount: '0' }], // Must be 0 uscrt
              gas: '1', // Must be 1
            },
            msgs: [
              {
                type: 'query_permit', // Must be "query_permit"
                value: {
                  permit_name: permissionName,
                  allowed_tokens: allowedTokens,
                  permissions,
                },
              },
            ],
            memo: '', // Must be empty
          },
          {
            preferNoSetFee: true, // Fee must be 0, so hide it from the user
            preferNoSetMemo: true, // Memo must be empty, so hide it from the user
          }
        );

      setPermissionSig(signature);
      notification.success({ message: 'Success!' });
      return { status: 'success', signature };
    }
  } catch (error) {
    notification.error({
      message: 'There was an error creating a permit query',
    });
    return { status: error };
  }
  return null;
};

export const handlePermissionRevoke = async ({
  permissionName,
  chainActivity,
  setChainActivity,
}: {
  permissionName: string;
  chainActivity: IChainActivity | null;
  setChainActivity: React.Dispatch<React.SetStateAction<IChainActivity | null>>;
}) => {
  try {
    // @ts-ignore
    const keplrOfflineSigner = window.getOfflineSigner(CHAIN_ID);
    const accounts = await keplrOfflineSigner.getAccounts();
    // @ts-ignore
    const addr = accounts[0].address;

    const cosmJS = new SigningCosmWasmClient(
      REST_URL,
      addr,
      keplrOfflineSigner as any,
      // @ts-ignore
      window.getEnigmaUtils(CHAIN_ID),
      CUSTOM_FEES
    );

    const handleMsg = { revoke_permit: { permit_name: permissionName } };
    const response = await cosmJS.execute(SECRET_CONTRACT_ADDR, handleMsg);

    const str = Buffer.from(response.data.buffer).toString();
    if (str.includes('success')) {
      setChainActivity({
        ...chainActivity,
        queryPermit: chainActivity?.queryPermit?.includes(permissionName)
          ? without([permissionName], [...chainActivity.queryPermit])
          : [],
      });
      notification.success({
        message: `Successfully revoked ${permissionName}!`,
      });
      return { status: 'success' };
    }
  } catch (error) {
    notification.error({
      message: 'There was an error revoking the permit query',
    });
    return { status: error };
  }
  return null;
};

export const generatePermission = async ({
  permissionName,
}: {
  permissionName: string;
}) => {
  try {
    const allowedTokens = [SECRET_CONTRACT_ADDR];
    const permissions = ['balance'];
    // @ts-ignore
    const keplrOfflineSigner = window.getOfflineSigner(CHAIN_ID);
    const accounts = await keplrOfflineSigner.getAccounts();
    // @ts-ignore
    const addr = accounts[0].address;

    // @ts-ignore
    const { signature }: { signature: StdSignature } =
      // eslint-disable-next-line no-unsafe-optional-chaining
      await window.keplr?.signAmino(
        CHAIN_ID,
        addr,
        {
          chain_id: CHAIN_ID,
          account_number: '0', // Must be 0
          sequence: '0', // Must be 0
          fee: {
            amount: [{ denom: 'uscrt', amount: '0' }], // Must be 0 uscrt
            gas: '1', // Must be 1
          },
          msgs: [
            {
              type: 'query_permit', // Must be "query_permit"
              value: {
                permit_name: permissionName,
                allowed_tokens: allowedTokens,
                permissions,
              },
            },
          ],
          memo: '', // Must be empty
        },
        {
          preferNoSetFee: true, // Fee must be 0, so hide it from the user
          preferNoSetMemo: true, // Memo must be empty, so hide it from the user
        }
      );

    return {
      signature,
    };
  } catch (error) {
    notification.error({
      message: 'There was an error creating your permit. Please try again.',
    });
    return { status: error };
  }
};
