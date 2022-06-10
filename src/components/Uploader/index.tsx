import { FunctionComponent, useRef, useState, useEffect } from 'react';

import { UploadOutlined } from '@ant-design/icons';
import { notification, UploadProps, Button, message, Upload } from 'antd';

import { IQueryInputs } from '@scrtsybil/src/types/types';

const Uploader: FunctionComponent<any> = ({
  handleUploadAutoFiller,
}: {
  handleUploadAutoFiller: (a: IQueryInputs | null) => void;
}) => {
  const ref = useRef(null);
  const [showError, setShowError] = useState(false);

  const handleReadFile = (f: File) => {
    const fr = new FileReader();
    fr.readAsText(f);
    fr.onload = () => {
      try {
        const data = JSON.parse(fr.result as string);
        handleUploadAutoFiller(data);
        message.success('File uploaded successfully');
      } catch (error) {
        setShowError(true);
      }
    };
  };

  useEffect(() => {
    if (showError) {
      notification.error({
        message:
          'There was an error with the file you uploaded, make sure it is the same .txt file you downloaded when you created your permit.',
      });
    }
  }, [showError]);

  const props: UploadProps = {
    name: 'file',
    showUploadList: false,
    maxCount: 1,
    onRemove: () => {
      handleUploadAutoFiller(null);
    },
    accept: '.txt',
    onChange(info) {
      if (!info.file.name.includes('.txt')) {
        setShowError(true);
        return;
      }
      if (info.file.status === 'done') {
        const newFile = info.file.originFileObj;
        handleReadFile(newFile);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div onClick={() => setShowError(false)}>
      <Upload className="mb-0" ref={ref} {...props}>
        <Button className="bg-black" icon={<UploadOutlined />}>
          Click to Upload txt file
        </Button>
      </Upload>
    </div>
  );
};

export default Uploader;
