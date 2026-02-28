import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './accordion';

const meta: Meta = {
  title: 'Navigation/Accordion',
  tags: ['autodocs'],
  argTypes: {
    multiple: {
      control: 'boolean',
      description: 'Allow multiple items to be open simultaneously',
    },
  },
  args: {
    multiple: false,
  },
  render: (args) => html`
    <nc-accordion ?multiple=${args.multiple}>
      <nc-accordion-item header="What is NovaCraft UI?">
        <p>NovaCraft UI is a modern web component library built with Lit, offering a comprehensive set of accessible and customizable UI components.</p>
      </nc-accordion-item>
      <nc-accordion-item header="How do I install it?">
        <p>Install via npm: <code>npm install novacraft-ui</code>. Then import the components you need in your project.</p>
      </nc-accordion-item>
      <nc-accordion-item header="Is it accessible?">
        <p>Yes, all components follow WAI-ARIA guidelines and are tested with screen readers for full accessibility compliance.</p>
      </nc-accordion-item>
    </nc-accordion>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: { multiple: false },
};

export const Multiple: Story = {
  args: { multiple: true },
};

export const WithOpenItem: Story = {
  args: { multiple: false },
  render: (args) => html`
    <nc-accordion ?multiple=${args.multiple}>
      <nc-accordion-item header="What is NovaCraft UI?" open>
        <p>NovaCraft UI is a modern web component library built with Lit, offering a comprehensive set of accessible and customizable UI components.</p>
      </nc-accordion-item>
      <nc-accordion-item header="How do I install it?">
        <p>Install via npm: <code>npm install novacraft-ui</code>. Then import the components you need in your project.</p>
      </nc-accordion-item>
      <nc-accordion-item header="Is it accessible?">
        <p>Yes, all components follow WAI-ARIA guidelines and are tested with screen readers for full accessibility compliance.</p>
      </nc-accordion-item>
    </nc-accordion>
  `,
};

export const WithDisabledItem: Story = {
  args: { multiple: false },
  render: (args) => html`
    <nc-accordion ?multiple=${args.multiple}>
      <nc-accordion-item header="What is NovaCraft UI?">
        <p>NovaCraft UI is a modern web component library built with Lit, offering a comprehensive set of accessible and customizable UI components.</p>
      </nc-accordion-item>
      <nc-accordion-item header="How do I install it?" disabled>
        <p>Install via npm: <code>npm install novacraft-ui</code>. Then import the components you need in your project.</p>
      </nc-accordion-item>
      <nc-accordion-item header="Is it accessible?">
        <p>Yes, all components follow WAI-ARIA guidelines and are tested with screen readers for full accessibility compliance.</p>
      </nc-accordion-item>
    </nc-accordion>
  `,
};
