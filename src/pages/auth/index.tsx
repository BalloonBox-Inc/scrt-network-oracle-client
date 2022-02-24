import { useEffect, useState } from 'react';

import { CheckCircleFilled } from '@ant-design/icons';
import { Layout, Typography, Button, notification, Alert, Modal } from 'antd';
import { useRouter } from 'next/router';

import LaunchLink from '@scrtsybil/src/components/plaid';
import { NOTIFICATIONS } from '@scrtsybil/src/constants';
import { useSecretContext } from '@scrtsybil/src/context';
import { IPlaidTokenCreateResponse } from '@scrtsybil/src/pages/api/plaid';
import { handleCoinbaseCode } from '@scrtsybil/src/services';

const { Content } = Layout;
const { Title } = Typography;

const diagonalWaves = './images/diagonalWaves.svg';

const AuthPage = () => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [plaidToken, setPlaidToken] = useState<undefined | string>(undefined);
  const [hideInstructions, setHideInstructions] = useState<boolean>(false);
  const [confirmCalculate, setConfirmCalculate] = useState<boolean>(false);
  const {
    secretjs,
    setPlaidPublicToken,
    loading,
    setCoinbaseToken,
    coinbaseToken,
    plaidPublicExchangeResponse,
  } = useSecretContext();
  const router = useRouter();
  const connectionError = (client: 'Coinbase' | 'Plaid') =>
    notification.error({
      message: `There was an error. Please re-connect to ${client}.`,
    });

  useEffect(() => {
    (!!plaidPublicExchangeResponse || !!coinbaseToken) && setDisabled(false);
  }, [plaidPublicExchangeResponse, coinbaseToken]);

  useEffect(() => {
    (!!plaidPublicExchangeResponse || !!coinbaseToken) &&
      setHideInstructions(true);
  }, [plaidPublicExchangeResponse, coinbaseToken]);

  useEffect(() => {
    const getCoinbaseToken = async (code: string) => {
      try {
        const resJson = await handleCoinbaseCode(code);
        if (resJson.error) {
          router.replace('/auth');
          connectionError('Coinbase');
        }
        if (resJson.access_token) {
          notification.success({
            message: 'Successfully connected to Coinbase.',
          });
          setCoinbaseToken(resJson);
          router.replace('/auth');
        }
      } catch (error) {
        router.pathname = '/auth';
        connectionError('Coinbase');
      }
    };

    if (router?.query?.code) {
      getCoinbaseToken(router.query.code as string);
    }
  }, [router, setCoinbaseToken]);

  useEffect(() => {
    !secretjs && !loading && router.push('/');
  }, [loading, router, secretjs]);

  useEffect(() => {
    !router?.query?.code &&
      secretjs &&
      notification.success({
        message: NOTIFICATIONS.WALLET_CONNECT_SUCCESS,
        placement: 'bottomRight',
      });
  }, [secretjs, router?.query?.code]);

  const handleCoinbaseConnect = async () => {
    const res = await fetch('/api/coinbase');
    const resJson = await res.json();
    if (resJson.url) {
      window.location.href = resJson.url;
    }
  };

  const handlePlaidConnect = async () => {
    try {
      const plaidRes = await fetch('/api/plaid');
      const plaidResJson: IPlaidTokenCreateResponse = await plaidRes.json();
      if (plaidResJson?.link_token) {
        setPlaidToken(plaidResJson.link_token);
        setPlaidPublicToken({ publicToken: plaidResJson.link_token });
      }
    } catch (error) {
      connectionError('Plaid');
    }
  };

  const LogoContainer = ({
    children,
    onClickHandler,
    isDisabled = false,
  }: {
    children: any;
    onClickHandler: () => void;
    isDisabled?: boolean;
  }) => {
    return (
      <div
        onClick={() => (isDisabled ? null : onClickHandler())}
        role="presentation"
        className={`bg-scrt-background w-fit px-5 py-4 pb-7 rounded-md  transition-colors flex items-center ${
          isDisabled ? 'cursor-auto' : 'cursor-pointer hover:bg-secondary'
        }`}
      >
        {children}
      </div>
    );
  };

  const handleCalculateScore = () => {
    const bothProvidersSelected =
      !!plaidPublicExchangeResponse && !!coinbaseToken;
    if (!bothProvidersSelected) {
      setConfirmCalculate(true);
    } else router.push('/score');
  };

  return (
    <Layout>
      {plaidToken && <LaunchLink token={plaidToken} />}
      <Modal
        onOk={() => {
          router.push('/score');
        }}
        visible={confirmCalculate}
        okText={<>Calculate</>}
        onCancel={() => setConfirmCalculate(false)}
        width={300}
        bodyStyle={{
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div className="px-2">
          {`Are you sure you only want to calculate your score using your ${
            plaidPublicExchangeResponse ? 'Plaid' : 'Coinbase'
          } account?`}
        </div>
      </Modal>

      <div className="flex justify-center items-center flex-col h-full px-10">
        <div className="absolute flex justify-center w-full top-0">
          <img alt="background_waves" src={diagonalWaves} />
        </div>
        <Content className="z-10 mt-32">
          <Title className="text-center px-5" style={{ fontWeight: 500 }}>
            Welcome to <span className="text-primary">SCRTsybil</span>
          </Title>
          <div className="bg-scrt-background rounded-md flex justify-between space-y-3 mt-8 py-4 flex-col  items-center">
            {!hideInstructions && (
              <div className="mx-3">
                <Alert
                  closable
                  className="text-sm"
                  showIcon
                  message="Select one or more of the following providers to qualify for a credit check."
                  type="info"
                />
              </div>
            )}
            <LogoContainer
              isDisabled={!!coinbaseToken}
              onClickHandler={handleCoinbaseConnect}
            >
              <div className="flex items-center text-primary mt-3  justify-between">
                <img
                  style={{ marginTop: '-4px' }}
                  alt="coinbase_logo"
                  src={'./images/coinbaseLogo.svg'}
                  width={'130px'}
                />
                {coinbaseToken && (
                  <CheckCircleFilled className="text-xl mx-2" />
                )}
              </div>
            </LogoContainer>
            <LogoContainer
              isDisabled={!!plaidPublicExchangeResponse}
              onClickHandler={handlePlaidConnect}
            >
              <div className="flex items-center justify-between text-primary mt-3">
                <img
                  width={'130px'}
                  alt="coinbase_logo"
                  src={'./images/plaidLogo.svg'}
                />
                {plaidPublicExchangeResponse && (
                  <CheckCircleFilled className="text-xl mx-2" />
                )}
              </div>
            </LogoContainer>
          </div>
          <div className="z-10 w-full justify-center flex mt-20">
            <Button
              disabled={disabled}
              size="large"
              type="primary"
              onClick={() => handleCalculateScore()}
              style={{ background: disabled ? '#3C3C3C' : undefined }}
            >
              Calculate my credit score
            </Button>
          </div>
        </Content>
      </div>
    </Layout>
  );
};

export default AuthPage;
