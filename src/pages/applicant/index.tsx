import { Card, Typography, Tooltip } from 'antd';
import Link from 'next/link';

const ApplicantServicesPage = () => {
  return (
    <div className="px-20 py-60 ">
      <div className="w-full text-center">
        <Typography.Title level={2}>Select Services</Typography.Title>
        <p>User Type: Applicant</p>
        <div className="flex flex-col items-center space-y-5 mt-8 justify-center w-full">
          {/* Card should be abstracted */}
          <Link passHref href={'/applicant/generate'}>
            <Card
              hoverable
              className="hover:bg-gray-800"
              style={{ width: 380 }}
            >
              <div className="justify-center flex">
                <Typography.Title level={5} style={{ marginBottom: 0 }}>
                  Generate a score
                </Typography.Title>
              </div>
            </Card>
          </Link>

          <Card hoverable className="hover:bg-gray-800" style={{ width: 380 }}>
            <div className="justify-center flex">
              <Typography.Title level={5} style={{ marginBottom: 0 }}>
                Retrieve score from blockchain
              </Typography.Title>
            </div>
          </Card>
          <Card hoverable className="hover:bg-gray-800" style={{ width: 380 }}>
            <div className="justify-center flex">
              <Typography.Title level={5} style={{ marginBottom: 0 }}>
                Revoke a permission
              </Typography.Title>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicantServicesPage;
