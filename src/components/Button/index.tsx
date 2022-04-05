import { ReactNode } from 'react';

import cx from 'classnames';
import { ClipLoader } from 'react-spinners';

import { BORDER_GRADIENT_STYLE } from '@scrtsybil/src/constants';

interface IButtonClasses {
  container?: string;
  button?: string;
  bg?: string;
  hover?: string;
  textColor?: string;
}

interface IButtonField {
  text: string | ReactNode;
  classes?: IButtonClasses;
  onClick?: (e: React.ChangeEvent<any>) => void;
  isSubmit?: boolean;
  type?: BUTTON_ACTION;
  style?: BUTTON_STYLES;
  isDisabled?: boolean;
  isLoading?: boolean;
  id?: string;
}

export enum BUTTON_STYLES {
  DEFAULT = 'default',
  OUTLINE = 'outline',
  LINK = 'link',
  BLACK = 'dark',
}

export enum BUTTON_ACTION {
  SUBMIT = 'submit',
  BUTTON = 'button',
  RESET = 'reset',
}

export default function Button({
  onClick,
  text,
  classes,
  type,
  isDisabled = false,
  style = BUTTON_STYLES.DEFAULT,
  isLoading,
  id,
}: IButtonField) {
  const classnames = cx(
    {
      'inline-flex justify-center py-2 px-6 text-sm font-thin rounded-3xl focus:outline-none':
        style !== BUTTON_STYLES.LINK,
      'text-white border-solid bg-black py-2 border-gradient-br-purple-blue cursor-pointer':
        style === BUTTON_STYLES.OUTLINE,
      'text-white  bg-gradient-to-b from-purple to-blue hover:opacity-75 cursor-pointer min-w-4 gradient-outline':
        style === BUTTON_STYLES.DEFAULT,
      'text-white hover:opacity-75 cursor-pointer min-w-4 bg-black':
        style === BUTTON_STYLES.BLACK,
      'disabled:opacity-70 cursor-default gradient-outline-grayscale':
        isDisabled || isLoading,
    },
    classes?.button || ''
  );

  const button = (
    <button
      disabled={isDisabled}
      onClick={onClick || undefined}
      type={type}
      id={id}
      className={classnames}
      style={{ minWidth: '100px' }}
    >
      {isLoading ? <ClipLoader speedMultiplier={1.25} size={20} /> : text}
    </button>
  );

  const renderBackground = () => {
    if (style === BUTTON_STYLES.LINK) {
      return 'transparent';
    }
    return !isDisabled && !isLoading ? BORDER_GRADIENT_STYLE : '#718096';
  };

  return (
    <div
      style={{
        background: renderBackground(),
        borderRadius: '400px',
        padding: '3px',
        justifyItems: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        zIndex: '50',
      }}
      className={classes?.container}
    >
      {button}
    </div>
  );
}
