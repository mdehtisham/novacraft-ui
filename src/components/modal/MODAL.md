# `<nc-modal>` — Component Documentation

## Overview

Dialog overlay with focus trapping, keyboard dismissal, and scroll locking.
Supports five size presets plus fullscreen. The most complex accessibility
implementation in the library — implements the WAI-ARIA dialog pattern fully.

## Architecture Decisions

- **Focus trap** — custom implementation (no `focus-trap` library). Queries all
  focusable elements inside the modal and cycles <kbd>Tab</kbd> between the first
  and last. Restores focus to the trigger element on close.
- **Scroll lock** — sets `overflow: hidden` on `document.body` when open. Saves
  the previous overflow value and restores it on close.
- **Overlay click-to-close** — listener on the overlay `div`, _not_ on the
  backdrop pseudo-element. An `event.target` check prevents clicks inside the
  content from closing the modal.
- **Z-index stacking** — each modal increments its z-index. Supports stacked
  modals (a modal opening another modal).
- **Escape to close** — `keydown` listener on `document` (composed, so it works
  inside Shadow DOM). Only the topmost modal responds.
- **Animation** — CSS transitions for the overlay (`opacity`) and content
  (`opacity` + `transform: scale`). No JS animation.
- **`open` attribute** is the single source of truth. The consumer toggles it;
  the component never self-closes without emitting `nc-close` first.

## Data Flow

### Data In (Attributes / Properties)

| Attribute          | Type    | Default | Description                        |
| ------------------ | ------- | ------- | ---------------------------------- |
| `open`             | boolean | `false` | Whether the modal is visible       |
| `size`             | string  | `"md"`  | `sm` · `md` · `lg` · `xl` · `full`|
| `close-on-overlay` | boolean | `true`  | Close when the overlay is clicked  |
| `close-on-escape`  | boolean | `true`  | Close when Escape is pressed       |
| `no-close-button`  | boolean | `false` | Hide the built-in close button     |

### Data Out (Events)

| Event              | Detail                                               | Notes                                                        |
| ------------------ | ---------------------------------------------------- | ------------------------------------------------------------ |
| `nc-open`          | `{}`                                                 | Fires after the open animation completes                     |
| `nc-close`         | `{ reason: "escape" \| "overlay" \| "close-button" }`| Consumer must set `open=false` to actually close the modal   |
| `nc-overlay-click` | `{}`                                                 | Fires on overlay click even if `close-on-overlay` is `false` |

### Slots

| Slot        | Purpose                  |
| ----------- | ------------------------ |
| `header`    | Modal header / title     |
| *(default)* | Modal body content       |
| `footer`    | Modal footer / actions   |

## Internal Rendering

```
Shadow DOM
└─ div.overlay  part="overlay"
   └─ div.panel [role="dialog"][aria-modal="true"]  part="panel"
      ├─ div.header  part="header"   → <slot name="header"> + close button
      ├─ div.body    part="body"     → <slot> (default)
      └─ div.footer  part="footer"   → <slot name="footer">
```

## Extending Styles

### CSS Custom Properties

| Property                          | Description                          |
| --------------------------------- | ------------------------------------ |
| `--nc-modal-width-sm`             | Width for `size="sm"`                |
| `--nc-modal-width-md`             | Width for `size="md"`                |
| `--nc-modal-width-lg`             | Width for `size="lg"`                |
| `--nc-modal-width-xl`             | Width for `size="xl"`                |
| `--nc-modal-overlay-bg`           | Overlay background (default `rgba(0,0,0,0.5)`) |
| `--nc-modal-radius`               | Panel border-radius                  |
| `--nc-modal-padding`              | Panel padding                        |

### Shadow Parts

`::part(overlay)` · `::part(panel)` · `::part(header)` · `::part(body)` ·
`::part(footer)` · `::part(close-button)`

## Accessibility

- `role="dialog"` and `aria-modal="true"` on the panel.
- `aria-labelledby` points to header slot content (auto-generated ID).
- Focus trap: <kbd>Tab</kbd> cycles within the modal.
- Focus restoration: on close, focus returns to the element that opened the modal.
- <kbd>Escape</kbd> closes the modal (unless `close-on-escape="false"`).
- Body scroll is locked while the modal is open.

## Usage Examples

### Basic

```html
<nc-modal open size="md">
  <span slot="header">Confirm Action</span>
  <p>Are you sure you want to proceed?</p>
  <div slot="footer">
    <nc-button variant="secondary" id="cancel-btn">Cancel</nc-button>
    <nc-button variant="primary" id="ok-btn">OK</nc-button>
  </div>
</nc-modal>
```

### Confirmation Dialog

```html
<nc-modal id="delete-dialog" size="sm" close-on-overlay="false">
  <span slot="header">Delete Item</span>
  <p>This action cannot be undone.</p>
  <div slot="footer">
    <nc-button variant="destructive" id="confirm-delete">Delete</nc-button>
  </div>
</nc-modal>
```

### No Close Button

```html
<nc-modal open no-close-button close-on-escape="false" close-on-overlay="false">
  <span slot="header">Processing…</span>
  <nc-spinner></nc-spinner>
</nc-modal>
```

### Fullscreen

```html
<nc-modal open size="full">
  <span slot="header">Image Preview</span>
  <img src="photo.jpg" alt="Preview" />
</nc-modal>
```

### Stacked Modals

```html
<nc-modal id="outer" open size="lg">
  <span slot="header">Settings</span>
  <nc-button id="open-inner">Advanced</nc-button>
</nc-modal>

<nc-modal id="inner" size="sm">
  <span slot="header">Advanced Settings</span>
  <p>Inner modal content.</p>
</nc-modal>
```

### React

```jsx
function DeleteDialog({ open, onClose }) {
  return (
    <nc-modal open={open} size="sm" onNcClose={(e) => onClose(e.detail.reason)}>
      <span slot="header">Delete?</span>
      <p>This cannot be undone.</p>
      <div slot="footer">
        <nc-button variant="destructive" onClick={() => onClose("confirm")}>
          Delete
        </nc-button>
      </div>
    </nc-modal>
  );
}
```

### Angular

```html
<nc-modal [open]="isOpen" size="md" (ncClose)="onClose($event)">
  <span slot="header">Edit Profile</span>
  <app-profile-form></app-profile-form>
  <div slot="footer">
    <nc-button (click)="save()">Save</nc-button>
  </div>
</nc-modal>
```

## Consumer Projects

- **TaskFlow** — delete confirmation, column delete, workspace create
- **ShopWave** — refund confirmation, product delete, login / register
- **InkFlow** — publish settings, version restore confirmation
