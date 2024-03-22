import { act, fireEvent, render } from '@testing-library/react';
import {
  ModalHeader,
  ModalHeaderProps,
} from './modal-header.component';

describe('ModalHeader', () => {
  it.each<Required<ModalHeaderProps>>([
    {
      title: 'title1',
      closeButton: true,
      closeButtonDataTest: 'modal1-close-button-in-modal-header',
      onClick: jest.fn(),
    },
    {
      title: <span>title2</span>,
      closeButton: true,
      closeButtonDataTest: 'modal2-close-button-in-modal-header',
      onClick: jest.fn(),
    },
  ])('should pass props to the component', async (props) => {
    const screen = await act(() =>
      render(<ModalHeader {...props} />),
    );
    const modalHeaderCloseButton = screen.getByTestId(
      props.closeButtonDataTest,
    );

    act(() => fireEvent.click(modalHeaderCloseButton));

    expect(props.onClick).toHaveBeenCalledTimes(1);
  });

  it('should throw "You\'ve forgotten to pass onClick" if closeButton prop is true but onClick is undefined', async () => {
    try {
      await act(() =>
        render(<ModalHeader title="something" closeButton={true} />),
      );
    } catch (error) {
      expect(error).toBe("You've forgotten to pass onClick");
    }
  });
});
