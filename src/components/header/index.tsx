import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Connect from '@scrtsybil/src/components/connect';
import TestBanner from '@scrtsybil/src/components/TestBanner';
import { IS_MAINNET } from '@scrtsybil/src/constants';
import { useSecretContext } from '@scrtsybil/src/context';

export default function Header() {
  const { secretAddress } = useSecretContext();
  const [showWallet, setShowWallet] = useState<boolean>(false);
  const [shrinkHeader, setShrinkHeader] = useState<boolean>(false);
  const router = useRouter();

  const isOnTestnet = useMemo(() => {
    if (typeof window !== 'undefined') {
      return (
        window.location.href.includes('test') ||
        window.location.href.includes('localhost')
      );
    }
    return false;
  }, []);

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
    <div className="flex-col flex">
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
            <img
              src={'/images/scrt-logo-horizaontal-white.svg'}
              width={140}
              height={100}
              alt="scrtsibyl-logo"
              className={`cursor-pointer ${
                showWallet ? 'disappear' : 'reappear'
              }`}
            />
          </a>
        </Link>

        <div className="flex items-center min-h-full">
          <div className={`flex items-center`}>
            <Link
              passHref={true}
              href={
                !IS_MAINNET
                  ? 'https://www.secretsibyl.com/'
                  : 'https://test.secretsibyl.com/'
              }
            >
              <p
                className={`mr-5 text-xs font-semibold text-lightblue sm:text-sm md:text-base text-center cursor-pointer hover:text-blue-500 ${
                  showWallet ? 'disappear' : 'reappear'
                }`}
              >
                {!IS_MAINNET ? 'Use Mainnet' : 'Use Testnet'}
              </p>
            </Link>
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
        </div>
      </motion.header>
      {!IS_MAINNET && <TestBanner />}
    </div>
  );
}
