import { IChainActivity } from '@scrtsybil/src/context';
import { IScoreQueryResponse } from '@scrtsybil/src/types/contract';

import Button, { BUTTON_STYLES } from '../Button';
import ScoreSpeedometer from '../score';

export default function MainContainer({
  queryResponse,
  chainActivity,
  setShowScoreDescription,
}: {
  queryResponse: IScoreQueryResponse | undefined;
  chainActivity: IChainActivity;
  setShowScoreDescription: (showScoreDescription: boolean) => void;
}) {
  return (
    <>
      <div className="w-full text-center">
        <div className=" flex flex-col items-center   justify-center w-full">
          <ScoreSpeedometer
            showScore
            score={
              chainActivity?.scoreAmount || (queryResponse?.score as number)
            }
          />
          <div
            className={`px-8 flex -mt-20 justify-center rounded-md z-50 duration-500`}
          >
            <Button
              onClick={() => setShowScoreDescription(true)}
              style={BUTTON_STYLES.LINK}
              text="Explain my score"
              classes={{ button: 'text-xs text-white hover:text-blue' }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
