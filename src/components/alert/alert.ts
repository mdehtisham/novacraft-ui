import { NcBaseElement } from '../../core/base-element';
import { defineElement } from '../../utils/helpers';

const ICONS: Record<string, string> = {
  info: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  success: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  danger: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
};

export class NcAlert extends NcBaseElement {
  static observedAttributes = ['variant', 'dismissible', 'title'];

  static styles = `
    :host {
      display: block;
    }

    .alert {
      display: flex;
      align-items: flex-start;
      gap: var(--nc-spacing-3);
      padding: var(--nc-spacing-3) var(--nc-spacing-4);
      border: 1px solid transparent;
      border-left: 4px solid transparent;
      border-radius: var(--nc-radius-md);
      font-family: var(--nc-font-family-sans);
      font-size: var(--nc-font-size-sm);
      line-height: var(--nc-line-height-normal);
    }

    /* ─── Variant: Info ─── */
    .alert--info {
      background-color: var(--nc-color-info-50);
      border-color: var(--nc-color-info-100);
      border-left-color: var(--nc-color-info-500);
      color: var(--nc-color-info-700);
    }

    /* ─── Variant: Success ─── */
    .alert--success {
      background-color: var(--nc-color-success-50);
      border-color: var(--nc-color-success-100);
      border-left-color: var(--nc-color-success-500);
      color: var(--nc-color-success-700);
    }

    /* ─── Variant: Warning ─── */
    .alert--warning {
      background-color: var(--nc-color-warning-50);
      border-color: var(--nc-color-warning-100);
      border-left-color: var(--nc-color-warning-500);
      color: var(--nc-color-warning-700);
    }

    /* ─── Variant: Danger ─── */
    .alert--danger {
      background-color: var(--nc-color-danger-50);
      border-color: var(--nc-color-danger-100);
      border-left-color: var(--nc-color-danger-500);
      color: var(--nc-color-danger-700);
    }

    /* ─── Icon ─── */
    .alert__icon {
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
      margin-top: var(--nc-spacing-1);
    }

    .alert__icon svg {
      display: block;
    }

    /* ─── Content ─── */
    .alert__content {
      flex: 1;
      min-width: 0;
    }

    .alert__title {
      font-weight: var(--nc-font-weight-semibold);
      font-size: var(--nc-font-size-sm);
      margin: 0 0 var(--nc-spacing-1) 0;
    }

    .alert__title:empty {
      display: none;
    }

    .alert__body {
      color: inherit;
      opacity: 0.9;
    }

    .alert__action {
      margin-top: var(--nc-spacing-2);
    }

    .alert__action:empty {
      display: none;
    }

    /* ─── Dismiss Button ─── */
    .alert__dismiss {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 1.5rem;
      height: 1.5rem;
      padding: 0;
      margin: 0;
      border: none;
      border-radius: var(--nc-radius-sm);
      background: transparent;
      color: inherit;
      opacity: 0.6;
      cursor: pointer;
      transition: opacity var(--nc-transition-fast), background-color var(--nc-transition-fast);
    }

    .alert__dismiss:hover {
      opacity: 1;
      background-color: rgba(0, 0, 0, 0.05);
    }

    .alert__dismiss:focus-visible {
      outline: none;
      box-shadow: var(--nc-focus-ring);
    }
  `;

  protected render(): string {
    const variant = this.getStrAttr('variant', 'info');
    const dismissible = this.getBoolAttr('dismissible');
    const title = this.getStrAttr('title');
    const icon = ICONS[variant] ?? ICONS.info;

    return `
      <div class="alert alert--${variant}" role="alert" part="base">
        <span class="alert__icon" part="icon">
          <slot name="icon">${icon}</slot>
        </span>

        <div class="alert__content" part="content">
          <div class="alert__title" part="title">
            <slot name="title">${title}</slot>
          </div>
          <div class="alert__body" part="body">
            <slot></slot>
          </div>
          <div class="alert__action" part="action">
            <slot name="action"></slot>
          </div>
        </div>

        ${dismissible ? `
          <button class="alert__dismiss" part="dismiss" aria-label="Dismiss">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        ` : ''}
      </div>
    `;
  }

  protected afterRender(): void {
    const btn = this.shadow.querySelector<HTMLButtonElement>('.alert__dismiss');
    if (btn) {
      btn.addEventListener('click', this._handleDismiss);
    }
  }

  protected _cleanup(): void {
    const btn = this.shadow.querySelector<HTMLButtonElement>('.alert__dismiss');
    if (btn) {
      btn.removeEventListener('click', this._handleDismiss);
    }
  }

  private _handleDismiss = () => {
    this.emit('nc-dismiss');
  };
}

defineElement('nc-alert', NcAlert);
