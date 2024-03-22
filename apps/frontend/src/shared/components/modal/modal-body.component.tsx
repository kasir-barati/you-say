import { PropsWithChildren } from 'react';

export interface ModalBodyProps {
  dataTest?: string;
  className?: string;
}

export function ModalBody({
  children,
  className,
  dataTest = 'modal-body',
}: Readonly<PropsWithChildren<ModalBodyProps>>) {
  return (
    <div data-test={dataTest} className={className}>
      {children}
    </div>
  );
}
