import { NcBaseElement } from '../../core/base-element';
import { defineElement } from '../../utils/helpers';

export class NcSkeleton extends NcBaseElement {
  static observedAttributes = ['variant', 'width', 'height', 'animation'];

  static styles = `
    :host {
      display: inline-block;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    @keyframes wave {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    .skeleton {
      background-color: var(--nc-color-neutral-200, #e5e7eb);
      display: block;
    }

    .skeleton--pulse {
      animation: pulse 1.5s ease-in-out infinite;
    }

    .skeleton--wave {
      background: linear-gradient(
        90deg,
        var(--nc-color-neutral-200, #e5e7eb) 25%,
        var(--nc-color-neutral-100, #f3f4f6) 50%,
        var(--nc-color-neutral-200, #e5e7eb) 75%
      );
      background-size: 200% 100%;
      animation: wave 1.5s linear infinite;
    }

    .skeleton--text {
      width: 100%;
      height: 1em;
      border-radius: 4px;
    }

    .skeleton--circular {
      border-radius: 50%;
    }

    .skeleton--rectangular {
      border-radius: 4px;
    }
  `;

  protected render(): string {
    const variant = this.getStrAttr('variant', 'text');
    const animation = this.getStrAttr('animation', 'pulse');
    const width = this.getStrAttr('width');
    const height = this.getStrAttr('height');

    const inlineStyles: string[] = [];
    if (width) inlineStyles.push(`width:${width}`);
    if (height) inlineStyles.push(`height:${height}`);

    const styleAttr = inlineStyles.length
      ? ` style="${inlineStyles.join(';')}"`
      : '';

    return `<div
      class="skeleton skeleton--${variant} skeleton--${animation}"
      aria-hidden="true"${styleAttr}></div>`;
  }
}

defineElement('nc-skeleton', NcSkeleton);
