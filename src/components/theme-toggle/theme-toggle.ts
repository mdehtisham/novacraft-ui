import { NcBaseElement } from '../../core/base-element';
import { defineElement } from '../../utils/helpers';

type ThemeMode = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'nc-theme';

export class NcThemeToggle extends NcBaseElement {
  static observedAttributes = ['mode', 'persist'];

  static styles = `
    :host {
      display: inline-block;
    }

    .toggle {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      padding: 0;
      border: 1px solid var(--nc-color-neutral-200);
      border-radius: var(--nc-radius-full);
      background-color: var(--nc-color-neutral-50);
      color: var(--nc-color-neutral-700);
      cursor: pointer;
      transition:
        background-color var(--nc-transition-fast),
        border-color var(--nc-transition-fast),
        color var(--nc-transition-fast),
        box-shadow var(--nc-transition-fast);
    }

    .toggle:hover {
      background-color: var(--nc-color-neutral-100);
      border-color: var(--nc-color-neutral-300);
      box-shadow: var(--nc-shadow-sm);
    }

    .toggle:active {
      background-color: var(--nc-color-neutral-200);
    }

    .toggle:focus-visible {
      outline: none;
      box-shadow: var(--nc-focus-ring-offset);
    }

    /* ─── Icon Container ─── */
    .toggle__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.25rem;
      height: 1.25rem;
      transition:
        transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
        opacity 0.25s ease;
    }

    .toggle__icon svg {
      width: 100%;
      height: 100%;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    /* ─── Sun → Moon Transition ─── */
    :host([resolved="dark"]) .toggle__icon {
      transform: rotate(360deg);
    }

    :host([resolved="light"]) .toggle__icon {
      transform: rotate(0deg);
    }

    /* ─── Dark-mode Host Styling ─── */
    :host([resolved="dark"]) .toggle {
      background-color: var(--nc-color-neutral-800, #262626);
      border-color: var(--nc-color-neutral-600, #525252);
      color: var(--nc-color-neutral-100, #f5f5f5);
    }

    :host([resolved="dark"]) .toggle:hover {
      background-color: var(--nc-color-neutral-700, #404040);
      border-color: var(--nc-color-neutral-500, #737373);
    }

    :host([resolved="dark"]) .toggle:active {
      background-color: var(--nc-color-neutral-600, #525252);
    }
  `;

  private _mediaQuery: MediaQueryList | null = null;
  private _mediaHandler = () => this._applyTheme();

  get mode(): ThemeMode {
    const m = this.getStrAttr('mode', 'system');
    return (m === 'light' || m === 'dark' || m === 'system') ? m : 'system';
  }

  set mode(value: ThemeMode) {
    this.setStrAttr('mode', value);
  }

  get persist(): boolean {
    return this.getBoolAttr('persist');
  }

  connectedCallback() {
    super.connectedCallback();
    this._restoreFromStorage();
    this._mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this._mediaQuery.addEventListener('change', this._mediaHandler);
    this._applyTheme();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._mediaQuery?.removeEventListener('change', this._mediaHandler);
  }

  protected render(): string {
    const resolved = this._resolveTheme();
    const label = resolved === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

    const sunSvg = `<svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>`;

    const moonSvg = `<svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>`;

    return `
      <button class="toggle" part="base" aria-label="${label}">
        <span class="toggle__icon">
          ${resolved === 'dark' ? moonSvg : sunSvg}
        </span>
      </button>
    `;
  }

  protected afterRender(): void {
    this.shadow.querySelector('button')?.addEventListener('click', this._handleClick);
  }

  protected _cleanup(): void {
    this.shadow.querySelector('button')?.removeEventListener('click', this._handleClick);
  }

  private _handleClick = () => {
    const next = this._resolveTheme() === 'dark' ? 'light' : 'dark';
    this.mode = next;
    this._applyTheme();
    if (this.persist) {
      try { localStorage.setItem(STORAGE_KEY, next); } catch { /* storage unavailable */ }
    }
  };

  private _resolveTheme(): ResolvedTheme {
    if (this.mode === 'light' || this.mode === 'dark') return this.mode;
    // system mode: follow prefers-color-scheme
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private _applyTheme(): void {
    const resolved = this._resolveTheme();
    document.documentElement.setAttribute('data-theme', resolved);
    this.setAttribute('resolved', resolved);
    this.emit('nc-theme-change', { theme: resolved });
  }

  private _restoreFromStorage(): void {
    if (!this.persist) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        this.mode = stored;
      }
    } catch { /* storage unavailable */ }
  }
}

defineElement('nc-theme-toggle', NcThemeToggle);
