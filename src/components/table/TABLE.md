# `<nc-table>` — Component Documentation

## Overview

Styled table wrapper with striped rows, hover highlight, compact mode, and
sortable headers. Wraps semantic HTML table elements inside Shadow DOM for
consistent styling without global CSS conflicts.

## Architecture Decisions

- **Wraps native table semantics:** `nc-table` renders `<table>`,
  `nc-table-head` → `<thead>`, `nc-table-body` → `<tbody>`,
  `nc-table-row` → `<tr>`, `nc-table-cell` → `<td>`,
  `nc-table-header-cell` → `<th>`. Preserves semantics for screen readers.
- **Slot-based:** All table content is slotted from light DOM into the Shadow
  DOM table structure. The component provides styling; consumers provide data.
- **Sortable headers:** `nc-table-header-cell` with the `sortable` attribute
  shows a sort arrow. Clicking cycles: ascending → descending → none. Emits an
  `nc-sort` event. The component does **not** sort data — the consumer handles
  sorting.
- **Striped / hoverable / compact:** CSS class toggles on the `<table>` element.
  No JS required for these features.
- **No built-in virtualization.** For large datasets, consumers should wrap with
  `react-window` or CDK virtual scroll. `nc-table` handles 100–200 rows well.

## Data Flow

### Data In — `nc-table`

| Attribute   | Type    | Default |
|-------------|---------|---------|
| `striped`   | boolean | `false` |
| `hoverable` | boolean | `false` |
| `compact`   | boolean | `false` |

### Data In — `nc-table-header-cell`

| Attribute        | Type                        | Default  |
|------------------|-----------------------------|----------|
| `sortable`       | boolean                     | `false`  |
| `sort-direction` | `"asc"` \| `"desc"` \| `"none"` | `"none"` |
| `align`          | `"left"` \| `"center"` \| `"right"` | `"left"` |

### Data In — `nc-table-cell`

| Attribute | Type                                 | Default  |
|-----------|--------------------------------------|----------|
| `align`   | `"left"` \| `"center"` \| `"right"` | `"left"` |

### Data Out

| Event     | Source     | Detail                                                        |
|-----------|------------|---------------------------------------------------------------|
| `nc-sort` | `nc-table` | `{ column: string, direction: "asc" \| "desc" \| "none" }` |

Fires when a sortable header cell is clicked.

### Slots

| Element                | Slot        | Expected Content                       |
|------------------------|-------------|----------------------------------------|
| `nc-table`             | *(default)* | `nc-table-head` + `nc-table-body`      |
| `nc-table-head`        | *(default)* | `nc-table-row` with header cells       |
| `nc-table-body`        | *(default)* | `nc-table-row` elements                |
| `nc-table-row`         | *(default)* | `nc-table-cell` or `nc-table-header-cell` |
| `nc-table-cell`        | *(default)* | Any inline/block content               |
| `nc-table-header-cell` | *(default)* | Header label text/content              |

## Extending Styles

### CSS Custom Properties

| Property                       | Description              |
|--------------------------------|--------------------------|
| `--nc-table-border-color`      | Border color             |
| `--nc-table-stripe-bg`         | Striped-row background   |
| `--nc-table-hover-bg`          | Hovered-row background   |
| `--nc-table-header-bg`         | Header background        |
| `--nc-table-header-font-weight`| Header font weight       |
| `--nc-table-cell-padding`      | Cell padding             |
| `--nc-table-font-size`         | Base font size           |

### CSS Shadow Parts

```
::part(table)  ::part(thead)  ::part(tbody)
::part(tr)     ::part(th)     ::part(td)
::part(sort-icon)
```

## Accessibility

- Native table semantics preserved (`<table>`, `<thead>`, `<th>`, etc.).
- Sortable headers expose `aria-sort="ascending|descending|none"`.
- `scope="col"` set on header cells.
- Caption support via `nc-table-caption` or `aria-label` on `nc-table`.

## Usage Examples

### Basic Table

```html
<nc-table striped hoverable>
  <nc-table-head>
    <nc-table-row>
      <nc-table-header-cell>Name</nc-table-header-cell>
      <nc-table-header-cell>Email</nc-table-header-cell>
    </nc-table-row>
  </nc-table-head>
  <nc-table-body>
    <nc-table-row>
      <nc-table-cell>Alice</nc-table-cell>
      <nc-table-cell>alice@example.com</nc-table-cell>
    </nc-table-row>
  </nc-table-body>
</nc-table>
```

### Sortable Headers

```html
<nc-table @nc-sort=${this.handleSort}>
  <nc-table-head>
    <nc-table-row>
      <nc-table-header-cell sortable sort-direction="asc">
        Name
      </nc-table-header-cell>
      <nc-table-header-cell sortable>
        Date
      </nc-table-header-cell>
    </nc-table-row>
  </nc-table-head>
  <!-- body rows populated by consumer after sorting -->
</nc-table>
```

### Compact + Right-Aligned

```html
<nc-table compact>
  <nc-table-head>
    <nc-table-row>
      <nc-table-header-cell>Item</nc-table-header-cell>
      <nc-table-header-cell align="right">Price</nc-table-header-cell>
    </nc-table-row>
  </nc-table-head>
  <nc-table-body>
    <nc-table-row>
      <nc-table-cell>Widget</nc-table-cell>
      <nc-table-cell align="right">$9.99</nc-table-cell>
    </nc-table-row>
  </nc-table-body>
</nc-table>
```

## Consumer Projects

- **ShopWave** — product list, order list, user list (admin panel)
- **TaskFlow** — activity log table view
