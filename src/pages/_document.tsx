import Document, { Html, Head, Main, NextScript } from 'next/document';

import { AppConfig } from '@scrtsybil/src/utils/AppConfig';

class MyDocument extends Document {
  render() {
    return (
      <Html lang={AppConfig.locale}>
        <Head>
          <link rel="shortcut icon" href="/favicon/favicon.svg" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
