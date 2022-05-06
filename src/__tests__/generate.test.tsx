import { fireEvent, render } from '@testing-library/react';
import { RouterContext } from 'next/dist/shared/lib/router-context';

import { CHAIN_ACTIVITY_INIT, ContextProvider } from '@scrtsybil/src/context';
import Generate, {
  GenerateScore,
} from '@scrtsybil/src/pages/applicant/generate';
import { createMockRouter } from '@scrtsybil/src/test-utils/createMockRouter';

function mockFetch(data: any) {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => data,
    })
  );
}

describe('Generate Page', () => {
  const jsdomAlert = window.alert; // remember the jsdom alert
  window.alert = () => {}; // provide an empty implementation for window.alert
  it('renders a heading', () => {
    const { getByRole } = render(
      <RouterContext.Provider value={createMockRouter({})}>
        <ContextProvider>
          <Generate />
        </ContextProvider>
      </RouterContext.Provider>
    );

    const heading = getByRole('heading', {
      name: 'Choose a Provider',
    });
    expect(heading).toBeValid;
  });

  it('shows modal if score is already submitted', () => {
    const chainActivity = { ...CHAIN_ACTIVITY_INIT, scoreSubmitted: true };
    const { getByTestId } = render(
      <RouterContext.Provider value={createMockRouter({})}>
        <ContextProvider>
          <GenerateScore chainActivity={chainActivity} />
        </ContextProvider>
      </RouterContext.Provider>
    );

    const modal = getByTestId('existing-score');
    expect(modal).toBeValid;
  });

  describe('When Plaid is Selected and button is clicked', () => {
    it('selects and triggers loading ', () => {
      const { getByText, getByTestId, getByRole } = render(
        <RouterContext.Provider value={createMockRouter({})}>
          <ContextProvider>
            <Generate />
          </ContextProvider>
        </RouterContext.Provider>
      );
      window.fetch = mockFetch({ json: 'hello' });
      fireEvent.click(getByTestId('plaid-element'));
      fireEvent.click(getByRole('button', { name: 'Continue' }));

      expect(
        getByText('Requesting score, this may take a minute.')
      ).toBeInTheDocument();
    });

    it('Changes the url with router.replace to ', () => {
      const router = createMockRouter({});
      const { getByTestId, getByRole } = render(
        <RouterContext.Provider value={router}>
          <ContextProvider>
            <Generate />
          </ContextProvider>
        </RouterContext.Provider>
      );

      window.fetch = mockFetch({ json: 'hello' });
      fireEvent.click(getByTestId('plaid-element'));
      fireEvent.click(getByRole('button', { name: 'Continue' }));

      expect(router.replace).toBeCalledWith(
        '/applicant/generate?type=plaid&status=loading'
      );
    });

    window.alert = jsdomAlert;
  });
});
