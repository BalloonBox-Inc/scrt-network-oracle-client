import React, { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import whiteLogo from '@scrtsybil/public/images/scrt-logo-horizaontal-white.svg';
import Connect from '@scrtsybil/src/components/connect';
import { useSecretContext } from '@scrtsybil/src/context';

export default function Header() {
  const { secretAddress } = useSecretContext();
  const [showWallet, setShowWallet] = useState<boolean>(false);

  return (
    <header
      style={{ height: '80px' }}
      className="w-full relative z-10 font-sans bg-black px-5 py-0 flex items-center justify-between text-white border-b-2 border-gray-800"
    >
      <Link passHref={true} href="/">
        <a className="mt-1">
          <Image
            src={whiteLogo}
            width={'140%'}
            height={'100%'}
            alt="scrtsibyl-logo"
            className={`cursor-pointer ${
              showWallet ? 'disappear' : 'reappear'
            }`}
          />
        </a>
      </Link>

      <div className="flex items-center min-h-full">
        <Link passHref={true} href="/">
          <p
            className={`mr-5 text-xs sm:text-sm md:text-base text-center cursor-pointer  hover:text-purple  ${
              showWallet ? 'disappear' : 'reappear'
            }`}
          >
            Learn
          </p>
        </Link>
        {secretAddress && (
          <Link passHref={true} href={'/start'}>
            <p
              className={`mr-5 text-xs sm:text-sm md:text-base text-center cursor-pointer  hover:text-purple ${
                showWallet ? 'disappear' : 'reappear'
              }`}
            >
              Start
            </p>
          </Link>
        )}
        <Connect showWallet={showWallet} setShowWallet={setShowWallet} />
      </div>
    </header>
  );
}
