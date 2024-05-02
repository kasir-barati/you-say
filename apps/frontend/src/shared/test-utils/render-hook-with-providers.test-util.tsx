import { renderHook, RenderOptions } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { PreloadedState } from '../store/create.store';
import { MockProvider } from './mock-provider.test-util';

interface WrapperProps {
  initialState?: PreloadedState;
}

function Wrapper({
  children,
  initialState,
}: Readonly<PropsWithChildren<WrapperProps>>) {
  return (
    <MockProvider initialState={initialState}>
      {children}
    </MockProvider>
  );
}

function renderHookWithProviders<Result, Props>(
  ui: (initialProps: Props) => Result,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return renderHook(ui, { wrapper: Wrapper, ...options });
}

export { renderHookWithProviders };
