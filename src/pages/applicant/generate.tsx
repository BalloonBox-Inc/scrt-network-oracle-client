import { useEffect, useState } from 'react';

import { notification, Modal } from 'antd';
import { useRouter } from 'next/router';
import ClipLoader from 'react-spinners/ClipLoader';

import BgImage from '@scrtsybil/src/components/BgImage';
import Button, { BUTTON_STYLES } from '@scrtsybil/src/components/Button';
import LaunchLink from '@scrtsybil/src/components/plaid';
import { BORDER_GRADIENT_STYLE } from '@scrtsybil/src/constants';
import { storageHelper, useSecretContext } from '@scrtsybil/src/context';
import { IPlaidTokenCreateResponse } from '@scrtsybil/src/pages/api/plaid';
import { handleCoinbaseCode } from '@scrtsybil/src/services';

const GenerateScorePage = () => {
  const [selection, setSelection] = useState<string | undefined>(undefined);
  const [awaitingScoreResponse, setAwaitingScoreResponse] =
    useState<boolean>(false);
  const [startPlaidLink, setStartPlaidLink] = useState<boolean>(false);

  const {
    setPlaidPublicToken,
    plaidPublicToken,
    setCoinbaseToken,
    setScoreResponse,
    scoreResponse,
  } = useSecretContext();

  const router = useRouter();
  const queryType = router.query?.type;
  const queryStatus = router.query?.status;

  const connectionError = (client: 'coinbase' | 'plaid' | string) =>
    notification.error({
      message: `There was an error. Please re-connect to ${client}.`,
    });

  const startOver = () => {
    storageHelper.persist('scoreAnimationViewed', false);
    setStartPlaidLink(false);
    setAwaitingScoreResponse(false);
    setScoreResponse(undefined);
    setPlaidPublicToken(undefined);
    router.replace('/applicant/generate');
  };

  useEffect(() => {
    router.query.status === 'loading' && setAwaitingScoreResponse(true);
  }, [router.query]);

  useEffect(() => {
    const getCoinbaseToken = async (code: string) => {
      try {
        const resJson = await handleCoinbaseCode(code);
        if (resJson.error) {
          router.replace('/applicant/generate');
          connectionError('coinbase');
        }
        if (resJson.access_token) {
          setCoinbaseToken(resJson);
          router.replace('/applicant/generate?type=coinbase&status=loading');
          const coinbaseRes = await fetch(
            `/api/coinbase?access_token=${resJson.access_token}&refresh_token=${resJson.refresh_token}`
          );

          const { coinbaseScore } = await coinbaseRes.json();
          if (coinbaseScore.status === 'success') {
            setScoreResponse(coinbaseScore);
            router.replace('/applicant/generate?type=coinbase&status=success');
          } else {
            setScoreResponse(undefined);
            router.replace('/applicant/generate');
            setAwaitingScoreResponse(false);
            notification.error({
              message: 'Error connecting to Coinbase, try again later',
            });
          }
        }
      } catch (error) {
        router.pathname = '/applicant/generate';
        connectionError('coinbase');
      }
    };

    if (router?.query?.code) {
      getCoinbaseToken(router.query.code as string);
    }
  }, [router, setCoinbaseToken, setScoreResponse]);

  const handleCoinbaseConnect = async () => {
    if (scoreResponse?.endpoint.includes('coinbase')) {
      router.replace('/applicant/generate?type=coinbase&status=success');
    } else {
      setAwaitingScoreResponse(true);
      const res = await fetch('/api/coinbase');
      const resJson = await res.json();
      if (resJson.url) {
        window.location.href = resJson.url;
      }
    }
  };

  const handlePlaidConnect = async () => {
    if (plaidPublicToken) {
      setStartPlaidLink(true);
    } else {
      router.replace('/applicant/generate?type=plaid&status=loading');
      try {
        const plaidRes = await fetch('/api/plaid');
        const plaidResJson: IPlaidTokenCreateResponse = await plaidRes.json();
        setAwaitingScoreResponse(true);
        if (plaidResJson?.link_token) {
          setStartPlaidLink(true);
          setPlaidPublicToken({ publicToken: plaidResJson.link_token });
        }
      } catch (error) {
        connectionError('plaid');
      }
    }
  };

  const loadingContainer = (
    <div className="w-full flex-col  flex justify-center items-center z-50">
      <ClipLoader
        speedMultiplier={0.75}
        size={120}
        color={'rgba(85,42,170, 10)'}
      />
      <p className="mt-5 text-sm">Requesting Score, this may take a minute.</p>
    </div>
  );

  const scoreResponseModal = (
    <Modal
      footer={null}
      style={{ top: '30%' }}
      closable={true}
      onCancel={() => {
        router.push('/applicant/generate');
        setAwaitingScoreResponse(false);
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

  return (
    <div className="px-14 py-20 ">
      {queryStatus === 'success' && scoreResponseModal}
      {startPlaidLink && plaidPublicToken?.publicToken && (
        <LaunchLink
          setAwaitingScoreResponse={setAwaitingScoreResponse}
          router={router}
          token={plaidPublicToken.publicToken}
          setStartPlaidLink={setStartPlaidLink}
        />
      )}
      {awaitingScoreResponse && loadingContainer}
      {!awaitingScoreResponse && (
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
                    selection === 'plaid'
                      ? BORDER_GRADIENT_STYLE
                      : 'transparent',
                }}
              >
                <div
                  onClick={() => setSelection('plaid')}
                  className={`bg-gray-900 py-6 flex justify-center  cursor-pointer w-full rounded-md`}
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
                      ? handleCoinbaseConnect()
                      : handlePlaidConnect();
                  }}
                  // isDisabled={!selection}
                  text="Continue"
                  style={BUTTON_STYLES.DEFAULT}
                />
              </div>
            </div>
          </div>
        </>
      )}

      <BgImage />
    </div>
  );
};

export default GenerateScorePage;
