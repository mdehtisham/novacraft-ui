# `<nc-radio-group>` + `<nc-radio>` — Component Documentation

> **Package:** `@novacraft/core` · **Path:** `src/components/radio/radio.ts`
> **Custom Elements:** `nc-radio-group`, `nc-radio`

---

## Overview

Radio button group for mutually exclusive single selection.
`nc-radio-group` manages selection state; `nc-radio` children are individual options.
Custom-styled with native keyboard behavior — no hidden `<input>` elements involved.

---

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Two-element pattern** | `nc-radio-group` owns the selected `value`; `nc-radio` is a passive child. The group listens for `nc-radio-select` events from children and manages exclusivity. |
| **No hidden native `<input>`** | Each `nc-radio` renders a `div[role="radio"]` with `aria-checked` instead of a native `<input type="radio">`. Keyboard behavior is implemented manually. |
| **Roving tabindex** | Managed by the group. The selected (or focused) radio has `tabindex="0"`; others get `tabindex="-1"`. Arrow Up/Down cycles through enabled options. |
| **Custom visual** | Circle border (`span.radio__circle`) with an inner dot (`span.radio__dot`) that scales in on selection via CSS transitions. |
| **Group value** | The `value` attribute on `nc-radio-group` mirrors the `value` of the currently selected `nc-radio`. |

---

## Data Flow

### Data In — `nc-radio-group`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `string` | `""` | Value of the currently selected radio |
| `name` | `string` | — | Propagated to all child radios |
| `label` | `string` | `"Radio group"` | Visible group label (also used for `aria-label`) |
| `disabled` | `boolean` | `false` | Disables all child radios |

### Data In — `nc-radio`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `string` | — | **Required.** Identifies this option |
| `label` | `string` | — | Visible label text |
| `disabled` | `boolean` | `false` | Disables this individual radio |
| `checked` | `boolean` | `false` | Managed by the parent group — do not set directly |

### Data Out

| Event | Target | Detail | Fires when |
|-------|--------|--------|------------|
| `nc-change` | `nc-radio-group` | `{ value: string }` | Selection changes (click or keyboard) |
| `nc-radio-select` | `nc-radio` *(internal)* | `{ value: string }` | Child notifies group of click — **stopped by group, never reaches consumers** |

### Slots

| Element | Slot | Content |
|---------|------|---------|
| `nc-radio-group` | *(default)* | `nc-radio` children |

> **Note:** `nc-radio` does not expose a slot. The label is set via the `label` attribute.

---

## Internal Rendering

### `nc-radio-group`

```
div.radio-group[role="radiogroup"][part="base"]
├── span.radio-group__label[part="label"]   ← only if label attr is set
└── <slot>                                  ← nc-radio children
```

### `nc-radio`

```
div.radio[role="radio"][part="base"]
├── span.radio__circle[part="circle"]
│   └── span.radio__dot[part="dot"]
└── span.radio__label[part="label"]         ← only if label attr is set
```

---

## Extending Styles

### CSS Custom Properties

| Token | Fallback | Purpose |
|-------|----------|---------|
| `--nc-color-primary-600` | `#4f46e5` | Checked border + dot color |
| `--nc-color-primary-700` | `#4338ca` | Hover state when checked |
| `--nc-color-neutral-400` | `#9ca3af` | Unchecked border color |
| `--nc-color-neutral-800` | `#1f2937` | Label text color |
| `--nc-spacing-2` | `0.5rem` | Gap between radios / circle–label gap |
| `--nc-focus-ring-offset` | `0 0 0 3px rgba(59,130,246,0.35)` | Focus ring shadow |

### Shadow Parts

```css
/* Group */
nc-radio-group::part(base)  { /* radiogroup container */ }
nc-radio-group::part(label) { /* group label span   */ }

/* Radio */
nc-radio::part(base)   { /* wrapper div           */ }
nc-radio::part(circle) { /* outer circle           */ }
nc-radio::part(dot)    { /* inner filled dot       */ }
nc-radio::part(label)  { /* label text span        */ }
```

---

## Accessibility

- `role="radiogroup"` on the group container with `aria-label`
- `role="radio"` + `aria-checked` + `aria-disabled` on each radio
- Arrow Up / Arrow Down cycles selection through enabled radios (roving tabindex)
- Space / Enter selects the focused radio
- Group-level `disabled` propagates to all children (sets `pointer-events: none` + reduced opacity)

---

## Usage Examples

### Basic Vertical Group

```html
<nc-radio-group name="plan" label="Subscription Plan" value="pro">
  <nc-radio value="free"       label="Free"></nc-radio>
  <nc-radio value="pro"        label="Pro"></nc-radio>
  <nc-radio value="enterprise" label="Enterprise"></nc-radio>
</nc-radio-group>
```

### Horizontal Layout (wrapper div)

```html
<nc-radio-group name="layout" label="View">
  <div style="display:flex; gap:1.5rem;">
    <nc-radio value="list"  label="List"></nc-radio>
    <nc-radio value="grid"  label="Grid"></nc-radio>
    <nc-radio value="table" label="Table"></nc-radio>
  </div>
</nc-radio-group>
```

### Disabled Option

```html
<nc-radio-group name="method" label="Shipping">
  <nc-radio value="standard" label="Standard"></nc-radio>
  <nc-radio value="express"  label="Express" disabled></nc-radio>
  <nc-radio value="next-day" label="Next Day"></nc-radio>
</nc-radio-group>
```

### React

```tsx
function PaymentMethod() {
  const [method, setMethod] = useState('card');
  return (
    <nc-radio-group
      name="payment"
      label="Payment Method"
      value={method}
      onNcChange={(e: CustomEvent) => setMethod(e.detail.value)}
    >
      <nc-radio value="card"   label="Credit Card" />
      <nc-radio value="paypal" label="PayPal" />
      <nc-radio value="bank"   label="Bank Transfer" />
    </nc-radio-group>
  );
}
```

### Angular Reactive Form

```html
<nc-radio-group
  name="refund"
  label="Refund Type"
  [attr.value]="form.get('refundType')?.value"
  (nc-change)="form.get('refundType')?.setValue($event.detail.value)"
>
  <nc-radio value="full"    label="Full Refund"></nc-radio>
  <nc-radio value="partial" label="Partial Refund"></nc-radio>
</nc-radio-group>
```

---

## Consumer Projects

| Project | Use Cases |
|---------|-----------|
| **ShopWave** | Shipping method selection, payment method, refund type (full / partial) |
