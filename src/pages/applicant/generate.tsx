import { useEffect, useState } from 'react';

import { notification, Modal } from 'antd';
import { useRouter } from 'next/router';

import BgImage from '@scrtsybil/src/components/BgImage';
import Button, { BUTTON_STYLES } from '@scrtsybil/src/components/Button';
import Coinbase from '@scrtsybil/src/components/Coinbase';
import { LoadingContainer } from '@scrtsybil/src/components/LoadingContainer';
import LaunchLink from '@scrtsybil/src/components/plaid';
import { BORDER_GRADIENT_STYLE } from '@scrtsybil/src/constants';
import { storageHelper, useSecretContext } from '@scrtsybil/src/context';
import { IPlaidTokenCreateResponse } from '@scrtsybil/src/pages/api/plaid';

const GenerateScorePage = () => {
  const [selection, setSelection] = useState<string | undefined>(undefined);
  const [awaitingScoreResponse, setAwaitingScoreResponse] =
    useState<boolean>(false);
  const [startPlaidLink, setStartPlaidLink] = useState<boolean>(false);
  const [startCoinbase, setStartCoinbase] = useState<boolean>(false);
  const [isExistingScore, setIsExistingScore] = useState<
    'loading' | true | false
  >('loading');

  const {
    setPlaidPublicToken,
    plaidPublicToken,
    setScoreResponse,
    chainActivity,
    handleSetChainActivity,
  } = useSecretContext();

  const router = useRouter();
  const queryType = router?.query?.type;
  const queryStatus = router?.query?.status;

  useEffect(() => {
    router?.query?.code && setStartCoinbase(true);
  }, [router?.query]);

  useEffect(() => {
    if (chainActivity?.scoreSubmitted) {
      setIsExistingScore(true);
      !!queryType && router.replace('/applicant/generate');
    } else setIsExistingScore(false);
  }, [chainActivity, queryType, router]);

  const connectionError = (client: 'coinbase' | 'plaid' | string) =>
    notification.error({
      message: `There was an error. Please re-connect to ${client}.`,
    });

  const startOver = () => {
    storageHelper.persist('scoreAnimationViewed', false);
    setStartPlaidLink(false);
    setStartCoinbase(false);
    setAwaitingScoreResponse(false);
    setScoreResponse(null);
    setPlaidPublicToken(null);
    router.replace('/applicant/generate');
  };

  useEffect(() => {
    router?.query?.status === 'loading' && setAwaitingScoreResponse(true);
  }, [router?.query]);

  const handlePlaidConnect = async () => {
    if (plaidPublicToken) {
      setStartPlaidLink(true);
      router.replace('/applicant/generate?type=plaid&status=success');
    } else {
      router.replace('/applicant/generate?type=plaid&status=loading');
      try {
        setAwaitingScoreResponse(true);
        const plaidRes = await fetch('/api/plaid');
        const plaidResJson: IPlaidTokenCreateResponse = await plaidRes.json();
        if (plaidResJson?.link_token) {
          setStartPlaidLink(true);
          setPlaidPublicToken({ publicToken: plaidResJson.link_token });
        }
      } catch (error) {
        connectionError('plaid');
      }
    }
  };

  const scoreResponseModal = (
    <Modal
      footer={null}
      centered
      closable={true}
      onCancel={() => {
        router.push('/applicant/generate');
        setAwaitingScoreResponse(false);
        setStartCoinbase(false);
      }}
      visible={queryStatus === 'success'}
    >
      <div className="h-60 w-full space-y-2 flex justify-center items-center flex-col">
        <h2 className="text-xl font-semibold">Ready to calculate Score</h2>
        <p>with </p>
        <div className="w-full justify-center flex">
          {queryType === 'plaid' ? (
            <img
              width={'40%'}
              alt="plaid_logo"
              src={'../../images/plaidLogo.svg'}
            />
          ) : (
            <img
              width={'40%'}
              alt="coinbase_logo"
              src={'../../images/coinbaseLogo.svg'}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col w-full justify-center items-center">
        <div className=" w-max">
          <Button
            onClick={() => {
              router.push('/applicant/score');
            }}
            text="Continue to score calculation"
            style={BUTTON_STYLES.DEFAULT}
          />
        </div>
        <div className=" w-max mt-3">
          <Button
            onClick={() => startOver()}
            text="start over"
            style={BUTTON_STYLES.LINK}
          />
        </div>
      </div>
    </Modal>
  );

  const existingScoreModal = (
    <Modal footer={null} centered closable={false} visible={!!isExistingScore}>
      <div className="py-6 w-full space-y-2 flex justify-center items-center flex-col">
        <p className="text-base text-center font-semibold">
          You have already submitted a score using {chainActivity?.dataProvider}
          .
        </p>
      </div>
      <div className="flex w-full justify-center items-center space-x-4">
        <div>
          <Button
            onClick={() => {
              router.push('/applicant/score');
            }}
            text="See Score"
            style={BUTTON_STYLES.DEFAULT}
          />
        </div>
        <div>
          <Button
            onClick={() => {
              handleSetChainActivity(null);
              startOver();
            }}
            text="Generate New Score"
            style={BUTTON_STYLES.LINK}
          />
        </div>
      </div>
    </Modal>
  );

  const mainContainer = (
    <>
      <div className="w-full text-center">
        <div className=" flex flex-col items-center space-y-5  justify-center w-full">
          <div className="z-50 opacity-100 px-0 sm:p-10">
            <h2 className="z-50 font-semibold text-2xl sm:text-3xl md:text-3xl lg:text-4xl p-0">
              Choose a Provider
            </h2>
            <p className="z-50 font-thin text-md sm:text-lg md:text-xl lg:text-2xl p-0">
              Select one of the following providers to qualify for a credit
              check.
            </p>
          </div>
          <div
            className="flex z-50 justify-center w-60  sm:w-95  rounded-md p-1 "
            style={{
              background:
                selection === 'coinbase'
                  ? BORDER_GRADIENT_STYLE
                  : 'transparent',
            }}
          >
            <div
              onClick={() => setSelection('coinbase')}
              className={`bg-gray-900 py-6 flex justify-center  cursor-pointer w-full rounded-md`}
              data-testid="coinbase-element"
            >
              <img
                alt="coinbase_logo"
                src={'../../images/coinbaseLogo.svg'}
                className="w-2/3 sm:w-2/4"
              />
            </div>
          </div>
          <div
            className="flex z-50 justify-center w-60  sm:w-95  rounded-md p-1 "
            style={{
              background:
                selection === 'plaid' ? BORDER_GRADIENT_STYLE : 'transparent',
            }}
          >
            <div
              onClick={() => setSelection('plaid')}
              className={`bg-gray-900 py-6 flex justify-center  cursor-pointer w-full rounded-md`}
              data-testid="plaid-element"
            >
              <img
                width={'60%'}
                alt="plaid_logo"
                src={'../../images/plaidLogo.svg'}
                className="w-2/3 sm:w-2/4"
              />
            </div>
          </div>
        </div>
      </div>
      <div className=" sm:px-10 flex justify-between">
        <div className="pt-16 z-30 flex justify-start">
          <div>
            <Button
              onClick={() => {
                router.push(`/applicant`);
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
                selection === 'coinbase'
                  ? setStartCoinbase(true)
                  : handlePlaidConnect();
              }}
              text="Continue"
              style={BUTTON_STYLES.DEFAULT}
            />
          </div>
        </div>
      </div>
    </>
  );
  if (isExistingScore === 'loading') {
    return (
      <div className="px-14 py-10">
        <LoadingContainer text={''} />
      </div>
    );
  }

  return (
    <div className="px-14 py-10">
      {queryStatus === 'success' && scoreResponseModal}
      {startPlaidLink && plaidPublicToken?.publicToken && (
        <LaunchLink
          setAwaitingScoreResponse={setAwaitingScoreResponse}
          router={router}
          token={plaidPublicToken.publicToken}
          setStartPlaidLink={setStartPlaidLink}
        />
      )}
      {startCoinbase && (
        <Coinbase
          router={router}
          setAwaitingScoreResponse={setAwaitingScoreResponse}
          connectionError={connectionError}
        />
      )}
      {awaitingScoreResponse && (
        <LoadingContainer text="Requesting score, this may take a minute." />
      )}

      {!awaitingScoreResponse && mainContainer}
      {existingScoreModal}

      <BgImage />
    </div>
  );
};

export default GenerateScorePage;
