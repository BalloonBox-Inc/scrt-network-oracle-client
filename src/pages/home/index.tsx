import { useEffect } from 'react';

import { Layout, Typography, Button } from 'antd';
import { useRouter } from 'next/router';

import diagonalWaves from '@scrtsybil/public/images/diagonalWaves.svg';
import keplr from '@scrtsybil/public/images/keplr.svg';
import BlueWave from '@scrtsybil/src/components/blueWave';
import LogoLoader from '@scrtsybil/src/components/LogoLoader';
import LogoWithWaves from '@scrtsybil/src/components/LogoWithWaves';
import { useSecretContext } from '@scrtsybil/src/context';

const { Content } = Layout;
const { Title } = Typography;

const Home = () => {
  const navigate = useRouter();
  const {
    secretjs,
    loading,
    connectWallet,
    connectRequest,
    setConnectRequest,
  } = useSecretContext();

  useEffect(() => {
    secretjs && navigate.push('/auth');
  }, [secretjs, navigate]);

  const handleConnectRequest = () => {
    setConnectRequest(!connectRequest);
    if (!secretjs) {
      connectWallet();
    }
  };

  const handleDisconnectRequest = () => {
    setConnectRequest(false);
  };

  const connectButton = (
    <div className="flex justify-center z-50">
      <Button
        onClick={() => handleConnectRequest()}
        size="large"
        style={{ padding: '0 2.3rem' }}
        type={connectRequest ? 'link' : 'primary'}
      >
        <div className="flex">
          <img
            alt="keplr_logo"
            style={{ width: '1.4rem', marginRight: '.5rem' }}
            src={keplr}
          />
          Connect with Keplr
        </div>
      </Button>
    </div>
  );

  const clickToConnectView = (
    <div style={{ marginTop: '8rem' }}>
      <LogoWithWaves />
      <div className="flex  justify-center items-center flex-col">
        <>
          <Title>Your Secret Wallet</Title>
          <p className="text-center" style={{ fontSize: '1.2rem' }}>
            Send, Request and Swap SCRT directly from your Blockchain Wallet.
          </p>
        </>
      </div>
    </div>
  );

  const awaitingConnectionView = (
    <div
      style={{ height: '70%', padding: '3rem 5rem' }}
      className="flex justify-center items-center flex-col"
    >
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          top: '0',
        }}
      >
        <img alt="background_waves" src={diagonalWaves} />
      </div>
      <div
        className="flex flex-col items-center"
        style={{
          background:
            'linear-gradient(142.6deg, #232323 -1.55%, rgba(29, 29, 29, 0.64) 200.36%',
          zIndex: '10',
          padding: '7rem',
          boxShadow: '0px 25px 25px rgba(0, 3, 32, 0.5)',
          borderRadius: '8px',
        }}
      >
        <div className="flex items-center w-full">
          <img
            alt="spinning_keplr"
            className="spin mb-3 mr-3"
            width={'22px'}
            src={keplr}
          />
          <div className="text-lg w-full overflow-visible">
            Awaiting connection...
          </div>
        </div>

        <Button
          onClick={() => handleDisconnectRequest()}
          size="large"
          style={{ padding: '0 2.3rem' }}
          type={connectRequest ? 'link' : 'primary'}
        >
          Back
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <LogoLoader />
      </Layout>
    );
  }

  return (
    <Layout>
      <Content style={{ zIndex: '50' }} className="h-screen px-3">
        <div className="z-100">
          {connectRequest ? awaitingConnectionView : clickToConnectView}
          {!connectRequest && connectButton}
        </div>
      </Content>
      <BlueWave />
    </Layout>
  );
};

export default Home;
