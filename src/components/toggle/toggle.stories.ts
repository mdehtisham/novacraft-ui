import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import './toggle';

interface ToggleArgs {
  checked: boolean;
  disabled: boolean;
  size: 'sm' | 'md' | 'lg';
  label: string;
  name: string;
  value: string;
}

const meta: Meta<ToggleArgs> = {
  title: 'Forms/Toggle',
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    label: { control: 'text' },
    name: { control: 'text' },
    value: { control: 'text' },
  },
  args: {
    checked: false,
    disabled: false,
    size: 'md',
    label: '',
    name: 'toggle',
    value: 'on',
  },
  render: (args) => html`
    <nc-toggle
      size=${args.size}
      label=${args.label}
      name=${args.name}
      value=${args.value}
      ?checked=${args.checked}
      ?disabled=${args.disabled}
      @nc-change=${(e: Event) => console.log('nc-change', e)}
    ></nc-toggle>
  `,
};

export default meta;
type Story = StoryObj<ToggleArgs>;

export const Default: Story = {
  args: {
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;align-items:center;gap:1.5rem;">
      <nc-toggle size="sm" label="Small"></nc-toggle>
      <nc-toggle size="md" label="Medium"></nc-toggle>
      <nc-toggle size="lg" label="Large"></nc-toggle>
    </div>
  `,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    checked: false,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Enable notifications',
    checked: false,
  },
};
