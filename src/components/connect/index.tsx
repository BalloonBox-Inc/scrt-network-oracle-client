import { useEffect, useState } from 'react';

import {
  CloseOutlined,
  CopyOutlined,
  DisconnectOutlined,
} from '@ant-design/icons';
import { Modal, message } from 'antd';

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

  return (
    <div
      role={'presentation'}
      onClick={() => {
        secretAddress ? setShowWallet(true) : connectWallet();
      }}
      className="cursor-pointer relative"
    >
      <div
        className={`flex absolute  justify-center items-center  
        ${showWallet ? 'growLeft' : undefined} 
        ${!showWallet && shrinkAnimation ? 'shrinkRight' : undefined}
        ${secretjs ? 'opacity-100' : 'opacity-100'} `}
        style={{
          width: secretAddress ? '2.8rem' : 'fit-content',
          height: '2.8rem',
          borderRadius: '10px',
          border: '1px solid #5A57D9',
          backgroundColor: secretjs ? '#5A57D9' : 'transparent',
          right: '1rem',
          top: '1rem',
          zIndex: '5',
          cursor: 'pointer',
        }}
      >
        {showWallet && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShrinkAnimation(true);
              setShowWallet(false);
            }}
            role={'presentation'}
            className="-left-5 absolute top-2"
          >
            <CloseOutlined />
          </div>
        )}
        <img
          alt="keplr_logo"
          src={'./images/keplr.svg'}
          style={{
            width: '1.8rem',
            borderRadius: 10,
            marginLeft: showWallet ? '5px' : '15px',
          }}
        />
        {!secretjs && <p className="mt-3 ml-2 mr-3">Connect</p>}
        {secretAddress && (
          <div className={`mx-2 flex items-center  overflow-x-hidden`}>
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
