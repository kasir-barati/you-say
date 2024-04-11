import classNames from 'classnames';
import { PropsWithChildren } from 'react';

export interface PrimaryButtonProps {
  onClick?(): void;
  dataTest?: string;
  className?: string;
  type?: 'submit' | 'reset' | 'button';
}

export function PrimaryButton({
  onClick,
  children,
  className,
  dataTest = 'primary-button',
  type,
}: Readonly<PropsWithChildren<PrimaryButtonProps>>) {
  return (
    <button
      data-test={dataTest}
      className={classNames(
        'rounded-lg bg-rose-600 px-8 py-2 text-white',
        className,
      )}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
