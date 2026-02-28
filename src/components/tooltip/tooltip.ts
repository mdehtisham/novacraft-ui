import { NcBaseElement } from '../../core/base-element';
import { defineElement, uniqueId } from '../../utils/helpers';

export class NcTooltip extends NcBaseElement {
  static observedAttributes = ['text', 'placement', 'delay'];

  static styles = `
    :host {
      position: relative;
      display: inline-block;
    }

    .nc-tooltip-trigger {
      display: inline-block;
    }

    .nc-tooltip-bubble {
      position: absolute;
      z-index: 9999;
      max-width: 250px;
      padding: 6px 12px;
      border-radius: 6px;
      background: #1a1a2e;
      color: #fff;
      font-size: 0.8125rem;
      line-height: 1.4;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 150ms ease-in-out;
    }

    .nc-tooltip-bubble[data-visible] {
      opacity: 1;
    }

    /* Arrow base */
    .nc-tooltip-arrow {
      position: absolute;
      width: 0;
      height: 0;
      border: 5px solid transparent;
    }

    /* ── Placement: top ── */
    .nc-tooltip-bubble[data-placement="top"] {
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 8px;
    }
    .nc-tooltip-bubble[data-placement="top"] .nc-tooltip-arrow {
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-top-color: #1a1a2e;
      border-bottom: 0;
    }

    /* ── Placement: bottom ── */
    .nc-tooltip-bubble[data-placement="bottom"] {
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 8px;
    }
    .nc-tooltip-bubble[data-placement="bottom"] .nc-tooltip-arrow {
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-bottom-color: #1a1a2e;
      border-top: 0;
    }

    /* ── Placement: left ── */
    .nc-tooltip-bubble[data-placement="left"] {
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      margin-right: 8px;
    }
    .nc-tooltip-bubble[data-placement="left"] .nc-tooltip-arrow {
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      border-left-color: #1a1a2e;
      border-right: 0;
    }

    /* ── Placement: right ── */
    .nc-tooltip-bubble[data-placement="right"] {
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      margin-left: 8px;
    }
    .nc-tooltip-bubble[data-placement="right"] .nc-tooltip-arrow {
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      border-right-color: #1a1a2e;
      border-left: 0;
    }
  `;

  private _tooltipId = uniqueId('nc-tooltip');
  private _showTimer: ReturnType<typeof setTimeout> | undefined;
  private _hideTimer: ReturnType<typeof setTimeout> | undefined;

  private _handleShow = () => this._scheduleShow();
  private _handleHide = () => this._scheduleHide();
  private _handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this._hide();
  };

  private get _placement(): string {
    return this.getStrAttr('placement', 'top');
  }

  private get _delay(): number {
    return this.getNumAttr('delay', 200);
  }

  protected render(): string {
    const text = this.getStrAttr('text');
    const placement = this._placement;

    return `
      <div class="nc-tooltip-trigger" aria-describedby="${this._tooltipId}">
        <slot></slot>
      </div>
      <div
        class="nc-tooltip-bubble"
        id="${this._tooltipId}"
        role="tooltip"
        data-placement="${placement}"
      >
        ${text}
        <span class="nc-tooltip-arrow"></span>
      </div>
    `;
  }

  protected afterRender(): void {
    const trigger = this.shadow.querySelector('.nc-tooltip-trigger');
    if (!trigger) return;

    trigger.addEventListener('mouseenter', this._handleShow);
    trigger.addEventListener('mouseleave', this._handleHide);
    trigger.addEventListener('focusin', this._handleShow);
    trigger.addEventListener('focusout', this._handleHide);
    trigger.addEventListener('keydown', this._handleKeydown as EventListener);
  }

  protected _cleanup(): void {
    clearTimeout(this._showTimer);
    clearTimeout(this._hideTimer);

    const trigger = this.shadow.querySelector('.nc-tooltip-trigger');
    if (!trigger) return;

    trigger.removeEventListener('mouseenter', this._handleShow);
    trigger.removeEventListener('mouseleave', this._handleHide);
    trigger.removeEventListener('focusin', this._handleShow);
    trigger.removeEventListener('focusout', this._handleHide);
    trigger.removeEventListener('keydown', this._handleKeydown as EventListener);
  }

  private _scheduleShow(): void {
    clearTimeout(this._hideTimer);
    this._showTimer = setTimeout(() => this._show(), this._delay);
  }

  private _scheduleHide(): void {
    clearTimeout(this._showTimer);
    this._hideTimer = setTimeout(() => this._hide(), this._delay);
  }

  private _show(): void {
    const bubble = this.shadow.querySelector('.nc-tooltip-bubble');
    bubble?.setAttribute('data-visible', '');
  }

  private _hide(): void {
    const bubble = this.shadow.querySelector('.nc-tooltip-bubble');
    bubble?.removeAttribute('data-visible');
  }
}

defineElement('nc-tooltip', NcTooltip);
