import { render, screen } from '@testing-library/react';

import { ContextProvider } from '@scrtsybil/src/context';
import Start from '@scrtsybil/src/pages/start';

describe('Start', () => {
  const jsdomAlert = window.alert; // remember the jsdom alert
  window.alert = () => {}; // provide an empty implementation for window.alert
  it('renders a heading', () => {
    render(
      <ContextProvider>
        <Start />
      </ContextProvider>
    );

    const heading = screen.getByRole('heading', {
      name: 'Select Your User Type',
    });

    expect(heading).toBeValid;
  });
  window.alert = jsdomAlert;
});
