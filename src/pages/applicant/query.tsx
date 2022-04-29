import { useState } from 'react';

import { useRouter } from 'next/router';

import BgImage from '@scrtsybil/src/components/BgImage';
import { LoadingContainer } from '@scrtsybil/src/components/LoadingContainer';
import NavigationButtons from '@scrtsybil/src/components/NavigationButtons';
import ErrorContainer from '@scrtsybil/src/components/query/ErrorContainer';
import { useSetStatus } from '@scrtsybil/src/components/query/hooks';
import MainContainer from '@scrtsybil/src/components/query/MainContainer';
import NoScoreForm from '@scrtsybil/src/components/query/NoScoreForm';
import ScoreDescriptionModal from '@scrtsybil/src/components/query/ScoreDescriptionModal';
import TweetBtn from '@scrtsybil/src/components/TweetBtn';
import { useSecretContext } from '@scrtsybil/src/context';
import { queryScoreWithPermit } from '@scrtsybil/src/keplr/helpers';
import {
  IPermitQueryResponse,
  IScoreQueryResponse,
} from '@scrtsybil/src/types/contract';

const PERMIT_FORM_ORIGINAL = {
  permitName: '',
  publicAddress: '',
  permitSignature: '',
};

const QueryScorePage = () => {
  const [queryResponse, setQueryResponse] = useState<
    IScoreQueryResponse | undefined
  >(undefined);
  const [showScoreDescription, setShowScoreDescription] =
    useState<boolean>(false);

  const [
    { statusLoading, statusUndefined, statusError, statusSuccess },
    { setLoadingStatus, setErrorStatus, setSuccessStatus },
  ] = useSetStatus();

  const { permissionSig, chainActivity, scoreResponse } = useSecretContext();

  const [permitData, setPermitData] = useState(PERMIT_FORM_ORIGINAL);

  const getScore = async () => {
    setLoadingStatus();
    if (!chainActivity?.scoreAmount || !chainActivity?.scoreMessage) {
      const queryWithPermit: {
        response?: IPermitQueryResponse;
        status: 'error' | 'success' | string;
        error?: any;
      } = await queryScoreWithPermit({
        requestData: permitData,
      });

      if (queryWithPermit?.response?.Ok) {
        setQueryResponse(queryWithPermit.response.Ok);
        setSuccessStatus();
      } else {
        setErrorStatus();
      }
    } else {
      setSuccessStatus();
    }
  };

  const router = useRouter();

  return (
    <>
      <div className="px-14 py-10 ">
        {statusError && (
          <div className="w-full text-center">
            <div className="z-50 opacity-100 px-0 sm:p-10">
              <h2 className="z-50 font-semibold text-2xl sm:text-3xl md:text-3xl lg:text-4xl p-0">
                {statusSuccess ? 'Your score' : 'Query Your Score'}
              </h2>
            </div>
          </div>
        )}
        {statusLoading && (
          <LoadingContainer text="Requesting score, this may take a minute." />
        )}
        {statusSuccess && (
          <MainContainer
            queryResponse={queryResponse}
            chainActivity={chainActivity}
            setShowScoreDescription={setShowScoreDescription}
          />
        )}
        {statusError && <ErrorContainer />}
        {statusUndefined && (
          <NoScoreForm
            permitData={permitData}
            setPermitData={setPermitData}
            permissionSig={permissionSig}
          />
        )}
        {showScoreDescription && (
          <ScoreDescriptionModal
            scoreResponse={scoreResponse}
            showScoreDescription={showScoreDescription}
            setShowScoreDescription={setShowScoreDescription}
            queryResponse={queryResponse}
          />
        )}
        <BgImage />
      </div>
      {(statusUndefined || statusSuccess) && (
        <div className="sm:-mx-24">
          <NavigationButtons
            backHandler={() => router.push(`/applicant`)}
            nextHandler={() => getScore()}
            showNextBtn={!statusSuccess}
            nextDisabled={
              !permitData.permitName ||
              !permitData?.publicAddress ||
              !permitData?.permitSignature
            }
          />
        </div>
      )}
      {statusSuccess && (
        <TweetBtn message="I just calculated my credit score on a blockchain-powered DApp on the SCRT network! Check it out at secretsibyl.com #web3" />
      )}
    </>
  );
};

export default QueryScorePage;
