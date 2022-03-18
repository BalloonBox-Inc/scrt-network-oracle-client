import { useEffect, useState } from 'react';

import { Input, Modal } from 'antd';
import { useRouter } from 'next/router';
import { ClipLoader } from 'react-spinners';

import BgImage from '@scrtsybil/src/components/BgImage';
import Button, { BUTTON_STYLES } from '@scrtsybil/src/components/Button';
import ScoreSpeedometer from '@scrtsybil/src/components/score';
import ScoreSubmitted from '@scrtsybil/src/components/score/scoreSubmitted';
import { storageHelper, useSecretContext } from '@scrtsybil/src/context';
import {
  handleGeneratePermissionQuery,
  handleSetScore,
} from '@scrtsybil/src/keplr/helpers';

const ApplicantScorePage = () => {
  const {
    scoreResponse,
    setChainActivity,
    chainActivity,
    setPermissionSig,
    permissionSig,
  } = useSecretContext();
  const [showScore, setShowScore] = useState<boolean>(false);
  const [permitQueryModal, setPermitQueryModal] = useState<boolean>(false);
  const [status, setStatus] = useState<
    string | 'loading' | 'error' | 'success' | undefined
  >(undefined);
  const [permissionLoading, setPermissionLoading] = useState<boolean>(false);
  const [showScoreDescription, setShowScoreDescription] =
    useState<boolean>(false);
  const [permitName, setPermitName] = useState<string | undefined>(undefined);

  const isSuccess = status === 'success';
  const isLoading = status === 'loading';

  const submitQueryAttempt = async () => {
    setPermissionLoading(true);
    if (permitName) {
      const permissionCreate = await handleGeneratePermissionQuery({
        permissionName: permitName,
        setPermissionSig,
      });
      if (permissionCreate?.signature) {
        setChainActivity({
          ...chainActivity,
          queryPermit: chainActivity?.queryPermit
            ? [...chainActivity.queryPermit, permitName]
            : [permitName],
        });
      }
    }
  };

  useEffect(() => {
    isSuccess &&
      setChainActivity({
        ...chainActivity,
        scoreSubmitted: true,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, setChainActivity]);

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
      {showScore && !isSuccess && (
        <>
          <div className="px-8 flex -mt-16 justify-center rounded-md z-50 duration-500">
            <Button
              onClick={() => setShowScoreDescription(true)}
              style={BUTTON_STYLES.OUTLINE}
              text="Explain my score"
              classes={{ button: 'text-xs' }}
            />
          </div>
          <div className="z-50 flex justify-center mt-8">
            <Button
              onClick={() => {
                chainActivity?.scoreSubmitted
                  ? setPermitQueryModal(true)
                  : handleSetScore({ setStatus, scoreResponse });
              }}
              style={BUTTON_STYLES.DEFAULT}
              text={
                chainActivity?.scoreSubmitted
                  ? 'Generate a Query Permit'
                  : 'Save To Blockchain'
              }
            />
          </div>
        </>
      )}
      <Modal
        visible={showScoreDescription}
        footer={null}
        onCancel={() => setShowScoreDescription(false)}
        bodyStyle={{ background: '#242630' }}
      >
        <div
          className={`px-8 flex py-5 justify-center rounded-md z-50 duration-500  ${
            !showScore ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="p-8 rounded-lg z-50  max-w-xl w-full ">
            <h3 className="text-lg uppercase font-semibold mb-4">Summary</h3>
            <p className="sm:text-base leading-7">{scoreResponse?.message}</p>
          </div>
        </div>
      </Modal>
      <Modal
        visible={permitQueryModal}
        footer={null}
        onCancel={() => {
          setPermitName(undefined);
          setPermissionLoading(false);
          setPermitQueryModal(false);
        }}
        style={{ top: '30%' }}
        bodyStyle={{ background: '#242630' }}
      >
        <div className={`px-8 flex py-5 justify-center rounded-md z-50`}>
          {permissionSig ? (
            <div className="p-8 px-2 rounded-lg z-50  max-w-xl w-full ">
              <div className="flex items-center mb-6">
                <h3 className="text-lg mr-2 uppercase font-semibold ">
                  Query Permit{' '}
                </h3>
                <div className="bg-gray-500 w-4 h-4 rounded-full p-2 flex justify-center items-center cursor-pointer text-black">
                  i
                </div>
              </div>
              <p className="mb-3 font-semibold">
                Permit Name: <span className="font-thin">{permitName}</span>
              </p>
              <p className="mb-3 font-semibold">
                Public Key:{' '}
                <span className="font-thin">{permissionSig.pub_key.value}</span>
              </p>
              <p className="mb-3 font-semibold">
                Signature:{' '}
                <span className="font-thin">{permissionSig.signature}</span>
              </p>
              <div className="flex">
                <Button
                  text="I have saved these keys"
                  onClick={() => {
                    setPermitName(undefined);
                    setPermissionLoading(false);
                    setPermitQueryModal(false);
                    setPermissionSig(undefined);
                  }}
                />
              </div>
            </div>
          ) : (
            <>
              <Input
                onChange={(e) => setPermitName(e.target.value)}
                type={'text'}
                placeholder="name of permit"
                className="mr-3"
                value={permitName}
                disabled={permissionLoading}
              />
              <Button
                onClick={() => submitQueryAttempt()}
                style={BUTTON_STYLES.OUTLINE}
                text="Submit"
                classes={{ button: 'text-xs' }}
                isLoading={permissionLoading}
                isDisabled={!permitName}
              />
            </>
          )}
        </div>
      </Modal>
    </div>
  );

  const loadingContainer = (
    <div className="w-full flex-col  flex justify-center items-center z-50">
      <ClipLoader
        speedMultiplier={0.75}
        size={120}
        color={'rgba(85,42,170, 10)'}
      />

      <p className="mt-5 text-sm">Submitting score to the blockchain.</p>
    </div>
  );

  return (
    <>
      <BgImage />
      {isLoading ? loadingContainer : mainScoreContainer}
    </>
  );
};

export default ApplicantScorePage;
