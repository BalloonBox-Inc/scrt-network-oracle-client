import { useEffect, useState } from 'react';

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';

import BgImage from '@scrtsybil/src/components/BgImage';
import Button, { BUTTON_STYLES } from '@scrtsybil/src/components/Button';
import { LoadingContainer } from '@scrtsybil/src/components/LoadingContainer';
import ScoreSpeedometer from '@scrtsybil/src/components/score';
import { handleQueryScore } from '@scrtsybil/src/keplr/helpers';
import { IScoreQueryResponse } from '@scrtsybil/src/types/contract';

const QueryScorePage = () => {
  const [queryResponse, setQueryResponse] = useState<
    IScoreQueryResponse | undefined
  >(undefined);
  const [showScoreDescription, setShowScoreDescription] =
    useState<boolean>(false);
  const [status, setStatus] = useState<
    'loading' | 'error' | 'success' | undefined
  >('loading');

  useEffect(() => {
    const getScore = async () => {
      const queryScoreResponse = await handleQueryScore();
      if (queryScoreResponse.status === 'success') {
        setQueryResponse(queryScoreResponse.response);
        setStatus('success');
      } else {
        setStatus('error');
      }
    };
    getScore();
  }, []);

  const router = useRouter();

  const scoreDescriptionModal = (
    <Modal
      visible={showScoreDescription}
      footer={null}
      onCancel={() => setShowScoreDescription(false)}
      bodyStyle={{ background: '#242630' }}
      style={{ top: '20%' }}
    >
      <div
        className={`px-8 flex py-5 justify-center rounded-md z-50 duration-500`}
      >
        <div className="p-8 rounded-lg z-50  max-w-xl w-full ">
          <h3 className="text-lg uppercase font-semibold mb-4">Summary</h3>
          <p className="sm:text-base leading-7">
            {queryResponse?.description || queryResponse?.description}
          </p>
        </div>
      </div>
    </Modal>
  );

  const mainContainer = (
    <>
      <div className="w-full text-center">
        <div className=" flex flex-col items-center   justify-center w-full">
          <ScoreSpeedometer showScore score={queryResponse?.score as number} />
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
      </div>
    </>
  );

  const errorContainer = (
    <>
      <div className="w-full flex flex-col text-center">
        <div className=" flex  items-center  text-2xl justify-center w-full">
          <ExclamationCircleOutlined />
          <p className=" ml-3">No score found!</p>
        </div>
        <Link href={'/applicant/generate'}>
          <a className="z-50 mt-6">Generate a score.</a>
        </Link>
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
      </div>
    </>
  );

  return (
    <div className="px-14 py-20 ">
      {status === 'loading' && (
        <LoadingContainer text="Requesting Score, this may take a minute." />
      )}
      {status === 'success' && mainContainer}
      {status === 'error' && errorContainer}
      {scoreDescriptionModal}
      <BgImage />
    </div>
  );
};

export default QueryScorePage;
