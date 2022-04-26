import dynamic from 'next/dynamic';
import { pipe, replace, slice } from 'ramda';

import { LoadingContainer } from '@scrtsybil/src/components/LoadingContainer';
import NavigationButtons from '@scrtsybil/src/components/NavigationButtons';
import { useProviderReducer } from '@scrtsybil/src/components/provider/hooks';
import MainContainer from '@scrtsybil/src/components/provider/MainContainer';
import ScoreSpeedometer from '@scrtsybil/src/components/score';

const QueryModal = dynamic(
  () => import('@scrtsybil/src/components/provider/QueryModal')
);

const ProviderServicesPage = () => {
  const [
    {
      selection,
      showModal,
      status,
      permitData,
      viewingKey,
      queryViewingKeyResponse,
      queryPermitResponse,
    },
    {
      setSelectionViewingKey,
      setSelectionPermit,
      setSelectionClear,
      setShowModal,
      setHideModal,
      setStatusLoading,
      setStatusSuccess,
      setStatusClear,
      setResetViewingKey,
      setViewingKey,
      setPermitData,
      setClearPermitData,
      setQueryPermitResponse,
      setQueryViewingKeyResponse,
    },
  ] = useProviderReducer();

  const convertScoreDescriptionForProvider = (description: string) => {
    const initialTransform = pipe(
      replace(/Your/g, "This user's"),
      replace(/your/g, 'their'),
      replace(/you/g, 'them')
    )(description);
    const tryAgainIndex = initialTransform.indexOf('Try again');
    if (tryAgainIndex < 0) {
      return initialTransform;
    }

    return slice(0, tryAgainIndex, initialTransform);
  };

  return (
    <>
      {!status && (
        <MainContainer
          selection={selection}
          setSelectionPermit={setSelectionPermit}
          setShowModal={setShowModal}
          setSelectionViewingKey={setSelectionViewingKey}
        />
      )}
      {status === 'loading' && <LoadingContainer text={'Querying score'} />}
      {status === 'success' && (
        <>
          <div className="relative pb-10">
            <ScoreSpeedometer
              showScore
              score={
                selection === 'permit'
                  ? Math.round(queryPermitResponse?.Ok?.score as number)
                  : Math.round(queryViewingKeyResponse?.score as number)
              }
            />
          </div>
          <div className="bg-navy p-3 mx-20 -mt-20 mb-10">
            <p>
              {selection === 'permit'
                ? convertScoreDescriptionForProvider(
                    queryPermitResponse?.Ok?.description as string
                  )
                : convertScoreDescriptionForProvider(
                    queryViewingKeyResponse?.description as string
                  )}
            </p>
          </div>
          <NavigationButtons
            backHandler={() => {
              setStatusClear();
              setSelectionClear();
            }}
            showNextBtn={false}
          />
        </>
      )}
      <QueryModal
        showModal={showModal}
        setStatusClear={setStatusClear}
        setStatusLoading={setStatusLoading}
        setHideModal={setHideModal}
        permitData={permitData}
        setQueryPermitResponse={setQueryPermitResponse}
        setStatusSuccess={setStatusSuccess}
        setQueryViewingKeyResponse={setQueryViewingKeyResponse}
        selection={selection}
        setPermitData={setPermitData}
        setViewingKey={setViewingKey}
        setClearPermitData={setClearPermitData}
        setResetViewingKey={setResetViewingKey}
        viewingKey={viewingKey}
      />
    </>
  );
};

export default ProviderServicesPage;
