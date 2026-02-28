# `<nc-drawer>` — Component Documentation

## Overview

Slide-in panel from any screen edge. Shares the same dialog accessibility
pattern as `nc-modal` (focus trap, scroll lock, Escape to close) but positioned
at screen edges instead of centered.

---

## Architecture Decisions

| Decision | Rationale |
|---|---|
| Reuses modal focus-trap logic | Consistent keyboard navigation across overlay components. |
| CSS `transform` for slide animation | GPU-accelerated, no layout thrash. `translateX(±100%)` / `translateY(±100%)` → `translate(0,0)` on open. |
| `open` attribute as single source of truth | Consumer sets/removes it; component emits events but never self-mutates the attribute from inside. |
| Shadow DOM with `::part()` exports | Encapsulated styles with explicit escape hatches for theming. |

---

## API

### Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `open` | boolean | `false` | Controls visibility. Add to open, remove to close. |
| `placement` | `left` \| `right` \| `top` \| `bottom` | `left` | Edge the drawer slides in from. |
| `size` | `sm` \| `md` \| `lg` \| `xl` \| `full` | `md` | Panel dimension (width for left/right, height for top/bottom). |
| `close-on-overlay` | boolean | `true` | Close when the overlay backdrop is clicked. Set `"false"` to disable. |
| `close-on-escape` | boolean | `true` | Close on <kbd>Escape</kbd> key. Set `"false"` to disable. |

### Size Presets

| Token | Value |
|---|---|
| `sm` | 280 px |
| `md` | 360 px |
| `lg` | 480 px |
| `xl` | 640 px |
| `full` | 100 % |

### Public Methods

| Method | Description |
|---|---|
| `open()` | Sets the `open` attribute. Saves current focus for later restoration. |
| `close()` | Removes the `open` attribute. |

### Events (Data Out)

| Event | Fires when | Bubbles |
|---|---|---|
| `nc-open` | `open` attribute is added | Yes |
| `nc-close` | `open` attribute is removed | Yes |

### Slots

| Slot | Purpose |
|---|---|
| `header` | Drawer header area (title, actions). Hidden when empty. |
| *(default)* | Drawer body — primary scrollable content. |
| `footer` | Drawer footer area (buttons, status). Hidden when empty. |

---

## Internal Rendering

```
Shadow DOM
├─ div.drawer                       (role="dialog", aria-modal="true")
│  ├─ div.drawer__overlay           part="overlay"
│  └─ div.drawer__panel             part="panel"  [placement class + inline size]
│     ├─ div.drawer__header         part="header"  → <slot name="header">
│     ├─ div.drawer__body           part="body"    → <slot> (default)
│     └─ div.drawer__footer         part="footer"  → <slot name="footer">
```

Open state toggles the `drawer--open` class on the root `div.drawer`, which:
1. Sets `visibility: visible` and `pointer-events: auto`.
2. Fades overlay to `opacity: 1`.
3. Transitions panel `transform` to `translate(0, 0)`.

---

## Extending Styles

### CSS Custom Properties

| Property | Default | Description |
|---|---|---|
| `--nc-z-modal` | `1000` | z-index of the drawer layer. |
| `--nc-color-surface` | `#fff` | Panel background. |
| `--nc-color-border` | `#e5e7eb` | Header/footer border color. |
| `--nc-shadow-lg` | `0 10px 25px rgba(0,0,0,0.15)` | Panel box shadow. |
| `--nc-spacing-4` | `16px` | Padding inside header, body, footer. |

### Shadow Parts

```css
nc-drawer::part(overlay)  { /* backdrop */ }
nc-drawer::part(panel)    { /* slide-in container */ }
nc-drawer::part(header)   { /* header section */ }
nc-drawer::part(body)     { /* scrollable body */ }
nc-drawer::part(footer)   { /* footer section */ }
```

---

## Accessibility

- `role="dialog"` + `aria-modal="true"` on the root container.
- `aria-hidden` toggles with open state.
- **Focus trap** — <kbd>Tab</kbd> / <kbd>Shift+Tab</kbd> cycle within
  panel (shadow DOM elements + slotted light DOM).
- **Focus restoration** — returns focus to the previously active element
  on close via `requestAnimationFrame`.
- **Escape key** — closes when `close-on-escape` is not `"false"`.
- **`prefers-reduced-motion`** — consumers can override the 300 ms
  transition via `--nc-drawer-transition-duration: 0ms`.

---

## Usage Examples

### Basic right drawer

```html
<nc-drawer placement="right" size="md" id="detail">
  <span slot="header">Task Detail</span>
  <p>Content goes here.</p>
  <div slot="footer">
    <button onclick="document.getElementById('detail').close()">Done</button>
  </div>
</nc-drawer>

<button onclick="document.getElementById('detail').open()">Open</button>
```

### Left navigation drawer

```html
<nc-drawer placement="left" size="sm" id="nav">
  <span slot="header">Menu</span>
  <nav>
    <a href="/dashboard">Dashboard</a>
    <a href="/settings">Settings</a>
  </nav>
</nc-drawer>
```

### Bottom sheet (mobile)

```html
<nc-drawer placement="bottom" size="lg" id="filters">
  <span slot="header">Filters</span>
  <!-- filter controls -->
</nc-drawer>
```

### Full-width panel

```html
<nc-drawer placement="right" size="full" id="editor">
  <span slot="header">Editor</span>
  <!-- rich content -->
</nc-drawer>
```

### Listening for events

```js
const drawer = document.querySelector('nc-drawer');
drawer.addEventListener('nc-close', () => {
  drawer.removeAttribute('open');
});
```

---

## Consumer Projects

| Project | Usage |
|---|---|
| **TaskFlow** | Right drawer for task detail; left drawer for mobile navigation. |
| **ShopWave** | Right drawer for cart; left drawer for mobile filters; bottom sheet for mobile nav. |
