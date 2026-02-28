import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './breadcrumb';

const meta: Meta = {
  title: 'Navigation/Breadcrumb',
  tags: ['autodocs'],
  argTypes: {
    separator: {
      control: 'text',
      description: 'Character or string used as the separator between items',
    },
  },
  args: {
    separator: '/',
  },
  render: (args) => html`
    <nc-breadcrumb separator=${args.separator}>
      <nc-breadcrumb-item href="/">Home</nc-breadcrumb-item>
      <nc-breadcrumb-item href="/products">Products</nc-breadcrumb-item>
      <nc-breadcrumb-item current>Current Page</nc-breadcrumb-item>
    </nc-breadcrumb>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { separator: '/' },
};

export const CustomSeparator: Story = {
  args: { separator: '›' },
};

export const WithIcons: Story = {
  args: { separator: '/' },
  render: (args) => html`
    <nc-breadcrumb separator=${args.separator}>
      <nc-breadcrumb-item href="/">🏠 Home</nc-breadcrumb-item>
      <nc-breadcrumb-item href="/products">📦 Products</nc-breadcrumb-item>
      <nc-breadcrumb-item current>📄 Current Page</nc-breadcrumb-item>
    </nc-breadcrumb>
  `,
};

export const LongPath: Story = {
  args: { separator: '/' },
  render: (args) => html`
    <nc-breadcrumb separator=${args.separator}>
      <nc-breadcrumb-item href="/">Home</nc-breadcrumb-item>
      <nc-breadcrumb-item href="/catalog">Catalog</nc-breadcrumb-item>
      <nc-breadcrumb-item href="/catalog/electronics">Electronics</nc-breadcrumb-item>
      <nc-breadcrumb-item href="/catalog/electronics/computers">Computers</nc-breadcrumb-item>
      <nc-breadcrumb-item href="/catalog/electronics/computers/laptops">Laptops</nc-breadcrumb-item>
      <nc-breadcrumb-item current>UltraBook Pro 15</nc-breadcrumb-item>
    </nc-breadcrumb>
  `,
};
