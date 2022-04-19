import Link from 'next/link';

import Button from '../Button';

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
    <div className="px-10 sm:px-14 z-50 mt-20 mb-20 sm:mt-10">
      <div className="w-full text-center">
        <div className="z-50 opacity-100 px-0 sm:p-10 flex flex-col">
          <h2 className="z-50 font-semibold text-2xl sm:text-3xl md:text-3xl lg:text-4xl p-0">
            {isRevokePermit ? 'Create a query permit' : 'Revoke a query permit'}
          </h2>
          <p className="z-50 font-thin text-sm sm:text-base p-0">
            Please enter the name of the query permit you would like to{' '}
            {isCreatePermit ? 'create' : 'revoke'}
          </p>
        </div>
      </div>
      <div className="w-full text-center z-50 sm:px-20 lg:px-40 flex flex-col ">
        <form className="flex flex-col items-start mt-8  w-full">
          <label className="text-left mb-1">query permit name or phrase</label>
          <input
            data-testid="permit-input"
            onChange={(e) => setInput(e.target.value)}
            className=" z-50 focus-visible:outline-blue-600 focus-visible:outline-none  font-mono text-blue-600 bg-input-bg w-full py-3 px-3 rounded-md mb-4"
            type={'text'}
          />
        </form>
        <div className="flex items-center mt-8">
          <Button
            data-testid="permit-button"
            text={isCreatePermit ? 'Create' : 'Revoke'}
            classes={{ container: 'mr-3' }}
            isDisabled={!inputData}
            onClick={() =>
              isRevokePermit ? handleRevokePermit() : handleCreatePermit()
            }
          />
          <Link
            href={
              isRevokePermit
                ? '/applicant/permit?type=create'
                : '/applicant/permit?type=revoke'
            }
          >
            <a className="z-50">
              {isCreatePermit
                ? 'Revoke a query permit'
                : 'Create a query permit'}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
