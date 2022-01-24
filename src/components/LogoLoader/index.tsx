const LogoLoader = ({ text }: { text?: string }) => {
  return (
    <div className="w-full flex justify-center h-screen items-center flex-col">
      <img
        alt="spinning_logo"
        className="spin w-14 mb-3"
        src={'./images/scrtLogo.svg'}
      />
      <p>{text || 'Loading'}</p>
    </div>
  );
};

export default LogoLoader;
