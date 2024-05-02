import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { renderHookWithProviders } from '../test-utils/render-hook-with-providers.test-util';
import { useSubmit } from './use-submit.hook';

const mockedPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockImplementation(() => {
    return {
      push: mockedPush,
    };
  }),
}));

describe('useSubmit', () => {
  let submit: (form: HTMLFormElement) => Promise<boolean>;
  let mockMutation: jest.Mock;
  let mockRouterPush: jest.Mock;
  let mockUseMutation: jest.Mock;

  beforeEach(async () => {
    mockMutation = jest.fn().mockImplementation(() => {
      return {
        unwrap: jest.fn().mockImplementation(() => Promise.resolve()),
      };
    });
    mockRouterPush = jest.fn();
    mockUseMutation = jest.fn().mockImplementation(() => {
      return [mockMutation];
    });

    const {
      result: { current },
    } = await act(() =>
      renderHookWithProviders(() =>
        useSubmit({
          useMutation: mockUseMutation,
          successMessage: 'Success!',
          onSuccessRedirectTo: '/success',
        }),
      ),
    );

    submit = current;
  });
  afterEach(() => {
    mockMutation.mockClear();
    mockRouterPush.mockClear();
    mockUseMutation.mockClear();
  });

  it('should call mutation with form data on submit', async () => {
    const form = await formGenerator();

    await act(() => submit(form));

    expect(mockMutation).toHaveBeenCalledWith({ test: 'data' });
  });

  it('should return true on success', async () => {
    const form = await formGenerator();

    const result = await act(() => submit(form));

    expect(result).toBe(true);
  });

  it('should have called router.push', async () => {
    const form = await formGenerator();

    await act(() => submit(form));

    expect(mockedPush).toHaveBeenCalledWith('/success');
  });

  it('should return false on mutation failure', async () => {
    mockMutation.mockImplementation(() => {
      return {
        unwrap: jest.fn().mockImplementation(() => Promise.reject()),
      };
    });
    const form = await formGenerator();

    const result = await act(() => submit(form));

    expect(result).toBe(false);
  });
});

async function formGenerator() {
  const renderedForm = await act(() =>
    render(
      <form role="form">
        <input name="test" readOnly value="data" />
      </form>,
    ),
  );
  return renderedForm.getByRole('form') as HTMLFormElement;
}
