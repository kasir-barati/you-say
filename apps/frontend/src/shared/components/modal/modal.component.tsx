import classNames from 'classnames';
import { MouseEventHandler, PropsWithChildren } from 'react';

export interface ModalProps {
  open: boolean;
  onClose(): void;
  dataTest?: string;
}

export function Modal({
  open,
  onClose,
  dataTest = 'modal',
  children,
}: Readonly<PropsWithChildren<ModalProps>>) {
  const modalClickHandler: MouseEventHandler<HTMLDivElement> = (
    event,
  ) => {
    // Preventing modal from being closed by clicking on the modal itself
    event.stopPropagation();
  };

  return (
    <div
      data-test={dataTest}
      onClick={onClose}
      className={classNames(
        'fixed inset-0 flex flex-col items-center justify-start pt-32 transition-colors',
        { 'visible bg-black/20': open },
        { invisible: !open },
      )}
    >
      <div
        data-test="modal-body-wrapper"
        onClick={modalClickHandler}
        className={classNames(
          'w-1/3 rounded-xl bg-white p-6 shadow transition-all',
          { 'scale-100 opacity-100': open },
          { 'scale-125 opacity-0': !open },
        )}
      >
        {children}
      </div>
    </div>
  );
}
