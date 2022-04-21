import React from 'react';

import dynamic from 'next/dynamic';

import HeroSection from '@scrtsybil/src/components/home/HeroSection';
import { useSecretContext } from '@scrtsybil/src/context';

const AwaitingConnectionView = dynamic(
  () => import('@scrtsybil/src/components/home/AwaitingConnectionView')
);

const CtaSection = dynamic(() => import('../components/home/CtaSection'));
const HowItWorksSection = dynamic(
  () => import('../components/home/HowItWorksSection')
);
const WhySection = dynamic(() => import('../components/home/WhySection'));

const Home = () => {
  const { secretAddress, connectRequest } = useSecretContext();

  const landingPageView = (
    <>
      <HeroSection secretAddress={secretAddress} />
      <WhySection />
      <HowItWorksSection />
      <CtaSection secretAddress={secretAddress} />
    </>
  );

  return <>{connectRequest ? <AwaitingConnectionView /> : landingPageView}</>;
};

export default Home;
