import { motion } from 'framer-motion';

import { ISectionElement } from './types';

export default function CardWithIcons({
  title,
  img,
  description,
}: ISectionElement) {
  return (
    <motion.div
      className="bg-black rounded-lg flex flex-col items-center px-5 py-10 mt-10 lg:mt-0 md:w-72 mr-0 md:mr-10"
      whileHover={{ scale: 1.05 }}
    >
      <img src={img} alt="icon" className="max-w-sm mb-7" />
      <h3 className="text-lg font-extrabold mb-5">{title}</h3>
      <p className="text-lightgray text-center font-light">{description} </p>
    </motion.div>
  );
}
