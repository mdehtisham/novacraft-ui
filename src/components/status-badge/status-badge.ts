import { NcBaseElement } from '../../core/base-element';
import { defineElement } from '../../utils/helpers';

const STATUSES = ['success', 'warning', 'danger', 'info', 'pending', 'processing'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;

type Status = (typeof STATUSES)[number];
type Size = (typeof SIZES)[number];

export class NcStatusBadge extends NcBaseElement {
  static observedAttributes = ['status', 'pulse', 'size', 'label'];

  static styles = `
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.6);
        opacity: 0;
      }
    }

    :host {
      display: inline-flex;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: var(--nc-spacing-2, 0.5rem);
      font-family: var(--nc-font-family-sans, system-ui, sans-serif);
      font-weight: var(--nc-font-weight-medium, 500);
      line-height: var(--nc-line-height-tight, 1.25);
      white-space: nowrap;
    }

    /* ─── Sizes ─── */
    .status-badge--sm { font-size: var(--nc-font-size-xs, 0.75rem); }
    .status-badge--md { font-size: var(--nc-font-size-sm, 0.875rem); }
    .status-badge--lg { font-size: var(--nc-font-size-md, 1rem); }

    /* ─── Dot Container ─── */
    .status-badge__dot-wrapper {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .status-badge--sm .status-badge__dot-wrapper {
      width: 0.375rem;
      height: 0.375rem;
    }
    .status-badge--md .status-badge__dot-wrapper {
      width: 0.5rem;
      height: 0.5rem;
    }
    .status-badge--lg .status-badge__dot-wrapper {
      width: 0.625rem;
      height: 0.625rem;
    }

    .status-badge__dot {
      width: 100%;
      height: 100%;
      border-radius: var(--nc-radius-full, 9999px);
    }

    /* ─── Pulse Ring ─── */
    .status-badge__pulse {
      position: absolute;
      inset: 0;
      border-radius: var(--nc-radius-full, 9999px);
      animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    /* ─── Label ─── */
    .status-badge__label {
      color: var(--nc-color-neutral-700, #374151);
    }

    /* ─── Status Colors ─── */
    .status-badge--success .status-badge__dot,
    .status-badge--success .status-badge__pulse {
      background-color: var(--nc-color-success-500, #22c55e);
    }
    .status-badge--warning .status-badge__dot,
    .status-badge--warning .status-badge__pulse {
      background-color: var(--nc-color-warning-500, #f59e0b);
    }
    .status-badge--danger .status-badge__dot,
    .status-badge--danger .status-badge__pulse {
      background-color: var(--nc-color-danger-500, #ef4444);
    }
    .status-badge--info .status-badge__dot,
    .status-badge--info .status-badge__pulse {
      background-color: var(--nc-color-info-500, #3b82f6);
    }
    .status-badge--pending .status-badge__dot,
    .status-badge--pending .status-badge__pulse {
      background-color: var(--nc-color-neutral-400, #9ca3af);
    }
    .status-badge--processing .status-badge__dot,
    .status-badge--processing .status-badge__pulse {
      background-color: var(--nc-color-primary-500, #6366f1);
    }
  `;

  private get _status(): Status {
    const s = this.getStrAttr('status', 'info') as Status;
    return STATUSES.includes(s) ? s : 'info';
  }

  private get _size(): Size {
    const s = this.getStrAttr('size', 'md') as Size;
    return SIZES.includes(s) ? s : 'md';
  }

  protected render(): string {
    const status = this._status;
    const size = this._size;
    const pulse = this.getBoolAttr('pulse');
    const label = this.getStrAttr('label');

    const classes = [
      'status-badge',
      `status-badge--${status}`,
      `status-badge--${size}`,
    ].join(' ');

    const pulseHtml = pulse
      ? '<span class="status-badge__pulse" aria-hidden="true"></span>'
      : '';

    const labelHtml = label
      ? `<span class="status-badge__label">${label}</span>`
      : '';

    return `
      <span class="${classes}" role="status">
        <span class="status-badge__dot-wrapper" aria-hidden="true">
          <span class="status-badge__dot"></span>
          ${pulseHtml}
        </span>
        ${labelHtml}
      </span>
    `;
  }
}

defineElement('nc-status-badge', NcStatusBadge);
