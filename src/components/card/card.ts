import { NcBaseElement } from '../../core/base-element';
import { defineElement } from '../../utils/helpers';

export class NcCard extends NcBaseElement {
  static observedAttributes = ['variant', 'padding', 'interactive'];

  static styles = `
    :host {
      display: block;
    }

    .card {
      display: flex;
      flex-direction: column;
      border-radius: var(--nc-radius-md, 12px);
      overflow: hidden;
      background: var(--nc-color-surface, #fff);
      color: var(--nc-color-on-surface, #1a1a1a);
      transition: box-shadow var(--nc-transition-normal, 0.2s ease),
                  transform var(--nc-transition-normal, 0.2s ease);
    }

    /* Variants */
    .card--elevated {
      box-shadow: var(--nc-shadow-md, 0 2px 8px rgba(0, 0, 0, 0.1));
    }

    .card--outlined {
      border: 1px solid var(--nc-color-border, #e0e0e0);
    }

    .card--filled {
      background: var(--nc-color-surface-variant, #f0f0f0);
    }

    /* Interactive */
    .card--interactive {
      cursor: pointer;
    }

    .card--interactive:hover {
      transform: translateY(-2px);
      box-shadow: var(--nc-shadow-lg, 0 8px 24px rgba(0, 0, 0, 0.15));
    }

    .card--interactive:active {
      transform: translateY(0);
      box-shadow: var(--nc-shadow-sm, 0 1px 4px rgba(0, 0, 0, 0.08));
    }

    /* Padding */
    .card--padding-none .card__body { padding: 0; }
    .card--padding-sm .card__body   { padding: var(--nc-spacing-sm, 8px); }
    .card--padding-md .card__body   { padding: var(--nc-spacing-md, 16px); }
    .card--padding-lg .card__body   { padding: var(--nc-spacing-lg, 24px); }

    .card--padding-none .card__header { padding: 0; }
    .card--padding-sm .card__header   { padding: var(--nc-spacing-sm, 8px); }
    .card--padding-md .card__header   { padding: var(--nc-spacing-md, 16px); }
    .card--padding-lg .card__header   { padding: var(--nc-spacing-lg, 24px); }

    .card--padding-none .card__footer { padding: 0; }
    .card--padding-sm .card__footer   { padding: var(--nc-spacing-sm, 8px); }
    .card--padding-md .card__footer   { padding: var(--nc-spacing-md, 16px); }
    .card--padding-lg .card__footer   { padding: var(--nc-spacing-lg, 24px); }

    /* Media slot */
    .card__media {
      overflow: hidden;
    }

    .card__media ::slotted(*) {
      display: block;
      width: 100%;
    }

    /* Header */
    .card__header {
      border-bottom: 1px solid var(--nc-color-border, #e0e0e0);
    }

    /* Footer */
    .card__footer {
      border-top: 1px solid var(--nc-color-border, #e0e0e0);
      margin-top: auto;
    }

    /* Hide empty slots */
    .card__media:has(slot:not([slotted])),
    .card__header:has(slot:not([slotted])),
    .card__footer:has(slot:not([slotted])) {
      display: none;
    }
  `;

  protected render(): string {
    const variant = this.getStrAttr('variant', 'elevated');
    const padding = this.getStrAttr('padding', 'md');
    const interactive = this.getBoolAttr('interactive');

    const classes = [
      'card',
      `card--${variant}`,
      `card--padding-${padding}`,
      interactive ? 'card--interactive' : '',
    ].filter(Boolean).join(' ');

    return `
      <div class="${classes}" part="base">
        <div class="card__media" part="media">
          <slot name="media"></slot>
        </div>
        <div class="card__header" part="header">
          <slot name="header"></slot>
        </div>
        <div class="card__body" part="body">
          <slot></slot>
        </div>
        <div class="card__footer" part="footer">
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }

  protected afterRender(): void {
    if (this.getBoolAttr('interactive')) {
      const base = this.shadow.querySelector('.card');
      base?.addEventListener('click', this._handleClick);
      base?.addEventListener('keydown', this._handleKeydown);
      base?.setAttribute('tabindex', '0');
      base?.setAttribute('role', 'button');
    }

    // Hide wrappers when their slots have no assigned content
    const slotNames = ['media', 'header', 'footer'] as const;
    for (const name of slotNames) {
      const slot = this.shadow.querySelector(`slot[name="${name}"]`) as HTMLSlotElement | null;
      slot?.addEventListener('slotchange', () => {
        const wrapper = slot.parentElement;
        if (wrapper) {
          wrapper.style.display = slot.assignedNodes().length ? '' : 'none';
        }
      });
      // Initial hide if empty
      if (slot && slot.assignedNodes().length === 0) {
        slot.parentElement!.style.display = 'none';
      }
    }
  }

  private _handleClick = () => {
    this.emit('nc-click');
  };

  private _handleKeydown = (e: Event) => {
    const key = (e as KeyboardEvent).key;
    if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      this.emit('nc-click');
    }
  };

  protected _cleanup(): void {
    const base = this.shadow.querySelector('.card');
    base?.removeEventListener('click', this._handleClick);
    base?.removeEventListener('keydown', this._handleKeydown);
  }
}

defineElement('nc-card', NcCard);
