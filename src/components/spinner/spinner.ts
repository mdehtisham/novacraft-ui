import { NcBaseElement } from '../../core/base-element';
import { defineElement } from '../../utils/helpers';

const SIZES: Record<string, string> = {
  xs: '16px',
  sm: '20px',
  md: '24px',
  lg: '32px',
  xl: '48px',
};

const BORDER_WIDTHS: Record<string, string> = {
  xs: '2px',
  sm: '2px',
  md: '3px',
  lg: '3px',
  xl: '4px',
};

export class NcSpinner extends NcBaseElement {
  static observedAttributes = ['size', 'variant', 'label'];

  static styles = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .spinner {
      border-radius: 50%;
      border-style: solid;
      border-color: var(--nc-spinner-color, var(--nc-color-primary-500, #6366f1));
      border-top-color: transparent;
      animation: spin 0.6s linear infinite;
      box-sizing: border-box;
    }
  `;

  protected render(): string {
    const size = this.getStrAttr('size', 'md');
    const variant = this.getStrAttr('variant', 'primary');
    const label = this.getStrAttr('label', 'Loading…');

    const dim = SIZES[size] ?? SIZES.md;
    const bw = BORDER_WIDTHS[size] ?? BORDER_WIDTHS.md;

    let colorVar: string;
    switch (variant) {
      case 'neutral':
        colorVar = 'var(--nc-color-neutral-400, #9ca3af)';
        break;
      case 'white':
        colorVar = '#ffffff';
        break;
      default:
        colorVar = 'var(--nc-color-primary-500, #6366f1)';
    }

    return `
      <div
        class="spinner"
        role="status"
        aria-label="${label}"
        style="
          width: ${dim};
          height: ${dim};
          border-width: ${bw};
          --nc-spinner-color: ${colorVar};
        "
      >
      </div>
    `;
  }
}

defineElement('nc-spinner', NcSpinner);
