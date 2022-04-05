export default function Learn() {
  const howItWorks = (
    <div className="pt-10 sm:pt-10 md:pt-20">
      <h1 className="text-2xl md:text-4xl font-extrabold leading-tight">
        {' '}
        How SCRTSibyl works
      </h1>
      <p className="text-xs md:text-sm text-lightgray mt-5">
        The SCRTSibyl credit score oracle retrieves a user&apos;s financial data
        with the help of two financial validators (Coinbase for web3 and Plaid
        for web2). Once data is retrieved, the DApp feeds the data to an
        algorithm that calculates your score. After that, the DApp executes a
        smart contract to write, encrypt, and store your score onto the Secret
        Network blockchain. You will be paying a gas fee to cover both
        calculation cost and blockchain storage cost. While your financial data
        remains private, your score will be permanently added to the blockchain
        and you can view it for free at any time in the future using a Secret
        permission key.
      </p>
      <div className="bg-black px-10 py-14 rounded-2xl mt-10 flex justify-between items-center md:flex-row flex-col">
        <div className="w-48">
          <img src="./images/plaid+coinbase.svg" alt="plaidcoinbase" />
          <p className="text-lightgray mt-5 text-center">
            Select one financial validator that will provide your financial
            data.
          </p>
        </div>
        <img
          src="./images/white-arrow.svg"
          alt="whitearrow"
          className="w-12 lg:w-28 md:rotate-0 rotate-90 md:p-0 py-5"
        />
        <div className="w-48 flex flex-col items-center">
          <img
            src="./images/crystal_ball.svg"
            alt="crystalball"
            className="w-20 mb-5"
          />
          <p className="text-lightgray mt-5 text-center">
            SCRTsibyl algorithm caculates your score.
          </p>
        </div>
        <img
          src="./images/white-arrow.svg"
          alt="whitearrow"
          className="w-12 lg:w-28 md:rotate-0 rotate-90 md:p-0 py-5"
        />
        <div className="w-48 flex flex-col items-center">
          <img
            src="./images/scrt-blockchain.svg"
            alt="blockchain"
            className="w-12 lg:w-28 md:rotate-0 md:p-0 py-5"
          />
          <p className="text-lightgray mt-5 text-center">
            Write, encrypt, and store your score onto the Secret Network
            blockchain. (This process requires a gas fee)
          </p>
        </div>
        <img
          src="./images/white-arrow.svg"
          alt="whitearrow"
          className="w-12 lg:w-28 md:rotate-0 rotate-90 md:p-0 py-5"
        />
        <div className="w-48 flex flex-col items-center">
          <img src="./images/key.svg" alt="key" className="mb-5" />
          <p className="text-lightgray mt-5 text-center">
            View your score for free anytime using a Secret permission key.
          </p>
        </div>
      </div>
    </div>
  );

  const howWeCaculate = (
    <div className="pt-5 sm:pt-10 md:pt-20 relative">
      <img
        src="./images/blue-circle.svg"
        alt="blue-circle"
        style={{
          position: 'absolute',
          top: '-40%',
          left: '-50%',
          zIndex: -10,
        }}
      />

      <h1 className="text-2xl md:text-4xl font-extrabold leading-tight mt-20 lg:mt-0">
        {' '}
        How we calculate your score
      </h1>
      <p className="text-xs md:text-sm text-lightgray my-5">
        SCRTCibyl scores are calculated using many pieces of data retrieved from
        either your bank account or your Coinbase account. We developed two
        distinct models, depending on whether you connect your bank data or
        Coinbase data.
      </p>

      <div className="bg-black p-10 mt-10 rounded-xl">
        <div className="flex items-center">
          <img src="./images/plaidLogo.svg" alt="plaid-logo" className="w-32" />
          <h3 className="text-lg md:text-xl ml-3">Model</h3>
        </div>
        <p className="text-lightgray mt-5">
          Your bank account data is grouped into 4 categories: credit, velocity,
          stability, diversity. The percentages in the donut chart reflect how
          important each of the categories is in determining the SCRTSibyl
          score. The importance of these categories may vary from one person to
          another.
        </p>

        <div className="grid grid-rows-3 md:grid-rows-none md:grid-cols-4 gap-2 mt-10">
          <div className="flex flex-col justify-evenly">
            <div>
              {' '}
              <div className="flex items-center">
                <div className="w-3 h-3 bg-white rounded-full mr-3" />
                <h4 className="text-base font-bold">Diversity (10%)</h4>
              </div>
              <p className="text-lightgray text-xs mt-5">
                It rewards the diversity of a portfolio, checking for all
                account types: savings, retail investment, brokerage, loans,
                retirement accounts. It also rewards based on the volume of
                capital held in each account.{' '}
              </p>
            </div>
            <div>
              {' '}
              <div className="flex items-center">
                <div className="w-3 h-3 bg-rose-300 rounded-full mr-3" />
                <h4 className="text-base font-bold">Stability (10%)</h4>
              </div>
              <p className="text-lightgray text-xs mt-5">
                It computes your total account balance now as well as the
                minimum running balance for the past twelve months.{' '}
              </p>
            </div>
          </div>

          <div className="row-span-1 md:col-span-2">
            {' '}
            <img
              src="./images/pink-piechart.svg"
              alt="pie-chart"
              className="w-full"
            />
          </div>
          <div className="flex flex-col justify-evenly">
            <div>
              {' '}
              <div className="flex items-center">
                <div className="w-3 h-3 bg-rose-500 rounded-full mr-3" />
                <h4 className="text-base font-bold">Credit (40%)</h4>
              </div>
              <p className="text-lightgray text-xs mt-5">
                It detects the number of credit accounts owned and their types,
                it accounts for the duration of credit accounts, and the age of
                the oldest account. It also considers the percentage of
                available credit used, the cumulative credit limit, and how
                often interest was charged on your credit cards.
              </p>
            </div>
            <div>
              {' '}
              <div className="flex items-center">
                <div className="w-3 h-3 bg-rose-400 rounded-full mr-3" />
                <h4 className="text-base font-bold">Velocity (40%)</h4>
              </div>
              <p className="text-lightgray text-xs mt-5">
                It analyzes how many and how fast transactions occur in checking
                account(s). It calculates the number and volume of monthly
                recurring deposits and withdrawals, the cumulative monthly
                income, and expenses.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black p-10 mt-10 mb-20 rounded-xl">
        <div className="flex items-baseline">
          <img
            src="./images/coinbaseLogo.svg"
            alt="coinbase-logo"
            className="w-32"
          />
          <h3 className="text-lg md:text-xl ml-3">Model</h3>
        </div>
        <p className="text-lightgray mt-5">
          Your Coinbase data is grouped into 4 categories:{' '}
          <span className="font-bold">KYC, history, liquidity, activity.</span>{' '}
          The percentages in the donut chart reflect how important each of the
          categories is in determining the SCRTSibyl score. The importance of
          categories is fixed for the Coinbase model.
        </p>

        <div className="grid grid-rows-3 md:grid-rows-none md:grid-cols-4 gap-2 mt-10">
          <div className="flex flex-col justify-evenly">
            <div>
              {' '}
              <div className="flex items-center">
                <div className="w-3 h-3 bg-white rounded-full mr-3" />
                <h4 className="text-base font-bold">KYC (10%)</h4>
              </div>
              <p className="text-lightgray text-xs mt-5">
                It checks whether you correctly kyc&apos;ed into Coinbase and
                whether you own any active and non-zero balance accounts.
              </p>
            </div>
            <div>
              {' '}
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-200 rounded-full mr-3" />
                <h4 className="text-base font-bold">History (10%)</h4>
              </div>
              <p className="text-lightgray text-xs mt-5">
                It looks at the length of transaction history and the age of
                your longest-standing wallet.
              </p>
            </div>
          </div>

          <div className="col-span-2">
            {' '}
            <img
              src="./images/blue-piechart.svg"
              alt="blue-pie-chart"
              className="w-full"
            />
          </div>
          <div className="flex flex-col justify-around">
            <div>
              {' '}
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full mr-3" />
                <h4 className="text-base font-bold">Liquidity (40%)</h4>
              </div>
              <p className="text-lightgray text-xs mt-5">
                It computes your cumulative net account balance now as well as
                the minimum running balance for the past twelve months.
              </p>
            </div>
            <div>
              {' '}
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3" />
                <h4 className="text-base font-bold">Activity (40%)</h4>
              </div>
              <p className="text-lightgray text-xs mt-5">
                It checks how lively is the transaction history, the volume
                traded, staked, bought, sold, withdrawn in the last year, the
                net profit since account inception.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {howItWorks}
      {howWeCaculate}
    </>
  );
}
