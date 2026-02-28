import { NcBaseElement } from '../../core/base-element';
import { defineElement } from '../../utils/helpers';

export class NcToggle extends NcBaseElement {
  static observedAttributes = ['checked', 'disabled', 'size', 'label', 'name', 'value'];

  static styles = `
    :host {
      display: inline-flex;
      align-items: center;
    }

    .toggle {
      display: inline-flex;
      align-items: center;
      gap: var(--nc-spacing-2);
      cursor: pointer;
      user-select: none;
    }

    .toggle--disabled {
      cursor: not-allowed;
      opacity: 0.5;
      pointer-events: none;
    }

    /* ─── Track ─── */
    .toggle__track {
      position: relative;
      display: inline-flex;
      align-items: center;
      border-radius: var(--nc-radius-full);
      background-color: var(--nc-color-neutral-300);
      transition: background-color 200ms ease;
      flex-shrink: 0;
    }

    .toggle__track:focus-visible {
      outline: none;
      box-shadow: var(--nc-focus-ring-offset);
    }

    .toggle--checked .toggle__track {
      background-color: var(--nc-color-primary-500);
    }

    /* ─── Thumb ─── */
    .toggle__thumb {
      position: absolute;
      background-color: #fff;
      border-radius: var(--nc-radius-full);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      transition: transform 200ms ease;
    }

    /* ─── Size: sm ─── */
    .toggle--sm .toggle__track {
      width: 2rem;
      height: 1.125rem;
    }
    .toggle--sm .toggle__thumb {
      width: 0.875rem;
      height: 0.875rem;
      left: 0.125rem;
    }
    .toggle--sm.toggle--checked .toggle__thumb {
      transform: translateX(0.875rem);
    }

    /* ─── Size: md ─── */
    .toggle--md .toggle__track {
      width: 2.75rem;
      height: 1.5rem;
    }
    .toggle--md .toggle__thumb {
      width: 1.25rem;
      height: 1.25rem;
      left: 0.125rem;
    }
    .toggle--md.toggle--checked .toggle__thumb {
      transform: translateX(1.25rem);
    }

    /* ─── Size: lg ─── */
    .toggle--lg .toggle__track {
      width: 3.5rem;
      height: 1.875rem;
    }
    .toggle--lg .toggle__thumb {
      width: 1.625rem;
      height: 1.625rem;
      left: 0.125rem;
    }
    .toggle--lg.toggle--checked .toggle__thumb {
      transform: translateX(1.625rem);
    }

    /* ─── Label ─── */
    .toggle__label {
      font-family: var(--nc-font-family-sans);
      color: var(--nc-color-neutral-700);
    }
    .toggle--sm .toggle__label {
      font-size: var(--nc-font-size-sm);
    }
    .toggle--md .toggle__label {
      font-size: var(--nc-font-size-sm);
    }
    .toggle--lg .toggle__label {
      font-size: var(--nc-font-size-md);
    }
  `;

  protected render(): string {
    const checked = this.getBoolAttr('checked');
    const disabled = this.getBoolAttr('disabled');
    const size = this.getStrAttr('size', 'md');
    const label = this.getStrAttr('label');
    const name = this.getStrAttr('name');
    const value = this.getStrAttr('value');

    const classes = [
      'toggle',
      `toggle--${size}`,
      checked ? 'toggle--checked' : '',
      disabled ? 'toggle--disabled' : '',
    ].filter(Boolean).join(' ');

    return `
      <label class="${classes}" part="base">
        <span
          class="toggle__track"
          part="track"
          role="switch"
          tabindex="${disabled ? '-1' : '0'}"
          aria-checked="${checked}"
          aria-label="${label || 'Toggle'}"
          ${name ? `data-name="${name}"` : ''}
          ${value ? `data-value="${value}"` : ''}
        >
          <span class="toggle__thumb" part="thumb"></span>
        </span>
        ${label ? `<span class="toggle__label" part="label">${label}</span>` : ''}
      </label>
    `;
  }

  protected afterRender(): void {
    const track = this.shadow.querySelector('.toggle__track');
    if (track) {
      track.addEventListener('click', this._handleClick);
      track.addEventListener('keydown', this._handleKeydown);
    }
  }

  protected _cleanup(): void {
    const track = this.shadow.querySelector('.toggle__track');
    if (track) {
      track.removeEventListener('click', this._handleClick);
      track.removeEventListener('keydown', this._handleKeydown);
    }
  }

  private _toggle() {
    if (this.getBoolAttr('disabled')) return;
    const next = !this.getBoolAttr('checked');
    this.setBoolAttr('checked', next);
    this.emit('nc-change', { checked: next });
  }

  private _handleClick = () => {
    this._toggle();
  };

  private _handleKeydown = (e: Event) => {
    const key = (e as KeyboardEvent).key;
    if (key === ' ' || key === 'Enter') {
      e.preventDefault();
      this._toggle();
    }
  };
}

defineElement('nc-toggle', NcToggle);
