import { WarningOutlined } from '@ant-design/icons';

const TestBanner = () => {
  return (
    <div className="top-20 w-full bg-purple/60 z-50 px-5 py-4 flex xs:flex-row flex-col justify-center items-center absolute">
      <p className="text-center sm:text-sm text-xs">
        <WarningOutlined style={{ fontSize: '1rem', marginRight: '0.4rem' }} />{' '}
        This is a testnet environment. The funds are not real. &nbsp;{' '}
      </p>
    </div>
  );
};

export default TestBanner;
