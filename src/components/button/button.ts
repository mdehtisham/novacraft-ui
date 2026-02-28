import { NcBaseElement } from '../../core/base-element';
import { defineElement } from '../../utils/helpers';

export class NcButton extends NcBaseElement {
  static observedAttributes = ['variant', 'size', 'disabled', 'loading', 'full-width', 'icon-only'];

  static styles = `
    :host {
      display: inline-block;
    }

    :host([full-width]) {
      display: block;
      width: 100%;
    }

    /* ─── Base Button ─── */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--nc-spacing-2);
      border: 1px solid transparent;
      border-radius: var(--nc-radius-md);
      font-family: var(--nc-font-family-sans);
      font-weight: var(--nc-font-weight-semibold);
      line-height: var(--nc-line-height-tight);
      cursor: pointer;
      text-decoration: none;
      white-space: nowrap;
      user-select: none;
      transition:
        background-color var(--nc-transition-fast),
        color var(--nc-transition-fast),
        border-color var(--nc-transition-fast),
        box-shadow var(--nc-transition-fast),
        opacity var(--nc-transition-fast);
      position: relative;
      box-sizing: border-box;
      width: 100%;
    }

    .btn:focus-visible {
      outline: none;
      box-shadow: var(--nc-focus-ring-offset);
    }

    /* ─── Sizes ─── */
    .btn--xs {
      font-size: var(--nc-font-size-xs);
      padding: var(--nc-spacing-1) var(--nc-spacing-2);
      min-height: 1.75rem;
    }
    .btn--sm {
      font-size: var(--nc-font-size-sm);
      padding: var(--nc-spacing-1) var(--nc-spacing-3);
      min-height: 2rem;
    }
    .btn--md {
      font-size: var(--nc-font-size-sm);
      padding: var(--nc-spacing-2) var(--nc-spacing-4);
      min-height: 2.5rem;
    }
    .btn--lg {
      font-size: var(--nc-font-size-md);
      padding: var(--nc-spacing-2) var(--nc-spacing-5);
      min-height: 2.75rem;
    }
    .btn--xl {
      font-size: var(--nc-font-size-lg);
      padding: var(--nc-spacing-3) var(--nc-spacing-6);
      min-height: 3.25rem;
    }

    /* ─── Icon-Only ─── */
    .btn--icon-only.btn--xs { padding: var(--nc-spacing-1); min-width: 1.75rem; }
    .btn--icon-only.btn--sm { padding: var(--nc-spacing-1); min-width: 2rem; }
    .btn--icon-only.btn--md { padding: var(--nc-spacing-2); min-width: 2.5rem; }
    .btn--icon-only.btn--lg { padding: var(--nc-spacing-2); min-width: 2.75rem; }
    .btn--icon-only.btn--xl { padding: var(--nc-spacing-3); min-width: 3.25rem; }

    /* ─── Variant: Primary ─── */
    .btn--primary {
      background-color: var(--nc-color-primary-600);
      color: #fff;
    }
    .btn--primary:hover:not(:disabled) {
      background-color: var(--nc-color-primary-700);
      box-shadow: var(--nc-shadow-sm);
    }
    .btn--primary:active:not(:disabled) {
      background-color: var(--nc-color-primary-800);
    }

    /* ─── Variant: Secondary ─── */
    .btn--secondary {
      background-color: var(--nc-color-neutral-100);
      color: var(--nc-color-neutral-800);
      border-color: var(--nc-color-neutral-200);
    }
    .btn--secondary:hover:not(:disabled) {
      background-color: var(--nc-color-neutral-200);
      border-color: var(--nc-color-neutral-300);
    }
    .btn--secondary:active:not(:disabled) {
      background-color: var(--nc-color-neutral-300);
    }

    /* ─── Variant: Ghost ─── */
    .btn--ghost {
      background-color: transparent;
      color: var(--nc-color-neutral-700);
    }
    .btn--ghost:hover:not(:disabled) {
      background-color: var(--nc-color-neutral-100);
    }
    .btn--ghost:active:not(:disabled) {
      background-color: var(--nc-color-neutral-200);
    }

    /* ─── Variant: Danger ─── */
    .btn--danger {
      background-color: var(--nc-color-danger-600);
      color: #fff;
    }
    .btn--danger:hover:not(:disabled) {
      background-color: var(--nc-color-danger-700);
      box-shadow: var(--nc-shadow-sm);
    }
    .btn--danger:active:not(:disabled) {
      background-color: var(--nc-color-danger-500);
    }

    /* ─── Variant: Outline ─── */
    .btn--outline {
      background-color: transparent;
      color: var(--nc-color-primary-600);
      border-color: var(--nc-color-primary-300);
    }
    .btn--outline:hover:not(:disabled) {
      background-color: var(--nc-color-primary-50);
      border-color: var(--nc-color-primary-400);
    }
    .btn--outline:active:not(:disabled) {
      background-color: var(--nc-color-primary-100);
    }

    /* ─── Variant: Link ─── */
    .btn--link {
      background-color: transparent;
      color: var(--nc-color-primary-600);
      border-color: transparent;
      padding-left: 0;
      padding-right: 0;
      min-height: auto;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    .btn--link:hover:not(:disabled) {
      color: var(--nc-color-primary-700);
      text-decoration-thickness: 2px;
    }
    .btn--link:active:not(:disabled) {
      color: var(--nc-color-primary-800);
    }

    /* ─── Disabled State ─── */
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* ─── Loading State ─── */
    .btn--loading {
      cursor: wait;
      pointer-events: none;
    }
    .btn--loading .btn__label,
    .btn--loading .btn__prefix,
    .btn--loading .btn__suffix {
      opacity: 0.4;
    }

    /* ─── Spinner ─── */
    @keyframes nc-spin {
      to { transform: rotate(360deg); }
    }

    .btn__spinner {
      display: none;
      width: 1em;
      height: 1em;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: var(--nc-radius-full);
      animation: nc-spin 0.6s linear infinite;
      flex-shrink: 0;
    }
    .btn--loading .btn__spinner {
      display: inline-block;
    }

    /* ─── Slots ─── */
    .btn__prefix,
    .btn__suffix {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
    }

    .btn__label {
      display: inline-flex;
      align-items: center;
    }

    /* ─── Full Width ─── */
    .btn--full-width {
      width: 100%;
    }
  `;

  protected render(): string {
    const variant = this.getStrAttr('variant', 'primary');
    const size = this.getStrAttr('size', 'md');
    const disabled = this.getBoolAttr('disabled');
    const loading = this.getBoolAttr('loading');
    const fullWidth = this.getBoolAttr('full-width');
    const iconOnly = this.getBoolAttr('icon-only');

    const classes = [
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      loading ? 'btn--loading' : '',
      fullWidth ? 'btn--full-width' : '',
      iconOnly ? 'btn--icon-only' : '',
    ].filter(Boolean).join(' ');

    return `
      <button
        class="${classes}"
        part="base"
        ${disabled ? 'disabled' : ''}
        ${loading ? 'aria-busy="true"' : ''}
        ${iconOnly ? 'aria-label="' + this.getStrAttr('aria-label', '') + '"' : ''}
      >
        <span class="btn__spinner" part="spinner"></span>
        <span class="btn__prefix" part="prefix"><slot name="prefix"></slot></span>
        <span class="btn__label" part="label"><slot></slot></span>
        <span class="btn__suffix" part="suffix"><slot name="suffix"></slot></span>
      </button>
    `;
  }

  protected afterRender(): void {
    const btn = this.shadow.querySelector('button');
    if (btn) {
      btn.addEventListener('click', this._handleClick);
    }
  }

  protected _cleanup(): void {
    const btn = this.shadow.querySelector('button');
    if (btn) {
      btn.removeEventListener('click', this._handleClick);
    }
  }

  private _handleClick = (e: Event) => {
    if (this.getBoolAttr('disabled') || this.getBoolAttr('loading')) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    this.emit('nc-click');
  };
}

defineElement('nc-button', NcButton);
