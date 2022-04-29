import { WarningOutlined } from '@ant-design/icons';

const TestBanner = () => {
  return (
    <div className="sticky w-full bg-purple/60 z-10 flex sm:flex-row flex-col justify-center items-center py-4">
      <WarningOutlined style={{ fontSize: '1.1rem', marginRight: '0.4rem' }} />{' '}
      <p className="text-center sm:text-sm text-xs">
        This is a testnet environment. The funds are not real. &nbsp;
      </p>
      <a
        href={`${
          process.env.NODE_ENV === 'development'
            ? 'https://www.secretsibyl.com/'
            : 'https://www.test.secretsibyl.com'
        }`}
        className="underline sm:text-sm text-xs"
      >
        {process.env.NODE_ENV === 'development'
          ? 'Switch to mainnet'
          : 'Switch to testnet'}
      </a>
    </div>
  );
};

export default TestBanner;
