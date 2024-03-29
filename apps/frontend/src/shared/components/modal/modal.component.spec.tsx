import { act, fireEvent, render } from '@testing-library/react';
import { Modal, ModalProps } from './modal.component';

describe('Modal', () => {
  it.each<Required<ModalProps>>([
    { dataTest: 'modal1', onClose: jest.fn(), open: true },
    { dataTest: 'modal2', onClose: jest.fn(), open: false },
  ])('should pass down all the props', async (props) => {
    const screen = await act(() => render(<Modal {...props} />));
    const modal = screen.getByTestId(props.dataTest);

    await act(() => fireEvent.click(modal));

    expect(modal).toBeInTheDocument();
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });
});
