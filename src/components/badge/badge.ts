import { NcBaseElement } from '../../core/base-element';
import { defineElement } from '../../utils/helpers';

const VARIANTS = ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;

type Variant = (typeof VARIANTS)[number];
type Size = (typeof SIZES)[number];

export class NcBadge extends NcBaseElement {
  static observedAttributes = ['variant', 'size', 'pill', 'dot', 'removable'];

  static styles = `
    :host {
      display: inline-flex;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: var(--nc-spacing-1);
      font-family: var(--nc-font-family-sans);
      font-weight: var(--nc-font-weight-medium);
      line-height: var(--nc-line-height-tight);
      border-radius: var(--nc-radius-md);
      white-space: nowrap;
      vertical-align: middle;
      transition: background-color var(--nc-transition-fast),
                  color var(--nc-transition-fast);
    }

    /* ─── Sizes ─── */
    .badge--sm {
      font-size: var(--nc-font-size-xs);
      padding: 0.125rem var(--nc-spacing-2);
    }
    .badge--md {
      font-size: var(--nc-font-size-sm);
      padding: 0.1875rem var(--nc-spacing-2);
    }
    .badge--lg {
      font-size: var(--nc-font-size-md);
      padding: var(--nc-spacing-1) var(--nc-spacing-3);
    }

    /* ─── Pill ─── */
    .badge--pill {
      border-radius: var(--nc-radius-full);
    }

    /* ─── Variants ─── */
    .badge--primary {
      background-color: var(--nc-color-primary-100);
      color: var(--nc-color-primary-700);
    }
    .badge--secondary {
      background-color: var(--nc-color-neutral-200);
      color: var(--nc-color-neutral-700);
    }
    .badge--success {
      background-color: var(--nc-color-success-100);
      color: var(--nc-color-success-700);
    }
    .badge--warning {
      background-color: var(--nc-color-warning-100);
      color: var(--nc-color-warning-700);
    }
    .badge--danger {
      background-color: var(--nc-color-danger-100);
      color: var(--nc-color-danger-700);
    }
    .badge--info {
      background-color: var(--nc-color-info-100);
      color: var(--nc-color-info-700);
    }
    .badge--neutral {
      background-color: var(--nc-color-neutral-100);
      color: var(--nc-color-neutral-600);
    }

    /* ─── Dot Indicator ─── */
    .badge__dot {
      width: 0.375rem;
      height: 0.375rem;
      border-radius: var(--nc-radius-full);
      flex-shrink: 0;
    }
    .badge--primary .badge__dot { background-color: var(--nc-color-primary-500); }
    .badge--secondary .badge__dot { background-color: var(--nc-color-neutral-500); }
    .badge--success .badge__dot { background-color: var(--nc-color-success-500); }
    .badge--warning .badge__dot { background-color: var(--nc-color-warning-500); }
    .badge--danger .badge__dot { background-color: var(--nc-color-danger-500); }
    .badge--info .badge__dot { background-color: var(--nc-color-info-500); }
    .badge--neutral .badge__dot { background-color: var(--nc-color-neutral-400); }

    /* ─── Dismiss Button ─── */
    .badge__dismiss {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: none;
      cursor: pointer;
      padding: 0;
      margin-left: var(--nc-spacing-1);
      width: 1rem;
      height: 1rem;
      border-radius: var(--nc-radius-full);
      color: inherit;
      opacity: 0.6;
      transition: opacity var(--nc-transition-fast),
                  background-color var(--nc-transition-fast);
    }
    .badge__dismiss:hover {
      opacity: 1;
      background-color: rgba(0, 0, 0, 0.1);
    }
    .badge__dismiss:focus-visible {
      outline: none;
      box-shadow: var(--nc-focus-ring);
      opacity: 1;
    }
    .badge__dismiss svg {
      width: 0.625rem;
      height: 0.625rem;
      pointer-events: none;
    }
  `;

  private get _variant(): Variant {
    const v = this.getStrAttr('variant', 'primary') as Variant;
    return VARIANTS.includes(v) ? v : 'primary';
  }

  private get _size(): Size {
    const s = this.getStrAttr('size', 'md') as Size;
    return SIZES.includes(s) ? s : 'md';
  }

  protected render(): string {
    const variant = this._variant;
    const size = this._size;
    const pill = this.getBoolAttr('pill');
    const dot = this.getBoolAttr('dot');
    const removable = this.getBoolAttr('removable');

    const classes = [
      'badge',
      `badge--${variant}`,
      `badge--${size}`,
      pill ? 'badge--pill' : '',
    ].filter(Boolean).join(' ');

    const dotHtml = dot ? '<span class="badge__dot" aria-hidden="true"></span>' : '';

    const dismissHtml = removable
      ? `<button class="badge__dismiss" type="button" aria-label="Dismiss">
           <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
             <line x1="2" y1="2" x2="8" y2="8"/><line x1="8" y1="2" x2="2" y2="8"/>
           </svg>
         </button>`
      : '';

    return `
      <span class="${classes}">
        ${dotHtml}
        <slot></slot>
        ${dismissHtml}
      </span>
    `;
  }

  protected afterRender(): void {
    const btn = this.shadow.querySelector('.badge__dismiss');
    if (btn) {
      btn.addEventListener('click', this._onDismiss);
    }
  }

  private _onDismiss = () => {
    this.emit('nc-dismiss');
  };
}

defineElement('nc-badge', NcBadge);
