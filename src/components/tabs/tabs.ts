import { NcBaseElement } from '../../core/base-element';
import { defineElement, uniqueId } from '../../utils/helpers';

/* ═══════════════════════════════════════════════════════════════════
   NcTab — Individual tab trigger (<nc-tab>)
   ═══════════════════════════════════════════════════════════════════ */

export class NcTab extends NcBaseElement {
  static observedAttributes = ['value', 'disabled', 'label', 'active'];

  private _id = uniqueId('nc-tab');

  static styles = `
    :host {
      display: inline-flex;
    }

    .tab {
      display: inline-flex;
      align-items: center;
      gap: var(--nc-spacing-2);
      padding: var(--nc-spacing-2) var(--nc-spacing-4);
      font-family: var(--nc-font-family-sans);
      font-size: var(--nc-font-size-sm);
      font-weight: var(--nc-font-weight-medium);
      line-height: var(--nc-line-height-normal);
      color: var(--nc-color-neutral-600);
      background: transparent;
      border: none;
      cursor: pointer;
      white-space: nowrap;
      user-select: none;
      position: relative;
      transition:
        color var(--nc-transition-fast),
        background-color var(--nc-transition-fast),
        border-color var(--nc-transition-fast),
        box-shadow var(--nc-transition-fast);
    }

    .tab:focus-visible {
      outline: none;
      box-shadow: var(--nc-focus-ring);
    }

    /* ─── Active ─── */
    .tab--active {
      color: var(--nc-color-primary-600);
      font-weight: var(--nc-font-weight-semibold);
    }

    /* ─── Disabled ─── */
    .tab--disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* ─── Hover ─── */
    .tab:hover:not(.tab--disabled):not(.tab--active) {
      color: var(--nc-color-neutral-900);
    }
  `;

  get tabId(): string {
    return this._id;
  }

  get panelId(): string {
    return `${this._id}-panel`;
  }

  protected render(): string {
    const active = this.getBoolAttr('active');
    const disabled = this.getBoolAttr('disabled');
    const label = this.getStrAttr('label');

    const classes = [
      'tab',
      active ? 'tab--active' : '',
      disabled ? 'tab--disabled' : '',
    ].filter(Boolean).join(' ');

    return `
      <button
        class="${classes}"
        part="base"
        role="tab"
        id="${this._id}"
        aria-selected="${active}"
        aria-controls="${this.panelId}"
        aria-disabled="${disabled}"
        tabindex="${active ? '0' : '-1'}"
      >
        ${label ? label : '<slot></slot>'}
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

  private _handleClick = () => {
    if (this.getBoolAttr('disabled')) return;
    this.emit('nc-tab-select', { value: this.getStrAttr('value') });
  };
}

/* ═══════════════════════════════════════════════════════════════════
   NcTabPanel — Tab content panel (<nc-tab-panel>)
   ═══════════════════════════════════════════════════════════════════ */

export class NcTabPanel extends NcBaseElement {
  static observedAttributes = ['value', 'active', 'lazy'];

  private _hasBeenActive = false;

  static styles = `
    :host {
      display: block;
    }

    :host([active]) .panel {
      display: block;
    }

    .panel {
      display: none;
      padding: var(--nc-spacing-4);
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    if (this.getBoolAttr('active')) {
      this._hasBeenActive = true;
    }
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'active' && newValue !== null) {
      this._hasBeenActive = true;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  protected render(): string {
    const active = this.getBoolAttr('active');
    const lazy = this.getBoolAttr('lazy');

    // Lazy rendering: don't mount content until first activation
    const shouldRender = !lazy || this._hasBeenActive;

    return `
      <div
        class="panel"
        part="base"
        role="tabpanel"
        aria-labelledby=""
        ${!active ? 'hidden' : ''}
      >${shouldRender ? '<slot></slot>' : ''}</div>
    `;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   NcTabs — Tab container with variant support (<nc-tabs>)
   ═══════════════════════════════════════════════════════════════════ */

export class NcTabs extends NcBaseElement {
  static observedAttributes = ['variant', 'value'];

  static styles = `
    :host {
      display: block;
    }

    /* ─── Tab List ─── */
    .tabs__nav {
      display: flex;
      align-items: center;
      gap: 0;
      position: relative;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .tabs__nav::-webkit-scrollbar {
      display: none;
    }

    /* ─── Indicator (line variant) ─── */
    .tabs__indicator {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      background-color: var(--nc-color-primary-600);
      transition:
        left var(--nc-transition-fast),
        width var(--nc-transition-fast);
      border-radius: var(--nc-radius-full);
      pointer-events: none;
    }

    /* ─── Variant: Line ─── */
    .tabs__nav--line {
      border-bottom: 1px solid var(--nc-color-neutral-200);
    }

    /* ─── Variant: Enclosed ─── */
    .tabs__nav--enclosed {
      background-color: var(--nc-color-neutral-100);
      border: 1px solid var(--nc-color-neutral-200);
      border-radius: var(--nc-radius-md);
      padding: var(--nc-spacing-1);
      gap: var(--nc-spacing-1);
    }

    :host([variant="enclosed"]) ::slotted(nc-tab) {
      --_tab-radius: var(--nc-radius-sm);
    }

    /* ─── Variant: Pills ─── */
    .tabs__nav--pills {
      gap: var(--nc-spacing-1);
    }

    :host([variant="pills"]) ::slotted(nc-tab) {
      --_tab-radius: var(--nc-radius-full);
    }

    /* ─── Panels ─── */
    .tabs__panels {
      display: block;
    }
  `;

  private _tabIds = new Map<string, string>();
  private _panelIds = new Map<string, string>();

  connectedCallback() {
    super.connectedCallback();
    // Set initial active tab if value isn't set
    if (!this.hasAttribute('value')) {
      const firstTab = this.querySelector('nc-tab:not([disabled])') as NcTab | null;
      if (firstTab) {
        this.setAttribute('value', firstTab.getStrAttr('value'));
      }
    }
    this._syncTabs();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'value' && oldValue !== newValue) {
      this._syncTabs();
    }
  }

  protected render(): string {
    const variant = this.getStrAttr('variant', 'line');

    return `
      <div class="tabs" part="base">
        <div
          class="tabs__nav tabs__nav--${variant}"
          role="tablist"
          part="nav"
        >
          <slot name="tab"></slot>
          ${variant === 'line' ? '<div class="tabs__indicator" part="indicator"></div>' : ''}
        </div>
        <div class="tabs__panels" part="panels">
          <slot></slot>
        </div>
      </div>
    `;
  }

  protected afterRender(): void {
    this.addEventListener('nc-tab-select', this._handleTabSelect as EventListener);
    this.addEventListener('keydown', this._handleKeydown);
    // Wait a frame for slotted children to be ready
    requestAnimationFrame(() => this._syncTabs());
  }

  protected _cleanup(): void {
    this.removeEventListener('nc-tab-select', this._handleTabSelect as EventListener);
    this.removeEventListener('keydown', this._handleKeydown);
  }

  /* ─── Tab Synchronization ─── */

  private _syncTabs() {
    const activeValue = this.getStrAttr('value');
    const tabs = this._getTabs();
    const panels = this._getPanels();

    // Generate and cache stable IDs for aria linkage
    tabs.forEach((tab) => {
      const val = tab.getStrAttr('value');
      if (!this._tabIds.has(val)) {
        this._tabIds.set(val, tab.tabId);
        this._panelIds.set(val, tab.panelId);
      }
    });

    tabs.forEach((tab) => {
      const val = tab.getStrAttr('value');
      const isActive = val === activeValue;
      tab.setBoolAttr('active', isActive);
    });

    panels.forEach((panel) => {
      const val = panel.getStrAttr('value');
      const isActive = val === activeValue;
      panel.setBoolAttr('active', isActive);

      // Set aria-labelledby on the panel
      const tabId = this._tabIds.get(val);
      if (tabId) {
        const panelDiv = panel.shadowRoot?.querySelector('[role="tabpanel"]');
        if (panelDiv) {
          panelDiv.setAttribute('aria-labelledby', tabId);
        }
      }
    });

    // Update line indicator position
    if (this.getStrAttr('variant', 'line') === 'line') {
      this._updateIndicator(activeValue);
    }
  }

  private _updateIndicator(activeValue: string) {
    const indicator = this.shadow.querySelector('.tabs__indicator') as HTMLElement | null;
    if (!indicator) return;

    const activeTab = this._getTabs().find(
      (t) => t.getStrAttr('value') === activeValue
    );

    if (!activeTab) {
      indicator.style.width = '0';
      return;
    }

    const nav = this.shadow.querySelector('.tabs__nav') as HTMLElement;
    const navRect = nav.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();

    indicator.style.left = `${tabRect.left - navRect.left + nav.scrollLeft}px`;
    indicator.style.width = `${tabRect.width}px`;
  }

  /* ─── Event Handlers ─── */

  private _handleTabSelect = (e: CustomEvent<{ value: string }>) => {
    e.stopPropagation();
    const value = e.detail.value;
    if (value === this.getStrAttr('value')) return;

    this.setStrAttr('value', value);
    this._syncTabs();
    this.emit('nc-tab-change', { value });
  };

  private _handleKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

    const tabs = this._getTabs().filter((t) => !t.getBoolAttr('disabled'));
    if (tabs.length === 0) return;

    const activeValue = this.getStrAttr('value');
    const currentIndex = tabs.findIndex((t) => t.getStrAttr('value') === activeValue);
    if (currentIndex === -1) return;

    e.preventDefault();

    let nextIndex: number;
    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    }

    const nextTab = tabs[nextIndex];
    const nextValue = nextTab.getStrAttr('value');

    this.setStrAttr('value', nextValue);
    this._syncTabs();
    this.emit('nc-tab-change', { value: nextValue });

    // Focus the newly active tab's button
    const btn = nextTab.shadowRoot?.querySelector('button');
    if (btn) btn.focus();
  };

  /* ─── Helpers ─── */

  private _getTabs(): NcTab[] {
    return Array.from(this.querySelectorAll('nc-tab'));
  }

  private _getPanels(): NcTabPanel[] {
    return Array.from(this.querySelectorAll('nc-tab-panel'));
  }
}

/* ═══════════════════════════════════════════════════════════════════
   Registration
   ═══════════════════════════════════════════════════════════════════ */

defineElement('nc-tab', NcTab);
defineElement('nc-tab-panel', NcTabPanel);
defineElement('nc-tabs', NcTabs);
