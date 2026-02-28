# `<nc-checkbox>` — Component Documentation

## Overview

Custom-styled checkbox supporting checked, unchecked, and indeterminate states.
Replaces the native checkbox for consistent cross-browser styling while preserving
keyboard navigation, form participation, and accessibility.

---

## Architecture Decisions

| Decision | Rationale |
|---|---|
| Hidden native `<input type="checkbox">` in Shadow DOM | Free browser keyboard behavior (Space to toggle), form participation, and accessibility |
| Custom visual via styled `<span>` overlay | SVG check icon (checked) and dash icon (indeterminate) for pixel-perfect rendering |
| Indeterminate set via property only | No HTML attribute exists for indeterminate natively; visual is a horizontal dash |
| Label is part of the component | Click anywhere on label or checkbox to toggle |
| `ElementInternals` for form value reporting | Allows the component to participate in `<form>` submission natively |

---

## Data Flow

### Data In (Properties / Attributes)

| Property | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | `false` | Whether the checkbox is checked |
| `indeterminate` | `boolean` | `false` | Whether the checkbox shows the indeterminate (dash) state |
| `label` | `string` | `""` | Text label displayed next to the checkbox |
| `value` | `string` | `"on"` | Form value submitted when checked |
| `disabled` | `boolean` | `false` | Disables interaction |
| `name` | `string` | `""` | Form control name |

### Data Out (Events)

| Event | Detail | Description |
|---|---|---|
| `nc-change` | `{ checked: boolean, value: string }` | Fires on every toggle |

### Slots

| Slot | Description |
|---|---|
| *(default)* | Label content — alternative to the `label` attribute; allows rich content such as links |

---

## Internal Rendering

```
Shadow DOM
└─ label part="base"
   ├─ input[type="checkbox"] (hidden, sr-only)
   ├─ span.checkmark part="checkmark"
   │  └─ <svg> (check icon or dash icon)
   └─ span.label part="label"
      └─ <slot>
```

---

## Extending Styles

### CSS Custom Properties

| Property | Default | Description |
|---|---|---|
| `--nc-checkbox-size` | `18px` | Box size |
| `--nc-checkbox-radius` | `4px` | Border radius |
| `--nc-checkbox-checked-bg` | — | Background color when checked |
| `--nc-checkbox-checked-color` | — | Check/dash icon color |

### CSS Parts

| Part | Element |
|---|---|
| `base` | Outer `<label>` wrapper |
| `checkmark` | Visual checkbox box |
| `label` | Label text wrapper |

```css
nc-checkbox::part(checkmark) {
  border: 2px solid #6366f1;
}
nc-checkbox {
  --nc-checkbox-size: 22px;
  --nc-checkbox-checked-bg: #6366f1;
}
```

---

## Accessibility

- **Keyboard** — Native `<input>` handles Space to toggle and Tab to focus.
- **`aria-checked`** — Reflects `"true"`, `"false"`, or `"mixed"` (indeterminate).
- **Label wraps input** — Click target includes the text.
- **Disabled** — Sets `aria-disabled="true"` with visual opacity reduction.
- **Focus ring** — Visible on keyboard focus (`:focus-visible`).

---

## Usage Examples

### Basic

```html
<nc-checkbox label="Accept terms"></nc-checkbox>
```

### Checked

```html
<nc-checkbox label="Receive emails" checked></nc-checkbox>
```

### Indeterminate

```html
<nc-checkbox id="parent" label="Select all"></nc-checkbox>
<script>
  document.getElementById('parent').indeterminate = true;
</script>
```

### Disabled

```html
<nc-checkbox label="Locked option" disabled checked></nc-checkbox>
```

### Rich Label (Slot)

```html
<nc-checkbox>
  I agree to the <a href="/terms">Terms of Service</a>
</nc-checkbox>
```

### Inside a Form

```html
<form>
  <nc-checkbox name="newsletter" value="yes" label="Subscribe"></nc-checkbox>
  <button type="submit">Submit</button>
</form>
```

### React

```jsx
<NcCheckbox
  label="Enable notifications"
  checked={isChecked}
  onNcChange={(e) => setIsChecked(e.detail.checked)}
/>
```

### Angular

```html
<nc-checkbox
  label="Dark mode"
  [checked]="darkMode"
  (nc-change)="darkMode = $event.detail.checked">
</nc-checkbox>
```

---

## Consumer Projects

### ShopWave

- **Filter checkboxes** — Category and in-stock filters in product listings.
- **Admin bulk select** — Indeterminate state on "select all" when partial rows selected.
- **Checkout agree-to-terms** — Rich label slot with link to terms page.

### TaskFlow

- **Task checklist items** — Individual task completion toggles.
- **Bulk actions** — Select-all with indeterminate header checkbox.
- **Settings toggles** — Preference checkboxes in user settings panel.
