import React from 'react';

import Link from 'next/link';

import Connect from '@scrtsybil/src/components/connect';

export default function Header() {
  return (
    <header className="w-full font-sans bg-black p-5 flex items-center justify-between text-white">
      <Link href="/">
        <img
          src="./images/scrt-logo-horizaontal-white.svg"
          style={{ width: '10rem', cursor: 'pointer' }}
          alt="scrtsibyl-logo"
        />
      </Link>
      <div className="flex items-center">
        <Link href="/">
          <p className="mr-5 cursor-pointer hover:text-purple">Learn more</p>
        </Link>
        <Link href="/">
          <p className="mr-5 cursor-pointer hover:text-purple">Get started</p>
        </Link>
        <Connect />
      </div>
    </header>
  );
}
