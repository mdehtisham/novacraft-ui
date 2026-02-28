# `<nc-badge>` — Component Documentation

## Overview

A small label component for tagging, categorizing, and status display. Supports color
variants, pill shape, status dot, and removable (dismissible) mode. Built as a
zero-dependency Custom Element with Shadow DOM.

## Architecture Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Base class | Extends `NcBaseElement` (Custom Elements v1) | Shared lifecycle, attribute helpers, `emit()` utility |
| Encapsulation | Shadow DOM | Style encapsulation — badge colors never leak or collide |
| Dot indicator | CSS-only `<span>` | No JS animation needed for a static status dot |
| Remove behavior | Emits event, does **not** self-destruct | Parent controls removal — keeps data flow unidirectional |
| Style injection | `adoptedStyleSheets` (via base class) | Zero style duplication across multiple badge instances |

## Data Flow

### Data In (Attributes / Properties)

| Attribute | Type | Default | Description |
|---|---|---|---|
| `variant` | `primary` \| `secondary` \| `success` \| `warning` \| `danger` \| `info` \| `neutral` | `primary` | Color variant |
| `size` | `sm` \| `md` \| `lg` | `md` | Badge size |
| `pill` | `boolean` | `false` | Fully-rounded pill shape |
| `dot` | `boolean` | `false` | Show leading status dot |
| `removable` | `boolean` | `false` | Show dismiss ✕ button |

### Data Out (Events)

| Event | Detail | Bubbles | Composed | Notes |
|---|---|---|---|---|
| `nc-dismiss` | `{}` | ✔ | ✔ | Fired when dismiss ✕ is clicked. Component does **not** remove itself — parent handles removal. |

### Slots

| Slot | Description |
|---|---|
| *(default)* | Label text content |

## Internal Rendering

Shadow DOM template structure:

```html
<span class="badge badge--{variant} badge--{size} [badge--pill]" part="base">
  <!-- if dot -->
  <span class="badge__dot" aria-hidden="true" part="dot"></span>

  <slot part="label"></slot>

  <!-- if removable -->
  <button class="badge__dismiss" type="button" aria-label="Dismiss" part="remove-button">
    <svg><!-- ✕ icon --></svg>
  </button>
</span>
```

## Extending Styles

### Via CSS Custom Properties

```css
nc-badge {
  --nc-color-primary-500: #7c3aed;   /* override dot / accent color */
  --nc-color-primary-100: #ede9fe;   /* override background */
  --nc-color-primary-700: #4c1d95;   /* override text */
  --nc-radius-full: 9999px;          /* pill radius */
}
```

### Via `::part()` Selectors

```css
nc-badge::part(base)          { /* outer wrapper */ }
nc-badge::part(dot)           { /* status dot */ }
nc-badge::part(label)         { /* default slot */ }
nc-badge::part(remove-button) { /* dismiss button */ }
```

### Via Subclassing

```ts
import { NcBadge } from '@aspect-ui/novacraft';

class AppBadge extends NcBadge {
  static styles = `
    ${NcBadge.styles}
    .badge--primary { background: hotpink; }
  `;
}
customElements.define('app-badge', AppBadge);
```

## Accessibility

- Dismiss button has `aria-label="Dismiss"` for screen readers.
- Dot indicator is `aria-hidden="true"` (purely decorative).
- Badge is focusable **only** when `removable` — the dismiss button is a real `<button>`.
- Color is never the sole indicator; text content conveys meaning independently.

## Usage Examples

### Basic

```html
<nc-badge variant="success">Active</nc-badge>
<nc-badge variant="danger">Overdue</nc-badge>
<nc-badge variant="neutral">Draft</nc-badge>
```

### Pill Shape

```html
<nc-badge variant="info" pill>v2.1.0</nc-badge>
```

### With Status Dot

```html
<nc-badge variant="success" dot>Online</nc-badge>
<nc-badge variant="warning" dot>Away</nc-badge>
```

### Removable

```html
<nc-badge variant="primary" removable id="tag">TypeScript</nc-badge>

<script>
  document.getElementById('tag')
    .addEventListener('nc-dismiss', (e) => e.target.remove());
</script>
```

### React Wrapper

```tsx
function Tag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <nc-badge variant="primary" removable onNc-dismiss={onRemove}>
      {label}
    </nc-badge>
  );
}
```

### Angular

```html
<nc-badge variant="success" dot removable (nc-dismiss)="removeTag($event)">
  {{ tag.name }}
</nc-badge>
```

## Consumer Projects

| Project | Usage |
|---|---|
| **DevFolio** | Tech tags on project cards, skill badges |
| **TaskFlow** | Task labels, priority indicators, filter chips |
| **ShopWave** | Product tags, status indicators, filter chips |
| **InkFlow** | Article tags, status pills |
