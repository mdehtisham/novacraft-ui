# NovaCraft UI

> **Zero-Dependency Framework-Agnostic Web Component Library**
> 30 production-ready components built with Custom Elements v1 + Shadow DOM

[![CI](https://github.com/mdehtisham/novacraft-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/mdehtisham/novacraft-ui/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@novacraft/core)](https://www.npmjs.com/package/@novacraft/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Bundle Size](https://img.shields.io/badge/gzip-~40KB-green)](https://www.npmjs.com/package/@novacraft/core)

**[Live Storybook →](https://mdehtisham.github.io/novacraft-ui)**

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Framework Guides](#framework-guides)
- [Components](#components-30)
- [Theming](#theming)
- [Dark Mode](#dark-mode)
- [Accessibility](#accessibility)
- [Browser Support](#browser-support)
- [Local Development](#local-development)
- [Architecture](#architecture)

---

## Installation

```bash
npm install @novacraft/core
# or
bun add @novacraft/core
# or
yarn add @novacraft/core
# or
pnpm add @novacraft/core
```

---

## Quick Start

### Option 1 — Import everything (simplest)

```typescript
import '@novacraft/core';
import '@novacraft/core/tokens'; // design tokens CSS (required for theming)
```

```html
<nc-button variant="primary">Click Me</nc-button>
<nc-input label="Email" type="email"></nc-input>
<nc-modal id="my-modal">
  <span slot="title">Hello</span>
  <p>Modal content here.</p>
</nc-modal>
```

### Option 2 — CDN (no build step)

```html
<!-- In your <head> -->
<script type="module" src="https://unpkg.com/@novacraft/core/dist/esm/index.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@novacraft/core/dist/css/tokens.css">
```

```html
<nc-button variant="primary">Click Me</nc-button>
```

> **Tip:** Import the tokens CSS once at the root of your app. Everything else is self-contained in each component's Shadow DOM.

---

## Framework Guides

### React (18+)

NovaCraft UI ships a **first-class React wrapper** at `@novacraft/core/react`. Every component is a fully typed `forwardRef` component with React-style event props (`onNcClick`, `onNcChange`, etc.) instead of raw DOM listeners.

```bash
npm install @novacraft/core
```

```tsx
// main.tsx — register the web components once
import '@novacraft/core';
import '@novacraft/core/tokens';
```

```tsx
// Use the React wrapper for typed props + idiomatic event handling
import { NcButton, NcInput, NcModal, NcAlert } from '@novacraft/core/react';

export function LoginForm() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <NcInput label="Email" type="email" required onNcChange={(e) => console.log(e.detail.value)} />
      <NcInput label="Password" type="password" />
      <NcButton variant="primary" onNcClick={() => setOpen(true)}>
        Sign In
      </NcButton>

      <NcModal open={open} onNcClose={() => setOpen(false)}>
        <span slot="title">Welcome back</span>
        <NcAlert variant="success">Login successful!</NcAlert>
      </NcModal>
    </>
  );
}
```

All 30 components are available from `@novacraft/core/react` with full TypeScript types. React is an **optional peer dependency** — non-React users are never affected.

---

### Angular (15+)

Angular supports Web Components natively via `CUSTOM_ELEMENTS_SCHEMA`. NovaCraft UI provides a ready-made `NovaCraftModule` that adds:

- `[(ngModel)]` and **reactive forms** support on all 6 form components (`nc-input`, `nc-textarea`, `nc-select`, `nc-checkbox`, `nc-toggle`, `nc-radio-group`)
- Proper `[open]` boolean binding on `nc-modal` and `nc-drawer`
- Auto-registers all 30 web components on module import

> **Why copy instead of import?** Angular libraries must be compiled with `ng-packagr` to be importable as an npm package. NovaCraft UI is a framework-agnostic library, so the Angular module ships as TypeScript source you add once to your project.

---

**Step 1 — Install the package:**

```bash
npm install @novacraft/core
```

---

**Step 2 — Add `novacraft.module.ts` to your Angular project:**

Save the file to `src/app/novacraft.module.ts` inside your Angular project.

You have two options:

**Option A — Download the file directly:**

[⬇ Download novacraft.module.ts](https://raw.githubusercontent.com/mdehtisham/novacraft-ui/master/src/wrappers/angular/novacraft.module.ts)

> Right-click the link → **Save Link As** → save to `your-angular-project/src/app/novacraft.module.ts`

Or with curl:
```bash
curl -o src/app/novacraft.module.ts \
  https://raw.githubusercontent.com/mdehtisham/novacraft-ui/master/src/wrappers/angular/novacraft.module.ts
```

**Option B — Copy and paste the content:**

<details>
<summary>📋 Click to expand — copy the full file content</summary>

```typescript
import {
  NgModule,
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 'nc-input, nc-textarea, nc-select, nc-checkbox, nc-toggle, nc-radio-group',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NcValueAccessorDirective),
      multi: true,
    },
  ],
})
export class NcValueAccessorDirective implements ControlValueAccessor {
  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef) {}

  writeValue(value: unknown): void {
    const element = this.el.nativeElement;
    const tagName = element.tagName.toLowerCase();
    if (tagName === 'nc-checkbox' || tagName === 'nc-toggle') {
      if (value) element.setAttribute('checked', '');
      else element.removeAttribute('checked');
    } else {
      element.setAttribute('value', value != null ? String(value) : '');
    }
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) this.el.nativeElement.setAttribute('disabled', '');
    else this.el.nativeElement.removeAttribute('disabled');
  }

  @HostListener('nc-change', ['$event'])
  handleChange(event: CustomEvent): void {
    const tagName = this.el.nativeElement.tagName.toLowerCase();
    if (tagName === 'nc-checkbox' || tagName === 'nc-toggle') {
      this.onChange(event.detail?.checked);
    } else {
      this.onChange(event.detail?.value ?? this.el.nativeElement.getAttribute('value'));
    }
  }

  @HostListener('nc-input', ['$event'])
  handleInput(event: CustomEvent): void {
    this.onChange(event.detail?.value ?? this.el.nativeElement.getAttribute('value'));
  }

  @HostListener('nc-blur')
  handleBlur(): void {
    this.onTouched();
  }
}

@Directive({ selector: 'nc-modal' })
export class NcModalDirective {
  @Input() set open(value: boolean) {
    if (value) this.el.nativeElement.setAttribute('open', '');
    else this.el.nativeElement.removeAttribute('open');
  }
  constructor(private el: ElementRef) {}
}

@Directive({ selector: 'nc-drawer' })
export class NcDrawerDirective {
  @Input() set open(value: boolean) {
    if (value) this.el.nativeElement.setAttribute('open', '');
    else this.el.nativeElement.removeAttribute('open');
  }
  constructor(private el: ElementRef) {}
}

@NgModule({
  declarations: [NcValueAccessorDirective, NcModalDirective, NcDrawerDirective],
  exports: [NcValueAccessorDirective, NcModalDirective, NcDrawerDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NovaCraftModule {
  constructor() {
    import('@novacraft/core');
  }
}
```

</details>

After saving, your project structure should look like:

```
your-angular-project/
└── src/
    └── app/
        ├── novacraft.module.ts   ← paste here
        ├── app.module.ts
        └── app.component.ts
```

---

**Step 3 — Import `NovaCraftModule` in your app:**

```typescript
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';       // required for [(ngModel)]
import { NovaCraftModule } from './novacraft.module'; // the file you just added
import '@novacraft/core/tokens';                     // design tokens CSS

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, NovaCraftModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

For **standalone components** (Angular 17+), import the directives directly:

```typescript
// any.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NcValueAccessorDirective, NcModalDirective, NcDrawerDirective } from './novacraft.module';

@Component({
  standalone: true,
  imports: [FormsModule, NcValueAccessorDirective, NcModalDirective, NcDrawerDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `...`,
})
export class MyComponent {}
```

---

**Step 4 — Use components with full Angular binding support:**

```html
<!-- src/app/app.component.html -->

<!-- Template-driven forms — [(ngModel)] works on all form components -->
<nc-input label="Email" type="email" [(ngModel)]="email" required></nc-input>
<nc-textarea label="Message" [(ngModel)]="message" auto-grow></nc-textarea>
<nc-select label="Role" [(ngModel)]="role"></nc-select>
<nc-checkbox label="Subscribe to updates" [(ngModel)]="subscribe"></nc-checkbox>
<nc-toggle label="Dark Mode" [(ngModel)]="darkMode"></nc-toggle>
<nc-radio-group name="plan" [(ngModel)]="plan">
  <nc-radio value="free">Free</nc-radio>
  <nc-radio value="pro">Pro</nc-radio>
</nc-radio-group>

<!-- Modal and Drawer — boolean [open] binding works -->
<nc-modal [open]="showModal" (nc-close)="showModal = false">
  <span slot="title">Confirm Action</span>
  <p>Are you sure you want to continue?</p>
  <div slot="footer">
    <nc-button variant="ghost" (nc-click)="showModal = false">Cancel</nc-button>
    <nc-button variant="primary" (nc-click)="confirm()">Confirm</nc-button>
  </div>
</nc-modal>

<nc-button variant="primary" [loading]="isLoading" (nc-click)="submit()">
  Submit
</nc-button>
```

```typescript
// src/app/app.component.ts
import { Component } from '@angular/core';

@Component({ selector: 'app-root', templateUrl: './app.component.html' })
export class AppComponent {
  email = '';
  message = '';
  role = '';
  subscribe = false;
  darkMode = false;
  plan = 'free';
  showModal = false;
  isLoading = false;

  submit() {
    this.isLoading = true;
    // your submit logic
  }

  confirm() {
    this.showModal = false;
  }
}
```

---

### Vue 3

```typescript
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import '@novacraft/core';
import '@novacraft/core/tokens';

// Tell Vue to treat nc-* tags as custom elements
const app = createApp(App);
app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('nc-');
app.mount('#app');
```

```vue
<template>
  <nc-input label="Search" @ncchange="handleSearch" />
  <nc-button variant="primary" @ncclick="handleSubmit">Search</nc-button>

  <nc-modal :open="showModal" @ncclose="showModal = false">
    <span slot="title">Results</span>
    <p>{{ result }}</p>
  </nc-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const showModal = ref(false);
const result = ref('');

function handleSearch(e: CustomEvent) {
  result.value = e.detail.value;
}

function handleSubmit() {
  showModal.value = true;
}
</script>
```

---

### Svelte 5

```typescript
// +layout.ts or app.ts — register once
import '@novacraft/core';
import '@novacraft/core/tokens';
```

```svelte
<script lang="ts">
  let query = '';
  let loading = false;

  function handleSearch(e: CustomEvent) {
    query = e.detail.value;
  }
</script>

<nc-search-input
  placeholder="Search..."
  on:ncsearch={handleSearch}
/>

<nc-button variant="primary" loading={loading} on:ncclick={() => loading = true}>
  Search
</nc-button>

<nc-alert variant="info">
  Showing results for: {query}
</nc-alert>
```

---

### Plain HTML / Vanilla JS

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="https://unpkg.com/@novacraft/core/dist/css/tokens.css">
</head>
<body>
  <nc-card variant="elevated" padding="md">
    <span slot="header">User Profile</span>
    <nc-avatar name="Jane Doe" size="lg"></nc-avatar>
    <nc-badge variant="success">Active</nc-badge>
  </nc-card>

  <nc-button id="open-btn" variant="primary">Open Modal</nc-button>
  <nc-modal id="my-modal">
    <span slot="title">Confirm Action</span>
    <p>Are you sure?</p>
    <div slot="footer">
      <nc-button variant="ghost" id="cancel-btn">Cancel</nc-button>
      <nc-button variant="primary" id="confirm-btn">Confirm</nc-button>
    </div>
  </nc-modal>

  <script type="module">
    import 'https://unpkg.com/@novacraft/core/dist/esm/index.js';

    const modal = document.getElementById('my-modal');
    document.getElementById('open-btn').addEventListener('ncclick', () => {
      modal.open = true;
    });
    document.getElementById('cancel-btn').addEventListener('ncclick', () => {
      modal.open = false;
    });
  </script>
</body>
</html>
```

---

## Components (30)

### Core Primitives

| Component | Tag | Key Attributes |
|-----------|-----|----------------|
| Button | `<nc-button>` | `variant` primary/secondary/ghost/danger/warning/success, `size` sm/md/lg/xl, `loading`, `disabled`, `icon-only` |
| Badge | `<nc-badge>` | `variant` primary/success/warning/danger/info/neutral/dark, `pill`, `removable` |
| Card | `<nc-card>` | `variant` elevated/outlined/filled, `padding` none/sm/md/lg, `interactive` |
| Icon | `<nc-icon>` | `name` (60+ built-in icons), `size`, `color` |
| Spinner | `<nc-spinner>` | `size` sm/md/lg, `variant` |
| Skeleton | `<nc-skeleton>` | `variant` text/rect/circle, `animation` pulse/wave/none, `width`, `height` |
| Theme Toggle | `<nc-theme-toggle>` | `mode` light/dark/system, `persist` |
| Tooltip | `<nc-tooltip>` | `content`, `placement` top/bottom/left/right, `trigger` hover/focus |
| Avatar | `<nc-avatar>` | `name`, `src`, `size` sm/md/lg/xl, `shape` circle/square |
| Status Badge | `<nc-status-badge>` | `status` online/offline/busy/away/pending/error, `pulse` |

### Form Components

| Component | Tag | Key Attributes |
|-----------|-----|----------------|
| Input | `<nc-input>` | `type` text/email/password/number/tel/url/search, `label`, `placeholder`, `error`, `hint`, `required`, `disabled` |
| Textarea | `<nc-textarea>` | `label`, `rows`, `auto-grow`, `max-length`, `resize` none/both/vertical |
| Select | `<nc-select>` | `label`, `placeholder`, `searchable`, `disabled`, `multiple` |
| Checkbox | `<nc-checkbox>` | `label`, `checked`, `indeterminate`, `disabled` |
| Radio Group | `<nc-radio-group>` | `name`, `value`, `orientation` horizontal/vertical |
| Toggle | `<nc-toggle>` | `label`, `checked`, `size` sm/md/lg, `disabled` |
| Search Input | `<nc-search-input>` | `placeholder`, `debounce` (ms), `loading`, `clearable` |

### Overlay & Feedback

| Component | Tag | Key Attributes |
|-----------|-----|----------------|
| Modal | `<nc-modal>` | `open`, `size` sm/md/lg/full, `dismissible`, slots: `title`/`footer` |
| Toast | `<nc-toast>` | `variant` success/error/warning/info, `duration`, `dismissible` |
| Drawer | `<nc-drawer>` | `open`, `placement` left/right/top/bottom, `size`, `dismissible` |
| Popover | `<nc-popover>` | `placement` (12 options), `trigger` click/hover, `offset` |
| Alert | `<nc-alert>` | `variant` info/success/warning/error, `dismissible`, `title` |

### Navigation & Data Display

| Component | Tag | Key Attributes |
|-----------|-----|----------------|
| Tabs | `<nc-tabs>` | `variant` line/enclosed/pills, `placement` top/bottom/left/right |
| Accordion | `<nc-accordion>` | `multiple` (allow many open), `animated` |
| Breadcrumb | `<nc-breadcrumb>` | `separator` custom char/icon |
| Pagination | `<nc-pagination>` | `page`, `total-pages`, `sibling-count` |
| Progress Bar | `<nc-progress-bar>` | `value` 0–100, `indeterminate`, `variant`, `label` |
| Star Rating | `<nc-star-rating>` | `value`, `max`, `half-stars`, `readonly` |
| Dropdown Menu | `<nc-dropdown-menu>` | `placement`, `trigger` click/hover; `<nc-menu-item>`, `<nc-menu-group>`, `<nc-menu-divider>` |
| Table | `<nc-table>` | `sortable`, `striped`, `hoverable`, `compact`, `caption` |

### Programmatic Toast API

```typescript
import { toast } from '@novacraft/core';

toast.success('Profile saved!');
toast.error('Something went wrong.', { duration: 8000 });
toast.warning('Your session expires soon.');
toast.info('3 new messages.', { dismissible: true });
```

> A `<nc-toast-container>` element is automatically injected into `<body>` on first use.

---

## Theming

All design tokens are CSS Custom Properties on `:root`. Because they are inherited, they **penetrate Shadow DOM** and style every component.

```css
:root {
  /* Brand colors */
  --nc-color-primary-500: #6366f1;
  --nc-color-primary-600: #4f46e5;

  /* Neutral palette */
  --nc-color-neutral-100: #f5f5f5;
  --nc-color-neutral-900: #171717;

  /* Typography */
  --nc-font-family-sans: 'Inter', system-ui, sans-serif;
  --nc-font-size-base: 1rem;

  /* Shape */
  --nc-radius-sm: 0.25rem;
  --nc-radius-md: 0.375rem;
  --nc-radius-lg: 0.5rem;
  --nc-radius-full: 9999px;

  /* Elevation */
  --nc-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --nc-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --nc-shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.15);
}
```

Import the full token sheet once:

```typescript
import '@novacraft/core/tokens'; // via npm
```

```html
<link rel="stylesheet" href="https://unpkg.com/@novacraft/core/dist/css/tokens.css"> <!-- via CDN -->
```

---

## Dark Mode

### Automatic (recommended)

```html
<nc-theme-toggle persist></nc-theme-toggle>
```

The `persist` attribute saves the user's preference to `localStorage` and restores it on page load.

### Manual

```javascript
// Enable dark mode
document.documentElement.setAttribute('data-theme', 'dark');

// Enable light mode
document.documentElement.setAttribute('data-theme', 'light');

// Follow the OS preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
```

---

## Accessibility

- **WCAG 2.1 AA** compliant across all 30 components
- Semantic ARIA roles, states, and properties on every component
- Full keyboard navigation (`Tab`, arrow keys, `Enter`, `Space`, `Escape`)
- Focus trap in `<nc-modal>` and `<nc-drawer>` (focus stays inside when open)
- `aria-live` regions for toast notifications
- Reduced-motion support via `prefers-reduced-motion`
- Screen reader tested with NVDA, JAWS, and VoiceOver

---

## Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 90+ |
| Edge | 90+ |
| Firefox | 90+ |
| Safari | 15.4+ |

> Requires native Custom Elements v1 + Shadow DOM v1. No polyfills needed for the listed versions.

---

## Local Development

```bash
git clone https://github.com/mdehtisham/novacraft-ui.git
cd novacraft-ui
bun install

bun run storybook        # Interactive component explorer → http://localhost:6006
bun run test             # Run tests once
bun run test:watch       # Tests in watch mode
bun run test:coverage    # Coverage report (≥90% lines required)
bun run typecheck        # TypeScript strict check
bun run build            # Production build → dist/
bun run build-storybook  # Static Storybook → storybook-static/
```

### Project Structure

```
src/
├── index.ts                  # Main entry — exports all components
├── core/base-element.ts      # Abstract base class all components extend
├── utils/helpers.ts          # defineElement, css, clamp, debounce, uniqueId
├── theme/tokens.css          # Full design token system
├── components/
│   ├── button/button.ts
│   ├── button/button.stories.ts
│   └── ...                   # 30 components, same structure each
└── wrappers/
    ├── react/index.tsx       # React type helpers
    └── angular/novacraft.module.ts
```

---

## Architecture

| Principle | Detail |
|-----------|--------|
| Zero dependencies | No Lit, no Stencil, no virtual DOM — pure Custom Elements v1 + Shadow DOM |
| Framework agnostic | Works with React, Angular, Vue, Svelte, or plain HTML |
| Tree-shakeable | ES module build — bundlers eliminate unused components |
| TypeScript first | Full `.d.ts` declarations shipped with the package |
| CSS Custom Properties | Tokens on `:root` penetrate Shadow DOM for consistent theming |
| ~40 KB gzipped | All 30 components combined (ESM build) |

---

## Contributing

1. Fork and clone the repo
2. `bun install`
3. Create a branch: `git checkout -b feat/my-component`
4. Write your component in `src/components/your-component/`
5. Add stories in `your-component.stories.ts`
6. Ensure `bun run typecheck && bun run test:coverage` pass
7. Open a pull request

See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for the full contribution guide, component authoring patterns, and design token reference.

---

## License

MIT © [mdehtisham](https://github.com/mdehtisham)
