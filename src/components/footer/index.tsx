import Link from 'next/link';
import { useRouter } from 'next/router';

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
          <Link href="/">
            <img
              src="./images/scrt-logo-horizaontal-white.svg"
              style={{ width: '7rem', cursor: 'pointer' }}
              alt="scrtsibyl-logo-white"
            />
          </Link>
        </div>
        <p className="pl-3 text-xs">
          &copy; {new Date().getFullYear()} SCRTsibyl
        </p>
      </div>
      <div className="flex items-center">
        <p className="text-xs pt-3 mr-2">secured by</p>
        <a href="https://scrt.network/" target="_blank" rel="noreferrer">
          <img
            src="./images/scrtnetwork-logo-white.svg"
            style={{ width: '6rem', cursor: 'pointer' }}
            alt="scrtnetwork-logo"
          />
        </a>
      </div>
    </footer>
  );
}
