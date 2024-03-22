import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { ReactNode } from 'react';

export interface ModalHeaderProps {
  title: ReactNode;
  onClick?(): void;
  closeButtonDataTest?: string;
  closeButton?: boolean;
}

export function ModalHeader({
  title,
  onClick,
  closeButton = false,
  closeButtonDataTest = 'close-modal',
}: Readonly<ModalHeaderProps>) {
  if (closeButton && onClick === undefined) {
    throw "You've forgotten to pass onClick";
  }

  return (
    <div className="my-6 text-3xl">
      <h1>{title}</h1>
      {closeButton && (
        <button
          onClick={onClick}
          className="absolute right-6 top-6 rounded-lg text-gray-300 transition-colors hover:text-gray-600"
        >
          <XMarkIcon
            className="h-6 w-6"
            data-test={closeButtonDataTest}
          />
        </button>
      )}
    </div>
  );
}
