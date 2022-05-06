import { useSecretContext } from '@scrtsybil/src/context';

import Button, { BUTTON_STYLES } from '../Button';

const keplr = '/images/keplr.svg';

export default function AwaitingConnectionView() {
  const { setConnectRequest, connectRequest } = useSecretContext();
  const handleDisconnectRequest = () => {
    setConnectRequest(false);
  };
  return (
    <div
      style={{ height: '70%', padding: '3rem 5rem' }}
      className="flex justify-center items-center flex-col"
    >
      <div
        className="flex flex-col items-center"
        style={{
          background:
            'linear-gradient(142.6deg, #232323 -1.55%, rgba(29, 29, 29, 0.64) 200.36%',
          zIndex: '10',
          padding: '7rem',
          boxShadow: '0px 25px 25px rgba(0, 3, 32, 0.5)',
          borderRadius: '8px',
        }}
      >
        <div className="flex items-center w-full">
          <img
            alt="spinning_keplr"
            className="spin mb-3 mr-3"
            width={'22px'}
            src={keplr}
          />
          <div className="text-lg w-full overflow-visible">
            Awaiting connection...
          </div>
        </div>

        <Button
          onClick={() => handleDisconnectRequest()}
          style={connectRequest ? BUTTON_STYLES.LINK : BUTTON_STYLES.DEFAULT}
          text="Back"
        />
      </div>
    </div>
  );
}
