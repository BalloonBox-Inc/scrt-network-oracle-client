import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-5 2xl:px-36 px-5 sm:px-16 flex justify-between items-end bg-black text-white bg-footer-wave bg-cover font-sans">
      <div>
        <div>
          <Link href="/">
            <img
              src="./images/scrt-logo-horizaontal-white.svg"
              style={{ width: '10rem', cursor: 'pointer' }}
              alt="scrtsibyl-logo-white"
            />
          </Link>
        </div>
        <p className="pl-3 text-sm">
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
