import React, { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import whiteLogo from '@scrtsybil/public/images/scrt-logo-horizaontal-white.svg';
import Connect from '@scrtsybil/src/components/connect';
import { useSecretContext } from '@scrtsybil/src/context';

export default function Header() {
  const { secretAddress } = useSecretContext();
  const [showWallet, setShowWallet] = useState<boolean>(false);

  const router = useRouter();
  const routerIsMain =
    router?.pathname === '/' || router?.pathname === '/learn';

  return (
    <header
      style={{ height: '80px' }}
      className={`sticky top-0 z-20 ${
        routerIsMain ? 'bg-black/50' : 'bg-black border-gray-800 border-b-2'
      } w-full relative z-10 font-sans px-5 py-0 flex items-center justify-between text-white`}
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
        <Link passHref={true} href="/learn">
          <p
            className={`mr-5 text-xs sm:text-sm md:text-base text-center cursor-pointer hover:text-purple ${
              showWallet ? 'disappear' : 'reappear'
            }`}
          >
            Learn
          </p>
        </Link>
        {secretAddress && (
          <Link passHref={true} href={'/start'}>
            <p
              className={`mr-5 text-xs sm:text-sm md:text-base text-center cursor-pointer hover:text-purple ${
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
