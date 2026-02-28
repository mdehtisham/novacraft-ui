import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import './input';

interface InputArgs {
  type: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
  label: string;
  placeholder: string;
  value: string;
  error: string;
  hint: string;
  required: boolean;
  disabled: boolean;
  name: string;
}

const meta: Meta<InputArgs> = {
  title: 'Forms/Input',
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel', 'url'],
    },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    error: { control: 'text' },
    hint: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    name: { control: 'text' },
  },
  args: {
    type: 'text',
    label: '',
    placeholder: '',
    value: '',
    error: '',
    hint: '',
    required: false,
    disabled: false,
    name: 'input',
  },
  render: (args) => html`
    <nc-input
      type=${args.type}
      label=${args.label}
      placeholder=${args.placeholder}
      value=${args.value}
      error=${args.error}
      hint=${args.hint}
      name=${args.name}
      ?required=${args.required}
      ?disabled=${args.disabled}
      @nc-input=${(e: Event) => console.log('nc-input', e)}
      @nc-change=${(e: Event) => console.log('nc-change', e)}
      @nc-focus=${(e: Event) => console.log('nc-focus', e)}
      @nc-blur=${(e: Event) => console.log('nc-blur', e)}
    ></nc-input>
  `,
};

export default meta;
type Story = StoryObj<InputArgs>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text…',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'John Doe',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    type: 'email',
    error: 'Please enter a valid email address.',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Username',
    placeholder: 'johndoe',
    hint: 'Must be 3–20 characters.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    placeholder: 'Cannot edit',
    disabled: true,
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    label: 'Password',
    placeholder: '••••••••',
  },
};

export const Types: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:1rem;">
      <nc-input type="text"     label="Text"     placeholder="Plain text"></nc-input>
      <nc-input type="password" label="Password" placeholder="••••••••"></nc-input>
      <nc-input type="email"    label="Email"    placeholder="you@example.com"></nc-input>
      <nc-input type="number"   label="Number"   placeholder="42"></nc-input>
      <nc-input type="tel"      label="Tel"      placeholder="+1 555 000 0000"></nc-input>
      <nc-input type="url"      label="URL"      placeholder="https://example.com"></nc-input>
    </div>
  `,
};

export const WithPrefixIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search anything…',
  },
  render: (args) => html`
    <nc-input
      type=${args.type}
      label=${args.label}
      placeholder=${args.placeholder}
      value=${args.value}
      error=${args.error}
      hint=${args.hint}
      name=${args.name}
      ?required=${args.required}
      ?disabled=${args.disabled}
    >
      <span slot="prefix">🔍</span>
    </nc-input>
  `,
};

export const WithSuffixIcon: Story = {
  args: {
    label: 'Website',
    placeholder: 'example.com',
  },
  render: (args) => html`
    <nc-input
      type=${args.type}
      label=${args.label}
      placeholder=${args.placeholder}
      value=${args.value}
      error=${args.error}
      hint=${args.hint}
      name=${args.name}
      ?required=${args.required}
      ?disabled=${args.disabled}
    >
      <span slot="suffix">🌐</span>
    </nc-input>
  `,
};

export const FullPlayground: Story = {
  args: {
    type: 'text',
    label: 'Playground',
    placeholder: 'Try me…',
    hint: 'Adjust controls to explore.',
    required: false,
    disabled: false,
  },
};
