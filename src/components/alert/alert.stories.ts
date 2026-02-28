import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './alert';
import '../button/button';

const meta: Meta = {
  title: 'Feedback/Alert',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'danger'],
    },
    dismissible: { control: 'boolean' },
    title: { control: 'text' },
  },
  args: {
    variant: 'info',
    dismissible: false,
    title: '',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <nc-alert variant=${args['variant']} ?dismissible=${args['dismissible']} title=${args['title']}>
      This is an informational alert message.
    </nc-alert>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;max-width:560px">
      <nc-alert variant="info">
        <strong>Info:</strong> Here is some helpful information for you.
      </nc-alert>
      <nc-alert variant="success">
        <strong>Success:</strong> Your action was completed successfully.
      </nc-alert>
      <nc-alert variant="warning">
        <strong>Warning:</strong> Please review before continuing.
      </nc-alert>
      <nc-alert variant="danger">
        <strong>Danger:</strong> Something went wrong. Please try again.
      </nc-alert>
    </div>
  `,
};

export const WithTitle: Story = {
  args: { variant: 'info', title: 'Heads up!' },
  render: (args) => html`
    <nc-alert variant=${args['variant']} title=${args['title']}>
      This alert includes a descriptive title to provide additional context.
    </nc-alert>
  `,
};

export const Dismissible: Story = {
  args: { variant: 'success', dismissible: true, title: 'Done!' },
  render: (args) => html`
    <nc-alert variant=${args['variant']} ?dismissible=${args['dismissible']} title=${args['title']}>
      This alert can be dismissed by clicking the close button.
    </nc-alert>
  `,
};

export const WithAction: Story = {
  args: { variant: 'warning', title: 'Update Available' },
  render: (args) => html`
    <nc-alert variant=${args['variant']} title=${args['title']}>
      A new version is available. Update now to get the latest features and security fixes.
      <nc-button slot="action" variant="ghost" size="sm">Update Now</nc-button>
    </nc-alert>
  `,
};

export const WithCustomIcon: Story = {
  args: { variant: 'danger', title: 'Access Denied' },
  render: (args) => html`
    <nc-alert variant=${args['variant']} title=${args['title']}>
      <svg slot="icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/>
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
      </svg>
      You do not have permission to perform this action. Contact your administrator.
    </nc-alert>
  `,
};
