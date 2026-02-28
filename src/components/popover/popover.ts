import { NcBaseElement } from '../../core/base-element';
import { defineElement } from '../../utils/helpers';

type Placement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';

const FLIP: Record<string, string> = {
  top: 'bottom', bottom: 'top', left: 'right', right: 'left',
};

export class NcPopover extends NcBaseElement {
  static observedAttributes = ['placement', 'trigger', 'open', 'offset'];

  static styles = `
    :host {
      position: relative;
      display: inline-block;
    }

    .nc-popover-trigger {
      display: inline-block;
    }

    .nc-popover-panel {
      position: absolute;
      z-index: var(--nc-z-popover, 1000);
      min-width: 120px;
      padding: 12px 16px;
      border-radius: 8px;
      background: #fff;
      color: #1a1a2e;
      font-size: 0.875rem;
      line-height: 1.5;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.08);
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
    }

    :host([open]) .nc-popover-panel {
      opacity: 1;
      pointer-events: auto;
      visibility: visible;
      animation: nc-popover-fade-in 150ms ease;
    }

    @keyframes nc-popover-fade-in {
      from { opacity: 0; transform: scale(0.95); }
      to   { opacity: 1; transform: scale(1); }
    }

    /* ── Arrow ── */
    .nc-popover-arrow {
      position: absolute;
      width: 8px;
      height: 8px;
      background: #fff;
      transform: rotate(45deg);
    }

    /* Arrow on each side */
    [data-side="top"]    > .nc-popover-arrow { bottom: -4px; box-shadow:  2px  2px 3px rgba(0,0,0,0.06); }
    [data-side="bottom"] > .nc-popover-arrow { top:    -4px; box-shadow: -2px -2px 3px rgba(0,0,0,0.06); }
    [data-side="left"]   > .nc-popover-arrow { right:  -4px; box-shadow:  2px -2px 3px rgba(0,0,0,0.06); }
    [data-side="right"]  > .nc-popover-arrow { left:   -4px; box-shadow: -2px  2px 3px rgba(0,0,0,0.06); }

    /* Horizontal arrow alignment (top / bottom placements) */
    [data-side="top"][data-align="center"]    > .nc-popover-arrow,
    [data-side="bottom"][data-align="center"] > .nc-popover-arrow { left: calc(50% - 4px); }
    [data-side="top"][data-align="start"]     > .nc-popover-arrow,
    [data-side="bottom"][data-align="start"]  > .nc-popover-arrow { left: 16px; }
    [data-side="top"][data-align="end"]       > .nc-popover-arrow,
    [data-side="bottom"][data-align="end"]    > .nc-popover-arrow { right: 16px; }

    /* Vertical arrow alignment (left / right placements) */
    [data-side="left"][data-align="center"]  > .nc-popover-arrow,
    [data-side="right"][data-align="center"] > .nc-popover-arrow { top: calc(50% - 4px); }
    [data-side="left"][data-align="start"]   > .nc-popover-arrow,
    [data-side="right"][data-align="start"]  > .nc-popover-arrow { top: 12px; }
    [data-side="left"][data-align="end"]     > .nc-popover-arrow,
    [data-side="right"][data-align="end"]    > .nc-popover-arrow { bottom: 12px; }
  `;

  private _hoverTimeout: ReturnType<typeof setTimeout> | undefined;

  // Stable handler references for add/removeEventListener
  private _onTriggerClick = () => this._toggle();
  private _onMouseEnter = () => {
    clearTimeout(this._hoverTimeout);
    if (!this._isOpen) this._open();
  };
  private _onMouseLeave = () => {
    this._hoverTimeout = setTimeout(() => this._close(), 150);
  };
  private _onDocumentClick = (e: MouseEvent) => {
    if (this._isOpen && !this.contains(e.target as Node)) this._close();
  };
  private _onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this._isOpen) this._close();
  };

  private get _placement(): Placement {
    return this.getStrAttr('placement', 'bottom') as Placement;
  }
  private get _triggerMode(): string {
    return this.getStrAttr('trigger', 'click');
  }
  private get _offset(): number {
    return this.getNumAttr('offset', 8);
  }
  private get _isOpen(): boolean {
    return this.getBoolAttr('open');
  }

  /* ── Template ─────────────────────────────────────────────── */

  protected render(): string {
    return `
      <div class="nc-popover-trigger" aria-haspopup="dialog">
        <slot></slot>
      </div>
      <div class="nc-popover-panel" role="dialog">
        <slot name="content"></slot>
        <span class="nc-popover-arrow"></span>
      </div>
    `;
  }

  /* ── Lifecycle ────────────────────────────────────────────── */

  protected afterRender(): void {
    const trigger = this.shadow.querySelector('.nc-popover-trigger') as HTMLElement;
    if (!trigger) return;

    if (this._triggerMode === 'hover') {
      this.addEventListener('mouseenter', this._onMouseEnter);
      this.addEventListener('mouseleave', this._onMouseLeave);
    } else {
      trigger.addEventListener('click', this._onTriggerClick);
      document.addEventListener('click', this._onDocumentClick);
    }

    document.addEventListener('keydown', this._onKeydown);

    if (this._isOpen) this._position();
  }

  protected _cleanup(): void {
    clearTimeout(this._hoverTimeout);
    this.removeEventListener('mouseenter', this._onMouseEnter);
    this.removeEventListener('mouseleave', this._onMouseLeave);
    document.removeEventListener('click', this._onDocumentClick);
    document.removeEventListener('keydown', this._onKeydown);
  }

  /* ── Open / Close ─────────────────────────────────────────── */

  private _toggle(): void {
    this._isOpen ? this._close() : this._open();
  }

  private _open(): void {
    if (this._isOpen) return;
    this.setAttribute('open', '');
    this.emit('nc-show');
  }

  private _close(): void {
    if (!this._isOpen) return;
    this.removeAttribute('open');
    this.emit('nc-hide');
  }

  /* ── Positioning ──────────────────────────────────────────── */

  private _position(): void {
    const trigger = this.shadow.querySelector('.nc-popover-trigger') as HTMLElement;
    const panel = this.shadow.querySelector('.nc-popover-panel') as HTMLElement;
    if (!trigger || !panel) return;

    const triggerRect = trigger.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const placement = this._autoFlip(this._placement, triggerRect, panelRect);

    const { top, left } = this._calcCoords(placement, trigger, panel);
    panel.style.top = `${top}px`;
    panel.style.left = `${left}px`;

    const [side, align = 'center'] = placement.split('-');
    panel.setAttribute('data-side', side);
    panel.setAttribute('data-align', align);
  }

  /** Flip to the opposite side when the popover would overflow the viewport. */
  private _autoFlip(placement: Placement, triggerRect: DOMRect, panelRect: DOMRect): Placement {
    const offset = this._offset;
    const side = placement.split('-')[0];
    const align = placement.split('-')[1] || '';
    let shouldFlip = false;

    switch (side) {
      case 'top':    shouldFlip = triggerRect.top    - panelRect.height - offset < 0;                    break;
      case 'bottom': shouldFlip = triggerRect.bottom + panelRect.height + offset > window.innerHeight;   break;
      case 'left':   shouldFlip = triggerRect.left   - panelRect.width  - offset < 0;                    break;
      case 'right':  shouldFlip = triggerRect.right  + panelRect.width  + offset > window.innerWidth;    break;
    }

    if (!shouldFlip) return placement;
    const flipped = FLIP[side];
    return (align ? `${flipped}-${align}` : flipped) as Placement;
  }

  /** Compute top/left offsets relative to the trigger wrapper. */
  private _calcCoords(
    placement: Placement,
    triggerEl: HTMLElement,
    panelEl: HTMLElement,
  ): { top: number; left: number } {
    const tw = triggerEl.offsetWidth;
    const th = triggerEl.offsetHeight;
    const pw = panelEl.offsetWidth;
    const ph = panelEl.offsetHeight;
    const o  = this._offset;

    switch (placement) {
      case 'top':          return { top: -(ph + o), left: (tw - pw) / 2 };
      case 'top-start':    return { top: -(ph + o), left: 0 };
      case 'top-end':      return { top: -(ph + o), left: tw - pw };
      case 'bottom':       return { top: th + o,    left: (tw - pw) / 2 };
      case 'bottom-start': return { top: th + o,    left: 0 };
      case 'bottom-end':   return { top: th + o,    left: tw - pw };
      case 'left':         return { top: (th - ph) / 2, left: -(pw + o) };
      case 'left-start':   return { top: 0,             left: -(pw + o) };
      case 'left-end':     return { top: th - ph,       left: -(pw + o) };
      case 'right':        return { top: (th - ph) / 2, left: tw + o };
      case 'right-start':  return { top: 0,             left: tw + o };
      case 'right-end':    return { top: th - ph,       left: tw + o };
      default:             return { top: th + o,         left: (tw - pw) / 2 };
    }
  }
}

defineElement('nc-popover', NcPopover);
