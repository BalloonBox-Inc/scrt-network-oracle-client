import { fireEvent, render, screen } from '@testing-library/react';
import { RouterContext } from 'next/dist/shared/lib/router-context';

import { ContextProvider } from '@scrtsybil/src/context';
import Permit from '@scrtsybil/src/pages/applicant/permit';
import { createMockRouter } from '@scrtsybil/src/test-utils/createMockRouter';

describe('Applicant Permit Page ', () => {
  it('renders an input and disabled button, reveals modal', async () => {
    window.alert = () => {}; // provide an empty implementation for window.alert
    const router = createMockRouter({
      query: {
        type: 'create',
      },
    });
    render(
      <RouterContext.Provider value={router}>
        <ContextProvider>
          <Permit />
        </ContextProvider>
      </RouterContext.Provider>
    );
    const input = screen.getByTestId('permit-input');
    const button = screen.getByRole('button', {
      name: 'Create',
    });

    expect(input).toBeValid;
    expect(button).toBeDisabled;

    fireEvent.change(input, { target: { value: 'test' } });

    expect(input).toHaveValue('test');

    // await act(async () => {
    //   fireEvent.click(button);
    // });
  });
});
