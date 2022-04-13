import { render } from '@testing-library/react';
import { RouterContext } from 'next/dist/shared/lib/router-context';

import { ContextProvider } from '@scrtsybil/src/context';
import { createMockRouter } from '@scrtsybil/src/test-utils/createMockRouter';

import Coinbase from '../components/Coinbase';

function mockFetch(data: any) {
  return jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => data,
    })
  );
}

describe('Coinbase SDK', () => {
  it('setToWaiting() on component mount', () => {
    window.fetch = mockFetch({ json: 'hello' });
    const setToWaiting = jest.fn();
    const setToNotWaiting = jest.fn();
    const { debug } = render(
      <RouterContext.Provider value={createMockRouter({})}>
        <ContextProvider>
          <Coinbase
            connectionError={jest.fn()}
            router={createMockRouter({})}
            setToWaiting={setToWaiting}
            setNotWaiting={setToNotWaiting}
          />
        </ContextProvider>
      </RouterContext.Provider>
    );
    debug();

    expect(setToWaiting).toHaveBeenCalled();
  });
});
