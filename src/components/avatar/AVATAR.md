# `<nc-avatar>` — Component Documentation

## Overview

User/entity avatar with image, initials fallback, and status indicator dot.
Handles image load errors gracefully with a 3-tier fallback chain:
**image → initials → generic user icon**.

## Architecture Decisions

- **3-tier fallback:** `img src` → initials text → default SVG icon.
  Handled via `img.onerror` — hide the image element and show the next
  fallback in the chain.
- **Status dot:** Absolute-positioned circle with semantic colors.
  Pure CSS — no extra element rendered when `status` is unset.
- **Circle / square shape:** Toggled via `border-radius`.
- **No lazy loading built-in.** Consumers use native `loading="lazy"` on a
  parent or an intersection observer.
- **`object-fit: cover`** on images — no distortion regardless of aspect ratio.

## Data Flow

### Data In (Properties / Attributes)

| Property   | Type     | Default    | Description                              |
| ---------- | -------- | ---------- | ---------------------------------------- |
| `src`      | `string` | —          | Image URL for the avatar.                |
| `alt`      | `string` | —          | Alt text for the image.                  |
| `initials` | `string` | —          | 1–2 character fallback text.             |
| `size`     | `string` | `"md"`     | One of `xs`, `sm`, `md`, `lg`, `xl`.     |
| `shape`    | `string` | `"circle"` | `circle` or `square`.                    |
| `status`   | `string` | —          | `online`, `offline`, `busy`, or `away`.  |

### Data Out (Events)

| Event      | Detail        | Description                                      |
| ---------- | ------------- | ------------------------------------------------ |
| `nc-error` | `{ src: string }` | Fired when the image fails to load. Lets the parent handle the error (e.g., log, retry with a different URL). |

### Slots

None — content is purely data-driven.

## Internal Rendering

Shadow DOM structure:

```
div.avatar  [part="base"]
├── img                          (if src is set)
├── span.initials  [part="initials"]   (first fallback)
├── svg.default-icon [part="fallback-icon"]  (second fallback)
└── span.status-dot  [part="status"]   (if status is set)
```

Only one of `img`, `span.initials`, or `svg.default-icon` is visible at a
time. Visibility is toggled by adding/removing a `hidden` attribute when the
fallback chain activates.

## Extending Styles

### CSS Custom Properties

| Property               | Description                        |
| ---------------------- | ---------------------------------- |
| `--nc-avatar-size`     | Override the rendered size.        |
| `--nc-avatar-bg`       | Background color in initials mode. |
| `--nc-avatar-color`    | Text color for initials.           |
| `--nc-avatar-status-size` | Diameter of the status dot.     |

### CSS Parts

```css
::part(base)          /* outer container  */
::part(initials)      /* initials text    */
::part(status)        /* status dot       */
::part(fallback-icon) /* default SVG icon */
```

## Accessibility

- `img` carries the `alt` attribute (required when `src` is provided).
- Initials mode: `aria-label` on the container with the full name.
- Status dot: `aria-label="Status: online"` (or the relevant status value).
- `role="img"` on the outer container.

## Usage Examples

### Basic image avatar

```html
<nc-avatar
  src="/avatars/jane.jpg"
  alt="Jane Doe"
  size="md"
></nc-avatar>
```

### Initials fallback

```html
<nc-avatar initials="JD" alt="Jane Doe" size="lg"></nc-avatar>
```

### With status indicator

```html
<nc-avatar
  src="/avatars/jane.jpg"
  alt="Jane Doe"
  status="online"
></nc-avatar>
```

### Square shape

```html
<nc-avatar
  src="/avatars/team-logo.png"
  alt="Team Alpha"
  shape="square"
  size="xl"
></nc-avatar>
```

### Avatar group

```html
<div style="display: flex; gap: -8px;">
  <nc-avatar src="/avatars/a.jpg" alt="Alice" size="sm"></nc-avatar>
  <nc-avatar src="/avatars/b.jpg" alt="Bob" size="sm"></nc-avatar>
  <nc-avatar initials="CD" alt="Carol Danvers" size="sm"></nc-avatar>
</div>
```

### React

```jsx
<NcAvatar
  src="/avatars/jane.jpg"
  alt="Jane Doe"
  status="online"
  onNcError={(e) => console.warn('Avatar load failed', e.detail.src)}
/>
```

### Angular

```html
<nc-avatar
  [src]="user.avatarUrl"
  [alt]="user.name"
  [initials]="user.initials"
  [status]="user.presence"
  (nc-error)="onAvatarError($event)"
></nc-avatar>
```

## Consumer Projects

### TaskFlow

- User presence indicators on the board
- Assignee picker in task detail
- Activity feed and comment threads

### ShopWave

- Admin user list
- Order customer info
- Review author avatars

### InkFlow

- Author card on article pages
- Article byline avatars
