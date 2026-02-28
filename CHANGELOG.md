# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-02-27

### Added

#### Core
- `NcBaseElement` abstract base class with Shadow DOM, attribute observation, event emission
- Design token system (`tokens.css`) with light/dark theme support
- Utility helpers: `defineElement`, `css`, `clamp`, `debounce`, `uniqueId`

#### Sprint 1: Core Primitives (10 components)
- `<nc-button>` — 6 variants, 5 sizes, loading/disabled/full-width/icon-only states
- `<nc-badge>` — 7 color variants, pill mode, dot indicator, removable
- `<nc-card>` — Elevated/outlined/filled variants, interactive mode, 4 slots
- `<nc-icon>` — 60+ built-in SVG icons, custom icon registration API
- `<nc-spinner>` — CSS-only animated spinner, 5 sizes, 3 variants
- `<nc-skeleton>` — Text/circular/rectangular shapes, pulse/wave animations
- `<nc-theme-toggle>` — Light/dark/system modes, localStorage persistence
- `<nc-tooltip>` — Pure CSS positioning, 4 placements, keyboard dismiss
- `<nc-avatar>` — Image → initials → icon fallback, status indicator
- `<nc-status-badge>` — 6 semantic statuses with optional pulse animation

#### Sprint 2: Form, Overlay & Feedback (12 components)
- `<nc-input>` — 7 input types, label/error/hint, prefix/suffix slots
- `<nc-textarea>` — Auto-grow, character counter, resize control
- `<nc-select>` — Custom dropdown, searchable, full keyboard navigation
- `<nc-checkbox>` — Checked/unchecked/indeterminate, custom styled
- `<nc-radio-group>` + `<nc-radio>` — Arrow key navigation, group binding
- `<nc-toggle>` — Switch with smooth CSS animation, 3 sizes
- `<nc-search-input>` — Built-in debounce, clear button, loading state
- `<nc-modal>` — Focus trap, Escape/overlay close, CSS animations
- `<nc-toast>` + `<nc-toast-container>` — Programmatic API, auto-dismiss, stacking
- `<nc-drawer>` — Slide from 4 directions, focus trap
- `<nc-popover>` — 12 placements, smart repositioning, arrow indicator
- `<nc-alert>` — 4 variants, dismissible, icon slots

#### Sprint 3: Navigation, Data Display & Wrappers (8 components + wrappers)
- `<nc-tabs>` + `<nc-tab>` + `<nc-tab-panel>` — 3 variants, lazy rendering
- `<nc-accordion>` + `<nc-accordion-item>` — Single/multiple open, animated
- `<nc-breadcrumb>` + `<nc-breadcrumb-item>` — Configurable separator
- `<nc-pagination>` — Page numbers with ellipsis, configurable siblings
- `<nc-progress-bar>` — Determinate/indeterminate modes
- `<nc-star-rating>` — Interactive, half-star, keyboard accessible
- `<nc-dropdown-menu>` + items — Full keyboard navigation, nested groups
- `<nc-table>` — Sortable headers, striped/hoverable/compact variants

#### Framework Wrappers
- `@aspect-ui/react` — React wrapper with forwardRef, event mapping, TypeScript
- `@aspect-ui/angular` — Angular module with ControlValueAccessor, NgModule
