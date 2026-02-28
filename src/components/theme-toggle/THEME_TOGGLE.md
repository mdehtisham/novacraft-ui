# `<nc-theme-toggle>` — Component Documentation

## Overview

Pre-built dark/light/system mode toggle with animated sun↔moon icon transition.
Manages the `data-theme` attribute on the `<html>` element and persists the user's
choice to `localStorage`.

---

## Architecture Decisions

| Decision | Rationale |
|---|---|
| **Document-level state** | Sets `data-theme="light\|dark"` on `documentElement`. Theme is global, not per-component. |
| **localStorage persistence** | Key `"nc-theme"`. Opt-in via the `persist` attribute. |
| **System mode** | Uses `matchMedia("(prefers-color-scheme: dark)")` listener. Updates on OS-level theme change. |
| **Icon animation** | CSS `transform: rotate(360deg)` + opacity crossfade between sun/moon SVGs via `cubic-bezier(0.34, 1.56, 0.64, 1)`. |
| **Cycle order** | `light ↔ dark` (2-state toggle). When `mode="system"`, the resolved theme follows OS preference. |

---

## API

### Attributes / Properties

| Attribute | Property | Type | Default | Description |
|---|---|---|---|---|
| `mode` | `mode` | `'light' \| 'dark' \| 'system'` | `'system'` | Active theme mode. |
| `persist` | `persist` | `boolean` | `false` | Save selection to `localStorage` under key `"nc-theme"`. |
| `resolved` | — | `'light' \| 'dark'` | *(readonly)* | Reflects the currently applied theme. Set internally. |

### Events

| Event | Detail | Bubbles | Composed |
|---|---|---|---|
| `nc-theme-change` | `{ theme: 'light' \| 'dark' }` | Yes | Yes |

Fired on every theme application — initial load, click toggle, and OS preference change (in system mode).

### Slots

None — uses built-in sun/moon SVG icons.

### CSS Custom Properties

| Property | Default | Description |
|---|---|---|
| `--nc-theme-toggle-size` | `2.5rem` | Button width and height. |
| `--nc-theme-toggle-icon-color` | `currentColor` | Icon stroke color. |
| `--nc-theme-toggle-bg` | `--nc-color-neutral-50` | Button background. |

### CSS Parts

| Part | Element |
|---|---|
| `base` | The `<button>` element. |

---

## Internal Rendering

Shadow DOM structure:

```
<button class="toggle" part="base" aria-label="Switch to dark mode">
  <span class="toggle__icon">
    <!-- sun or moon SVG based on resolved theme -->
  </span>
</button>
```

- Re-renders on every `_applyTheme()` call, swapping the SVG and updating `aria-label`.
- `resolved` attribute on the host drives CSS transitions (`:host([resolved="dark"])`).

---

## Theme Resolution Logic

1. **`connectedCallback`**: Check `localStorage` (if `persist`) → read `mode` attribute → fall back to `prefers-color-scheme`.
2. **Resolved theme** (always `"light"` or `"dark"`) is set as `data-theme` on `<html>`.
3. **On click**: Toggle to opposite resolved theme, update `data-theme`, persist if enabled, emit `nc-theme-change`.
4. **System mode listener**: If `mode="system"`, resolved theme updates automatically when OS preference changes.

---

## Data Flow

```
┌──────────────┐     ┌─────────────────────┐     ┌────────────────────┐
│  localStorage │────▶│  NcThemeToggle       │────▶│  <html data-theme> │
│  (nc-theme)   │     │  _resolveTheme()     │     └────────────────────┘
└──────────────┘     │  _applyTheme()       │────▶  nc-theme-change event
                      └─────────────────────┘
  matchMedia ─────────────────▲
  (prefers-color-scheme)      │ change listener
```

---

## Extending Styles

Override via CSS custom properties or `::part()`:

```css
nc-theme-toggle {
  --nc-theme-toggle-size: 3rem;
  --nc-theme-toggle-bg: transparent;
}

nc-theme-toggle::part(base) {
  border-radius: 8px;
  border: 2px solid var(--nc-color-primary-500);
}
```

To replace icons entirely, subclass `NcThemeToggle` and override `render()`.

---

## Accessibility

- `role="button"` with dynamic `aria-label` ("Switch to dark/light mode").
- **Keyboard**: `Enter` / `Space` to toggle (native `<button>` behavior).
- **Focus ring**: visible via `:focus-visible` with `--nc-focus-ring-offset`.
- **`prefers-reduced-motion`**: consumers should add reduced-motion overrides in their global styles; the component uses a `0.4s` cubic-bezier transition by default.

---

## Usage Examples

### Basic (system mode, no persistence)

```html
<nc-theme-toggle></nc-theme-toggle>
```

### Persist selection

```html
<nc-theme-toggle persist></nc-theme-toggle>
```

### Force dark mode

```html
<nc-theme-toggle mode="dark"></nc-theme-toggle>
```

### React — controlled mode

```jsx
function Header() {
  const [mode, setMode] = useState('system');

  return (
    <nc-theme-toggle
      mode={mode}
      persist
      onNc-theme-change={(e) => setMode(e.detail.theme)}
    />
  );
}
```

### Angular

```html
<nc-theme-toggle
  mode="system"
  persist
  (nc-theme-change)="onThemeChange($event)"
></nc-theme-toggle>
```

### In a header nav

```html
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <nc-theme-toggle persist></nc-theme-toggle>
</nav>
```

---

## Consumer Projects

| Project | Usage |
|---|---|
| **DevFolio** | Header theme toggle (primary use case). |
| Admin panels | Optional theme switching for dashboard UIs. |
