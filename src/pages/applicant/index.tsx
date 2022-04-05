import { useState } from 'react';

import router from 'next/router';

import BgImage from '@scrtsybil/src/components/BgImage';
import Button, { BUTTON_STYLES } from '@scrtsybil/src/components/Button';
import ServiceSelector from '@scrtsybil/src/components/ServiceSelector';

const ApplicantServicesPage = () => {
  const [selection, setSelection] = useState<
    null | 'generate' | 'query' | 'permit?type=revoke' | 'permit' | 'viewingKey'
  >(null);
  return (
    <div className="px-14 py-10">
      <div className="w-full text-center">
        <div className=" flex flex-col items-center space-y-6  justify-center w-full">
          <div className="z-50 opacity-100 px-0 sm:p-10">
            <h2 className="z-50 font-semibold text-2xl sm:text-3xl md:text-3xl lg:text-4xl p-0">
              Choose a Service
            </h2>
            <p className="z-50 font-thin text-md sm:text-lg md:text-xl lg:text-2xl p-0">
              User Type: Applicant
            </p>
          </div>

          <ServiceSelector
            selected={selection === 'generate'}
            onClick={() => setSelection('generate')}
            text="Generate a Score"
          />
          <ServiceSelector
            selected={selection === 'query'}
            onClick={() => setSelection('query')}
            text="Query my score"
          />
          <ServiceSelector
            selected={selection === 'permit'}
            onClick={() => setSelection('permit')}
            text="Create a query permit"
          />
          <ServiceSelector
            selected={selection === 'permit?type=revoke'}
            onClick={() => setSelection('permit?type=revoke')}
            text="Revoke a query permit"
          />
          <ServiceSelector
            selected={selection === 'viewingKey'}
            onClick={() => setSelection('viewingKey')}
            text="Create a Viewing Key"
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
