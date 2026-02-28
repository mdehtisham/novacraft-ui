# `<nc-spinner>` — Component Documentation

## Overview

CSS-only animated loading indicator. No JavaScript animation frames — pure CSS
`@keyframes` rotation. Lightweight, accessible, and designed to sit inline beside
text (e.g. "Loading…").

---

## Architecture Decisions

| Decision | Rationale |
|---|---|
| **CSS-only animation** | `@keyframes spin` with `transform: rotate(360deg)` — no `requestAnimationFrame`. GPU-composited via the `transform` property. |
| **Border-based arc** | Uses `border-style: solid` with `border-top-color: transparent` to create the spinning arc. Crisp at all sizes with minimal DOM. |
| **Inline display** | `:host` uses `inline-flex` so the spinner sits naturally beside text. |
| **Shadow DOM** | Renders inside Shadow DOM via `NcBaseElement`. Styles are fully encapsulated. |

### Size & Stroke Maps

| Size token | Dimension | Border width |
|---|---|---|
| `xs` | 16 px | 2 px |
| `sm` | 20 px | 2 px |
| `md` | 24 px | 3 px |
| `lg` | 32 px | 3 px |
| `xl` | 48 px | 4 px |

---

## Data Flow

### Data In (Attributes)

| Attribute | Type | Default | Description |
|---|---|---|---|
| `size` | `xs \| sm \| md \| lg \| xl` | `md` | Controls width, height, and border-width |
| `variant` | `primary \| neutral \| white` | `primary` | Stroke/border color palette |
| `label` | `string` | `"Loading…"` | Screen-reader text via `aria-label` |

### Data Out

None — `<nc-spinner>` emits **no events**. It is a purely visual indicator.

### Slots

None.

---

## Internal Rendering

Shadow DOM structure produced by `render()`:

```html
<div
  class="spinner"
  role="status"
  aria-label="Loading…"
  style="width: 24px; height: 24px; border-width: 3px; --nc-spinner-color: …"
>
</div>
```

### Variant Color Resolution

| Variant | Resolved color |
|---|---|
| `primary` | `var(--nc-color-primary-500, #6366f1)` |
| `neutral` | `var(--nc-color-neutral-400, #9ca3af)` |
| `white` | `#ffffff` |

### CSS Animation

```css
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  border-color: var(--nc-spinner-color, var(--nc-color-primary-500, #6366f1));
  border-top-color: transparent;
  animation: spin 0.6s linear infinite;
}
```

---

## Extending Styles

### CSS Custom Properties

| Property | Effect | Default |
|---|---|---|
| `--nc-spinner-color` | Override the border/stroke color | Determined by `variant` |
| `--nc-color-primary-500` | Global design-token fallback for primary | `#6366f1` |
| `--nc-color-neutral-400` | Global design-token fallback for neutral | `#9ca3af` |

### Example Override

```css
nc-spinner {
  --nc-spinner-color: #ec4899; /* pink */
}
```

---

## Accessibility

- `role="status"` — announces to screen readers as a live region.
- `aria-label` defaults to `"Loading…"` ; override via the `label` attribute.
- Not focusable — the spinner is decorative/informational.
- **Tip:** pair with visually-hidden text for richer announcements when context
  matters (e.g. "Submitting form…").

---

## Usage Examples

### Basic

```html
<nc-spinner></nc-spinner>
```

### Custom Size & Variant

```html
<nc-spinner size="lg" variant="neutral"></nc-spinner>
```

### Inside a Button (loading state)

```html
<nc-button disabled>
  <nc-spinner size="sm" variant="white" label="Submitting…"></nc-spinner>
  Submitting…
</nc-button>
```

### Custom Color via CSS Property

```html
<nc-spinner style="--nc-spinner-color: #f59e0b;"></nc-spinner>
```

### All Sizes

```html
<nc-spinner size="xs"></nc-spinner>
<nc-spinner size="sm"></nc-spinner>
<nc-spinner size="md"></nc-spinner>
<nc-spinner size="lg"></nc-spinner>
<nc-spinner size="xl"></nc-spinner>
```

### React

```jsx
<nc-spinner size="md" variant="primary" label="Loading data…" />
```

### Angular

```html
<nc-spinner [attr.size]="spinnerSize" [attr.label]="loadingText"></nc-spinner>
```

---

## Consumer Projects

All four consumer projects use `<nc-spinner>`:

| Use case | Typical configuration |
|---|---|
| **Form submit loading** | `size="sm" variant="white"` inside a disabled button |
| **Data fetching indicators** | `size="md" variant="primary"` centered in a content area |
| **Button loading state** | `size="sm"` paired with label text, button set to `disabled` |
| **Skeleton / placeholder** | `size="lg" variant="neutral"` as a temporary content stand-in |

---

## Source Files

| File | Purpose |
|---|---|
| `spinner.ts` | Component class, styles, and render logic |
| `spinner.stories.ts` | Storybook stories (Default, Sizes, Variants) |
