import { notification } from 'antd';
import { useRouter } from 'next/router';

import BgImage from '@scrtsybil/src/components/BgImage';
import Coinbase from '@scrtsybil/src/components/Coinbase';
import ExistingScoreModal from '@scrtsybil/src/components/generate/ExistingScoreModal';
import ScoreResponseModal from '@scrtsybil/src/components/generate/GenerateScoreModal';
import {
  useHandleAwaitingScoreResponse,
  useManageExistingScore,
  useManageQuery,
  useHandleSdk,
  useHandleExistingScore,
} from '@scrtsybil/src/components/generate/hooks';
import MainContainer from '@scrtsybil/src/components/generate/MainContainer';
import { LoadingContainer } from '@scrtsybil/src/components/LoadingContainer';
import LaunchLink from '@scrtsybil/src/components/plaid';
import {
  ISecretContext,
  storageHelper,
  useSecretContext,
} from '@scrtsybil/src/context';

import { IPlaidTokenCreateResponse } from '../api/plaid';

interface IGenerateScorePage {
  chainActivity: ISecretContext['chainActivity'];
}

export const GenerateScore = ({ chainActivity }: IGenerateScorePage) => {
  const {
    setPlaidPublicToken,
    plaidPublicToken,
    setScoreResponse,
    handleSetChainActivity,
  } = useSecretContext();

  const [awaitingScoreResponse, { setToWaiting, setNotWaiting }] =
    useHandleAwaitingScoreResponse();
  const [
    startPlaidLink,
    startCoinbase,
    { setStartCoinbase, setStartPlaidLink, setSdkUndefined },
  ] = useHandleSdk();

  const [
    existingScoreIsLoading,
    scoreExists,
    { setExistingScoreToTrue, setExistingScoreToFalse },
  ] = useHandleExistingScore();

  const router = useRouter();
  const queryType = router?.query?.type;
  const queryStatus = router?.query?.status;

  useManageQuery({ router, setStartCoinbase, setToWaiting });

  useManageExistingScore({
    chainActivity,
    setExistingScoreToTrue,
    setExistingScoreToFalse,
    queryType,
    router,
  });

  const connectionError = (client: 'coinbase' | 'plaid' | string) =>
    notification.error({
      message: `There was an error. Please re-connect to ${client}.`,
    });

  const startOver = () => {
    storageHelper.persist('scoreAnimationViewed', false);
    setSdkUndefined();
    setNotWaiting();
    setScoreResponse(null);
    setPlaidPublicToken(null);
    router.replace('/applicant/generate');
  };

  const handlePlaidConnect = async () => {
    if (plaidPublicToken) {
      setStartPlaidLink();
      router.replace('/applicant/generate?type=plaid&status=success');
    } else {
      router.replace('/applicant/generate?type=plaid&status=loading');
      try {
        setToWaiting();
        const plaidRes = await fetch('/api/plaid');
        const plaidResJson: IPlaidTokenCreateResponse = await plaidRes.json();
        if (plaidResJson?.link_token) {
          setStartPlaidLink();
          setPlaidPublicToken({ publicToken: plaidResJson.link_token });
        }
      } catch (error) {
        connectionError('plaid');
      }
    }
  };

  if (existingScoreIsLoading) {
    return (
      <div className="px-14 py-10">
        <LoadingContainer text={''} />
      </div>
    );
  }

  return (
    <div className="px-14 py-10">
      {queryStatus === 'success' && (
        <ScoreResponseModal
          setNotWaiting={setNotWaiting}
          setStartCoinbase={setStartCoinbase}
          queryStatus={queryStatus}
          queryType={queryType}
          pushToScore={() => router.push('/applicant/score')}
          startOver={startOver}
        />
      )}
      {startPlaidLink && plaidPublicToken?.publicToken && (
        <LaunchLink
          setNotWaiting={setNotWaiting}
          setToWaiting={setToWaiting}
          router={router}
          token={plaidPublicToken.publicToken}
          setStartPlaidLink={setStartPlaidLink}
        />
      )}
      {startCoinbase && (
        <Coinbase
          router={router}
          setNotWaiting={setNotWaiting}
          setToWaiting={setToWaiting}
          connectionError={connectionError}
        />
      )}
      {awaitingScoreResponse && (
        <LoadingContainer text="Requesting score, this may take a minute." />
      )}

      {!awaitingScoreResponse && (
        <MainContainer
          handlePlaidConnect={handlePlaidConnect}
          setStartCoinbase={setStartCoinbase}
        />
      )}
      {
        <ExistingScoreModal
          scoreExists={scoreExists}
          startOver={startOver}
          handleSetChainActivity={handleSetChainActivity}
          chainActivity={chainActivity}
        />
      }

      <BgImage />
    </div>
  );
};

export const GenerateScorePage = () => {
  const { chainActivity }: IGenerateScorePage = useSecretContext();

  return <GenerateScore chainActivity={chainActivity} />;
};

export default GenerateScorePage;
