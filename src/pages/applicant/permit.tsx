import { useEffect, useState } from 'react';

import { Modal, notification } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { isEmpty, replace } from 'ramda';
import { ClipLoader } from 'react-spinners';
import { StdSignature } from 'secretjs/types/types';

import BgImage from '@scrtsybil/src/components/BgImage';
import Button from '@scrtsybil/src/components/Button';
import { useSecretContext } from '@scrtsybil/src/context';
import {
  generatePermission,
  handlePermissionRevoke,
} from '@scrtsybil/src/keplr/helpers';

const PermissionPage = () => {
  const [inputData, setinputData] = useState<string>();
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [permissionSig, setPermissionSig] = useState<StdSignature | undefined>(
    undefined
  );

  const [revokeOrCreate, setRevokeOrCreate] = useState<
    'revoke' | 'create' | null
  >(null);
  const router = useRouter();

  const isCreate = revokeOrCreate === 'create';
  const isRevoke = revokeOrCreate === 'revoke';

  useEffect(() => {
    // if(router.query)

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

  const { setChainActivity, chainActivity } = useSecretContext();

  const inputDataInput = (onChange?: (e?: any) => void) => (
    <input
      onChange={onChange}
      className=" z-50 focus-visible:outline-blue-600 focus-visible:outline-none  font-mono text-blue-600 bg-input-bg w-full py-3 px-3 rounded-md mb-4"
      type={'text'}
    />
  );

  const loadingContainer = (
    <div className="w-full flex-col  flex justify-center items-center z-50">
      <ClipLoader
        speedMultiplier={0.75}
        size={120}
        color={'rgba(85,42,170, 10)'}
      />
      <p className="mt-5 text-sm">
        {isRevoke ? 'Revoking Permit Query' : 'Creating a Permit'}
      </p>
    </div>
  );

  const permitModal = (
    <Modal
      visible={!!permissionSig}
      footer={null}
      onCancel={() => {
        setPermissionSig(undefined);
      }}
      bodyStyle={{ background: '#242630' }}
    >
      <div className={`px-8 flex py-5 justify-center rounded-md z-50`}>
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
            <span className="font-thin">{permissionSig?.pub_key.value}</span>
          </p>
          <p className="mb-3 font-semibold">
            Signature:{' '}
            <span className="font-thin">{permissionSig?.signature}</span>
          </p>
          <div className="flex">
            <Button
              text="I have saved these keys"
              onClick={() => {
                setinputData(undefined);
                setPermissionSig(undefined);
              }}
            />
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
            {isCreate ? 'Create a Permission' : 'Revoke a Permission'}
          </h2>
          <p className="z-50 font-thin text-sm sm:text-base p-0">
            Please enter the name of the permission you would like to{' '}
            {isCreate ? 'create' : 'revoke'}
          </p>
        </div>
      </div>
      <div className="w-full text-center z-50 sm:px-20 lg:px-40 flex flex-col ">
        <form className="flex flex-col items-start mt-8  w-full">
          <label className="text-left mb-1">Permission name or phrase</label>
          {inputDataInput((e) => setinputData(e.target.value))}
        </form>
        <div className="flex items-center mt-8">
          <Button
            text={isCreate ? 'Create' : 'Revoke'}
            classes={{ container: 'mr-3' }}
            isDisabled={!inputData}
            onClick={async () => {
              if (inputData) {
                setStatus('loading');
                if (isRevoke) {
                  const permitRevokeRes = await handlePermissionRevoke({
                    permissionName: inputData,
                    setChainActivity,
                    chainActivity,
                  });
                  if (permitRevokeRes) {
                    setStatus(undefined);
                    setinputData(undefined);
                  }
                }
                if (isCreate) {
                  const inputDataWithoutSpaces = replace(
                    / /g,
                    '_',
                    inputData.trim()
                  );
                  const permitCreateRes = await generatePermission({
                    permissionName: inputDataWithoutSpaces,
                  });
                  setStatus(undefined);

                  if (permitCreateRes?.signature) {
                    setPermissionSig(permitCreateRes?.signature);
                  } else {
                    notification.error({
                      message:
                        'There was an error creating your permit. Please try again.',
                    });
                  }
                }
              }
            }}
          />
          <Link
            href={
              isRevoke
                ? '/applicant/permit?type=create'
                : '/applicant/permit?type=revoke'
            }
          >
            <a className="z-50">
              {isCreate ? 'Revoke a permission' : 'Create a permission'}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <BgImage />
      {status ? loadingContainer : mainContainer}
      {permitModal}
    </>
  );
};

export default PermissionPage;
