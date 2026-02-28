# `<nc-dropdown-menu>` — Component Documentation

## Overview

Action menu triggered by a button or element. Contains menu items, dividers, and labeled groups. Full keyboard navigation with roving tabindex. Think: right-click context menu or "more actions" dropdown.

Composed of four custom elements registered from a single module:

| Element              | Role                                      |
| -------------------- | ----------------------------------------- |
| `nc-dropdown-menu`   | Container — positions panel, manages state |
| `nc-menu-item`       | Actionable row inside the menu            |
| `nc-menu-divider`    | Visual `<hr>`-style separator             |
| `nc-menu-group`      | Labeled section of items                  |

## Architecture Decisions

- **Four-element composition** keeps each concern small and styleable in its own Shadow DOM.
- **Trigger slot** — the element placed in the `trigger` slot opens/closes the menu on click.
- **Positioning** — absolute, below trigger by default. `placement` attribute controls alignment (`bottom-start` / `bottom-end`). Uses CSS-only positioning (no JS resize observers) consistent with `nc-popover`.
- **Roving tabindex** on menu items: only the focused item is tabbable. Arrow Up/Down moves focus; Home/End jump to first/last.
- **Item selection** — clicking an `nc-menu-item` calls `_selectItem(value)` on the closest `nc-dropdown-menu`, which fires `nc-select` and auto-closes.
- **Outside-click** closes the menu via a document-level click listener.

## Data Flow

### Data In — `nc-dropdown-menu`

| Attribute   | Type    | Default          | Description                  |
| ----------- | ------- | ---------------- | ---------------------------- |
| `open`      | boolean | `false`          | Toggles panel visibility     |
| `placement` | string  | `"bottom-start"` | `bottom-start \| bottom-end` |

### Data In — `nc-menu-item`

| Attribute  | Type    | Default | Description                         |
| ---------- | ------- | ------- | ----------------------------------- |
| `value`    | string  | `""`    | Action identifier sent with event   |
| `disabled` | boolean | `false` | Prevents selection and dims item    |
| `danger`   | boolean | `false` | Red text styling for destructive actions |

### Data In — `nc-menu-group`

| Attribute | Type   | Default | Description                  |
| --------- | ------ | ------- | ---------------------------- |
| `label`   | string | —       | Uppercase heading above items |

### Data Out (Events)

| Event      | Target             | Detail           | When                 |
| ---------- | ------------------ | ---------------- | -------------------- |
| `nc-select`| `nc-dropdown-menu` | `{ value: string }` | Item clicked/entered |
| `nc-show`  | `nc-dropdown-menu` | —                | Menu opens           |
| `nc-hide`  | `nc-dropdown-menu` | —                | Menu closes          |

### Slots

| Element            | Slot name | Purpose                                  |
| ------------------ | --------- | ---------------------------------------- |
| `nc-dropdown-menu` | `trigger` | The element that toggles the menu        |
| `nc-dropdown-menu` | (default) | Menu content — items, dividers, groups   |
| `nc-menu-item`     | `prefix`  | Leading icon                             |
| `nc-menu-item`     | (default) | Item label text                          |
| `nc-menu-item`     | `suffix`  | Trailing text (e.g. keyboard shortcut)   |
| `nc-menu-group`    | (default) | `nc-menu-item` children                  |

## Extending Styles

### Custom Properties

```
--nc-menu-bg              → --nc-color-neutral-50
--nc-menu-border          → --nc-color-neutral-200
--nc-menu-radius          → --nc-radius-md
--nc-menu-shadow          → --nc-shadow-lg
--nc-menu-item-hover-bg   → --nc-color-primary-50
--nc-menu-item-danger-color → --nc-color-danger-500
```

### CSS Parts

`::part(base)` on `nc-menu-item` exposes the inner `.menu-item` div.

## Accessibility

| Concern           | Implementation                              |
| ----------------- | ------------------------------------------- |
| Trigger           | `aria-haspopup="menu"`, `aria-expanded`     |
| Panel             | `role="menu"`                               |
| Items             | `role="menuitem"`, `tabindex="0"`, `aria-disabled` via `disabled` attr |
| Groups            | `role="group"`, `aria-label` from `label` attr |
| Divider           | `role="separator"`                          |
| Keyboard          | ↑↓ navigate items, Escape closes, Enter/Space selects |

## Usage Examples

### Basic

```html
<nc-dropdown-menu>
  <nc-button slot="trigger">Actions</nc-button>
  <nc-menu-item value="edit">Edit</nc-menu-item>
  <nc-menu-item value="duplicate">Duplicate</nc-menu-item>
  <nc-menu-divider></nc-menu-divider>
  <nc-menu-item value="delete" danger>Delete</nc-menu-item>
</nc-dropdown-menu>
```

### With Groups, Icons, and Shortcuts

```html
<nc-dropdown-menu placement="bottom-end">
  <nc-button slot="trigger" variant="ghost">⋮</nc-button>

  <nc-menu-group label="Edit">
    <nc-menu-item value="cut">
      <nc-icon slot="prefix" name="scissors"></nc-icon>
      Cut
      <span slot="suffix">⌘X</span>
    </nc-menu-item>
    <nc-menu-item value="copy">
      <nc-icon slot="prefix" name="copy"></nc-icon>
      Copy
      <span slot="suffix">⌘C</span>
    </nc-menu-item>
  </nc-menu-group>

  <nc-menu-divider></nc-menu-divider>

  <nc-menu-group label="Danger Zone">
    <nc-menu-item value="archive" disabled>Archive</nc-menu-item>
    <nc-menu-item value="delete" danger>Delete forever</nc-menu-item>
  </nc-menu-group>
</nc-dropdown-menu>
```

### Listening for Selection

```js
document.querySelector('nc-dropdown-menu')
  .addEventListener('nc-select', (e) => {
    console.log('Selected action:', e.detail.value);
  });
```

## Consumer Projects

- **TaskFlow** — board actions menu, task context menu (right-click)
- **ShopWave** — admin bulk-actions toolbar, user account menu, order-row actions
