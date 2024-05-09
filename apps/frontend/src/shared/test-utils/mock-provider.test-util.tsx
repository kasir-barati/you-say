import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { Notification } from '../components/notification/notification.component';
import { PreloadedState, createStore } from '../store/create.store';

interface MockProviderProps {
  initialState?: PreloadedState;
}

export function MockProvider({
  initialState = {},
  children,
}: Readonly<PropsWithChildren<MockProviderProps>>) {
  const store = createStore(initialState);

  return (
    <Provider store={store}>
      {children}
      <Notification />
    </Provider>
  );
}
