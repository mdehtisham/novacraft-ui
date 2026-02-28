# `<nc-accordion>` — Component Documentation

## Overview

Collapsible content sections built as Web Components.
`<nc-accordion>` manages single or multiple open state across its children;
`<nc-accordion-item>` is each collapsible section containing a trigger header
and a content panel. Both support smooth height animation out of the box.

---

## Architecture Decisions

### Height Animation

CSS transition on `max-height`. On **open** the element's `max-height` is set
to its `scrollHeight` (measured in JS) and the transition animates the change.
On **close** `max-height` is set to `0`. This avoids layout thrashing because
only the composite property is transitioned.

### Single vs Multiple

When `multiple=false` (the default), opening one item automatically closes
every other item. The parent `<nc-accordion>` dispatches the state change to
its children.

### Chevron Indicator

A built-in chevron icon rotates via CSS (`transform: rotate(180deg)`) when the
item is open. The animation is pure CSS — no JavaScript required.

### Standalone Usage

Each `<nc-accordion-item>` is independently functional and works even without
an `<nc-accordion>` parent, acting as a standalone collapsible.

---

## Data Flow

### Data In — `<nc-accordion>`

| Property   | Type                   | Default | Description                    |
| ---------- | ---------------------- | ------- | ------------------------------ |
| `multiple` | `boolean`              | `false` | Allow multiple items open      |
| `value`    | `string \| string[]`   | —       | Currently open item value(s)   |

### Data In — `<nc-accordion-item>`

| Property   | Type      | Default | Description                        |
| ---------- | --------- | ------- | ---------------------------------- |
| `value`    | `string`  | —       | **Required.** Unique item identity |
| `open`     | `boolean` | `false` | Whether the item is expanded       |
| `disabled` | `boolean` | `false` | Prevents toggling                  |

### Data Out

| Event       | Emitted On       | Detail                                  |
| ----------- | ---------------- | --------------------------------------- |
| `nc-toggle` | `<nc-accordion>` | `{ value: string, open: boolean }`      |

Fires whenever any child item is toggled.

### Slots

| Component             | Slot        | Description                              |
| --------------------- | ----------- | ---------------------------------------- |
| `<nc-accordion>`      | *(default)* | `<nc-accordion-item>` children           |
| `<nc-accordion-item>` | `header`    | Trigger content (always visible)         |
| `<nc-accordion-item>` | *(default)* | Collapsible content panel                |

---

## Extending Styles

### CSS Custom Properties

```
--nc-accordion-border
--nc-accordion-radius
--nc-accordion-gap
--nc-accordion-header-padding
--nc-accordion-content-padding
--nc-accordion-transition-duration
```

### CSS Shadow Parts

Exposed on `<nc-accordion-item>`:

```
::part(item)
::part(header)
::part(content)
::part(chevron)
```

---

## Accessibility

- Each header renders a `<button>` with `aria-expanded="true|false"` and
  `aria-controls` pointing to the content panel's ID.
- Each content panel has `role="region"` and `aria-labelledby` pointing back
  to the header's ID.
- **Enter / Space** toggles the item when the header has focus.
- Focus moves between headers via **Tab** (standard tab order, not roving
  tabindex).

---

## Usage Examples

### Basic (single open)

```html
<nc-accordion>
  <nc-accordion-item value="one">
    <span slot="header">Section One</span>
    <p>Content for section one.</p>
  </nc-accordion-item>
  <nc-accordion-item value="two">
    <span slot="header">Section Two</span>
    <p>Content for section two.</p>
  </nc-accordion-item>
</nc-accordion>
```

### Multiple open

```html
<nc-accordion multiple>
  <nc-accordion-item value="a" open>
    <span slot="header">Initially Open</span>
    <p>Already expanded on load.</p>
  </nc-accordion-item>
  <nc-accordion-item value="b">
    <span slot="header">Closed</span>
    <p>Click to expand.</p>
  </nc-accordion-item>
</nc-accordion>
```

### Listening for changes

```js
document.querySelector('nc-accordion')
  .addEventListener('nc-toggle', (e) => {
    console.log(e.detail); // { value: 'one', open: true }
  });
```

---

## Consumer Projects

- **DevFolio** — resume expandable sections
- **ShopWave** — product specs, FAQ, filter groups
