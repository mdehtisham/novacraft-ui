import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './icon';

type Args = {
  name: string;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color: string;
  label: string;
};

const meta: Meta<Args> = {
  title: 'Primitives/Icon',
  tags: ['autodocs'],
  render: (args) => html`
    <nc-icon
      name=${args.name}
      size=${args.size}
      color=${args.color}
      label=${args.label}
    ></nc-icon>
  `,
  argTypes: {
    name: {
      control: { type: 'text' },
      description: 'Icon name from the icon library',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Icon size',
    },
    color: {
      control: { type: 'text' },
      description: 'CSS color value or token',
    },
    label: {
      control: { type: 'text' },
      description: 'Accessible label (aria-label)',
    },
  },
  args: {
    name: 'star',
    size: 'md',
    color: '',
    label: '',
  },
};
export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;">
      <nc-icon name="star" size="xs"></nc-icon>
      <nc-icon name="star" size="sm"></nc-icon>
      <nc-icon name="star" size="md"></nc-icon>
      <nc-icon name="star" size="lg"></nc-icon>
      <nc-icon name="star" size="xl"></nc-icon>
    </div>
  `,
};

export const Colors: Story = {
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;">
      <nc-icon name="star" size="lg" color="var(--nc-color-primary, #6366f1)" label="primary star"></nc-icon>
      <nc-icon name="heart" size="lg" color="var(--nc-color-danger, #ef4444)" label="danger heart"></nc-icon>
      <nc-icon name="check" size="lg" color="var(--nc-color-success, #22c55e)" label="success check"></nc-icon>
    </div>
  `,
};

export const Gallery: Story = {
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center;">
      ${(['star', 'heart', 'home', 'search', 'settings', 'user', 'check', 'x'] as const).map(
        (name) => html`
          <div style="display:flex;flex-direction:column;align-items:center;gap:0.25rem;">
            <nc-icon name=${name} size="lg"></nc-icon>
            <span style="font-size:0.75rem;">${name}</span>
          </div>
        `
      )}
    </div>
  `,
};
