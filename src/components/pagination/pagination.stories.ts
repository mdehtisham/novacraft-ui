import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './pagination';

const meta: Meta = {
  title: 'Navigation/Pagination',
  tags: ['autodocs'],
  argTypes: {
    'total-pages': {
      control: { type: 'number', min: 1 },
      description: 'Total number of pages',
    },
    'current-page': {
      control: { type: 'number', min: 1 },
      description: 'Currently active page (1-based)',
    },
    siblings: {
      control: { type: 'number', min: 0, max: 5 },
      description: 'Number of sibling pages shown on each side of the current page',
    },
  },
  args: {
    'total-pages': 10,
    'current-page': 1,
    siblings: 1,
  },
  render: (args) => html`
    <nc-pagination
      total-pages=${args['total-pages']}
      current-page=${args['current-page']}
      siblings=${args.siblings}
    ></nc-pagination>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    'total-pages': 10,
    'current-page': 1,
    siblings: 1,
  },
};

export const ManyPages: Story = {
  args: {
    'total-pages': 100,
    'current-page': 50,
    siblings: 1,
  },
};

export const MoreSiblings: Story = {
  args: {
    'total-pages': 20,
    'current-page': 10,
    siblings: 2,
  },
};

export const FirstPage: Story = {
  args: {
    'total-pages': 10,
    'current-page': 1,
    siblings: 1,
  },
};

export const LastPage: Story = {
  args: {
    'total-pages': 10,
    'current-page': 10,
    siblings: 1,
  },
};
