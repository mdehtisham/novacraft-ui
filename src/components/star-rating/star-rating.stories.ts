import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './star-rating';

const meta: Meta = {
  title: 'Data/StarRating',
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 10, step: 0.5 },
      description: 'Current rating value',
    },
    max: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Maximum number of stars',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the star icons',
    },
    readonly: {
      control: 'boolean',
      description: 'Prevent user interaction',
    },
    half: {
      control: 'boolean',
      description: 'Allow half-star ratings',
    },
    name: {
      control: 'text',
      description: 'Form field name for the rating input',
    },
  },
  args: {
    value: 3,
    max: 5,
    size: 'md',
    readonly: false,
    half: false,
    name: 'rating',
  },
  render: (args) => html`
    <nc-star-rating
      value=${args.value}
      max=${args.max}
      size=${args.size}
      ?readonly=${args.readonly}
      ?half=${args.half}
      name=${args.name}
    ></nc-star-rating>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { value: 3, max: 5, size: 'md', readonly: false, half: false },
};

export const Readonly: Story = {
  args: { value: 4, max: 5, size: 'md', readonly: true },
};

export const HalfStars: Story = {
  args: { value: 3.5, max: 5, size: 'md', readonly: false, half: true },
};

export const Max10: Story = {
  args: { value: 7, max: 10, size: 'md', readonly: false },
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:12px;">
      <nc-star-rating value="3" max="5" size="sm" readonly></nc-star-rating>
      <nc-star-rating value="3" max="5" size="md" readonly></nc-star-rating>
      <nc-star-rating value="3" max="5" size="lg" readonly></nc-star-rating>
    </div>
  `,
};

export const Empty: Story = {
  args: { value: 0, max: 5, size: 'md', readonly: false },
};

export const Full: Story = {
  args: { value: 5, max: 5, size: 'md', readonly: true },
};
