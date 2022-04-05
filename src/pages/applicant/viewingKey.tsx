import { useState } from 'react';

import { Modal, Tooltip } from 'antd';
import router from 'next/router';
import { replace } from 'ramda';

import BgImage from '@scrtsybil/src/components/BgImage';
import Button, { BUTTON_STYLES } from '@scrtsybil/src/components/Button';
import { LoadingContainer } from '@scrtsybil/src/components/LoadingContainer';
import { CHAIN_ACTIVITIES, useSecretContext } from '@scrtsybil/src/context';
import { handleSetViewingKey } from '@scrtsybil/src/keplr/helpers';
import { IGenerateViewingKeyResponse } from '@scrtsybil/src/types/contract';

const ViewingKeyPage = () => {
  const [inputData, setinputData] = useState<string>();
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [viewingKeyResponse, setViewingKeyResponse] = useState<
    IGenerateViewingKeyResponse | undefined
  >(undefined);

  const { setChainActivity, chainActivity } = useSecretContext();

  const handleCreateViewingKey = async () => {
    if (inputData) {
      setStatus('loading');
      const inputDataWithoutSpaces = replace(/ /g, '_', inputData.trim());
      const viewingKeyRes: {
        response?: IGenerateViewingKeyResponse;
        status: 'success' | 'error' | string;
        error?: any;
      } = await handleSetViewingKey({
        entropy: inputDataWithoutSpaces,
      });

      if (
        viewingKeyRes.status === 'success' &&
        viewingKeyRes.response?.generate_viewing_key?.key
      ) {
        setChainActivity({
          ...chainActivity,
          [CHAIN_ACTIVITIES.viewingKey]:
            viewingKeyRes.response.generate_viewing_key.key,
        });

        setStatus('success');
        setViewingKeyResponse(viewingKeyRes.response);
      } else setStatus(undefined);
    }
  };

  const inputDataInput = (onChange?: (e?: any) => void) => (
    <input
      onChange={onChange}
      className=" z-50 focus-visible:outline-blue-600 focus-visible:outline-none  font-mono text-blue-600 bg-input-bg w-full py-3 px-3 rounded-md mb-4"
      type={'text'}
    />
  );

  const resetData = () => {
    setStatus(undefined);
    setViewingKeyResponse(undefined);
    setinputData(undefined);
  };

  const viewingKeyModal = (
    <Modal
      visible={status === 'success'}
      footer={null}
      centered
      onCancel={() => resetData()}
      bodyStyle={{ background: '#242630' }}
    >
      <div className={`px-8 flex py-5 justify-center rounded-md z-50`}>
        <div className="p-8 px-2 rounded-lg z-50  max-w-xl w-full ">
          <div className="flex items-center mb-6">
            <h3 className="text-lg mr-2  font-semibold ">Viewing Key</h3>
            <Tooltip
              trigger={'hover'}
              placement="right"
              title={
                'You will not be able to access this key again. Please store it carefully.'
              }
            >
              <div className="bg-gray-500 w-4 h-4 rounded-full p-2 flex justify-center items-center cursor-pointer text-black">
                i
              </div>
            </Tooltip>
          </div>
          <p className="mb-3 font-semibold text-blue text-lg">
            {viewingKeyResponse?.generate_viewing_key?.key}
          </p>
          {viewingKeyResponse?.generate_viewing_key?.key && (
            <Tooltip trigger={'click'} placement="left" title={'Copied!'}>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    viewingKeyResponse?.generate_viewing_key?.key
                  )
                }
              >
                Copy
              </button>
            </Tooltip>
          )}

          <div className="flex mt-10">
            <Button text="I saved my Viewing Key" onClick={() => resetData()} />
          </div>
        </div>
      </div>
    </Modal>
  );

  const mainContainer = (
    <div className="px-10 sm:px-14 z-50 mt-20 mb-20 sm:mt-20 md:-mt-8">
      <div className="w-full text-center">
        <div className="z-50 opacity-100 px-0 sm:p-10 flex flex-col">
          <h2 className="z-50 font-semibold text-2xl sm:text-3xl md:text-3xl lg:text-4xl p-0">
            {'Create a Viewing Key'}
          </h2>
          <p className="z-50 font-thin text-sm sm:text-base p-0">
            Please enter secret phrase or word to generate the viewing key.
          </p>
        </div>
      </div>
      <div className="w-full text-center z-50 sm:px-20 lg:px-40 flex flex-col ">
        <form className="flex flex-col items-start mt-8  w-full">
          <label className="text-left mb-1">Viewing key name or phrase</label>
          {inputDataInput((e) => setinputData(e.target.value))}
        </form>
        <div className="flex justify-between w-full">
          <div className="flex items-center mt-8">
            <Button
              onClick={() => {
                router.push(`/applicant`);
              }}
              text="Back"
              style={BUTTON_STYLES.OUTLINE}
            />
          </div>
          <div className="flex items-center mt-8">
            <Button
              text={'Create'}
              classes={{ container: 'mr-3' }}
              isDisabled={!inputData}
              onClick={() => handleCreateViewingKey()}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <BgImage />
      {status ? (
        <LoadingContainer text={'Creating a Viewing Key'} />
      ) : (
        mainContainer
      )}
      {viewingKeyModal}
    </>
  );
};

export default ViewingKeyPage;
