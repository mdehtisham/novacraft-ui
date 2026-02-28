import { NcBaseElement } from '../../core/base-element';
import { defineElement, debounce } from '../../utils/helpers';

export class NcSearchInput extends NcBaseElement {
  static observedAttributes = ['value', 'placeholder', 'debounce', 'loading', 'disabled'];

  static styles = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    :host {
      display: block;
      font-family: var(--nc-font-family-sans);
    }

    /* ─── Input Wrapper ─── */
    .search {
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

    .search:focus-within {
      border-color: var(--nc-color-primary-500);
      box-shadow: var(--nc-focus-ring-offset);
    }

    .search--disabled {
      background-color: var(--nc-color-neutral-100);
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* ─── Search Icon ─── */
    .search__icon {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
      color: var(--nc-color-neutral-400);
      pointer-events: none;
    }

    .search__icon svg {
      width: 16px;
      height: 16px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    /* ─── Native Input ─── */
    .search__control {
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

    .search__control::placeholder {
      color: var(--nc-color-neutral-400);
    }

    .search__control:disabled {
      cursor: not-allowed;
    }

    /* ─── Clear Button ─── */
    .search__clear {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      padding: 0;
      margin: 0;
      border: none;
      border-radius: var(--nc-radius-full);
      background: transparent;
      color: var(--nc-color-neutral-400);
      cursor: pointer;
      opacity: 0;
      transition:
        opacity var(--nc-transition-fast),
        color var(--nc-transition-fast),
        background-color var(--nc-transition-fast);
    }

    .search__clear svg {
      width: 14px;
      height: 14px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .search__clear--visible {
      opacity: 1;
    }

    .search__clear:hover {
      color: var(--nc-color-neutral-700);
      background-color: var(--nc-color-neutral-100);
    }

    .search__clear:focus-visible {
      opacity: 1;
      outline: 2px solid var(--nc-color-primary-500);
      outline-offset: 1px;
    }

    /* ─── Loading Spinner ─── */
    .search__spinner {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
    }

    .search__spinner::after {
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      border: 2px solid var(--nc-color-neutral-300);
      border-top-color: var(--nc-color-primary-500);
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      box-sizing: border-box;
    }
  `;

  private _debouncedEmit: ((value: string) => void) | null = null;
  private _debounceMs = 300;

  protected render(): string {
    const value = this.getStrAttr('value');
    const placeholder = this.getStrAttr('placeholder', 'Search\u2026');
    const loading = this.getBoolAttr('loading');
    const disabled = this.getBoolAttr('disabled');
    const hasValue = value.length > 0;

    const wrapperClasses = [
      'search',
      disabled ? 'search--disabled' : '',
    ].filter(Boolean).join(' ');

    const clearClasses = [
      'search__clear',
      hasValue ? 'search__clear--visible' : '',
    ].filter(Boolean).join(' ');

    return `
      <div class="${wrapperClasses}" part="base">
        <span class="search__icon" part="icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <input
          class="search__control"
          part="input"
          type="search"
          ${placeholder ? `placeholder="${placeholder}"` : ''}
          ${disabled ? 'disabled' : ''}
          aria-label="${placeholder}"
        />
        <button
          class="${clearClasses}"
          part="clear"
          type="button"
          aria-label="Clear search"
          ${disabled ? 'disabled' : ''}
          tabindex="-1"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        ${loading ? '<span class="search__spinner" role="status" aria-label="Loading" part="spinner"></span>' : ''}
      </div>
    `;
  }

  protected afterRender(): void {
    const input = this.shadow.querySelector<HTMLInputElement>('.search__control');
    const clearBtn = this.shadow.querySelector<HTMLButtonElement>('.search__clear');
    if (!input) return;

    // Sync value attribute to input element
    const value = this.getStrAttr('value');
    if (value) {
      input.value = value;
    }

    // Rebuild debounced emitter when debounce attribute changes
    this._debounceMs = this.getNumAttr('debounce', 300);
    this._debouncedEmit = debounce((val: string) => {
      this.emit('nc-search', { value: val });
    }, this._debounceMs);

    input.addEventListener('input', this._handleInput);
    clearBtn?.addEventListener('click', this._handleClear);
  }

  protected _cleanup(): void {
    const input = this.shadow.querySelector<HTMLInputElement>('.search__control');
    const clearBtn = this.shadow.querySelector<HTMLButtonElement>('.search__clear');

    input?.removeEventListener('input', this._handleInput);
    clearBtn?.removeEventListener('click', this._handleClear);
    this._debouncedEmit = null;
  }

  private _handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const val = target.value;

    // Toggle clear button visibility
    const clearBtn = this.shadow.querySelector<HTMLButtonElement>('.search__clear');
    if (clearBtn) {
      clearBtn.classList.toggle('search__clear--visible', val.length > 0);
    }

    this._debouncedEmit?.(val);
  };

  private _handleClear = () => {
    const input = this.shadow.querySelector<HTMLInputElement>('.search__control');
    if (!input) return;

    input.value = '';
    input.focus();

    // Hide clear button
    const clearBtn = this.shadow.querySelector<HTMLButtonElement>('.search__clear');
    clearBtn?.classList.remove('search__clear--visible');

    this.emit('nc-clear');
    this.emit('nc-search', { value: '' });
  };
}

defineElement('nc-search-input', NcSearchInput);
