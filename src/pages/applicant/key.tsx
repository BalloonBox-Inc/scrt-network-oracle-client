import { useState } from 'react';

import { Card, Typography, Input, Form, Modal, Button } from 'antd';

const GeneratePermissionPage = () => {
  const [formStatus, setFormStatus] = useState<
    'loading' | 'success' | 'error' | undefined
  >(undefined);

  const isLoading = formStatus === 'loading';
  const shouldShowModal = formStatus === 'success' || formStatus === 'error';

  return (
    <div className="px-20 py-60 ">
      <div className="w-full text-center">
        <Typography.Title level={2}>Generate a Viewing Key</Typography.Title>
        <div className="flex flex-col items-center space-y-5 mt-8 justify-center w-full">
          <Form>
            <Input type={'text'} placeholder="Name of query permit" />
          </Form>
          <Card type="inner">
            Name of label Lorem ipsum dolor sit amet consectetur adipisicing
            elit.
          </Card>
          <Button
            loading={isLoading}
            onClick={() => setFormStatus('loading')}
            className="w-full max-w-md"
            type="primary"
          >
            {isLoading ? 'Generating' : 'Generate'}
          </Button>
        </div>
      </div>
      <Modal visible={shouldShowModal}>hello</Modal>
    </div>
  );
};

export default GeneratePermissionPage;
