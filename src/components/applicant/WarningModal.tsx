import { Modal, Button } from 'antd';
import router from 'next/router';

import { BUTTON_STYLES } from '../Button';

export function WarningModal({ modalWarn }) {
  return (
    <Modal
      visible={modalWarn}
      footer={null}
      onCancel={() => {
        setModalWarn(false);
      }}
      centered
      bodyStyle={{ background: '#242630' }}
    >
      <div className={`px-8 flex py-5 justify-center rounded-md z-50`}>
        <div className="p-8 px-2 rounded-lg z-50  max-w-xl w-full ">
          <div className="flex items-center mb-6">
            <h3 className="text-lg mr-2 uppercase font-semibold ">Warning</h3>
          </div>

          {chainActivity?.scoreAmount === scoreResponse?.score ? (
            <div>
              You have already submitted a score of {scoreResponse?.score},
              submit anyway?
            </div>
          ) : (
            <div>
              You have already submitted your score of{' '}
              {chainActivity?.scoreAmount}. Are you sure you want to submit a
              new score of {scoreResponse?.score}?
            </div>
          )}

          <div className="flex items-center mt-12 space-x-5">
            <Button
              text="Submit to blockchain"
              classes={{ button: 'text-xs' }}
              onClick={() => {
                handleSetChainActivity(null);
                handleSaveToBlockchain();
              }}
            />
            <Button
              text="Create a query permit"
              style={BUTTON_STYLES.OUTLINE}
              classes={{ button: 'text-xs' }}
              onClick={() => {
                router.push('/applicant/permit');
              }}
            />
          </div>
          <div className=" w-max mt-6">
            <Button
              text="Cancel"
              style={BUTTON_STYLES.LINK}
              classes={{ button: 'text-xs text-left hover:text-blue' }}
              onClick={() => {
                setModalWarn(false);
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
