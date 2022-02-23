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
      onClick={() => setShowWallet(true)}
      className={`cursor-pointer relative`}
    >
      <div
        className={`flex justify-center items-center  
        ${showWallet ? 'growLeft' : 'shrinkRight'} ${
          secretjs ? 'opacity-100' : 'opacity-20'
        } `}
        style={{
          width: '2.8rem',
          height: '2.8rem',
          borderRadius: '10px',
          backgroundColor: '#5A57D9',
          right: '1rem',
          top: '1rem',
          position: 'absolute',
          zIndex: '5',
        }}
      >
        {showWallet && (
          <div
            onClick={(e) => {
              e.stopPropagation();
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
            // marginLeft: showWallet ? '.5rem' : undefined,
            marginLeft: '15px',
          }}
        />

        <div className={`mx-2 flex items-center  overflow-x-hidden`}>
          {secretAddress}
          <div
            onClick={() => {
              return message.success({
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
            className="mr-2 text-lg hover:text-red-400 transition-colors"
          />
        </div>

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
