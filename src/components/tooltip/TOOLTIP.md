# `<nc-tooltip>` — Component Documentation

## Overview

Contextual hint that appears on hover/focus of a trigger element. Pure CSS
positioning (no Popper.js / Floating UI dependency). Supports four placements
with an arrow indicator.

---

## Architecture Decisions

| Decision | Rationale |
| --- | --- |
| **Pure CSS positioning** | Absolute positioning relative to the host element — no third-party positioning library required. |
| **Show on hover AND focus** | Ensures keyboard users see tooltips (WCAG 1.4.13). |
| **Show delay (default 200 ms)** | Prevents flash on quick mouse passes. |
| **Escape key dismisses** | Standard keyboard dismissal pattern. |
| **CSS triangle arrow** | Uses the border-hack technique — no SVG needed. |
| **Composed event bubbling** | Allows events to traverse Shadow DOM boundaries. |

---

## Data Flow

### Data In (Properties / Attributes)

| Property | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `content` | `content` | `string` | `""` | Text displayed inside the tooltip. |
| `placement` | `placement` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | Position of the tooltip relative to the trigger. |
| `delay` | `delay` | `number` | `200` | Milliseconds to wait before showing the tooltip. |

### Data Out

None — the tooltip is purely informational and emits no events.

### Slots

| Slot | Description |
| --- | --- |
| *(default)* | The trigger element the tooltip is attached to. |

---

## Internal Rendering

```
<div class="tooltip-wrapper">
  <slot></slot>                        <!-- trigger element -->
  <div role="tooltip" part="tooltip"
       id="auto-generated-id"
       class="tooltip placement-{top|bottom|left|right}">
    <span part="arrow" class="arrow"></span>
    <span class="text">{content}</span>
  </div>
</div>
```

Visibility is controlled by a CSS class toggled via
`mouseenter` / `mouseleave` / `focus` / `blur` handlers on the host. A
`setTimeout` governed by `delay` gates the show transition.

---

## Extending Styles

### CSS Custom Properties

| Property | Default | Description |
| --- | --- | --- |
| `--nc-tooltip-bg` | `var(--nc-neutral-900)` | Background colour. |
| `--nc-tooltip-color` | `#fff` | Text colour. |
| `--nc-tooltip-radius` | `4px` | Border radius. |
| `--nc-tooltip-font-size` | `0.75rem` | Font size. |

### CSS Shadow Parts

| Part | Target |
| --- | --- |
| `::part(tooltip)` | The tooltip container `div`. |
| `::part(arrow)` | The arrow `span`. |

---

## Accessibility

- `role="tooltip"` on the popup element.
- `aria-describedby` on the trigger links to an auto-generated tooltip ID.
- Dismissed when the user presses **Escape**.
- The tooltip itself is **not** focusable — it appears when the trigger
  receives focus.
- `prefers-reduced-motion: reduce` disables the fade animation.

---

## Usage Examples

### Basic

```html
<nc-tooltip content="Save document">
  <button>Save</button>
</nc-tooltip>
```

### Bottom Placement

```html
<nc-tooltip content="Settings" placement="bottom">
  <button>⚙️</button>
</nc-tooltip>
```

### On an Icon Button

```html
<nc-tooltip content="Delete item">
  <nc-icon-button icon="trash" aria-label="Delete item"></nc-icon-button>
</nc-tooltip>
```

### Custom Delay

```html
<nc-tooltip content="More info" delay="500">
  <span tabindex="0">ℹ️</span>
</nc-tooltip>
```

### React

```jsx
<NcTooltip content="Copy link" placement="right">
  <button onClick={handleCopy}>🔗</button>
</NcTooltip>
```

### Angular

```html
<nc-tooltip content="Open calendar" placement="left">
  <button (click)="openCalendar()">📅</button>
</nc-tooltip>
```

---

## Consumer Projects

### DevFolio

- Social-link hints on profile header icons.
- Skill badge details on hover.

### TaskFlow

- Avatar hover cards showing name and role.
- Toolbar button labels.

### InkFlow

- Toolbar button tooltips in the rich-text editor.
- AI action descriptions in the suggestion panel.
