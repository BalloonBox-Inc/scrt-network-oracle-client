import { Modal } from 'antd';

import Button, { BUTTON_STYLES } from '../Button';

const ScoreResponseModal = ({
  queryStatus,
  queryType,
  pushToScore,
  startOver,
}: {
  queryStatus: string;
  queryType: string | string[] | undefined;
  pushToScore: () => void;
  startOver: () => void;
}) => {
  return (
    <Modal
      footer={null}
      centered
      closable={true}
      onCancel={startOver}
      visible={queryStatus === 'success'}
    >
      <div className="h-60 w-full space-y-2 flex justify-center items-center flex-col">
        <h2 className="text-xl font-semibold">Ready to calculate Score</h2>
        <p>with </p>
        <div className="w-full justify-center flex">
          {queryType === 'plaid' ? (
            <img
              width={'40%'}
              alt="plaid_logo"
              src={'../../images/plaidLogo.svg'}
            />
          ) : (
            <img
              width={'40%'}
              alt="coinbase_logo"
              src={'../../images/coinbaseLogo.svg'}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col w-full justify-center items-center">
        <div className=" w-max">
          <Button
            onClick={pushToScore}
            text="Continue to score calculation"
            style={BUTTON_STYLES.DEFAULT}
          />
        </div>
        <div className=" w-max mt-3">
          <Button
            onClick={startOver}
            text="start over"
            style={BUTTON_STYLES.LINK}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ScoreResponseModal;
