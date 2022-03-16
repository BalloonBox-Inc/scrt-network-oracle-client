import { ReactNode } from 'react';

import cx from 'classnames';

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
  isDisabled,
  style = BUTTON_STYLES.DEFAULT,
  isLoading,
  id,
}: IButtonField) {
  const classnames = cx(
    {
      'inline-flex justify-center py-3 px-6 text-sm font-normal rounded-3xl focus:outline-none':
        style !== BUTTON_STYLES.LINK,
      'text-white border-solid border-2 border-gradient-t-purple-blue hover:text-lightgray bg-darkgray/75 hover:bg-transparent':
        style === BUTTON_STYLES.OUTLINE,
      'text-white bg-gradient-to-b from-purple to-blue hover:opacity-75':
        style === BUTTON_STYLES.DEFAULT,
      'text-white bg-black hover:opacity-75': style === BUTTON_STYLES.BLACK,
      'disabled:opacity-30 disabled:bg-gray-700 cursor-default': isDisabled,
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
    >
      {isLoading ? (
        <div style={{ margin: '-2px 3px' }}>
          {/* put the loading spinner later */}
        </div>
      ) : (
        text
      )}
    </button>
  );

  return classes?.container ? (
    <div className={classes.container}>{button}</div>
  ) : (
    button
  );
}
