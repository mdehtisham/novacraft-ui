import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './toast';
import '../button/button';

const meta: Meta = {
  title: 'Overlays/Toast',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'danger'],
    },
    duration: { control: 'number' },
    message: { control: 'text' },
    dismissible: { control: 'boolean' },
  },
  args: {
    variant: 'info',
    duration: 5000,
    message: 'This is a toast notification.',
    dismissible: false,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <nc-toast
      variant=${args['variant']}
      duration=${args['duration']}
      message=${args['message']}
      ?dismissible=${args['dismissible']}
    >${args['message']}</nc-toast>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:420px">
      <nc-toast variant="info" message="Info: Your session will expire in 5 minutes.">
        Info: Your session will expire in 5 minutes.
      </nc-toast>
      <nc-toast variant="success" message="Success: Your changes have been saved.">
        Success: Your changes have been saved.
      </nc-toast>
      <nc-toast variant="warning" message="Warning: Disk space is running low.">
        Warning: Disk space is running low.
      </nc-toast>
      <nc-toast variant="danger" message="Danger: An error occurred. Please try again.">
        Danger: An error occurred. Please try again.
      </nc-toast>
    </div>
  `,
};

export const Dismissible: Story = {
  args: {
    variant: 'success',
    message: 'You can dismiss this toast.',
    dismissible: true,
  },
  render: (args) => html`
    <nc-toast
      variant=${args['variant']}
      message=${args['message']}
      ?dismissible=${args['dismissible']}
    >${args['message']}</nc-toast>
  `,
};

export const WithAction: Story = {
  args: {
    variant: 'warning',
    message: 'Your file failed to upload.',
    dismissible: true,
  },
  render: (args) => html`
    <nc-toast
      variant=${args['variant']}
      message=${args['message']}
      ?dismissible=${args['dismissible']}
    >
      ${args['message']}
      <nc-button slot="action" variant="ghost" size="sm">Retry</nc-button>
    </nc-toast>
  `,
};

export const InContainer: Story = {
  render: () => html`
    <nc-toast-container position="top-right" max="5">
      <nc-toast variant="info" dismissible>
        Notification 1: Welcome back!
      </nc-toast>
      <nc-toast variant="success" dismissible>
        Notification 2: Profile updated successfully.
      </nc-toast>
      <nc-toast variant="warning" dismissible>
        Notification 3: New update available.
      </nc-toast>
    </nc-toast-container>
  `,
  argTypes: {
    position: {
      control: 'select',
      options: ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'],
    },
    max: { control: 'number' },
  },
  args: {
    position: 'top-right',
    max: 5,
  },
};
