import {
  DetailedHTMLProps,
  FormEventHandler,
  FormHTMLAttributes,
  PropsWithChildren,
} from 'react';

export type FormProps<T> = {
  dataTest: string;
  onSubmit: (formData: T) => void | Promise<void>;
} & Omit<
  DetailedHTMLProps<
    FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  >,
  'onSubmit'
>;

export function Form<T>({
  children,
  dataTest,
  onSubmit,
  ...props
}: Readonly<PropsWithChildren<FormProps<T>>>) {
  const submitHandler: FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();
    const formData = Object.fromEntries(
      new FormData(event.currentTarget),
    ) as unknown as T;

    await onSubmit(formData);
  };

  return (
    <form onSubmit={submitHandler} data-test={dataTest} {...props}>
      {children}
    </form>
  );
}
