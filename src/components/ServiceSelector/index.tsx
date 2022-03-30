import { BORDER_GRADIENT_STYLE } from '@scrtsybil/src/constants';

const ServiceSelector = ({ selected, onClick, text, title }: any) => {
  const contentWithTitle = (
    <div className="text-left ">
      <h3 className="text-lg sm:text-xl">{title}</h3>
      <p className="text-xs font-thin">{text}</p>
    </div>
  );

  const contentWithoutTitle = (
    <div className="text-center">
      <p className="text-base ">{text}</p>
    </div>
  );
  return (
    <div
      className="flex z-50 justify-center w-80  sm:w-115  rounded-md p-1 "
      style={{
        background: selected ? BORDER_GRADIENT_STYLE : 'transparent',
      }}
    >
      <div
        onClick={onClick}
        className={`bg-gray-900  cursor-pointer w-full  rounded-md p-5 px-8`}
      >
        {title ? contentWithTitle : contentWithoutTitle}
      </div>
    </div>
  );
};

export default ServiceSelector;
