# `<nc-toast>` — Component Documentation

## Overview

Notification popup with auto-dismiss, action slot, and stack management. Two
parts: **nc-toast-container** (positioned stack manager) and **nc-toast**
(individual notification). Also provides a programmatic API via
`toast({ message, variant })`.

---

## Architecture Decisions

| Decision | Rationale |
| --- | --- |
| **Container / toast separation** | Container manages position + stacking; individual toast manages timer + content. |
| **Programmatic API** | Global `toast()` function creates `nc-toast` elements and appends to the container. No need to write HTML — `toast({ message: 'Saved!', variant: 'success' })` just works. |
| **Auto-dismiss with hover/focus pause** | `setTimeout`-based. On `mouseenter`/`focusin` the timer pauses; on `mouseleave`/`focusout` it resumes with remaining time. |
| **Stack management** | Container limits visible toasts (default 5). Overflow is queued and shown when space frees. |
| **Enter/exit animations** | CSS `@keyframes`. Enter = slide-in + fade-in, exit = slide-out + fade-out. |
| **Toast does NOT self-remove from DOM** | It fires `nc-dismiss`, and the container removes it. Clean separation of concerns. |

---

## Data Flow

### Data In — `nc-toast` (Properties / Attributes)

| Property | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `variant` | `variant` | `"success" \| "error" \| "warning" \| "info"` | `"info"` | Visual style and icon. |
| `duration` | `duration` | `number` (ms) | `5000` | Auto-dismiss delay. `0` = persistent. |
| `message` | `message` | `string` | `""` | Toast message text. |
| `dismissible` | `dismissible` | `boolean` | `false` | Shows a close button when present. |

### Data In — `nc-toast-container` (Properties / Attributes)

| Property | Attribute | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `position` | `position` | `"top-right" \| "top-left" \| "bottom-right" \| "bottom-left" \| "top-center" \| "bottom-center"` | `"top-right"` | Screen position of the toast stack. |
| `max` | `max` | `number` | `5` | Maximum visible toasts before queuing. |

### Data Out

| Event | Detail | Description |
| --- | --- | --- |
| `nc-dismiss` | — | Fires when a toast should be removed (timer expired, close button clicked, or programmatic dismiss). |

### Slots

| Component | Slot | Description |
| --- | --- | --- |
| `nc-toast` | *(default)* | Message content. |
| `nc-toast` | `action` | Action button (e.g. "Undo", "Retry"). |

---

## Internal Rendering

### nc-toast

```
<div class="toast toast--{variant}" role="status" aria-live="polite">
  <span class="toast__icon">{variant SVG}</span>
  <div class="toast__content">
    <div class="toast__message">{message}<slot></slot></div>
    <div class="toast__actions"><slot name="action"></slot></div>
  </div>
  <button class="toast__close" aria-label="Close">✕</button>   <!-- if dismissible -->
  <div class="toast__progress"></div>
</div>
```

### nc-toast-container

```
<slot></slot>
```

---

## Programmatic API

```javascript
import { toast } from './toast';

toast({ message: 'Task created', variant: 'success' });
toast({ message: 'Failed to save', variant: 'error', duration: 0 }); // persistent
toast({ message: 'Board updated', variant: 'info' });
toast({ message: 'Rate limit approaching', variant: 'warning' });
```

The `toast()` function auto-creates an `<nc-toast-container>` in `document.body`
if one does not already exist.

---

## Extending Styles

### CSS Custom Properties

| Property | Default | Description |
| --- | --- | --- |
| `--nc-color-{success\|danger\|warning\|info}-50` | theme token | Variant background colour. |
| `--nc-color-{success\|danger\|warning\|info}-500` | theme token | Variant border & progress bar colour. |
| `--nc-color-{success\|danger\|warning\|info}-700` | theme token | Variant text colour. |
| `--nc-radius-lg` | theme token | Toast border radius. |
| `--nc-shadow-lg` | theme token | Toast box shadow. |
| `--nc-z-toast` | theme token | Container z-index. |

---

## Accessibility

- `role="status"` and `aria-live="polite"` on the toast element for non-intrusive screen-reader announcements.
- Close button has `aria-label="Close"`.
- Hover pauses auto-dismiss so users have time to read.
- Focus pauses auto-dismiss so keyboard users are not interrupted.
- `prefers-reduced-motion: reduce` — inherits from global design-token transitions.

---

## Usage Examples

### Declarative HTML

```html
<nc-toast variant="success" message="Profile saved!" dismissible></nc-toast>
```

### With Action Button

```html
<nc-toast variant="warning" message="File failed to upload." dismissible>
  <nc-button slot="action" variant="ghost" size="sm">Retry</nc-button>
</nc-toast>
```

### Inside a Container

```html
<nc-toast-container position="top-right" max="5">
  <nc-toast variant="info" dismissible>Welcome back!</nc-toast>
  <nc-toast variant="success" dismissible>Profile updated.</nc-toast>
</nc-toast-container>
```

### Persistent (No Auto-dismiss)

```html
<nc-toast variant="error" duration="0" message="Connection lost." dismissible></nc-toast>
```

### React

```jsx
<NcToast variant="success" message="Saved!" dismissible />
```

### Angular

```html
<nc-toast variant="info" message="Board updated." dismissible></nc-toast>
```

---

## Consumer Projects

### DevFolio
- Success confirmations on contact form submission.

### TaskFlow
- Undo toasts on task deletion, error messages on API failures.

### InkFlow
- Auto-save confirmations, real-time collaboration notifications.

### BizDash
- Data export confirmations, rate-limit warnings.
