# NovaCraft UI

> **Zero-Dependency Framework-Agnostic Component Library**  
> 30 production-ready Web Components built with Custom Elements v1 + Shadow DOM

[![CI](https://img.shields.io/badge/build-passing-brightgreen)]() [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)]()

## Quick Start

### CDN (3 lines to first component)

```html
<script type="module" src="https://unpkg.com/@novacraft/core"></script>
<link rel="stylesheet" href="https://unpkg.com/@novacraft/core/dist/css/tokens.css">
<nc-button variant="primary">Click Me</nc-button>
```

### npm

```bash
npm install @novacraft/core
```

```typescript
import '@novacraft/core';

// Or cherry-pick components
import '@novacraft/core/button';
import '@novacraft/core/modal';
```

## Framework Guides

### React

```bash
npm install @novacraft/core @novacraft/react
```

```tsx
import { NcButton, NcModal, NcInput } from '@novacraft/react';

function App() {
  return (
    <NcButton variant="primary" onNcClick={() => console.log('clicked!')}>
      Click Me
    </NcButton>
  );
}
```

### Angular

```bash
npm install @novacraft/core @novacraft/angular
```

```typescript
import { NovaCraftModule } from '@novacraft/angular';

@NgModule({
  imports: [NovaCraftModule],
})
export class AppModule {}
```

```html
<nc-input label="Email" [(ngModel)]="email"></nc-input>
<nc-toggle label="Notifications" [(ngModel)]="notifications"></nc-toggle>
```

### Plain HTML

```html
<script type="module">
  import 'https://unpkg.com/@novacraft/core';
</script>

<nc-card variant="elevated" padding="md">
  <span slot="header">My Card</span>
  <p>Content goes here</p>
</nc-card>
```

## Components (30)

### Core Primitives
| Component | Tag | Description |
|---|---|---|
| Button | `<nc-button>` | 6 variants, 5 sizes, loading state, icon-only |
| Badge | `<nc-badge>` | 7 color variants, pill mode, removable |
| Card | `<nc-card>` | Elevated/outlined/filled, interactive mode |
| Icon | `<nc-icon>` | 60+ built-in SVG icons, custom registration |
| Spinner | `<nc-spinner>` | CSS-only animated spinner |
| Skeleton | `<nc-skeleton>` | Pulse/wave loading placeholders |
| Theme Toggle | `<nc-theme-toggle>` | Light/dark/system with persistence |
| Tooltip | `<nc-tooltip>` | Pure CSS positioning, 4 placements |
| Avatar | `<nc-avatar>` | Image → initials → icon fallback |
| Status Badge | `<nc-status-badge>` | 6 semantic statuses with pulse animation |

### Form Components
| Component | Tag | Description |
|---|---|---|
| Input | `<nc-input>` | 7 types, label/error/hint, prefix/suffix slots |
| Textarea | `<nc-textarea>` | Auto-grow, character counter, resize control |
| Select | `<nc-select>` | Custom dropdown, searchable, keyboard navigation |
| Checkbox | `<nc-checkbox>` | Checked/unchecked/indeterminate |
| Radio | `<nc-radio-group>` | Group with arrow key navigation |
| Toggle | `<nc-toggle>` | Switch with smooth CSS animation |
| Search Input | `<nc-search-input>` | Built-in debounce, clear button, loading state |

### Overlay & Feedback
| Component | Tag | Description |
|---|---|---|
| Modal | `<nc-modal>` | Focus trap, Escape close, CSS animations |
| Toast | `<nc-toast>` | Auto-dismiss, programmatic API, stacking |
| Drawer | `<nc-drawer>` | Slide from 4 directions, focus trap |
| Popover | `<nc-popover>` | 12 placements, smart repositioning |
| Alert | `<nc-alert>` | 4 variants with dismissible option |

### Navigation & Data Display
| Component | Tag | Description |
|---|---|---|
| Tabs | `<nc-tabs>` | Line/enclosed/pills variants, lazy rendering |
| Accordion | `<nc-accordion>` | Single/multiple open, animated transitions |
| Breadcrumb | `<nc-breadcrumb>` | Configurable separator, aria-current |
| Pagination | `<nc-pagination>` | Page numbers with ellipsis |
| Progress Bar | `<nc-progress-bar>` | Determinate/indeterminate modes |
| Star Rating | `<nc-star-rating>` | Interactive, half-star, keyboard accessible |
| Dropdown Menu | `<nc-dropdown-menu>` | Nested items, keyboard navigation |
| Table | `<nc-table>` | Sortable, striped, hoverable, compact |

## Theming

NovaCraft UI uses CSS Custom Properties that penetrate Shadow DOM:

```css
:root {
  --nc-color-primary-500: #6366f1;
  --nc-color-neutral-100: #f5f5f5;
  --nc-font-family-sans: system-ui, sans-serif;
  --nc-radius-md: 0.375rem;
  --nc-shadow-md: 0 4px 6px rgba(0,0,0,0.1);
}
```

### Dark Mode

```html
<nc-theme-toggle persist></nc-theme-toggle>
```

Or manually:
```javascript
document.documentElement.setAttribute('data-theme', 'dark');
```

## Accessibility

- All components follow **WCAG 2.1 AA** guidelines
- Proper ARIA roles, states, and properties
- Full keyboard navigation
- Focus management for overlays
- Screen reader tested

## Browser Support

| Browser | Version |
|---|---|
| Chrome | 90+ |
| Firefox | 90+ |
| Safari | 15.4+ |
| Edge | 90+ |

## Architecture

- **Zero dependencies** — Native Custom Elements v1 + Shadow DOM
- **Framework agnostic** — Works with React, Angular, Vue, Svelte, or plain HTML
- **Tree-shakeable** — Import only what you need
- **TypeScript first** — Full type definitions included
- **CSS Custom Properties** — Theme penetrates Shadow DOM
- **< 30KB gzipped** — Total bundle for all 30 components

## Documentation

| Document | Description |
|---|---|
| **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** | Full developer reference — local setup, testing, Storybook, framework integration, theming, contributing |
| **[CHANGELOG.md](./CHANGELOG.md)** | Version history |
| **Storybook** (`npm run storybook`) | Interactive component explorer + API docs |

## Development

```bash
git clone <repo-url>
cd novacraft-ui
npm install
npm run dev          # Vite dev server
npm run test         # Run tests
npm run storybook    # Launch Storybook at http://localhost:6006
npm run build        # Build for production
npm run typecheck    # TypeScript check (zero errors required)
npm run test:coverage  # Coverage report (≥90% required)
```

## License

MIT © NovaCraft UI
