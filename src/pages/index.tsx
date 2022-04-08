import React, { useState } from 'react';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Button, { BUTTON_STYLES } from '@scrtsybil/src/components/Button';
import Connect from '@scrtsybil/src/components/connect';
import Layout from '@scrtsybil/src/components/Layout';
import LogoLoader from '@scrtsybil/src/components/LogoLoader';
import { useSecretContext } from '@scrtsybil/src/context';

interface ISectionElement {
  title: string;
  img: string;
  description: string;
  style?: object;
}
const keplr = '/images/keplr.svg';

const Home = () => {
  const { loading, secretAddress, connectRequest, setConnectRequest } =
    useSecretContext();

  const handleDisconnectRequest = () => {
    setConnectRequest(false);
  };
  const [applicant, setApplicant] = useState(true);

  const appearVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.05,
      },
    },
  };

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

  const router = useRouter();

  const CardWithIcons = ({ title, img, description }: ISectionElement) => {
    return (
      <motion.div
        className="bg-black rounded-lg flex flex-col items-center px-5 py-10 mt-10 lg:mt-0 md:w-72 mr-0 md:mr-10"
        whileHover={{ scale: 1.05 }}
      >
        <img src={img} alt="icon" className="max-w-sm mb-7" />
        <h3 className="text-lg font-extrabold mb-5">{title}</h3>
        <p className="text-lightgray text-center font-light">{description} </p>
      </motion.div>
    );
  };

  const StepBoxLeft = ({ title, img, description, style }: ISectionElement) => {
    return (
      <motion.div
        className="bg-black rounded-lg flex flex-col sm:flex-row py-10 px-10 mr-0 md:mr-40"
        style={style}
        initial={{ x: -100 }}
        animate={{ x: 0 }}
      >
        <img src={img} alt="icon" className="sm:w-48 mr-10 mb-10 sm:mb-0" />
        <div>
          <h3 className="text-lg font-extrabold mb-5">{title}</h3>
          <p className="text-lightgray max-w-sm font-light">{description} </p>
        </div>
      </motion.div>
    );
  };

  const StepBoxRight = ({
    title,
    img,
    description,
    style,
  }: ISectionElement) => {
    return (
      <motion.div
        className="bg-black rounded-lg flex flex-col sm:flex-row py-10 px-10 ml-0 md:ml-40 items-center"
        style={style}
        initial={{ x: 100 }}
        animate={{ x: 0 }}
      >
        <div>
          <h3 className="text-lg font-extrabold mb-5">{title}</h3>
          <p className="text-lightgray max-w-sm font-light">{description} </p>
        </div>
        <img src={img} alt="icon" className="mt-10 sm:mt-0 sm:w-40 ml-10" />
      </motion.div>
    );
  };

  const awaitingConnectionView = (
    <div
      style={{ height: '70%', padding: '3rem 5rem' }}
      className="flex justify-center items-center flex-col"
    >
      <div
        className="flex flex-col items-center"
        style={{
          background:
            'linear-gradient(142.6deg, #232323 -1.55%, rgba(29, 29, 29, 0.64) 200.36%',
          zIndex: '10',
          padding: '7rem',
          boxShadow: '0px 25px 25px rgba(0, 3, 32, 0.5)',
          borderRadius: '8px',
        }}
      >
        <div className="flex items-center w-full">
          <img
            alt="spinning_keplr"
            className="spin mb-3 mr-3"
            width={'22px'}
            src={keplr}
          />
          <div className="text-lg w-full overflow-visible">
            Awaiting connection...
          </div>
        </div>

        <Button
          onClick={() => handleDisconnectRequest()}
          style={connectRequest ? BUTTON_STYLES.LINK : BUTTON_STYLES.DEFAULT}
          text="Back"
        />
      </div>
    </div>
  );

  const heroSection = (
    <div className="flex lg:flex-row flex-col py-10 items-center">
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
      <motion.div
        className="w-full text-center px-5 sm:px-10 lg:text-left lg:w-1/2 flex flex-col"
        initial={appearVariants.hidden}
        animate={appearVariants.visible}
        variants={appearVariants}
      >
        <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mt-20 lg:mt-0">
          {' '}
          A credit scoring oracle for web 3.0
        </h1>
        <p className="text-lightgray mt-5 text-lg">
          SCRTSibyl is an oracle for credit scoring developed for the Secret
          Network. Get your credit score, and publish it to the Secret
          Blockchain to share.
        </p>
        <div className="flex mt-10 mx-auto lg:mx-0 flex-col items-center sm:flex-row">
          <div className="sm:mr-5 sm:mb-0 mb-5">
            {' '}
            {secretAddress ? (
              <Button
                text="Get Started"
                onClick={() => {
                  router.push('/start');
                }}
              />
            ) : (
              <Connect />
            )}
          </div>
          <Link href="/learn">
            <Button style={BUTTON_STYLES.OUTLINE} text="Learn more" />
          </Link>
        </div>
      </motion.div>
      <motion.div
        className="mx-auto reappear max-w-lg lg:w-1/2 flex px-10 sm:px-0 pt-10 lg:pt-0"
        animate={{
          x: [0, 25, 0, 25, 0],
          y: [25, 0, 25, 0],
          transition: {
            velocity: 500,
            duration: 5,
            repeat: Infinity,
            repeatType: 'mirror',
          },
        }}
      >
        <motion.img
          initial={appearVariants.hidden}
          animate={appearVariants.visible}
          variants={appearVariants}
          src="./images/hero-svg.svg"
          alt="hero-img"
        ></motion.img>
      </motion.div>
    </div>
  );

  const whySection = (
    <div className="flex flex-col items-center justify-center py-10">
      <h2 className="text-4xl font-extrabold mb-20">
        Why{' '}
        <span className="text-transparent bg-gradient-to-b from-purple to-deepblue bg-clip-text">
          SCRTsibyl?
        </span>
      </h2>

      <div className="flex flex-col lg:flex-row md:mt-0">
        <CardWithIcons
          title="Secure &#38; Private"
          img="./images/lock-icon.svg"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          vehicula pharetra quam ac ullamcorper."
        />
        <CardWithIcons
          title="Secure &#38; Private"
          img="./images/lock-icon.svg"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          vehicula pharetra quam ac ullamcorper."
        />
        <CardWithIcons
          title="Secure &#38; Private"
          img="./images/lock-icon.svg"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          vehicula pharetra quam ac ullamcorper."
        />
      </div>
    </div>
  );

  const howItWorksSection = (
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
          <StepBoxLeft
            title="Integrate with validators"
            img="./images/plaid+coinbase.svg"
            description="We acquire users' financial data by integrating with two validators : Plaid, Coinbase."
            style={{ marginBottom: '3rem' }}
          />
          <img
            src="./images/arrow-1.svg"
            alt="arrow-1"
            className="absolute top-40 -left-20 invisible md:visible"
          />
          <StepBoxRight
            title="Calculate financial score"
            img="./images/credit-gauge.svg"
            description="We run an algorithm on the given data to compute a score representing the financial health of a user."
            style={{ marginBottom: '3rem' }}
          />
          <img
            src="./images/arrow-2.svg"
            alt="arrow-2"
            className="absolute top-96 right-5 -z-10 invisible md:visible"
          />
          <StepBoxLeft
            title="Save it to the blockchain"
            img="./images/scrtnetwork-logo-white.svg"
            description="We save your score to the Secret blockchain via a CosmWasm smart contract."
            style={{ marginBottom: '3rem' }}
          />
          <img
            src="./images/arrow-3.svg"
            alt="arrow-3"
            className="absolute left-20 invisible md:visible"
          />
          <StepBoxRight
            title="Share your score"
            img="./images/workicon-combo.svg"
            description="Make your score available to service providers by granting permission or providing a public link."
            style={{ marginBottom: '3rem' }}
          />
        </div>
      ) : (
        <div className="relative">
          <StepBoxRight
            title="Algorithm calculates financial score"
            img="./images/provider-step1.svg"
            description="Applicants will get a score that is calculated by an algorithm based on their financial data retrieved by two validators: Plaid, Coinbase."
            style={{ marginBottom: '3rem' }}
          />
          <img
            src="./images/arrow-2.svg"
            alt="arrow-2"
            className="absolute invisible md:visible right-10 top-40"
          />
          <StepBoxLeft
            title="Share financial score"
            img="./images/provider-step2.svg"
            description="Once the applicants get their scores, they can share their score by giving you permission or providing a public link."
            style={{ marginBottom: '3rem' }}
          />
          <img
            src="./images/arrow-1.svg"
            alt="arrow-1"
            className="absolute top-80 -left-20 invisible md:visible"
          />
          <StepBoxRight
            title="View your applicants' scores"
            img="./images/provider-step3.svg"
            description="Check your applicants' scores by entering the Name of Permission, Public Address, and Signature, provided by the applicant."
            style={{ marginBottom: '3rem' }}
          />
        </div>
      )}
    </div>
  );

  const ctaSection = (
    <div className="flex justify-center mb-10">
      <div className="flex flex-col items-center bg-gradient-to-r from-purple to-deepblue py-10 px-10 md:px-20 lg:px-40 mb-10 rounded-3xl">
        <h3 className="font-white font-bold text-xl md:text-2xl text-center">
          Get your credit score, <br /> and publish it to the blockchain
          securely.
        </h3>
        <p className="text-lightgray text-center md:max-w-sm font-light mt-3">
          Simply connect to your Keplr wallet to get started!
        </p>
        <div className="mt-5">
          {secretAddress ? (
            <Button
              text="Get Started"
              style={BUTTON_STYLES.OUTLINE}
              onClick={() => {
                router.push('/start');
              }}
            />
          ) : (
            <Connect />
          )}
        </div>
      </div>
    </div>
  );

  const landingPageView = (
    <>
      {heroSection}
      {whySection}
      {howItWorksSection}
      {ctaSection}
    </>
  );

  if (loading) {
    return (
      <Layout>
        <LogoLoader />
      </Layout>
    );
  }

  return <>{connectRequest ? awaitingConnectionView : landingPageView}</>;
};

export default Home;
