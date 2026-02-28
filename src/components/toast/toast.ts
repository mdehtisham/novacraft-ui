import { NcBaseElement } from '../../core/base-element';
import { defineElement } from '../../utils/helpers';

const VARIANTS = ['success', 'error', 'warning', 'info'] as const;
type Variant = (typeof VARIANTS)[number];

const POSITIONS = [
  'top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center',
] as const;
type Position = (typeof POSITIONS)[number];

const ICONS: Record<Variant, string> = {
  success: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>`,
  error: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>`,
  warning: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>`,
  info: `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>`,
};

/* ════════════════════════════════════════════════════════════
   NcToast — Individual toast notification
   ════════════════════════════════════════════════════════════ */

export class NcToast extends NcBaseElement {
  static observedAttributes = ['variant', 'duration', 'message', 'dismissible'];

  static styles = `
    :host {
      display: block;
      pointer-events: auto;
      max-width: 24rem;
      width: 100%;
      animation: nc-toast-in 300ms ease forwards;
    }

    :host(.nc-toast-exit) {
      animation: nc-toast-out 200ms ease forwards;
    }

    @keyframes nc-toast-in {
      from { opacity: 0; transform: translateX(1rem); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes nc-toast-out {
      from { opacity: 1; transform: translateX(0); }
      to   { opacity: 0; transform: translateX(1rem); }
    }

    .toast {
      display: flex;
      align-items: flex-start;
      gap: var(--nc-spacing-3);
      padding: var(--nc-spacing-3) var(--nc-spacing-4);
      border-radius: var(--nc-radius-lg);
      box-shadow: var(--nc-shadow-lg);
      font-family: var(--nc-font-family-sans);
      font-size: var(--nc-font-size-sm);
      line-height: var(--nc-line-height-normal);
      position: relative;
      overflow: hidden;
      background: var(--nc-color-neutral-50);
      color: var(--nc-color-neutral-800);
      border: 1px solid var(--nc-color-neutral-200);
    }

    /* ─── Variant Colors ─── */
    .toast--success {
      background: var(--nc-color-success-50);
      border-color: var(--nc-color-success-500);
      color: var(--nc-color-success-700);
    }
    .toast--error {
      background: var(--nc-color-danger-50);
      border-color: var(--nc-color-danger-500);
      color: var(--nc-color-danger-700);
    }
    .toast--warning {
      background: var(--nc-color-warning-50);
      border-color: var(--nc-color-warning-500);
      color: var(--nc-color-warning-700);
    }
    .toast--info {
      background: var(--nc-color-info-50);
      border-color: var(--nc-color-info-500);
      color: var(--nc-color-info-700);
    }

    /* ─── Icon ─── */
    .toast__icon {
      flex-shrink: 0;
      width: 1.25rem;
      height: 1.25rem;
      margin-top: 0.0625rem;
    }
    .toast__icon svg {
      width: 100%;
      height: 100%;
    }

    /* ─── Content ─── */
    .toast__content {
      flex: 1;
      min-width: 0;
    }
    .toast__message {
      color: inherit;
    }
    .toast__actions {
      margin-top: var(--nc-spacing-2);
    }
    .toast__actions ::slotted(*) {
      font-size: var(--nc-font-size-sm);
      font-weight: var(--nc-font-weight-semibold);
      cursor: pointer;
    }

    /* ─── Close Button ─── */
    .toast__close {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.5rem;
      height: 1.5rem;
      border: none;
      background: none;
      border-radius: var(--nc-radius-md);
      cursor: pointer;
      color: inherit;
      opacity: 0.5;
      padding: 0;
      transition: opacity var(--nc-transition-fast),
                  background-color var(--nc-transition-fast);
    }
    .toast__close:hover {
      opacity: 1;
      background-color: rgba(0, 0, 0, 0.08);
    }
    .toast__close:focus-visible {
      outline: none;
      box-shadow: var(--nc-focus-ring);
      opacity: 1;
    }
    .toast__close svg {
      width: 0.75rem;
      height: 0.75rem;
      pointer-events: none;
    }

    /* ─── Progress Bar ─── */
    .toast__progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      width: 100%;
      transform-origin: left;
      opacity: 0.6;
    }
    .toast--success .toast__progress { background: var(--nc-color-success-500); }
    .toast--error .toast__progress   { background: var(--nc-color-danger-500); }
    .toast--warning .toast__progress { background: var(--nc-color-warning-500); }
    .toast--info .toast__progress    { background: var(--nc-color-info-500); }
  `;

  private _timer: ReturnType<typeof setTimeout> | null = null;
  private _startTime = 0;
  private _remaining = 0;
  private _rafId = 0;

  private get _variant(): Variant {
    const v = this.getStrAttr('variant', 'info') as Variant;
    return VARIANTS.includes(v) ? v : 'info';
  }

  private get _duration(): number {
    return this.getNumAttr('duration', 5000);
  }

  private get _dismissible(): boolean {
    return this.getBoolAttr('dismissible');
  }

  connectedCallback() {
    super.connectedCallback();
    this._remaining = this._duration;
    this._startTimer();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._clearTimer();
    cancelAnimationFrame(this._rafId);
  }

  protected render(): string {
    const variant = this._variant;
    const message = this.getStrAttr('message');
    const dismissible = this._dismissible;

    return `
      <div class="toast toast--${variant}" role="status" aria-live="polite">
        <span class="toast__icon" aria-hidden="true">${ICONS[variant]}</span>
        <div class="toast__content">
          <div class="toast__message">
            ${message ? this._escapeHtml(message) : ''}<slot></slot>
          </div>
          <div class="toast__actions"><slot name="action"></slot></div>
        </div>
        ${dismissible ? `
          <button class="toast__close" type="button" aria-label="Close">
            <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
              <line x1="2" y1="2" x2="8" y2="8"/><line x1="8" y1="2" x2="2" y2="8"/>
            </svg>
          </button>` : ''}
        <div class="toast__progress"></div>
      </div>
    `;
  }

  protected afterRender(): void {
    const close = this.shadow.querySelector('.toast__close');
    if (close) close.addEventListener('click', this._dismiss);

    const root = this.shadow.querySelector('.toast');
    if (root) {
      root.addEventListener('mouseenter', this._pause);
      root.addEventListener('mouseleave', this._resume);
      root.addEventListener('focusin', this._pause);
      root.addEventListener('focusout', this._resume);
    }
  }

  protected _cleanup(): void {
    this._clearTimer();
    cancelAnimationFrame(this._rafId);
  }

  /* ─── Timer Logic ─── */

  private _startTimer() {
    if (this._duration <= 0) return;
    this._startTime = Date.now();
    this._timer = setTimeout(() => this._dismiss(), this._remaining);
    this._animateProgress();
  }

  private _clearTimer() {
    if (this._timer !== null) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  private _pause = () => {
    this._clearTimer();
    this._remaining -= Date.now() - this._startTime;
    cancelAnimationFrame(this._rafId);
    // Freeze progress bar
    const bar = this.shadow.querySelector<HTMLElement>('.toast__progress');
    if (bar) {
      const elapsed = this._duration - this._remaining;
      const scale = 1 - elapsed / this._duration;
      bar.style.transform = `scaleX(${scale})`;
    }
  };

  private _resume = () => {
    if (this._remaining <= 0 || this._duration <= 0) return;
    this._startTimer();
  };

  private _animateProgress() {
    const bar = this.shadow.querySelector<HTMLElement>('.toast__progress');
    if (!bar || this._duration <= 0) return;

    const tick = () => {
      const elapsed = Date.now() - this._startTime + (this._duration - this._remaining);
      const scale = Math.max(0, 1 - elapsed / this._duration);
      bar.style.transform = `scaleX(${scale})`;
      if (scale > 0) this._rafId = requestAnimationFrame(tick);
    };
    this._rafId = requestAnimationFrame(tick);
  }

  private _dismiss = () => {
    this._clearTimer();
    cancelAnimationFrame(this._rafId);
    this.classList.add('nc-toast-exit');
    this.addEventListener('animationend', () => {
      this.emit('nc-dismiss');
      this.remove();
    }, { once: true });
  };

  /** Programmatic dismiss. */
  public dismiss() {
    this._dismiss();
  }

  private _escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

/* ════════════════════════════════════════════════════════════
   NcToastContainer — Manages position & stacking
   ════════════════════════════════════════════════════════════ */

export class NcToastContainer extends NcBaseElement {
  static observedAttributes = ['position', 'max'];

  static styles = `
    :host {
      position: fixed;
      z-index: var(--nc-z-toast);
      display: flex;
      flex-direction: column;
      gap: var(--nc-spacing-3);
      pointer-events: none;
      padding: var(--nc-spacing-4);
      max-height: 100vh;
      overflow: hidden;
    }

    /* ─── Positions ─── */
    :host([position="top-right"]),
    :host(:not([position])) {
      top: 0; right: 0;
      align-items: flex-end;
    }
    :host([position="top-left"]) {
      top: 0; left: 0;
      align-items: flex-start;
    }
    :host([position="bottom-right"]) {
      bottom: 0; right: 0;
      align-items: flex-end;
      flex-direction: column-reverse;
    }
    :host([position="bottom-left"]) {
      bottom: 0; left: 0;
      align-items: flex-start;
      flex-direction: column-reverse;
    }
    :host([position="top-center"]) {
      top: 0; left: 50%;
      transform: translateX(-50%);
      align-items: center;
    }
    :host([position="bottom-center"]) {
      bottom: 0; left: 50%;
      transform: translateX(-50%);
      align-items: center;
      flex-direction: column-reverse;
    }
  `;

  private _queue: NcToast[] = [];

  private get _position(): Position {
    const p = this.getStrAttr('position', 'top-right') as Position;
    return POSITIONS.includes(p) ? p : 'top-right';
  }

  private get _max(): number {
    return this.getNumAttr('max', 5);
  }

  protected render(): string {
    return `<slot></slot>`;
  }

  /** Add a toast to the container, respecting max visible. */
  public addToast(toastEl: NcToast) {
    toastEl.addEventListener('nc-dismiss', () => this._onToastDismissed());

    const visible = this.querySelectorAll('nc-toast');
    if (visible.length >= this._max) {
      this._queue.push(toastEl);
      return;
    }

    this.appendChild(toastEl);
  }

  private _onToastDismissed() {
    // After a toast is removed, show the next queued toast
    if (this._queue.length > 0) {
      const next = this._queue.shift()!;
      this.appendChild(next);
      next.addEventListener('nc-dismiss', () => this._onToastDismissed());
    }
  }
}

/* ════════════════════════════════════════════════════════════
   Programmatic API
   ════════════════════════════════════════════════════════════ */

export function toast(options: {
  message: string;
  variant?: string;
  duration?: number;
}): NcToast {
  let container = document.querySelector<NcToastContainer>('nc-toast-container');
  if (!container) {
    container = document.createElement('nc-toast-container') as NcToastContainer;
    document.body.appendChild(container);
  }

  const el = document.createElement('nc-toast') as NcToast;
  el.setAttribute('message', options.message);
  el.setAttribute('variant', options.variant ?? 'info');
  el.setAttribute('dismissible', '');
  if (options.duration !== undefined) {
    el.setAttribute('duration', String(options.duration));
  }

  container.addToast(el);
  return el;
}

/* ─── Register Elements ─── */
defineElement('nc-toast', NcToast);
defineElement('nc-toast-container', NcToastContainer);
