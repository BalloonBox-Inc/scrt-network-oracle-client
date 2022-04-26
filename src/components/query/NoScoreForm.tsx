import { StdSignature } from 'secretjs/types/types';

import Button, { BUTTON_STYLES } from '../Button';

export default function NoScoreForm({
  permitData,
  setPermitData,
  permissionSig,
}: {
  permitData: any;
  setPermitData: any;
  permissionSig: { name: string; signature: StdSignature } | null;
}) {
  const inputDataInput = (value: string, onChange?: (e?: any) => void) => (
    <input
      onChange={onChange}
      className="focus-visible:outline-blue-600 z-50 focus-visible:outline-none  font-mono text-blue-600 bg-input-bg w-full py-3 px-3 rounded-md mb-4"
      type={'text'}
      value={value}
    />
  );
  return (
    <div className="w-full text-center z-50 sm:px-10 lg:px-40 flex flex-col ">
      <form className="flex flex-col items-start mt-8  w-full">
        <label className="text-left mb-1">Permit Name</label>
        {inputDataInput(permitData.permitName, (e) =>
          setPermitData({
            ...permitData,
            permitName: e.target.value,
          })
        )}
        <label className="text-left mb-1">Public Address</label>
        {inputDataInput(permitData.publicAddress, (e) =>
          setPermitData({
            ...permitData,
            publicAddress: e.target.value,
          })
        )}
        <label className="text-left mb-1">Signature</label>
        {inputDataInput(permitData.permitSignature, (e) =>
          setPermitData({
            ...permitData,
            permitSignature: e.target.value,
          })
        )}
      </form>
      <div className="flex items-center mt-8">
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
