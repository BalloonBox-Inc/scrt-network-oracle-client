import { DownloadOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import router from 'next/router';
import { StdSignature } from 'secretjs/types/types';

import Button, { BUTTON_STYLES } from '@scrtsybil/src/components/Button';

const PermitModal = ({
  permissionSig,
  setPermissionSig,
  inputData,
  clearInputData,
}: {
  permissionSig: { name: string; signature: StdSignature } | null;
  setPermissionSig: React.Dispatch<
    React.SetStateAction<{ name: string; signature: StdSignature } | null>
  >;
  inputData: string | undefined;
  clearInputData: () => void;
}) => {
  return (
    <Modal
      visible={!!permissionSig}
      footer={null}
      onCancel={() => {
        setPermissionSig(null);
      }}
      centered
      bodyStyle={{ background: '#242630' }}
    >
      <div className={`px-8 flex pt-5 justify-center rounded-md z-50`}>
        <div className="p-8 px-2 rounded-lg z-50  max-w-xl w-full ">
          <div className="flex items-center mb-6">
            <h3 className="text-lg mr-2 uppercase font-semibold ">
              Query Permit{' '}
            </h3>
            <div className="bg-gray-500 w-4 h-4 rounded-full p-2 flex justify-center items-center cursor-pointer text-black">
              i
            </div>
          </div>
          <p className="mb-3 font-semibold">
            Permit Name: <span className="font-thin">{inputData}</span>
          </p>
          <p className="mb-3 font-semibold">
            Public Key:{' '}
            <span className="font-thin">
              {permissionSig?.signature?.pub_key.value}
            </span>
          </p>
          <p className="mb-3 font-semibold">
            Signature:{' '}
            <span className="font-thin">
              {permissionSig?.signature?.signature}
            </span>
          </p>
          <div className="flex items-center mt-10">
            <Button
              text="I have saved these keys"
              onClick={() => {
                clearInputData();
                setPermissionSig(null);
              }}
            />
            <div>
              <Button
                text="Query Score"
                style={BUTTON_STYLES.LINK}
                classes={{ button: 'hover:text-blue' }}
                onClick={() => {
                  router.push('/applicant/query');
                }}
              />
            </div>
          </div>
          <div
            role={'presentation'}
            className="mt-10 text-xs flex items-center  text-blue cursor-pointer"
            onClick={() => {
              const element = document.createElement('a');
              const file = new Blob(
                [
                  JSON.stringify({
                    permit_name: inputData,
                    public_key: permissionSig?.signature?.pub_key.value,
                    signature: permissionSig?.signature?.signature,
                  }),
                ],
                {
                  type: 'text/plain',
                }
              );
              element.href = URL.createObjectURL(file);
              element.download = 'query_permit.txt';
              document.body.appendChild(element); // Required for this to work in FireFox
              element.click();
              document.body.removeChild(element);
            }}
          >
            <span className="mr-1 text-base">
              <DownloadOutlined />
            </span>
            <p className="mt-2">download permit</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PermitModal;
