import ClipLoader from 'react-spinners/ClipLoader';

export const LoadingContainer = ({
  text = 'Requesting score, this may take a minute.',
}: {
  text: String;
}) => (
  <div className="w-full flex-col  flex justify-center items-center z-50">
    <ClipLoader
      speedMultiplier={0.75}
      size={120}
      color={'rgba(85,42,170, 10)'}
    />
    <p data-testid="loading-text" className="mt-5 text-sm">
      {text}
    </p>
  </div>
);
