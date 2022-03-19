import { useEffect, useState } from 'react';

import {
  CloseOutlined,
  CopyOutlined,
  DisconnectOutlined,
} from '@ant-design/icons';
import { Modal, message } from 'antd';
import Image from 'next/image';

import logoImage from '@scrtsybil/public/images/keplr.svg';
import { useSecretContext } from '@scrtsybil/src/context';

const Connect = () => {
  const handleKeyStoreChange = () => {
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  };
  const [showWallet, setShowWallet] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [shrinkAnimation, setShrinkAnimation] = useState<boolean>(false); // added so that it doesn't shrink on load

  const {
    secretjs,
    setSecretjs,
    secretAddress,
    setSecretAddress,
    disconnectWallet,
    connectWallet,
    connectRequest,
    setConnectRequest,
  } = useSecretContext();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keplr_keystorechange', handleKeyStoreChange);
      () =>
        window.removeEventListener(
          'keplr_keystorechange',
          handleKeyStoreChange
        );
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!window.keplr) {
        // eslint-disable-next-line no-alert
        alert('Please install keplr extension');
      }
    }
  }, [setSecretAddress, setSecretjs]);

  const handleConnectRequest = () => {
    setConnectRequest(!connectRequest);
    connectWallet();
  };

  return (
    <div role={'presentation'} className="h-full">
      <div
        className={`flex justify-center items-center bg-gradient-to-b from-purple to-deepblue hover:opacity-75
        ${showWallet ? 'growLeft' : undefined} 
        ${!showWallet && shrinkAnimation ? 'shrinkRight' : undefined}
        ${secretjs ? 'opacity-100' : 'opacity-100'} `}
        style={{
          width: secretAddress ? '2.8rem' : 'fit-content',
          height: '2.8rem',
          borderRadius: '50px',
          zIndex: '5',
          cursor: 'pointer',
        }}
      >
        <div
          onClick={() => {
            secretAddress ? setShowWallet(true) : handleConnectRequest();
          }}
          className={`flex items-center justify-center h-10 ${
            !showWallet && 'sm:ml-4 ml-0 px-3 sm:px-0'
          }`}
        >
          {showWallet && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setShrinkAnimation(true);
                setShowWallet(false);
              }}
              role={'presentation'}
              className="mr-2 -mt-1"
            >
              <CloseOutlined />
            </div>
          )}

          <Image
            layout="fixed"
            width={'25'}
            height={'25'}
            alt="keplr_logo"
            src={logoImage}
          />
          {!secretjs && <p className="hidden sm:block pl-2 pr-4">Connect</p>}
        </div>
        {secretAddress && (
          <div className={`mx-2 flex text-xs items-center overflow-x-hidden`}>
            {secretAddress}
            <div
              onClick={() => {
                navigator.clipboard.writeText(secretAddress);
                message.success({
                  content: 'Copied to clipboard',
                  className: 'absolute left-0 items-center',
                  style: {
                    borderRadius: '20px',
                  },
                });
              }}
              className="text-lg mx-2 mb-2 transition-colors hover:text-green-400"
            >
              <CopyOutlined />
            </div>
            <DisconnectOutlined
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
              className="text-lg hover:text-red-400 transition-colors"
            />
          </div>
        )}
        {showModal && (
          <Modal
            onOk={(e) => {
              e.stopPropagation();
              setShrinkAnimation(false);
              setShowWallet(false);
              setTimeout(() => disconnectWallet(), 500);
              setShowModal(false);
              setConnectRequest(false);
            }}
            visible={showModal}
            okText={<>Disconnect</>}
            onCancel={() => setShowModal(false)}
            width={300}
            bodyStyle={{
              display: 'flex',
              width: '100%',
              flexDirection: 'column',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            Are you sure you want to disconnect your wallet?
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Connect;
