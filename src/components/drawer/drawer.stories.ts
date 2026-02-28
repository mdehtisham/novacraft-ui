import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './drawer';
import '../button/button';

const meta: Meta = {
  title: 'Overlays/Drawer',
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    placement: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    'close-on-overlay': { control: 'boolean' },
    'close-on-escape': { control: 'boolean' },
  },
  args: {
    open: false,
    placement: 'right',
    size: 'md',
    'close-on-overlay': true,
    'close-on-escape': true,
  },
};

export default meta;
type Story = StoryObj;

const drawerTrigger = (placement: string, size: string, label: string, args: Record<string, unknown>) => html`
  <nc-button
    @click=${(e: Event) => {
      const drawer = (e.target as HTMLElement).nextElementSibling as any;
      if (drawer) drawer.setAttribute('open', '');
    }}
  >${label}</nc-button>
  <nc-drawer
    ?open=${args['open']}
    placement=${placement}
    size=${size}
    ?close-on-overlay=${args['close-on-overlay']}
    ?close-on-escape=${args['close-on-escape']}
  >
    <span slot="header">Drawer Title</span>
    <p>This is the drawer body content. Add navigation, forms, or details here.</p>
    <nc-button slot="footer" variant="primary">Save</nc-button>
    <nc-button slot="footer" variant="ghost">Close</nc-button>
  </nc-drawer>
`;

export const Default: Story = {
  args: { placement: 'right', size: 'md' },
  render: (args) => drawerTrigger('right', 'md', 'Open Drawer (Right)', args),
};

export const Left: Story = {
  args: { placement: 'left', size: 'md' },
  render: (args) => html`
    <nc-button
      @click=${(e: Event) => {
        const drawer = (e.target as HTMLElement).nextElementSibling as any;
        if (drawer) drawer.setAttribute('open', '');
      }}
    >Open Drawer (Left)</nc-button>
    <nc-drawer
      ?open=${args['open']}
      placement="left"
      size="md"
      ?close-on-overlay=${args['close-on-overlay']}
      ?close-on-escape=${args['close-on-escape']}
    >
      <span slot="header">Left Drawer</span>
      <p>This drawer slides in from the left side.</p>
      <nc-button slot="footer" variant="primary">Apply</nc-button>
      <nc-button slot="footer" variant="ghost">Cancel</nc-button>
    </nc-drawer>
  `,
};

export const Top: Story = {
  args: { placement: 'top', size: 'md' },
  render: (args) => html`
    <nc-button
      @click=${(e: Event) => {
        const drawer = (e.target as HTMLElement).nextElementSibling as any;
        if (drawer) drawer.setAttribute('open', '');
      }}
    >Open Drawer (Top)</nc-button>
    <nc-drawer
      ?open=${args['open']}
      placement="top"
      size="md"
      ?close-on-overlay=${args['close-on-overlay']}
      ?close-on-escape=${args['close-on-escape']}
    >
      <span slot="header">Top Drawer</span>
      <p>This drawer slides in from the top of the screen.</p>
      <nc-button slot="footer" variant="primary">Confirm</nc-button>
    </nc-drawer>
  `,
};

export const Bottom: Story = {
  args: { placement: 'bottom', size: 'md' },
  render: (args) => html`
    <nc-button
      @click=${(e: Event) => {
        const drawer = (e.target as HTMLElement).nextElementSibling as any;
        if (drawer) drawer.setAttribute('open', '');
      }}
    >Open Drawer (Bottom)</nc-button>
    <nc-drawer
      ?open=${args['open']}
      placement="bottom"
      size="md"
      ?close-on-overlay=${args['close-on-overlay']}
      ?close-on-escape=${args['close-on-escape']}
    >
      <span slot="header">Bottom Drawer</span>
      <p>This drawer slides in from the bottom — common for mobile action sheets.</p>
      <nc-button slot="footer" variant="primary">Done</nc-button>
    </nc-drawer>
  `,
};

export const Sizes: Story = {
  render: (args) => html`
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      ${(['sm', 'md', 'lg', 'xl'] as const).map(
        (size) => html`
          <nc-button
            @click=${(e: Event) => {
              const btn = e.target as HTMLElement;
              const drawer = btn.parentElement?.querySelector(`nc-drawer[size="${size}"]`) as any;
              if (drawer) drawer.setAttribute('open', '');
            }}
          >Open ${size.toUpperCase()}</nc-button>
        `
      )}
      ${(['sm', 'md', 'lg', 'xl'] as const).map(
        (size) => html`
          <nc-drawer
            placement="right"
            size=${size}
            ?close-on-overlay=${args['close-on-overlay']}
            ?close-on-escape=${args['close-on-escape']}
          >
            <span slot="header">${size.toUpperCase()} Drawer</span>
            <p>This is the <strong>${size}</strong> size drawer.</p>
            <nc-button slot="footer" variant="ghost">Close</nc-button>
          </nc-drawer>
        `
      )}
    </div>
  `,
};
