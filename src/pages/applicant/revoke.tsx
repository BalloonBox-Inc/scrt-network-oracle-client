import { useState } from 'react';

import { Typography, Button, Modal } from 'antd';

const RevokePermissionPage = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [requestData, setRequestData] = useState<string>();

  const requestDataInput = (onChange?: (e?: any) => void) => (
    <input
      onChange={onChange}
      className=" focus-visible:outline-blue-600 focus-visible:outline-none  font-mono text-blue-600 bg-input-bg w-full py-3 px-3 rounded-md mb-4"
      type={'text'}
    />
  );
  return (
    <div className="px-20 py-60 ">
      <div className="w-full text-center">
        <Typography.Title level={2}>Revoke a permission</Typography.Title>
        <p>Please enter the name of the permission</p>

        <form className="flex flex-col items-start mt-8  w-full">
          <label className="text-left mb-1">Name of permission</label>
          {requestDataInput((e) => setRequestData(e.target.value))}
        </form>
      </div>
      <div className="mt-3 flex justify-end">
        <Button
          type="primary"
          disabled={!requestData}
          onClick={() => {
            setShowModal(true);
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

export default RevokePermissionPage;
