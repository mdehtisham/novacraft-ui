import { NcBaseElement } from '../../core/base-element';
import { defineElement } from '../../utils/helpers';

// ─── NcBreadcrumbItem ────────────────────────────────────────

export class NcBreadcrumbItem extends NcBaseElement {
  static observedAttributes = ['href', 'current'];

  static styles = `
    :host {
      display: inline-flex;
      align-items: center;
    }

    :host::after {
      content: var(--nc-breadcrumb-separator, '/');
      margin-inline: var(--nc-spacing-2);
      color: var(--nc-color-neutral-400);
      font-size: var(--nc-font-size-sm);
      pointer-events: none;
    }

    :host(:last-child)::after {
      display: none;
    }

    .breadcrumb-item__link {
      font-family: var(--nc-font-family-sans);
      font-size: var(--nc-font-size-sm);
      color: var(--nc-color-primary-600);
      text-decoration: none;
      transition: color var(--nc-transition-fast);
    }

    .breadcrumb-item__link:hover {
      color: var(--nc-color-primary-700);
      text-decoration: underline;
    }

    .breadcrumb-item__link:focus-visible {
      outline: none;
      box-shadow: var(--nc-focus-ring);
      border-radius: var(--nc-radius-sm);
    }

    .breadcrumb-item__current {
      font-family: var(--nc-font-family-sans);
      font-size: var(--nc-font-size-sm);
      color: var(--nc-color-neutral-500);
      font-weight: var(--nc-font-weight-medium);
    }
  `;

  protected render(): string {
    const href = this.getStrAttr('href');
    const current = this.getBoolAttr('current');

    if (current) {
      return `<span class="breadcrumb-item__current" aria-current="page"><slot></slot></span>`;
    }

    return href
      ? `<a class="breadcrumb-item__link" href="${href}"><slot></slot></a>`
      : `<a class="breadcrumb-item__link" href="#"><slot></slot></a>`;
  }
}

// ─── NcBreadcrumb ────────────────────────────────────────────

export class NcBreadcrumb extends NcBaseElement {
  static observedAttributes = ['separator'];

  static styles = `
    :host {
      display: block;
    }

    nav ol {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      list-style: none;
      margin: 0;
      padding: 0;
    }
  `;

  protected render(): string {
    return `
      <nav aria-label="Breadcrumb">
        <ol>
          <slot></slot>
        </ol>
      </nav>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this._applySeparator();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'separator') {
      this._applySeparator();
    }
  }

  private _applySeparator() {
    const separator = this.getStrAttr('separator', '/');
    this.style.setProperty('--nc-breadcrumb-separator', `'${separator}'`);
  }
}

defineElement('nc-breadcrumb-item', NcBreadcrumbItem);
defineElement('nc-breadcrumb', NcBreadcrumb);
