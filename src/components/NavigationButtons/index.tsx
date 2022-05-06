import Button, { BUTTON_STYLES } from '../Button';

interface INavigationButtonProps {
  backHandler?: () => void;
  nextHandler?: () => void;
  backDisabled?: boolean;
  nextDisabled?: boolean;
  backText?: string;
  nextText?: string;
  showNextBtn?: boolean;
  showBackBtn?: boolean;
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
}: INavigationButtonProps) => {
  return (
    <div className="w-full mb-20 2xl:mt-20 flex justify-center">
      <div className="flex w-3/4 md:w-3/5 justify-between ">
        {showBackBtn && backHandler && (
          <div className="pt-16 z-30 flex justify-start">
            <div>
              <Button
                onClick={() => backHandler()}
                text={backText}
                style={BUTTON_STYLES.OUTLINE}
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
