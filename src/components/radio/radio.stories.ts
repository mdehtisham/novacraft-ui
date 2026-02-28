import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import './radio';

interface RadioGroupArgs {
  name: string;
  value: string;
  label: string;
  disabled: boolean;
}

const meta: Meta<RadioGroupArgs> = {
  title: 'Forms/Radio',
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    value: { control: 'text' },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    name: 'radio-group',
    value: '',
    label: 'Choose an option',
    disabled: false,
  },
  render: (args) => html`
    <nc-radio-group
      name=${args.name}
      value=${args.value}
      label=${args.label}
      ?disabled=${args.disabled}
      @nc-change=${(e: Event) => console.log('nc-change', e)}
    >
      <nc-radio value="option-1" label="Option 1"></nc-radio>
      <nc-radio value="option-2" label="Option 2"></nc-radio>
      <nc-radio value="option-3" label="Option 3"></nc-radio>
    </nc-radio-group>
  `,
};

export default meta;
type Story = StoryObj<RadioGroupArgs>;

export const Default: Story = {
  args: {
    label: 'Pick one',
    value: '',
  },
};

export const PreSelected: Story = {
  args: {
    label: 'Subscription Plan',
    value: 'option-2',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Group',
    disabled: true,
  },
};

export const HorizontalLayout: Story = {
  render: () => html`
    <nc-radio-group
      name="horizontal-radio"
      label="Layout"
      @nc-change=${(e: Event) => console.log('nc-change', e)}
    >
      <div style="display:flex;gap:1.5rem;flex-wrap:wrap;">
        <nc-radio value="list"  label="List"></nc-radio>
        <nc-radio value="grid"  label="Grid"></nc-radio>
        <nc-radio value="table" label="Table"></nc-radio>
      </div>
    </nc-radio-group>
  `,
};
