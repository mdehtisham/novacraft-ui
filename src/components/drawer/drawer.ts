import { NcBaseElement } from '../../core/base-element';
import { defineElement } from '../../utils/helpers';

type Placement = 'left' | 'right' | 'top' | 'bottom';
type Size = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const SIZE_MAP: Record<Size, string> = {
  sm: '280px',
  md: '360px',
  lg: '480px',
  xl: '640px',
  full: '100%',
};

export class NcDrawer extends NcBaseElement {
  static observedAttributes = ['open', 'placement', 'size', 'close-on-overlay', 'close-on-escape'];

  static styles = `
    :host {
      display: contents;
    }

    .drawer {
      position: fixed;
      inset: 0;
      z-index: var(--nc-z-modal, 1000);
      pointer-events: none;
      visibility: hidden;
    }

    .drawer--open {
      pointer-events: auto;
      visibility: visible;
    }

    /* ─── Overlay ─── */
    .drawer__overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      opacity: 0;
      transition: opacity 300ms ease;
    }

    .drawer--open .drawer__overlay {
      opacity: 1;
    }

    /* ─── Panel base ─── */
    .drawer__panel {
      position: absolute;
      display: flex;
      flex-direction: column;
      background: var(--nc-color-surface, #fff);
      box-shadow: var(--nc-shadow-lg, 0 10px 25px rgba(0, 0, 0, 0.15));
      overflow: hidden;
      transition: transform 300ms ease;
    }

    /* ─── Placement: left ─── */
    .drawer__panel--left {
      top: 0;
      left: 0;
      bottom: 0;
      transform: translateX(-100%);
    }

    /* ─── Placement: right ─── */
    .drawer__panel--right {
      top: 0;
      right: 0;
      bottom: 0;
      transform: translateX(100%);
    }

    /* ─── Placement: top ─── */
    .drawer__panel--top {
      top: 0;
      left: 0;
      right: 0;
      transform: translateY(-100%);
    }

    /* ─── Placement: bottom ─── */
    .drawer__panel--bottom {
      bottom: 0;
      left: 0;
      right: 0;
      transform: translateY(100%);
    }

    .drawer--open .drawer__panel {
      transform: translate(0, 0);
    }

    /* ─── Sections ─── */
    .drawer__header {
      display: flex;
      align-items: center;
      padding: var(--nc-spacing-4, 16px);
      border-bottom: 1px solid var(--nc-color-border, #e5e7eb);
    }

    .drawer__header:empty {
      display: none;
    }

    .drawer__body {
      flex: 1;
      padding: var(--nc-spacing-4, 16px);
      overflow-y: auto;
    }

    .drawer__footer {
      padding: var(--nc-spacing-4, 16px);
      border-top: 1px solid var(--nc-color-border, #e5e7eb);
    }

    .drawer__footer:empty {
      display: none;
    }
  `;

  private _previousFocus: HTMLElement | null = null;

  private get _placement(): Placement {
    const val = this.getStrAttr('placement', 'left');
    return (['left', 'right', 'top', 'bottom'].includes(val) ? val : 'left') as Placement;
  }

  private get _size(): Size {
    const val = this.getStrAttr('size', 'md');
    return (['sm', 'md', 'lg', 'xl', 'full'].includes(val) ? val : 'md') as Size;
  }

  private get _closeOnOverlay(): boolean {
    return !this.hasAttribute('close-on-overlay') || this.getAttribute('close-on-overlay') !== 'false';
  }

  private get _closeOnEscape(): boolean {
    return !this.hasAttribute('close-on-escape') || this.getAttribute('close-on-escape') !== 'false';
  }

  private get _isOpen(): boolean {
    return this.getBoolAttr('open');
  }

  // ─── Public API ────────────────────────────────────────────

  open(): void {
    if (!this._isOpen) {
      this._previousFocus = document.activeElement as HTMLElement | null;
      this.setAttribute('open', '');
    }
  }

  close(): void {
    if (this._isOpen) {
      this.removeAttribute('open');
    }
  }

  // ─── Render ────────────────────────────────────────────────

  protected render(): string {
    const placement = this._placement;
    const size = this._size;
    const isOpen = this._isOpen;
    const sizeValue = SIZE_MAP[size];
    const isHorizontal = placement === 'left' || placement === 'right';
    const sizeStyle = isHorizontal ? `width: ${sizeValue};` : `height: ${sizeValue};`;

    return `
      <div
        class="drawer${isOpen ? ' drawer--open' : ''}"
        role="dialog"
        aria-modal="true"
        aria-hidden="${!isOpen}"
      >
        <div class="drawer__overlay" part="overlay"></div>
        <div
          class="drawer__panel drawer__panel--${placement}"
          part="panel"
          style="${sizeStyle}"
          tabindex="-1"
        >
          <div class="drawer__header" part="header">
            <slot name="header"></slot>
          </div>
          <div class="drawer__body" part="body">
            <slot></slot>
          </div>
          <div class="drawer__footer" part="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    `;
  }

  protected afterRender(): void {
    const overlay = this.shadow.querySelector<HTMLElement>('.drawer__overlay');
    if (overlay) {
      overlay.addEventListener('click', this._handleOverlayClick);
    }

    document.addEventListener('keydown', this._handleKeydown);

    if (this._isOpen) {
      this._focusFirstElement();
    }
  }

  protected _cleanup(): void {
    document.removeEventListener('keydown', this._handleKeydown);
  }

  // ─── Attribute change handling ─────────────────────────────

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (name === 'open' && oldValue !== newValue) {
      if (newValue !== null) {
        this._previousFocus = this._previousFocus ?? (document.activeElement as HTMLElement | null);
        this.emit('nc-open');
      } else {
        this.emit('nc-close');
        this._restoreFocus();
      }
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  // ─── Event handlers ────────────────────────────────────────

  private _handleOverlayClick = (): void => {
    if (this._closeOnOverlay) {
      this.close();
    }
  };

  private _handleKeydown = (e: KeyboardEvent): void => {
    if (!this._isOpen) return;

    if (e.key === 'Escape' && this._closeOnEscape) {
      e.stopPropagation();
      this.close();
      return;
    }

    if (e.key === 'Tab') {
      this._trapFocus(e);
    }
  };

  // ─── Focus management ──────────────────────────────────────

  private _getFocusableElements(): HTMLElement[] {
    const panel = this.shadow.querySelector<HTMLElement>('.drawer__panel');
    if (!panel) return [];

    const selectors = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

    const shadowFocusable = Array.from(panel.querySelectorAll<HTMLElement>(selectors));

    const slots = panel.querySelectorAll('slot');
    const slotFocusable: HTMLElement[] = [];
    slots.forEach((slot) => {
      const assigned = slot.assignedElements({ flatten: true });
      assigned.forEach((el) => {
        if ((el as HTMLElement).matches?.(selectors)) {
          slotFocusable.push(el as HTMLElement);
        }
        const nested = (el as HTMLElement).querySelectorAll?.(selectors);
        if (nested) {
          slotFocusable.push(...Array.from(nested) as HTMLElement[]);
        }
      });
    });

    return [...shadowFocusable, ...slotFocusable];
  }

  private _focusFirstElement(): void {
    requestAnimationFrame(() => {
      const focusable = this._getFocusableElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        this.shadow.querySelector<HTMLElement>('.drawer__panel')?.focus();
      }
    });
  }

  private _trapFocus(e: KeyboardEvent): void {
    const focusable = this._getFocusableElements();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first || this.shadow.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last || this.shadow.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  private _restoreFocus(): void {
    requestAnimationFrame(() => {
      if (this._previousFocus && typeof this._previousFocus.focus === 'function') {
        this._previousFocus.focus();
        this._previousFocus = null;
      }
    });
  }
}

defineElement('nc-drawer', NcDrawer);
