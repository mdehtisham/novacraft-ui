import { NcBaseElement } from '../../core/base-element';
import { defineElement } from '../../utils/helpers';

const VALID_TYPES = ['text', 'email', 'password', 'number', 'tel', 'url', 'search'] as const;

export class NcInput extends NcBaseElement {
  static observedAttributes = [
    'type', 'label', 'placeholder', 'value', 'error', 'hint', 'required', 'disabled', 'name',
  ];

  static styles = `
    :host {
      display: block;
      font-family: var(--nc-font-family-sans);
    }

    /* ─── Wrapper ─── */
    .input {
      display: flex;
      flex-direction: column;
      gap: var(--nc-spacing-1);
    }

    /* ─── Label ─── */
    .input__label {
      display: block;
      font-size: var(--nc-font-size-sm);
      font-weight: var(--nc-font-weight-medium);
      color: var(--nc-color-neutral-700);
      line-height: var(--nc-line-height-normal);
    }

    .input__label--required::after {
      content: ' *';
      color: var(--nc-color-danger-500);
    }

    /* ─── Input Wrapper (holds prefix, input, suffix) ─── */
    .input__wrapper {
      display: flex;
      align-items: center;
      gap: var(--nc-spacing-2);
      border: 1px solid var(--nc-color-neutral-300);
      border-radius: var(--nc-radius-md);
      background-color: var(--nc-color-neutral-0, #fff);
      padding: 0 var(--nc-spacing-3);
      transition:
        border-color var(--nc-transition-fast),
        box-shadow var(--nc-transition-fast);
    }

    .input__wrapper:focus-within {
      border-color: var(--nc-color-primary-500);
      box-shadow: var(--nc-focus-ring-offset);
    }

    .input__wrapper--error {
      border-color: var(--nc-color-danger-500);
    }

    .input__wrapper--error:focus-within {
      border-color: var(--nc-color-danger-500);
      box-shadow: 0 0 0 3px var(--nc-color-danger-100, rgba(239, 68, 68, 0.2));
    }

    .input__wrapper--disabled {
      background-color: var(--nc-color-neutral-100);
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* ─── Native Input ─── */
    .input__control {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-family: inherit;
      font-size: var(--nc-font-size-sm);
      color: var(--nc-color-neutral-900);
      line-height: var(--nc-line-height-normal);
      padding: var(--nc-spacing-2) 0;
      min-width: 0;
    }

    .input__control::placeholder {
      color: var(--nc-color-neutral-400);
    }

    .input__control:disabled {
      cursor: not-allowed;
    }

    /* ─── Prefix / Suffix Slots ─── */
    .input__prefix,
    .input__suffix {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
      color: var(--nc-color-neutral-500);
    }

    /* ─── Error Message ─── */
    .input__error {
      font-size: var(--nc-font-size-xs);
      color: var(--nc-color-danger-500);
      line-height: var(--nc-line-height-normal);
    }

    /* ─── Hint Text ─── */
    .input__hint {
      font-size: var(--nc-font-size-xs);
      color: var(--nc-color-neutral-500);
      line-height: var(--nc-line-height-normal);
    }
  `;

  private _handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    this.emit('nc-input', { value: target.value });
  };

  private _handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    this.emit('nc-change', { value: target.value });
  };

  private _handleFocus = () => {
    this.emit('nc-focus');
  };

  private _handleBlur = () => {
    this.emit('nc-blur');
  };

  protected render(): string {
    const type = this.getStrAttr('type', 'text');
    const safeType = (VALID_TYPES as readonly string[]).includes(type) ? type : 'text';
    const label = this.getStrAttr('label');
    const placeholder = this.getStrAttr('placeholder');
    const name = this.getStrAttr('name');
    const error = this.getStrAttr('error');
    const hint = this.getStrAttr('hint');
    const required = this.getBoolAttr('required');
    const disabled = this.getBoolAttr('disabled');

    const wrapperClasses = [
      'input__wrapper',
      error ? 'input__wrapper--error' : '',
      disabled ? 'input__wrapper--disabled' : '',
    ].filter(Boolean).join(' ');

    const labelClasses = [
      'input__label',
      required ? 'input__label--required' : '',
    ].filter(Boolean).join(' ');

    return `
      <div class="input" part="base">
        ${label ? `<label class="${labelClasses}" part="label">${label}</label>` : ''}
        <div class="${wrapperClasses}">
          <span class="input__prefix" part="prefix"><slot name="prefix"></slot></span>
          <input
            class="input__control"
            part="input"
            type="${safeType}"
            ${name ? `name="${name}"` : ''}
            ${placeholder ? `placeholder="${placeholder}"` : ''}
            ${required ? 'required' : ''}
            ${disabled ? 'disabled' : ''}
            ${label ? `aria-label="${label}"` : ''}
            ${error ? 'aria-invalid="true"' : ''}
          />
          <span class="input__suffix" part="suffix"><slot name="suffix"></slot></span>
        </div>
        ${error ? `<span class="input__error" part="error">${error}</span>` : ''}
        ${!error && hint ? `<span class="input__hint" part="hint">${hint}</span>` : ''}
      </div>
    `;
  }

  protected afterRender(): void {
    const input = this.shadow.querySelector<HTMLInputElement>('.input__control');
    if (!input) return;

    // Sync value attribute to input element
    const value = this.getStrAttr('value');
    if (value) {
      input.value = value;
    }

    input.addEventListener('input', this._handleInput);
    input.addEventListener('change', this._handleChange);
    input.addEventListener('focus', this._handleFocus);
    input.addEventListener('blur', this._handleBlur);
  }

  protected _cleanup(): void {
    const input = this.shadow.querySelector<HTMLInputElement>('.input__control');
    if (!input) return;

    input.removeEventListener('input', this._handleInput);
    input.removeEventListener('change', this._handleChange);
    input.removeEventListener('focus', this._handleFocus);
    input.removeEventListener('blur', this._handleBlur);
  }
}

defineElement('nc-input', NcInput);
