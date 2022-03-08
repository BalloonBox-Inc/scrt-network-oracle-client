import { useState } from 'react';

import { Card, Typography, Tooltip, Button } from 'antd';
import Link from 'next/link';
import router from 'next/router';

const ApplicantServicesPage = () => {
  const [selection, setSelection] = useState<
    null | 'generate' | 'query' | 'revoke'
  >(null);
  return (
    <div className="px-20 py-60 ">
      <div className="w-full text-center">
        <Typography.Title level={2}>Select Services</Typography.Title>
        <p>User Type: Applicant</p>
        <div className="flex flex-col items-center space-y-5 mt-8 justify-center w-full">
          <div
            onClick={() => setSelection('generate')}
            className={`bg-gray-900 cursor-pointer border-2 rounded-md ${
              selection === 'generate'
                ? ' border-blue-500'
                : 'border-transparent'
            }`}
            style={{ width: 380 }}
          >
            <div className="text-center">
              <p className="text-lg p-0 m-0 py-4">Generate a Score</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-5 mt-8 justify-center w-full">
          <div
            onClick={() => setSelection('query')}
            className={`bg-gray-900 cursor-pointer border-2 rounded-md ${
              selection === 'query' ? ' border-blue-500' : 'border-transparent'
            }`}
            style={{ width: 380 }}
          >
            <div className="text-center">
              <p className="text-lg p-0 m-0 py-4">
                Query a previously generated score
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-5 mt-8 justify-center w-full">
          <div
            onClick={() => setSelection('revoke')}
            className={`bg-gray-900 cursor-pointer border-2 rounded-md ${
              selection === 'revoke' ? ' border-blue-500' : 'border-transparent'
            }`}
            style={{ width: 380 }}
          >
            <div className="text-center">
              <p className="text-lg p-0 m-0 py-4">Revoke a permission</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <Button
          type="primary"
          disabled={!selection}
          onClick={() => {
            router.push(`/applicant/${selection}`);
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ApplicantServicesPage;
