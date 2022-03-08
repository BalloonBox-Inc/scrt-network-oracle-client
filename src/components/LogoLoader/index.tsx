const logo = '../../images/scrtLogo.svg';

const LogoLoader = ({
  text,
  className,
}: {
  text?: string;
  className?: string;
}) => {
  return (
    <div
      className={`w-full flex justify-center h-screen items-center flex-col ${className}`}
    >
      <img alt="spinning_logo" className="spin w-14 mb-3" src={logo} />
      <p>{text || 'Loading'}</p>
    </div>
  );
};

export default LogoLoader;
