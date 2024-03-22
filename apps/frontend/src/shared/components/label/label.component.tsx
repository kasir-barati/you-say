import classNames from 'classnames';
import { PropsWithChildren } from 'react';

export interface LabelProps {
  htmlFor: string;
  dataTest?: string;
  className?: string;
}

export function Label({
  htmlFor,
  className,
  dataTest = 'label',
  children,
}: Readonly<PropsWithChildren<LabelProps>>) {
  return (
    <label
      htmlFor={htmlFor}
      data-test={dataTest}
      className={classNames('text-sm font-semibold', className)}
    >
      {children}
    </label>
  );
}
