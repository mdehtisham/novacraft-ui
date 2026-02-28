import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './card';

type Args = {
  variant: 'elevated' | 'flat' | 'outlined' | 'ghost';
  padding: 'none' | 'sm' | 'md' | 'lg';
  interactive: boolean;
};

const meta: Meta<Args> = {
  title: 'Primitives/Card',
  tags: ['autodocs'],
  render: (args) => html`
    <nc-card
      variant=${args.variant}
      padding=${args.padding}
      ?interactive=${args.interactive}
      style="max-width:320px;"
    >
      <p>Card content goes here. This is the default slot.</p>
    </nc-card>
  `,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['elevated', 'flat', 'outlined', 'ghost'],
      description: 'Visual style variant',
    },
    padding: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Internal padding size',
    },
    interactive: {
      control: 'boolean',
      description: 'Enables hover/focus styles and emits nc-click',
    },
  },
  args: {
    variant: 'elevated',
    padding: 'md',
    interactive: false,
  },
};
export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:1rem;">
      <nc-card variant="elevated" padding="md" style="width:200px;">
        <strong>Elevated</strong>
        <p>Raised shadow card.</p>
      </nc-card>
      <nc-card variant="flat" padding="md" style="width:200px;">
        <strong>Flat</strong>
        <p>No shadow, filled background.</p>
      </nc-card>
      <nc-card variant="outlined" padding="md" style="width:200px;">
        <strong>Outlined</strong>
        <p>Border, no shadow.</p>
      </nc-card>
      <nc-card variant="ghost" padding="md" style="width:200px;">
        <strong>Ghost</strong>
        <p>Transparent background.</p>
      </nc-card>
    </div>
  `,
};

export const Padding: Story = {
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:flex-start;">
      <nc-card variant="outlined" padding="none" style="width:160px;">
        <span>None</span>
      </nc-card>
      <nc-card variant="outlined" padding="sm" style="width:160px;">
        <span>Small</span>
      </nc-card>
      <nc-card variant="outlined" padding="md" style="width:160px;">
        <span>Medium</span>
      </nc-card>
      <nc-card variant="outlined" padding="lg" style="width:160px;">
        <span>Large</span>
      </nc-card>
    </div>
  `,
};

export const Interactive: Story = {
  args: { interactive: true },
  render: (args) => html`
    <nc-card variant="elevated" padding="md" ?interactive=${args.interactive} style="max-width:280px;cursor:pointer;">
      <strong>Interactive Card</strong>
      <p>Hover or focus me. I'll emit an <code>nc-click</code> event when clicked.</p>
    </nc-card>
  `,
};

export const WithSlots: Story = {
  render: () => html`
    <nc-card variant="elevated" padding="md" style="max-width:320px;">
      <img
        slot="media"
        src="https://placehold.co/320x160"
        alt="Card media"
        style="width:100%;display:block;"
      />
      <div slot="header" style="font-weight:600;font-size:1.1rem;">Card Title</div>
      <p>This is the main body content of the card. It lives in the default slot.</p>
      <div slot="footer" style="display:flex;justify-content:flex-end;gap:0.5rem;">
        <nc-button variant="ghost" size="sm">Cancel</nc-button>
        <nc-button variant="primary" size="sm">Confirm</nc-button>
      </div>
    </nc-card>
  `,
};
