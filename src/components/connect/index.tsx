import { useEffect, useState } from 'react';

import {
  CloseOutlined,
  CopyOutlined,
  DisconnectOutlined,
} from '@ant-design/icons';
import { Modal, message, notification } from 'antd';
import Image from 'next/image';

import logoImage from '@scrtsybil/public/images/keplr.svg';
import { NOTIFICATIONS } from '@scrtsybil/src/constants';
import { useSecretContext } from '@scrtsybil/src/context';
import { handleKeplrOpen } from '@scrtsybil/src/utils';

const MIN_WIDTH_TO_SHOW_ADDRESS = 440;

const Connect = ({ showWallet, setShowWallet }: any) => {
  const handleKeyStoreChange = () => {
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  };
  // const [showWallet, setShowWallet] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [shrinkAnimation, setShrinkAnimation] = useState<boolean>(false); // added so that it doesn't shrink on load

  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);

  const {
    secretAddress,
    setSecretAddress,
    connectRequest,
    setConnectRequest,
    setCoinbaseToken,
    setPlaidPublicToken,
    setScoreResponse,
  } = useSecretContext();

  const disconnectWallet = () => {
    setSecretAddress(null);
    setConnectRequest(false);
    setCoinbaseToken(undefined);
    setPlaidPublicToken(undefined);
    setScoreResponse(undefined);
    localStorage.clear();
    notification.success({
      message: NOTIFICATIONS.WALLET_DISCONNECT_SUCCESS,
    });
  };

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
      if (
        windowWidth &&
        windowWidth > MIN_WIDTH_TO_SHOW_ADDRESS &&
        showWallet
      ) {
        setShowWallet(false);
      }
    };

    if (typeof window !== 'undefined') {
      handleWindowResize();
      window.addEventListener('resize', handleWindowResize);
      () => window.removeEventListener('resize', handleWindowResize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  }, [setSecretAddress]);

  const handleConnectRequest = () => {
    setConnectRequest(!connectRequest);
    handleKeplrOpen(setSecretAddress);
  };

  const handleShowWallet = () => {
    if (windowWidth && windowWidth > MIN_WIDTH_TO_SHOW_ADDRESS) {
      setShowWallet(true);
    }
  };

  return (
    <div role={'presentation'} className="h-full">
      <div
        onClick={() => {
          secretAddress ? handleShowWallet() : handleConnectRequest();
        }}
        className={`flex justify-center overflow-hidden items-center bg-gradient-to-b from-purple to-blue 
        ${showWallet ? 'growLeft' : 'hover:opacity-75'} 
        ${!showWallet && shrinkAnimation ? 'shrinkRight' : undefined}`}
        style={{
          width: secretAddress ? '2.8rem' : 'fit-content',
          height: '2.8rem',
          borderRadius: '50px',
          zIndex: '5',
          cursor: 'pointer',
        }}
      >
        <div
          className={`flex items-center justify-center h-10 ${
            !showWallet && 'ml-4'
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
              className="mr-2 -mt-1 z-50"
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
          {!secretAddress && <p className="pl-2 pr-4">Connect</p>}
        </div>
        {secretAddress && (
          <div className={`mx-2 flex text-xs items-center overflow-x-hidden`}>
            {secretAddress}
            <div
              onClick={() => {
                navigator.clipboard.writeText(secretAddress);
                message.success({
                  content: 'Copied to clipboard',
                  className: 'absolute right-0 items-center',
                  style: {
                    borderRadius: '20px',
                  },
                  duration: '.3',
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
