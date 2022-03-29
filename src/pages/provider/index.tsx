import { useState } from 'react';

// import { Modal } from 'antd';
import dynamic from 'next/dynamic';
import router from 'next/router';

import BgImage from '@scrtsybil/src/components/BgImage';
import Button, { BUTTON_STYLES } from '@scrtsybil/src/components/Button';
import { LoadingContainer } from '@scrtsybil/src/components/LoadingContainer';
import ScoreSpeedometer from '@scrtsybil/src/components/score';
import { BORDER_GRADIENT_STYLE } from '@scrtsybil/src/constants';
import {
  queryScoreWithPermit,
  queryScoreWithViewingKey,
} from '@scrtsybil/src/keplr/helpers';
import {
  IPermitQueryResponse,
  IScoreQueryResponse,
} from '@scrtsybil/src/types/contract';

const Modal = dynamic(() => import('@scrtsybil/node_modules/antd/es/modal'), {
  ssr: false,
});

const ProviderServicesPage = () => {
  const [selection, setSelection] = useState<null | 'viewingKey' | 'permit'>(
    null
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [status, setStatus] = useState<'loading' | 'success' | undefined>(
    undefined
  );

  const PERMIT_FORM_ORIGINAL = {
    permitName: '',
    publicAddress: '',
    permitSignature: '',
  };
  const [permitData, setPermitData] = useState(PERMIT_FORM_ORIGINAL);

  const VIEWING_KEY_FORM_ORIGINAL = {
    address: '',
    key: '',
  };
  const [viewingKey, setViewingKey] = useState(VIEWING_KEY_FORM_ORIGINAL);

  const [queryPermitResponse, setQueryPermitResponse] = useState<
    undefined | IPermitQueryResponse
  >(undefined);

  const [queryViewingKeyResponse, setQueryViewingKeyResponse] = useState<
    undefined | IScoreQueryResponse
  >(undefined);

  const handleQueryPermit = async () => {
    setStatus('loading');
    const queryWithPermit: {
      response?: IPermitQueryResponse;
      status: 'error' | 'success' | string;
      error?: any;
    } = await queryScoreWithPermit({
      requestData: permitData,
    });

    if (queryWithPermit?.response?.Ok) {
      setQueryPermitResponse(queryWithPermit.response);
      setStatus('success');
    } else setStatus(undefined);
  };

  const handleQueryViewingKey = async () => {
    setStatus('loading');
    const res: {
      response?: IScoreQueryResponse;
      status: 'error' | 'success' | string;
      error?: any;
    } = await queryScoreWithViewingKey(viewingKey.address, viewingKey.key);

    if (res.status === 'success') {
      setQueryViewingKeyResponse(res.response);
      setStatus('success');
    }
  };

  const requestDataInput = (value: string, onChange?: (e?: any) => void) => (
    <input
      onChange={onChange}
      className=" focus-visible:outline-blue-600 focus-visible:outline-none  font-mono text-blue-600 bg-input-bg w-full py-3 px-3 rounded-md mb-4"
      type={'text'}
      value={value}
    />
  );

  const formInputs = (
    <form className="flex flex-col items-start mt-8  w-full">
      <label className="text-left mb-1">
        {selection === 'permit' ? 'Name of Permit' : 'Viewing Key'}
      </label>
      {selection === 'permit'
        ? requestDataInput(permitData.permitName, (e) =>
            setPermitData({
              ...permitData,
              permitName: e.target.value,
            })
          )
        : requestDataInput(viewingKey.key, (e) =>
            setViewingKey({
              ...viewingKey,
              key: e.target.value,
            })
          )}
      <label className="text-left mb-1">
        {selection === 'permit' ? 'Public Address' : 'User Address'}
      </label>
      {selection === 'permit'
        ? requestDataInput(permitData.publicAddress, (e) =>
            setPermitData({
              ...permitData,
              publicAddress: e.target.value,
            })
          )
        : requestDataInput(viewingKey.address, (e) =>
            setViewingKey({
              ...viewingKey,
              address: e.target.value,
            })
          )}
      {selection === 'permit' && (
        <>
          <label className="text-left mb-1">Permit Signature</label>
          {requestDataInput(permitData.permitSignature, (e) =>
            setPermitData({
              ...permitData,
              permitSignature: e.target.value,
            })
          )}
        </>
      )}
    </form>
  );

  const queryModal = (
    <Modal
      visible={showModal}
      footer={null}
      onCancel={() => {
        setPermitData(PERMIT_FORM_ORIGINAL);
        setViewingKey(VIEWING_KEY_FORM_ORIGINAL);
        setShowModal(false);
      }}
      centered
      bodyStyle={{ background: '#242630' }}
    >
      <div className={`px-8 flex py-5 justify-center rounded-md z-50`}>
        <div className="p-8 px-2 rounded-lg z-50  max-w-xl w-full ">
          {formInputs}
          <div className="flex">
            <Button
              isDisabled={
                selection === 'permit'
                  ? !permitData?.permitName &&
                    !permitData?.permitSignature &&
                    !permitData?.publicAddress
                  : !viewingKey
              }
              text="Query Score"
              onClick={() =>
                selection === 'permit'
                  ? handleQueryPermit()
                  : handleQueryViewingKey()
              }
            />
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
              Query a User&apos;s Score
            </h2>
            <p className="z-50 font-thin text-md sm:text-lg md:text-xl lg:text-2xl p-0">
              User Type: Provider
            </p>
          </div>
          <div
            className="flex z-50 justify-center w-80  sm:w-115  rounded-md p-1 "
            style={{
              background:
                selection === 'permit' ? BORDER_GRADIENT_STYLE : 'transparent',
            }}
          >
            <div
              onClick={() => setSelection('permit')}
              className={`bg-gray-900  cursor-pointer w-full  rounded-md`}
            >
              <div className="text-center">
                <p className="text-base p-0 m-0 py-4">I have a Query Permit</p>
              </div>
            </div>
          </div>
          <div
            className="flex z-50 justify-center w-80  sm:w-115  rounded-md p-1 "
            style={{
              background:
                selection === 'viewingKey'
                  ? BORDER_GRADIENT_STYLE
                  : 'transparent',
            }}
          >
            <div
              onClick={() => setSelection('viewingKey')}
              className={`bg-gray-900  cursor-pointer w-full  rounded-md`}
            >
              <div className="text-center">
                <p className="text-base p-0 m-0 py-4">I have a Viewing Key</p>
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
            score={
              selection === 'permit'
                ? Math.round(queryPermitResponse?.Ok?.score as number)
                : Math.round(queryViewingKeyResponse?.score as number)
            }
          />
        </div>
      )}
      {queryModal}
    </>
  );
};

export default ProviderServicesPage;
