# `<nc-button>` — Component Documentation

## Overview

A versatile, accessible button component supporting multiple variants, sizes, loading states, and icon slots. Built as a Custom Element with Shadow DOM encapsulation.

## Architecture Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Element type | Extends `HTMLElement` via `NcBaseElement` | Custom Elements v1 standard; no framework dependency |
| Click handling | Delegates to internal `<button>` | Native form participation, disabled behavior, keyboard handling for free |
| Loading state | Replaces content with `<nc-spinner>` + disables | Prevents double-submit; spinner lives in Shadow DOM so slot content is preserved |
| Slot-based composition | `prefix` / `suffix` named slots | Consumers inject icons or badges without the component knowing their content |
| Styling | `adoptedStyleSheets` + CSS Custom Properties | Zero style duplication across instances; theme tokens penetrate Shadow DOM |

## Data Flow

### Data In (Attributes / Properties)

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `variant` | `variant` | `string` | `"primary"` | `primary\|secondary\|ghost\|danger\|outline\|link` |
| `size` | `size` | `string` | `"md"` | `xs\|sm\|md\|lg\|xl` |
| `disabled` | `disabled` | `boolean` | `false` | Disables interaction |
| `loading` | `loading` | `boolean` | `false` | Shows spinner, disables click |
| `type` | `type` | `string` | `"button"` | `button\|submit\|reset` |
| `full-width` | `fullWidth` | `boolean` | `false` | Stretches to container width |
| `icon-only` | `iconOnly` | `boolean` | `false` | Circular icon button |

Attributes sync bidirectionally with properties. Setting `el.disabled = true` adds the `disabled` attribute and vice versa.

### Data Out (Events)

| Event | Detail | Bubbles | Composed | When |
|---|---|---|---|---|
| `nc-click` | `{ originalEvent: MouseEvent }` | ✅ | ✅ | Button clicked (not fired when disabled/loading) |

Events use `composed: true` so they cross Shadow DOM boundaries and can be caught by framework event listeners.

### Slots

| Slot | Purpose | Example |
|---|---|---|
| `(default)` | Button label text | `<nc-button>Save</nc-button>` |
| `prefix` | Leading icon/element | `<nc-icon slot="prefix" name="plus"></nc-icon>` |
| `suffix` | Trailing icon/element | `<nc-icon slot="suffix" name="arrow-right"></nc-icon>` |

## Internal Rendering

```html
<!-- Shadow DOM template -->
<button part="base" class="btn btn--{variant} btn--{size}">
  <slot name="prefix" part="prefix"></slot>
  <span part="label"><slot></slot></span>
  <slot name="suffix" part="suffix"></slot>
  <!-- Injected when loading=true -->
  <nc-spinner size="xs" part="spinner"></nc-spinner>
</button>
```

## Extending Styles

### Via CSS Custom Properties (Recommended)

```css
nc-button {
  --nc-color-primary-500: #8b5cf6;   /* Change primary color */
  --nc-color-primary-600: #7c3aed;   /* Hover color */
  --nc-radius-md: 9999px;            /* Pill-shaped buttons */
}
```

### Via CSS `::part()` Selectors

```css
nc-button::part(base) {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
nc-button::part(label) {
  font-weight: 700;
}
```

### Via Subclassing (Advanced)

```typescript
class MyButton extends NcButton {
  static styles = new CSSStyleSheet();
  constructor() {
    super();
    MyButton.styles.replaceSync(`/* custom styles */`);
  }
}
customElements.define('my-button', MyButton);
```

## Accessibility

- Internal `<button>` provides native keyboard support (Enter/Space)
- `disabled` attribute maps to `aria-disabled` and removes from tab order
- `loading` sets `aria-busy="true"` and `aria-disabled="true"`
- Focus ring via `:focus-visible` with `--nc-color-primary-500` outline
- Respects `prefers-reduced-motion` (disables spinner animation)

## Usage Examples

```html
<!-- Basic -->
<nc-button variant="primary" size="md">Save Changes</nc-button>

<!-- With icons -->
<nc-button variant="secondary">
  <nc-icon slot="prefix" name="plus"></nc-icon>
  Add Task
</nc-button>

<!-- Loading state -->
<nc-button variant="primary" loading>Submitting...</nc-button>

<!-- React wrapper -->
<NcButton variant="danger" onClick={handleDelete} loading={isDeleting}>
  Delete
</NcButton>

<!-- Angular -->
<nc-button variant="outline" (nc-click)="onSave()">Save</nc-button>
```

## Consumer Projects

- **DevFolio:** CTA buttons, form submit, download résumé
- **TaskFlow:** Create task, save/cancel, toolbar actions
- **ShopWave:** Add to cart, checkout, admin CRUD
- **InkFlow:** AI action triggers, publish, save draft
