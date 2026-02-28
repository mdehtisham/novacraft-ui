# `<nc-icon>` — Component Documentation

## Overview

Inline SVG icon system with a built-in registry of ~60 icons. Renders SVG directly in Shadow DOM — no icon fonts, no external requests. Supports custom icon registration via a shared `iconRegistry`.

## Architecture Decisions

- **Inline SVG over icon font**: tree-shakeable, color customizable via `currentColor`, crisp at all sizes.
- **Registry pattern**: static `Map<string, string>` of icon names → SVG strings. Icons registered once, looked up by name at render time.
- **`currentColor` inheritance**: icon color follows parent text color by default; override with the `color` attribute or `--nc-icon-color` CSS variable.
- **No external fetching**: all built-in icons are embedded SVG strings in the JS bundle. Zero network requests.
- **Lazy registration**: custom icons that are never imported stay out of the bundle (tree-shaking friendly).

## Data Flow

### Data In

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | — | Icon name from the registry (required) |
| `size` | `'xs'\|'sm'\|'md'\|'lg'\|'xl'` | `'md'` | Preset size (`12/16/20/24/32 px`). Also accepts a numeric px value. |
| `color` | `string` | `currentColor` | Any CSS color value or design token |
| `label` | `string` | value of `name` | Accessible label for `aria-label` |

### Data Out

No events emitted — purely presentational.

### Slots

None — content comes entirely from SVG registry lookup.

## Icon Registry API

```javascript
import { iconRegistry } from '@aspect-ui/core';

// Register a single icon
iconRegistry.set('my-icon', '<svg viewBox="0 0 24 24">...</svg>');

// Check existence
iconRegistry.has('my-icon'); // true

// List all registered names
[...iconRegistry.keys()]; // ['arrow-up', 'arrow-down', ..., 'my-icon']

// Register via the component class
import { NcIcon } from '@aspect-ui/core';
NcIcon.registerIcon('custom-logo', '<svg>...</svg>');
```

## Built-in Icons (~60)

| Category | Icons |
|----------|-------|
| Arrows | `arrow-up`, `arrow-down`, `arrow-left`, `arrow-right` |
| Chevrons | `chevron-up`, `chevron-down`, `chevron-left`, `chevron-right` |
| Actions | `close`, `check`, `search`, `plus`, `minus`, `edit`, `trash`, `refresh` |
| UI | `menu`, `grid`, `list`, `maximize`, `minimize`, `more-horizontal`, `more-vertical`, `filter`, `sort` |
| Status | `alert-circle`, `info`, `warning`, `success`, `loading` |
| Visibility | `eye`, `eye-off`, `lock`, `unlock` |
| Media | `image`, `file`, `folder`, `code`, `link`, `external-link` |
| Transfer | `copy`, `download`, `upload` |
| Social | `github`, `linkedin`, `twitter`, `mail` |
| Objects | `star`, `star-filled`, `heart`, `heart-filled`, `bookmark`, `calendar`, `clock`, `bell` |
| Navigation | `home`, `log-out`, `user`, `settings`, `sun`, `moon` |

## Size Map

| Token | Pixels |
|-------|--------|
| `xs` | 12 px |
| `sm` | 16 px |
| `md` | 20 px |
| `lg` | 24 px |
| `xl` | 32 px |

Numeric values are also accepted and treated as pixel values.

## Internal Rendering

1. `render()` reads `name`, `size`, `color`, and `label` attributes.
2. Size is resolved via `SIZE_MAP` (or raw px) and applied as `--nc-icon-size`.
3. Color, if provided, is applied as `--nc-icon-color`.
4. SVG string is looked up from `iconRegistry` and injected as inner HTML inside Shadow DOM.
5. If the icon name is not found, an HTML comment `<!-- unknown icon: {name} -->` is rendered.

## Extending

```css
/* Override size via CSS custom property */
nc-icon { --nc-icon-size: 32px; }

/* Override color (uses currentColor inheritance) */
nc-icon { color: red; }

/* Direct SVG styling via Shadow DOM */
nc-icon svg { stroke-width: 3; }
```

Register custom icons at app bootstrap so they are available before first render:

```javascript
import { iconRegistry } from '@aspect-ui/core';
iconRegistry.set('brand-logo', '<svg viewBox="0 0 24 24">...</svg>');
```

## Accessibility

- **Labelled**: when `label` is provided → `role="img"` + `aria-label="{label}"`.
- **Decorative**: when no `label` → `role="img"` + `aria-label` defaults to the icon `name`.
- Set `label=""` explicitly and add `aria-hidden="true"` for purely decorative icons adjacent to visible text.

## Usage Examples

### Basic

```html
<nc-icon name="star" size="lg"></nc-icon>
```

### Custom Color

```html
<nc-icon name="heart" color="var(--nc-color-danger, #ef4444)"></nc-icon>
```

### Custom Registered Icon

```javascript
import { NcIcon } from '@aspect-ui/core';
NcIcon.registerIcon('custom-logo', '<svg viewBox="0 0 24 24">...</svg>');
```

```html
<nc-icon name="custom-logo" size="xl"></nc-icon>
```

### Inside a Button Slot

```html
<nc-button>
  <nc-icon slot="prefix" name="download" size="sm"></nc-icon>
  Download
</nc-button>
```

### React (via wrapper)

```jsx
import { NcIcon } from '@aspect-ui/react';

function App() {
  return <NcIcon name="settings" size="md" label="Settings" />;
}
```

## Consumer Projects

All four portfolio projects use `<nc-icon>` extensively:

| Project | Primary Usage |
|---------|---------------|
| **Devfolio** | Skill badges, navigation links, theme toggle (`sun`/`moon`) |
| **TaskFlow Labs** | Command palette actions, status indicators, toolbar buttons |
| **ShopWave Labs** | Product actions, cart controls, category navigation |
| **InkFlow Labs** | Editor toolbar, block insertion menu, collaboration indicators |
