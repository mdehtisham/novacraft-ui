import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './badge';

type Args = {
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size: 'sm' | 'md' | 'lg';
  pill: boolean;
  dot: boolean;
  removable: boolean;
};

const meta: Meta<Args> = {
  title: 'Primitives/Badge',
  tags: ['autodocs'],
  render: (args) => html`
    <nc-badge
      variant=${args.variant}
      size=${args.size}
      ?pill=${args.pill}
      ?dot=${args.dot}
      ?removable=${args.removable}
    >
      Badge
    </nc-badge>
  `,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'],
      description: 'Color variant',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Badge size',
    },
    pill: { control: 'boolean', description: 'Fully rounded pill shape' },
    dot: { control: 'boolean', description: 'Shows a status dot instead of text' },
    removable: { control: 'boolean', description: 'Shows a dismiss button' },
  },
  args: {
    variant: 'primary',
    size: 'md',
    pill: false,
    dot: false,
    removable: false,
  },
};
export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;">
      <nc-badge variant="primary">Primary</nc-badge>
      <nc-badge variant="secondary">Secondary</nc-badge>
      <nc-badge variant="success">Success</nc-badge>
      <nc-badge variant="warning">Warning</nc-badge>
      <nc-badge variant="danger">Danger</nc-badge>
      <nc-badge variant="info">Info</nc-badge>
      <nc-badge variant="neutral">Neutral</nc-badge>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;">
      <nc-badge size="sm">Small</nc-badge>
      <nc-badge size="md">Medium</nc-badge>
      <nc-badge size="lg">Large</nc-badge>
    </div>
  `,
};

export const Pill: Story = {
  args: { pill: true },
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;">
      <nc-badge variant="primary" pill>Primary</nc-badge>
      <nc-badge variant="success" pill>Success</nc-badge>
      <nc-badge variant="warning" pill>Warning</nc-badge>
      <nc-badge variant="danger" pill>Danger</nc-badge>
    </div>
  `,
};

export const WithDot: Story = {
  args: { dot: true },
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;">
      <nc-badge variant="success" dot>Online</nc-badge>
      <nc-badge variant="warning" dot>Away</nc-badge>
      <nc-badge variant="danger" dot>Busy</nc-badge>
      <nc-badge variant="neutral" dot>Offline</nc-badge>
    </div>
  `,
};

export const Removable: Story = {
  args: { removable: true },
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;">
      <nc-badge variant="primary" removable>React</nc-badge>
      <nc-badge variant="secondary" removable>TypeScript</nc-badge>
      <nc-badge variant="success" removable>Verified</nc-badge>
      <nc-badge variant="info" removable>New</nc-badge>
    </div>
  `,
};
