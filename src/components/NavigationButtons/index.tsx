import Button, { BUTTON_ACTION, BUTTON_STYLES } from '../Button';

interface INavigationButtonProps {
  backHandler?: () => void;
  nextHandler?: () => void;
  backDisabled?: boolean;
  nextDisabled?: boolean;
  backText?: string;
  nextText?: string;
  showNextBtn?: boolean;
  showBackBtn?: boolean;
  fullWidth?: boolean;
}

const NavigationButtons = ({
  backHandler,
  nextHandler,
  backDisabled = false,
  nextDisabled = false,
  backText = 'Back',
  nextText = 'Continue',
  showNextBtn = true,
  showBackBtn = true,
  fullWidth = false,
}: INavigationButtonProps) => {
  return (
    <div
      className={`w-full mb-20 2xl:mt-20 ${
        !fullWidth && 'flex justify-center'
      }`}
    >
      <div className={`flex justify-between ${!fullWidth && 'w-3/4 md:w-3/5'}`}>
        {showBackBtn && backHandler && (
          <div className="pt-16 z-30 flex justify-start">
            <div>
              <Button
                onClick={() => backHandler()}
                text={backText}
                style={BUTTON_STYLES.OUTLINE}
                type={BUTTON_ACTION.BUTTON}
                isDisabled={backDisabled}
              />
            </div>
          </div>
        )}
        {showNextBtn && nextHandler && (
          <div className="pt-16 z-30 flex justify-end">
            <div>
              <Button
                onClick={() => nextHandler()}
                text={nextText}
                style={BUTTON_STYLES.DEFAULT}
                type={BUTTON_ACTION.SUBMIT}
                isDisabled={nextDisabled}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default NavigationButtons;
