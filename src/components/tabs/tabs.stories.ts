import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './tabs';

const meta: Meta = {
  title: 'Navigation/Tabs',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['line', 'pills', 'boxed'],
      description: 'Visual style of the tabs',
    },
    value: {
      control: 'text',
      description: 'Currently active tab value',
    },
  },
  args: {
    variant: 'line',
    value: 'tab1',
  },
  render: (args) => html`
    <nc-tabs variant=${args.variant}>
      <nc-tab slot="tab" value="tab1" label="Overview"></nc-tab>
      <nc-tab slot="tab" value="tab2" label="Details"></nc-tab>
      <nc-tab slot="tab" value="tab3" label="Settings" ?disabled=${false}></nc-tab>
      <nc-tab-panel value="tab1"><p>Overview content</p></nc-tab-panel>
      <nc-tab-panel value="tab2"><p>Details content</p></nc-tab-panel>
      <nc-tab-panel value="tab3"><p>Settings content</p></nc-tab-panel>
    </nc-tabs>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { variant: 'line' },
};

export const Pills: Story = {
  args: { variant: 'pills' },
};

export const Boxed: Story = {
  args: { variant: 'boxed' },
};

export const WithDisabledTab: Story = {
  args: { variant: 'line' },
  render: (args) => html`
    <nc-tabs variant=${args.variant}>
      <nc-tab slot="tab" value="tab1" label="Overview"></nc-tab>
      <nc-tab slot="tab" value="tab2" label="Details"></nc-tab>
      <nc-tab slot="tab" value="tab3" label="Settings" ?disabled=${true}></nc-tab>
      <nc-tab-panel value="tab1"><p>Overview content</p></nc-tab-panel>
      <nc-tab-panel value="tab2"><p>Details content</p></nc-tab-panel>
      <nc-tab-panel value="tab3"><p>Settings content</p></nc-tab-panel>
    </nc-tabs>
  `,
};
