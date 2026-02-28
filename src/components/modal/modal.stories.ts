import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './modal';
import '../button/button';

const meta: Meta = {
  title: 'Overlays/Modal',
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    'close-on-escape': { control: 'boolean' },
    'close-on-overlay': { control: 'boolean' },
  },
  args: {
    open: false,
    size: 'md',
    'close-on-escape': true,
    'close-on-overlay': true,
  },
};

export default meta;
type Story = StoryObj;

const triggerRender = (args: Record<string, unknown>) => html`
  <nc-button
    @click=${(e: Event) => {
      const modal = (e.target as HTMLElement).nextElementSibling as any;
      if (modal) modal.setAttribute('open', '');
    }}
  >Open Modal</nc-button>
  <nc-modal
    ?open=${args['open']}
    size=${args['size']}
    ?close-on-escape=${args['close-on-escape']}
    ?close-on-overlay=${args['close-on-overlay']}
  >
    <span slot="header">Modal Title</span>
    <p>This is the modal body content.</p>
    <nc-button slot="footer" variant="primary">Confirm</nc-button>
    <nc-button slot="footer" variant="ghost">Cancel</nc-button>
  </nc-modal>
`;

export const Default: Story = {
  args: { size: 'md' },
  render: triggerRender,
};

export const Small: Story = {
  args: { size: 'sm' },
  render: (args) => html`
    <nc-button
      @click=${(e: Event) => {
        const modal = (e.target as HTMLElement).nextElementSibling as any;
        if (modal) modal.setAttribute('open', '');
      }}
    >Open Small Modal</nc-button>
    <nc-modal
      ?open=${args['open']}
      size="sm"
      ?close-on-escape=${args['close-on-escape']}
      ?close-on-overlay=${args['close-on-overlay']}
    >
      <span slot="header">Small Modal</span>
      <p>This is a small modal dialog.</p>
      <nc-button slot="footer" variant="primary">OK</nc-button>
    </nc-modal>
  `,
};

export const Large: Story = {
  args: { size: 'lg' },
  render: (args) => html`
    <nc-button
      @click=${(e: Event) => {
        const modal = (e.target as HTMLElement).nextElementSibling as any;
        if (modal) modal.setAttribute('open', '');
      }}
    >Open Large Modal</nc-button>
    <nc-modal
      ?open=${args['open']}
      size="lg"
      ?close-on-escape=${args['close-on-escape']}
      ?close-on-overlay=${args['close-on-overlay']}
    >
      <span slot="header">Large Modal</span>
      <p>This is a large modal with more room for content. You can place forms, tables, or rich content here.</p>
      <p>Add as much body content as needed within this spacious layout.</p>
      <nc-button slot="footer" variant="primary">Save Changes</nc-button>
      <nc-button slot="footer" variant="ghost">Cancel</nc-button>
    </nc-modal>
  `,
};

export const FullScreen: Story = {
  args: { size: 'full' },
  render: (args) => html`
    <nc-button
      @click=${(e: Event) => {
        const modal = (e.target as HTMLElement).nextElementSibling as any;
        if (modal) modal.setAttribute('open', '');
      }}
    >Open Full Screen Modal</nc-button>
    <nc-modal
      ?open=${args['open']}
      size="full"
      ?close-on-escape=${args['close-on-escape']}
      ?close-on-overlay=${args['close-on-overlay']}
    >
      <span slot="header">Full Screen Modal</span>
      <p>This modal takes up the entire viewport. Ideal for immersive workflows or complex editing experiences.</p>
      <nc-button slot="footer" variant="primary">Done</nc-button>
      <nc-button slot="footer" variant="ghost">Close</nc-button>
    </nc-modal>
  `,
};
