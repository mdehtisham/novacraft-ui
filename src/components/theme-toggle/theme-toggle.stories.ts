import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './theme-toggle';

type Args = {
  mode: 'light' | 'dark' | 'system';
  persist: boolean;
};

const meta: Meta<Args> = {
  title: 'Primitives/ThemeToggle',
  tags: ['autodocs'],
  render: (args) => html`
    <nc-theme-toggle
      mode=${args.mode}
      ?persist=${args.persist}
    ></nc-theme-toggle>
  `,
  argTypes: {
    mode: {
      control: { type: 'select' },
      options: ['light', 'dark', 'system'],
      description:
        'Current theme mode. When toggled, the component emits an `nc-theme-change` event with the new mode. ' +
        'In `system` mode the active theme follows the OS `prefers-color-scheme` media query.',
    },
    persist: {
      control: 'boolean',
      description: 'Persist the selected mode in `localStorage` so it survives page reloads',
    },
  },
  args: {
    mode: 'system',
    persist: false,
  },
};
export default meta;
type Story = StoryObj<Args>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The theme toggle button cycles through light → dark → system modes. ' +
          'It emits an `nc-theme-change` custom event on each change. ' +
          'Enable `persist` to save the preference to `localStorage`.',
      },
    },
  },
};

export const AllModes: Story = {
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:1.5rem;align-items:center;">
      <div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;">
        <nc-theme-toggle mode="light"></nc-theme-toggle>
        <span style="font-size:0.75rem;">Light</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;">
        <nc-theme-toggle mode="dark"></nc-theme-toggle>
        <span style="font-size:0.75rem;">Dark</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:0.5rem;">
        <nc-theme-toggle mode="system"></nc-theme-toggle>
        <span style="font-size:0.75rem;">System</span>
      </div>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All three modes side-by-side. The active icon reflects the current mode.',
      },
    },
  },
};

export const WithPersist: Story = {
  args: { persist: true },
  parameters: {
    docs: {
      description: {
        story:
          'With `persist` enabled the chosen mode is written to `localStorage` under the key `nc-theme`. ' +
          'On subsequent page loads the component reads this value and restores the preference.',
      },
    },
  },
};
