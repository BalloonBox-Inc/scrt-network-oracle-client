import { useState } from 'react';

import router from 'next/router';

import BgImage from '@scrtsybil/src/components/BgImage';
import Button, { BUTTON_STYLES } from '@scrtsybil/src/components/Button';
import { BORDER_GRADIENT_STYLE } from '@scrtsybil/src/constants';

const ApplicantServicesPage = () => {
  const [selection, setSelection] = useState<
    null | 'generate' | 'query' | 'permit?type=revoke' | 'permit'
  >(null);
  return (
    <div className="px-14 py-20 ">
      <div className="w-full text-center">
        <div className=" flex flex-col items-center space-y-5  justify-center w-full">
          <div className="z-50 opacity-100 px-0 sm:p-10">
            <h2 className="z-50 font-semibold text-2xl sm:text-3xl md:text-3xl lg:text-4xl p-0">
              Choose a Service
            </h2>
            <p className="z-50 font-thin text-md sm:text-lg md:text-xl lg:text-2xl p-0">
              User Type: Applicant
            </p>
          </div>
          <div
            className="flex z-50 justify-center w-80  sm:w-115  rounded-md p-1 "
            style={{
              background:
                selection === 'generate'
                  ? BORDER_GRADIENT_STYLE
                  : 'transparent',
            }}
          >
            <div
              onClick={() => setSelection('generate')}
              className={`bg-gray-900  cursor-pointer w-full  rounded-md`}
            >
              <div className="text-center">
                <p className="text-base p-0 m-0 py-4">Generate a Score</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-5 mt-8 justify-center w-full">
          <div
            className="flex z-50 justify-center w-80  sm:w-115  rounded-md p-1 "
            style={{
              background:
                selection === 'query' ? BORDER_GRADIENT_STYLE : 'transparent',
            }}
          >
            <div
              onClick={() => setSelection('query')}
              className={`bg-gray-900 cursor-pointer rounded-md w-full`}
            >
              <div className="text-center">
                <p className="text-base p-0 m-0 py-4">
                  Query a previously generated score
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-5 mt-8 justify-center w-full">
          <div
            className="flex z-50 justify-center w-80  sm:w-115  rounded-md p-1"
            style={{
              background:
                selection === 'permit' ? BORDER_GRADIENT_STYLE : 'transparent',
            }}
          >
            <div
              onClick={() => setSelection('permit')}
              className={`bg-gray-900 cursor-pointer w-full rounded-md`}
            >
              <div className="text-center">
                <p className="text-base p-0 m-0 py-4">Create a permission</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-5 mt-8 justify-center w-full">
          <div
            className="flex z-50 justify-center w-80  sm:w-115  rounded-md p-1"
            style={{
              background:
                selection === 'permit?type=revoke'
                  ? BORDER_GRADIENT_STYLE
                  : 'transparent',
            }}
          >
            <div
              onClick={() => setSelection('permit?type=revoke')}
              className={`bg-gray-900 cursor-pointer w-full rounded-md`}
            >
              <div className="text-center">
                <p className="text-base p-0 m-0 py-4">Revoke a permission</p>
              </div>
            </div>
          </div>
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
                router.push(`/applicant/${selection}`);
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
};

export default ApplicantServicesPage;
