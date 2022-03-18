import { text } from 'stream/consumers';

import { useEffect, useState } from 'react';

import { CheckCircleFilled } from '@ant-design/icons';
import { Layout, Typography, notification, Alert, Modal } from 'antd';
import { useRouter } from 'next/router';
import ClipLoader from 'react-spinners/ClipLoader';

import BgImage from '@scrtsybil/src/components/BgImage';
import Button, { BUTTON_STYLES } from '@scrtsybil/src/components/Button';
import LaunchLink from '@scrtsybil/src/components/plaid';
import { BORDER_GRADIENT_STYLE, NOTIFICATIONS } from '@scrtsybil/src/constants';
import { useSecretContext } from '@scrtsybil/src/context';
import { IPlaidTokenCreateResponse } from '@scrtsybil/src/pages/api/plaid';
import { handleCoinbaseCode } from '@scrtsybil/src/services';

const GenerateScorePage = () => {
  const [selection, setSelection] = useState<string | undefined>(undefined);
  const [awaitingScoreResponse, setAwaitingScoreResponse] =
    useState<boolean>(false);
  const [startPlaid, setStartPlaid] = useState<boolean>(false);

  const {
    setPlaidPublicToken,
    plaidPublicToken,
    setCoinbaseToken,
    scoreResponse,
    setScoreResponse,
  } = useSecretContext();

  const router = useRouter();
  const queryType = router.query?.type;
  const queryStatus = router.query?.status;

  const connectionError = (client: 'coinbase' | 'plaid' | string) =>
    notification.error({
      message: `There was an error. Please re-connect to ${client}.`,
    });

  const startOver = () => {
    setStartPlaid(false);
    setAwaitingScoreResponse(false);
    setScoreResponse(undefined);
    setPlaidPublicToken(undefined);
    router.replace('/applicant/generate');
  };

  useEffect(() => {
    scoreResponse &&
      awaitingScoreResponse &&
      router.replace('/applicant/generate?type=plaid&status=success') &&
      setAwaitingScoreResponse(false);
  }, [router, scoreResponse, awaitingScoreResponse]);

  useEffect(() => {
    router.query.status === 'loading' && setAwaitingScoreResponse(true);
    router.query.status === 'error' &&
      typeof router?.query?.type === 'string' &&
      setAwaitingScoreResponse(false) &&
      connectionError(router?.query?.type);
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
          router.replace('/applicant/score');
        }
      } catch (error) {
        router.pathname = '/applicant/generate';
        connectionError('coinbase');
      }
    };

    if (router?.query?.code) {
      getCoinbaseToken(router.query.code as string);
    }
  }, [router, setCoinbaseToken]);

  const handleCoinbaseConnect = async () => {
    const res = await fetch('/api/coinbase');
    const resJson = await res.json();
    if (resJson.url) {
      window.location.href = resJson.url;
    }
  };

  const handlePlaidConnect = async () => {
    try {
      const plaidRes = await fetch('/api/plaid');

      const plaidResJson: IPlaidTokenCreateResponse = await plaidRes.json();
      if (plaidResJson?.link_token) {
        router.replace('/applicant/generate?type=plaid&status=loading');
        // setPlaidToken(plaidResJson.link_token);
        setStartPlaid(true);
        setPlaidPublicToken({ publicToken: plaidResJson.link_token });
      }
    } catch (error) {
      connectionError('plaid');
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
      closable={false}
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
            onClick={() => router.push('/applicant/score')}
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
      {startPlaid && plaidPublicToken?.publicToken && (
        <LaunchLink token={plaidPublicToken.publicToken} />
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
