import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import './checkbox';

interface CheckboxArgs {
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  label: string;
  value: string;
  name: string;
}

const meta: Meta<CheckboxArgs> = {
  title: 'Forms/Checkbox',
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    value: { control: 'text' },
    name: { control: 'text' },
  },
  args: {
    checked: false,
    indeterminate: false,
    disabled: false,
    label: '',
    value: 'checkbox',
    name: 'checkbox',
  },
  render: (args) => html`
    <nc-checkbox
      label=${args.label}
      value=${args.value}
      name=${args.name}
      ?checked=${args.checked}
      ?indeterminate=${args.indeterminate}
      ?disabled=${args.disabled}
      @nc-change=${(e: Event) => console.log('nc-change', e)}
    ></nc-checkbox>
  `,
};

export default meta;
type Story = StoryObj<CheckboxArgs>;

export const Default: Story = {
  args: {
    label: 'Unchecked',
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    label: 'Checked',
    checked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'Indeterminate',
    indeterminate: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled & Checked',
    checked: true,
    disabled: true,
  },
};

export const WithLabel: Story = {
  args: {
    label: 'I agree to the terms and conditions',
    checked: false,
  },
};

export const Group: Story = {
  render: () => html`
    <fieldset style="border:none;padding:0;display:flex;flex-direction:column;gap:0.5rem;">
      <legend style="font-weight:600;margin-bottom:0.5rem;">Select your interests</legend>
      <nc-checkbox name="interests" value="design"       label="Design"       ?checked=${true}></nc-checkbox>
      <nc-checkbox name="interests" value="development"  label="Development"  ?checked=${false}></nc-checkbox>
      <nc-checkbox name="interests" value="marketing"    label="Marketing"    ?checked=${true}></nc-checkbox>
    </fieldset>
  `,
};
