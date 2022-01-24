import { useEffect, useState } from 'react';

import { DisconnectOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

import { useSecretContext } from '@scrtsybil/src/context';

const Connect = () => {
  const handleKeyStoreChange = () => {
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  };
  const [showWallet, setShowWallet] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleWalletClick = () => {
    setShowWallet(!showWallet);
  };

  const {
    secretjs,
    setSecretjs,
    secretAddress,
    setSecretAddress,
    disconnectWallet,
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
      onClick={() => handleWalletClick()}
      className={`cursor-pointer relative`}
    >
      <div
        className={`flex justify-center items-center  ${
          showWallet ? 'growLeft' : undefined
        } ${secretjs ? 'opacity-100' : 'opacity-20'} `}
        style={{
          width: '2.8rem',
          height: '2.8rem',
          borderRadius: showWallet ? '10px' : '50%',
          backgroundColor: '#5A57D9',
          right: '1rem',
          top: '1rem',
          position: 'absolute',
          zIndex: '5',
        }}
      >
        <img
          alt="keplr_logo"
          src={'./images/keplr.svg'}
          style={{
            width: '1.8rem',
            borderRadius: 10,
            marginLeft: showWallet ? '.5rem' : undefined,
          }}
        />
        {showWallet && (
          <div className={`mx-2 flex items-center  overflow-x-hidden`}>
            {secretAddress}
            <DisconnectOutlined
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
              className="mx-2"
            />
          </div>
        )}
        {showModal && (
          <Modal
            onOk={() => {
              disconnectWallet();
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
