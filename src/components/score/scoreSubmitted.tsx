import { useState } from 'react';

import { useRouter } from 'next/router';

import BgImage from '@scrtsybil/src/components/BgImage';
import Button, { BUTTON_STYLES } from '@scrtsybil/src/components/Button';
import { BORDER_GRADIENT_STYLE } from '@scrtsybil/src/constants';

const ScoreSubmitted = () => {
  const router = useRouter();
  const [selection, setSelection] = useState<
    'link' | 'viewingKey' | 'permitQuery' | undefined
  >(undefined);
  return (
    <>
      <BgImage />
      <div className="px-3 sm:px-10 z-50 mt-20 mb-20 ">
        <div className="z-50 opacity-100 px-0 pb-10 md:p-10 flex justify-center">
          <h2 className="z-50 font-semibold text-2xl sm:text-3xl md:text-3xl lg:text-4xl p-0 text-center">
            Score Saved to SCRT Network!
          </h2>
        </div>
        <div className=" flex flex-col items-center space-y-5  justify-center w-full">
          <div
            className="flex z-50 justify-center w-80  sm:w-115  rounded-md p-1 "
            style={{
              background:
                selection === 'link' ? BORDER_GRADIENT_STYLE : 'transparent',
            }}
          >
            <div
              onClick={() => setSelection('link')}
              className={`bg-gray-900  cursor-pointer w-full  rounded-md`}
            >
              <div className="text-center">
                <p className="text-base p-0 m-0 py-4">
                  Generate a shareable link
                </p>
              </div>
            </div>
          </div>
          <div
            className="flex z-50 justify-center w-80  sm:w-115  rounded-md p-1 "
            style={{
              background:
                selection === 'permitQuery'
                  ? BORDER_GRADIENT_STYLE
                  : 'transparent',
            }}
          >
            <div
              onClick={() => setSelection('permitQuery')}
              className={`bg-gray-900  cursor-pointer w-full  rounded-md`}
            >
              <div className="text-center">
                <p className="text-base p-0 m-0 py-4">
                  Generate a query permit
                </p>
              </div>
            </div>
          </div>
          <div
            className="flex z-50 justify-center w-80  sm:w-115  rounded-md p-1 "
            style={{
              background:
                selection === 'viewingKey'
                  ? BORDER_GRADIENT_STYLE
                  : 'transparent',
            }}
          >
            <div
              onClick={() => setSelection('viewingKey')}
              className={`bg-gray-900  cursor-pointer w-full  rounded-md`}
            >
              <div className="text-center">
                <p className="text-base p-0 m-0 py-4">Generate a viewing key</p>
              </div>
            </div>
          </div>
        </div>

        <div className=" sm:px-10 mt-10 z-50 flex justify-end">
          <div>
            <Button
              onClick={() => {
                router.push(`/applicant/${selection}`);
              }}
              isDisabled={!selection}
              text="Continue"
              style={BUTTON_STYLES.DEFAULT}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ScoreSubmitted;
