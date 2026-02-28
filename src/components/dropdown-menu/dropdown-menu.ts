import { NcBaseElement } from '../../core/base-element';
import { defineElement } from '../../utils/helpers';

/* ════════════════════════════════════════════════════════════════
   NcDropdownMenu — Container that toggles a menu panel
   ════════════════════════════════════════════════════════════════ */

export class NcDropdownMenu extends NcBaseElement {
  static observedAttributes = ['open', 'placement'];

  static styles = `
    :host {
      position: relative;
      display: inline-block;
      font-family: var(--nc-font-family-sans);
    }

    .dropdown__trigger {
      display: inline-block;
      cursor: pointer;
    }

    .dropdown__panel {
      position: absolute;
      z-index: var(--nc-z-dropdown, 1000);
      min-width: 180px;
      padding: var(--nc-spacing-1, 4px) 0;
      margin-top: var(--nc-spacing-1, 4px);
      background: var(--nc-color-neutral-50, #fff);
      border: 1px solid var(--nc-color-neutral-200, #e5e5e5);
      border-radius: var(--nc-radius-md, 8px);
      box-shadow: var(--nc-shadow-lg, 0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08));
      opacity: 0;
      transform: translateY(-4px);
      pointer-events: none;
      transition:
        opacity var(--nc-transition-fast, 150ms) ease,
        transform var(--nc-transition-fast, 150ms) ease;
    }

    :host([open]) .dropdown__panel {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    /* Placement: bottom-end aligns right edge */
    :host([placement="bottom-end"]) .dropdown__panel {
      right: 0;
      left: auto;
    }

    /* Placement: bottom-start (default) aligns left edge */
    :host(:not([placement="bottom-end"])) .dropdown__panel {
      left: 0;
      right: auto;
    }
  `;

  // Stable handler references
  private _onTriggerClick = (e: MouseEvent) => {
    e.stopPropagation();
    this._toggle();
  };
  private _onDocumentClick = (e: MouseEvent) => {
    if (this._isOpen && !this.contains(e.target as Node)) this._close();
  };
  private _onKeydown = (e: KeyboardEvent) => {
    if (!this._isOpen) return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        this._close();
        this._triggerEl?.focus();
        break;
      case 'ArrowDown':
        e.preventDefault();
        this._moveFocus(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this._moveFocus(-1);
        break;
    }
  };

  private get _isOpen(): boolean {
    return this.getBoolAttr('open');
  }

  private get _triggerEl(): HTMLElement | null {
    const slotted = this.querySelector('[slot="trigger"]');
    return (slotted as HTMLElement) ?? (this.firstElementChild as HTMLElement);
  }

  protected render(): string {
    const open = this._isOpen;
    return `
      <div class="dropdown__trigger" aria-haspopup="menu" aria-expanded="${open}">
        <slot name="trigger"></slot>
      </div>
      <div class="dropdown__panel" role="menu">
        <slot></slot>
      </div>
    `;
  }

  protected afterRender(): void {
    const trigger = this.shadow.querySelector('.dropdown__trigger') as HTMLElement;
    trigger?.addEventListener('click', this._onTriggerClick);
    document.addEventListener('click', this._onDocumentClick);
    document.addEventListener('keydown', this._onKeydown);
  }

  protected _cleanup(): void {
    document.removeEventListener('click', this._onDocumentClick);
    document.removeEventListener('keydown', this._onKeydown);
  }

  private _toggle(): void {
    this._isOpen ? this._close() : this._open();
  }

  private _open(): void {
    if (this._isOpen) return;
    this.setAttribute('open', '');
    this.emit('nc-show');
    // Focus first enabled item after panel opens
    requestAnimationFrame(() => {
      const items = this._getMenuItems();
      if (items.length) items[0].focus();
    });
  }

  private _close(): void {
    if (!this._isOpen) return;
    this.removeAttribute('open');
    this.emit('nc-hide');
  }

  /** Collect all non-disabled nc-menu-item children. */
  private _getMenuItems(): HTMLElement[] {
    return Array.from(this.querySelectorAll('nc-menu-item:not([disabled])')) as HTMLElement[];
  }

  private _moveFocus(delta: number): void {
    const items = this._getMenuItems();
    if (!items.length) return;

    const active = document.activeElement as HTMLElement;
    let idx = items.indexOf(active);
    idx = idx === -1 ? 0 : idx + delta;
    // Wrap around
    if (idx < 0) idx = items.length - 1;
    if (idx >= items.length) idx = 0;
    items[idx].focus();
  }

  /** Called by NcMenuItem when it is selected. */
  _selectItem(value: string): void {
    this.emit('nc-select', { value });
    this._close();
  }
}

/* ════════════════════════════════════════════════════════════════
   NcMenuItem — Individual menu action
   ════════════════════════════════════════════════════════════════ */

export class NcMenuItem extends NcBaseElement {
  static observedAttributes = ['value', 'disabled', 'danger'];

  static styles = `
    :host {
      display: block;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: var(--nc-spacing-2, 8px);
      width: 100%;
      padding: var(--nc-spacing-2, 8px) var(--nc-spacing-3, 12px);
      border: none;
      background: none;
      font-family: var(--nc-font-family-sans);
      font-size: var(--nc-font-size-sm, 0.875rem);
      color: var(--nc-color-neutral-800, #1f2937);
      line-height: var(--nc-line-height-normal, 1.5);
      cursor: pointer;
      outline: none;
      transition: background-color var(--nc-transition-fast, 150ms) ease;
    }

    .menu-item:hover,
    .menu-item:focus-visible {
      background: var(--nc-color-primary-50, #eff6ff);
      color: var(--nc-color-primary-700, #1d4ed8);
    }

    /* Danger variant */
    :host([danger]) .menu-item {
      color: var(--nc-color-danger-500, #ef4444);
    }
    :host([danger]) .menu-item:hover,
    :host([danger]) .menu-item:focus-visible {
      background: var(--nc-color-danger-50, #fef2f2);
      color: var(--nc-color-danger-700, #b91c1c);
    }

    /* Disabled */
    :host([disabled]) .menu-item {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* Slots */
    .menu-item__prefix,
    .menu-item__suffix {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .menu-item__label {
      flex: 1;
      text-align: left;
    }
  `;

  // Stable handler references
  private _onClick = () => this._select();
  private _onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._select();
    }
  };

  connectedCallback() {
    super.connectedCallback();
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
    this.setAttribute('role', 'menuitem');
  }

  protected render(): string {
    return `
      <div class="menu-item" part="base">
        <span class="menu-item__prefix"><slot name="prefix"></slot></span>
        <span class="menu-item__label"><slot></slot></span>
        <span class="menu-item__suffix"><slot name="suffix"></slot></span>
      </div>
    `;
  }

  protected afterRender(): void {
    const el = this.shadow.querySelector('.menu-item') as HTMLElement;
    el?.addEventListener('click', this._onClick);
    this.addEventListener('keydown', this._onKeydown);
  }

  protected _cleanup(): void {
    this.removeEventListener('keydown', this._onKeydown);
  }

  private _select(): void {
    if (this.getBoolAttr('disabled')) return;
    const value = this.getStrAttr('value');
    const menu = this.closest('nc-dropdown-menu') as NcDropdownMenu | null;
    menu?._selectItem(value);
  }
}

/* ════════════════════════════════════════════════════════════════
   NcMenuDivider — Horizontal separator
   ════════════════════════════════════════════════════════════════ */

export class NcMenuDivider extends NcBaseElement {
  static styles = `
    :host {
      display: block;
    }

    .divider {
      height: 1px;
      margin: var(--nc-spacing-1, 4px) 0;
      background: var(--nc-color-neutral-200, #e5e5e5);
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'separator');
  }

  protected render(): string {
    return `<div class="divider"></div>`;
  }
}

/* ════════════════════════════════════════════════════════════════
   NcMenuGroup — Labelled group of menu items
   ════════════════════════════════════════════════════════════════ */

export class NcMenuGroup extends NcBaseElement {
  static observedAttributes = ['label'];

  static styles = `
    :host {
      display: block;
    }

    .group__label {
      display: block;
      padding: var(--nc-spacing-2, 8px) var(--nc-spacing-3, 12px) var(--nc-spacing-1, 4px);
      font-family: var(--nc-font-family-sans);
      font-size: var(--nc-font-size-xs, 0.75rem);
      font-weight: var(--nc-font-weight-semibold, 600);
      color: var(--nc-color-neutral-400, #9ca3af);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      line-height: var(--nc-line-height-normal, 1.5);
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'group');
    const label = this.getStrAttr('label');
    if (label) this.setAttribute('aria-label', label);
  }

  protected render(): string {
    const label = this.getStrAttr('label');
    return `
      ${label ? `<span class="group__label">${label}</span>` : ''}
      <slot></slot>
    `;
  }
}

/* ── Register all four elements ── */
defineElement('nc-dropdown-menu', NcDropdownMenu);
defineElement('nc-menu-item', NcMenuItem);
defineElement('nc-menu-divider', NcMenuDivider);
defineElement('nc-menu-group', NcMenuGroup);
