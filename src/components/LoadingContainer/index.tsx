import ClipLoader from 'react-spinners/ClipLoader';

export const LoadingContainer = ({
  text = 'Requesting Score, this may take a minute.',
}: {
  text: String;
}) => (
  <div className="w-full flex-col  flex justify-center items-center z-50">
    <ClipLoader
      speedMultiplier={0.75}
      size={120}
      color={'rgba(85,42,170, 10)'}
    />
    <p className="mt-5 text-sm">{text}</p>
  </div>
);