import classNames from 'classnames';
import { HTMLInputTypeAttribute } from 'react';

export interface InputProps {
  id?: string;
  type: HTMLInputTypeAttribute;
  dataTest?: string;
  className?: string;
  placeholder?: string;
}

export function Input({
  type,
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
    />
  );
}
