import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import whiteLogo from '@scrtsybil/public/images/scrt-logo-horizaontal-white.svg';
import Connect from '@scrtsybil/src/components/connect';
import { useSecretContext } from '@scrtsybil/src/context';

export default function Header() {
  const { secretAddress } = useSecretContext();
  return (
    <header className="w-full relative z-10 font-sans bg-black px-5 py-0 flex items-center justify-between text-white border-b-2 border-gray-800">
      <Link passHref={true} href="/">
        <Image
          src={whiteLogo}
          width={'140%'}
          height={'100%'}
          alt="scrtsibyl-logo"
          className="cursor-pointer"
        />
      </Link>
      <div className="flex items-center">
        <Link passHref={true} href="/">
          <p className="mr-5 cursor-pointer hover:text-purple">Learn more</p>
        </Link>
        {secretAddress && (
          <Link passHref={true} href={'/start'}>
            <p className="mr-5 cursor-pointer hover:text-purple">Get started</p>
          </Link>
        )}
        <Connect />
      </div>
    </header>
  );
}
