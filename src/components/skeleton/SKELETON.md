# `<nc-skeleton>` — Component Documentation

## Overview

Placeholder loading indicator that mimics content layout before data arrives.
Supports text lines, circles (avatars), and rectangles (images/cards).
Uses CSS-only pulse and wave animations — no JavaScript animation loops.

## Architecture Decisions

| Decision | Rationale |
|---|---|
| CSS-only animations | Pulse (opacity) and wave (gradient sweep) avoid JS overhead and run on the compositor thread. |
| Three shape variants | `text`, `circular`, and `rectangular` cover the most common content patterns (paragraphs, avatars, cards/images). |
| Flexible CSS units | `width` and `height` accept any CSS value (`px`, `%`, `rem`, `em`) so the skeleton fits any layout. |
| No slot content | The skeleton *is* the placeholder — it is replaced entirely when real data loads. |
| `prefers-reduced-motion` | Consumers should pair with a media query to disable animation for users who prefer reduced motion. |

## API

### Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `variant` | `"text"` \| `"circular"` \| `"rectangular"` | `"text"` | Shape of the skeleton placeholder. |
| `width` | CSS length string | `"100%"` (text) | Inline width applied to the skeleton element. |
| `height` | CSS length string | `"1em"` (text) | Inline height applied to the skeleton element. |
| `animation` | `"pulse"` \| `"wave"` \| `"none"` | `"pulse"` | Loading animation style. |

### Events

None — `<nc-skeleton>` is purely visual.

### Slots

None.

## Data Flow

### Data In

All configuration is declarative via HTML attributes. The component reads
`variant`, `width`, `height`, and `animation` through `observedAttributes` and
the inherited `getStrAttr()` helper from `NcBaseElement`.

### Data Out

No custom events are emitted. The skeleton is a passive placeholder that the
consumer removes or replaces once data has loaded.

## Internal Rendering

The `render()` method returns a single `<div>` inside Shadow DOM:

```
<div class="skeleton skeleton--{variant} skeleton--{animation}"
     aria-hidden="true"
     style="width:{width};height:{height}">
</div>
```

- **`skeleton--text`** — `border-radius: 4px`, default `width: 100%`, `height: 1em`.
- **`skeleton--circular`** — `border-radius: 50%`.
- **`skeleton--rectangular`** — `border-radius: 4px`.
- **`skeleton--pulse`** — keyframe toggles opacity between `1` and `0.4`.
- **`skeleton--wave`** — linear-gradient sweeps left-to-right using `background-position`.

Inline `style` is only added when `width` or `height` attributes are present.

## Extending Styles

### CSS Custom Properties

| Property | Default | Description |
|---|---|---|
| `--nc-color-neutral-200` | `#e5e7eb` | Base skeleton fill color. |
| `--nc-color-neutral-100` | `#f3f4f6` | Wave animation highlight color. |

Override these design tokens at any ancestor to theme all skeletons at once:

```css
:root {
  --nc-color-neutral-200: #d1d5db;
  --nc-color-neutral-100: #e5e7eb;
}
```

### Host Styling

The `:host` sets `display: inline-block`. Override on the element itself:

```css
nc-skeleton {
  display: block;
  margin-bottom: 0.5rem;
}
```

## Accessibility

- The inner `<div>` carries `aria-hidden="true"` — screen readers skip the
  decorative placeholder entirely.
- **Recommended:** set `aria-busy="true"` on the parent container while
  skeletons are visible, then remove the attribute when real content loads.

```html
<div aria-busy="true">
  <nc-skeleton variant="text" width="100%" height="1rem"></nc-skeleton>
  <nc-skeleton variant="text" width="80%" height="1rem"></nc-skeleton>
</div>
```

## Usage Examples

### Text Lines

```html
<div style="display:flex;flex-direction:column;gap:0.5rem;max-width:400px">
  <nc-skeleton variant="text" width="100%" height="1rem"></nc-skeleton>
  <nc-skeleton variant="text" width="92%" height="1rem"></nc-skeleton>
  <nc-skeleton variant="text" width="75%" height="1rem"></nc-skeleton>
</div>
```

### Avatar Skeleton

```html
<nc-skeleton variant="circular" width="48px" height="48px"></nc-skeleton>
```

### Card Skeleton

```html
<div style="max-width:320px;padding:1rem;border:1px solid #e2e8f0;border-radius:0.75rem;
            display:flex;flex-direction:column;gap:0.75rem">
  <nc-skeleton variant="rectangular" width="100%" height="160px" animation="wave"></nc-skeleton>
  <nc-skeleton variant="text" width="70%" height="1.1rem" animation="wave"></nc-skeleton>
  <nc-skeleton variant="text" width="90%" height="0.875rem" animation="wave"></nc-skeleton>
</div>
```

### Grid of Skeletons

```html
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem">
  <nc-skeleton variant="rectangular" width="100%" height="120px"></nc-skeleton>
  <nc-skeleton variant="rectangular" width="100%" height="120px"></nc-skeleton>
  <nc-skeleton variant="rectangular" width="100%" height="120px"></nc-skeleton>
</div>
```

### React — Conditional Render

```jsx
function UserCard({ user, loading }) {
  if (loading) {
    return (
      <div>
        <nc-skeleton variant="circular" width="48px" height="48px" />
        <nc-skeleton variant="text" width="160px" height="1rem" />
      </div>
    );
  }
  return <div>{user.name}</div>;
}
```

### Angular — `*ngIf`

```html
<ng-container *ngIf="loading; else content">
  <nc-skeleton variant="rectangular" width="100%" height="200px"></nc-skeleton>
</ng-container>
<ng-template #content>
  <img [src]="imageUrl" />
</ng-template>
```

## Consumer Projects

| Project | Use Case |
|---|---|
| Lazy-loaded images | Rectangular skeleton shown until image `onload` fires. |
| Data tables | Text-line skeletons fill each cell while rows are fetched. |
| Card grids | Full card skeleton (image + text lines) during pagination. |
| Avatar lists | Circular skeletons paired with text-line skeletons for names. |

## Source Files

| File | Purpose |
|---|---|
| `skeleton.ts` | Component class, styles, and registration. |
| `skeleton.stories.ts` | Storybook stories and visual tests. |
