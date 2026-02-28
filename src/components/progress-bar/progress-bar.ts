import { NcBaseElement } from '../../core/base-element';
import { defineElement } from '../../utils/helpers';

const VARIANTS = ['primary', 'success', 'warning', 'danger'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;

type Variant = (typeof VARIANTS)[number];
type Size = (typeof SIZES)[number];

export class NcProgressBar extends NcBaseElement {
  static observedAttributes = ['value', 'variant', 'size', 'show-label'];

  static styles = `
    @keyframes indeterminate {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(300%);
      }
    }

    :host {
      display: block;
      width: 100%;
    }

    .progress {
      display: flex;
      align-items: center;
      gap: var(--nc-spacing-2, 0.5rem);
    }

    .progress__track {
      flex: 1;
      background-color: var(--nc-color-neutral-200, #e5e7eb);
      border-radius: var(--nc-radius-full, 9999px);
      overflow: hidden;
      position: relative;
    }

    /* ─── Sizes ─── */
    .progress__track--sm { height: 4px; }
    .progress__track--md { height: 8px; }
    .progress__track--lg { height: 12px; }

    /* ─── Fill (determinate) ─── */
    .progress__fill {
      height: 100%;
      border-radius: var(--nc-radius-full, 9999px);
      transition: width var(--nc-transition-normal, 0.3s) ease;
    }

    /* ─── Fill (indeterminate) ─── */
    .progress__fill--indeterminate {
      width: 33%;
      position: absolute;
      top: 0;
      left: 0;
      animation: indeterminate 1.4s ease-in-out infinite;
    }

    /* ─── Variant Colors ─── */
    .progress__fill--primary {
      background-color: var(--nc-color-primary-500, #6366f1);
    }
    .progress__fill--success {
      background-color: var(--nc-color-success-500, #22c55e);
    }
    .progress__fill--warning {
      background-color: var(--nc-color-warning-500, #f59e0b);
    }
    .progress__fill--danger {
      background-color: var(--nc-color-danger-500, #ef4444);
    }

    /* ─── Label ─── */
    .progress__label {
      font-family: var(--nc-font-family-sans, sans-serif);
      font-size: var(--nc-font-size-sm, 0.875rem);
      font-weight: var(--nc-font-weight-medium, 500);
      color: var(--nc-color-neutral-700, #374151);
      white-space: nowrap;
      min-width: 2.5em;
      text-align: right;
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

  private get _value(): number | null {
    const raw = this.getAttribute('value');
    if (raw === null || raw === '') return null;
    const num = Number(raw);
    if (Number.isNaN(num)) return null;
    return Math.min(Math.max(num, 0), 100);
  }

  private get _showLabel(): boolean {
    return this.getBoolAttr('show-label');
  }

  protected render(): string {
    const variant = this._variant;
    const size = this._size;
    const value = this._value;
    const indeterminate = value === null;
    const percent = indeterminate ? 0 : value;

    const trackClasses = `progress__track progress__track--${size}`;

    const fillClasses = [
      'progress__fill',
      `progress__fill--${variant}`,
      indeterminate ? 'progress__fill--indeterminate' : '',
    ].filter(Boolean).join(' ');

    const fillStyle = indeterminate ? '' : `width: ${percent}%`;

    const ariaValueNow = indeterminate ? '' : `aria-valuenow="${percent}"`;

    const labelHtml = !indeterminate && this._showLabel
      ? `<span class="progress__label" aria-hidden="true">${Math.round(percent)}%</span>`
      : '';

    return `
      <div class="progress">
        <div
          class="${trackClasses}"
          role="progressbar"
          ${ariaValueNow}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div class="${fillClasses}" style="${fillStyle}"></div>
        </div>
        ${labelHtml}
      </div>
    `;
  }
}

defineElement('nc-progress-bar', NcProgressBar);
