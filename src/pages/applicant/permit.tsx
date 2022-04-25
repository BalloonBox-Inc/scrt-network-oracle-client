import { replace } from 'ramda';

import BgImage from '@scrtsybil/src/components/BgImage';
import { LoadingContainer } from '@scrtsybil/src/components/LoadingContainer';
import {
  useInputData,
  useSetStatus,
  useHandlePermitType,
  useManageRouterQuery,
} from '@scrtsybil/src/components/permit/hooks';
import MainContainer from '@scrtsybil/src/components/permit/MainContainer';
import PermitModal from '@scrtsybil/src/components/permit/PermitModal';
import { useSecretContext } from '@scrtsybil/src/context';
import {
  generatePermission,
  handlePermissionRevoke,
} from '@scrtsybil/src/keplr/helpers';

const PermissionPage = () => {
  const [inputData, { clearInputData, setInput }] = useInputData();
  const [status, { clearStatus, setLoadingStatus }] = useSetStatus();

  const [
    { isRevokePermit, isCreatePermit },
    { setRevokePermit, setCreatePermit },
  ] = useHandlePermitType();

  useManageRouterQuery({ setCreatePermit, setRevokePermit });

  const { setPermissionSig, permissionSig } = useSecretContext();

  const handleRevokePermit = async () => {
    if (inputData) {
      setLoadingStatus();
      const permitRevokeRes = await handlePermissionRevoke({
        permissionName: inputData,
      });
      if (permitRevokeRes) {
        clearStatus();
        clearInputData();
      }
    }
  };

  const handleCreatePermit = async () => {
    if (inputData) {
      setLoadingStatus();
      const inputDataWithoutSpaces = replace(/ /g, '_', inputData.trim());
      const permitCreateRes = await generatePermission({
        permissionName: inputDataWithoutSpaces,
      });
      clearStatus();
      if (permitCreateRes?.signature) {
        setPermissionSig({
          name: inputData,
          signature: permitCreateRes.signature,
        });
      }
    }
  };

  return (
    <>
      <BgImage />
      {status ? (
        <LoadingContainer
          text={isRevokePermit ? 'Revoking Permit Query' : 'Creating a Permit'}
        />
      ) : (
        <MainContainer
          isRevokePermit={isRevokePermit}
          isCreatePermit={isCreatePermit}
          setInput={setInput}
          inputData={inputData}
          handleRevokePermit={handleRevokePermit}
          handleCreatePermit={handleCreatePermit}
        />
      )}
      <PermitModal
        permissionSig={permissionSig}
        setPermissionSig={setPermissionSig}
        inputData={inputData}
        clearInputData={clearInputData}
      />
    </>
  );
};

export default PermissionPage;
