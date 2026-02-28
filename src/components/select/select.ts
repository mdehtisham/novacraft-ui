import { NcBaseElement } from '../../core/base-element';
import { defineElement, uniqueId } from '../../utils/helpers';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export class NcSelect extends NcBaseElement {
  static observedAttributes = [
    'label', 'placeholder', 'value', 'error', 'hint',
    'required', 'disabled', 'searchable', 'options', 'name',
  ];

  static styles = `
    /* ─── Host ─── */
    :host {
      display: block;
      font-family: var(--nc-font-family-sans);
      position: relative;
    }
    :host([disabled]) {
      opacity: 0.5;
      pointer-events: none;
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    /* ─── Label ─── */
    .select__label {
      display: block;
      font-size: var(--nc-font-size-sm);
      font-weight: var(--nc-font-weight-medium);
      color: var(--nc-color-neutral-700);
      margin-bottom: var(--nc-spacing-1);
      line-height: var(--nc-line-height-normal);
    }
    .select__label--required::after {
      content: ' *';
      color: var(--nc-color-danger-500);
    }

    /* ─── Trigger button ─── */
    .select__trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      min-height: 2.5rem;
      padding: var(--nc-spacing-2) var(--nc-spacing-3);
      background: var(--nc-color-neutral-50);
      border: 1px solid var(--nc-color-neutral-300);
      border-radius: var(--nc-radius-md);
      font-family: inherit;
      font-size: var(--nc-font-size-sm);
      color: var(--nc-color-neutral-900);
      line-height: var(--nc-line-height-normal);
      cursor: pointer;
      outline: none;
      transition:
        border-color var(--nc-transition-fast),
        box-shadow var(--nc-transition-fast);
    }
    .select__trigger:hover:not(:disabled) {
      border-color: var(--nc-color-neutral-400);
    }
    .select__trigger:focus-visible {
      border-color: var(--nc-color-primary-500);
      box-shadow: var(--nc-focus-ring);
    }
    .select__trigger--open {
      border-color: var(--nc-color-primary-500);
      box-shadow: var(--nc-focus-ring);
    }
    .select__trigger--error {
      border-color: var(--nc-color-danger-500);
    }
    .select__trigger--error:focus-visible,
    .select__trigger--error.select__trigger--open {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.4);
    }
    .select__trigger:disabled {
      cursor: not-allowed;
    }

    /* ─── Value / Placeholder ─── */
    .select__value {
      flex: 1;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .select__placeholder {
      color: var(--nc-color-neutral-400);
    }

    /* ─── Chevron ─── */
    .select__chevron {
      flex-shrink: 0;
      width: 1rem;
      height: 1rem;
      margin-left: var(--nc-spacing-2);
      color: var(--nc-color-neutral-400);
      transition: transform var(--nc-transition-fast);
    }
    .select__chevron--open {
      transform: rotate(180deg);
    }

    /* ─── Dropdown panel ─── */
    .select__dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin-top: var(--nc-spacing-1);
      background: var(--nc-color-neutral-50);
      border: 1px solid var(--nc-color-neutral-200);
      border-radius: var(--nc-radius-md);
      box-shadow: var(--nc-shadow-lg);
      z-index: var(--nc-z-dropdown);
      overflow: hidden;
      opacity: 0;
      transform: translateY(-4px);
      pointer-events: none;
      transition:
        opacity var(--nc-transition-fast),
        transform var(--nc-transition-fast);
    }
    .select__dropdown--open {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    /* ─── Search input ─── */
    .select__search {
      padding: var(--nc-spacing-2);
      border-bottom: 1px solid var(--nc-color-neutral-200);
    }
    .select__search-input {
      width: 100%;
      padding: var(--nc-spacing-2) var(--nc-spacing-3);
      border: 1px solid var(--nc-color-neutral-300);
      border-radius: var(--nc-radius-md);
      font-family: inherit;
      font-size: var(--nc-font-size-sm);
      color: var(--nc-color-neutral-900);
      background: var(--nc-color-neutral-50);
      outline: none;
      transition:
        border-color var(--nc-transition-fast),
        box-shadow var(--nc-transition-fast);
    }
    .select__search-input::placeholder {
      color: var(--nc-color-neutral-400);
    }
    .select__search-input:focus {
      border-color: var(--nc-color-primary-500);
      box-shadow: var(--nc-focus-ring);
    }

    /* ─── Listbox ─── */
    .select__listbox {
      list-style: none;
      margin: 0;
      padding: var(--nc-spacing-1) 0;
      max-height: 15rem;
      overflow-y: auto;
    }

    /* ─── Option ─── */
    .select__option {
      display: flex;
      align-items: center;
      padding: var(--nc-spacing-2) var(--nc-spacing-3);
      font-size: var(--nc-font-size-sm);
      color: var(--nc-color-neutral-800);
      cursor: pointer;
      transition: background-color var(--nc-transition-fast);
    }
    .select__option--highlighted {
      background-color: var(--nc-color-primary-50);
      color: var(--nc-color-primary-700);
    }
    .select__option--selected {
      font-weight: var(--nc-font-weight-medium);
      color: var(--nc-color-primary-600);
    }
    .select__option--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* ─── Checkmark icon ─── */
    .select__option-check {
      flex-shrink: 0;
      width: 1rem;
      height: 1rem;
      margin-right: var(--nc-spacing-2);
      visibility: hidden;
    }
    .select__option--selected .select__option-check {
      visibility: visible;
    }

    .select__option-label {
      flex: 1;
    }

    /* ─── Empty state ─── */
    .select__empty {
      padding: var(--nc-spacing-4);
      text-align: center;
      font-size: var(--nc-font-size-sm);
      color: var(--nc-color-neutral-400);
    }

    /* ─── Hint / Error messages ─── */
    .select__hint {
      display: block;
      font-size: var(--nc-font-size-xs);
      color: var(--nc-color-neutral-500);
      margin-top: var(--nc-spacing-1);
    }
    .select__error-msg {
      display: block;
      font-size: var(--nc-font-size-xs);
      color: var(--nc-color-danger-500);
      margin-top: var(--nc-spacing-1);
    }

    /* ─── Hidden native select for form name ─── */
    .select__hidden {
      position: absolute;
      width: 0;
      height: 0;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
    }
  `;

  /* ── Internal state ── */
  private _isOpen = false;
  private _highlightedIndex = -1;
  private _searchQuery = '';
  private _uid = uniqueId('nc-select');
  private _typeAheadBuffer = '';
  private _typeAheadTimer: ReturnType<typeof setTimeout> | null = null;

  /* ── Option helpers ── */

  private _parseOptions(): SelectOption[] {
    try {
      return JSON.parse(this.getStrAttr('options', '[]'));
    } catch {
      return [];
    }
  }

  private _getFilteredOptions(): SelectOption[] {
    const all = this._parseOptions();
    if (!this._searchQuery) return all;
    const q = this._searchQuery.toLowerCase();
    return all.filter(o => o.label.toLowerCase().includes(q));
  }

  private _getSelectedOption(): SelectOption | undefined {
    const val = this.getStrAttr('value');
    return this._parseOptions().find(o => o.value === val);
  }

  /* ── HTML helpers ── */

  private _esc(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ═══════════════════════════════════════════════════════════════
     Template
     ═══════════════════════════════════════════════════════════════ */

  protected render(): string {
    const label       = this.getStrAttr('label');
    const placeholder = this.getStrAttr('placeholder', 'Select an option');
    const error       = this.getStrAttr('error');
    const hint        = this.getStrAttr('hint');
    const required    = this.getBoolAttr('required');
    const disabled    = this.getBoolAttr('disabled');
    const searchable  = this.getBoolAttr('searchable');
    const name        = this.getStrAttr('name');
    const value       = this.getStrAttr('value');

    const selected = this._getSelectedOption();
    const filtered = this._getFilteredOptions();
    const uid      = this._uid;
    const listboxId = `${uid}-listbox`;

    /* Label */
    const labelHtml = label
      ? `<label class="select__label${required ? ' select__label--required' : ''}"
               id="${uid}-label">${this._esc(label)}</label>`
      : '';

    /* Search box (only when searchable) */
    const searchHtml = searchable
      ? `<div class="select__search">
           <input type="text" class="select__search-input"
                  placeholder="Search..." aria-label="Search options"
                  autocomplete="off" />
         </div>`
      : '';

    /* Options */
    const optionsHtml = filtered.length
      ? filtered.map((opt, i) => {
          const isSel = opt.value === value;
          const isHi  = i === this._highlightedIndex;
          const isDis = opt.disabled === true;
          const cls = [
            'select__option',
            isSel && 'select__option--selected',
            isHi  && 'select__option--highlighted',
            isDis && 'select__option--disabled',
          ].filter(Boolean).join(' ');

          return `<li class="${cls}" id="${uid}-opt-${i}" role="option"
                      aria-selected="${isSel}"
                      ${isDis ? 'aria-disabled="true"' : ''}
                      data-value="${this._esc(opt.value)}" data-index="${i}">
                    <svg class="select__option-check" viewBox="0 0 16 16" fill="none"
                         stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <polyline points="3 8 6.5 11.5 13 5"></polyline>
                    </svg>
                    <span class="select__option-label">${this._esc(opt.label)}</span>
                  </li>`;
        }).join('')
      : '<li class="select__empty" role="presentation">No options found</li>';

    /* Active-descendant */
    const activeDesc = this._isOpen && this._highlightedIndex >= 0
      ? `aria-activedescendant="${uid}-opt-${this._highlightedIndex}"`
      : '';

    /* Hidden native select for form name */
    const hiddenHtml = name
      ? `<select class="select__hidden" tabindex="-1" aria-hidden="true"
                name="${this._esc(name)}">
           ${value
             ? `<option value="${this._esc(value)}" selected>${this._esc(selected?.label ?? value)}</option>`
             : '<option value=""></option>'}
         </select>`
      : '';

    return `
      <div class="select" part="base">
        ${labelHtml}
        <div class="select__control">
          <button type="button"
                  class="select__trigger${this._isOpen ? ' select__trigger--open' : ''}${error ? ' select__trigger--error' : ''}"
                  id="${uid}-trigger"
                  role="combobox"
                  aria-expanded="${this._isOpen}"
                  aria-haspopup="listbox"
                  aria-controls="${listboxId}"
                  ${activeDesc}
                  ${label ? `aria-labelledby="${uid}-label"` : ''}
                  ${disabled ? 'disabled' : ''}>
            <span class="select__value${!selected ? ' select__placeholder' : ''}">
              ${selected ? this._esc(selected.label) : this._esc(placeholder)}
            </span>
            <svg class="select__chevron${this._isOpen ? ' select__chevron--open' : ''}"
                 viewBox="0 0 16 16" fill="none" stroke="currentColor"
                 stroke-width="2" aria-hidden="true">
              <polyline points="4 6 8 10 12 6"></polyline>
            </svg>
          </button>

          <div class="select__dropdown${this._isOpen ? ' select__dropdown--open' : ''}">
            ${searchHtml}
            <ul class="select__listbox" id="${listboxId}" role="listbox"
                ${label ? `aria-labelledby="${uid}-label"` : ''} tabindex="-1">
              ${optionsHtml}
            </ul>
          </div>
        </div>
        ${hiddenHtml}
        ${error ? `<span class="select__error-msg" role="alert">${this._esc(error)}</span>` : ''}
        ${!error && hint ? `<span class="select__hint">${this._esc(hint)}</span>` : ''}
      </div>`;
  }

  /* ═══════════════════════════════════════════════════════════════
     Lifecycle
     ═══════════════════════════════════════════════════════════════ */

  protected afterRender(): void {
    const trigger     = this.shadow.querySelector('.select__trigger') as HTMLButtonElement | null;
    const searchInput = this.shadow.querySelector('.select__search-input') as HTMLInputElement | null;

    trigger?.addEventListener('click', this._onTriggerClick);
    trigger?.addEventListener('keydown', this._onKeydown);
    trigger?.addEventListener('focus', this._onFocus);
    trigger?.addEventListener('blur', this._onBlur);

    searchInput?.addEventListener('input', this._onSearchInput);
    searchInput?.addEventListener('keydown', this._onKeydown);

    this.shadow.querySelectorAll('.select__option').forEach(el => {
      el.addEventListener('click', this._onOptionClick);
      el.addEventListener('mouseenter', this._onOptionHover);
    });

    // Keep document listener in sync with open state
    document.removeEventListener('click', this._onDocumentClick, true);
    if (this._isOpen) {
      document.addEventListener('click', this._onDocumentClick, true);
      if (searchInput) {
        requestAnimationFrame(() => searchInput.focus());
      }
    }
  }

  protected _cleanup(): void {
    document.removeEventListener('click', this._onDocumentClick, true);
    if (this._typeAheadTimer) clearTimeout(this._typeAheadTimer);
  }

  /* ═══════════════════════════════════════════════════════════════
     Open / Close (imperative DOM updates)
     ═══════════════════════════════════════════════════════════════ */

  private _open(): void {
    if (this._isOpen || this.getBoolAttr('disabled')) return;
    this._isOpen = true;
    this._searchQuery = '';

    // Highlight the currently-selected option, or the first one
    const value = this.getStrAttr('value');
    const opts  = this._getFilteredOptions();
    const idx   = opts.findIndex(o => o.value === value);
    this._highlightedIndex = idx >= 0 ? idx : 0;

    this._syncDropdownDOM();
    document.addEventListener('click', this._onDocumentClick, true);

    requestAnimationFrame(() => {
      const searchInput = this.shadow.querySelector('.select__search-input') as HTMLInputElement | null;
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
    });
  }

  private _close(): void {
    if (!this._isOpen) return;
    this._isOpen = false;
    this._highlightedIndex = -1;
    this._searchQuery = '';
    this._syncDropdownDOM();
    document.removeEventListener('click', this._onDocumentClick, true);
  }

  /** Toggle classes / ARIA on the existing DOM without a full re-render. */
  private _syncDropdownDOM(): void {
    const trigger  = this.shadow.querySelector('.select__trigger') as HTMLElement | null;
    const dropdown = this.shadow.querySelector('.select__dropdown') as HTMLElement | null;
    const chevron  = this.shadow.querySelector('.select__chevron') as HTMLElement | null;
    if (!trigger || !dropdown || !chevron) return;

    trigger.setAttribute('aria-expanded', String(this._isOpen));
    trigger.classList.toggle('select__trigger--open', this._isOpen);
    dropdown.classList.toggle('select__dropdown--open', this._isOpen);
    chevron.classList.toggle('select__chevron--open', this._isOpen);

    if (this._isOpen) {
      if (this.getBoolAttr('searchable')) this._rebuildOptions();
      this._syncHighlight();
    } else {
      trigger.removeAttribute('aria-activedescendant');
    }
  }

  /** Rebuild listbox innerHTML (used for search filtering). */
  private _rebuildOptions(): void {
    const listbox = this.shadow.querySelector('.select__listbox') as HTMLElement | null;
    if (!listbox) return;

    const value    = this.getStrAttr('value');
    const filtered = this._getFilteredOptions();
    const uid      = this._uid;

    if (!filtered.length) {
      listbox.innerHTML = '<li class="select__empty" role="presentation">No options found</li>';
      return;
    }

    listbox.innerHTML = filtered.map((opt, i) => {
      const isSel = opt.value === value;
      const isHi  = i === this._highlightedIndex;
      const isDis = opt.disabled === true;
      const cls = [
        'select__option',
        isSel && 'select__option--selected',
        isHi  && 'select__option--highlighted',
        isDis && 'select__option--disabled',
      ].filter(Boolean).join(' ');

      return `<li class="${cls}" id="${uid}-opt-${i}" role="option"
                  aria-selected="${isSel}" ${isDis ? 'aria-disabled="true"' : ''}
                  data-value="${this._esc(opt.value)}" data-index="${i}">
                <svg class="select__option-check" viewBox="0 0 16 16" fill="none"
                     stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <polyline points="3 8 6.5 11.5 13 5"></polyline>
                </svg>
                <span class="select__option-label">${this._esc(opt.label)}</span>
              </li>`;
    }).join('');

    // Re-attach listeners on fresh option elements
    listbox.querySelectorAll('.select__option').forEach(el => {
      el.addEventListener('click', this._onOptionClick);
      el.addEventListener('mouseenter', this._onOptionHover);
    });
  }

  /** Update the highlighted class + aria-activedescendant. */
  private _syncHighlight(): void {
    const trigger = this.shadow.querySelector('.select__trigger') as HTMLElement | null;
    const items   = this.shadow.querySelectorAll('.select__option');

    items.forEach((el, i) => {
      const active = i === this._highlightedIndex;
      el.classList.toggle('select__option--highlighted', active);
      if (active) el.scrollIntoView({ block: 'nearest' });
    });

    if (trigger && this._highlightedIndex >= 0) {
      trigger.setAttribute('aria-activedescendant', `${this._uid}-opt-${this._highlightedIndex}`);
    } else if (trigger) {
      trigger.removeAttribute('aria-activedescendant');
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     Selection
     ═══════════════════════════════════════════════════════════════ */

  private _selectValue(val: string): void {
    const prev = this.getStrAttr('value');
    this._close();

    if (val !== prev) {
      this.setAttribute('value', val);          // triggers re-render
      this.emit('nc-change', { value: val });
    }

    // Return focus to the trigger after the render cycle
    requestAnimationFrame(() => {
      (this.shadow.querySelector('.select__trigger') as HTMLElement)?.focus();
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     Event handlers (arrow-function properties keep `this` bound)
     ═══════════════════════════════════════════════════════════════ */

  private _onTriggerClick = (): void => {
    this._isOpen ? this._close() : this._open();
  };

  private _onDocumentClick = (e: Event): void => {
    if (!e.composedPath().includes(this)) this._close();
  };

  private _onFocus = (): void => { this.emit('nc-focus'); };
  private _onBlur  = (): void => { this.emit('nc-blur'); };

  private _onOptionClick = (e: Event): void => {
    const li = (e.target as HTMLElement).closest('.select__option') as HTMLElement | null;
    if (!li || li.getAttribute('aria-disabled') === 'true') return;
    const val = li.dataset.value;
    if (val !== undefined) this._selectValue(val);
  };

  private _onOptionHover = (e: Event): void => {
    const li = (e.target as HTMLElement).closest('.select__option') as HTMLElement | null;
    if (!li) return;
    const idx = parseInt(li.dataset.index ?? '-1', 10);
    if (idx >= 0) {
      this._highlightedIndex = idx;
      this._syncHighlight();
    }
  };

  private _onSearchInput = (e: Event): void => {
    this._searchQuery = (e.target as HTMLInputElement).value;
    this._highlightedIndex = 0;
    this._rebuildOptions();
  };

  /* ─── Keyboard ─── */

  private _onKeydown = (e: KeyboardEvent): void => {
    const filtered = this._getFilteredOptions();
    const count    = filtered.length;

    switch (e.key) {
      /* ── Arrow Down ── */
      case 'ArrowDown': {
        e.preventDefault();
        if (!this._isOpen) { this._open(); return; }
        if (!count) return;
        let next = this._highlightedIndex;
        for (let i = 0; i < count; i++) {
          next = (next + 1) % count;
          if (!filtered[next]?.disabled) break;
        }
        this._highlightedIndex = next;
        this._syncHighlight();
        return;
      }

      /* ── Arrow Up ── */
      case 'ArrowUp': {
        e.preventDefault();
        if (!this._isOpen) { this._open(); return; }
        if (!count) return;
        let prev = this._highlightedIndex;
        for (let i = 0; i < count; i++) {
          prev = (prev - 1 + count) % count;
          if (!filtered[prev]?.disabled) break;
        }
        this._highlightedIndex = prev;
        this._syncHighlight();
        return;
      }

      /* ── Home / End ── */
      case 'Home':
        if (this._isOpen && count) {
          e.preventDefault();
          this._highlightedIndex = 0;
          this._syncHighlight();
        }
        return;
      case 'End':
        if (this._isOpen && count) {
          e.preventDefault();
          this._highlightedIndex = count - 1;
          this._syncHighlight();
        }
        return;

      /* ── Enter ── */
      case 'Enter':
        e.preventDefault();
        if (this._isOpen) {
          const opt = filtered[this._highlightedIndex];
          if (opt && !opt.disabled) this._selectValue(opt.value);
        } else {
          this._open();
        }
        return;

      /* ── Space ── */
      case ' ':
        // Let space type normally inside the search input
        if ((e.target as HTMLElement)?.classList.contains('select__search-input')) return;
        e.preventDefault();
        if (this._isOpen) {
          const opt = filtered[this._highlightedIndex];
          if (opt && !opt.disabled) this._selectValue(opt.value);
        } else {
          this._open();
        }
        return;

      /* ── Escape ── */
      case 'Escape':
        if (this._isOpen) {
          e.preventDefault();
          this._close();
          (this.shadow.querySelector('.select__trigger') as HTMLElement)?.focus();
        }
        return;

      /* ── Tab ── */
      case 'Tab':
        if (this._isOpen) this._close();
        return;

      /* ── Type-ahead (non-searchable mode) ── */
      default:
        if (
          !this.getBoolAttr('searchable') &&
          e.key.length === 1 &&
          !e.ctrlKey && !e.metaKey && !e.altKey
        ) {
          this._handleTypeAhead(e.key);
        }
    }
  };

  private _handleTypeAhead(char: string): void {
    this._typeAheadBuffer += char.toLowerCase();
    if (this._typeAheadTimer) clearTimeout(this._typeAheadTimer);
    this._typeAheadTimer = setTimeout(() => { this._typeAheadBuffer = ''; }, 500);

    const filtered = this._getFilteredOptions();
    const idx = filtered.findIndex(
      o => !o.disabled && o.label.toLowerCase().startsWith(this._typeAheadBuffer),
    );

    if (idx >= 0) {
      if (!this._isOpen) this._open();
      this._highlightedIndex = idx;
      this._syncHighlight();
    }
  }
}

defineElement('nc-select', NcSelect);
