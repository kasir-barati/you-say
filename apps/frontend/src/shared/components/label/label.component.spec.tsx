import { act, render } from '@testing-library/react';
import { ReactNode } from 'react';
import { Label, LabelProps } from './label.component';

describe('Label', () => {
  it('should pass down all the props', async () => {
    const props: Required<LabelProps> = {
      className: `class-${Date.now()}`,
      dataTest: `test-${Date.now()}`,
      htmlFor: `for-${Date.now()}`,
    };
    const labelText = `label ${Date.now()}`;
    const screen = await act(() =>
      render(<Label {...props}>{labelText}</Label>),
    );

    const label = screen.getByTestId(props.dataTest);

    expect(label).toBeInTheDocument();
    expect(label).toHaveClass(props.className);
    expect(label).toHaveTextContent(labelText);
  });

  it.each<ReactNode>([<h1>label2</h1>, 123, 'labels', true])(
    'should accept any ReactNode as children',
    async (children) => {
      const screen = await act(() =>
        render(<Label htmlFor="something">{children}</Label>),
      );

      const label = screen.getByTestId('label');

      expect(label).toBeInTheDocument();
    },
  );
});
