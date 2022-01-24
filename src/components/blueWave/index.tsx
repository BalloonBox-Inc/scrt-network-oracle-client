const BlueWave = () => {
  return (
    <div
      className="z-0"
      style={{ position: 'absolute', right: '0', bottom: '0' }}
    >
      <img
        alt="blueWaves"
        style={{
          width: '100%',
          objectFit: 'cover',
          objectPosition: '70px 0',
        }}
        src={'./images/blueWave.svg'}
      />
    </div>
  );
};

export default BlueWave;
