import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './spinner';

type Args = {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant: 'primary' | 'secondary' | 'white' | 'current';
  label: string;
};

const meta: Meta<Args> = {
  title: 'Primitives/Spinner',
  tags: ['autodocs'],
  render: (args) => html`
    <nc-spinner
      size=${args.size}
      variant=${args.variant}
      label=${args.label}
    ></nc-spinner>
  `,
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Spinner size',
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'white', 'current'],
      description: 'Color variant',
    },
    label: {
      control: { type: 'text' },
      description: 'Accessible label for screen readers',
    },
  },
  args: {
    size: 'md',
    variant: 'primary',
    label: 'Loading…',
  },
};
export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center;">
      <nc-spinner size="xs" label="xs"></nc-spinner>
      <nc-spinner size="sm" label="sm"></nc-spinner>
      <nc-spinner size="md" label="md"></nc-spinner>
      <nc-spinner size="lg" label="lg"></nc-spinner>
      <nc-spinner size="xl" label="xl"></nc-spinner>
    </div>
  `,
};

export const Variants: Story = {
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center;">
      <nc-spinner variant="primary" size="lg" label="primary"></nc-spinner>
      <nc-spinner variant="secondary" size="lg" label="secondary"></nc-spinner>
      <div style="background:#1e293b;padding:0.75rem;border-radius:0.5rem;">
        <nc-spinner variant="white" size="lg" label="white"></nc-spinner>
      </div>
      <nc-spinner variant="current" size="lg" label="current"></nc-spinner>
    </div>
  `,
};
