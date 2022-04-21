import { motion } from 'framer-motion';

import { ISectionElement } from './types';

export default function StepBox({
  title,
  img,
  description,
  style,
  side,
}: ISectionElement) {
  return (
    <motion.div
      className={`bg-black rounded-lg flex flex-col sm:flex-row py-10 px-10 ${
        side === 'left' ? 'mr-0 md:mr-40' : 'ml-0 md:ml-40'
      } `}
      style={style}
      initial={side === 'left' ? { x: -100 } : { x: 100 }}
      animate={{ x: 0 }}
    >
      {side === 'left' ? (
        <>
          <img src={img} alt="icon" className="sm:w-48 mr-10 mb-10 sm:mb-0" />
          <div>
            <h3 className="text-lg font-extrabold mb-5">{title}</h3>
            <p className="text-lightgray max-w-sm font-light">{description} </p>
          </div>
        </>
      ) : (
        <>
          <div>
            <h3 className="text-lg font-extrabold mb-5">{title}</h3>
            <p className="text-lightgray max-w-sm font-light">{description} </p>
          </div>
          <img src={img} alt="icon" className="mt-10 sm:mt-0 sm:w-40 ml-10" />
        </>
      )}
    </motion.div>
  );
}
