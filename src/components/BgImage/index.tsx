import { useEffect, useState } from 'react';

import Image from 'next/image';

import diagonalWaves from '@scrtsybil/public/images/diagonalWaves.svg';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

const BgImage = () => {
  const [width, setWidth] = useState<number>();
  const [height, setheight] = useState<number>();

  useEffect(() => {
    if (typeof window !== undefined) {
      const windowDimensions = getWindowDimensions();

      setWidth(windowDimensions.width);
      setheight(windowDimensions.height);
    }
  }, []);

  useEffect(() => {
    function handleResize() {
      const windowDimensions = getWindowDimensions();

      setWidth(windowDimensions.width);

      setheight(windowDimensions.height);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="absolute z-0 left-0 top-0 opacity-30">
      <Image
        alt="diagonal-waves"
        src={diagonalWaves}
        width={width}
        height={height}
        className="z-0"
      />
    </div>
  );
};

export default BgImage;
