import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './tooltip';

type Args = {
  text: string;
  placement: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
  delay: number;
};

const meta: Meta<Args> = {
  title: 'Primitives/Tooltip',
  tags: ['autodocs'],
  render: (args) => html`
    <div style="display:flex;justify-content:center;padding:4rem;">
      <nc-tooltip
        text=${args.text}
        placement=${args.placement}
        delay=${args.delay}
      >
        <nc-button variant="secondary">Hover me</nc-button>
      </nc-tooltip>
    </div>
  `,
  argTypes: {
    text: {
      control: { type: 'text' },
      description: 'Tooltip content string',
    },
    placement: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'left', 'right', 'top-start', 'top-end', 'bottom-start', 'bottom-end'],
      description: 'Preferred position relative to the trigger',
    },
    delay: {
      control: { type: 'number' },
      description: 'Delay in milliseconds before the tooltip appears',
    },
  },
  args: {
    text: 'This is a tooltip',
    placement: 'top',
    delay: 0,
  },
};
export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {};

export const Placements: Story = {
  render: () => html`
    <div style="display:grid;grid-template-columns:repeat(3,auto);gap:1.5rem;justify-content:center;padding:5rem 2rem;">
      <div></div>
      <nc-tooltip text="Top" placement="top">
        <nc-button variant="outline" size="sm">Top</nc-button>
      </nc-tooltip>
      <div></div>

      <nc-tooltip text="Top-start" placement="top-start">
        <nc-button variant="outline" size="sm">Top-start</nc-button>
      </nc-tooltip>
      <div></div>
      <nc-tooltip text="Top-end" placement="top-end">
        <nc-button variant="outline" size="sm">Top-end</nc-button>
      </nc-tooltip>

      <nc-tooltip text="Left" placement="left">
        <nc-button variant="outline" size="sm">Left</nc-button>
      </nc-tooltip>
      <div></div>
      <nc-tooltip text="Right" placement="right">
        <nc-button variant="outline" size="sm">Right</nc-button>
      </nc-tooltip>

      <nc-tooltip text="Bottom-start" placement="bottom-start">
        <nc-button variant="outline" size="sm">Bottom-start</nc-button>
      </nc-tooltip>
      <div></div>
      <nc-tooltip text="Bottom-end" placement="bottom-end">
        <nc-button variant="outline" size="sm">Bottom-end</nc-button>
      </nc-tooltip>

      <div></div>
      <nc-tooltip text="Bottom" placement="bottom">
        <nc-button variant="outline" size="sm">Bottom</nc-button>
      </nc-tooltip>
      <div></div>
    </div>
  `,
};

export const Delayed: Story = {
  args: { delay: 600 },
  render: (args) => html`
    <div style="display:flex;justify-content:center;padding:4rem;">
      <nc-tooltip
        text="Appears after ${args.delay}ms"
        placement="top"
        delay=${args.delay}
      >
        <nc-button variant="secondary">Hover (${args.delay}ms delay)</nc-button>
      </nc-tooltip>
    </div>
  `,
};
