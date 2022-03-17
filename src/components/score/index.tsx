import { useEffect, useMemo, useState } from 'react';

import Image from 'next/image';

import ScoreMainImg from '@scrtsybil/public/images/score-main.svg';
import ScoreNeedleTip from '@scrtsybil/public/images/score-needle-tip.svg';

const ScoreSpeedometer = ({ score }: { score: number }) => {
  const [showScore, setShowScore] = useState<boolean>(false);
  const [randomNumber, setRandomNumber] = useState<string | null>('300');
  const rotationCalculator = (scr: number) => {
    if (scr < 550) {
      // for ever 50 after 300 percent, the value is +10 degrees
      const multiplesOf50 = (scr - 300) / 50;
      const result = -90 + multiplesOf50 * 10;
      return result;
    }

    if (scr === 605) {
      return 0;
    }

    if (scr > 550) {
      const difference = scr - 605;

      const result = 0.29 * difference;
      return result;
    }

    return -90;
  };

  useEffect(() => {
    const randomNumb = setInterval(() => {
      setRandomNumber((Math.random() * 600 + 300).toFixed(0));
    }, 140);

    return () => clearInterval(randomNumb);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowScore(true);
    }, 3800);
  }, []);

  return (
    <div className="flex w-full justify-center">
      <div className="inline-block relative z-50">
        {/* WEB */}
        <div className="hidden sm:block" style={{ width: '575px' }}>
          <Image src={ScoreMainImg} alt="score-top" />
        </div>

        <div
          style={{
            transitionDuration: '2s',
            transform: showScore
              ? `rotate(${rotationCalculator(score)}deg)`
              : `rotate(0deg)`,
            transformOrigin: 'bottom',
            visibility: showScore ? 'visible' : 'hidden',
          }}
          className={`z-50 hidden sm:flex absolute  center-absolute duration-500`}
        >
          <Image height={150} src={ScoreNeedleTip} alt="score-top" />
        </div>

        <div
          style={{
            visibility: !showScore ? 'visible' : 'hidden',
          }}
          className={`z-50 hidden sm:flex absolute  center-absolute needle-move`}
        >
          <Image height={150} src={ScoreNeedleTip} alt="score-top" />
        </div>

        <div
          style={{ left: '15.95rem', top: '14.5rem' }}
          className="hidden sm:flex bg-white w-16 h-16 rounded-full z-50 absolute  justify-center items-center"
        >
          <div className="bg-black w-3 h-3 rounded-full z-50" />
        </div>
        <div className="absolute justify-center items-center w-full z-50  flex">
          <div
            // style={{ left: '13.5rem', top: '20.5rem', fontSize: '4rem' }}
            className="text-5xl sm:text-6xl  font-bold tracking-widest z-40 mt-56 sm:-mt-44"
          >
            {showScore ? score : randomNumber}
          </div>
        </div>

        {/* MOBILE */}
        <div className="block sm:hidden" style={{ width: '375px' }}>
          <Image src={ScoreMainImg} alt="score-top" />
        </div>

        <div
          style={{
            transitionDuration: '2s',
            transform: showScore
              ? `rotate(${rotationCalculator(score)}deg)`
              : `rotate(0deg)`,
            transformOrigin: 'bottom',
            visibility: showScore ? 'visible' : 'hidden',
          }}
          className={`z-50 flex sm:hidden absolute  center-absolute duration-500`}
        >
          <Image height={95} src={ScoreNeedleTip} alt="score-top" />
        </div>
        <div
          style={{
            visibility: !showScore ? 'visible' : 'hidden',
          }}
          className="z-50 flex sm:hidden absolute  center-absolute needle-move "
        >
          <Image height={95} src={ScoreNeedleTip} alt="score-top" />
        </div>
        <div
          style={{ left: '171px', top: '150px' }}
          className="sm:hidden flex bg-white w-9 h-9 rounded-full z-50 absolute  justify-center items-center"
        >
          <div className="bg-black w-2 h-2 rounded-full z-50" />
        </div>
        {/* END */}
      </div>
    </div>
  );
};

export default ScoreSpeedometer;
