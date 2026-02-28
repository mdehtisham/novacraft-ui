import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './progress-bar';

const meta: Meta = {
  title: 'Data/ProgressBar',
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Progress value (0–100). Omit or set to null for indeterminate.',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger'],
      description: 'Color variant of the progress bar',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'Height size of the progress bar',
    },
    'show-label': {
      control: 'boolean',
      description: 'Show percentage label inside/above the bar',
    },
  },
  args: {
    value: 50,
    variant: 'primary',
    size: 'md',
    'show-label': false,
  },
  render: (args) => html`
    <nc-progress-bar
      value=${args.value}
      variant=${args.variant}
      size=${args.size}
      ?show-label=${args['show-label']}
    ></nc-progress-bar>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { value: 50, variant: 'primary', size: 'md', 'show-label': false },
};

export const Indeterminate: Story = {
  render: () => html`
    <nc-progress-bar variant="primary" size="md"></nc-progress-bar>
  `,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <nc-progress-bar value="60" variant="primary" size="md"></nc-progress-bar>
      <nc-progress-bar value="60" variant="secondary" size="md"></nc-progress-bar>
      <nc-progress-bar value="60" variant="success" size="md"></nc-progress-bar>
      <nc-progress-bar value="60" variant="warning" size="md"></nc-progress-bar>
      <nc-progress-bar value="60" variant="danger" size="md"></nc-progress-bar>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <nc-progress-bar value="70" variant="primary" size="xs"></nc-progress-bar>
      <nc-progress-bar value="70" variant="primary" size="sm"></nc-progress-bar>
      <nc-progress-bar value="70" variant="primary" size="md"></nc-progress-bar>
      <nc-progress-bar value="70" variant="primary" size="lg"></nc-progress-bar>
    </div>
  `,
};

export const WithLabel: Story = {
  args: { value: 65, variant: 'success', size: 'lg', 'show-label': true },
};

export const FullProgress: Story = {
  args: { value: 100, variant: 'success', size: 'md', 'show-label': true },
};

export const ZeroProgress: Story = {
  args: { value: 0, variant: 'danger', size: 'md', 'show-label': true },
};
