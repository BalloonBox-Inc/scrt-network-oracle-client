import { useEffect, useState } from 'react';

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';

import BgImage from '@scrtsybil/src/components/BgImage';
import Button, { BUTTON_STYLES } from '@scrtsybil/src/components/Button';
import { LoadingContainer } from '@scrtsybil/src/components/LoadingContainer';
import NavigationButtons from '@scrtsybil/src/components/NavigationButtons';
import ScoreSpeedometer from '@scrtsybil/src/components/score';
import TweetBtn from '@scrtsybil/src/components/TweetBtn';
import { useSecretContext } from '@scrtsybil/src/context';
import { queryScoreWithPermit } from '@scrtsybil/src/keplr/helpers';
import {
  IPermitQueryResponse,
  IScoreQueryResponse,
} from '@scrtsybil/src/types/contract';

const QueryScorePage = () => {
  const [queryResponse, setQueryResponse] = useState<
    IScoreQueryResponse | undefined
  >(undefined);
  const [showScoreDescription, setShowScoreDescription] =
    useState<boolean>(false);
  const [status, setStatus] = useState<
    'loading' | 'error' | 'success' | undefined
  >('loading');

  const { permissionSig, chainActivity, scoreResponse } = useSecretContext();

  const PERMIT_FORM_ORIGINAL = {
    permitName: '',
    publicAddress: '',
    permitSignature: '',
  };
  const [permitData, setPermitData] = useState(PERMIT_FORM_ORIGINAL);

  const getScore = async () => {
    setStatus('loading');
    const queryWithPermit: {
      response?: IPermitQueryResponse;
      status: 'error' | 'success' | string;
      error?: any;
    } = await queryScoreWithPermit({
      requestData: permitData,
    });

    if (queryWithPermit?.response?.Ok) {
      setQueryResponse(queryWithPermit.response.Ok);
      setStatus('success');
    } else {
      setStatus('error');
    }
  };

  useEffect(() => {
    chainActivity?.scoreAmount ? setStatus('success') : setStatus(undefined);
  }, [chainActivity]);

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
            {scoreResponse?.message || queryResponse?.description}
          </p>
        </div>
      </div>
    </Modal>
  );

  const mainContainer = (
    <>
      <div className="w-full text-center">
        <div className=" flex flex-col items-center   justify-center w-full">
          <ScoreSpeedometer
            showScore
            score={
              chainActivity?.scoreAmount || (queryResponse?.score as number)
            }
          />
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
          <TweetBtn message="I just calculated my credit score on a blockchain-powered Dapp on the SCRT network! Check it out at secretsibyl.com" />
        </div>
      </div>
    </>
  );

  const inputDataInput = (value: string, onChange?: (e?: any) => void) => (
    <input
      onChange={onChange}
      className=" focus-visible:outline-blue-600 z-50 focus-visible:outline-none font-mono text-blue-600 bg-input-bg w-full py-3 px-3 rounded-md mb-4"
      type={'text'}
      value={value}
    />
  );

  const noScoreForm = (
    <div className="w-full text-center z-50 sm:px-20 lg:px-40 flex flex-col ">
      <form className="flex flex-col items-start mt-8  w-full">
        <label className="text-left mb-1">Permit Name</label>
        {inputDataInput(permitData.permitName, (e) =>
          setPermitData({
            ...permitData,
            permitName: e.target.value.toUpperCase(),
          })
        )}
        <label className="text-left mb-1">Public Address</label>
        {inputDataInput(permitData.publicAddress, (e) =>
          setPermitData({
            ...permitData,
            publicAddress: e.target.value,
          })
        )}
        <label className="text-left mb-1">Signature</label>
        {inputDataInput(permitData.permitSignature, (e) =>
          setPermitData({
            ...permitData,
            permitSignature: e.target.value,
          })
        )}
      </form>
      <div className="flex items-center mt-8">
        {/* <Button
          text={'Get my score'}
          classes={{ container: 'mr-3' }}
          isDisabled={
            !permitData.permitName ||
            !permitData?.publicAddress ||
            !permitData?.permitSignature
          }
          onClick={() => getScore()}
        /> */}

        {permissionSig?.name && (
          <Button
            text={'Autofill form?'}
            classes={{ container: 'mr-3 reappear' }}
            style={BUTTON_STYLES.OUTLINE}
            // isDisabled={!inputData}
            onClick={() =>
              setPermitData({
                permitName: permissionSig.name,
                permitSignature: permissionSig.signature.signature,
                publicAddress: permissionSig.signature.pub_key.value,
              })
            }
          />
        )}
      </div>
    </div>
  );

  const errorContainer = (
    <>
      <div className="w-full flex flex-col text-center items-center">
        <div className=" flex  items-center  text-2xl justify-center w-full">
          <ExclamationCircleOutlined />
          <p className=" ml-3">No score found!</p>
        </div>
        <div className="flex items-center mt-6  space-x-3">
          {' '}
          <Link href={'/applicant/generate'}>
            <a className="z-50 w-max">Generate a score</a>
          </Link>
          <p>or</p>
          <Link href={'/applicant'}>
            <a className="z-50  w-max">go back</a>
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="px-14 py-10 ">
        {status !== 'error' && (
          <div className="w-full text-center">
            <div className="z-50 opacity-100 px-0 sm:p-10">
              <h2 className="z-50 font-semibold text-2xl sm:text-3xl md:text-3xl lg:text-4xl p-0">
                Query Your Score
              </h2>
            </div>
          </div>
        )}
        {status === 'loading' && (
          <LoadingContainer text="Requesting score, this may take a minute." />
        )}
        {status === 'success' && mainContainer}
        {status === 'error' && errorContainer}
        {status === undefined && noScoreForm}
        {scoreDescriptionModal}
        <BgImage />
      </div>
      {status !== 'error' && status !== 'loading' && (
        <NavigationButtons
          backHandler={() => router.push(`/applicant`)}
          nextHandler={() => getScore()}
          nextDisabled={
            !permitData.permitName ||
            !permitData?.publicAddress ||
            !permitData?.permitSignature
          }
        />
      )}
    </>
  );
};

export default QueryScorePage;
