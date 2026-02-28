import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import './textarea';

interface TextareaArgs {
  label: string;
  placeholder: string;
  value: string;
  error: string;
  hint: string;
  required: boolean;
  disabled: boolean;
  rows: number;
  maxlength: number;
  resize: 'vertical' | 'horizontal' | 'both' | 'none';
  'auto-grow': boolean;
  name: string;
}

const meta: Meta<TextareaArgs> = {
  title: 'Forms/Textarea',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    error: { control: 'text' },
    hint: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    rows: { control: 'number' },
    maxlength: { control: 'number' },
    resize: {
      control: 'select',
      options: ['vertical', 'horizontal', 'both', 'none'],
    },
    'auto-grow': { control: 'boolean' },
    name: { control: 'text' },
  },
  args: {
    label: '',
    placeholder: '',
    value: '',
    error: '',
    hint: '',
    required: false,
    disabled: false,
    rows: 3,
    maxlength: 0,
    resize: 'vertical',
    'auto-grow': false,
    name: 'textarea',
  },
  render: (args) => html`
    <nc-textarea
      label=${args.label}
      placeholder=${args.placeholder}
      value=${args.value}
      error=${args.error}
      hint=${args.hint}
      name=${args.name}
      rows=${args.rows}
      maxlength=${args.maxlength || ''}
      resize=${args.resize}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?auto-grow=${args['auto-grow']}
      @nc-input=${(e: Event) => console.log('nc-input', e)}
      @nc-change=${(e: Event) => console.log('nc-change', e)}
      @nc-focus=${(e: Event) => console.log('nc-focus', e)}
      @nc-blur=${(e: Event) => console.log('nc-blur', e)}
    ></nc-textarea>
  `,
};

export default meta;
type Story = StoryObj<TextareaArgs>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text…',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself…',
  },
};

export const WithError: Story = {
  args: {
    label: 'Description',
    placeholder: 'Describe the issue…',
    error: 'This field is required.',
  },
};

export const WithHint: Story = {
  args: {
    label: 'Comments',
    placeholder: 'Add your comments…',
    hint: 'Maximum 500 characters.',
    maxlength: 500,
  },
};

export const AutoGrow: Story = {
  args: {
    label: 'Auto-Growing Textarea',
    placeholder: 'Start typing and watch me grow…',
    'auto-grow': true,
    rows: 2,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Read Only',
    value: 'This content cannot be edited.',
    disabled: true,
  },
};

export const ResizeVariants: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:1.5rem;">
      <nc-textarea label="Resize: vertical"   resize="vertical"   placeholder="Drag bottom edge…" rows="3"></nc-textarea>
      <nc-textarea label="Resize: horizontal" resize="horizontal" placeholder="Drag right edge…" rows="3"></nc-textarea>
      <nc-textarea label="Resize: both"       resize="both"       placeholder="Drag any corner…"  rows="3"></nc-textarea>
      <nc-textarea label="Resize: none"       resize="none"       placeholder="Fixed size"        rows="3"></nc-textarea>
    </div>
  `,
};
