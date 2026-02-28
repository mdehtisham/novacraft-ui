import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './dropdown-menu';
import '../button/button';

const meta: Meta = {
  title: 'Navigation/DropdownMenu',
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the dropdown is currently open',
    },
    placement: {
      control: 'select',
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
      description: 'Preferred placement of the dropdown panel',
    },
  },
  args: {
    open: false,
    placement: 'bottom-start',
  },
  render: (args) => html`
    <nc-dropdown-menu placement=${args.placement} ?open=${args.open}>
      <nc-button slot="trigger">Actions ▾</nc-button>
      <nc-menu-item value="edit">Edit</nc-menu-item>
      <nc-menu-item value="duplicate">Duplicate</nc-menu-item>
      <nc-menu-divider></nc-menu-divider>
      <nc-menu-item value="delete" ?danger=${true}>Delete</nc-menu-item>
    </nc-dropdown-menu>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { placement: 'bottom-start', open: false },
};

export const WithGroups: Story = {
  args: { placement: 'bottom-start', open: false },
  render: (args) => html`
    <nc-dropdown-menu placement=${args.placement} ?open=${args.open}>
      <nc-button slot="trigger">Options ▾</nc-button>
      <nc-menu-group label="File">
        <nc-menu-item value="new">New File</nc-menu-item>
        <nc-menu-item value="open">Open…</nc-menu-item>
        <nc-menu-item value="save">Save</nc-menu-item>
      </nc-menu-group>
      <nc-menu-divider></nc-menu-divider>
      <nc-menu-group label="Edit">
        <nc-menu-item value="cut">Cut</nc-menu-item>
        <nc-menu-item value="copy">Copy</nc-menu-item>
        <nc-menu-item value="paste">Paste</nc-menu-item>
      </nc-menu-group>
    </nc-dropdown-menu>
  `,
};

export const WithPrefixIcons: Story = {
  args: { placement: 'bottom-start', open: false },
  render: (args) => html`
    <nc-dropdown-menu placement=${args.placement} ?open=${args.open}>
      <nc-button slot="trigger">Menu ▾</nc-button>
      <nc-menu-item value="profile">
        <span slot="prefix">👤</span>
        Profile
      </nc-menu-item>
      <nc-menu-item value="settings">
        <span slot="prefix">⚙️</span>
        Settings
      </nc-menu-item>
      <nc-menu-item value="notifications">
        <span slot="prefix">🔔</span>
        Notifications
      </nc-menu-item>
      <nc-menu-divider></nc-menu-divider>
      <nc-menu-item value="logout">
        <span slot="prefix">🚪</span>
        Log Out
      </nc-menu-item>
    </nc-dropdown-menu>
  `,
};

export const WithDisabledItems: Story = {
  args: { placement: 'bottom-start', open: false },
  render: (args) => html`
    <nc-dropdown-menu placement=${args.placement} ?open=${args.open}>
      <nc-button slot="trigger">Actions ▾</nc-button>
      <nc-menu-item value="edit">Edit</nc-menu-item>
      <nc-menu-item value="duplicate" disabled>Duplicate (unavailable)</nc-menu-item>
      <nc-menu-item value="export">Export</nc-menu-item>
      <nc-menu-divider></nc-menu-divider>
      <nc-menu-item value="delete" ?danger=${true} disabled>Delete (locked)</nc-menu-item>
    </nc-dropdown-menu>
  `,
};
