# `<nc-status-badge>` — Component Documentation

## Overview

Color-coded status indicator with optional pulse animation for live/active states.
Combines a colored dot with a text label to convey entity state (success, danger,
pending, etc.). Purely presentational — no events emitted, no slots accepted.

---

## Architecture Decisions

- **Semantic status → color mapping** is baked into the component CSS. Consumers
  choose a meaning (`success`, `danger`, `pending`, …) and the component resolves
  the color. Direct color overrides are possible via CSS custom properties but the
  API intentionally steers toward semantic usage.
- **Pulse animation** is CSS-only (`@keyframes` with `transform: scale` and
  `opacity`). It is enabled per-instance with the `pulse` boolean attribute.
- **Text label is optional.** Omit the `label` attribute for a dot-only mode useful
  in compact displays (tables, lists, avatars).
- **`prefers-reduced-motion`** — consumers can layer a media-query override; the
  component itself uses a simple CSS animation that respects system settings when
  wrapped at the application level.

---

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | `'success' \| 'warning' \| 'danger' \| 'info' \| 'pending' \| 'processing'` | `'info'` | Semantic status that determines dot color. Invalid values fall back to `info`. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Controls dot diameter and font size. Invalid values fall back to `md`. |
| `pulse` | `boolean` | `false` | Enables a pulsing ring animation on the dot to draw attention. |
| `label` | `string` | — | Optional visible text beside the dot. When omitted, only the dot renders. |

---

## Data Flow

### Data In

All data flows in via HTML attributes listed above.

### Data Out

None — this is a purely presentational component. It emits no custom events.

### Slots

None — all content is driven by attributes.

---

## Internal Rendering

The component extends `NcBaseElement` and renders into Shadow DOM:

```
<span class="status-badge status-badge--{status} status-badge--{size}" role="status">
  <span class="status-badge__dot-wrapper" aria-hidden="true">
    <span class="status-badge__dot"></span>
    <!-- if pulse -->
    <span class="status-badge__pulse" aria-hidden="true"></span>
  </span>
  <!-- if label -->
  <span class="status-badge__label">{label}</span>
</span>
```

Key structural details:

- The outer `<span>` carries `role="status"` for assistive technology.
- The dot wrapper and pulse ring are `aria-hidden="true"` — color is never the
  sole indicator; it is always paired with the text label or the host-level role.
- The pulse ring is absolutely positioned over the dot and animated with
  `scale(1.6)` → `opacity: 0` on a 1.5 s loop.

---

## Extending Styles

### CSS Custom Properties

| Property | What it controls | Fallback |
|----------|-----------------|----------|
| `--nc-color-success-500` | Success dot color | `#22c55e` |
| `--nc-color-warning-500` | Warning dot color | `#f59e0b` |
| `--nc-color-danger-500` | Danger dot color | `#ef4444` |
| `--nc-color-info-500` | Info dot color | `#3b82f6` |
| `--nc-color-neutral-400` | Pending dot color | `#9ca3af` |
| `--nc-color-primary-500` | Processing dot color | `#6366f1` |
| `--nc-color-neutral-700` | Label text color | `#374151` |
| `--nc-spacing-2` | Gap between dot and label | `0.5rem` |
| `--nc-radius-full` | Dot border-radius | `9999px` |
| `--nc-font-size-xs` | Font size at `sm` | `0.75rem` |
| `--nc-font-size-sm` | Font size at `md` | `0.875rem` |
| `--nc-font-size-md` | Font size at `lg` | `1rem` |

### Size Reference

| Size | Dot diameter | Font size token |
|------|-------------|-----------------|
| `sm` | `0.375rem` | `--nc-font-size-xs` |
| `md` | `0.5rem` | `--nc-font-size-sm` |
| `lg` | `0.625rem` | `--nc-font-size-md` |

---

## Accessibility

- The dot wrapper is `aria-hidden="true"` — screen readers skip the visual
  indicator entirely.
- The wrapping `<span>` carries `role="status"`, making dynamic status changes
  announced by assistive technology as a live region.
- Color is **never** the sole indicator. Always pair the dot with a visible `label`
  or ensure surrounding context conveys the meaning.

---

## Usage Examples

### Basic with label

```html
<nc-status-badge status="success" label="Active"></nc-status-badge>
```

### Dot-only (compact)

```html
<nc-status-badge status="danger" size="sm"></nc-status-badge>
```

### Pulsing indicator

```html
<nc-status-badge status="processing" pulse label="Syncing…"></nc-status-badge>
```

### In a table row

```html
<tr>
  <td>api-gateway</td>
  <td><nc-status-badge status="success" size="sm" label="Healthy"></nc-status-badge></td>
</tr>
```

### React wrapper

```jsx
<NcStatusBadge status="warning" pulse label="Degraded" />
```

### Angular template

```html
<nc-status-badge [attr.status]="server.status" [attr.label]="server.statusText"></nc-status-badge>
```

---

## Consumer Projects

- **TaskFlow** — connection-status indicator (success/warning/danger) in the
  header bar; user-presence dots beside avatars.
- **ShopWave** — order-status badges in the admin table (pending → processing →
  success for delivered; danger for cancelled).
