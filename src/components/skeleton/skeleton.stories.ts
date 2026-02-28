import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './skeleton';

type Args = {
  variant: 'text' | 'circle' | 'rect' | 'rounded';
  width: string;
  height: string;
  animation: 'pulse' | 'wave' | 'none';
};

const meta: Meta<Args> = {
  title: 'Primitives/Skeleton',
  tags: ['autodocs'],
  render: (args) => html`
    <nc-skeleton
      variant=${args.variant}
      width=${args.width}
      height=${args.height}
      animation=${args.animation}
    ></nc-skeleton>
  `,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['text', 'circle', 'rect', 'rounded'],
      description: 'Shape variant',
    },
    width: {
      control: { type: 'text' },
      description: 'CSS width value (e.g. 100%, 200px)',
    },
    height: {
      control: { type: 'text' },
      description: 'CSS height value (e.g. 1rem, 48px)',
    },
    animation: {
      control: { type: 'select' },
      options: ['pulse', 'wave', 'none'],
      description: 'Loading animation style',
    },
  },
  args: {
    variant: 'text',
    width: '100%',
    height: '1rem',
    animation: 'pulse',
  },
};
export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:1rem;max-width:320px;">
      <div style="display:flex;align-items:center;gap:0.5rem;">
        <nc-skeleton variant="circle" width="48px" height="48px"></nc-skeleton>
        <nc-skeleton variant="text" width="160px" height="1rem"></nc-skeleton>
      </div>
      <nc-skeleton variant="rect" width="100%" height="120px"></nc-skeleton>
      <nc-skeleton variant="rounded" width="100%" height="56px"></nc-skeleton>
      <nc-skeleton variant="text" width="80%" height="1rem"></nc-skeleton>
    </div>
  `,
};

export const Animations: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:1.5rem;max-width:320px;">
      <div>
        <p style="font-size:0.75rem;margin:0 0 0.5rem;">Pulse</p>
        <nc-skeleton variant="rect" width="100%" height="60px" animation="pulse"></nc-skeleton>
      </div>
      <div>
        <p style="font-size:0.75rem;margin:0 0 0.5rem;">Wave</p>
        <nc-skeleton variant="rect" width="100%" height="60px" animation="wave"></nc-skeleton>
      </div>
      <div>
        <p style="font-size:0.75rem;margin:0 0 0.5rem;">None</p>
        <nc-skeleton variant="rect" width="100%" height="60px" animation="none"></nc-skeleton>
      </div>
    </div>
  `,
};

export const TextBlock: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:0.5rem;max-width:400px;">
      <nc-skeleton variant="text" width="100%" height="1rem"></nc-skeleton>
      <nc-skeleton variant="text" width="92%" height="1rem"></nc-skeleton>
      <nc-skeleton variant="text" width="75%" height="1rem"></nc-skeleton>
    </div>
  `,
};

export const CardSkeleton: Story = {
  render: () => html`
    <div style="max-width:320px;padding:1rem;border:1px solid #e2e8f0;border-radius:0.75rem;display:flex;flex-direction:column;gap:0.75rem;">
      <nc-skeleton variant="rect" width="100%" height="160px" animation="wave"></nc-skeleton>
      <nc-skeleton variant="text" width="70%" height="1.1rem" animation="wave"></nc-skeleton>
      <nc-skeleton variant="text" width="90%" height="0.875rem" animation="wave"></nc-skeleton>
    </div>
  `,
};
