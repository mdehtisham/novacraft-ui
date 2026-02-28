# `<nc-toggle>` — Component Documentation

## Overview

On/off switch control with smooth CSS animation. Used for binary settings like
enable/disable, show/hide, active/inactive. Visually distinct from a checkbox —
represents an **instant state change** (not a deferred form submit).

---

## Architecture Decisions

| Decision | Rationale |
|---|---|
| `role="switch"` (not checkbox) | Semantically correct for instant-effect toggles per WAI-ARIA Switch pattern. |
| CSS `transform: translateX()` for thumb slide | GPU-composited property — guarantees 60 fps animation. |
| Integrated label | Appears beside toggle; clicking the label activates the toggle. |
| No form participation by default | Toggles are typically instant-effect, not submitted with a form. Opt-in possible via `ElementInternals`. |
| Three sizes (`sm` \| `md` \| `lg`) | Supports compact settings lists through to prominent feature toggles. |

---

## API

### Attributes / Properties

| Attribute  | Type      | Default | Description |
|------------|-----------|---------|-------------|
| `checked`  | `boolean` | `false` | Whether the toggle is on. |
| `label`    | `string`  | —       | Visible label text beside the toggle. |
| `size`     | `string`  | `"md"`  | Toggle size: `sm`, `md`, or `lg`. |
| `disabled` | `boolean` | `false` | Disables interaction. |
| `name`     | `string`  | —       | Optional name stored as `data-name` on the track. |
| `value`    | `string`  | —       | Optional value stored as `data-value` on the track. |

### Events

| Event       | Detail              | Description |
|-------------|---------------------|-------------|
| `nc-change` | `{ checked: boolean }` | Fires when the toggle state changes. |

### Slots

| Slot        | Description |
|-------------|-------------|
| *(default)* | Label content (alternative to the `label` attribute). |

---

## Internal Rendering

Shadow DOM structure:

```
label  part="base"
├── span.toggle__track  part="track"  role="switch"  aria-checked
│   └── span.toggle__thumb  part="thumb"
└── span.toggle__label  part="label"
    └── <slot>
```

---

## Extending Styles

### CSS Custom Properties

| Property | Description |
|---|---|
| `--nc-toggle-track-width` | Track width override. |
| `--nc-toggle-track-height` | Track height override. |
| `--nc-toggle-track-bg` | Unchecked track background color. |
| `--nc-toggle-track-checked-bg` | Checked track background color. |
| `--nc-toggle-thumb-size` | Thumb diameter. |
| `--nc-toggle-thumb-color` | Thumb fill color. |

### CSS Parts

| Part    | Element |
|---------|---------|
| `base`  | Outer `<label>` wrapper. |
| `track` | The sliding track (`<span>` with `role="switch"`). |
| `thumb` | The circular thumb indicator. |
| `label` | The label text container. |

```css
nc-toggle::part(track) {
  border-radius: 4px;
}
nc-toggle::part(thumb) {
  background: var(--nc-color-accent-200);
}
```

---

## Accessibility

- **Role:** `role="switch"` with `aria-checked="true|false"`.
- **Keyboard:** `Space` or `Enter` toggles state (handled by the internal
  `<span>` with `tabindex`).
- **Label:** `aria-label` sourced from the `label` prop (falls back to
  `"Toggle"`).
- **Disabled:** `aria-disabled` implied via `tabindex="-1"` and reduced opacity.
- **Focus ring:** visible `box-shadow` on `:focus-visible` using
  `--nc-focus-ring-offset`.

---

## Usage Examples

### Basic

```html
<nc-toggle></nc-toggle>
```

### Checked

```html
<nc-toggle checked></nc-toggle>
```

### Disabled

```html
<nc-toggle disabled></nc-toggle>
<nc-toggle checked disabled></nc-toggle>
```

### With Label & Size

```html
<nc-toggle label="Dark mode" size="sm"></nc-toggle>
<nc-toggle label="Notifications" size="lg" checked></nc-toggle>
```

### Listening for Changes

```html
<nc-toggle
  label="Enable alerts"
  onnc-change="console.log(event.detail.checked)"
></nc-toggle>
```

### React

```jsx
function Settings() {
  const [on, setOn] = useState(false);
  return (
    <nc-toggle
      label="Auto-save"
      checked={on || undefined}
      onNcChange={(e) => setOn(e.detail.checked)}
    />
  );
}
```

### Angular

```html
<nc-toggle
  label="Push notifications"
  [attr.checked]="pushEnabled ? '' : null"
  (nc-change)="pushEnabled = $event.detail.checked"
></nc-toggle>
```

---

## Consumer Projects

| Project   | Usage |
|-----------|-------|
| **TaskFlow**  | Notification settings, board archive toggle. |
| **ShopWave** | In-stock filter toggle, admin publish/draft toggle, notification preferences. |
