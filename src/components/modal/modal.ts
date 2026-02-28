import { NcBaseElement } from '../../core/base-element';
import { defineElement, uniqueId } from '../../utils/helpers';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export class NcModal extends NcBaseElement {
  static observedAttributes = ['open', 'size', 'close-on-escape', 'close-on-overlay'];

  static styles = `
    :host {
      display: contents;
    }

    /* ─── Overlay ─── */
    .nc-modal-overlay {
      position: fixed;
      inset: 0;
      z-index: var(--nc-z-modal, 1050);
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(2px);
      opacity: 0;
      visibility: hidden;
      transition: opacity 250ms ease, visibility 250ms ease;
    }

    :host([open]) .nc-modal-overlay {
      opacity: 1;
      visibility: visible;
    }

    /* ─── Panel ─── */
    .nc-modal-panel {
      position: relative;
      display: flex;
      flex-direction: column;
      max-height: calc(100vh - 2rem);
      width: 100%;
      margin: var(--nc-spacing-4, 1rem);
      border-radius: var(--nc-radius-xl, 0.75rem);
      background: var(--nc-color-neutral-50, #fafafa);
      box-shadow: var(--nc-shadow-xl);
      overflow: hidden;
      transform: scale(0.95) translateY(8px);
      opacity: 0;
      transition: transform 250ms cubic-bezier(0.32, 0.72, 0, 1),
                  opacity 200ms ease;
    }

    :host([open]) .nc-modal-panel {
      transform: scale(1) translateY(0);
      opacity: 1;
    }

    /* ─── Size presets ─── */
    .nc-modal-panel[data-size="sm"]   { max-width: 400px; }
    .nc-modal-panel[data-size="md"]   { max-width: 500px; }
    .nc-modal-panel[data-size="lg"]   { max-width: 640px; }
    .nc-modal-panel[data-size="xl"]   { max-width: 800px; }
    .nc-modal-panel[data-size="full"] {
      max-width: 100vw;
      max-height: 100vh;
      height: 100vh;
      margin: 0;
      border-radius: 0;
    }

    /* ─── Sections ─── */
    .nc-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--nc-spacing-5, 1.25rem) var(--nc-spacing-6, 1.5rem);
      border-bottom: 1px solid var(--nc-color-neutral-200, #e5e5e5);
      font-family: var(--nc-font-family-sans);
      font-size: var(--nc-font-size-lg, 1.125rem);
      font-weight: var(--nc-font-weight-semibold, 600);
      line-height: var(--nc-line-height-tight, 1.25);
      color: var(--nc-color-neutral-900, #171717);
    }

    .nc-modal-body {
      flex: 1 1 auto;
      padding: var(--nc-spacing-6, 1.5rem);
      overflow-y: auto;
      font-family: var(--nc-font-family-sans);
      font-size: var(--nc-font-size-md, 1rem);
      line-height: var(--nc-line-height-normal, 1.5);
      color: var(--nc-color-neutral-700, #404040);
    }

    .nc-modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--nc-spacing-3, 0.75rem);
      padding: var(--nc-spacing-4, 1rem) var(--nc-spacing-6, 1.5rem);
      border-top: 1px solid var(--nc-color-neutral-200, #e5e5e5);
    }

    /* Hide empty header/footer when slots are unused */
    .nc-modal-header:not(:has(::slotted(*))) { display: none; }
    .nc-modal-footer:not(:has(::slotted(*))) { display: none; }

    /* ─── Responsive ─── */
    @media (max-width: 640px) {
      .nc-modal-panel[data-size="sm"],
      .nc-modal-panel[data-size="md"],
      .nc-modal-panel[data-size="lg"],
      .nc-modal-panel[data-size="xl"] {
        max-width: calc(100vw - 2rem);
      }
    }
  `;

  private _titleId = uniqueId('nc-modal-title');
  private _triggerEl: HTMLElement | null = null;

  private _handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this._closeOnEscape) {
      e.stopPropagation();
      this.close();
      return;
    }
    if (e.key === 'Tab') {
      this._trapFocus(e);
    }
  };

  private _handleOverlayClick = (e: MouseEvent) => {
    if (this._closeOnOverlay && (e.target as Element)?.classList.contains('nc-modal-overlay')) {
      this.close();
    }
  };

  private get _size(): string {
    return this.getStrAttr('size', 'md');
  }

  private get _closeOnEscape(): boolean {
    return !this.hasAttribute('close-on-escape') || this.getAttribute('close-on-escape') !== 'false';
  }

  private get _closeOnOverlay(): boolean {
    return !this.hasAttribute('close-on-overlay') || this.getAttribute('close-on-overlay') !== 'false';
  }

  protected render(): string {
    const size = this._size;

    return `
      <div class="nc-modal-overlay" part="overlay">
        <div
          class="nc-modal-panel"
          part="panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="${this._titleId}"
          data-size="${size}"
          tabindex="-1"
        >
          <div class="nc-modal-header" id="${this._titleId}" part="header">
            <slot name="header"></slot>
          </div>
          <div class="nc-modal-body" part="body">
            <slot></slot>
          </div>
          <div class="nc-modal-footer" part="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    `;
  }

  protected afterRender(): void {
    const overlay = this.shadow.querySelector('.nc-modal-overlay');
    if (!overlay) return;

    overlay.addEventListener('click', this._handleOverlayClick as EventListener);
    overlay.addEventListener('keydown', this._handleKeydown as EventListener);

    if (this.getBoolAttr('open')) {
      this._onOpen();
    }
  }

  protected _cleanup(): void {
    const overlay = this.shadow.querySelector('.nc-modal-overlay');
    if (overlay) {
      overlay.removeEventListener('click', this._handleOverlayClick as EventListener);
      overlay.removeEventListener('keydown', this._handleKeydown as EventListener);
    }
    this._unlockScroll();
  }

  // ─── Public API ────────────────────────────────────────────

  public open(): void {
    if (this.getBoolAttr('open')) return;
    this._triggerEl = document.activeElement as HTMLElement | null;
    this.setBoolAttr('open', true);
  }

  public close(): void {
    if (!this.getBoolAttr('open')) return;
    this.setBoolAttr('open', false);
  }

  // ─── Attribute change hook ─────────────────────────────────

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === 'open' && oldValue !== newValue) {
      if (newValue !== null) {
        this._triggerEl = this._triggerEl ?? (document.activeElement as HTMLElement | null);
        // Defer so the render cycle completes before focusing
        requestAnimationFrame(() => this._onOpen());
      } else {
        this._onClose();
      }
    }
  }

  // ─── Internal ──────────────────────────────────────────────

  private _onOpen(): void {
    this._lockScroll();
    this.emit('nc-open');

    // Focus the panel so keyboard events are captured
    requestAnimationFrame(() => {
      const panel = this.shadow.querySelector<HTMLElement>('.nc-modal-panel');
      panel?.focus({ preventScroll: true });
    });
  }

  private _onClose(): void {
    this._unlockScroll();
    this.emit('nc-close');

    // Return focus to the element that triggered the modal
    if (this._triggerEl && typeof this._triggerEl.focus === 'function') {
      this._triggerEl.focus({ preventScroll: true });
      this._triggerEl = null;
    }
  }

  private _trapFocus(e: KeyboardEvent): void {
    const panel = this.shadow.querySelector<HTMLElement>('.nc-modal-panel');
    if (!panel) return;

    // Gather focusable elements from both shadow DOM and slotted light DOM
    const shadowFocusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
    const slotted = Array.from(this.querySelectorAll<HTMLElement>(FOCUSABLE));
    const focusable = [...shadowFocusable, ...slotted].filter(
      (el) => el.offsetParent !== null // visible
    );

    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    // Determine the currently focused element (may be in shadow or light DOM)
    const active = this.shadow.activeElement ?? document.activeElement;

    if (e.shiftKey) {
      if (active === first || !focusable.includes(active as HTMLElement)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (active === last || !focusable.includes(active as HTMLElement)) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  private _lockScroll(): void {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
  }

  private _unlockScroll(): void {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
}

defineElement('nc-modal', NcModal);
