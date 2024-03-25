import { act, render } from '@testing-library/react';
import { Input, InputProps } from './input.component';

describe('Input', () => {
  it.each<InputProps>([
    {
      className: 'class1',
      dataTest: 'input1',
      id: 'input1-id',
      placeholder: 'placeholder1',
      type: 'text',
    },
    {
      className: 'class2',
      dataTest: 'input2',
      id: 'input2-id',
      placeholder: 'placeholder2',
      type: 'search',
    },
  ])('should pass down all the props', async (props) => {
    const screen = await act(() => render(<Input {...props} />));

    const input = screen.getByTestId(props.dataTest!);

    expect(input).toBeInTheDocument();
    expect(input.id).toBe(props.id);
    expect(input).toHaveClass(props.className!);
  });
});
