import { useEffect, useState } from 'react';

import BgImage from '@scrtsybil/src/components/BgImage';
import ScoreSpeedometer from '@scrtsybil/src/components/score';
import { useSecretContext } from '@scrtsybil/src/context';

const ApplicantScorePage = () => {
  const {
    setPlaidPublicToken,
    plaidPublicToken,
    setCoinbaseToken,
    scoreResponse,
    setScoreResponse,
  } = useSecretContext();
  const [showScore, setShowScore] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setShowScore(true);
    }, 3800);
  }, []);

  return (
    <>
      <BgImage />

      <div className="px-3 sm:px-10 z-50 mt-20 mb-20 sm:mt-20 ">
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
          <ScoreSpeedometer showScore={showScore} score={400} />
        </div>

        <div
          className={`px-8 flex py-5 justify-center rounded-md z-50 duration-500  ${
            !showScore ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="p-8 rounded-lg z-50  max-w-xl bg-gray-900 w-full ">
            <h3 className="text-lg uppercase font-semibold mb-4">Summary</h3>
            <p className="sm:text-base leading-7">{scoreResponse?.message}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicantScorePage;
