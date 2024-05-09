'use client';

import { UseMutation } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { ErrorResponse } from '@shared';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useNotification } from '../components/notification/use-notification.hook';

export function useSubmit({
  useMutation,
  successMessage,
  onSuccessRedirectTo,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useMutation: UseMutation<any>;
  successMessage: string;
  onSuccessRedirectTo: string;
}) {
  const router = useRouter();
  const [mutation] = useMutation();
  const redirect = useMemo(
    () => () => router.push(onSuccessRedirectTo),
    [onSuccessRedirectTo, router],
  );
  const { displayNotification } = useNotification();

  return async (form: HTMLFormElement): Promise<boolean> => {
    const data = new FormData(form);
    const formData = Object.fromEntries(data);

    try {
      await mutation(formData).unwrap();
      displayNotification({
        message: successMessage,
        type: 'success',
      });
      redirect();
      return true;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message = errorMessage(error as any);

      displayNotification({
        message,
        type: 'error',
      });
      return false;
    }
  };
}

function errorMessage(
  error: AxiosError<ErrorResponse>['response'],
): string {
  const result = error?.data?.message ?? 'Unknown error';

  return Array.isArray(result) ? result[0] : result;
}
