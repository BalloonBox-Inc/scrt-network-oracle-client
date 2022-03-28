import { useState } from 'react';

import { Modal } from 'antd';
import router from 'next/router';

import BgImage from '@scrtsybil/src/components/BgImage';
import Button, { BUTTON_STYLES } from '@scrtsybil/src/components/Button';
import { LoadingContainer } from '@scrtsybil/src/components/LoadingContainer';
import ScoreSpeedometer from '@scrtsybil/src/components/score';
import { BORDER_GRADIENT_STYLE } from '@scrtsybil/src/constants';
import { queryAsServProvider } from '@scrtsybil/src/keplr/helpers';
import { IPermitQueryResponse } from '@scrtsybil/src/types/contract';

const ProviderServicesPage = () => {
  const [selection, setSelection] = useState<null | string>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [status, setStatus] = useState<'loading' | 'success' | undefined>(
    undefined
  );
  const [requestData, setRequestData] = useState({
    permitName: '',
    publicAddress: '',
    permitSignature: '',
  });

  const [queryResponse, setQueryResponse] = useState<
    undefined | IPermitQueryResponse
  >(undefined);

  const handleQueryScore = async () => {
    setStatus('loading');
    const queryAsProviderRes: {
      response?: IPermitQueryResponse;
      status: 'error' | 'success' | string;
      error?: any;
    } = await queryAsServProvider({
      requestData,
    });

    console.log({ queryAsProviderRes });

    if (queryAsProviderRes?.response?.Ok) {
      setQueryResponse(queryAsProviderRes.response);
      setStatus('success');
    } else setStatus(undefined);
  };

  const requestDataInput = (onChange?: (e?: any) => void) => (
    <input
      onChange={onChange}
      className=" focus-visible:outline-blue-600 focus-visible:outline-none  font-mono text-blue-600 bg-input-bg w-full py-3 px-3 rounded-md mb-4"
      type={'text'}
    />
  );
  const permitModal = (
    <Modal
      visible={showModal}
      footer={null}
      onCancel={() => {
        setShowModal(false);
      }}
      bodyStyle={{ background: '#242630' }}
    >
      <div className={`px-8 flex py-5 justify-center rounded-md z-50`}>
        <div className="p-8 px-2 rounded-lg z-50  max-w-xl w-full ">
          <form className="flex flex-col items-start mt-8  w-full">
            <label className="text-left mb-1">Name of permission</label>
            {requestDataInput((e) =>
              setRequestData({
                ...requestData,
                permitName: e.target.value,
              })
            )}
            <label className="text-left mb-1">Public Address</label>
            {requestDataInput((e) =>
              setRequestData({
                ...requestData,
                publicAddress: e.target.value,
              })
            )}
            <label className="text-left mb-1">Permit Signature</label>
            {requestDataInput((e) =>
              setRequestData({
                ...requestData,
                permitSignature: e.target.value,
              })
            )}
          </form>
          <div className="flex">
            <Button text="Query Score" onClick={() => handleQueryScore()} />
          </div>
        </div>
      </div>
    </Modal>
  );

  const mainContainer = (
    <div className="px-14 py-20 ">
      <div className="w-full text-center">
        <div className=" flex flex-col items-center space-y-5  justify-center w-full">
          <div className="z-50 opacity-100 px-0 sm:p-10">
            <h2 className="z-50 font-semibold text-2xl sm:text-3xl md:text-3xl lg:text-4xl p-0">
              Choose a Service
            </h2>
            <p className="z-50 font-thin text-md sm:text-lg md:text-xl lg:text-2xl p-0">
              User Type: Provider
            </p>
          </div>
          <div
            className="flex z-50 justify-center w-80  sm:w-115  rounded-md p-1 "
            style={{
              background:
                selection === 'query' ? BORDER_GRADIENT_STYLE : 'transparent',
            }}
          >
            <div
              onClick={() => setSelection('query')}
              className={`bg-gray-900  cursor-pointer w-full  rounded-md`}
            >
              <div className="text-center">
                <p className="text-base p-0 m-0 py-4">Query a Score</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" sm:px-10 flex justify-between">
        <div className="pt-16 z-30 flex justify-start">
          <div>
            <Button
              onClick={() => {
                router.push(`/start`);
              }}
              text="Back"
              style={BUTTON_STYLES.OUTLINE}
            />
          </div>
        </div>
        <div className="pt-16 z-30 flex justify-end">
          <div>
            <Button
              onClick={() => {
                selection && setShowModal(true);
              }}
              isDisabled={!selection}
              text="Continue"
              style={BUTTON_STYLES.DEFAULT}
            />
          </div>
        </div>
      </div>

      <BgImage />
      {permitModal}
    </div>
  );

  return (
    <>
      {!status && mainContainer}
      {status === 'loading' && <LoadingContainer text={'Querying score'} />}
      {status === 'success' && (
        <div className="relative">
          <ScoreSpeedometer
            showScore
            score={Math.round(queryResponse?.Ok?.score as number)}
          />
        </div>
      )}
    </>
  );
};

export default ProviderServicesPage;
