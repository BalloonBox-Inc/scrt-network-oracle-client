import { Modal } from 'antd';

import Button, { BUTTON_ACTION } from '@scrtsybil/src/components/Button';
import {
  queryScoreWithPermit,
  queryScoreWithViewingKey,
} from '@scrtsybil/src/keplr/helpers';
import {
  IPermitQueryResponse,
  IScoreQueryResponse,
} from '@scrtsybil/src/types/contract';

export default function QueryModal({
  showModal,
  setStatusClear,
  setStatusLoading,
  setHideModal,
  permitData,
  setQueryPermitResponse,
  setStatusSuccess,
  setQueryViewingKeyResponse,
  selection,
  setPermitData,
  setViewingKey,
  setClearPermitData,
  setResetViewingKey,
  viewingKey,
}: any) {
  const handleQueryPermit = async () => {
    setStatusLoading();
    setHideModal();
    const queryWithPermit: {
      response?: IPermitQueryResponse;
      status: 'error' | 'success' | string;
      error?: any;
    } = await queryScoreWithPermit({
      requestData: permitData,
    });

    if (queryWithPermit?.response?.Ok) {
      setQueryPermitResponse(queryWithPermit.response);
      setStatusSuccess();
    } else setStatusClear();
  };

  const handleQueryViewingKey = async () => {
    setStatusLoading();
    setHideModal();
    const res: {
      response?: IScoreQueryResponse;
      status: 'error' | 'success' | string;
      error?: any;
    } = await queryScoreWithViewingKey(viewingKey.address, viewingKey.key);

    if (res.status === 'success') {
      setQueryViewingKeyResponse(res.response);
      setStatusSuccess();
      setHideModal();
    } else setStatusClear();
  };

  const requestDataInput = (value: string, onChange?: (e?: any) => void) => (
    <input
      onChange={onChange}
      className=" focus-visible:outline-blue-600 focus-visible:outline-none  font-mono text-blue-600 bg-input-bg w-full py-3 px-3 rounded-md mb-4"
      type={'text'}
      value={value}
    />
  );

  const handleSubmit = () => {
    selection === 'permit' ? handleQueryPermit() : handleQueryViewingKey();
  };

  const formInputs = (
    <form
      className="flex flex-col items-start mt-8 w-full"
      onSubmit={handleSubmit}
    >
      <label className="text-left mb-1">
        {selection === 'permit' ? 'Name of Permit' : 'Viewing Key'}
      </label>
      {selection === 'permit'
        ? requestDataInput(permitData.permitName, (e) =>
            setPermitData({
              ...permitData,
              permitName: e.target.value.toUpperCase(),
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
      <div className="flex">
        <Button
          isDisabled={
            selection === 'permit'
              ? !permitData?.permitName ||
                !permitData?.permitSignature ||
                !permitData?.publicAddress
              : !viewingKey.key || !viewingKey.address
          }
          text="Query Score"
          type={BUTTON_ACTION.SUBMIT}
        />
      </div>
    </form>
  );
  return (
    <Modal
      visible={showModal}
      footer={null}
      onCancel={() => {
        setClearPermitData();
        setResetViewingKey();
        setHideModal();
      }}
      centered
      bodyStyle={{ background: '#242630' }}
    >
      <div
        data-testid="queryModal"
        className={`px-8 flex py-5 justify-center rounded-md z-50`}
      >
        <div className="p-8 px-2 rounded-lg z-50  max-w-xl w-full">
          {formInputs}
        </div>
      </div>
    </Modal>
  );
}
