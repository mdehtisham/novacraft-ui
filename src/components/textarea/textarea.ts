import { NcBaseElement } from '../../core/base-element';
import { defineElement } from '../../utils/helpers';

export class NcTextarea extends NcBaseElement {
  static observedAttributes = [
    'label', 'placeholder', 'value', 'error', 'hint',
    'required', 'disabled', 'rows', 'maxlength',
    'resize', 'auto-grow', 'name',
  ];

  static styles = `
    :host {
      display: block;
      font-family: var(--nc-font-family-sans);
    }

    /* ─── Wrapper ─── */
    .textarea-field {
      display: flex;
      flex-direction: column;
      gap: var(--nc-spacing-1);
    }

    /* ─── Label ─── */
    .textarea-field__label {
      font-size: var(--nc-font-size-sm);
      font-weight: var(--nc-font-weight-semibold);
      color: var(--nc-color-neutral-700);
      line-height: var(--nc-line-height-tight);
    }

    .textarea-field__label--required::after {
      content: ' *';
      color: var(--nc-color-danger-600);
    }

    /* ─── Textarea ─── */
    .textarea-field__textarea {
      display: block;
      width: 100%;
      padding: var(--nc-spacing-2) var(--nc-spacing-3);
      font-family: var(--nc-font-family-sans);
      font-size: var(--nc-font-size-sm);
      line-height: var(--nc-line-height-normal);
      color: var(--nc-color-neutral-900);
      background-color: var(--nc-color-neutral-50);
      border: 1px solid var(--nc-color-neutral-300);
      border-radius: var(--nc-radius-md);
      box-sizing: border-box;
      transition:
        border-color var(--nc-transition-fast),
        box-shadow var(--nc-transition-fast);
    }

    .textarea-field__textarea::placeholder {
      color: var(--nc-color-neutral-400);
    }

    .textarea-field__textarea:hover:not(:disabled) {
      border-color: var(--nc-color-neutral-400);
    }

    .textarea-field__textarea:focus {
      outline: none;
      border-color: var(--nc-color-primary-500);
      box-shadow: var(--nc-focus-ring-offset);
    }

    .textarea-field__textarea:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background-color: var(--nc-color-neutral-100);
    }

    /* ─── Resize Control ─── */
    .textarea-field__textarea--resize-none       { resize: none; }
    .textarea-field__textarea--resize-vertical    { resize: vertical; }
    .textarea-field__textarea--resize-horizontal  { resize: horizontal; }
    .textarea-field__textarea--resize-both        { resize: both; }

    /* ─── Auto-grow ─── */
    .textarea-field__textarea--auto-grow {
      resize: none;
      overflow: hidden;
    }

    /* ─── Error State ─── */
    .textarea-field--error .textarea-field__textarea {
      border-color: var(--nc-color-danger-500);
    }

    .textarea-field--error .textarea-field__textarea:focus {
      border-color: var(--nc-color-danger-500);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--nc-color-danger-500) 20%, transparent);
    }

    /* ─── Footer (hint / error / counter) ─── */
    .textarea-field__footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--nc-spacing-2);
    }

    .textarea-field__error {
      font-size: var(--nc-font-size-xs);
      color: var(--nc-color-danger-600);
      line-height: var(--nc-line-height-normal);
    }

    .textarea-field__hint {
      font-size: var(--nc-font-size-xs);
      color: var(--nc-color-neutral-500);
      line-height: var(--nc-line-height-normal);
    }

    .textarea-field__counter {
      font-size: var(--nc-font-size-xs);
      color: var(--nc-color-neutral-500);
      line-height: var(--nc-line-height-normal);
      margin-left: auto;
      flex-shrink: 0;
    }

    .textarea-field__counter--over {
      color: var(--nc-color-danger-600);
    }
  `;

  protected render(): string {
    const label = this.getStrAttr('label');
    const placeholder = this.getStrAttr('placeholder');
    const value = this.getStrAttr('value');
    const error = this.getStrAttr('error');
    const hint = this.getStrAttr('hint');
    const required = this.getBoolAttr('required');
    const disabled = this.getBoolAttr('disabled');
    const rows = this.getNumAttr('rows', 3);
    const maxlength = this.getAttribute('maxlength');
    const resize = this.getStrAttr('resize', 'vertical');
    const autoGrow = this.getBoolAttr('auto-grow');
    const name = this.getStrAttr('name');

    const hasError = error.length > 0;
    const wrapperClasses = [
      'textarea-field',
      hasError ? 'textarea-field--error' : '',
    ].filter(Boolean).join(' ');

    const textareaClasses = [
      'textarea-field__textarea',
      autoGrow
        ? 'textarea-field__textarea--auto-grow'
        : `textarea-field__textarea--resize-${resize}`,
    ].join(' ');

    const charCount = value.length;
    const maxVal = maxlength !== null ? Number(maxlength) : null;
    const isOver = maxVal !== null && charCount > maxVal;

    const labelHtml = label
      ? `<label class="textarea-field__label${required ? ' textarea-field__label--required' : ''}" part="label">${label}</label>`
      : '';

    const errorHtml = hasError
      ? `<span class="textarea-field__error" part="error">${error}</span>`
      : '';

    const hintHtml = !hasError && hint
      ? `<span class="textarea-field__hint" part="hint">${hint}</span>`
      : '';

    const counterHtml = maxVal !== null
      ? `<span class="textarea-field__counter${isOver ? ' textarea-field__counter--over' : ''}" part="counter">${charCount} / ${maxVal}</span>`
      : '';

    const hasFooter = errorHtml || hintHtml || counterHtml;

    return `
      <div class="${wrapperClasses}" part="base">
        ${labelHtml}
        <textarea
          class="${textareaClasses}"
          part="textarea"
          rows="${rows}"
          ${placeholder ? `placeholder="${placeholder}"` : ''}
          ${maxlength !== null ? `maxlength="${maxlength}"` : ''}
          ${required ? 'required' : ''}
          ${disabled ? 'disabled' : ''}
          ${name ? `name="${name}"` : ''}
          ${hasError ? 'aria-invalid="true"' : ''}
        >${value}</textarea>
        ${hasFooter ? `<div class="textarea-field__footer">${errorHtml || hintHtml}${counterHtml}</div>` : ''}
      </div>
    `;
  }

  protected afterRender(): void {
    const textarea = this.shadow.querySelector('textarea');
    if (!textarea) return;

    textarea.addEventListener('input', this._handleInput);
    textarea.addEventListener('change', this._handleChange);
    textarea.addEventListener('focus', this._handleFocus);
    textarea.addEventListener('blur', this._handleBlur);

    if (this.getBoolAttr('auto-grow')) {
      this._adjustHeight(textarea);
    }
  }

  protected _cleanup(): void {
    const textarea = this.shadow.querySelector('textarea');
    if (!textarea) return;

    textarea.removeEventListener('input', this._handleInput);
    textarea.removeEventListener('change', this._handleChange);
    textarea.removeEventListener('focus', this._handleFocus);
    textarea.removeEventListener('blur', this._handleBlur);
  }

  private _handleInput = (e: Event) => {
    const textarea = e.target as HTMLTextAreaElement;
    this.setAttribute('value', textarea.value);

    if (this.getBoolAttr('auto-grow')) {
      this._adjustHeight(textarea);
    }

    this._updateCounter(textarea);
    this.emit('nc-input', { value: textarea.value });
  };

  private _handleChange = (e: Event) => {
    const textarea = e.target as HTMLTextAreaElement;
    this.emit('nc-change', { value: textarea.value });
  };

  private _handleFocus = () => {
    this.emit('nc-focus');
  };

  private _handleBlur = () => {
    this.emit('nc-blur');
  };

  private _adjustHeight(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  private _updateCounter(textarea: HTMLTextAreaElement): void {
    const counter = this.shadow.querySelector('.textarea-field__counter') as HTMLElement | null;
    if (!counter) return;

    const maxVal = Number(this.getAttribute('maxlength'));
    const len = textarea.value.length;
    counter.textContent = `${len} / ${maxVal}`;

    if (len > maxVal) {
      counter.classList.add('textarea-field__counter--over');
    } else {
      counter.classList.remove('textarea-field__counter--over');
    }
  }
}

defineElement('nc-textarea', NcTextarea);
