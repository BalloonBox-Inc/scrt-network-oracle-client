import router from 'next/router';

import Button, { BUTTON_STYLES } from '../Button';
import Connect from '../connect';

export default function CtaSection({
  secretAddress,
}: {
  secretAddress: string | null;
}) {
  return (
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
}
