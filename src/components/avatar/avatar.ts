import { NcBaseElement } from '../../core/base-element';
import { defineElement } from '../../utils/helpers';

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const SHAPES = ['circle', 'square'] as const;
const STATUSES = ['online', 'offline', 'busy', 'away'] as const;

type Size = (typeof SIZES)[number];
type Shape = (typeof SHAPES)[number];
type Status = (typeof STATUSES)[number];

export class NcAvatar extends NcBaseElement {
  static observedAttributes = ['src', 'alt', 'initials', 'size', 'shape', 'status'];

  static styles = `
    :host {
      display: inline-flex;
      position: relative;
      vertical-align: middle;
    }

    .avatar {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background-color: var(--nc-color-neutral-200, #e5e7eb);
      color: var(--nc-color-neutral-600, #4b5563);
      font-family: var(--nc-font-family-sans, system-ui, sans-serif);
      font-weight: var(--nc-font-weight-medium, 500);
      user-select: none;
      flex-shrink: 0;
    }

    /* ─── Sizes ─── */
    .avatar--xs { width: 24px; height: 24px; font-size: 0.625rem; }
    .avatar--sm { width: 32px; height: 32px; font-size: 0.75rem; }
    .avatar--md { width: 40px; height: 40px; font-size: 0.875rem; }
    .avatar--lg { width: 48px; height: 48px; font-size: 1rem; }
    .avatar--xl { width: 64px; height: 64px; font-size: 1.25rem; }

    /* ─── Shapes ─── */
    .avatar--circle { border-radius: var(--nc-radius-full, 9999px); }
    .avatar--square { border-radius: var(--nc-radius-md, 0.375rem); }

    /* ─── Image ─── */
    .avatar__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* ─── Initials ─── */
    .avatar__initials {
      line-height: 1;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    /* ─── Generic Icon ─── */
    .avatar__icon {
      width: 60%;
      height: 60%;
      fill: currentColor;
    }

    /* ─── Status Indicator ─── */
    .avatar__status {
      position: absolute;
      bottom: 0;
      right: 0;
      border-radius: var(--nc-radius-full, 9999px);
      border: 2px solid var(--nc-color-surface, #fff);
      box-sizing: border-box;
    }

    .avatar--xs .avatar__status { width: 8px;  height: 8px; }
    .avatar--sm .avatar__status { width: 10px; height: 10px; }
    .avatar--md .avatar__status { width: 12px; height: 12px; }
    .avatar--lg .avatar__status { width: 14px; height: 14px; }
    .avatar--xl .avatar__status { width: 16px; height: 16px; }

    .avatar__status--online { background-color: var(--nc-color-success-500, #22c55e); }
    .avatar__status--offline { background-color: var(--nc-color-neutral-400, #9ca3af); }
    .avatar__status--busy { background-color: var(--nc-color-danger-500, #ef4444); }
    .avatar__status--away { background-color: var(--nc-color-warning-500, #eab308); }
  `;

  private _imgFailed = false;

  private get _size(): Size {
    const s = this.getStrAttr('size', 'md') as Size;
    return SIZES.includes(s) ? s : 'md';
  }

  private get _shape(): Shape {
    const s = this.getStrAttr('shape', 'circle') as Shape;
    return SHAPES.includes(s) ? s : 'circle';
  }

  private get _status(): Status | '' {
    const s = this.getStrAttr('status') as Status;
    return STATUSES.includes(s) ? s : '';
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'src') {
      this._imgFailed = false;
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  protected render(): string {
    const src = this.getStrAttr('src');
    const alt = this.getStrAttr('alt', '');
    const initials = this.getStrAttr('initials');
    const size = this._size;
    const shape = this._shape;
    const status = this._status;

    const classes = `avatar avatar--${size} avatar--${shape}`;

    let content: string;
    if (src && !this._imgFailed) {
      content = `<img class="avatar__img" src="${src}" alt="${alt}" />`;
    } else if (initials) {
      content = `<span class="avatar__initials" aria-hidden="true">${initials}</span>`;
    } else {
      content = `<svg class="avatar__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z"/>
      </svg>`;
    }

    const statusHtml = status
      ? `<span class="avatar__status avatar__status--${status}" aria-label="${status}"></span>`
      : '';

    const ariaLabel = alt || (initials ? `Avatar: ${initials}` : 'User avatar');

    return `
      <span class="${classes}" role="img" aria-label="${ariaLabel}">
        ${content}
        ${statusHtml}
      </span>
    `;
  }

  protected afterRender(): void {
    const img = this.shadow.querySelector<HTMLImageElement>('.avatar__img');
    if (img) {
      img.addEventListener('error', this._onImgError, { once: true });
    }
  }

  private _onImgError = () => {
    this._imgFailed = true;
    this.attributeChangedCallback('src', null, null);
  };
}

defineElement('nc-avatar', NcAvatar);
