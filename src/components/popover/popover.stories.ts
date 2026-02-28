import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './popover';
import '../button/button';

const meta: Meta = {
  title: 'Overlays/Popover',
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right', 'top-start', 'top-end', 'bottom-start', 'bottom-end'],
    },
    trigger: {
      control: 'select',
      options: ['click', 'hover', 'focus'],
    },
    open: { control: 'boolean' },
    offset: { control: 'number' },
  },
  args: {
    placement: 'bottom',
    trigger: 'click',
    open: false,
    offset: 8,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="display:flex;justify-content:center;padding:80px">
      <nc-popover placement=${args['placement']} trigger=${args['trigger']} offset=${args['offset']} ?open=${args['open']}>
        <nc-button>Click me</nc-button>
        <div slot="content" style="padding:12px">
          <strong>Popover title</strong>
          <p>Popover content goes here.</p>
        </div>
      </nc-popover>
    </div>
  `,
};

export const Placements: Story = {
  render: () => html`
    <div style="display:grid;grid-template-columns:repeat(3,auto);gap:16px;justify-content:center;padding:80px">
      ${(
        [
          'top-start', 'top', 'top-end',
          'left', '', 'right',
          'bottom-start', 'bottom', 'bottom-end',
        ] as const
      ).map((placement) =>
        placement
          ? html`
              <nc-popover placement=${placement} trigger="click">
                <nc-button size="sm">${placement}</nc-button>
                <div slot="content" style="padding:10px;min-width:140px">
                  <strong>${placement}</strong>
                  <p style="margin:4px 0 0">Opens to the ${placement} side.</p>
                </div>
              </nc-popover>
            `
          : html`<div></div>`
      )}
    </div>
  `,
};

export const HoverTrigger: Story = {
  args: { trigger: 'hover', placement: 'top' },
  render: (args) => html`
    <div style="display:flex;justify-content:center;padding:80px">
      <nc-popover placement=${args['placement']} trigger="hover" offset=${args['offset']}>
        <nc-button>Hover over me</nc-button>
        <div slot="content" style="padding:12px">
          <strong>Hover Popover</strong>
          <p>This popover opens on mouse hover.</p>
        </div>
      </nc-popover>
    </div>
  `,
};

export const FocusTrigger: Story = {
  args: { trigger: 'focus', placement: 'bottom' },
  render: (args) => html`
    <div style="display:flex;justify-content:center;padding:80px">
      <nc-popover placement=${args['placement']} trigger="focus" offset=${args['offset']}>
        <nc-button>Focus me (Tab key)</nc-button>
        <div slot="content" style="padding:12px">
          <strong>Focus Popover</strong>
          <p>This popover opens when the trigger receives focus.</p>
        </div>
      </nc-popover>
    </div>
  `,
};
