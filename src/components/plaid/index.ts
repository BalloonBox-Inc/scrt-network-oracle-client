import { useEffect } from 'react';

import { notification } from 'antd';
import { Router, useRouter } from 'next/router';
import { ItemPublicTokenExchangeResponse } from 'plaid';
import { usePlaidLink, PlaidLinkOptionsWithLinkToken } from 'react-plaid-link';

import { NOTIFICATIONS } from '@scrtsybil/src/constants';
import { useSecretContext } from '@scrtsybil/src/context';
import { exchangePlaidToken } from '@scrtsybil/src/services';

interface Props {
  isOauth?: boolean;
  token: string;
  userId?: number;
  itemId?: number | null;
  children?: React.ReactNode;
}

const LaunchLink = (props: Props) => {
  const { setScoreResponse, scoreResponse } = useSecretContext();
  const onSuccess = async (publicToken: string, metadata: any) => {
    const { plaid_score_res } = await exchangePlaidToken({ publicToken });

    if (plaid_score_res.status_code === 200) {
      setScoreResponse(plaid_score_res);
    } else {
      notification.error({
        message: NOTIFICATIONS.PLAID_CONNECTION_ERROR,
      });
    }
  };

  const config: PlaidLinkOptionsWithLinkToken = {
    onSuccess,
    token: props.token,
  };

  const { open } = usePlaidLink(config);
  console.log({ scoreResponse });
  useEffect(() => {
    !scoreResponse && open();
  }, [open, scoreResponse]);

  return null;
};
export default LaunchLink;
