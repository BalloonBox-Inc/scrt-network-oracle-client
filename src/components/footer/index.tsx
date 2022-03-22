import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import whiteLogo from '@scrtsybil/public/images/scrt-logo-horizaontal-white.svg';
import scrtLogo from '@scrtsybil/public/images/scrtnetwork-logo-white.svg';

export default function Footer() {
  const router = useRouter();
  const routerIsHome = router.pathname === '/';
  return (
    <footer
      className={`z-50 border-t-2 border-gray-800 w-full p-5 flex justify-between items-end bg-black text-white bg-cover font-sans ${
        routerIsHome ? 'bg-footer-wave' : undefined
      }`}
    >
      <div>
        <div>
          <Link passHref={true} href="/">
            <a>
              <Image
                src={whiteLogo}
                width={'100%'}
                height={'40%'}
                alt="scrtsibyl-logo"
                className="cursor-pointer"
              />
            </a>
          </Link>
        </div>
        <p className="pl-3 text-xs">
          &copy; {new Date().getFullYear()} SCRTsibyl
        </p>
      </div>
      <div className="flex items-center">
        <p className="text-xs pt-3 mr-2">secured by</p>
        <a href="https://scrt.network/" target="_blank" rel="noreferrer">
          <Image
            src={scrtLogo}
            width={'100%'}
            height={'40%'}
            alt="scrt-network-logo"
            className="cursor-pointer"
          />
        </a>
      </div>
    </footer>
  );
}