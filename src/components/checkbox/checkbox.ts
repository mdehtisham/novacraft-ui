import { NcBaseElement } from '../../core/base-element';
import { defineElement } from '../../utils/helpers';

export class NcCheckbox extends NcBaseElement {
  static observedAttributes = ['checked', 'indeterminate', 'disabled', 'label', 'value', 'name'];

  static styles = `
    :host {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
      font-family: var(--nc-font-family-sans);
      font-size: var(--nc-font-size-sm);
      line-height: var(--nc-line-height-tight);
      vertical-align: middle;
    }

    :host([disabled]) {
      cursor: not-allowed;
      opacity: 0.5;
      pointer-events: none;
    }

    /* ─── Wrapper ─── */
    .checkbox {
      display: inline-flex;
      align-items: center;
      gap: var(--nc-spacing-2, 0.5rem);
      cursor: inherit;
    }

    /* ─── Custom Box ─── */
    .checkbox__box {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.125rem;
      height: 1.125rem;
      flex-shrink: 0;
      border: 2px solid var(--nc-color-neutral-400, #9ca3af);
      border-radius: var(--nc-radius-sm, 0.25rem);
      background-color: var(--nc-color-neutral-50, #fff);
      transition:
        background-color var(--nc-transition-fast, 150ms ease),
        border-color var(--nc-transition-fast, 150ms ease),
        box-shadow var(--nc-transition-fast, 150ms ease);
    }

    /* ─── Focus Ring ─── */
    .checkbox:focus-visible .checkbox__box {
      outline: none;
      box-shadow: var(--nc-focus-ring-offset, 0 0 0 3px rgba(59, 130, 246, 0.35));
    }

    /* ─── Hover ─── */
    .checkbox:hover .checkbox__box {
      border-color: var(--nc-color-primary-500, #6366f1);
    }

    /* ─── Checked / Indeterminate Box ─── */
    .checkbox--checked .checkbox__box,
    .checkbox--indeterminate .checkbox__box {
      background-color: var(--nc-color-primary-600, #4f46e5);
      border-color: var(--nc-color-primary-600, #4f46e5);
    }

    .checkbox--checked:hover .checkbox__box,
    .checkbox--indeterminate:hover .checkbox__box {
      background-color: var(--nc-color-primary-700, #4338ca);
      border-color: var(--nc-color-primary-700, #4338ca);
    }

    /* ─── Checkmark SVG ─── */
    .checkbox__check {
      display: block;
      width: 0.75rem;
      height: 0.75rem;
      opacity: 0;
      transform: scale(0.5);
      transition:
        opacity var(--nc-transition-fast, 150ms ease),
        transform var(--nc-transition-fast, 150ms ease);
      color: #fff;
    }

    .checkbox--checked .checkbox__check {
      opacity: 1;
      transform: scale(1);
    }

    /* ─── Indeterminate Dash ─── */
    .checkbox__indeterminate {
      display: block;
      width: 0.5rem;
      height: 2px;
      border-radius: 1px;
      background-color: #fff;
      opacity: 0;
      transform: scaleX(0);
      transition:
        opacity var(--nc-transition-fast, 150ms ease),
        transform var(--nc-transition-fast, 150ms ease);
    }

    .checkbox--indeterminate .checkbox__indeterminate {
      opacity: 1;
      transform: scaleX(1);
    }

    /* ─── Label ─── */
    .checkbox__label {
      color: var(--nc-color-neutral-800, #1f2937);
    }
  `;

  private _handleClick = () => {
    if (this.getBoolAttr('disabled')) return;
    this._toggle();
  };

  private _handleKeydown = (e: KeyboardEvent) => {
    if (this.getBoolAttr('disabled')) return;
    if (e.key === ' ') {
      e.preventDefault();
      this._toggle();
    }
  };

  private _toggle(): void {
    // Clear indeterminate on user interaction
    if (this.getBoolAttr('indeterminate')) {
      this.removeAttribute('indeterminate');
    }

    const isChecked = this.getBoolAttr('checked');
    this.setBoolAttr('checked', !isChecked);

    this.emit<{ checked: boolean; indeterminate: boolean }>('nc-change', {
      checked: !isChecked,
      indeterminate: false,
    });
  }

  protected render(): string {
    const checked = this.getBoolAttr('checked');
    const indeterminate = this.getBoolAttr('indeterminate');
    const disabled = this.getBoolAttr('disabled');
    const label = this.getStrAttr('label');

    const ariaChecked = indeterminate ? 'mixed' : String(checked);

    const classes = [
      'checkbox',
      checked ? 'checkbox--checked' : '',
      indeterminate ? 'checkbox--indeterminate' : '',
    ].filter(Boolean).join(' ');

    return `
      <div
        class="${classes}"
        part="base"
        role="checkbox"
        aria-checked="${ariaChecked}"
        aria-disabled="${disabled}"
        tabindex="${disabled ? -1 : 0}"
      >
        <span class="checkbox__box" part="box">
          <svg class="checkbox__check" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polyline points="2.5 6 5 8.5 9.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="checkbox__indeterminate"></span>
        </span>
        ${label ? `<span class="checkbox__label" part="label">${label}</span>` : ''}
      </div>
    `;
  }

  protected afterRender(): void {
    const wrapper = this.shadow.querySelector('.checkbox');
    if (wrapper) {
      wrapper.addEventListener('click', this._handleClick);
      wrapper.addEventListener('keydown', this._handleKeydown as EventListener);
    }
  }

  protected _cleanup(): void {
    const wrapper = this.shadow.querySelector('.checkbox');
    if (wrapper) {
      wrapper.removeEventListener('click', this._handleClick);
      wrapper.removeEventListener('keydown', this._handleKeydown as EventListener);
    }
  }
}

defineElement('nc-checkbox', NcCheckbox);
