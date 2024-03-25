import classNames from 'classnames';
import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

export type InputProps = {
  dataTest?: string;
} & DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export function Input({
  type,
  name,
  onChange,
  className,
  placeholder,
  id = 'input-id',
  dataTest = 'input',
}: Readonly<InputProps>) {
  return (
    <input
      id={id}
      type={type}
      data-test={dataTest}
      className={classNames(
        'rounded-lg border border-neutral-200 p-3 transition-all focus:border-neutral-400 focus:outline-none',
        className,
      )}
      placeholder={placeholder}
      onChange={onChange}
      name={name}
    />
  );
}
