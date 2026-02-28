import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import './search-input';

interface SearchInputArgs {
  value: string;
  placeholder: string;
  debounce: number;
  loading: boolean;
  disabled: boolean;
}

const meta: Meta<SearchInputArgs> = {
  title: 'Forms/SearchInput',
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
    debounce: { control: 'number' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    value: '',
    placeholder: 'Search…',
    debounce: 300,
    loading: false,
    disabled: false,
  },
  render: (args) => html`
    <nc-search-input
      value=${args.value}
      placeholder=${args.placeholder}
      debounce=${args.debounce}
      ?loading=${args.loading}
      ?disabled=${args.disabled}
      @nc-search=${(e: Event) => console.log('nc-search', e)}
      @nc-clear=${(e: Event) => console.log('nc-clear', e)}
    ></nc-search-input>
  `,
};

export default meta;
type Story = StoryObj<SearchInputArgs>;

export const Default: Story = {
  args: {
    placeholder: 'Search…',
  },
};

export const WithValue: Story = {
  args: {
    value: 'NovaCraft',
  },
};

export const Loading: Story = {
  args: {
    value: 'Loading results…',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Search disabled',
    disabled: true,
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Search components, docs…',
  },
};

export const CustomDebounce: Story = {
  args: {
    placeholder: 'Debounce: 600 ms',
    debounce: 600,
  },
};
