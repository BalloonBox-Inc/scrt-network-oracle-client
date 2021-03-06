import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Footer() {
  const router = useRouter();
  const routerIsMain =
    router?.pathname === '/' || router?.pathname === '/learn';
  return (
    <footer
      className={`z-50 border-t-2 border-gray-800 w-full p-5 flex flex-row justify-between bg-black text-white bg-cover font-sans ${
        routerIsMain ? 'bg-footer-wave items-end' : 'items-center'
      }`}
    >
      <div>
        <div className={`${routerIsMain ? 'block' : 'hidden'}`}>
          <Link passHref={true} href="/">
            <a>
              <img
                src="/images/scrt-logo-horizaontal-white.svg"
                width={100}
                height={40}
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
      <div className="flex items-center flex-col sm:flex-row ">
        <p className="text-xs pt-3 mr-2">secured by</p>
        <a href="https://scrt.network/" target="_blank" rel="noreferrer">
          <img
            src={'/images/scrtnetwork-logo-white.svg'}
            width="100px"
            height="40px"
            alt="scrt-network-logo"
            className="cursor-pointer"
          />
        </a>
      </div>
    </footer>
  );
}
