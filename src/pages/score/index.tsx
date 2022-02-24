import { useEffect, useState } from 'react';

import { Alert, Button, Input, Layout, notification, Typography } from 'antd';
import { SigningCosmWasmClient } from 'secretjs';
import { StdSignature } from 'secretjs/types/types';

import LogoLoader from '@scrtsybil/src/components/LogoLoader';
import {
  CHAIN_ID,
  CUSTOM_FEES,
  REST_URL,
  SECRET_CONTRACT_ADDR,
} from '@scrtsybil/src/constants';
import { AppConfig } from '@scrtsybil/src/utils/AppConfig';

const { Content } = Layout;
const { Title } = Typography;

const SIGNATURE =
  'RAvV5r6gvZP/RIHtc7H4E2A6M4pTvPpSzzsqiG6Zkv4LCkxoEm4XS2uRe6gzYoFYzhjRAPdQiy9YZuzvdu1qVA==';

interface IPermissionSig {
  pubkey: string;
  signature: string;
}

const ScorePage = () => {
  const [loading, setLoading] = useState(true);
  const [queryLoading, setQueryLoading] = useState(false);
  const [score, setScore] = useState(400);
  const [permissionName, setPermissionName] = useState<string>('');
  const [contractAddress, setContractAddress] =
    useState<string>(SECRET_CONTRACT_ADDR);
  const [permissionSig, setPermissionSig] = useState<IPermissionSig | null>(
    null
  );

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);

  const handleQueryScore = async () => {
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
      window.getEnigmaUtils(CHAIN_ID)
      // CUSTOM_FEES
    );
    const getScore = { get_score: { address: addr } };

    const response = await cosmJS.queryContractSmart(contractAddress, getScore);

    if (response.score) {
      notification.success({
        message: `Your score is ${response.score}`,
      });
    }
  };

  const queryAsServProvider = async () => {
    setQueryLoading(true);
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
      // BroadcastMode.Sync
    );

    const getScoreWithPermission = {
      with_permit: {
        query: { balance: {} },
        permit: {
          params: {
            permit_name: permissionName,
            allowed_tokens: [contractAddress],
            chain_id: CHAIN_ID,
            permissions: ['balance'],
          },
          signature: {
            pub_key: {
              type: 'tendermint/PubKeySecp256k1',
              value: permissionSig?.pubkey,
            },
            signature: permissionSig?.signature,
          },
        },
      },
    };

    const response = await cosmJS.queryContractSmart(
      contractAddress,
      getScoreWithPermission
    );

    setQueryLoading(false);

    if (response.Ok) {
      notification.success({
        message: `Score queried: ${response.Ok.score}`,
      });
    }
  };

  const generatePermission = async () => {
    const allowedTokens = [contractAddress];
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

      setPermissionSig({
        pubkey: signature.pub_key.value,
        signature: signature.signature,
      });
    }
  };

  const handlePermissionRevoke = async () => {
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
    const response = await cosmJS.execute(contractAddress, handleMsg);

    const str = Buffer.from(response.data.buffer).toString();

    if (str.includes('success')) {
      setPermissionSig(null);
      notification.success({
        message: `${permissionName} has successfully been revoked`,
      });
      setPermissionName('');
    }
  };

  const handleSetScore = async () => {
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

    const handleMsg = { record: { score: 400 } };
    const response = await cosmJS.execute(contractAddress, handleMsg);
    const str = Buffer.from(response.data.buffer).toString();

    if (str.includes('Score recorded')) {
      notification.success({
        message: 'Score recorded',
      });
    }
  };

  const scoreContent = (
    <div className="pt-5 flex flex-col items-center">
      <Title level={2}>Congratulations!</Title>
      <p className="text-lg">Your score is</p>
      <h2 className="text-6xl">{score}</h2>
    </div>
  );

  const container = (
    <div
      style={{
        background:
          'linear-gradient(205deg, rgba(36,18,87,1) 0%, rgba(70,52,79,1) 80%)',
        zIndex: '150',
        boxShadow: '0px 25px 25px rgba(0, 3, 32, 0.5)',
        borderRadius: '8px',
        minHeight: '300px',
        width: '390px',
      }}
      className="m-5 flex flex-col items-center px-10"
    >
      {loading && (
        <LogoLoader className="h-full mt-5" text="Calculating Your Score" />
      )}
      {!loading && scoreContent}
      {!loading && (
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleSetScore();
          }}
          className="mb-5"
          type="primary"
        >
          Save to Blockchain
        </Button>
      )}
      <Button
        onClick={(e) => {
          e.preventDefault();
          handleQueryScore();
        }}
        className="mb-5"
        type="primary"
      >
        Query Score
      </Button>
      <div className="my-3">
        <Input
          onChange={(d) => setPermissionName(d.target.value)}
          type={'text'}
          value={permissionName}
          placeholder="Permit Name"
        />
      </div>
      <div className="mb-3 w-full">
        <Input
          onChange={(d) => setContractAddress(d.target.value)}
          type={'text'}
          value={contractAddress}
          placeholder="Contract Address"
        />
      </div>
      <Button
        onClick={(e) => {
          e.preventDefault();
          generatePermission();
        }}
        disabled={!permissionName || !contractAddress}
        className="mb-5"
        type="primary"
      >
        Generate a Permission
      </Button>
      {permissionName && `Permit Name: ${permissionName}`}

      {permissionSig && (
        <div style={{ overflowWrap: 'anywhere' }} className="w-full mt-5">
          <p>Public key: {permissionSig.pubkey}</p>
          <p>Signature: {permissionSig.signature}</p>
        </div>
      )}
      <Button
        onClick={(e) => {
          e.preventDefault();
          queryAsServProvider();
        }}
        className="mb-5 mt-2"
        type="primary"
        disabled={!permissionSig}
        loading={queryLoading}
      >
        Query As Service Provider
      </Button>

      <Button
        onClick={(e) => {
          e.preventDefault();
          handlePermissionRevoke();
        }}
        className="mb-5"
        type="primary"
        disabled={!permissionSig}
      >
        Revoke Permission
      </Button>
    </div>
  );

  return (
    <Layout>
      {AppConfig.simulationMode && (
        <div className="absolute top-2 left-2">
          <Alert showIcon type="warning" message="This is a simulated score." />
        </div>
      )}

      <div className="flex justify-center items-center flex-col h-full px-10">
        <div className="absolute flex justify-center w-full top-0">
          <img alt="background_waves" src={'./images/diagonalWaves.svg'} />
        </div>
        <Content className="z-10 mt-32">
          <div className="flex justify-center items-center flex-col">
            {container}
          </div>
          {/* <Title className="text-center px-5" style={{ fontWeight: 500 }}>
            Welcome to <span className="text-primary">SCRTsybil</span>
          </Title> */}
        </Content>
      </div>
    </Layout>
  );
};

export default ScorePage;
