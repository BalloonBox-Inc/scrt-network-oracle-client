import { AppProps } from 'next/app';

import Layout from '@scrtsybil/src/components/Layout';
import { ContextProvider } from '@scrtsybil/src/context';

import 'antd/dist/antd.dark.min.css';
import '@scrtsybil/src/styles.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ContextProvider>
  );
};

export default MyApp;
