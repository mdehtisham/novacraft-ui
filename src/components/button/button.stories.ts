import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './button';

type Args = {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'link';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled: boolean;
  loading: boolean;
  'full-width': boolean;
  'icon-only': boolean;
};

const meta: Meta<Args> = {
  title: 'Primitives/Button',
  tags: ['autodocs'],
  render: (args) => html`
    <nc-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
      ?full-width=${args['full-width']}
      ?icon-only=${args['icon-only']}
    >
      Click me
    </nc-button>
  `,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'danger', 'outline', 'link'],
      description: 'Visual style variant',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Button size',
    },
    disabled: { control: 'boolean', description: 'Disables the button' },
    loading: { control: 'boolean', description: 'Shows loading spinner' },
    'full-width': { control: 'boolean', description: 'Stretches to fill container width' },
    'icon-only': { control: 'boolean', description: 'Square button for icon-only usage' },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    'full-width': false,
    'icon-only': false,
  },
};
export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;">
      <nc-button variant="primary">Primary</nc-button>
      <nc-button variant="secondary">Secondary</nc-button>
      <nc-button variant="ghost">Ghost</nc-button>
      <nc-button variant="danger">Danger</nc-button>
      <nc-button variant="outline">Outline</nc-button>
      <nc-button variant="link">Link</nc-button>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;">
      <nc-button size="xs">Extra Small</nc-button>
      <nc-button size="sm">Small</nc-button>
      <nc-button size="md">Medium</nc-button>
      <nc-button size="lg">Large</nc-button>
      <nc-button size="xl">Extra Large</nc-button>
    </div>
  `,
};

export const Loading: Story = {
  args: { loading: true },
  render: (args) => html`
    <div style="display:flex;gap:0.75rem;align-items:center;">
      <nc-button variant="primary" ?loading=${args.loading}>Saving...</nc-button>
      <nc-button variant="secondary" ?loading=${args.loading}>Loading</nc-button>
      <nc-button variant="outline" ?loading=${args.loading}>Processing</nc-button>
    </div>
  `,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => html`
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;">
      <nc-button variant="primary" ?disabled=${args.disabled}>Primary</nc-button>
      <nc-button variant="secondary" ?disabled=${args.disabled}>Secondary</nc-button>
      <nc-button variant="ghost" ?disabled=${args.disabled}>Ghost</nc-button>
      <nc-button variant="danger" ?disabled=${args.disabled}>Danger</nc-button>
    </div>
  `,
};

export const WithIcons: Story = {
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;">
      <nc-button variant="primary">
        <span slot="prefix">▶</span>
        Play
      </nc-button>
      <nc-button variant="secondary">
        <span slot="prefix">⬇</span>
        Download
      </nc-button>
      <nc-button variant="outline">
        Settings
        <span slot="suffix">⚙</span>
      </nc-button>
      <nc-button variant="ghost" icon-only>
        <span slot="prefix">✕</span>
      </nc-button>
    </div>
  `,
};

export const FullWidth: Story = {
  args: { 'full-width': true },
  render: (args) => html`
    <div style="max-width:400px;">
      <nc-button variant="primary" ?full-width=${args['full-width']}>Full Width Button</nc-button>
    </div>
  `,
};

export const Playground: Story = {
  render: (args) => html`
    <nc-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
      ?full-width=${args['full-width']}
      ?icon-only=${args['icon-only']}
    >
      <span slot="prefix">▶</span>
      Playground Button
      <span slot="suffix">→</span>
    </nc-button>
  `,
};
