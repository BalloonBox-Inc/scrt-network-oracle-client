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
  const { setScoreResponse, scoreResponse, setPlaidPublicToken } =
    useSecretContext();

  const handleError = async (onExit: boolean) => {
    props.setAwaitingScoreResponse(false);
    props.router.replace('/applicant/generate');
    props.setStartPlaidLink(false);
    notification.error({
      message: onExit
        ? NOTIFICATIONS.PLAID_CLOSED
        : NOTIFICATIONS.PLAID_CONNECTION_ERROR,
    });
    setPlaidPublicToken(null);
  };

  const onSuccess = async (publicToken: string, metadata: any) => {
    const { plaid_score_res } = await exchangePlaidToken({ publicToken });
    if (plaid_score_res.status_code === 200) {
      router.replace('/applicant/generate?type=plaid&status=success');
      setScoreResponse(plaid_score_res);
    } else {
      handleError(false);
    }
    props.setAwaitingScoreResponse(false);
  };

  const onExit = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _error: null | PlaidLinkError,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _metadata: PlaidLinkOnExitMetadata
  ) => {
    // if user closes the SDK, throw the error
    handleError(true);
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
