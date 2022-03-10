const landingLogo = '/images/landingLogo.svg';
const SecretLogo = './images/scrtLogo.svg';

const LogoWithWaves = () => {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        margin: '4rem 0',
      }}
    >
      <img
        alt="lines"
        style={{ minHeight: '12rem', width: '100vw' }}
        src={landingLogo}
      />
      <div
        style={{
          position: 'absolute',
          transform: 'translate(50%, -50%)',
          right: '50%',
          width: '13em',
          top: '50%',
        }}
        className="w-10 "
      >
        <img
          alt="scrtLogo"
          className="w-2/4 ml-12 md:ml-0 md:w-full"
          src={SecretLogo}
        />
      </div>
    </div>
  );
};

export default LogoWithWaves;
