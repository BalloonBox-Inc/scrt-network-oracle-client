import { useEffect, useState } from 'react';

import { Modal } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';

import BgImage from '@scrtsybil/src/components/BgImage';
import Button, { BUTTON_STYLES } from '@scrtsybil/src/components/Button';
import { LoadingContainer } from '@scrtsybil/src/components/LoadingContainer';
import ScoreSpeedometer from '@scrtsybil/src/components/score';
import { useSetStatus } from '@scrtsybil/src/components/score/hooks';
import WarningModal from '@scrtsybil/src/components/score/WarningModal';
import TweetBtn from '@scrtsybil/src/components/TweetBtn';
import { storageHelper, useSecretContext } from '@scrtsybil/src/context';
import { handleSetScore } from '@scrtsybil/src/keplr/helpers';

const ApplicantScorePage = () => {
  const [
    { statusLoading, statusSuccess },
    { setLoadingStatus, setErrorStatus, setSuccessStatus },
  ] = useSetStatus();

  const { chainActivity, scoreResponse, loading, handleSetChainActivity } =
    useSecretContext();

  const router = useRouter();

  const [showScore, setShowScore] = useState<boolean>(false);
  const [modalWarn, setModalWarn] = useState<boolean>(false);
  const [recentlySaved, setRecentlySaved] = useState<boolean>(false);

  const [showScoreDescription, setShowScoreDescription] =
    useState<boolean>(false);

  useEffect(() => {
    if (!scoreResponse && !loading) {
      router.push('/applicant/generate');
    }
  }, [loading, scoreResponse, router]);

  useEffect(() => {
    // Check from local storage is score was submitted
    if (chainActivity?.scoreSubmitted) {
      setSuccessStatus();
    }
  }, [chainActivity, setSuccessStatus]);

  useEffect(() => {
    const scoreAnimated = storageHelper.get('scoreAnimationViewed');

    setTimeout(
      () => {
        setShowScore(true);
        storageHelper.persist('scoreAnimationViewed', true);
      },
      scoreAnimated ? 0 : 3800
    );
  }, []);

  const handleSaveToBlockchain = async (bypassWarning = false) => {
    if (bypassWarning) {
      setModalWarn(false);
    }
    if (chainActivity?.scoreSubmitted && scoreResponse && !bypassWarning) {
      setModalWarn(true);
    } else {
      const setScoreRes = await handleSetScore({
        setLoadingStatus,
        setErrorStatus,
        scoreResponse,
      });

      if (setScoreRes?.status === 'success') {
        setRecentlySaved(true);
        handleSetChainActivity({
          scoreAmount: scoreResponse?.score,
          scoreSubmitted: true,
          dataProvider: scoreResponse?.endpoint.includes('plaid')
            ? 'plaid'
            : 'coinbase',
        });
      }
    }
  };

  const mainScoreContainer = (
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
      {scoreResponse?.score && (
        <div className="flex w-full justify-center">
          <ScoreSpeedometer
            showScore={showScore}
            score={Math.round(scoreResponse?.score)}
          />
        </div>
      )}

      <div
        className={`px-8 flex -mt-20 justify-center rounded-md z-50 duration-500 ${
          showScore && !statusSuccess ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Button
          onClick={() => setShowScoreDescription(true)}
          style={BUTTON_STYLES.LINK}
          text="Explain my score"
          classes={{ button: 'text-xs text-white hover:text-blue' }}
        />
      </div>
      {statusSuccess && (
        <p className="text-center mt-2 text-lg">
          This score was saved to the blockchain.
        </p>
      )}

      <div
        className={`z-50 flex flex-col items-center ${
          showScore ? 'opacity-100' : 'opacity-0'
        } justify-center mt-8 duration-500`}
      >
        {!recentlySaved && (
          <Button
            onClick={() => handleSaveToBlockchain()}
            style={BUTTON_STYLES.DEFAULT}
            text={'Save To Blockchain'}
          />
        )}
        <div className="mt-1 text-xs">
          <Button
            onClick={() => router.push('/applicant/permit?type=create')}
            style={!recentlySaved ? BUTTON_STYLES.LINK : BUTTON_STYLES.DEFAULT}
            text={'Create a query permit'}
          />
        </div>
        <TweetBtn message="I just calculated my credit score on a blockchain-powered DApp on the SCRT network! Check it out at secretsibyl.com" />
      </div>

      <Modal
        visible={showScoreDescription}
        footer={null}
        onCancel={() => setShowScoreDescription(false)}
        bodyStyle={{ background: '#242630' }}
        style={{ top: '20%' }}
      >
        <div
          className={`px-8 flex py-5 justify-center rounded-md z-50 duration-500 font-sans  ${
            !showScore ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="p-8 rounded-lg z-50  max-w-xl w-full ">
            <h3 className="text-lg uppercase font-semibold mb-4">Summary</h3>
            <p className="sm:text-base leading-7 mb-3">
              {scoreResponse?.message || scoreResponse?.message}
            </p>
            <Link href="/learn"> Learn more</Link>
          </div>
        </div>
      </Modal>

      {modalWarn && (
        <WarningModal
          modalWarn={modalWarn}
          setModalWarn={setModalWarn}
          chainActivity={chainActivity}
          scoreResponse={scoreResponse}
          handleSetChainActivity={handleSetChainActivity}
          handleSaveToBlockchain={handleSaveToBlockchain}
        />
      )}
    </div>
  );

  return (
    <>
      <BgImage />
      {statusLoading ? (
        <LoadingContainer text="Submitting score to the blockchain." />
      ) : (
        mainScoreContainer
      )}
    </>
  );
};

export default ApplicantScorePage;
