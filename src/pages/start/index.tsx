import { useState } from 'react';

import { useRouter } from 'next/router';

import BgImage from '@scrtsybil/src/components/BgImage';
import Button from '@scrtsybil/src/components/Button';

const StartPage = () => {
  const router = useRouter();
  const [userTypeSelection, setUserTypeSelection] = useState<
    'applicant' | 'provider' | null
  >(null);

  return (
    <div className="px-14 py-10 ">
      <div className="w-full text-center pb-50">
        <div className="flex flex-col items-center space-y-5 justify-center w-full">
          <div className="z-50 opacity-100 px-0 sm:p-10">
            <h2 className="z-50 text-xl sm:text-3xl md:text-3xl p-0">
              Select Your User Type
            </h2>
          </div>
          <div
            className="flex z-50 justify-center w-80  sm:w-115  rounded-md p-1 "
            style={{
              background:
                userTypeSelection === 'applicant'
                  ? 'linear-gradient(205deg, rgba(85,42,170,1) 0%, rgba(7,144,192,1) 100%)'
                  : 'transparent',
            }}
          >
            <div
              onClick={() => setUserTypeSelection('applicant')}
              className={`bg-gray-900 border-transparent z-50  cursor-pointer border-2 rounded-md p-5 px-8`}
            >
              <div className="text-left ">
                <h3 className="text-lg sm:text-xl">Applicant</h3>
                <p className="text-xs font-thin">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Fugiat ipsum, voluptate incidunt quos, ullam error voluptates
                  magnam ab.
                </p>
              </div>
            </div>
          </div>
          <div
            className="flex z-50  w-80  sm:w-115 justify-center   rounded-md p-1"
            style={{
              background:
                userTypeSelection === 'provider'
                  ? 'linear-gradient(205deg, rgba(85,42,170,1) 0%, rgba(7,144,192,1) 100%)'
                  : 'transparent',
            }}
          >
            <div
              onClick={() => setUserTypeSelection('provider')}
              className={`bg-gray-900  z-50 cursor-pointer border-2 rounded-md px-8 p-5 border-transparent`}
              style={{ width: 480 }}
            >
              <div className="text-left">
                <h3 className="text-lg sm:text-xl">Service Provider</h3>
                <p className="text-xs font-thin">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Fugiat ipsum, voluptate incidunt quos, ullam error voluptates
                  magnam ab.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-16 z-30 flex justify-end">
        <Button
          onClick={() => {
            router.push(`/${userTypeSelection}`);
          }}
          isDisabled={!userTypeSelection}
          text="Continue"
        />
      </div>
      <BgImage />
    </div>
  );
};

export default StartPage;
