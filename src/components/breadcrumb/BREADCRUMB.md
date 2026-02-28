# `<nc-breadcrumb>` — Component Documentation

## Overview

Navigation trail showing page hierarchy. `nc-breadcrumb` is the container with
a configurable separator; `nc-breadcrumb-item` is each path segment. The last
item is marked as the current page via the `current` attribute.

| Element               | Role                                        |
| --------------------- | ------------------------------------------- |
| `<nc-breadcrumb>`     | Container — manages separator configuration |
| `<nc-breadcrumb-item>`| Individual path segment (link or current)   |

---

## Architecture Decisions

1. **Separator via CSS** — Each `nc-breadcrumb-item` uses a `::after`
   pseudo-element to render the separator character. The last child hides it
   automatically via `:host(:last-child)::after { display: none }`. No extra
   DOM elements are needed.
2. **`current` attribute** — When present, the item renders as a `<span>` with
   `aria-current="page"` instead of a link. This should be placed on the last
   item to indicate the active page.
3. **`href` behaviour** — Items with `href` render an `<a>` pointing to that
   URL. Items without `href` (and without `current`) render an `<a href="#">`
   as a fallback.
4. **Separator propagation** — `nc-breadcrumb` sets the
   `--nc-breadcrumb-separator` CSS custom property on itself so all child items
   inherit the separator character without per-item attribute wiring.

---

## Data Flow

### Data In — `<nc-breadcrumb>`

| Attribute   | Type     | Default | Description                          |
| ----------- | -------- | ------- | ------------------------------------ |
| `separator` | `string` | `"/"`   | Visual separator character between items |

### Data In — `<nc-breadcrumb-item>`

| Attribute | Type      | Default | Description                                |
| --------- | --------- | ------- | ------------------------------------------ |
| `href`    | `string`  | —       | Link URL for this segment                  |
| `current` | `boolean` | `false` | Marks item as the current page (no link)   |

### Data Out

No custom events are emitted. Standard `click` events bubble from the anchor
elements inside each item and can be intercepted for SPA routing.

### Slots

| Component              | Slot        | Description                        |
| ---------------------- | ----------- | ---------------------------------- |
| `<nc-breadcrumb>`      | *(default)* | `nc-breadcrumb-item` children      |
| `<nc-breadcrumb-item>` | *(default)* | Label content (text, icons, etc.)  |

---

## Extending Styles

### CSS Custom Properties

| Property                       | Description                              |
| ------------------------------ | ---------------------------------------- |
| `--nc-breadcrumb-separator`    | Separator character (set by `separator` attribute) |
| `--nc-color-primary-600`       | Link color                               |
| `--nc-color-primary-700`       | Link hover color                         |
| `--nc-color-neutral-400`       | Separator color                          |
| `--nc-color-neutral-500`       | Current-page text color                  |
| `--nc-spacing-2`               | Inline margin around the separator       |
| `--nc-font-size-sm`            | Font size for items and separator        |

### Internal Classes (Shadow DOM)

| Class                         | Element              | Description          |
| ----------------------------- | -------------------- | -------------------- |
| `.breadcrumb-item__link`      | `<nc-breadcrumb-item>` | Anchor styling     |
| `.breadcrumb-item__current`   | `<nc-breadcrumb-item>` | Current-page span  |

---

## Accessibility

- `<nc-breadcrumb>` renders `<nav aria-label="Breadcrumb">` wrapping an `<ol>`.
- Ordered-list semantics (`ol > li` via slot projection) convey hierarchy.
- The `current` item outputs `aria-current="page"` so screen readers announce
  the user's location.
- Links receive visible focus via `box-shadow: var(--nc-focus-ring)` on
  `:focus-visible`.
- The current-page item is a `<span>`, not a link — it is not focusable or
  clickable, preventing "link to current page" anti-pattern.

---

## Usage Examples

### Basic

```html
<nc-breadcrumb>
  <nc-breadcrumb-item href="/">Home</nc-breadcrumb-item>
  <nc-breadcrumb-item href="/products">Products</nc-breadcrumb-item>
  <nc-breadcrumb-item current>Current Page</nc-breadcrumb-item>
</nc-breadcrumb>
```

### Custom Separator

```html
<nc-breadcrumb separator="›">
  <nc-breadcrumb-item href="/">Home</nc-breadcrumb-item>
  <nc-breadcrumb-item href="/products">Products</nc-breadcrumb-item>
  <nc-breadcrumb-item current>Current Page</nc-breadcrumb-item>
</nc-breadcrumb>
```

### With Icons

```html
<nc-breadcrumb>
  <nc-breadcrumb-item href="/">🏠 Home</nc-breadcrumb-item>
  <nc-breadcrumb-item href="/products">📦 Products</nc-breadcrumb-item>
  <nc-breadcrumb-item current>📄 Current Page</nc-breadcrumb-item>
</nc-breadcrumb>
```

### Deep Path (e.g. ShopWave)

```html
<nc-breadcrumb>
  <nc-breadcrumb-item href="/">Home</nc-breadcrumb-item>
  <nc-breadcrumb-item href="/catalog">Catalog</nc-breadcrumb-item>
  <nc-breadcrumb-item href="/catalog/electronics">Electronics</nc-breadcrumb-item>
  <nc-breadcrumb-item href="/catalog/electronics/computers">Computers</nc-breadcrumb-item>
  <nc-breadcrumb-item href="/catalog/electronics/computers/laptops">Laptops</nc-breadcrumb-item>
  <nc-breadcrumb-item current>UltraBook Pro 15</nc-breadcrumb-item>
</nc-breadcrumb>
```

### SPA Router Integration

```html
<nc-breadcrumb id="crumbs">
  <nc-breadcrumb-item href="/dashboard">Dashboard</nc-breadcrumb-item>
  <nc-breadcrumb-item href="/settings">Settings</nc-breadcrumb-item>
  <nc-breadcrumb-item current>Profile</nc-breadcrumb-item>
</nc-breadcrumb>

<script>
  document.getElementById('crumbs').addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link) {
      e.preventDefault();
      router.navigate(link.getAttribute('href'));
    }
  });
</script>
```

---

## Consumer Projects

| Project      | Usage                                                  |
| ------------ | ------------------------------------------------------ |
| **ShopWave** | Home › Category › Subcategory › Product breadcrumbs    |
| **TaskFlow** | Admin page hierarchy navigation                        |
