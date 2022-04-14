import React, { useState, useEffect, useCallback } from 'react';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import whiteLogo from '@scrtsybil/public/images/scrt-logo-horizaontal-white.svg';
import Connect from '@scrtsybil/src/components/connect';
import { useSecretContext } from '@scrtsybil/src/context';

export default function Header() {
  const { secretAddress } = useSecretContext();
  const [showWallet, setShowWallet] = useState<boolean>(false);
  const [shrinkHeader, setShrinkHeader] = useState<boolean>(false);
  const router = useRouter();
  const routerIsMain =
    router?.pathname === '/' || router?.pathname === '/learn';

  const handleScroll = useCallback(() => {
    setTimeout(() => {
      if (window.scrollY < 1 || !routerIsMain) {
        setShrinkHeader(false);
      } else setShrinkHeader(true);
    }, 200);
  }, [router]);

  useEffect(() => {
    if (typeof window !== undefined) {
      window.addEventListener('scroll', handleScroll);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <motion.header
      style={{
        height: shrinkHeader ? '60px' : '80px',
        transition: '0.4s',

        zIndex: '100',
      }}
      className={`sticky top-0 ${
        shrinkHeader ? 'px-10 bg-black' : 'px-5'
      } relative z-10 w-full font-sans py-0 flex items-center justify-between text-white ${
        !routerIsMain && 'bg-black border-gray-800 border-b-2'
      } `}
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
            className={`mr-5 text-xs sm:text-sm md:text-base text-center cursor-pointer hover:text-gray-400 ${
              showWallet ? 'disappear' : 'reappear'
            }`}
          >
            Learn
          </p>
        </Link>
        {secretAddress && (
          <Link passHref={true} href={'/start'}>
            <p
              className={`mr-5 text-xs sm:text-sm md:text-base text-center cursor-pointer hover:text-gray-400 ${
                showWallet ? 'disappear' : 'reappear'
              }`}
            >
              Start
            </p>
          </Link>
        )}
        <Connect showWallet={showWallet} setShowWallet={setShowWallet} />
      </div>
    </motion.header>
  );
}
