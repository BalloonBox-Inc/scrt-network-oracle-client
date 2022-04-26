import { Modal } from 'antd';

import { IScoreQueryResponse } from '@scrtsybil/src/types/contract';
import {
  IScoreResponseCoinbase,
  IScoreResponsePlaid,
} from '@scrtsybil/src/types/types';

export default function ScoreDescriptionModal({
  scoreResponse,
  showScoreDescription,
  setShowScoreDescription,
  queryResponse,
}: {
  scoreResponse: IScoreResponseCoinbase | IScoreResponsePlaid | null;
  showScoreDescription: boolean;
  setShowScoreDescription: (showScoreDescription: boolean) => void;
  queryResponse: IScoreQueryResponse | undefined;
}) {
  return (
    <Modal
      visible={showScoreDescription}
      footer={null}
      onCancel={() => setShowScoreDescription(false)}
      bodyStyle={{ background: '#242630' }}
      style={{ top: '20%' }}
    >
      <div
        className={`px-8 flex py-5 justify-center rounded-md z-50 duration-500`}
      >
        <div className="p-8 rounded-lg z-50  max-w-xl w-full ">
          <h3 className="text-lg uppercase font-semibold mb-4">Summary</h3>
          <p className="sm:text-base leading-7">
            {scoreResponse?.message || queryResponse?.description}
          </p>
        </div>
      </div>
    </Modal>
  );
}
