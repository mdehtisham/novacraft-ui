# `<nc-popover>` — Component Documentation

## Overview

Positioned floating panel anchored to a trigger element. Supports click or hover
triggers, 12 placement options, an arrow indicator, and smart repositioning near
viewport edges.

---

## Architecture Decisions

- **Pure CSS + minimal JS positioning** — uses absolute positioning with
  calculated offsets. No Popper.js / Floating UI dependency.
- **Smart flip** — on open, checks if the popover overflows the viewport via
  `getBoundingClientRect()`. If so, flips to the opposite side.
- **Arrow** — CSS triangle (border trick) positioned at the center of the
  connecting edge. Rotates based on placement.
- **Click trigger** — toggles on trigger click; closes on outside click
  (document-level listener).
- **Hover trigger** — opens on `mouseenter` (with configurable delay), closes on
  `mouseleave`. An invisible padding "hover bridge" between trigger and popover
  prevents accidental close while the cursor moves between them.
- **No focus trap** — unlike modal/drawer, the popover is supplementary, not
  blocking. Users can freely Tab out (which closes the popover).

---

## Data Flow

### Data In (Properties / Attributes)

| Property    | Type    | Default    | Description                                                                 |
| ----------- | ------- | ---------- | --------------------------------------------------------------------------- |
| `open`      | boolean | `false`    | Whether the popover is visible.                                             |
| `placement` | string  | `"bottom"` | One of 12 positions (see below).                                            |
| `trigger`   | string  | `"click"`  | `"click"` or `"hover"`.                                                     |
| `offset`    | number  | `8`        | Gap in pixels between the trigger and the popover.                          |

**Placement options (12):**
`top` · `top-start` · `top-end` ·
`bottom` · `bottom-start` · `bottom-end` ·
`left` · `left-start` · `left-end` ·
`right` · `right-start` · `right-end`

### Data Out (Events)

| Event      | Detail                                                    | Fires when …           |
| ---------- | --------------------------------------------------------- | ---------------------- |
| `nc-open`  | `{}`                                                      | Popover opens.         |
| `nc-close` | `{ reason: "trigger" \| "outside-click" \| "escape" }`   | Popover closes.        |

### Slots

| Slot        | Purpose                                    |
| ----------- | ------------------------------------------ |
| `trigger`   | The element that anchors the popover.      |
| *(default)* | Popover content.                           |

---

## Internal Rendering

Shadow DOM structure:

```
div.wrapper
├── slot[name="trigger"]  part="trigger"
└── div.popover [hidden]  part="popover"
    ├── div.arrow          part="arrow"
    └── div.content        part="content"
        └── slot
```

---

## Extending Styles

### CSS Custom Properties

| Property                  | Description              |
| ------------------------- | ------------------------ |
| `--nc-popover-bg`         | Background color         |
| `--nc-popover-border`     | Border shorthand         |
| `--nc-popover-radius`     | Border radius            |
| `--nc-popover-shadow`     | Box shadow               |
| `--nc-popover-padding`    | Content padding          |
| `--nc-popover-arrow-size` | Arrow size               |

### CSS Shadow Parts

`::part(trigger)` · `::part(popover)` · `::part(arrow)` · `::part(content)`

---

## Accessibility

- **Trigger:** `aria-expanded="true|false"`, `aria-haspopup="dialog"`.
- **Popover:** `role="dialog"` (or `role="tooltip"` for hover-only
  informational popovers).
- **Escape** key closes the popover.
- No focus trap — the user can Tab out, which also closes the popover.

---

## Usage Examples

### Click Popover

```html
<nc-popover>
  <button slot="trigger">Open Menu</button>
  <div>
    <p>Popover content here.</p>
  </div>
</nc-popover>
```

### Hover Popover

```html
<nc-popover trigger="hover" placement="top">
  <span slot="trigger">Hover me</span>
  <p>Extra information on hover.</p>
</nc-popover>
```

### Placement Variants

```html
<nc-popover placement="right-start">
  <button slot="trigger">Right Start</button>
  <p>Aligned to the start of the right edge.</p>
</nc-popover>
```

### Rich Content

```html
<nc-popover>
  <button slot="trigger">Settings</button>
  <form>
    <label>Name <input type="text" /></label>
    <button type="submit">Save</button>
  </form>
</nc-popover>
```

### React

```jsx
<NcPopover trigger="click" placement="bottom-end" onNcClose={handleClose}>
  <button slot="trigger">Profile</button>
  <ProfileCard user={user} />
</NcPopover>
```

### Angular

```html
<nc-popover trigger="hover" placement="top" (ncOpen)="onOpen()">
  <span slot="trigger">Status</span>
  <app-status-details [status]="item.status"></app-status-details>
</nc-popover>
```

---

## Consumer Projects

- **TaskFlow** — user avatar hover info, task quick-edit popover.
- **InkFlow** — image settings popover, toolbar sub-menus.
