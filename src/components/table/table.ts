import { NcBaseElement } from '../../core/base-element';
import { defineElement } from '../../utils/helpers';

interface ColumnDef {
  key: string;
  label: string;
  sortable?: boolean;
}

export class NcTable extends NcBaseElement {
  static observedAttributes = ['columns', 'data', 'striped', 'hoverable', 'compact', 'sortable'];

  static styles = `
    :host {
      display: block;
      font-family: var(--nc-font-family-sans);
      color: var(--nc-color-neutral-800);
    }

    /* ─── Base Table ─── */
    .table-wrapper {
      width: 100%;
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      font-size: var(--nc-font-size-sm);
      line-height: var(--nc-line-height-normal);
    }

    /* ─── Header ─── */
    thead {
      border-bottom: 2px solid var(--nc-color-neutral-200);
    }

    th {
      padding: var(--nc-spacing-3) var(--nc-spacing-4);
      text-align: left;
      font-weight: var(--nc-font-weight-semibold);
      color: var(--nc-color-neutral-600);
      font-size: var(--nc-font-size-xs);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
      user-select: none;
      background-color: var(--nc-color-neutral-50);
    }

    /* ─── Body ─── */
    td {
      padding: var(--nc-spacing-3) var(--nc-spacing-4);
      border-bottom: 1px solid var(--nc-color-neutral-100);
      color: var(--nc-color-neutral-700);
    }

    tr:last-child td {
      border-bottom: none;
    }

    /* ─── Sortable Headers ─── */
    th.sortable {
      cursor: pointer;
      transition: color var(--nc-transition-fast);
    }

    th.sortable:hover {
      color: var(--nc-color-primary-600);
    }

    .sort-arrow {
      display: inline-block;
      margin-left: var(--nc-spacing-1);
      vertical-align: middle;
    }

    .sort-arrow--asc::after {
      content: '';
      display: inline-block;
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 5px solid currentColor;
      vertical-align: middle;
    }

    .sort-arrow--desc::after {
      content: '';
      display: inline-block;
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 5px solid currentColor;
      vertical-align: middle;
    }

    .sort-arrow--idle::after {
      content: '';
      display: inline-block;
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 5px solid var(--nc-color-neutral-300);
      vertical-align: middle;
    }

    /* ─── Striped Variant ─── */
    :host([striped]) tbody tr:nth-child(even) td {
      background-color: var(--nc-color-neutral-50);
    }

    /* ─── Hoverable Variant ─── */
    :host([hoverable]) tbody tr {
      transition: background-color var(--nc-transition-fast);
    }

    :host([hoverable]) tbody tr:hover td {
      background-color: var(--nc-color-primary-50);
    }

    /* ─── Compact Variant ─── */
    :host([compact]) th {
      padding: var(--nc-spacing-1) var(--nc-spacing-2);
      font-size: var(--nc-font-size-xs);
    }

    :host([compact]) td {
      padding: var(--nc-spacing-1) var(--nc-spacing-2);
      font-size: var(--nc-font-size-xs);
    }

    /* ─── Empty State ─── */
    .table-empty {
      text-align: center;
      padding: var(--nc-spacing-6) var(--nc-spacing-4);
      color: var(--nc-color-neutral-400);
      font-style: italic;
    }
  `;

  private _sortColumn: string | null = null;
  private _sortDirection: 'asc' | 'desc' = 'asc';

  private get _columns(): ColumnDef[] {
    try {
      return JSON.parse(this.getStrAttr('columns', '[]'));
    } catch {
      return [];
    }
  }

  private get _data(): Record<string, unknown>[] {
    try {
      return JSON.parse(this.getStrAttr('data', '[]'));
    } catch {
      return [];
    }
  }

  private get _sortableEnabled(): boolean {
    return this.getBoolAttr('sortable');
  }

  private _getSortedData(): Record<string, unknown>[] {
    const data = [...this._data];
    if (!this._sortColumn) return data;

    const key = this._sortColumn;
    const dir = this._sortDirection === 'asc' ? 1 : -1;

    return data.sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return dir;
      if (bVal == null) return -dir;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * dir;
      }
      return String(aVal).localeCompare(String(bVal)) * dir;
    });
  }

  private _escapeHtml(value: unknown): string {
    const str = value == null ? '' : String(value);
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  protected render(): string {
    const columns = this._columns;
    const data = this._getSortedData();
    const sortable = this._sortableEnabled;

    if (columns.length === 0) {
      return `<div class="table-wrapper"><div class="table-empty">No columns defined</div></div>`;
    }

    const headerCells = columns.map((col) => {
      const isColSortable = sortable && col.sortable !== false;
      const sortClass = isColSortable ? ' sortable' : '';
      let arrowHtml = '';

      if (isColSortable) {
        if (this._sortColumn === col.key) {
          arrowHtml = `<span class="sort-arrow sort-arrow--${this._sortDirection}"></span>`;
        } else {
          arrowHtml = `<span class="sort-arrow sort-arrow--idle"></span>`;
        }
      }

      return `<th part="th" class="${sortClass}" data-key="${this._escapeHtml(col.key)}">${this._escapeHtml(col.label)}${arrowHtml}</th>`;
    }).join('');

    let bodyRows: string;
    if (data.length === 0) {
      bodyRows = `<tr part="tr"><td part="td" colspan="${columns.length}" class="table-empty">No data available</td></tr>`;
    } else {
      bodyRows = data.map((row) => {
        const cells = columns.map((col) =>
          `<td part="td">${this._escapeHtml(row[col.key])}</td>`
        ).join('');
        return `<tr part="tr">${cells}</tr>`;
      }).join('');
    }

    return `
      <div class="table-wrapper">
        <table part="table">
          <thead part="thead">
            <tr part="tr">${headerCells}</tr>
          </thead>
          <tbody part="tbody">
            ${bodyRows}
          </tbody>
        </table>
      </div>
    `;
  }

  protected afterRender(): void {
    if (!this._sortableEnabled) return;

    const headers = this.shadow.querySelectorAll('th.sortable');
    headers.forEach((th) => {
      th.addEventListener('click', this._handleSort);
    });
  }

  protected _cleanup(): void {
    const headers = this.shadow.querySelectorAll('th.sortable');
    headers.forEach((th) => {
      th.removeEventListener('click', this._handleSort);
    });
  }

  private _handleSort = (e: Event) => {
    const th = e.currentTarget as HTMLElement;
    const key = th.dataset.key;
    if (!key) return;

    if (this._sortColumn === key) {
      this._sortDirection = this._sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this._sortColumn = key;
      this._sortDirection = 'asc';
    }

    this.emit('nc-sort', { column: this._sortColumn, direction: this._sortDirection });

    // Re-render with new sort state
    const template = document.createElement('template');
    template.innerHTML = this.render();
    this.shadow.innerHTML = '';
    this.shadow.appendChild(template.content.cloneNode(true));
    this.afterRender();
  };
}

defineElement('nc-table', NcTable);
