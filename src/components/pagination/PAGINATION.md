# `<nc-pagination>` — Component Documentation

## Overview

Page navigation with numbered buttons, previous/next chevrons, and smart ellipsis.
Purely presentational — does not fetch data, just emits page-change events for the
consumer to react to.

---

## Architecture Decisions

| Decision | Rationale |
|---|---|
| **Smart ellipsis** | Shows current page ± `siblings` pages, with `…` for skipped ranges. E.g., `1 … 4 5 [6] 7 8 … 20`. |
| **Prev / Next always visible** | Disabled at boundaries (`page 1` / last page) instead of hidden, so layout stays stable. |
| **First & last page always shown** | Anchors for the range — users can always jump to the extremes. |
| **No data fetching** | Consumer handles fetching on `nc-page-change`. This component is purely navigation UI. |
| **Page count is an attribute** | Consumer provides `total-pages` directly. Component does not derive it from item count + page size. |

---

## Data Flow

### Attributes (Data In)

| Attribute | Type | Default | Description |
|---|---|---|---|
| `total-pages` | `number` | `1` | Total number of pages. |
| `current-page` | `number` | `1` | The currently active page (1-based). |
| `siblings` | `number` | `1` | How many pages to show on each side of the current page before ellipsis kicks in. |

All three are observed — changing any attribute re-renders the component.

### Events (Data Out)

| Event | Detail | When |
|---|---|---|
| `nc-page-change` | `{ page: number }` | Fires when any page button, prev, or next is clicked **and** the target page differs from `current-page`. The component also updates its own `current-page` attribute. |

### Slots

None — fully rendered from attributes.

---

## Internal Rendering

Shadow DOM structure:

```
nav.pagination [part="base"] [role="navigation"] [aria-label="Pagination"]
├── button.pagination__btn.pagination__nav [part="prev"]   ← chevron-left SVG
├── button.pagination__btn [part="page"]                   ← page 1 (always)
├── span.pagination__ellipsis [part="ellipsis"]            ← left "…" (conditional)
├── button.pagination__btn [part="page"]                   ← sibling pages …
├── button.pagination__btn.pagination__btn--active [part="page"] [aria-current="page"]
├── button.pagination__btn [part="page"]                   ← sibling pages …
├── span.pagination__ellipsis [part="ellipsis"]            ← right "…" (conditional)
├── button.pagination__btn [part="page"]                   ← last page (always)
└── button.pagination__btn.pagination__nav [part="next"]   ← chevron-right SVG
```

### Ellipsis Algorithm (`_getPageRange`)

1. Always include page **1** and page **total**.
2. Compute `leftSibling = max(current - siblings, 2)` and
   `rightSibling = min(current + siblings, total - 1)`.
3. If `leftSibling > 2` → insert left `…`; otherwise fill pages `2 … leftSibling-1`.
4. Render `leftSibling … rightSibling` (includes current page).
5. If `rightSibling < total - 1` → insert right `…`; otherwise fill pages `rightSibling+1 … total-1`.

---

## Extending Styles

### CSS Custom Properties

| Token | What it affects |
|---|---|
| `--nc-spacing-1` | Gap between buttons |
| `--nc-spacing-2` | Horizontal padding inside buttons |
| `--nc-color-primary-600 / 700` | Active-page background + border |
| `--nc-color-neutral-100 / 200 / 300 / 400 / 700` | Default, hover, and disabled colours |
| `--nc-radius-md` | Button border-radius |
| `--nc-transition-fast` | Hover / focus transition speed |
| `--nc-focus-ring-offset` | Focus-visible ring |

### Shadow Parts

| Part | Element |
|---|---|
| `base` | `<nav>` wrapper |
| `prev` | Previous button |
| `next` | Next button |
| `page` | Each numbered page button |
| `ellipsis` | Each `…` span |

```css
/* Example: larger buttons, custom active colour */
nc-pagination::part(page) {
  min-width: 2.5rem;
  height: 2.5rem;
}
nc-pagination::part(page):where([aria-current="page"]) {
  background-color: var(--nc-color-accent-500);
}
```

---

## Accessibility

- `nav[role="navigation"][aria-label="Pagination"]`
- Active page carries `aria-current="page"`
- Previous / Next buttons: `aria-label="Previous page"` / `"Next page"`
- Disabled prev/next use the native `disabled` attribute (removes from tab order)
- Ellipsis spans are `aria-hidden="true"`
- All page buttons have `aria-label="Page N"`
- Focus-visible ring via `--nc-focus-ring-offset`

---

## Usage Examples

### Basic

```html
<nc-pagination total-pages="20" current-page="6"></nc-pagination>
```

### More Siblings

```html
<nc-pagination total-pages="50" current-page="25" siblings="2"></nc-pagination>
<!-- Renders: 1 … 23 24 [25] 26 27 … 50 -->
```

### Listening for Page Changes

```js
document.querySelector('nc-pagination')
  .addEventListener('nc-page-change', (e) => {
    console.log('Go to page', e.detail.page);
    fetchResults(e.detail.page);
  });
```

### Consumer Projects

| Project | Where used |
|---|---|
| **ShopWave** | Product listing, order history, admin tables |
| **InkFlow** | Search results, article list |
