import { ExclamationCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';

export default function ErrorContainer() {
  return (
    <div className="w-full flex flex-col text-center items-center">
      <div className=" flex  items-center  text-2xl justify-center w-full">
        <ExclamationCircleOutlined />
        <p className=" ml-3">No score found!</p>
      </div>
      <div className="flex items-center mt-6  space-x-3">
        <Link href={'/applicant/generate'}>
          <a className="z-50 w-max">Generate a score</a>
        </Link>
        <p>or</p>
        <Link href={'/applicant'}>
          <a className="z-50  w-max">go back</a>
        </Link>
      </div>
    </div>
  );
}
