import { NcBaseElement } from '../../core/base-element';
import { defineElement } from '../../utils/helpers';

export class NcStarRating extends NcBaseElement {
  static observedAttributes = ['value', 'max', 'size', 'readonly', 'half', 'name'];

  private _hoverValue: number | null = null;

  static styles = `
    :host {
      display: inline-flex;
    }

    .star-rating {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      line-height: 1;
    }

    .star-rating--sm .star { width: 16px; height: 16px; }
    .star-rating--md .star { width: 24px; height: 24px; }
    .star-rating--lg .star { width: 32px; height: 32px; }

    .star {
      cursor: pointer;
      transition: transform 150ms ease, filter 150ms ease;
      flex-shrink: 0;
    }

    .star:hover { transform: scale(1.15); }

    .star-rating--readonly .star {
      cursor: default;
      pointer-events: none;
    }

    .star-rating:focus-visible {
      outline: 2px solid var(--nc-color-primary-500, #6366f1);
      outline-offset: 4px;
      border-radius: 4px;
    }

    .star svg {
      display: block;
      width: 100%;
      height: 100%;
    }
  `;

  protected render(): string {
    const value = this._hoverValue ?? this.getNumAttr('value', 0);
    const max = this.getNumAttr('max', 5);
    const size = this.getStrAttr('size', 'md');
    const isReadonly = this.getBoolAttr('readonly');
    const halfEnabled = this.getBoolAttr('half');
    const name = this.getStrAttr('name');
    const displayValue = isReadonly
      ? this.getNumAttr('value', 0)
      : value;

    const classes = [
      'star-rating',
      `star-rating--${size}`,
      isReadonly ? 'star-rating--readonly' : '',
    ].filter(Boolean).join(' ');

    let stars = '';
    for (let i = 1; i <= max; i++) {
      const fill = displayValue >= i
        ? 'full'
        : (halfEnabled || isReadonly) && displayValue >= i - 0.5
          ? 'half'
          : 'empty';
      stars += `<span class="star" data-index="${i}">${this._starSvg(fill)}</span>`;
    }

    return `
      <div
        class="${classes}"
        part="base"
        role="slider"
        tabindex="${isReadonly ? '-1' : '0'}"
        aria-valuenow="${this.getNumAttr('value', 0)}"
        aria-valuemin="0"
        aria-valuemax="${max}"
        aria-label="${name || 'Star rating'}"
        ${name ? `data-name="${name}"` : ''}
      >${stars}</div>
    `;
  }

  protected afterRender(): void {
    const container = this.shadow.querySelector('.star-rating') as HTMLElement | null;
    if (!container || this.getBoolAttr('readonly')) return;

    container.addEventListener('click', this._handleClick);
    container.addEventListener('mousemove', this._handleMouseMove);
    container.addEventListener('mouseleave', this._handleMouseLeave);
    container.addEventListener('keydown', this._handleKeydown);
  }

  protected _cleanup(): void {
    const container = this.shadow.querySelector('.star-rating') as HTMLElement | null;
    if (!container) return;

    container.removeEventListener('click', this._handleClick);
    container.removeEventListener('mousemove', this._handleMouseMove);
    container.removeEventListener('mouseleave', this._handleMouseLeave);
    container.removeEventListener('keydown', this._handleKeydown);
  }

  private _getValueFromStar(star: HTMLElement, e: MouseEvent): number {
    const index = Number(star.dataset.index);
    if (!this.getBoolAttr('half')) return index;

    const rect = star.getBoundingClientRect();
    const isLeftHalf = (e.clientX - rect.left) < rect.width / 2;
    return isLeftHalf ? index - 0.5 : index;
  }

  private _handleClick = (e: MouseEvent) => {
    const star = (e.target as HTMLElement).closest('.star') as HTMLElement | null;
    if (!star) return;

    const newValue = this._getValueFromStar(star, e);
    this._hoverValue = null;
    this.setAttribute('value', String(newValue));
    this.emit('nc-change', { value: newValue });
  };

  private _handleMouseMove = (e: MouseEvent) => {
    const star = (e.target as HTMLElement).closest('.star') as HTMLElement | null;
    if (!star) return;

    this._hoverValue = this._getValueFromStar(star, e);
    this._rerenderStars();
  };

  private _handleMouseLeave = () => {
    this._hoverValue = null;
    this._rerenderStars();
  };

  private _handleKeydown = (e: Event) => {
    const key = (e as KeyboardEvent).key;
    const max = this.getNumAttr('max', 5);
    const step = this.getBoolAttr('half') ? 0.5 : 1;
    let value = this.getNumAttr('value', 0);

    switch (key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        value = Math.min(value + step, max);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        value = Math.max(value - step, 0);
        break;
      case 'Home':
        e.preventDefault();
        value = 0;
        break;
      case 'End':
        e.preventDefault();
        value = max;
        break;
      default:
        return;
    }

    this.setAttribute('value', String(value));
    this.emit('nc-change', { value });
  };

  /** Re-render only the star SVGs without a full shadow DOM rebuild. */
  private _rerenderStars(): void {
    const container = this.shadow.querySelector('.star-rating');
    if (!container) return;

    const displayValue = this._hoverValue ?? this.getNumAttr('value', 0);
    const halfEnabled = this.getBoolAttr('half');
    const stars = container.querySelectorAll('.star');

    stars.forEach((star) => {
      const i = Number((star as HTMLElement).dataset.index);
      const fill = displayValue >= i
        ? 'full'
        : halfEnabled && displayValue >= i - 0.5
          ? 'half'
          : 'empty';
      star.innerHTML = this._starSvg(fill);
    });
  }

  private _starSvg(fill: 'full' | 'half' | 'empty'): string {
    const gold = '#f59e0b';
    const gray = '#d1d5db';

    if (fill === 'full') {
      return `<svg viewBox="0 0 24 24" fill="${gold}" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/>
      </svg>`;
    }

    if (fill === 'half') {
      return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="half-grad">
            <stop offset="50%" stop-color="${gold}"/>
            <stop offset="50%" stop-color="${gray}"/>
          </linearGradient>
        </defs>
        <path fill="url(#half-grad)" d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/>
      </svg>`;
    }

    return `<svg viewBox="0 0 24 24" fill="${gray}" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/>
    </svg>`;
  }
}

defineElement('nc-star-rating', NcStarRating);
