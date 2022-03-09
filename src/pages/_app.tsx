import { AppProps } from 'next/app';

import Connect from '@scrtsybil/src/components/connect';
import { ContextProvider } from '@scrtsybil/src/context';

import '@scrtsybil/src/styles.css';
import 'antd/dist/antd.dark.min.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ContextProvider>
      {!process.env.IN_PROGRESS && <Connect />}
      <Component {...pageProps} />
    </ContextProvider>
  );
};

export default MyApp;
