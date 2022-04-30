import router from 'next/router';

import { BORDER_GRADIENT_STYLE, IS_MAINNET } from '@scrtsybil/src/constants';

import NavigationButtons from '../NavigationButtons';
import { useHandleSelection } from './hooks';

interface IMainContainerProps {
  handlePlaidConnect: () => void;
  setStartCoinbase: () => void;
}
const MainContainer = ({
  handlePlaidConnect,
  setStartCoinbase,
}: IMainContainerProps) => {
  const [
    { coinbaseSelected, plaidSelected, noneSelected },
    { setToCoinbase, setToPlaid },
  ] = useHandleSelection();

  const providerSelectors = (
    <div className="flex flex-col 2xl:flex-row 2xl:space-x-10 space-y-4 2xl:space-y-0 z-50">
      <div
        className="flex justify-center w-60  sm:w-95  rounded-md p-1 h-24 "
        style={{
          background: coinbaseSelected ? BORDER_GRADIENT_STYLE : 'transparent',
        }}
      >
        <div
          onClick={setToCoinbase}
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
        className="flex z-50 justify-center w-60  sm:w-95  rounded-md p-1 h-24"
        style={{
          background: plaidSelected ? BORDER_GRADIENT_STYLE : 'transparent',
        }}
      >
        <div
          onClick={setToPlaid}
          className={`bg-gray-900 py-5 flex justify-center  cursor-pointer w-full rounded-md`}
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
      {plaidSelected && !IS_MAINNET && (
        <a
          target={'_blank'}
          href={'https://plaid.com/docs/sandbox/test-credentials/'}
          rel="noreferrer"
        >
          Click here for Plaid Sandbox Credentials
        </a>
      )}
    </div>
  );

  return (
    <>
      <div className="w-full text-center">
        <div className="flex flex-col items-center space-y-5  justify-center w-full">
          <div className="z-50 opacity-100 px-0 sm:p-10">
            <h2 className="z-50 font-semibold text-2xl sm:text-3xl md:text-3xl lg:text-4xl p-0">
              Choose a Provider
            </h2>
            <p className="z-50 font-thin text-md sm:text-lg md:text-xl lg:text-2xl p-0">
              Select one of the following providers to qualify for a credit
              check.
            </p>
          </div>
          {providerSelectors}
        </div>
      </div>

      <NavigationButtons
        backHandler={() => router.push(`/applicant`)}
        nextHandler={() =>
          coinbaseSelected ? setStartCoinbase() : handlePlaidConnect()
        }
        backDisabled={false}
        nextDisabled={noneSelected}
      />
    </>
  );
};

export default MainContainer;
