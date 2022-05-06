import { act, render, screen } from '@testing-library/react';

import { ContextProvider } from '@scrtsybil/src/context';
import Provider from '@scrtsybil/src/pages/provider';

describe('Provider Page', () => {
  it('renders a heading', async () => {
    render(
      <ContextProvider>
        <Provider />
      </ContextProvider>
    );

    const heading = screen.getByRole('heading', {
      name: "Query a User's Score",
    });

    await act(async () => {
      await expect(heading).toBeValid;
    });
  });
});
