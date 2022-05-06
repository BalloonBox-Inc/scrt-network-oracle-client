import { motion } from 'framer-motion';
import router from 'next/router';

import Button, { BUTTON_STYLES } from '../Button';
import Connect from '../connect';

export default function HeroSection({
  secretAddress,
}: {
  secretAddress: string | null;
}) {
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
  return (
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
      <div className="w-full text-center px-5 sm:px-10 lg:text-left lg:w-1/2 flex flex-col">
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

          <Button
            style={BUTTON_STYLES.OUTLINE}
            text="Learn more"
            onClick={() => router.push('/learn')}
          />
        </div>
      </div>

      <motion.div
        className="mx-auto  max-w-lg lg:w-1/2 flex px-10 sm:px-0 pt-10 lg:pt-0"
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
          animate={appearVariants.visible}
          variants={appearVariants}
          width="600px"
          height="600px"
          src="./images/hero-svg.svg"
          alt="hero-img"
        />
      </motion.div>
    </div>
  );
}
