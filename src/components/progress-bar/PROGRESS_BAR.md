# `<nc-progress-bar>` — Component Documentation

## Overview

Horizontal progress indicator with determinate (0–100%) and indeterminate modes.
CSS-only animations — no JavaScript timers. Used for upload progress, token budgets,
and step completion.

---

## Architecture Decisions

| Decision | Rationale |
|---|---|
| **CSS-only animation** | Indeterminate mode uses `@keyframes indeterminate` with `translateX`. GPU-composited via `transform`. |
| **Determinate width** | Fill width set via inline `style="width: {value}%"`. The `transition` property animates width changes smoothly. |
| **Indeterminate trigger** | When `value` attribute is absent or empty, the bar enters indeterminate mode automatically. |
| **Shadow DOM** | Renders inside Shadow DOM via `NcBaseElement`. Styles are fully encapsulated. |
| **Width is always 100%** | `:host` is `display: block; width: 100%` — the bar fills its container. Size controls height only. |

### Size Map

| Size token | Height |
|---|---|
| `sm` | 4 px |
| `md` | 8 px |
| `lg` | 12 px |

### Variant Colors

| Variant | Resolved color |
|---|---|
| `primary` | `var(--nc-color-primary-500, #6366f1)` |
| `success` | `var(--nc-color-success-500, #22c55e)` |
| `warning` | `var(--nc-color-warning-500, #f59e0b)` |
| `danger` | `var(--nc-color-danger-500, #ef4444)` |

---

## Data Flow

### Data In (Attributes)

| Attribute | Type | Default | Description |
|---|---|---|---|
| `value` | `number \| null` | `null` | Current progress 0–100. Omit for indeterminate mode. Clamped to `[0, 100]`. |
| `variant` | `primary \| success \| warning \| danger` | `primary` | Fill color palette |
| `size` | `sm \| md \| lg` | `md` | Controls track height |
| `show-label` | `boolean` | `false` | When present, renders the percentage text beside the bar |

### Data Out

None — `<nc-progress-bar>` emits **no events**. It is purely presentational.

### Slots

None.

---

## Internal Rendering

Shadow DOM structure produced by `render()`:

```html
<div class="progress">
  <div
    class="progress__track progress__track--md"
    role="progressbar"
    aria-valuenow="45"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div class="progress__fill progress__fill--primary" style="width: 45%"></div>
  </div>
  <!-- only when show-label is set -->
  <span class="progress__label" aria-hidden="true">45%</span>
</div>
```

### Indeterminate Mode

When `value` is omitted, `aria-valuenow` is removed (implicitly indeterminate per
WAI-ARIA spec) and the fill receives `.progress__fill--indeterminate`:

```css
.progress__fill--indeterminate {
  width: 33%;
  position: absolute;
  animation: indeterminate 1.4s ease-in-out infinite;
}
```

The label is hidden in indeterminate mode.

---

## Extending Styles

### CSS Custom Properties

| Property | Effect | Default |
|---|---|---|
| `--nc-color-neutral-200` | Track background color | `#e5e7eb` |
| `--nc-color-primary-500` | Primary fill color | `#6366f1` |
| `--nc-color-success-500` | Success fill color | `#22c55e` |
| `--nc-color-warning-500` | Warning fill color | `#f59e0b` |
| `--nc-color-danger-500` | Danger fill color | `#ef4444` |
| `--nc-radius-full` | Track & fill border-radius | `9999px` |
| `--nc-transition-normal` | Determinate fill transition duration | `0.3s` |
| `--nc-color-neutral-700` | Label text color | `#374151` |
| `--nc-font-size-sm` | Label font size | `0.875rem` |

### Example Override

```css
nc-progress-bar {
  --nc-color-primary-500: #ec4899; /* pink fill */
  --nc-color-neutral-200: #1e293b; /* dark track */
}
```

---

## Accessibility

- `role="progressbar"` on the track element.
- `aria-valuenow` set to current value; `aria-valuemin="0"`, `aria-valuemax="100"`.
- **Indeterminate:** `aria-valuenow` is omitted — screen readers announce the bar as
  indeterminate per WAI-ARIA spec.
- Label text is `aria-hidden="true"` (the `aria-valuenow` conveys the same info).

---

## Usage Examples

### Basic Determinate

```html
<nc-progress-bar value="60"></nc-progress-bar>
```

### With Label

```html
<nc-progress-bar value="75" show-label></nc-progress-bar>
```

### Indeterminate

```html
<nc-progress-bar></nc-progress-bar>
```

### Variant & Size

```html
<nc-progress-bar value="90" variant="warning" size="lg"></nc-progress-bar>
<nc-progress-bar value="100" variant="success" size="sm"></nc-progress-bar>
<nc-progress-bar variant="danger" size="lg"></nc-progress-bar>
```

### React

```jsx
<nc-progress-bar value={progress} variant="primary" show-label />
```

### Angular

```html
<nc-progress-bar [attr.value]="uploadPercent" [attr.variant]="barVariant" show-label></nc-progress-bar>
```

---

## Consumer Projects

| Project | Use case | Typical configuration |
|---|---|---|
| **InkFlow** | AI token budget indicator | `variant="warning"` with dynamic `value`, `show-label` |
| **ShopWave** | Upload progress | `variant="primary"` with `show-label` |
| **ShopWave** | Checkout step progress | `variant="success"` at step completion |

---

## Source Files

| File | Purpose |
|---|---|
| `progress-bar.ts` | Component class, styles, and render logic |
| `progress-bar.stories.ts` | Storybook stories |
