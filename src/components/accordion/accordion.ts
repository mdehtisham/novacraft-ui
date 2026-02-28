import { NcBaseElement } from '../../core/base-element';
import { defineElement, uniqueId } from '../../utils/helpers';

// ─── NcAccordion (wrapper) ───────────────────────────────────

export class NcAccordion extends NcBaseElement {
  static observedAttributes = ['multiple'];

  static styles = `
    :host {
      display: block;
      border: 1px solid var(--nc-color-border, var(--nc-color-neutral-200, #e5e5e5));
      border-radius: var(--nc-radius-lg, 0.5rem);
      overflow: hidden;
    }

    ::slotted(nc-accordion-item:not(:last-of-type)) {
      border-bottom: 1px solid var(--nc-color-border, var(--nc-color-neutral-200, #e5e5e5));
    }
  `;

  get multiple(): boolean {
    return this.getBoolAttr('multiple');
  }

  set multiple(val: boolean) {
    this.setBoolAttr('multiple', val);
  }

  protected render(): string {
    return `<slot></slot>`;
  }

  protected afterRender(): void {
    this.addEventListener('nc-toggle', this._handleItemToggle as EventListener);
  }

  protected _cleanup(): void {
    this.removeEventListener('nc-toggle', this._handleItemToggle as EventListener);
  }

  private _handleItemToggle = (e: CustomEvent<{ open: boolean }>): void => {
    if (this.multiple || !e.detail.open) return;

    const items = this._getItems();
    const target = e.target as NcAccordionItem;

    for (const item of items) {
      if (item !== target && item.open) {
        item.open = false;
      }
    }
  };

  private _getItems(): NcAccordionItem[] {
    const slot = this.shadow.querySelector('slot');
    if (!slot) return [];
    return slot
      .assignedElements({ flatten: true })
      .filter((el): el is NcAccordionItem => el instanceof NcAccordionItem);
  }
}

// ─── NcAccordionItem ─────────────────────────────────────────

export class NcAccordionItem extends NcBaseElement {
  static observedAttributes = ['open', 'disabled', 'header'];

  static styles = `
    :host {
      display: block;
    }

    /* ─── Header / Trigger ─── */
    .accordion-item__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: var(--nc-spacing-4, 1rem) var(--nc-spacing-4, 1rem);
      margin: 0;
      border: none;
      background: var(--nc-color-surface, var(--nc-color-neutral-50, #fafafa));
      color: var(--nc-color-neutral-900, #171717);
      font-family: var(--nc-font-family-sans);
      font-size: var(--nc-font-size-md, 1rem);
      font-weight: var(--nc-font-weight-medium, 500);
      line-height: var(--nc-line-height-normal, 1.5);
      cursor: pointer;
      user-select: none;
      text-align: left;
      transition: background-color var(--nc-transition-fast, 150ms ease);
    }

    .accordion-item__header:hover:not(.accordion-item__header--disabled) {
      background: var(--nc-color-neutral-100, #f5f5f5);
    }

    .accordion-item__header:focus-visible {
      outline: none;
      box-shadow: var(--nc-focus-ring, 0 0 0 3px rgba(99, 102, 241, 0.4));
      z-index: 1;
      position: relative;
    }

    .accordion-item__header--disabled {
      cursor: not-allowed;
      opacity: 0.5;
      pointer-events: none;
    }

    /* ─── Chevron icon ─── */
    .accordion-item__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 1.25rem;
      height: 1.25rem;
      margin-left: var(--nc-spacing-3, 0.75rem);
      transition: transform var(--nc-transition-normal, 200ms ease);
    }

    .accordion-item__icon--open {
      transform: rotate(180deg);
    }

    .accordion-item__icon svg {
      width: 100%;
      height: 100%;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    /* ─── Content panel ─── */
    .accordion-item__panel {
      overflow: hidden;
      max-height: 0;
      transition: max-height var(--nc-transition-slow, 300ms ease);
    }

    .accordion-item__panel--open {
      max-height: var(--nc-accordion-panel-height, 0px);
    }

    .accordion-item__content {
      padding: var(--nc-spacing-4, 1rem);
      color: var(--nc-color-neutral-700, #404040);
      font-family: var(--nc-font-family-sans);
      font-size: var(--nc-font-size-sm, 0.875rem);
      line-height: var(--nc-line-height-relaxed, 1.75);
    }
  `;

  private _headerId = uniqueId('nc-acc-header');
  private _panelId = uniqueId('nc-acc-panel');

  // ─── Public properties ───────────────────────────────────

  get open(): boolean {
    return this.getBoolAttr('open');
  }

  set open(val: boolean) {
    this.setBoolAttr('open', val);
  }

  get disabled(): boolean {
    return this.getBoolAttr('disabled');
  }

  set disabled(val: boolean) {
    this.setBoolAttr('disabled', val);
  }

  get header(): string {
    return this.getStrAttr('header');
  }

  set header(val: string) {
    this.setStrAttr('header', val);
  }

  // ─── Render ──────────────────────────────────────────────

  protected render(): string {
    const isOpen = this.open;
    const isDisabled = this.disabled;
    const headerText = this.header;

    return `
      <button
        id="${this._headerId}"
        class="accordion-item__header${isDisabled ? ' accordion-item__header--disabled' : ''}"
        part="header"
        role="button"
        aria-expanded="${isOpen}"
        aria-controls="${this._panelId}"
        ${isDisabled ? 'tabindex="-1"' : 'tabindex="0"'}
        ${isDisabled ? 'aria-disabled="true"' : ''}
      >
        <span class="accordion-item__header-text" part="header-text">
          <slot name="header">${headerText}</slot>
        </span>
        <span class="accordion-item__icon${isOpen ? ' accordion-item__icon--open' : ''}" part="icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>
      <div
        id="${this._panelId}"
        class="accordion-item__panel${isOpen ? ' accordion-item__panel--open' : ''}"
        role="region"
        aria-labelledby="${this._headerId}"
        part="panel"
      >
        <div class="accordion-item__content" part="content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  protected afterRender(): void {
    const trigger = this.shadow.querySelector<HTMLButtonElement>('.accordion-item__header');
    if (trigger) {
      trigger.addEventListener('click', this._handleClick);
      trigger.addEventListener('keydown', this._handleKeydown);
    }

    // Apply scrollHeight for smooth max-height animation
    if (this.open) {
      requestAnimationFrame(() => this._updatePanelHeight());
    }
  }

  protected _cleanup(): void {
    const trigger = this.shadow.querySelector<HTMLButtonElement>('.accordion-item__header');
    if (trigger) {
      trigger.removeEventListener('click', this._handleClick);
      trigger.removeEventListener('keydown', this._handleKeydown);
    }
  }

  // ─── Toggle logic ────────────────────────────────────────

  private _toggle(): void {
    if (this.disabled) return;
    this.open = !this.open;
    this.emit('nc-toggle', { open: this.open });
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'open' && oldValue !== newValue) {
      requestAnimationFrame(() => this._updatePanelHeight());
    }
  }

  private _updatePanelHeight(): void {
    const panel = this.shadow.querySelector<HTMLElement>('.accordion-item__panel');
    const content = this.shadow.querySelector<HTMLElement>('.accordion-item__content');
    if (!panel || !content) return;

    if (this.open) {
      panel.style.setProperty('--nc-accordion-panel-height', `${content.scrollHeight}px`);
      panel.classList.add('accordion-item__panel--open');
    } else {
      panel.style.setProperty('--nc-accordion-panel-height', '0px');
      panel.classList.remove('accordion-item__panel--open');
    }
  }

  // ─── Event handlers ──────────────────────────────────────

  private _handleClick = (): void => {
    this._toggle();
  };

  private _handleKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._toggle();
    }
  };
}

// ─── Register elements ───────────────────────────────────────

defineElement('nc-accordion', NcAccordion);
defineElement('nc-accordion-item', NcAccordionItem);
