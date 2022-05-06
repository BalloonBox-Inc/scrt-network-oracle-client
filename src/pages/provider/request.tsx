import { useState } from 'react';

import { Typography, Button, Modal } from 'antd';

import { queryAsServProvider } from '@scrtsybil/src/utils';

const ProviderRequestPage = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [requestData, setRequestData] = useState({
    permitName: '',
    publicAddress: '',
    permitSignature: '',
  });

  const requestDataInput = (onChange?: (e?: any) => void) => (
    <input
      onChange={onChange}
      className=" focus-visible:outline-blue-600 focus-visible:outline-none font-mono text-blue-600 bg-input-bg w-full py-3 px-3 rounded-md mb-4"
      type={'text'}
    />
  );

  return (
    <div className="px-20 py-60 ">
      <div className="w-full text-center">
        <Typography.Title level={2}>Request a Score</Typography.Title>
        <p>Please enter th einformation provided by the applicant:</p>

        <form className="flex flex-col items-start mt-8  w-full">
          <label className="text-left mb-1">Name of query permit</label>
          {requestDataInput((e) =>
            setRequestData({
              ...requestData,
              permitName: e.target.value.toUpperCase(),
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
      </div>
      <div className="mt-3 flex justify-end">
        <Button
          type="primary"
          disabled={
            !(
              requestData.permitName &&
              requestData.permitSignature &&
              requestData.publicAddress
            )
          }
          onClick={() => {
            setShowModal(true);
            queryAsServProvider({
              permissionName: requestData.permitName,
              permissionSignature: requestData.permitSignature,
              publicAddress: requestData.publicAddress,
            });
          }}
        >
          Next
        </Button>
      </div>

      {showModal && (
        <Modal
          onOk={(e) => {
            e.stopPropagation();
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
          Waiting for Blockchain response.
        </Modal>
      )}
    </div>
  );
};

export default ProviderRequestPage;
