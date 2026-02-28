import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './table';

const COLUMNS = JSON.stringify([
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' },
]);

const DATA = JSON.stringify([
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', status: 'Active' },
  { id: 2, name: 'Bob Martinez', email: 'bob@example.com', status: 'Inactive' },
  { id: 3, name: 'Carol Williams', email: 'carol@example.com', status: 'Active' },
  { id: 4, name: 'David Kim', email: 'david@example.com', status: 'Pending' },
  { id: 5, name: 'Eva Chen', email: 'eva@example.com', status: 'Active' },
]);

const meta: Meta = {
  title: 'Data/Table',
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: 'text',
      description: 'JSON string defining column keys and labels',
    },
    data: {
      control: 'text',
      description: 'JSON string array of row objects',
    },
    striped: {
      control: 'boolean',
      description: 'Apply alternating row background colors',
    },
    hoverable: {
      control: 'boolean',
      description: 'Highlight rows on mouse hover',
    },
    compact: {
      control: 'boolean',
      description: 'Reduce row padding for a denser layout',
    },
    sortable: {
      control: 'boolean',
      description: 'Enable column header click-to-sort',
    },
  },
  args: {
    columns: COLUMNS,
    data: DATA,
    striped: false,
    hoverable: false,
    compact: false,
    sortable: false,
  },
  render: (args) => html`
    <nc-table
      columns=${args.columns}
      data=${args.data}
      ?striped=${args.striped}
      ?hoverable=${args.hoverable}
      ?compact=${args.compact}
      ?sortable=${args.sortable}
    ></nc-table>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { striped: false, hoverable: false, compact: false, sortable: false },
};

export const Striped: Story = {
  args: { striped: true, hoverable: false, compact: false, sortable: false },
};

export const Hoverable: Story = {
  args: { striped: false, hoverable: true, compact: false, sortable: false },
};

export const Compact: Story = {
  args: { striped: false, hoverable: false, compact: true, sortable: false },
};

export const Sortable: Story = {
  args: { striped: false, hoverable: false, compact: false, sortable: true },
};

export const FullFeatured: Story = {
  args: { striped: true, hoverable: true, compact: false, sortable: true },
};
