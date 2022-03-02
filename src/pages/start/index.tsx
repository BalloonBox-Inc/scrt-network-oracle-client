import { Card, Typography } from 'antd';
import Title from 'antd/lib/skeleton/Title';

const StartPage = () => {
  return (
    <div className="px-20 py-60 ">
      <div className="w-full text-center">
        <Typography.Title level={2}>Select Your User Type</Typography.Title>
        <p>To get started, choose your user type.</p>
        <div className="flex flex-col items-center space-y-5 justify-center w-full">
          {/* Card should be abstracted */}
          <Card hoverable className="hover:bg-gray-800" style={{ width: 380 }}>
            <div className="text-left">
              <Typography.Title level={3}>Applicant</Typography.Title>
              <Typography.Paragraph>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
                ipsum, voluptate incidunt quos, ullam error voluptates magnam
                ab.
              </Typography.Paragraph>
            </div>
          </Card>

          <Card hoverable className="hover:bg-gray-800" style={{ width: 380 }}>
            <div className="text-left">
              <Typography.Title level={3}>Service Provider</Typography.Title>
              <Typography.Paragraph>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
                ipsum, voluptate incidunt quos, ullam error voluptates magnam
                ab.
              </Typography.Paragraph>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
