import { useState } from 'react';

import { Card, Typography, Tooltip, Button } from 'antd';
import Link from 'next/link';
import router from 'next/router';

const ProviderServicesPage = () => {
  const [selection, setSelection] = useState<null | string>(null);
  return (
    <div className="px-20 py-60 ">
      <div className="w-full text-center">
        <Typography.Title level={2}>Select Services</Typography.Title>
        <p>User Type: Service Provider</p>
        <div className="flex flex-col items-center space-y-5 mt-8 justify-center w-full">
          <div
            onClick={() => setSelection('request')}
            className={`bg-gray-900 cursor-pointer border-2 rounded-md ${
              selection === 'request'
                ? ' border-blue-500'
                : 'border-transparent'
            }`}
            style={{ width: 380 }}
          >
            <div className="text-center">
              <p className="text-lg p-0 m-0 py-4">
                Request the score of another user.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <Button
          type="primary"
          disabled={!selection}
          onClick={() => {
            router.push(`/provider/${selection}`);
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProviderServicesPage;
