import React, { useState, useEffect, useCallback } from 'react';

import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Connect from '@scrtsybil/src/components/connect';
import TestBanner from '@scrtsybil/src/components/TestBanner';
import { useSecretContext } from '@scrtsybil/src/context';

export default function Header() {
  const { secretAddress } = useSecretContext();
  const [showWallet, setShowWallet] = useState<boolean>(false);
  const [shrinkHeader, setShrinkHeader] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState<number | null>(null);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
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

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    if (typeof window !== undefined) {
      window.addEventListener('resize', handleResize);
    }
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (windowSize && windowSize < 500) setIsMobile(true);
  }, [windowSize]);

  return (
    <>
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
          {isMobile ? (
            <div
              style={{ fontSize: '1.5rem', marginRight: '1rem' }}
              onClick={() => setOpenMenu(!openMenu)}
              className={`${
                showWallet ? 'disappear' : 'appear'
              } cursor-pointer hover:text-gray-400`}
            >
              {openMenu ? <CloseOutlined /> : <MenuOutlined />}
            </div>
          ) : (
            <div className={`flex items-center`}>
              <div
                className={`bg-purple/40 text-xs sm:text-sm mr-4 px-3 py-2 rounded-lg ${
                  showWallet ? 'disappear' : 'reappear'
                }`}
              >
                {' '}
                <a
                  href={`${
                    process.env.NODE_ENV === 'development'
                      ? 'https://www.secretsibyl.com/'
                      : 'https://www.test.secretsibyl.com'
                  }`}
                >
                  {process.env.NODE_ENV === 'development'
                    ? 'Switch to mainnet'
                    : 'Switch to testnet'}
                </a>
              </div>
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
            </div>
          )}
          <Connect showWallet={showWallet} setShowWallet={setShowWallet} />
        </div>
      </motion.header>

      {isMobile && openMenu && (
        <>
          <div
            className={`absolute top-20 flex flex-col w-full items-center z-20`}
          >
            <div
              className={`w-full text-center py-5 bg-black hover:bg-neutral-800 cursor-pointer`}
            >
              {' '}
              <a
                href={`${
                  process.env.NODE_ENV === 'development'
                    ? 'https://www.secretsibyl.com/'
                    : 'https://www.test.secretsibyl.com'
                }`}
              >
                {process.env.NODE_ENV === 'development'
                  ? 'Switch to mainnet'
                  : 'Switch to testnet'}
              </a>
            </div>

            <div
              className={`w-full text-center py-5 bg-black hover:bg-neutral-800 cursor-pointer`}
            >
              Learn
            </div>

            {secretAddress && (
              <div
                className={`w-full text-center py-5 bg-black hover:bg-neutral-800 cursor-pointer`}
              >
                Start
              </div>
            )}
          </div>
        </>
      )}
      <TestBanner />
    </>
  );
}
