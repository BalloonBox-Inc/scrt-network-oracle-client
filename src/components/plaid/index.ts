import { useEffect } from 'react';

import { notification } from 'antd';
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
  const { setPlaidPublicExchangeResponse, setPlaidMetadata } =
    useSecretContext();

  const onSuccess = async (publicToken: string, metadata: any) => {
    const plaidTokenRes: ItemPublicTokenExchangeResponse =
      await exchangePlaidToken({ publicToken });
    if (metadata) {
      setPlaidMetadata(metadata);
    }
    if (plaidTokenRes.access_token) {
      setPlaidPublicExchangeResponse(plaidTokenRes);
      notification.success({
        message: NOTIFICATIONS.PLAID_CONNECTION_SUCCESS,
      });
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

  useEffect(() => {
    open();
  }, [open]);

  return null;
};
export default LaunchLink;
