import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './status-badge';

type Args = {
  status: 'online' | 'offline' | 'away' | 'busy' | 'info' | 'success' | 'warning' | 'danger';
  pulse: boolean;
  size: 'sm' | 'md' | 'lg';
  label: string;
};

const meta: Meta<Args> = {
  title: 'Primitives/StatusBadge',
  tags: ['autodocs'],
  render: (args) => html`
    <nc-status-badge
      status=${args.status}
      ?pulse=${args.pulse}
      size=${args.size}
      label=${args.label}
    ></nc-status-badge>
  `,
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['online', 'offline', 'away', 'busy', 'info', 'success', 'warning', 'danger'],
      description: 'Status type that determines the indicator color',
    },
    pulse: {
      control: 'boolean',
      description: 'Adds a pulsing animation to draw attention',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Badge size',
    },
    label: {
      control: { type: 'text' },
      description: 'Optional visible text label alongside the indicator dot',
    },
  },
  args: {
    status: 'online',
    pulse: false,
    size: 'md',
    label: '',
  },
};
export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const AllStatuses: Story = {
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;">
      <nc-status-badge status="online"></nc-status-badge>
      <nc-status-badge status="offline"></nc-status-badge>
      <nc-status-badge status="away"></nc-status-badge>
      <nc-status-badge status="busy"></nc-status-badge>
      <nc-status-badge status="info"></nc-status-badge>
      <nc-status-badge status="success"></nc-status-badge>
      <nc-status-badge status="warning"></nc-status-badge>
      <nc-status-badge status="danger"></nc-status-badge>
    </div>
  `,
};

export const WithPulse: Story = {
  args: { pulse: true },
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;">
      <nc-status-badge status="online" pulse></nc-status-badge>
      <nc-status-badge status="busy" pulse></nc-status-badge>
      <nc-status-badge status="danger" pulse></nc-status-badge>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;">
      <nc-status-badge status="online" size="sm"></nc-status-badge>
      <nc-status-badge status="online" size="md"></nc-status-badge>
      <nc-status-badge status="online" size="lg"></nc-status-badge>
    </div>
  `,
};

export const WithLabel: Story = {
  args: { label: 'Online' },
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;">
      <nc-status-badge status="online" label="Online"></nc-status-badge>
      <nc-status-badge status="offline" label="Offline"></nc-status-badge>
      <nc-status-badge status="away" label="Away"></nc-status-badge>
      <nc-status-badge status="busy" label="Busy"></nc-status-badge>
    </div>
  `,
};
