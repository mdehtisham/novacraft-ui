import { NcBaseElement } from '../../core/base-element';
import { defineElement } from '../../utils/helpers';

export class NcPagination extends NcBaseElement {
  static observedAttributes = ['total-pages', 'current-page', 'siblings'];

  static styles = `
    :host {
      display: block;
    }

    .pagination {
      display: flex;
      align-items: center;
      gap: var(--nc-spacing-1);
      font-family: var(--nc-font-family-sans);
      font-size: var(--nc-font-size-sm);
    }

    /* ─── Shared Button Base ─── */
    .pagination__btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 2rem;
      height: 2rem;
      padding: 0 var(--nc-spacing-2);
      border: 1px solid var(--nc-color-neutral-200);
      border-radius: var(--nc-radius-md);
      background-color: transparent;
      color: var(--nc-color-neutral-700);
      font-family: inherit;
      font-size: inherit;
      font-weight: var(--nc-font-weight-medium);
      line-height: var(--nc-line-height-tight);
      cursor: pointer;
      user-select: none;
      transition:
        background-color var(--nc-transition-fast),
        color var(--nc-transition-fast),
        border-color var(--nc-transition-fast),
        box-shadow var(--nc-transition-fast);
    }

    .pagination__btn:hover:not(:disabled):not(.pagination__btn--active) {
      background-color: var(--nc-color-neutral-100);
      border-color: var(--nc-color-neutral-300);
    }

    .pagination__btn:active:not(:disabled):not(.pagination__btn--active) {
      background-color: var(--nc-color-neutral-200);
    }

    .pagination__btn:focus-visible {
      outline: none;
      box-shadow: var(--nc-focus-ring-offset);
    }

    /* ─── Active Page ─── */
    .pagination__btn--active {
      background-color: var(--nc-color-primary-600);
      color: #fff;
      border-color: var(--nc-color-primary-600);
      cursor: default;
    }

    .pagination__btn--active:hover {
      background-color: var(--nc-color-primary-700);
      border-color: var(--nc-color-primary-700);
    }

    /* ─── Disabled State ─── */
    .pagination__btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* ─── Nav Buttons (Prev/Next) ─── */
    .pagination__nav {
      gap: var(--nc-spacing-1);
    }

    .pagination__nav svg {
      width: 1em;
      height: 1em;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    /* ─── Ellipsis ─── */
    .pagination__ellipsis {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 2rem;
      height: 2rem;
      color: var(--nc-color-neutral-400);
      font-size: inherit;
      user-select: none;
      letter-spacing: 0.1em;
    }
  `;

  /** Build the array of page numbers and ellipsis markers. */
  private _getPageRange(): (number | '...')[] {
    const total = this.getNumAttr('total-pages', 1);
    const current = this.getNumAttr('current-page', 1);
    const siblings = this.getNumAttr('siblings', 1);

    if (total <= 1) return [1];

    const range: (number | '...')[] = [];
    const leftSibling = Math.max(current - siblings, 2);
    const rightSibling = Math.min(current + siblings, total - 1);

    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < total - 1;

    // Always include first page
    range.push(1);

    if (showLeftEllipsis) {
      range.push('...');
    } else {
      // Fill pages between 1 and leftSibling
      for (let i = 2; i < leftSibling; i++) {
        range.push(i);
      }
    }

    // Sibling range (includes current)
    for (let i = leftSibling; i <= rightSibling; i++) {
      range.push(i);
    }

    if (showRightEllipsis) {
      range.push('...');
    } else {
      for (let i = rightSibling + 1; i < total; i++) {
        range.push(i);
      }
    }

    // Always include last page
    if (total > 1) {
      range.push(total);
    }

    return range;
  }

  protected render(): string {
    const total = this.getNumAttr('total-pages', 1);
    const current = this.getNumAttr('current-page', 1);
    const pages = this._getPageRange();

    const chevronLeft = `<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>`;
    const chevronRight = `<svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"></polyline></svg>`;

    const prevDisabled = current <= 1 ? 'disabled' : '';
    const nextDisabled = current >= total ? 'disabled' : '';

    const pageButtons = pages.map((p) => {
      if (p === '...') {
        return `<span class="pagination__ellipsis" part="ellipsis" aria-hidden="true">&hellip;</span>`;
      }
      const active = p === current ? ' pagination__btn--active' : '';
      const ariaCurrent = p === current ? ' aria-current="page"' : '';
      return `<button
        class="pagination__btn${active}"
        part="page"
        data-page="${p}"
        ${ariaCurrent}
        aria-label="Page ${p}"
      >${p}</button>`;
    }).join('\n');

    return `
      <nav class="pagination" part="base" role="navigation" aria-label="Pagination">
        <button
          class="pagination__btn pagination__nav"
          part="prev"
          data-action="prev"
          ${prevDisabled}
          aria-label="Previous page"
        >${chevronLeft}</button>
        ${pageButtons}
        <button
          class="pagination__btn pagination__nav"
          part="next"
          data-action="next"
          ${nextDisabled}
          aria-label="Next page"
        >${chevronRight}</button>
      </nav>
    `;
  }

  protected afterRender(): void {
    this.shadow.querySelectorAll<HTMLButtonElement>('.pagination__btn').forEach((btn) => {
      btn.addEventListener('click', this._handleClick);
    });
  }

  protected _cleanup(): void {
    this.shadow.querySelectorAll<HTMLButtonElement>('.pagination__btn').forEach((btn) => {
      btn.removeEventListener('click', this._handleClick);
    });
  }

  private _handleClick = (e: Event) => {
    const btn = e.currentTarget as HTMLButtonElement;
    if (btn.disabled) return;

    const total = this.getNumAttr('total-pages', 1);
    const current = this.getNumAttr('current-page', 1);
    let page: number;

    const action = btn.dataset.action;
    if (action === 'prev') {
      page = Math.max(1, current - 1);
    } else if (action === 'next') {
      page = Math.min(total, current + 1);
    } else {
      page = Number(btn.dataset.page);
    }

    if (page && page !== current) {
      this.setAttribute('current-page', String(page));
      this.emit('nc-page-change', { page });
    }
  };
}

defineElement('nc-pagination', NcPagination);
