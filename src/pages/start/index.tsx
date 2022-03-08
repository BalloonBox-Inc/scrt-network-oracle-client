import { useState } from 'react';

import { Button, Card, Typography } from 'antd';
import { useRouter } from 'next/router';

const StartPage = () => {
  const router = useRouter();
  const [userTypeSelection, setUserTypeSelection] = useState<
    'applicant' | 'provider' | null
  >(null);

  return (
    <div className="px-20 py-60 ">
      <div className="w-full text-center">
        <Typography.Title level={2}>Select Your User Type</Typography.Title>
        <p>To get started, choose your user type.</p>
        <div className="flex flex-col items-center space-y-5 justify-center w-full">
          <div
            onClick={() => setUserTypeSelection('applicant')}
            className={`bg-gray-900 cursor-pointer border-2 rounded-md p-5 ${
              userTypeSelection === 'applicant'
                ? ' border-blue-500'
                : 'border-transparent'
            }`}
            style={{ width: 380 }}
          >
            <div className="text-left">
              <Typography.Title level={3}>Applicant</Typography.Title>
              <Typography.Paragraph>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
                ipsum, voluptate incidunt quos, ullam error voluptates magnam
                ab.
              </Typography.Paragraph>
            </div>
          </div>

          <div
            onClick={() => setUserTypeSelection('provider')}
            className={`bg-gray-900 cursor-pointer border-2 rounded-md p-5 ${
              userTypeSelection === 'provider'
                ? ' border-blue-500'
                : 'border-transparent'
            }`}
            style={{ width: 380 }}
          >
            <div className="text-left">
              <Typography.Title level={3}>Service Provider</Typography.Title>
              <Typography.Paragraph>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
                ipsum, voluptate incidunt quos, ullam error voluptates magnam
                ab.
              </Typography.Paragraph>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <Button
          type="primary"
          disabled={!userTypeSelection}
          onClick={() => {
            router.push(`/${userTypeSelection}`);
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default StartPage;
