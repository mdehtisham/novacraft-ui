import type { Preview } from '@storybook/web-components';
import '../src/theme/tokens.css';

const preview: Preview = {
  parameters: {
    docs: {
      story: {
        inline: false,
        height: '250px',
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0a0a0a' },
      ],
    },
  },
};

export default preview;
