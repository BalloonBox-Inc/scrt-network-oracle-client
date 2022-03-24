import React from 'react';

import { Button } from 'antd';

import Layout from '@scrtsybil/src/components/Layout';
import LogoLoader from '@scrtsybil/src/components/LogoLoader';
import { useSecretContext } from '@scrtsybil/src/context';

const keplr = '/images/keplr.svg';

const Home = () => {
  const { loading, connectRequest, setConnectRequest } = useSecretContext();

  const handleDisconnectRequest = () => {
    setConnectRequest(false);
  };

  const awaitingConnectionView = (
    <div
      style={{ height: '70%', padding: '3rem 5rem' }}
      className="flex justify-center items-center flex-col"
    >
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

  return <div>{connectRequest && awaitingConnectionView}</div>;
};

export default Home;
