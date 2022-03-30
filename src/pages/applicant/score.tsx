import { useEffect, useState } from 'react';

import { Input, Modal } from 'antd';
import { useRouter } from 'next/router';

import BgImage from '@scrtsybil/src/components/BgImage';
import Button, { BUTTON_STYLES } from '@scrtsybil/src/components/Button';
import { LoadingContainer } from '@scrtsybil/src/components/LoadingContainer';
import ScoreSpeedometer from '@scrtsybil/src/components/score';
import { storageHelper, useSecretContext } from '@scrtsybil/src/context';
import { handleSetScore } from '@scrtsybil/src/keplr/helpers';

const ApplicantScorePage = () => {
  const {
    chainActivity,
    setPermissionSig,
    permissionSig,
    scoreResponse,
    loading,
    handleSetChainActivity,
  } = useSecretContext();

  const router = useRouter();

  useEffect(() => {
    if (!scoreResponse && !loading) {
      router.push('/applicant/generate');
    }
  }, [loading, scoreResponse, router]);

  const [showScore, setShowScore] = useState<boolean>(false);
  const [permitQueryModal, setPermitQueryModal] = useState<boolean>(false);
  const [modalWarn, setModalWarn] = useState<boolean>(false);
  const [status, setStatus] = useState<
    string | 'loading' | 'error' | 'success' | undefined
  >(undefined);
  const [permissionLoading, setPermissionLoading] = useState<boolean>(false);
  const [showScoreDescription, setShowScoreDescription] =
    useState<boolean>(false);
  const [permitName, setPermitName] = useState<string | undefined>(undefined);

  const isSuccess = status === 'success';
  const isLoading = status === 'loading';

  const handleSaveToBlockchain = async () => {
    if (chainActivity?.scoreSubmitted && scoreResponse) {
      setModalWarn(true);
    } else {
      const setScoreRes = await handleSetScore({
        setStatus,
        scoreResponse,
      });

      if (setScoreRes?.status === 'success') {
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

  const submitQueryAttempt = async () => {
    setPermissionLoading(true);
  };

  useEffect(() => {
    // Check from local storage is score was submitted
    if (chainActivity?.scoreSubmitted) {
      setStatus('success');
    }
  }, [chainActivity]);

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

  const warnModal = (
    <Modal
      visible={modalWarn}
      footer={null}
      onCancel={() => {
        setModalWarn(false);
      }}
      centered
      bodyStyle={{ background: '#242630' }}
    >
      <div className={`px-8 flex py-5 justify-center rounded-md z-50`}>
        <div className="p-8 px-2 rounded-lg z-50  max-w-xl w-full ">
          <div className="flex items-center mb-6">
            <h3 className="text-lg mr-2 uppercase font-semibold ">Warning</h3>
          </div>

          {chainActivity?.scoreAmount === scoreResponse?.score ? (
            <div>
              You have already submitted a score of {scoreResponse?.score},
              submit anyway?
            </div>
          ) : (
            <div>
              You have already submitted your score of{' '}
              {chainActivity?.scoreAmount}. Are you sure you want to submit a
              new score of {scoreResponse?.score}?
            </div>
          )}

          <div className="flex items-center mt-12 space-x-5">
            <Button
              text="Submit to blockchain"
              classes={{ button: 'text-xs' }}
              onClick={() => {
                handleSetChainActivity(null);
                handleSaveToBlockchain();
              }}
            />
            <Button
              text="Create a Permission"
              style={BUTTON_STYLES.OUTLINE}
              classes={{ button: 'text-xs' }}
              onClick={() => {
                router.push('/applicant/permit');
              }}
            />
          </div>
          <div className=" w-max mt-6">
            <Button
              text="Cancel"
              style={BUTTON_STYLES.LINK}
              classes={{ button: 'text-xs text-left hover:text-blue' }}
              onClick={() => {
                setModalWarn(false);
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );

  const permitModal = (
    <Modal
      visible={permitQueryModal}
      footer={null}
      onCancel={() => {
        setPermitName(undefined);
        setPermissionLoading(false);
        setPermitQueryModal(false);
      }}
      centered
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
              <span className="font-thin">
                {permissionSig.signature.pub_key.value}
              </span>
            </p>
            <p className="mb-3 font-semibold">
              Signature:{' '}
              <span className="font-thin">
                {permissionSig.signature.signature}
              </span>
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
  );

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
          showScore && !isSuccess ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Button
          onClick={() => setShowScoreDescription(true)}
          style={BUTTON_STYLES.LINK}
          text="Explain my score"
          classes={{ button: 'text-xs text-white hover:text-blue' }}
        />
      </div>
      {isSuccess && (
        <p className="text-center -my-4">
          This score was saved to the blockchain.
        </p>
      )}
      <div
        className={`z-50 flex  ${
          showScore ? 'opacity-100' : 'opacity-0'
        } justify-center mt-8 duration-500`}
      >
        <Button
          onClick={() =>
            !isSuccess
              ? handleSaveToBlockchain()
              : router.push('/applicant/permit')
          }
          style={BUTTON_STYLES.DEFAULT}
          text={!isSuccess ? 'Save To Blockchain' : 'Create a permission'}
        />
      </div>

      <Modal
        visible={showScoreDescription}
        footer={null}
        onCancel={() => setShowScoreDescription(false)}
        bodyStyle={{ background: '#242630' }}
        style={{ top: '20%' }}
      >
        <div
          className={`px-8 flex py-5 justify-center rounded-md z-50 duration-500  ${
            !showScore ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="p-8 rounded-lg z-50  max-w-xl w-full ">
            <h3 className="text-lg uppercase font-semibold mb-4">Summary</h3>
            <p className="sm:text-base leading-7">
              {scoreResponse?.message || scoreResponse?.message}
            </p>
          </div>
        </div>
      </Modal>
      {permitModal}
      {warnModal}
    </div>
  );

  return (
    <>
      <BgImage />
      {isLoading ? (
        <LoadingContainer text="Submitting score to the blockchain." />
      ) : (
        mainScoreContainer
      )}
    </>
  );
};

export default ApplicantScorePage;
