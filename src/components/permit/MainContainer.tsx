import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import Link from 'next/link';
import router from 'next/router';

import Button, { BUTTON_STYLES } from '../Button';

const MainContainer = ({
  isRevokePermit,
  isCreatePermit,
  setInput,
  inputData,
  handleRevokePermit,
  handleCreatePermit,
}: {
  isRevokePermit: boolean;
  isCreatePermit: boolean;
  setInput: (data: string) => void;
  inputData: string | undefined;
  handleRevokePermit: () => void;
  handleCreatePermit: () => void;
}) => {
  return (
    <div className="px-10 sm:px-20 lg:px-40 z-50 mt-20 mb-20 sm:mt-10">
      <div className="w-full text-center">
        <div className="z-50 opacity-100 px-0 sm:p-10 flex flex-col">
          <div className=" z-50 flex items-center justify-center">
            <h2 className="z-50 font-semibold text-2xl sm:text-3xl md:text-3xl lg:text-4xl p-0">
              {isRevokePermit
                ? 'Revoke a Query Permit'
                : 'Create a Query Permit'}
            </h2>
            <Tooltip
              title={`${
                isCreatePermit
                  ? 'Gas fees are not charged when creating a query permit and these permits can be shared with others. Gas fees are only charged if you decide to revoke the permit at a later time.'
                  : 'Gas fees are charged when revoking a query permit.'
              }`}
              placement="bottom"
            >
              <InfoCircleOutlined
                className="cursor-pointer hover:text-gray-500"
                style={{ marginLeft: '1rem', fontSize: '25px' }}
              />
            </Tooltip>
          </div>
          <p className="z-50 font-thin text-sm sm:text-base p-0">
            Please enter the name of the query permit you would like to{' '}
            {isCreatePermit ? 'create' : 'revoke'}
          </p>
        </div>
      </div>
      <div className="w-full text-center z-50  flex flex-col ">
        <form className="flex flex-col items-start mt-8  w-full">
          <label className="text-left mb-1">Query permit name or phrase</label>
          <input
            data-testid="permit-input"
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            className=" z-50 focus-visible:outline-blue-600 focus-visible:outline-none font-mono text-blue-600 bg-input-bg w-full py-3 px-3 rounded-md mb-4 uppercase"
            type={'text'}
          />
          <Link
            href={
              isRevokePermit
                ? '/applicant/permit?type=create'
                : '/applicant/permit?type=revoke'
            }
          >
            <a className="z-50 underline">
              {isCreatePermit
                ? 'Revoke a query permit'
                : 'Create a query permit'}
            </a>
          </Link>
        </form>
        <div className="flex justify-between items-center mt-8">
          <Button
            text="Back"
            style={BUTTON_STYLES.OUTLINE}
            onClick={() => router.push('/applicant')}
          />
          <Button
            data-testid="permit-button"
            text={isCreatePermit ? 'Create' : 'Revoke'}
            classes={{ container: 'mr-3' }}
            isDisabled={!inputData}
            onClick={() =>
              isRevokePermit ? handleRevokePermit() : handleCreatePermit()
            }
          />
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
