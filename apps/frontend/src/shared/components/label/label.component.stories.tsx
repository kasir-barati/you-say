import { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, within } from '@storybook/test';
import { Label } from './label.component';

type Story = StoryObj<typeof Label>;

export default {
  component: Label,
  args: {
    children: 'Label',
  },
} satisfies Meta<typeof Label>;

export const Default: Story = {
  play({ canvasElement }) {
    const canvas = within(canvasElement);
    const label = canvas.getByTestId('label');
    expect(label).toHaveClass('text-sm', 'font-semibold');
  },
};
export const HtmlFor: Story = {
  render() {
    return (
      <>
        <Label htmlFor="some-input">Some input</Label>
        <br />
        <input type="text" id="some-input" />
      </>
    );
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    const label = canvas.getByTestId('label');
    const input = canvas.getByRole('textbox');
    await fireEvent.click(label);
    expect(input).toHaveFocus();
  },
};
