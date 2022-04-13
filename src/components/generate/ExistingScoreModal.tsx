import { Modal } from 'antd';
import router from 'next/router';

import Button, { BUTTON_STYLES } from '@scrtsybil/src/components/Button';
import { ISecretContext } from '@scrtsybil/src/context';

const ExistingScoreModal = ({
  scoreExists,
  startOver,
  chainActivity,
  handleSetChainActivity,
}: {
  scoreExists: boolean;
  startOver: () => void;
  chainActivity: ISecretContext['chainActivity'];
  handleSetChainActivity: ISecretContext['handleSetChainActivity'];
}) => {
  return (
    <Modal footer={null} centered closable={false} visible={scoreExists}>
      <div className="py-6 w-full space-y-2 flex justify-center items-center flex-col">
        <p
          data-testid="existing-score"
          className="text-base text-center font-semibold"
        >
          You have already submitted a score using {chainActivity?.dataProvider}
          .
        </p>
      </div>
      <div className="flex w-full justify-center items-center space-x-4">
        <div>
          <Button
            onClick={() => router.push('/applicant/score')}
            text="See Score"
            style={BUTTON_STYLES.DEFAULT}
          />
        </div>
        <div>
          <Button
            onClick={() => {
              handleSetChainActivity(null);
              startOver();
            }}
            text="Generate New Score"
            style={BUTTON_STYLES.LINK}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ExistingScoreModal;
