import { useState } from 'react';

import router from 'next/router';

import BgImage from '@scrtsybil/src/components/BgImage';
import Button, { BUTTON_STYLES } from '@scrtsybil/src/components/Button';
import ScoreSpeedometer from '@scrtsybil/src/components/score';
import { BORDER_GRADIENT_STYLE } from '@scrtsybil/src/constants';

const ApplicantScorePage = () => {
  const [selection, setSelection] = useState<
    null | 'generate' | 'query' | 'revoke'
  >(null);
  return (
    <div className="px-14  -mt-20 sm:mt-20">
      <div className="w-full text-center">
        <div className=" flex flex-col items-center space-y-5  justify-center w-full">
          <div className="z-50 opacity-100 px-0 pb-10 md:p-10">
            <h2 className="z-50 font-semibold text-2xl sm:text-3xl md:text-3xl lg:text-4xl p-0">
              Your SCRTSibyl Score
            </h2>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center">
        <ScoreSpeedometer score={400} />
      </div>
      <BgImage />
    </div>
  );
};

export default ApplicantScorePage;
