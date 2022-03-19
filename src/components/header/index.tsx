import React, { useState } from 'react';

import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import whiteLogo from '@scrtsybil/public/images/scrt-logo-horizaontal-white.svg';
import Connect from '@scrtsybil/src/components/connect';
import { useSecretContext } from '@scrtsybil/src/context';

export default function Header() {
  const { secretAddress } = useSecretContext();
  const router = useRouter();
  const [menuToggle, setMenuToggle] = useState(false);

  const routerIsMain = router.pathname === '/' || router.pathname === '/learn';

  return (
    <div className="sticky top-0 z-20">
      <header
        className={`${
          routerIsMain ? 'bg-black/50' : 'bg-black border-b-2 border-gray-800'
        } font-sans z-10 text-white`}
      >
        <div className="mx-auto px-10">
          <div className="w-full flex justify-between">
            <Link passHref={true} href="/">
              <Image
                src={whiteLogo}
                width={'140%'}
                height={'100%'}
                alt="scrtsibyl-logo"
                className="cursor-pointer"
              />
            </Link>

            <div className="items-center flex">
              <div className="hidden sm:flex items-center">
                <Link passHref={true} href="/learn">
                  <p className="mr-5 cursor-pointer hover:text-purple">
                    Learn more
                  </p>
                </Link>
                {secretAddress && (
                  <Link passHref={true} href={'/start'}>
                    <p className="mr-5 cursor-pointer hover:text-purple">
                      Get started
                    </p>
                  </Link>
                )}
                <Connect />
              </div>

              <div className="mr-5 block sm:hidden">
                {!menuToggle ? (
                  <MenuOutlined
                    onClick={() => {
                      setMenuToggle(true);
                    }}
                    className="text-xl cursor-pointer hover:text-purple"
                  />
                ) : (
                  <CloseOutlined
                    onClick={() => {
                      setMenuToggle(false);
                    }}
                    className="text-xl cursor-pointer hover:text-purple"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`${
            !menuToggle ? 'hidden' : ''
          } sm:hidden flex flex-col items-center py-5 bg-black`}
        >
          <Link passHref={true} href="/learn">
            <p className="mb-5 cursor-pointer hover:text-purple">Learn more</p>
          </Link>

          {secretAddress && (
            <Link passHref={true} href={'/start'}>
              <p className="mb-5 cursor-pointer hover:text-purple">
                Get started
              </p>
            </Link>
          )}

          <Connect />
        </div>
      </header>
    </div>
  );
}
