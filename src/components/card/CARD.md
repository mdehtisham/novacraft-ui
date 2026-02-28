# `<nc-card>` — Component Documentation

## Overview

A container component for grouping related content with optional header, body,
footer, and media sections. Supports **elevated**, **outlined**, and **filled**
variants with an interactive hover mode. Built as a framework-agnostic Web
Component using Shadow DOM and CSS Custom Properties.

---

## Architecture Decisions

| Decision | Choice | Rationale |
| --- | --- | --- |
| Slot strategy | Multiple named slots (`header`, default/body, `footer`, `media`) | Flexible composition without imposing a rigid internal structure |
| Interactive mode | `cursor: pointer`, hover lift + shadow | Delegated entirely to CSS — no JavaScript required for hover effects |
| Styling surface | CSS Parts on every section | Full external styling control without breaking Shadow DOM encapsulation |
| Click handling | No built-in handler in non-interactive mode | Keeps the component a pure container; consumers add interactivity as needed |

---

## Data Flow

### Data In (Properties / Attributes)

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"elevated"` \| `"outlined"` \| `"filled"` | `"elevated"` | Visual style of the card |
| `interactive` | `boolean` | `false` | Adds hover effect, pointer cursor, and enables click events |
| `padding` | `"none"` \| `"sm"` \| `"md"` \| `"lg"` | `"md"` | Inner padding applied to header, body, and footer slots |

### Data Out (Events)

| Event | Detail | Condition |
| --- | --- | --- |
| `nc-click` | `{ originalEvent: PointerEvent }` | Only fires when `interactive` is `true` |

### Slots

| Slot | Description |
| --- | --- |
| *(default)* | Body content of the card |
| `header` | Card header area |
| `footer` | Card footer / action area |
| `media` | Image or video area, rendered above the header |

---

## Internal Rendering

Shadow DOM template structure:

```html
<div part="base" class="card card--{variant}">
  <slot name="media" part="media"></slot>
  <slot name="header" part="header"></slot>
  <slot part="body"></slot>          <!-- default slot -->
  <slot name="footer" part="footer"></slot>
</div>
```

When `interactive` is `true`, the base `<div>` receives `role="button"` and
`tabindex="0"` at render time.

---

## Extending Styles

### CSS Custom Properties

| Token | Purpose |
| --- | --- |
| `--nc-shadow-md` | Default elevation shadow |
| `--nc-radius-lg` | Border radius |
| `--nc-spacing-4` | Base padding unit |

### CSS Parts

Style any section from the outside via `::part()`:

```css
nc-card::part(base)   { /* card wrapper */ }
nc-card::part(header) { /* header slot */ }
nc-card::part(body)   { /* body / default slot */ }
nc-card::part(footer) { /* footer slot */ }
nc-card::part(media)  { /* media slot */ }
```

### Subclassing

Extend `NcCard` and override `render()` or `styles` to create specialised
card variants while inheriting base behaviour.

---

## Accessibility

- **Interactive mode** — `role="button"`, `tabindex="0"`;
  <kbd>Enter</kbd> / <kbd>Space</kbd> fires `nc-click`.
- **Non-interactive mode** — no ARIA role added; behaves as a pure semantic
  container.
- A visible **focus ring** is applied in interactive mode for keyboard users.

---

## Usage Examples

### Basic Card

```html
<nc-card>
  <p>Simple body content lives in the default slot.</p>
</nc-card>
```

### Card with Header and Footer

```html
<nc-card variant="outlined">
  <span slot="header">Project Alpha</span>
  <p>Status update for the current sprint.</p>
  <div slot="footer">
    <nc-button size="sm">View</nc-button>
  </div>
</nc-card>
```

### Media Card

```html
<nc-card variant="filled">
  <img slot="media" src="/hero.jpg" alt="Hero image" />
  <span slot="header">Featured Article</span>
  <p>A brief summary of the article content.</p>
</nc-card>
```

### Interactive Card

```html
<nc-card interactive @nc-click="${handleClick}">
  <span slot="header">Click me</span>
  <p>This entire card is clickable.</p>
</nc-card>
```

### React

```jsx
<NcCard variant="elevated" interactive onNcClick={handleClick}>
  <span slot="header">React Card</span>
  <p>Body content rendered from JSX.</p>
</NcCard>
```

### Angular

```html
<nc-card variant="outlined" (nc-click)="onCardClick($event)">
  <span slot="header">Angular Card</span>
  <p>Body content inside an Angular template.</p>
</nc-card>
```

---

## Consumer Projects

| Project | Usage |
| --- | --- |
| **DevFolio** | Project cards, blog entry cards |
| **TaskFlow** | Task cards on the kanban board |
| **ShopWave** | Product cards, admin dashboard metric cards |
| **InkFlow** | Article cards, analytics widgets |
