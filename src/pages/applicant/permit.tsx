import { useEffect, useState } from 'react';

import { DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Modal, Tooltip } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { isEmpty, replace } from 'ramda';

import BgImage from '@scrtsybil/src/components/BgImage';
import Button, { BUTTON_STYLES } from '@scrtsybil/src/components/Button';
import { LoadingContainer } from '@scrtsybil/src/components/LoadingContainer';
import { useSecretContext } from '@scrtsybil/src/context';
import {
  generatePermission,
  handlePermissionRevoke,
} from '@scrtsybil/src/keplr/helpers';

const PermissionPage = () => {
  const [inputData, setinputData] = useState<string>();
  const [status, setStatus] = useState<string | undefined>(undefined);

  const [revokeOrCreate, setRevokeOrCreate] = useState<
    'revoke' | 'create' | null
  >(null);
  const router = useRouter();

  const isCreate = revokeOrCreate === 'create';
  const isRevoke = revokeOrCreate === 'revoke';

  useEffect(() => {
    isEmpty(router.query) && router.replace('/applicant/permit?type=create');
  }, [router]);

  useEffect(() => {
    if (router.query?.type === 'revoke') {
      setRevokeOrCreate('revoke');
    }
    if (router.query?.type === 'create') {
      setRevokeOrCreate('create');
    }
  }, [router]);

  const { setPermissionSig, permissionSig } = useSecretContext();

  const handleRevokePermit = async () => {
    if (inputData) {
      setStatus('loading');
      const permitRevokeRes = await handlePermissionRevoke({
        permissionName: inputData,
      });
      if (permitRevokeRes) {
        setStatus(undefined);
        setinputData(undefined);
      }
    }
  };

  const handleCreatePermit = async () => {
    if (inputData) {
      setStatus('loading');
      const inputDataWithoutSpaces = replace(/ /g, '_', inputData.trim());
      const permitCreateRes = await generatePermission({
        permissionName: inputDataWithoutSpaces,
      });
      setStatus(undefined);
      if (permitCreateRes?.signature) {
        setPermissionSig({
          name: inputData,
          signature: permitCreateRes.signature,
        });
      }
    }
  };

  const inputDataInput = (onChange?: (e?: any) => void) => (
    <input
      onChange={onChange}
      className=" z-50 focus-visible:outline-blue-600 focus-visible:outline-none font-mono text-blue-600 bg-input-bg w-full py-3 px-3 rounded-md mb-4 uppercase"
      type={'text'}
    />
  );

  const permitModal = (
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
            <Tooltip
              title="You can only view this key once. Make sure to save it and keep it safe."
              placement="bottom"
            >
              <InfoCircleOutlined className="cursor-pointer hover:text-gray-500" />
            </Tooltip>
          </div>
          <p className="mb-3 font-semibold">
            Permit Name:{' '}
            <span className="font-thin">
              {inputData || permissionSig?.name}
            </span>
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
                setinputData(undefined);
                setPermissionSig(null);
              }}
            />
            <div>
              <Button
                text="Query Score"
                style={BUTTON_STYLES.LINK}
                classes={{ button: 'hover:text-gray-400' }}
                onClick={() => {
                  router.push('/applicant/query');
                }}
              />
            </div>
          </div>
          <div
            role={'presentation'}
            className="mt-10 text-xs flex items-center text-blue cursor-pointer"
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
            <div className="hover:text-gray-500 flex">
              <span className="mr-1 text-base">
                <DownloadOutlined />
              </span>
              <p className="mt-2">Download permit</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );

  const mainContainer = (
    <div className="px-10 sm:px-14 z-50 mt-20 mb-20 sm:mt-10">
      <div className="w-full text-center">
        <div className="z-50 opacity-100 px-0 sm:p-10 flex flex-col">
          <h2 className="z-50 font-semibold text-2xl sm:text-3xl md:text-3xl lg:text-4xl p-0 flex items-center justify-center">
            {isCreate ? 'Create a query permit' : 'Revoke a query permit'}
            <Tooltip
              title={`${
                isCreate
                  ? 'Gas fees are not charged when creating a query permit and these permits can be shared with others. Gas fees are only charged if you decide to revoke the permit at a later time.'
                  : 'Gas fees are charged when revoking a query permit.'
              }`}
              placement="bottom"
            >
              <InfoCircleOutlined
                className="cursor-pointer hover:text-gray-500"
                style={{ marginLeft: '1rem', fontSize: '25px' }}
              />
            </Tooltip>
          </h2>
          <p className="z-50 font-thin text-sm sm:text-base p-0">
            Please enter the name of the query permit you would like to{' '}
            {isCreate ? 'create' : 'revoke'}
          </p>
        </div>
      </div>
      <div className="w-full text-center z-50 sm:px-20 lg:px-40 flex flex-col ">
        <form className="flex flex-col items-start mt-8  w-full">
          <label className="text-left mb-1">Query permit name or phrase</label>
          {inputDataInput((e) => setinputData(e.target.value.toUpperCase()))}
        </form>
        <div className="flex items-center mt-8">
          <Button
            text={isCreate ? 'Create' : 'Revoke'}
            classes={{ container: 'mr-3' }}
            isDisabled={!inputData}
            onClick={() =>
              isRevoke ? handleRevokePermit() : handleCreatePermit()
            }
          />
          <Link
            href={
              isRevoke
                ? '/applicant/permit?type=create'
                : '/applicant/permit?type=revoke'
            }
          >
            <a className="z-50">
              {isCreate ? 'Revoke a query permit' : 'Create a query permit'}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <BgImage />
      {status ? (
        <LoadingContainer
          text={isRevoke ? 'Revoking Permit Query' : 'Creating a Permit'}
        />
      ) : (
        mainContainer
      )}
      {permitModal}
    </>
  );
};

export default PermissionPage;
