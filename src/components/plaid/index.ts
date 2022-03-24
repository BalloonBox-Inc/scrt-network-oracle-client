import { useEffect } from 'react';

import { notification } from 'antd';
import router from 'next/router';
import {
  usePlaidLink,
  PlaidLinkOptionsWithLinkToken,
  PlaidLinkError,
  PlaidLinkOnExitMetadata,
} from 'react-plaid-link';

import { NOTIFICATIONS } from '@scrtsybil/src/constants';
import { useSecretContext } from '@scrtsybil/src/context';
import { exchangePlaidToken } from '@scrtsybil/src/services';

interface Props {
  isOauth?: boolean;
  token: string;
  userId?: number;
  itemId?: number | null;
  children?: React.ReactNode;
  router: any;
  setAwaitingScoreResponse: any;
  setStartPlaidLink: any;
}

const LaunchLink = (props: Props) => {
  const { setScoreResponse, scoreResponse } = useSecretContext();
  const onSuccess = async (publicToken: string, metadata: any) => {
    const { plaid_score_res } = await exchangePlaidToken({ publicToken });
    if (plaid_score_res.status_code === 200) {
      router.replace('/applicant/generate?type=plaid&status=success');
      setScoreResponse(plaid_score_res);
    } else {
      props.router.replace('/applicant/generate');
      notification.error({
        message: NOTIFICATIONS.PLAID_CONNECTION_ERROR,
      });
    }
    props.setAwaitingScoreResponse(false);
  };

  const onExit = async (
    error: null | PlaidLinkError,
    metadata: PlaidLinkOnExitMetadata
  ) => {
    props.setAwaitingScoreResponse(false);
    props.router.replace('/applicant/generate');
    props.setStartPlaidLink(false);
    notification.error({
      message: NOTIFICATIONS.PLAID_CLOSED,
    });
  };

  const config: PlaidLinkOptionsWithLinkToken = {
    onSuccess,
    token: props.token,
    onExit,
  };

  const { open } = usePlaidLink(config);

  useEffect(() => {
    if (scoreResponse?.endpoint.includes('plaid')) {
      router.replace('/applicant/generate?type=plaid&status=success');
    } else {
      open();
    }
  }, [open, scoreResponse]);

  return null;
};
export default LaunchLink;
