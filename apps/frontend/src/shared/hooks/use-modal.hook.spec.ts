import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useModal } from './use-modal.hook';

describe('useModal', () => {
  it('should initialize isOpen to false', async () => {
    const {
      result: {
        current: { isOpen },
      },
    } = await act(() => renderHook(useModal));

    expect(isOpen).toBe(false);
  });

  it('should set isOpen to true when calling openModal', async () => {
    const { result } = await act(() => renderHook(useModal));

    act(() => result.current.openModal());

    expect(result.current.isOpen).toBe(true);
  });

  it('should set isOpen to false when calling closeModal', async () => {
    const { result } = await act(() => renderHook(useModal));

    act(() => {
      result.current.openModal();
      result.current.closeModal();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('should toggle isOpen when calling openModal and closeModal', async () => {
    const { result } = await act(() => renderHook(useModal));

    act(() => result.current.openModal());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.closeModal());
    expect(result.current.isOpen).toBe(false);
  });
});
