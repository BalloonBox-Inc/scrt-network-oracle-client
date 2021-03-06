import { notification } from 'antd';
import { replace } from 'ramda';
import { SigningCosmWasmClient } from 'secretjs';
import { StdSignature } from 'secretjs/types/types';

import {
  REST_URL,
  CUSTOM_FEES,
  SECRET_CONTRACT_ADDR,
  CHAIN_ID,
} from '@scrtsybil/src/constants';
import {
  IGenerateViewingKeyResponse,
  IPermitQueryResponse,
  IScoreQueryResponse,
} from '@scrtsybil/src/types/contract';
import {
  IScoreResponsePlaid,
  IScoreResponseCoinbase,
} from '@scrtsybil/src/types/types';

import { Set_Permission_Sig } from '../context';

let insufficientFunds = false;
const insufficientFundsMsg =
  'Try increasing the gas fee amount on the Keplr wallet when making the transaction.';

export const handleSetScore = async ({
  setErrorStatus,
  setLoadingStatus,
  scoreResponse,
}: {
  setErrorStatus: () => void;
  setLoadingStatus: () => void;
  scoreResponse: IScoreResponsePlaid | IScoreResponseCoinbase | null;
}) => {
  if (scoreResponse) {
    setLoadingStatus();
    try {
      // @ts-ignore
      const keplrOfflineSigner = window.getOfflineSigner(CHAIN_ID);
      const accounts = await keplrOfflineSigner.getAccounts();
      // @ts-ignore
      const addr = accounts[0].address;

      const cosmJS = new SigningCosmWasmClient(
        REST_URL as string,
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
      const str = await JSON.parse(
        Buffer.from(response.data.buffer).toString()
      );

      if (str?.record?.status === 'Score recorded!') {
        notification.success({
          message: 'Score recorded to blockchain 🎉',
        });
        return { status: 'success' };
      }
      return null;
    } catch (error) {
      setErrorStatus();

      if ((error as any).message.includes('insufficient fees')) {
        insufficientFunds = true;
      }

      if ((error as any).message.includes('timed out')) {
        return notification.error({
          message: `Score was not recorded. Timed out waiting for transaction to be included in a block. Please try again.`,
        });
      }

      return notification.error({
        message: `Score was not recorded. ${
          insufficientFunds ? insufficientFundsMsg : ''
        }`,
      });
    }
  }
  return null;
};

export const handleSetViewingKey = async ({ entropy }: { entropy: string }) => {
  try {
    // @ts-ignore
    const keplrOfflineSigner = window.getOfflineSigner(CHAIN_ID);
    const accounts = await keplrOfflineSigner.getAccounts();
    // @ts-ignore
    const addr = accounts[0].address;

    const cosmJS = new SigningCosmWasmClient(
      REST_URL as string,
      addr,
      keplrOfflineSigner as any,
      // @ts-ignore
      window.getEnigmaUtils(CHAIN_ID),
      CUSTOM_FEES
    );

    const handleMsg = {
      generate_viewing_key: {
        padding: 'extra padding',
        entropy,
      },
    };
    const response = await cosmJS.execute(SECRET_CONTRACT_ADDR, handleMsg);

    const responseParsed: IGenerateViewingKeyResponse = await JSON.parse(
      Buffer.from(response.data.buffer).toString()
    );

    if (responseParsed?.generate_viewing_key?.key) {
      notification.success({
        message: 'Viewing Key generated successfully.',
      });

      return { response: responseParsed, status: 'success' };
    }
    return { response: responseParsed, status: 'error' };
  } catch (error) {
    if ((error as any).message.includes('insufficient fees')) {
      insufficientFunds = true;
    }
    notification.error({
      message: `Viewing key was not generated. ${
        insufficientFunds ? insufficientFundsMsg : ''
      }`,
    });

    return { error, status: 'error' };
  }
};

export const handleGeneratePermissionQuery = async ({
  permissionName,
  setPermissionSig,
}: {
  permissionName: string;
  setPermissionSig: Set_Permission_Sig;
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

      setPermissionSig({ name: permissionName, signature });
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
}: {
  permissionName: string;
}) => {
  try {
    // @ts-ignore
    const keplrOfflineSigner = window.getOfflineSigner(CHAIN_ID);
    const accounts = await keplrOfflineSigner.getAccounts();
    // @ts-ignore
    const addr = accounts[0].address;

    const cosmJS = new SigningCosmWasmClient(
      REST_URL as string,
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
      notification.success({
        message: `Successfully revoked ${replace(
          /_/g,
          ' ',
          permissionName.trim()
        )}!`,
      });
      return { status: 'success' };
    }
  } catch (error) {
    if ((error as any).message.includes('insufficient fees')) {
      insufficientFunds = true;
    }
    notification.error({
      message: `There was an error revoking the permit query. ${
        insufficientFunds ? insufficientFundsMsg : ''
      }`,
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

export const queryScoreWithViewingKey = async (
  address: string,
  viewingKey: string
) => {
  try {
    // @ts-ignore
    const keplrOfflineSigner = window.getOfflineSigner(CHAIN_ID);
    const accounts = await keplrOfflineSigner.getAccounts();
    // @ts-ignore
    const addr = accounts[0].address;

    const cosmJS = new SigningCosmWasmClient(
      REST_URL as string,
      addr,
      keplrOfflineSigner as any,
      // @ts-ignore
      window.getEnigmaUtils(CHAIN_ID)
      // CUSTOM_FEES
    );

    const viewingKeyMsg = { read: { address, key: viewingKey } };

    const response: IScoreQueryResponse = await cosmJS.queryContractSmart(
      SECRET_CONTRACT_ADDR,
      viewingKeyMsg
    );

    if (response.score) {
      notification.success({ message: 'Success!' });
      return { status: 'success', response };
    }
    return { status: 'error', response };
  } catch (error) {
    notification.error({
      message:
        'There was an error getting the user data, please check your key or try again later.',
    });
    return { status: 'error', error };
  }
};
interface IRequestAsProviderData {
  permitName: string;
  publicAddress: string;
  permitSignature: string;
}

export const queryScoreWithPermit = async ({
  requestData,
}: {
  requestData: IRequestAsProviderData;
}) => {
  try {
    // @ts-ignore
    const keplrOfflineSigner = window.getOfflineSigner(CHAIN_ID);
    const accounts = await keplrOfflineSigner.getAccounts();
    // @ts-ignore
    const addr = accounts[0].address;

    const cosmJS = new SigningCosmWasmClient(
      REST_URL as string,
      addr,
      keplrOfflineSigner as any,
      // @ts-ignore
      window.getEnigmaUtils(CHAIN_ID)
    );

    const getScoreWithPermission = {
      with_permit: {
        query: { balance: {} },
        permit: {
          params: {
            permit_name: replace(/ /g, '_', requestData.permitName.trim()),
            allowed_tokens: [SECRET_CONTRACT_ADDR],
            chain_id: CHAIN_ID,
            permissions: ['balance'],
          },
          signature: {
            pub_key: {
              type: 'tendermint/PubKeySecp256k1',
              value: requestData?.publicAddress,
            },
            signature: requestData?.permitSignature,
          },
        },
      },
    };

    const response: IPermitQueryResponse = await cosmJS.queryContractSmart(
      SECRET_CONTRACT_ADDR,
      getScoreWithPermission
    );

    if (response.Ok?.score) {
      notification.success({
        message: `Score queried: ${response.Ok.score}`,
      });
      return { status: 'success', response };
    }

    if (response.Ok?.status === 'Score not found.') {
      notification.error({
        message: 'Your score was not found on the smart contract.',
      });
      return { status: 'error', error: response.Ok?.status };
    }

    notification.error({
      message:
        "There was an error querying the user's score. Please verify that your details are correct.",
    });
    return { status: 'error', response };
  } catch (error) {
    notification.error({
      message:
        "There was an error querying the user's score.  Please verify that your details are correct.",
    });
    return { status: 'error', error };
  }
};
