import classNames from 'classnames';
import { PropsWithChildren } from 'react';

export interface PrimaryButtonProps {
  onClick?(): void;
  dataTest?: string;
  className?: string;
}

export function PrimaryButton({
  onClick,
  children,
  className,
  dataTest = 'primary-button',
}: Readonly<PropsWithChildren<PrimaryButtonProps>>) {
  return (
    <button
      data-test={dataTest}
      className={classNames(
        'rounded-lg bg-rose-600 py-3 text-white',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
