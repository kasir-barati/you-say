import { act, render } from '@testing-library/react';
import { ModalBody, ModalBodyProps } from './modal-body.component';

describe('ModalBody', () => {
  it.each<Required<ModalBodyProps>>([
    { className: 'asd', dataTest: 'modal-body1' },
    { className: 'qwe', dataTest: 'modal-body2' },
  ])('should pass down props', async (props) => {
    const screen = await act(() => render(<ModalBody {...props} />));

    const modalBody = screen.getByTestId(props.dataTest);

    expect(modalBody).toBeInTheDocument();
    expect(modalBody).toHaveClass(props.className);
  });

  it('should pass down children', async () => {
    const children = Date.now().toString();
    const screen = await act(() =>
      render(<ModalBody>{children}</ModalBody>),
    );

    const modalBody = screen.getByText(children);

    expect(modalBody).toBeInTheDocument();
  });
});
