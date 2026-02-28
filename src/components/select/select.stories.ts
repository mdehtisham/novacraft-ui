import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import './select';

interface SelectArgs {
  label: string;
  placeholder: string;
  value: string;
  error: string;
  hint: string;
  required: boolean;
  disabled: boolean;
  searchable: boolean;
  options: string;
  name: string;
}

const DEFAULT_OPTIONS = JSON.stringify([
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
]);

const meta: Meta<SelectArgs> = {
  title: 'Forms/Select',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    error: { control: 'text' },
    hint: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    searchable: { control: 'boolean' },
    options: { control: 'text' },
    name: { control: 'text' },
  },
  args: {
    label: '',
    placeholder: 'Select an option…',
    value: '',
    error: '',
    hint: '',
    required: false,
    disabled: false,
    searchable: false,
    options: DEFAULT_OPTIONS,
    name: 'select',
  },
  render: (args) => html`
    <nc-select
      label=${args.label}
      placeholder=${args.placeholder}
      value=${args.value}
      error=${args.error}
      hint=${args.hint}
      name=${args.name}
      options=${args.options}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?searchable=${args.searchable}
      @nc-change=${(e: Event) => console.log('nc-change', e)}
      @nc-focus=${(e: Event) => console.log('nc-focus', e)}
      @nc-blur=${(e: Event) => console.log('nc-blur', e)}
    ></nc-select>
  `,
};

export default meta;
type Story = StoryObj<SelectArgs>;

export const Default: Story = {
  args: {
    options: DEFAULT_OPTIONS,
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Favourite Fruit',
    placeholder: 'Pick a fruit…',
    options: JSON.stringify([
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
    ]),
  },
};

export const WithError: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select country…',
    error: 'Please select a country.',
    options: JSON.stringify([
      { value: 'us', label: 'United States' },
      { value: 'gb', label: 'United Kingdom' },
      { value: 'ca', label: 'Canada' },
    ]),
  },
};

export const Searchable: Story = {
  args: {
    label: 'Language',
    placeholder: 'Search languages…',
    searchable: true,
    options: JSON.stringify([
      { value: 'en', label: 'English' },
      { value: 'es', label: 'Spanish' },
      { value: 'fr', label: 'French' },
      { value: 'de', label: 'German' },
      { value: 'ja', label: 'Japanese' },
    ]),
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Select',
    disabled: true,
    options: DEFAULT_OPTIONS,
  },
};

export const PreSelected: Story = {
  args: {
    label: 'Pre-Selected',
    value: '2',
    options: DEFAULT_OPTIONS,
  },
};
