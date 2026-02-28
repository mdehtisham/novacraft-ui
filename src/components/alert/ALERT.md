# `<nc-alert>` — Component Documentation

## Overview

Inline alert/callout box for contextual messages: **info**, **success**, **warning**, and **danger**.
Unlike toasts (transient, overlay), alerts are **persistent** and embedded in normal document flow.
Use for form validation summaries, feature announcements, important notices within page content.
Optionally dismissible via an integrated close button.

---

## Architecture Decisions

| Decision | Rationale |
|---|---|
| **Inline (not overlay)** | Renders in normal document flow — appropriate for contextual, non-transient messages. |
| **Variant → icon mapping** | Each variant has a default SVG icon (info → circle-i, success → check-circle, warning → triangle, danger → x-circle). Override via the `icon` slot. |
| **Dismissible** | Close button emits `nc-dismiss`; consumer handles removal. Component does not self-destruct. |
| **Title + body pattern** | Optional `title` attribute for a bold heading; default slot for body text. Supports both together or body only. |
| **Action slot** | Optional `action` slot for embedding buttons or links below the body text. |
| **Shared color scheme** | Uses the same `--nc-color-{variant}-*` tokens as toasts for visual consistency. |
| **Left accent border** | 4 px left border in variant color provides a strong visual cue alongside the background tint. |

---

## API

### Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `variant` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | Visual style and default icon. |
| `dismissible` | `boolean` | `false` | Shows close button when present. |
| `title` | `string` | `''` | Bold heading rendered above the body. Hidden when empty. |

### Slots

| Slot | Description |
|---|---|
| *(default)* | Body message content. |
| `title` | Override the title area (takes precedence over the `title` attribute). |
| `icon` | Custom icon; replaces the default variant SVG. |
| `action` | Action area below the body (e.g. a button or link). Hidden when empty. |

### Events

| Event | Detail | Description |
|---|---|---|
| `nc-dismiss` | `{}` | Fires when the dismiss button is clicked. Consumer is responsible for removing or hiding the element. |

### CSS Custom Properties

| Property | Description |
|---|---|
| `--nc-color-{variant}-50` | Alert background color. |
| `--nc-color-{variant}-100` | Alert border color. |
| `--nc-color-{variant}-500` | Left accent border color. |
| `--nc-color-{variant}-700` | Text and icon color. |
| `--nc-spacing-3`, `--nc-spacing-4` | Internal padding. |
| `--nc-radius-md` | Border radius. |
| `--nc-font-size-sm` | Font size. |
| `--nc-transition-fast` | Dismiss button hover/focus transition speed. |

### CSS Parts

| Part | Element |
|---|---|
| `base` | Outer `.alert` container (`div`). |
| `icon` | Icon wrapper (`span`). |
| `content` | Content column (`div`). |
| `title` | Title row (`div`). |
| `body` | Body row (`div`). |
| `action` | Action row (`div`). |
| `dismiss` | Close button (`button`), only rendered when `dismissible`. |

---

## Internal Rendering

```
Shadow DOM
└─ div.alert.alert--{variant}  [role="alert"]  part="base"
   ├─ span.alert__icon           part="icon"
   │  └─ <slot name="icon"> → default variant SVG
   ├─ div.alert__content         part="content"
   │  ├─ div.alert__title        part="title"
   │  │  └─ <slot name="title"> → title attribute text
   │  ├─ div.alert__body         part="body"
   │  │  └─ <slot> (default)
   │  └─ div.alert__action       part="action"
   │     └─ <slot name="action">
   └─ button.alert__dismiss      part="dismiss"  aria-label="Dismiss"
      └─ ✕ SVG (only if dismissible)
```

---

## Accessibility

- Container uses `role="alert"` for all variants (announces to assistive technology).
- Dismiss button: `aria-label="Dismiss"`.
- Default variant icon is decorative; override via `icon` slot should include `aria-hidden="true"`.
- Dismiss button supports `:focus-visible` with `--nc-focus-ring`.

---

## Usage Examples

### Basic info alert

```html
<nc-alert variant="info">
  Here is some helpful information for you.
</nc-alert>
```

### Warning with title

```html
<nc-alert variant="warning" title="Heads up!">
  Please review your changes before continuing.
</nc-alert>
```

### Dismissible danger alert

```html
<nc-alert variant="danger" dismissible title="Error">
  Something went wrong. Please try again.
</nc-alert>

<script>
  document.querySelector('nc-alert').addEventListener('nc-dismiss', (e) => {
    e.target.remove();
  });
</script>
```

### With action button

```html
<nc-alert variant="warning" title="Update Available">
  A new version is available with security fixes.
  <nc-button slot="action" variant="ghost" size="sm">Update Now</nc-button>
</nc-alert>
```

### Custom icon

```html
<nc-alert variant="danger" title="Access Denied">
  <svg slot="icon" width="20" height="20" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="2" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
  </svg>
  You do not have permission to perform this action.
</nc-alert>
```

### React

```jsx
function SaveConfirmation() {
  return (
    <nc-alert variant="success" title="Saved">
      Your changes have been saved successfully.
    </nc-alert>
  );
}
```

### Angular

```html
<nc-alert variant="info" [attr.dismissible]="showDismiss || null"
          (nc-dismiss)="onDismiss()">
  Welcome to the new dashboard experience.
</nc-alert>
```

---

## Consumer Projects

| Project | Usage |
|---|---|
| **DevFolio** | Blog callout boxes (info, warning, error variants). |
| **InkFlow** | Callout blocks in the rich-text editor; AI budget exceeded warning. |
| **ShopWave** | Cart price-change notice; out-of-stock inline alert. |
| **TaskFlow** | Connection-status banner; WIP limit warning in board view. |
