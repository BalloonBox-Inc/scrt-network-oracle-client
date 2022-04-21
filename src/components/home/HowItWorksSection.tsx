import { useState } from 'react';

import { motion } from 'framer-motion';

import StepBox from './StepBox';

export default function HowItWorksSection() {
  const [applicant, setApplicant] = useState(true);
  const toggleVariants = {
    applicant: {
      x: 0,
      transition: {
        delay: 0.05,
      },
    },
    serviceProvider: {
      x: 140,
      transition: {
        delay: 0.05,
      },
    },
  };
  return (
    <div className="flex flex-col items-center justify-center px-5 sm:px-10 md:px-0 py-10 relative">
      <h2 className="text-4xl font-extrabold mb-10">How it works</h2>
      <div className="flex items-center bg-neutral-800 mb-10 px-2 py-4 rounded-full cursor-pointer relative">
        <motion.div
          className={`bg-gradient-to-b from-purple to-deepblue py-5 rounded-full ${
            applicant ? 'w-36' : 'w-40'
          } -z-5 absolute`}
          variants={toggleVariants}
          animate={applicant ? 'applicant' : 'serviceProvider'}
        ></motion.div>
        <div
          className={`text-lightgray hover:text-white z-10`}
          style={{ width: '140px', textAlign: 'center' }}
          onClick={() => setApplicant(true)}
        >
          Applicant
        </div>
        <div
          className={`text-lightgray hover:text-white z-10 cursor-pointer`}
          style={{ width: '160px', textAlign: 'center' }}
          onClick={() => setApplicant(false)}
        >
          Service Provider
        </div>
      </div>

      {applicant ? (
        <div className="relative">
          <StepBox
            title="Integrate with validators"
            img="./images/plaid+coinbase.svg"
            description="We acquire users' financial data by integrating with two validators : Plaid, Coinbase."
            style={{ marginBottom: '3rem' }}
            side="left"
          />
          <img
            src="./images/arrow-1.svg"
            alt="arrow-1"
            className="absolute top-40 -left-20 invisible md:visible"
          />
          <StepBox
            title="Calculate financial score"
            img="./images/credit-gauge.svg"
            description="We run an algorithm on the given data to compute a score representing the financial health of a user."
            style={{ marginBottom: '3rem' }}
            side="right"
          />
          <img
            src="./images/arrow-2.svg"
            alt="arrow-2"
            className="absolute top-96 right-5 -z-10 invisible md:visible"
          />
          <StepBox
            title="Save it to the blockchain"
            img="./images/scrtnetwork-logo-white.svg"
            description="We save your score to the Secret blockchain via a CosmWasm smart contract."
            style={{ marginBottom: '3rem' }}
            side="left"
          />
          <img
            src="./images/arrow-3.svg"
            alt="arrow-3"
            className="absolute left-20 invisible md:visible"
          />
          <StepBox
            title="Share your score"
            img="./images/workicon-combo.svg"
            description="Make your score available to service providers by granting permission or providing a public link."
            style={{ marginBottom: '3rem' }}
            side="right"
          />
        </div>
      ) : (
        <div className="relative">
          <StepBox
            title="Algorithm calculates financial score"
            img="./images/provider-step1.svg"
            description="Applicants will get a score that is calculated by an algorithm based on their financial data retrieved by two validators: Plaid, Coinbase."
            style={{ marginBottom: '3rem' }}
            side="right"
          />
          <img
            src="./images/arrow-2.svg"
            alt="arrow-2"
            className="absolute invisible md:visible right-10 top-40"
          />
          <StepBox
            title="Share financial score"
            img="./images/provider-step2.svg"
            description="Once the applicants get their scores, they can share their score by giving you permission or providing a public link."
            style={{ marginBottom: '3rem' }}
            side="left"
          />
          <img
            src="./images/arrow-1.svg"
            alt="arrow-1"
            className="absolute top-80 -left-20 invisible md:visible"
          />
          <StepBox
            title="View your applicants' scores"
            img="./images/provider-step3.svg"
            description="Check your applicants' scores by entering the Name of Permission, Public Address, and Signature, provided by the applicant."
            style={{ marginBottom: '3rem' }}
            side="right"
          />
        </div>
      )}
    </div>
  );
}
