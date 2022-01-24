const LandingLogo = './images/LandingLogo.svg';
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
        style={{ minHeight: '15rem', width: '100vw' }}
        src={LandingLogo}
      />

      <div
        style={{
          position: 'absolute',
          transform: 'translate(50%, -50%)',
          right: '50%',
          width: '13em',
          top: '50%',
        }}
      >
        <img alt="scrtLogo" src={SecretLogo} />
      </div>
    </div>
  );
};

export default LogoWithWaves;
