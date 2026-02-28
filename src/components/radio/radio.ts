import { NcBaseElement } from '../../core/base-element';
import { defineElement } from '../../utils/helpers';

/* ═══════════════════════════════════════════════════════════
   NcRadioGroup  –  <nc-radio-group>
   Groups <nc-radio> children with keyboard navigation.
   ═══════════════════════════════════════════════════════════ */

export class NcRadioGroup extends NcBaseElement {
  static observedAttributes = ['name', 'value', 'label', 'disabled'];

  static styles = `
    :host {
      display: block;
      font-family: var(--nc-font-family-sans);
    }

    :host([disabled]) {
      opacity: 0.5;
      pointer-events: none;
    }

    .radio-group {
      display: flex;
      flex-direction: column;
      gap: var(--nc-spacing-2, 0.5rem);
    }

    .radio-group__label {
      font-size: var(--nc-font-size-sm, 0.875rem);
      font-weight: 500;
      color: var(--nc-color-neutral-700, #374151);
      margin-bottom: var(--nc-spacing-1, 0.25rem);
    }
  `;

  protected render(): string {
    const label = this.getStrAttr('label');

    return `
      <div
        class="radio-group"
        role="radiogroup"
        aria-label="${label || 'Radio group'}"
        part="base"
      >
        ${label ? `<span class="radio-group__label" part="label">${label}</span>` : ''}
        <slot></slot>
      </div>
    `;
  }

  protected afterRender(): void {
    this.addEventListener('keydown', this._handleKeydown);
    this.addEventListener('nc-radio-select', this._handleRadioSelect as EventListener);
    this._syncRadios();
  }

  protected _cleanup(): void {
    this.removeEventListener('keydown', this._handleKeydown);
    this.removeEventListener('nc-radio-select', this._handleRadioSelect as EventListener);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'value' && oldValue !== newValue) {
      this._syncRadios();
    }
  }

  private _getRadios(): NcRadio[] {
    return Array.from(this.querySelectorAll('nc-radio')) as NcRadio[];
  }

  private _getEnabledRadios(): NcRadio[] {
    return this._getRadios().filter(r => !r.getBoolAttr('disabled'));
  }

  private _syncRadios(): void {
    const value = this.getStrAttr('value');
    const name = this.getStrAttr('name');
    const disabled = this.getBoolAttr('disabled');

    for (const radio of this._getRadios()) {
      if (name) radio.setAttribute('name', name);
      if (disabled) radio.setAttribute('disabled', '');

      const isSelected = radio.getStrAttr('value') === value;
      radio.setBoolAttr('checked', isSelected);
    }
  }

  private _handleRadioSelect = (e: CustomEvent<{ value: string }>) => {
    e.stopPropagation();
    const value = e.detail.value;
    this.setAttribute('value', value);
    this._syncRadios();
    this.emit<{ value: string }>('nc-change', { value });
  };

  private _handleKeydown = (e: KeyboardEvent) => {
    if (this.getBoolAttr('disabled')) return;
    if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return;

    e.preventDefault();
    const radios = this._getEnabledRadios();
    if (radios.length === 0) return;

    const current = radios.findIndex(r => r.getBoolAttr('checked'));
    let next: number;

    if (e.key === 'ArrowDown') {
      next = current < 0 ? 0 : (current + 1) % radios.length;
    } else {
      next = current < 0 ? radios.length - 1 : (current - 1 + radios.length) % radios.length;
    }

    const radio = radios[next];
    const value = radio.getStrAttr('value');
    this.setAttribute('value', value);
    this._syncRadios();
    radio.focus();
    this.emit<{ value: string }>('nc-change', { value });
  };
}

defineElement('nc-radio-group', NcRadioGroup);

/* ═══════════════════════════════════════════════════════════
   NcRadio  –  <nc-radio>
   Individual radio button with custom styled circle.
   ═══════════════════════════════════════════════════════════ */

export class NcRadio extends NcBaseElement {
  static observedAttributes = ['value', 'label', 'disabled', 'checked'];

  static styles = `
    :host {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
      font-family: var(--nc-font-family-sans);
      font-size: var(--nc-font-size-sm, 0.875rem);
      line-height: var(--nc-line-height-tight);
      vertical-align: middle;
    }

    :host([disabled]) {
      cursor: not-allowed;
      opacity: 0.5;
      pointer-events: none;
    }

    /* ─── Wrapper ─── */
    .radio {
      display: inline-flex;
      align-items: center;
      gap: var(--nc-spacing-2, 0.5rem);
      cursor: inherit;
    }

    /* ─── Outer Circle ─── */
    .radio__circle {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.125rem;
      height: 1.125rem;
      flex-shrink: 0;
      border: 2px solid var(--nc-color-neutral-400, #9ca3af);
      border-radius: var(--nc-radius-full, 9999px);
      background-color: var(--nc-color-neutral-50, #fff);
      transition:
        background-color var(--nc-transition-fast, 150ms ease),
        border-color var(--nc-transition-fast, 150ms ease),
        box-shadow var(--nc-transition-fast, 150ms ease);
    }

    /* ─── Focus Ring ─── */
    .radio:focus-visible .radio__circle {
      outline: none;
      box-shadow: var(--nc-focus-ring-offset, 0 0 0 3px rgba(59, 130, 246, 0.35));
    }

    /* ─── Hover ─── */
    .radio:hover .radio__circle {
      border-color: var(--nc-color-primary-500, #6366f1);
    }

    /* ─── Checked Circle ─── */
    .radio--checked .radio__circle {
      border-color: var(--nc-color-primary-600, #4f46e5);
    }

    .radio--checked:hover .radio__circle {
      border-color: var(--nc-color-primary-700, #4338ca);
    }

    /* ─── Inner Dot ─── */
    .radio__dot {
      display: block;
      width: 0.5rem;
      height: 0.5rem;
      border-radius: var(--nc-radius-full, 9999px);
      background-color: var(--nc-color-primary-600, #4f46e5);
      opacity: 0;
      transform: scale(0);
      transition:
        opacity var(--nc-transition-fast, 150ms ease),
        transform var(--nc-transition-fast, 150ms ease);
    }

    .radio--checked .radio__dot {
      opacity: 1;
      transform: scale(1);
    }

    .radio--checked:hover .radio__dot {
      background-color: var(--nc-color-primary-700, #4338ca);
    }

    /* ─── Label ─── */
    .radio__label {
      color: var(--nc-color-neutral-800, #1f2937);
    }
  `;

  private _handleClick = () => {
    if (this.getBoolAttr('disabled') || this.getBoolAttr('checked')) return;
    this._select();
  };

  private _handleKeydown = (e: KeyboardEvent) => {
    if (this.getBoolAttr('disabled')) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!this.getBoolAttr('checked')) this._select();
    }
  };

  private _select(): void {
    this.setBoolAttr('checked', true);
    this.emit<{ value: string }>('nc-radio-select', {
      value: this.getStrAttr('value'),
    });
  }

  /** Allow parent group to call focus on this radio. */
  focus(): void {
    this.shadow.querySelector<HTMLElement>('.radio')?.focus();
  }

  protected render(): string {
    const checked = this.getBoolAttr('checked');
    const disabled = this.getBoolAttr('disabled');
    const label = this.getStrAttr('label');

    const classes = [
      'radio',
      checked ? 'radio--checked' : '',
    ].filter(Boolean).join(' ');

    return `
      <div
        class="${classes}"
        part="base"
        role="radio"
        aria-checked="${checked}"
        aria-disabled="${disabled}"
        tabindex="${disabled ? -1 : 0}"
      >
        <span class="radio__circle" part="circle">
          <span class="radio__dot" part="dot"></span>
        </span>
        ${label ? `<span class="radio__label" part="label">${label}</span>` : ''}
      </div>
    `;
  }

  protected afterRender(): void {
    const wrapper = this.shadow.querySelector('.radio');
    if (wrapper) {
      wrapper.addEventListener('click', this._handleClick);
      wrapper.addEventListener('keydown', this._handleKeydown as EventListener);
    }
  }

  protected _cleanup(): void {
    const wrapper = this.shadow.querySelector('.radio');
    if (wrapper) {
      wrapper.removeEventListener('click', this._handleClick);
      wrapper.removeEventListener('keydown', this._handleKeydown as EventListener);
    }
  }
}

defineElement('nc-radio', NcRadio);
