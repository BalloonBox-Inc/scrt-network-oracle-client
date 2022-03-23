import { useEffect } from 'react';

import { notification } from 'antd';
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
  router: any;
  setAwaitingScoreResponse: any;
}

const LaunchLink = (props: Props) => {
  const { setScoreResponsePlaid, scoreResponsePlaid } = useSecretContext();
  const onSuccess = async (publicToken: string, metadata: any) => {
    const { plaid_score_res } = await exchangePlaidToken({ publicToken });

    if (plaid_score_res.status_code === 200) {
      setScoreResponsePlaid(plaid_score_res);
    } else {
      props.router.replace('/applicant/generate');
      notification.error({
        message: NOTIFICATIONS.PLAID_CONNECTION_ERROR,
      });
    }
    props.setAwaitingScoreResponse(false);
  };

  const config: PlaidLinkOptionsWithLinkToken = {
    onSuccess,
    token: props.token,
  };

  const { open } = usePlaidLink(config);

  useEffect(() => {
    !scoreResponsePlaid && open();
  }, [open, scoreResponsePlaid]);

  return null;
};
export default LaunchLink;
