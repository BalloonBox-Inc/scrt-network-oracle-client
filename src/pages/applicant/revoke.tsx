import { useState } from 'react';

import Link from 'next/link';
import { ClipLoader } from 'react-spinners';

import BgImage from '@scrtsybil/src/components/BgImage';
import Button from '@scrtsybil/src/components/Button';
import { useSecretContext } from '@scrtsybil/src/context';
import { handlePermissionRevoke } from '@scrtsybil/src/keplr/helpers';

const RevokePermissionPage = () => {
  const [revokeData, setRevokeData] = useState<string>();
  const [status, setStatus] = useState<string | undefined>(undefined);

  const { setChainActivity, chainActivity } = useSecretContext();

  const revokeDataInput = (onChange?: (e?: any) => void) => (
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
      <p className="mt-5 text-sm">Revoking Permit Query</p>
    </div>
  );

  const mainContainer = (
    <div className="px-10 sm:px-10 z-50 mt-20 mb-20 sm:mt-20 md:-mt-40">
      <div className="w-full text-center">
        <div className="z-50 opacity-100 px-0 sm:p-10 flex flex-col">
          <h2 className="z-50 font-semibold text-2xl sm:text-3xl md:text-3xl lg:text-4xl p-0">
            Revoke a permission
          </h2>
          <p className="z-50 font-thin text-sm sm:text-base p-0">
            Please enter the name of the permission you would like to revoke
          </p>
        </div>
      </div>
      <div className="w-full text-center z-50 sm:px-20 lg:px-40 flex flex-col ">
        <form className="flex flex-col items-start mt-8  w-full">
          <label className="text-left mb-1">Name of permission</label>
          {revokeDataInput((e) => setRevokeData(e.target.value))}
        </form>
        <div className="flex items-center mt-8">
          <Button
            text="Revoke"
            classes={{ container: 'mr-3' }}
            isDisabled={!revokeData}
            onClick={async () => {
              if (revokeData) {
                setStatus('loading');
                const permitRevokeRes = await handlePermissionRevoke({
                  permissionName: revokeData,
                  setChainActivity,
                  chainActivity,
                });
                if (permitRevokeRes) {
                  setStatus(undefined);
                  setRevokeData(undefined);
                }
              }
            }}
          />
          <Link href={'/applicant/create'}>
            <a className="z-50">Create a Permission</a>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <BgImage />
      {status ? loadingContainer : mainContainer}
    </>
  );
};

export default RevokePermissionPage;
