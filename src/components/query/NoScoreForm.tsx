import { StdSignature } from 'secretjs/types/types';

import { IQueryInputs } from '@scrtsybil/src/types/types';

import Button, { BUTTON_STYLES } from '../Button';
import Uploader from '../Uploader';

export default function NoScoreForm({
  permitData,
  setPermitData,
  permissionSig,
}: {
  permitData: any;
  setPermitData: any;
  permissionSig: { name: string; signature: StdSignature } | null;
}) {
  const handleUploadAutoFiller = (uploadedTextFile: IQueryInputs | null) => {
    if (!uploadedTextFile) {
      setPermitData({
        permitName: '',
        publicAddress: '',
        permitSignature: '',
      });
      return;
    }
    setPermitData({
      permitName: uploadedTextFile.permit_name,
      publicAddress: uploadedTextFile.public_key,
      permitSignature: uploadedTextFile.signature,
    });
  };

  return (
    <div className="w-full text-center z-50 sm:px-10 lg:px-40 flex flex-col">
      <h2 className="text-3xl">Query Your Score</h2>
      <form className="flex flex-col items-start mt-8 w-full">
        <label className="text-left mb-1">Permit Name</label>

        <input
          onChange={(e) =>
            setPermitData({ ...permitData, permitName: e.target.value })
          }
          className="focus-visible:outline-blue-600 z-50 focus-visible:outline-none  font-mono text-blue-600 bg-input-bg w-full py-3 px-3 rounded-md mb-4"
          type={'text'}
          value={permitData.permitName}
        />

        <label className="text-left mb-1">Public Address</label>

        <input
          onChange={(e) =>
            setPermitData({ ...permitData, publicAddress: e.target.value })
          }
          className="focus-visible:outline-blue-600 z-50 focus-visible:outline-none  font-mono text-blue-600 bg-input-bg w-full py-3 px-3 rounded-md mb-4"
          type={'text'}
          value={permitData.publicAddress}
        />
        <label className="text-left mb-1">Signature</label>
        <input
          onChange={(e) =>
            setPermitData({ ...permitData, permitSignature: e.target.value })
          }
          className="focus-visible:outline-blue-600 z-50 focus-visible:outline-none  font-mono text-blue-600 bg-input-bg w-full py-3 px-3 rounded-md mb-4"
          type={'text'}
          value={permitData.permitSignature}
        />
      </form>
      <div>
        <p className="mb-2">or</p>
        <Uploader
          handleUploadAutoFiller={(e: any) => handleUploadAutoFiller(e)}
        />
      </div>
      <div className="flex items-center">
        {permissionSig?.name && (
          <Button
            text={'Autofill form?'}
            classes={{ container: 'mr-3 reappear', button: 'text-blue-600' }}
            style={BUTTON_STYLES.LINK}
            onClick={() =>
              setPermitData({
                permitName: permissionSig.name,
                permitSignature: permissionSig.signature.signature,
                publicAddress: permissionSig.signature.pub_key.value,
              })
            }
          />
        )}
      </div>
    </div>
  );
}
