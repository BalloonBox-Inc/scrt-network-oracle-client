import router from 'next/router';

import BgImage from '../BgImage';
import Button, { BUTTON_STYLES } from '../Button';
import ServiceSelector from '../ServiceSelector';

export default function MainContainer({
  selection,
  setSelectionPermit,
  setSelectionViewingKey,
  setShowModal,
}: any) {
  return (
    <div className="px-14 py-10">
      <div className="w-full text-center">
        <div className=" flex flex-col items-center space-y-5  justify-center w-full">
          <div className="z-50 opacity-100 px-0 sm:p-10">
            <h2 className="z-50 font-semibold text-2xl sm:text-3xl md:text-3xl lg:text-4xl p-0">
              Query a User&apos;s Score
            </h2>
            <p className="z-50 font-thin text-md sm:text-lg md:text-xl lg:text-2xl p-0">
              User Type: Provider
            </p>
          </div>
          <ServiceSelector
            selected={selection === 'permit'}
            onClick={setSelectionPermit}
            text="I have a Query Permit"
            testId="permitButton"
          />
          <ServiceSelector
            selected={selection === 'viewingKey'}
            onClick={setSelectionViewingKey}
            text="I have a Viewing Key"
            testId="viewingKeyButton"
          />
        </div>
      </div>
      <div className=" sm:px-10 flex justify-between">
        <div className="pt-16 z-30 flex justify-start">
          <div>
            <Button
              onClick={() => {
                router.push(`/start`);
              }}
              text="Back"
              style={BUTTON_STYLES.OUTLINE}
            />
          </div>
        </div>
        <div className="pt-16 z-30 flex justify-end">
          <div>
            <Button
              onClick={() => {
                selection && setShowModal();
              }}
              isDisabled={!selection}
              text="Continue"
              style={BUTTON_STYLES.DEFAULT}
            />
          </div>
        </div>
      </div>

      <BgImage />
    </div>
  );
}
