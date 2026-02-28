import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './avatar';

type Args = {
  src: string;
  alt: string;
  initials: string;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape: 'circle' | 'square' | 'rounded';
  status: 'online' | 'offline' | 'away' | 'busy' | '';
};

const meta: Meta<Args> = {
  title: 'Primitives/Avatar',
  tags: ['autodocs'],
  render: (args) => html`
    <nc-avatar
      src=${args.src}
      alt=${args.alt}
      initials=${args.initials}
      size=${args.size}
      shape=${args.shape}
      status=${args.status}
    ></nc-avatar>
  `,
  argTypes: {
    src: {
      control: { type: 'text' },
      description: 'URL of the avatar image',
    },
    alt: {
      control: { type: 'text' },
      description: 'Alt text for the image',
    },
    initials: {
      control: { type: 'text' },
      description: 'Fallback initials when no image is provided (1–2 chars)',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Avatar size',
    },
    shape: {
      control: { type: 'select' },
      options: ['circle', 'square', 'rounded'],
      description: 'Border radius style',
    },
    status: {
      control: { type: 'select' },
      options: ['', 'online', 'offline', 'away', 'busy'],
      description: 'Presence status indicator',
    },
  },
  args: {
    src: '',
    alt: 'User avatar',
    initials: 'MF',
    size: 'md',
    shape: 'circle',
    status: '',
  },
};
export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=12',
    alt: 'Jane Doe',
    initials: '',
  },
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:1rem;align-items:center;">
      <nc-avatar initials="XS" size="xs"></nc-avatar>
      <nc-avatar initials="SM" size="sm"></nc-avatar>
      <nc-avatar initials="MD" size="md"></nc-avatar>
      <nc-avatar initials="LG" size="lg"></nc-avatar>
      <nc-avatar initials="XL" size="xl"></nc-avatar>
      <nc-avatar initials="2X" size="2xl"></nc-avatar>
    </div>
  `,
};

export const Shapes: Story = {
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center;">
      <div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;">
        <nc-avatar initials="CI" size="lg" shape="circle"></nc-avatar>
        <span style="font-size:0.75rem;">Circle</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;">
        <nc-avatar initials="SQ" size="lg" shape="square"></nc-avatar>
        <span style="font-size:0.75rem;">Square</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;">
        <nc-avatar initials="RD" size="lg" shape="rounded"></nc-avatar>
        <span style="font-size:0.75rem;">Rounded</span>
      </div>
    </div>
  `,
};

export const WithStatus: Story = {
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center;">
      <div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;">
        <nc-avatar initials="ON" size="lg" status="online"></nc-avatar>
        <span style="font-size:0.75rem;">Online</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;">
        <nc-avatar initials="OF" size="lg" status="offline"></nc-avatar>
        <span style="font-size:0.75rem;">Offline</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;">
        <nc-avatar initials="AW" size="lg" status="away"></nc-avatar>
        <span style="font-size:0.75rem;">Away</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;">
        <nc-avatar initials="BS" size="lg" status="busy"></nc-avatar>
        <span style="font-size:0.75rem;">Busy</span>
      </div>
    </div>
  `,
};

export const Fallback: Story = {
  args: {
    src: '',
    initials: '',
    alt: 'Unknown user',
  },
  parameters: {
    docs: {
      description: {
        story: 'When neither `src` nor `initials` are provided the component renders a generic user icon as a fallback.',
      },
    },
  },
};
