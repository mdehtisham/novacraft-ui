# NovaCraft UI — Developer Guide

> **Version:** 0.1.0 · **Package:** `@novacraft/core`  
> **Stack:** TypeScript 5.x · Custom Elements v1 · Shadow DOM · Vite 6 · Vitest · Storybook 8

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Local Development Setup](#2-local-development-setup)
3. [Project Structure](#3-project-structure)
4. [How Components Work](#4-how-components-work)
5. [Design Token System](#5-design-token-system)
6. [Writing Component Documentation (Stories)](#6-writing-component-documentation-stories)
7. [Using Storybook](#7-using-storybook)
8. [Testing Guide](#8-testing-guide)
9. [Framework Integration](#9-framework-integration)
    - [Vanilla HTML / CDN](#91-vanilla-html--cdn)
    - [React](#92-react)
    - [Angular](#93-angular)
    - [Vue 3](#94-vue-3)
    - [Svelte 5](#95-svelte-5)
    - [Next.js (SSR)](#96-nextjs-ssr)
    - [Nuxt 3](#97-nuxt-3)
10. [Theming & Customization](#10-theming--customization)
11. [Building Custom Components](#11-building-custom-components)
12. [Icon Registry](#12-icon-registry)
13. [Accessibility Guide](#13-accessibility-guide)
14. [Contributing Guide](#14-contributing-guide)
15. [Troubleshooting](#15-troubleshooting)

---

## 1. Architecture Overview

NovaCraft UI is a **zero-dependency, framework-agnostic** component library built on native web standards. Every component is a Custom Element (v1) with Shadow DOM encapsulation — no Lit, no Stencil, no virtual DOM.

```
┌─────────────────────────────────────────────────────────────┐
│                     @novacraft/core                          │
│                                                             │
│  ┌──────────────┐   ┌──────────────┐   ┌─────────────────┐ │
│  │ NcBaseElement│   │  tokens.css  │   │  Icon Registry  │ │
│  │ (base class) │   │ (CSS tokens) │   │  (SVG sprites)  │ │
│  └──────┬───────┘   └──────────────┘   └─────────────────┘ │
│         │                                                    │
│  ┌──────┴────────────────────────────────────────────────┐  │
│  │              30 Custom Elements                        │  │
│  │  <nc-button> <nc-modal> <nc-input> <nc-table> ...     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         │                            │
         ▼                            ▼
┌─────────────────┐        ┌──────────────────┐
│ @novacraft/react│        │@novacraft/angular │
│ (React wrappers)│        │(Angular module)   │
└─────────────────┘        └──────────────────┘
```

### Why Custom Elements?

| Concern | Approach |
|---------|---------|
| **Encapsulation** | Shadow DOM — styles never leak in or out |
| **Reactivity** | `attributeChangedCallback` + manual `_render()` — exactly what we need, nothing more |
| **Theming** | CSS Custom Properties penetrate Shadow DOM — no JS overhead |
| **Bundle size** | Zero runtime dependencies; tree-shake individual components |
| **SSR** | Declarative Shadow DOM (Chrome/Safari) + `ElementInternals` polyfill path |
| **Framework compat** | Any framework that renders HTML works; wrappers handle event mapping |

---

## 2. Local Development Setup

### Prerequisites

| Tool | Min Version | Check |
|------|-------------|-------|
| Node.js | 20.x LTS | `node --version` |
| npm | 10.x | `npm --version` |
| Git | 2.x | `git --version` |
| Modern browser | Chrome 90+ / Firefox 90+ / Safari 15.4+ | — |

> **Tip:** Use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm) to manage Node versions.

### Step-by-Step Setup

```bash
# 1. Clone the portfolio repository
git clone <your-repo-url>
cd portfolio/novacraft-ui

# 2. Install all dev dependencies
npm install

# 3. Verify TypeScript compiles with zero errors
npx tsc --noEmit

# 4. Run the test suite
npm run test

# 5. Start Storybook (component explorer + live docs)
npm run storybook
# → Opens at http://localhost:6006

# 6. Build the library
npm run build
# → Outputs to ./dist/
```

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev server | `npm run dev` | Vite HMR dev server (for demos) |
| Build | `npm run build` | `tsc` + Vite lib mode → ESM/CJS/IIFE + `.d.ts` |
| Typecheck | `npm run typecheck` | `tsc --noEmit` — zero errors required |
| Test (once) | `npm run test` | Vitest in jsdom mode |
| Test (watch) | `npm run test:watch` | Vitest interactive watch |
| Coverage | `npm run test:coverage` | V8 coverage report (≥90% lines required) |
| Storybook | `npm run storybook` | Storybook 8 dev server on :6006 |
| Build docs | `npm run build-storybook` | Static Storybook site to `storybook-static/` |

### Build Output Explained

After `npm run build`:

```
dist/
├── es/
│   └── index.js          # ES modules — for bundlers (Vite, webpack)
├── cjs/
│   └── index.js          # CommonJS — for Node.js / older toolchains
├── iife/
│   └── index.js          # IIFE bundle — for <script> CDN usage
├── types/
│   └── index.d.ts        # TypeScript declarations (rolled up)
└── css/
    └── tokens.css        # Design tokens (standalone CSS file)
```

The `exports` map in `package.json` routes consumers to the right format automatically:
- `import '@novacraft/core'` → ES modules
- `require('@novacraft/core')` → CJS
- `<script src="dist/iife/index.js">` → sets `window.NovaCraftUI`

---

## 3. Project Structure

```
novacraft-ui/
├── .github/
│   └── workflows/
│       └── ci.yml                    # CI: typecheck → test → build
├── .storybook/
│   ├── main.ts                       # Storybook 8 config, addons, framework
│   └── preview.ts                    # Global decorators, token import
├── src/
│   ├── index.ts                      # 📦 Barrel — exports all 30 components
│   ├── core/
│   │   └── base-element.ts           # 🏗️ NcBaseElement abstract class
│   ├── theme/
│   │   └── tokens.css                # 🎨 CSS custom properties (light + dark)
│   ├── utils/
│   │   └── helpers.ts                # 🔧 defineElement, debounce, uniqueId...
│   ├── components/
│   │   ├── button/
│   │   │   ├── button.ts             # Component implementation
│   │   │   ├── button.test.ts        # Vitest unit tests  (add these)
│   │   │   └── button.stories.ts     # Storybook stories  (add these)
│   │   ├── badge/                    # Same structure for every component
│   │   ├── card/
│   │   ├── icon/
│   │   ├── ... (30 components total)
│   └── wrappers/
│       ├── react/
│       │   └── index.tsx             # React forwardRef wrappers
│       └── angular/
│           └── novacraft.module.ts   # Angular NgModule + ControlValueAccessor
├── package.json
├── tsconfig.json                     # Strict TS5 config
├── vite.config.ts                    # Vite lib mode build
├── vitest.config.ts                  # Vitest jsdom config
├── README.md
├── CHANGELOG.md
└── DEVELOPER_GUIDE.md               # ← You are here
```

---

## 4. How Components Work

Every NovaCraft UI component follows the same pattern. Understanding it unlocks the whole library.

### The NcBaseElement Contract

All components extend `NcBaseElement` — an abstract class that wraps the Custom Elements lifecycle:

```typescript
// src/core/base-element.ts (simplified)
export abstract class NcBaseElement extends HTMLElement {
  protected shadow: ShadowRoot;

  constructor() {
    super();
    // Shadow DOM with open mode (devtools-inspectable)
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  // ── Lifecycle ──────────────────────────────────────────

  connectedCallback() {
    // Called when element is inserted into DOM
    // Applies adoptedStyleSheets on first mount, then renders
    this._applyStyles();
    this._render();
  }

  disconnectedCallback() {
    // Calls _cleanup() — override to remove event listeners
    this._cleanup();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Re-renders only when an observed attribute actually changes
    if (oldValue !== newValue) this._render();
  }

  // ── Subclass Contract ──────────────────────────────────

  // REQUIRED: Return the Shadow DOM HTML template
  protected abstract render(): string;

  // OPTIONAL: Called after every render — attach event listeners here
  protected afterRender(): void {}

  // OPTIONAL: Called on disconnect — remove event listeners here
  protected _cleanup(): void {}

  // ── Utilities ──────────────────────────────────────────

  // Dispatch a composed, bubbling CustomEvent
  protected emit<T>(event: string, detail?: T): void

  // Attribute ↔ Property helpers
  protected getBoolAttr(name: string): boolean
  protected getStrAttr(name: string, fallback?: string): string
  protected getNumAttr(name: string, fallback?: number): number
  protected setBoolAttr(name: string, value: boolean): void
  protected setStrAttr(name: string, value: string): void
}
```

### Anatomy of a Component

Here's the exact pattern used by every NovaCraft UI component:

```typescript
// src/components/example/example.ts
import { NcBaseElement } from '../../core/base-element';
import { defineElement } from '../../utils/helpers';

export class NcExample extends NcBaseElement {
  // ① Declare observed attributes — triggers attributeChangedCallback
  static observedAttributes = ['variant', 'disabled', 'label'];

  // ② Static CSS string — applied via adoptedStyleSheets (shared across instances)
  static styles = `
    :host {
      display: inline-block;
    }
    /* Use CSS custom properties from tokens.css */
    .wrapper {
      background: var(--nc-color-primary-500);
      border-radius: var(--nc-radius-md);
      font-family: var(--nc-font-family-sans);
    }
    /* Host attribute selectors for state styling */
    :host([disabled]) .wrapper {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

  // ③ Private state (NOT attributes — avoids unnecessary re-renders)
  private _timer: ReturnType<typeof setTimeout> | null = null;

  // ④ Render returns the Shadow DOM HTML
  protected render(): string {
    const variant = this.getStrAttr('variant', 'default');
    const disabled = this.getBoolAttr('disabled');
    const label = this.getStrAttr('label', 'Example');

    return `
      <div class="wrapper wrapper--${variant}" part="base">
        <button
          class="btn"
          part="button"
          ${disabled ? 'disabled aria-disabled="true"' : ''}
          aria-label="${label}"
        >
          <slot></slot>
        </button>
      </div>
    `;
  }

  // ⑤ afterRender — attach DOM event listeners (re-run on every render)
  protected afterRender(): void {
    const btn = this.shadow.querySelector('.btn') as HTMLButtonElement;
    btn?.addEventListener('click', this._handleClick);
  }

  // ⑥ _cleanup — remove listeners to prevent memory leaks
  protected _cleanup(): void {
    const btn = this.shadow.querySelector('.btn') as HTMLButtonElement;
    btn?.removeEventListener('click', this._handleClick);
    if (this._timer) clearTimeout(this._timer);
  }

  // ⑦ Arrow function for stable reference across renders
  private _handleClick = (e: MouseEvent) => {
    if (this.getBoolAttr('disabled')) return;
    // Emit a composed, bubbling custom event
    this.emit('nc-click', { originalEvent: e });
  };
}

// ⑧ Register the custom element (idempotent — safe to call multiple times)
defineElement('nc-example', NcExample);
```

### The Rendering Pipeline

```
setAttribute('variant', 'primary')
        │
        ▼
attributeChangedCallback('variant', null, 'primary')
        │
        ▼
_render()
  │  createElement('template')
  │  template.innerHTML = this.render()     ← Your HTML string
  │  shadow.innerHTML = ''                  ← Wipe previous DOM
  │  shadow.appendChild(template.content)   ← Stamp fresh DOM
        │
        ▼
afterRender()                               ← Re-attach event listeners
```

> **Performance note:** The full Shadow DOM is replaced on every attribute change. For components with complex internal state (select, modal), the component uses imperative DOM updates in specific methods instead of always calling `_render()`.

### CSS Architecture (Shadow DOM + CSS Parts)

NovaCraft UI uses a three-layer style system:

```
Layer 1: tokens.css         → CSS custom properties on :root
         (outside Shadow DOM, penetrates in via custom properties)

Layer 2: component styles   → Applied via adoptedStyleSheets
         (inside Shadow DOM, encapsulated)

Layer 3: CSS Parts          → part="base" / ::part(base)
         (escape hatch for consumer styling)
```

**Consumers style components like this:**

```css
/* Override a CSS custom property (theme-level) */
:root {
  --nc-color-primary-500: #8b5cf6; /* purple instead of indigo */
}

/* Target a specific part of a component (component-level) */
nc-button::part(base) {
  border-radius: 0; /* square buttons site-wide */
  text-transform: uppercase;
}

/* Or scoped to a single instance */
.my-special-button::part(label) {
  letter-spacing: 0.1em;
}
```

---

## 5. Design Token System

All tokens are CSS custom properties defined in `src/theme/tokens.css`. They are the **single source of truth** for visual values across all 30 components.

### Token Categories

```css
/* ─── Colors ─── */
--nc-color-primary-{50-950}     /* Indigo scale */
--nc-color-neutral-{50-950}     /* Gray scale */
--nc-color-success-{50,100,500,600,700}
--nc-color-warning-{50,100,500,600,700}
--nc-color-danger-{50,100,500,600,700}
--nc-color-info-{50,100,500,600,700}

/* ─── Typography ─── */
--nc-font-family-sans           /* system-ui stack */
--nc-font-family-mono           /* Fira Code stack */
--nc-font-size-{xs,sm,md,lg,xl} /* 0.75–1.25rem */
--nc-font-weight-{normal,medium,semibold,bold}
--nc-line-height-{tight,normal,relaxed}

/* ─── Spacing ─── */
--nc-spacing-{0,1,2,3,4,5,6,8,10,12}  /* 0–3rem */

/* ─── Border Radius ─── */
--nc-radius-{none,sm,md,lg,xl,2xl,full}

/* ─── Shadows ─── */
--nc-shadow-{xs,sm,md,lg,xl}

/* ─── Transitions ─── */
--nc-transition-{fast,normal,slow}  /* 150ms/200ms/300ms ease */

/* ─── Z-Index ─── */
--nc-z-{dropdown,sticky,modal,popover,tooltip,toast}

/* ─── Focus Ring ─── */
--nc-focus-ring
--nc-focus-ring-offset
```

### Using Tokens in Your CSS

Inside Shadow DOM, reference tokens directly:

```css
.button {
  background: var(--nc-color-primary-600);
  border-radius: var(--nc-radius-md);
  padding: var(--nc-spacing-2) var(--nc-spacing-4);
  font-family: var(--nc-font-family-sans);
  transition: background var(--nc-transition-fast);
  box-shadow: var(--nc-shadow-sm);
}

.button:focus-visible {
  box-shadow: var(--nc-focus-ring-offset);
}
```

### Dark Mode

Dark mode works via a single attribute on the `<html>` element:

```html
<html data-theme="dark">
```

Tokens automatically remap. The `<nc-theme-toggle>` component handles this automatically with `localStorage` persistence:

```html
<!-- Add anywhere in your page — it handles everything -->
<nc-theme-toggle persist></nc-theme-toggle>
```

Or control programmatically:

```javascript
// Light mode
document.documentElement.removeAttribute('data-theme');

// Dark mode
document.documentElement.setAttribute('data-theme', 'dark');

// System preference
const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
```

---

## 6. Writing Component Documentation (Stories)

Each component needs a `.stories.ts` file alongside its implementation. Storybook 8 reads these to build the interactive documentation.

### Story File Structure

Create `src/components/button/button.stories.ts`:

```typescript
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

// Import the component to ensure it's registered
import './button';

/**
 * Meta defines the component's documentation page.
 * The `title` field determines the sidebar navigation path.
 */
const meta: Meta = {
  title: 'Components/Button',          // Sidebar: Components > Button
  component: 'nc-button',              // The custom element tag
  tags: ['autodocs'],                  // Auto-generate API docs from static analysis
  argTypes: {
    // Each attribute becomes a control in the Storybook UI
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'danger', 'outline', 'link'],
      description: 'Visual style of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size of the button',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button and prevents interaction',
    },
    loading: {
      control: 'boolean',
      description: 'Shows a loading spinner and disables interaction',
    },
    'full-width': {
      control: 'boolean',
      description: 'Makes the button fill its container width',
    },
  },
  parameters: {
    // Custom documentation written in MDX (optional)
    docs: {
      description: {
        component: `
The \`<nc-button>\` component is the primary interaction element in NovaCraft UI.

**When to use:**
- Submitting forms
- Triggering actions
- Navigation (use \`link\` variant)

**When NOT to use:**
- Navigation between pages (use an \`<a>\` tag)
- Toggle state (use \`<nc-toggle>\`)
`,
      },
    },
    // Accessibility config
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// ─── Stories ─────────────────────────────────────────────────

/** The default button — used for primary actions. */
export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
  },
  render: (args) => html`
    <nc-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
    >
      Click me
    </nc-button>
  `,
};

/** All 6 variants shown together for visual comparison. */
export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
      <nc-button variant="primary">Primary</nc-button>
      <nc-button variant="secondary">Secondary</nc-button>
      <nc-button variant="ghost">Ghost</nc-button>
      <nc-button variant="danger">Danger</nc-button>
      <nc-button variant="outline">Outline</nc-button>
      <nc-button variant="link">Link</nc-button>
    </div>
  `,
  parameters: {
    docs: {
      description: {
        story: 'All 6 variants of the button component rendered side by side.',
      },
    },
  },
};

/** All 5 sizes. */
export const AllSizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 1rem; align-items: center;">
      <nc-button size="xs">XSmall</nc-button>
      <nc-button size="sm">Small</nc-button>
      <nc-button size="md">Medium</nc-button>
      <nc-button size="lg">Large</nc-button>
      <nc-button size="xl">XLarge</nc-button>
    </div>
  `,
};

/** Interactive states. */
export const States: Story = {
  render: () => html`
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <nc-button>Normal</nc-button>
      <nc-button disabled>Disabled</nc-button>
      <nc-button loading>Loading...</nc-button>
    </div>
  `,
};

/** Button with icon slots. */
export const WithIcons: Story = {
  render: () => html`
    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
      <nc-button>
        <nc-icon slot="prefix" name="download" size="sm"></nc-icon>
        Download
      </nc-button>
      <nc-button variant="secondary">
        Settings
        <nc-icon slot="suffix" name="chevron-down" size="sm"></nc-icon>
      </nc-button>
      <nc-button icon-only aria-label="Delete">
        <nc-icon name="trash"></nc-icon>
      </nc-button>
    </div>
  `,
};

/** Full-width button for forms. */
export const FullWidth: Story = {
  render: () => html`
    <div style="max-width: 400px;">
      <nc-button full-width>Submit Form</nc-button>
    </div>
  `,
};

/** Dark mode preview. */
export const DarkMode: Story = {
  render: () => html`
    <div data-theme="dark" style="padding: 2rem; background: #0a0a0a; border-radius: 8px;">
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <nc-button variant="primary">Primary</nc-button>
        <nc-button variant="secondary">Secondary</nc-button>
        <nc-button variant="ghost">Ghost</nc-button>
        <nc-button variant="outline">Outline</nc-button>
      </div>
    </div>
  `,
  parameters: { backgrounds: { default: 'dark' } },
};
```

### Story Best Practices

| Do | Don't |
|----|-------|
| Write a `Default` story showing the most common usage | Make `Default` too complex |
| Show `AllVariants` to compare visual states | Show only one variant |
| Write dedicated stories for edge cases | Bury edge cases in controls only |
| Add `description` to each `argType` | Leave argTypes undocumented |
| Add `a11y` checks in parameters | Skip accessibility testing |
| Show dark mode in a separate story | Assume light-mode-only |
| Use `?disabled=${args.disabled}` for boolean attrs in Lit | Use `disabled="${args.disabled}"` (always truthy) |

---

## 7. Using Storybook

### Starting Storybook

```bash
cd novacraft-ui
npm run storybook
# Storybook opens at → http://localhost:6006
```

### Navigation

```
Storybook Sidebar
├── Introduction
│   └── Getting Started
├── Components
│   ├── Button          ← Each component is a page
│   │   ├── Primary     ← Each export is a story
│   │   ├── AllVariants
│   │   ├── AllSizes
│   │   └── ...
│   ├── Badge
│   ├── Card
│   └── ...
└── Forms
    ├── Input
    └── ...
```

### Controls Panel

Every story argument defined in `argTypes` becomes an interactive control:

1. Open any story (e.g., **Components → Button → Primary**)
2. In the bottom panel, click the **Controls** tab
3. Change `variant` dropdown → component updates live
4. Toggle `disabled` → component updates live
5. URL updates with `?args=variant:secondary;disabled:true` — sharable link!

### Actions Panel

Custom events emitted by components appear in the **Actions** tab:

```typescript
// In your story's meta argTypes:
argTypes: {
  onNcClick: { action: 'nc-click' },
  onNcFocus: { action: 'nc-focus' },
}

// When the button is clicked, Actions tab shows:
// nc-click → CustomEvent { detail: {...} }
```

### Accessibility (a11y) Panel

The `@storybook/addon-a11y` addon runs **axe-core** on every story:

1. Open any story
2. Click the **Accessibility** tab in the bottom panel
3. See violations, passes, and incomplete checks
4. Red badge on the tab = accessibility violations exist

**Requirement:** Every story must pass with zero violations before merging.

### Docs Tab

Click the **Docs** tab on any component to see:
- Auto-generated API table (from `argTypes`)
- `description` written in story metadata
- All stories embedded as interactive examples
- Source code preview for each story

### Building Static Storybook

```bash
npm run build-storybook
# Outputs to ./storybook-static/
# Deploy to Netlify/Vercel/GitHub Pages as static HTML
```

### Adding a New Component Story

```bash
# Story files live alongside the component
touch src/components/my-component/my-component.stories.ts
```

Minimum viable story:

```typescript
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './my-component';

const meta: Meta = {
  title: 'Components/My Component',
  component: 'nc-my-component',
  tags: ['autodocs'],
};
export default meta;

export const Default: StoryObj = {
  render: () => html`<nc-my-component></nc-my-component>`,
};
```

---

## 8. Testing Guide

### Running Tests

```bash
# Run all tests once
npm run test

# Watch mode (re-runs on file change)
npm run test:watch

# Coverage report (must meet thresholds)
npm run test:coverage
```

### Coverage Thresholds

Defined in `vitest.config.ts`:

```typescript
coverage: {
  thresholds: {
    lines: 90,      // 90% line coverage
    branches: 85,   // 85% branch coverage
    functions: 90,  // 90% function coverage
  }
}
```

### Writing Unit Tests

Create `src/components/button/button.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Import to register the custom element
import './button';

describe('NcButton', () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement('nc-button');
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  // ─── Rendering ──────────────────────────────────────────────

  it('renders a button element inside Shadow DOM', () => {
    const button = el.shadowRoot!.querySelector('button');
    expect(button).toBeTruthy();
  });

  it('applies default variant class', () => {
    const button = el.shadowRoot!.querySelector('button');
    expect(button!.className).toContain('btn--primary');
  });

  // ─── Attributes ─────────────────────────────────────────────

  it('applies variant attribute', () => {
    el.setAttribute('variant', 'danger');
    const button = el.shadowRoot!.querySelector('button');
    expect(button!.className).toContain('btn--danger');
  });

  it('applies size attribute', () => {
    el.setAttribute('size', 'xl');
    const button = el.shadowRoot!.querySelector('button');
    expect(button!.className).toContain('btn--xl');
  });

  it('sets disabled attribute correctly', () => {
    el.setAttribute('disabled', '');
    const button = el.shadowRoot!.querySelector('button');
    expect(button!.hasAttribute('disabled')).toBe(true);
  });

  it('shows spinner when loading', () => {
    el.setAttribute('loading', '');
    const spinner = el.shadowRoot!.querySelector('.spinner');
    expect(spinner).toBeTruthy();
  });

  // ─── Events ─────────────────────────────────────────────────

  it('emits nc-click on button click', () => {
    const spy = vi.fn();
    el.addEventListener('nc-click', spy);

    const button = el.shadowRoot!.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(spy).toHaveBeenCalledOnce();
  });

  it('does not emit nc-click when disabled', () => {
    el.setAttribute('disabled', '');
    const spy = vi.fn();
    el.addEventListener('nc-click', spy);

    const button = el.shadowRoot!.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(spy).not.toHaveBeenCalled();
  });

  // ─── Slots ──────────────────────────────────────────────────

  it('renders default slot content', () => {
    el.textContent = 'Click me';
    // Slots render slotted content via light DOM — check the host
    expect(el.textContent).toBe('Click me');
  });

  // ─── Keyboard ───────────────────────────────────────────────

  it('activates on Enter keypress', () => {
    const spy = vi.fn();
    el.addEventListener('nc-click', spy);

    const button = el.shadowRoot!.querySelector('button') as HTMLButtonElement;
    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    // Native button handles Enter → dispatches click → triggers nc-click
    expect(spy).toHaveBeenCalledOnce();
  });

  // ─── Accessibility ──────────────────────────────────────────

  it('has accessible role via native button', () => {
    const button = el.shadowRoot!.querySelector('button');
    // Native <button> has implicit role="button"
    expect(button?.tagName.toLowerCase()).toBe('button');
  });

  it('propagates aria-label to inner button', () => {
    el.setAttribute('aria-label', 'Close dialog');
    const button = el.shadowRoot!.querySelector('button');
    // Check the inner button reflects the label
    expect(button?.getAttribute('aria-label')).toBe('Close dialog');
  });

  // ─── Cleanup ────────────────────────────────────────────────

  it('removes event listeners on disconnect', () => {
    const spy = vi.spyOn(el.shadowRoot!.querySelector('button')!, 'removeEventListener');
    el.remove();
    expect(spy).toHaveBeenCalled();
  });
});
```

### Testing Overlay Components (Modal, Drawer, Toast)

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './modal';

describe('NcModal', () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement('nc-modal');
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  it('is hidden by default', () => {
    const overlay = el.shadowRoot!.querySelector('.nc-modal-overlay') as HTMLElement;
    // Check visibility via CSS (jsdom handles this)
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('opens when open attribute is set', () => {
    el.setAttribute('open', '');
    expect(el.hasAttribute('open')).toBe(true);
  });

  it('emits nc-close on Escape key', () => {
    el.setAttribute('open', '');
    const spy = vi.fn();
    el.addEventListener('nc-close', spy);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(spy).toHaveBeenCalledOnce();
  });

  it('traps focus within the modal', () => {
    el.innerHTML = `
      <button slot="header">Close</button>
      <input type="text" />
      <button slot="footer">Submit</button>
    `;
    el.setAttribute('open', '');
    // Focus trap verification — Tab should cycle within
    // (Full focus trap testing requires real browser or @web/test-runner)
  });
});
```

### Testing Form Components

```typescript
describe('NcInput', () => {
  it('syncs value attribute to inner input', () => {
    const el = document.createElement('nc-input') as any;
    document.body.appendChild(el);
    el.setAttribute('value', 'hello');

    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('hello');
    el.remove();
  });

  it('emits nc-input event on typing', () => {
    const el = document.createElement('nc-input');
    document.body.appendChild(el);
    const spy = vi.fn();
    el.addEventListener('nc-input', spy);

    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    input.value = 'test';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(spy).toHaveBeenCalledOnce();
    el.remove();
  });

  it('shows error message when error attribute is set', () => {
    const el = document.createElement('nc-input');
    el.setAttribute('error', 'This field is required');
    document.body.appendChild(el);

    const errorEl = el.shadowRoot!.querySelector('[part="error"]');
    expect(errorEl?.textContent).toContain('This field is required');
    el.remove();
  });
});
```

### Testing Custom Events

Custom events are composed and bubble — they work across Shadow DOM boundaries:

```typescript
it('receives custom event from inside Shadow DOM', () => {
  const el = document.createElement('nc-button');
  document.body.appendChild(el);

  const received: CustomEvent[] = [];
  // Listen on the host element (outside Shadow DOM)
  el.addEventListener('nc-click', (e) => received.push(e as CustomEvent));

  // Trigger from inside Shadow DOM
  const btn = el.shadowRoot!.querySelector('button')!;
  btn.click();

  expect(received.length).toBe(1);
  expect(received[0].bubbles).toBe(true);
  expect(received[0].composed).toBe(true);
});
```

---

## 9. Framework Integration

### 9.1 Vanilla HTML / CDN

The simplest integration — no build tools required:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NovaCraft UI Demo</title>

  <!-- Option A: CDN (once published) -->
  <script type="module" src="https://unpkg.com/@novacraft/core@0.1.0/dist/es/index.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/@novacraft/core@0.1.0/dist/css/tokens.css">

  <!-- Option B: Local build -->
  <script type="module" src="./node_modules/@novacraft/core/dist/es/index.js"></script>
  <link rel="stylesheet" href="./node_modules/@novacraft/core/dist/css/tokens.css">
</head>
<body>
  <!-- Theme toggle in top-right -->
  <nc-theme-toggle persist style="position: fixed; top: 1rem; right: 1rem;"></nc-theme-toggle>

  <!-- Form example -->
  <form id="signup-form" style="max-width: 400px; margin: 2rem auto; display: flex; flex-direction: column; gap: 1rem;">
    <nc-input id="email" type="email" label="Email" required placeholder="you@example.com"></nc-input>
    <nc-input id="password" type="password" label="Password" required></nc-input>
    <nc-checkbox id="terms" label="I agree to the Terms of Service"></nc-checkbox>
    <nc-button id="submit-btn" variant="primary" full-width>Create Account</nc-button>
  </form>

  <!-- Toast container (position where you want toasts to appear) -->
  <nc-toast-container position="bottom-right"></nc-toast-container>

  <script type="module">
    // Components are already registered via the import above
    const form = document.getElementById('signup-form');
    const submitBtn = document.getElementById('submit-btn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Set loading state
      submitBtn.setAttribute('loading', '');

      try {
        const email = document.getElementById('email').getAttribute('value');
        await signup({ email });

        // Programmatic toast
        window.NovaCraftUI.toast({
          variant: 'success',
          message: 'Account created! Check your email.',
          duration: 5000,
        });
      } catch (err) {
        document.getElementById('email').setAttribute('error', err.message);
      } finally {
        submitBtn.removeAttribute('loading');
      }
    });

    // Listen to custom events
    document.getElementById('email').addEventListener('nc-input', (e) => {
      console.log('Email changed:', e.detail.value);
    });
  </script>
</body>
</html>
```

### Cherry-Pick Imports (Tree-Shaking)

Import only what you need — each component is individually importable:

```html
<script type="module">
  // Only imports ~2KB instead of the full ~30KB
  import 'https://unpkg.com/@novacraft/core/button';
  import 'https://unpkg.com/@novacraft/core/modal';
</script>
```

---

### 9.2 React

#### Installation

```bash
npm install @novacraft/core
# React wrapper (from this repo's src/wrappers/react)
# Once published: npm install @novacraft/react
```

#### Setup (main.tsx or app entry)

```tsx
// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import NovaCraft UI — registers all custom elements globally
import '@novacraft/core';
import '@novacraft/core/dist/css/tokens.css';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

#### Using Components Directly (No Wrapper Needed)

React 19+ has first-class Custom Element support:

```tsx
// React 19 — direct custom element usage
export function LoginForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* React 19: boolean attributes work correctly */}
      <nc-input
        type="email"
        label="Email"
        required
        placeholder="you@example.com"
        onNc-input={(e: CustomEvent) => console.log(e.detail.value)}
      />
      <nc-button variant="primary" type="submit">
        Login
      </nc-button>
    </form>
  );
}
```

#### Using the React Wrapper (React 18 and below)

For React 18, use the wrapper from `src/wrappers/react/index.tsx` which handles:
- Boolean attribute conversion (`disabled={true}` → `disabled=""`)
- Custom event → React callback mapping
- `forwardRef` support
- TypeScript prop types

```tsx
// Using the React wrapper
import { NcButton, NcInput, NcModal, NcToast } from '../wrappers/react';
// Once published: import { NcButton } from '@novacraft/react';

export function SignupPage() {
  const [email, setEmail] = React.useState('');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.createAccount({ email });
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ maxWidth: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <NcInput
          type="email"
          label="Email Address"
          value={email}
          onNcInput={(e: CustomEvent) => setEmail(e.detail.value)}
          required
        />

        <NcButton
          variant="primary"
          loading={loading}
          full-width
          onNcClick={handleSubmit}
        >
          Create Account
        </NcButton>
      </div>

      {/* Modal with open/close */}
      <NcModal
        open={modalOpen}
        onNcClose={() => setModalOpen(false)}
        size="md"
      >
        <span slot="header">Success! 🎉</span>
        <p>Your account has been created. Check your email to verify.</p>
        <NcButton slot="footer" variant="primary" onNcClick={() => setModalOpen(false)}>
          Got it
        </NcButton>
      </NcModal>
    </>
  );
}
```

#### Using forwardRef

```tsx
import { NcInput } from '../wrappers/react';

const MyForm = () => {
  const inputRef = React.useRef<HTMLElement>(null);

  // Access the underlying custom element
  const focusInput = () => {
    const el = inputRef.current;
    if (el) {
      const nativeInput = el.shadowRoot?.querySelector('input');
      nativeInput?.focus();
    }
  };

  return (
    <>
      <NcInput ref={inputRef} label="Focus me" />
      <button onClick={focusInput}>Focus</button>
    </>
  );
};
```

#### TypeScript Support

Custom elements need declaration merging for full type safety in JSX:

```typescript
// src/custom-elements.d.ts
import { NcButtonProps, NcInputProps, NcModalProps } from '@novacraft/core';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'nc-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'link';
        size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
        disabled?: boolean;
        loading?: boolean;
        'full-width'?: boolean;
        'icon-only'?: boolean;
      };
      'nc-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
        label?: string;
        placeholder?: string;
        value?: string;
        error?: string;
        hint?: string;
        required?: boolean;
        disabled?: boolean;
        name?: string;
      };
      // ... add more as needed
    }
  }
}
```

---

### 9.3 Angular

#### Installation

```bash
npm install @novacraft/core
# In tsconfig.json of your Angular project, add:
# "skipLibCheck": true
```

#### Module Setup

```typescript
// app.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

// Import NovaCraft Angular module from the wrapper
import { NovaCraftModule } from '../path/to/novacraft-ui/src/wrappers/angular/novacraft.module';
// Once published: import { NovaCraftModule } from '@novacraft/angular';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NovaCraftModule,  // ← Add this
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],  // ← Required for custom elements
  bootstrap: [AppComponent],
})
export class AppModule {}
```

#### Using in Templates

```html
<!-- app.component.html -->

<!-- Basic usage -->
<nc-button variant="primary" (nc-click)="handleClick()">
  Click Me
</nc-button>

<!-- With Angular property binding -->
<nc-button [attr.variant]="buttonVariant" [attr.disabled]="isDisabled || null">
  Dynamic Button
</nc-button>

<!-- Icon with dynamic name -->
<nc-icon [attr.name]="iconName" size="md"></nc-icon>

<!-- Alert with conditional display -->
<nc-alert *ngIf="hasError" variant="danger" [attr.dismissible]="true">
  <span slot="title">Error</span>
  {{ errorMessage }}
</nc-alert>
```

#### Template Forms (ngModel)

The `NcValueAccessorDirective` from the Angular wrapper enables `ngModel`:

```html
<!-- Template-driven form -->
<form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)">
  <nc-input
    type="email"
    label="Email"
    name="email"
    [(ngModel)]="formData.email"
    required
  ></nc-input>

  <nc-input
    type="password"
    label="Password"
    name="password"
    [(ngModel)]="formData.password"
    required
  ></nc-input>

  <nc-checkbox
    label="Remember me"
    name="rememberMe"
    [(ngModel)]="formData.rememberMe"
  ></nc-checkbox>

  <nc-button type="submit" variant="primary" [attr.disabled]="!loginForm.valid || null">
    Login
  </nc-button>
</form>
```

#### Reactive Forms

```typescript
// login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <nc-input
        formControlName="email"
        type="email"
        label="Email"
        [attr.error]="emailError"
      ></nc-input>

      <nc-input
        formControlName="password"
        type="password"
        label="Password"
      ></nc-input>

      <nc-toggle
        formControlName="rememberMe"
        label="Remember me"
      ></nc-toggle>

      <nc-button
        type="submit"
        variant="primary"
        full-width
        [attr.loading]="isLoading || null"
        [attr.disabled]="loginForm.invalid || null"
      >
        Sign In
      </nc-button>
    </form>
  `,
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false],
    });
  }

  get emailError(): string | null {
    const ctrl = this.loginForm.get('email');
    if (ctrl?.errors?.['required'] && ctrl.touched) return 'Email is required';
    if (ctrl?.errors?.['email'] && ctrl.touched) return 'Enter a valid email';
    return null;
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    try {
      await this.authService.login(this.loginForm.value);
    } finally {
      this.isLoading = false;
    }
  }
}
```

#### Event Binding

Custom events use lowercase kebab event binding:

```html
<!-- Listen to nc-change events -->
<nc-select
  [attr.options]="selectOptionsJson"
  (nc-change)="onSelectChange($event)"
></nc-select>

<!-- Modal open/close -->
<nc-modal
  [attr.open]="isModalOpen || null"
  (nc-close)="isModalOpen = false"
>
  <span slot="header">Confirmation</span>
  Are you sure?
</nc-modal>
```

```typescript
onSelectChange(event: CustomEvent) {
  console.log('Selected:', event.detail.value);
}
```

---

### 9.4 Vue 3

Vue 3 has built-in Custom Element support. Minimal configuration needed.

#### Installation

```bash
npm install @novacraft/core
```

#### Setup (main.ts)

```typescript
// main.ts
import { createApp } from 'vue';
import App from './App.vue';

// Register all NovaCraft components
import '@novacraft/core';
import '@novacraft/core/dist/css/tokens.css';

// Tell Vue to treat nc-* tags as custom elements (don't warn)
const app = createApp(App);
app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('nc-');
app.mount('#app');
```

#### Usage in Vue SFCs

```vue
<template>
  <div class="form-container">
    <!-- String attrs — bind with :attr or just write them static -->
    <nc-input
      type="email"
      label="Email"
      :value="email"
      :error="emailError"
      @nc-input="email = $event.detail.value"
      @nc-blur="validateEmail"
    />

    <!-- Boolean attrs — use :attr.bool or set via null trick -->
    <nc-button
      variant="primary"
      :disabled="!isValid || undefined"
      :loading="isSubmitting || undefined"
      full-width
      @nc-click="submit"
    >
      Submit
    </nc-button>

    <!-- Programmatic toast on action -->
    <nc-toast-container position="top-right" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { toast } from '@novacraft/core';

const email = ref('');
const isSubmitting = ref(false);
const emailError = ref<string | undefined>();

const isValid = computed(() => email.value.includes('@'));

function validateEmail() {
  emailError.value = isValid.value ? undefined : 'Enter a valid email';
}

async function submit() {
  isSubmitting.value = true;
  try {
    await api.submit({ email: email.value });
    toast({ variant: 'success', message: 'Submitted successfully!' });
  } catch (e) {
    toast({ variant: 'error', message: 'Something went wrong.' });
  } finally {
    isSubmitting.value = false;
  }
}
</script>
```

#### Boolean Attribute Pattern in Vue

```vue
<!-- ✅ Correct: undefined removes the attribute entirely -->
<nc-button :disabled="isDisabled || undefined">Button</nc-button>

<!-- ✅ Also correct: null removes the attribute -->
<nc-button :disabled="isDisabled ? '' : null">Button</nc-button>

<!-- ❌ Wrong: false is converted to the string "false" (still truthy attribute) -->
<nc-button :disabled="false">Button</nc-button>
```

---

### 9.5 Svelte 5

Svelte has excellent native Custom Element support:

#### Setup (app.html or layout)

```html
<!-- app.html -->
<link rel="stylesheet" href="%sveltekit.assets%/tokens.css">
```

```typescript
// src/lib/novacraft.ts
import '@novacraft/core';
export {};
```

#### Usage in Svelte Components

```svelte
<script lang="ts">
  import '../lib/novacraft';
  import { toast } from '@novacraft/core';

  let email = $state('');
  let loading = $state(false);
  let error = $state('');

  async function handleSubmit() {
    loading = true;
    error = '';
    try {
      await api.submit({ email });
      toast({ variant: 'success', message: 'Done!' });
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }
</script>

<!-- Svelte handles custom elements natively -->
<nc-input
  type="email"
  label="Email"
  value={email}
  error={error}
  on:nc-input={(e) => email = e.detail.value}
/>

<!-- Boolean attributes work correctly in Svelte -->
<nc-button
  variant="primary"
  loading={loading || undefined}
  on:nc-click={handleSubmit}
>
  Submit
</nc-button>

<nc-toast-container position="bottom-right" />
```

---

### 9.6 Next.js (SSR)

Custom Elements require a browser environment. Next.js needs special handling for SSR.

#### Installation

```bash
npm install @novacraft/core
```

#### Setup — Provider Component (Critical for SSR)

```tsx
// components/NovaCraftProvider.tsx
'use client'; // Mark as client component

import { useEffect } from 'react';

export function NovaCraftProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register custom elements only on the client (browser)
    // Server-side rendering skips this entirely
    import('@novacraft/core').catch(console.error);
  }, []);

  return <>{children}</>;
}
```

```tsx
// app/layout.tsx
import { NovaCraftProvider } from '@/components/NovaCraftProvider';
import '@novacraft/core/dist/css/tokens.css'; // CSS is server-safe

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NovaCraftProvider>
          {children}
        </NovaCraftProvider>
      </body>
    </html>
  );
}
```

#### Using in Page Components

```tsx
// app/contact/page.tsx
'use client'; // Components using nc-* must be client components

export default function ContactPage() {
  const [name, setName] = React.useState('');

  return (
    <main>
      {/* nc-* tags render as unknown HTML on server, hydrate on client */}
      <nc-input
        label="Your Name"
        value={name}
        onNc-input={(e: CustomEvent) => setName(e.detail.value)}
      />
      <nc-button variant="primary">Send Message</nc-button>
    </main>
  );
}
```

#### Hydration Warning Prevention

Next.js may warn about unknown HTML attributes. Suppress with:

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Opt-in to React 19 Custom Element support
    reactCompiler: true,
  },
};

export default nextConfig;
```

#### Using with Server Components (Pattern)

```tsx
// app/dashboard/page.tsx (Server Component — no 'use client')
export default async function DashboardPage() {
  // Fetch data on server
  const data = await fetchDashboardData();

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Pass data to a client component that uses NovaCraft */}
      <DashboardClient data={data} />
    </div>
  );
}

// app/dashboard/DashboardClient.tsx
'use client';
import '@novacraft/core'; // Safe — only runs on client

export function DashboardClient({ data }) {
  return (
    <nc-table
      columns={JSON.stringify(data.columns)}
      data={JSON.stringify(data.rows)}
      striped
      hoverable
      sortable
    />
  );
}
```

---

### 9.7 Nuxt 3

#### Setup — Plugin

```typescript
// plugins/novacraft.client.ts  (`.client.ts` = runs only in browser)
import '@novacraft/core';

export default defineNuxtPlugin(() => {
  // Custom elements are now registered globally
});
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['@novacraft/core/dist/css/tokens.css'],
  plugins: ['~/plugins/novacraft.client.ts'],
  vue: {
    compilerOptions: {
      // Tell Vue compiler to treat nc-* as custom elements
      isCustomElement: (tag: string) => tag.startsWith('nc-'),
    },
  },
});
```

#### Usage in Pages and Components

```vue
<!-- pages/index.vue -->
<template>
  <div>
    <ClientOnly>
      <!-- Wrap in ClientOnly for SSR safety -->
      <nc-input label="Search" @nc-input="handleSearch" />
      <nc-button @nc-click="submit">Go</nc-button>
    </ClientOnly>
  </div>
</template>
```

---

## 10. Theming & Customization

### Method 1: Override CSS Custom Properties (Recommended)

The simplest way to theme — changes propagate to all components:

```css
/* In your global CSS (outside any Shadow DOM) */
:root {
  /* Change the primary brand color */
  --nc-color-primary-500: #8b5cf6;   /* Purple */
  --nc-color-primary-600: #7c3aed;
  --nc-color-primary-700: #6d28d9;

  /* Change border radius globally */
  --nc-radius-md: 0;       /* Square corners */
  --nc-radius-lg: 0;
  --nc-radius-xl: 0;
  --nc-radius-full: 0;

  /* Custom font */
  --nc-font-family-sans: 'Inter', system-ui, sans-serif;

  /* Custom focus ring color */
  --nc-focus-ring: 0 0 0 3px rgba(139, 92, 246, 0.4);
  --nc-focus-ring-offset: 0 0 0 2px #fff, 0 0 0 4px rgba(139, 92, 246, 0.4);
}
```

### Method 2: CSS Parts (Component-Level)

Target specific parts of a component using `::part()`:

```css
/* Make all buttons uppercase */
nc-button::part(base) {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Style the label text specifically */
nc-button::part(label) {
  font-weight: 800;
}

/* Style modal panels */
nc-modal::part(panel) {
  border-radius: 0;        /* Square modals */
  max-width: 600px;
}

/* Style input wrapper */
nc-input::part(base) {
  border-width: 2px;
}

/* Error state styling */
nc-input[error]::part(input) {
  background: #fef2f2;
}
```

### Method 3: Scoped Theme Per Component Instance

```html
<!-- Special "hero" button with custom styling -->
<nc-button class="hero-btn" variant="primary">Get Started</nc-button>

<style>
  .hero-btn {
    --nc-color-primary-600: #dc2626;  /* Red brand color for this button */
    --nc-color-primary-700: #b91c1c;
    --nc-radius-md: 9999px;           /* Pill shape */
    font-size: 1.25rem;
  }
</style>
```

### Custom Themes

Create a complete brand theme by overriding all primary color tokens:

```css
/* themes/brand-green.css */
[data-theme="brand"] {
  --nc-color-primary-50:  #f0fdf4;
  --nc-color-primary-100: #dcfce7;
  --nc-color-primary-200: #bbf7d0;
  --nc-color-primary-300: #86efac;
  --nc-color-primary-400: #4ade80;
  --nc-color-primary-500: #22c55e;
  --nc-color-primary-600: #16a34a;
  --nc-color-primary-700: #15803d;
  --nc-color-primary-800: #166534;
  --nc-color-primary-900: #14532d;
  --nc-color-primary-950: #052e16;

  --nc-focus-ring: 0 0 0 3px rgba(34, 197, 94, 0.4);
  --nc-focus-ring-offset: 0 0 0 2px #fff, 0 0 0 4px rgba(34, 197, 94, 0.4);
}
```

```html
<html data-theme="brand">
  <!-- All components now use green brand color -->
</html>
```

---

## 11. Building Custom Components

You can extend `NcBaseElement` to build your own components that integrate seamlessly with NovaCraft UI:

```typescript
// my-components/nc-rating-card.ts
import { NcBaseElement } from '@novacraft/core/core/base-element';
import { defineElement } from '@novacraft/core/utils/helpers';

export class NcRatingCard extends NcBaseElement {
  static observedAttributes = ['title', 'rating', 'reviewer', 'variant'];

  static styles = `
    :host {
      display: block;
    }

    .card {
      padding: var(--nc-spacing-4);
      border-radius: var(--nc-radius-xl);
      border: 1px solid var(--nc-color-neutral-200);
      background: var(--nc-color-neutral-50);
      font-family: var(--nc-font-family-sans);
    }

    .reviewer {
      display: flex;
      align-items: center;
      gap: var(--nc-spacing-3);
      margin-bottom: var(--nc-spacing-3);
    }

    .name {
      font-weight: var(--nc-font-weight-semibold);
      color: var(--nc-color-neutral-900);
    }

    .body {
      color: var(--nc-color-neutral-700);
      line-height: var(--nc-line-height-normal);
    }
  `;

  protected render(): string {
    const title = this.getStrAttr('title');
    const rating = this.getNumAttr('rating', 5);
    const reviewer = this.getStrAttr('reviewer', 'Anonymous');

    return `
      <div class="card" part="base">
        <div class="reviewer">
          <nc-avatar initials="${reviewer.charAt(0)}" size="sm"></nc-avatar>
          <div>
            <div class="name">${reviewer}</div>
            <nc-star-rating value="${rating}" readonly size="sm"></nc-star-rating>
          </div>
        </div>
        <h3>${title}</h3>
        <div class="body">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

defineElement('nc-rating-card', NcRatingCard);
```

Usage:
```html
<nc-rating-card title="Great product!" rating="4.5" reviewer="Jane Doe">
  This component library has saved us weeks of development time.
</nc-rating-card>
```

---

## 12. Icon Registry

The icon system supports 60+ built-in icons and custom registration:

### Using Built-In Icons

```html
<!-- Basic usage -->
<nc-icon name="search"></nc-icon>

<!-- With size -->
<nc-icon name="settings" size="lg"></nc-icon>

<!-- With color -->
<nc-icon name="heart-filled" color="#ef4444"></nc-icon>

<!-- With aria-label -->
<nc-icon name="github" label="GitHub repository"></nc-icon>
```

### Available Size Values

| Value | Pixels |
|-------|--------|
| `xs` | 12px |
| `sm` | 16px |
| `md` | 24px (default) |
| `lg` | 32px |
| `xl` | 48px |
| `64` | Custom pixel size |

### Registering Custom Icons

```typescript
import { NcIcon } from '@novacraft/core';

// Register a custom icon with an SVG string
NcIcon.registerIcon(
  'my-brand',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>`
);

// Use it anywhere in your app
// <nc-icon name="my-brand"></nc-icon>
```

### Available Built-In Icons

```
Navigation:  arrow-up, arrow-down, arrow-left, arrow-right
             chevron-up, chevron-down, chevron-left, chevron-right
             menu, home, grid, list, external-link

Actions:     close, check, plus, minus, edit, trash, copy
             download, upload, refresh, filter, sort, search
             settings, link, bookmark, eye, eye-off

Status:      alert-circle, info, warning, success
             loading, bell, lock, unlock, log-out

Media:       image, file, folder, code, maximize, minimize

Social:      github, linkedin, twitter, mail, user

UI:          sun, moon, star, star-filled, heart, heart-filled
             calendar, clock, more-horizontal, more-vertical
```

---

## 13. Accessibility Guide

Every NovaCraft UI component is built with WCAG 2.1 AA compliance as a first-class requirement.

### Keyboard Navigation Map

| Component | Keys |
|-----------|------|
| `nc-button` | Enter, Space to activate |
| `nc-checkbox` | Space to toggle |
| `nc-radio-group` | Arrow keys to cycle, Space to select |
| `nc-toggle` | Space, Enter to toggle |
| `nc-select` | Arrow keys to navigate, Enter to select, Escape to close, Type-ahead |
| `nc-modal` | Tab/Shift+Tab (trapped), Escape to close |
| `nc-drawer` | Tab/Shift+Tab (trapped), Escape to close |
| `nc-tabs` | Left/Right arrows to navigate tabs |
| `nc-accordion-item` | Enter, Space to toggle |
| `nc-dropdown-menu` | Arrow keys to navigate, Enter to select, Escape to close |
| `nc-star-rating` | Left/Right arrows to change, Home, End |
| `nc-tooltip` | Shown on focus, dismissed on Escape or blur |
| `nc-pagination` | Tab to navigate buttons, Enter to activate |

### ARIA Roles Reference

| Component | Role |
|-----------|------|
| `nc-button` | `button` (via native `<button>`) |
| `nc-checkbox` | `checkbox` |
| `nc-radio` | `radio` |
| `nc-radio-group` | `radiogroup` |
| `nc-toggle` | `switch` |
| `nc-select` | `combobox` (trigger), `listbox` (list), `option` (items) |
| `nc-modal` | `dialog` with `aria-modal="true"` |
| `nc-drawer` | `dialog` with `aria-modal="true"` |
| `nc-tabs` | `tablist` / `tab` / `tabpanel` |
| `nc-dropdown-menu` | `menu` / `menuitem` |
| `nc-tooltip` | `tooltip` |
| `nc-alert` | `alert` |
| `nc-spinner` | `status` |
| `nc-progress-bar` | `progressbar` |
| `nc-star-rating` | `slider` |
| `nc-icon` | `img` (with `aria-label`) |

### Accessibility Checklist

Before shipping a new component, verify:

- [ ] Keyboard operable without mouse
- [ ] Focus visible at all times (use `--nc-focus-ring`)
- [ ] No keyboard traps (except intentional Modal/Drawer)
- [ ] ARIA role set correctly
- [ ] ARIA state (`aria-checked`, `aria-expanded`, `aria-selected`) updated
- [ ] `aria-label` or `aria-labelledby` on all interactive elements without visible text
- [ ] Error messages linked with `aria-describedby`
- [ ] `axe-core` passes with zero violations

### Running the axe-core Audit

```bash
# In Storybook — open Accessibility tab (runs automatically)
npm run storybook

# Programmatic audit in tests
npm install --save-dev axe-core

# In your test:
import { checkA11y } from 'axe-core';

it('has no accessibility violations', async () => {
  const el = document.createElement('nc-button');
  el.textContent = 'Click me';
  document.body.appendChild(el);

  const results = await axe.run(el);
  expect(results.violations).toHaveLength(0);
  el.remove();
});
```

---

## 14. Contributing Guide

### Development Workflow

```
main (stable)
  └── feature/nc-data-grid        ← Feature branches
  └── fix/button-focus-regression ← Bug fix branches
  └── docs/storybook-stories      ← Documentation branches
```

1. **Create a feature branch** from `main`
2. **Implement** following the component pattern (see §4)
3. **Write stories** (see §6)
4. **Write tests** (see §8) — must hit 90% coverage
5. **Run checks** before opening a PR:
   ```bash
   npm run typecheck  # Must pass with zero errors
   npm run test       # Must pass all tests
   npm run build      # Must build without errors
   ```
6. **Open a PR** — CI runs automatically

### Adding a New Component Checklist

- [ ] `src/components/<name>/<name>.ts` — Component implementation
- [ ] Static `observedAttributes` array
- [ ] Static `styles` string using `--nc-*` tokens only
- [ ] `protected render(): string` returns valid HTML
- [ ] `protected afterRender()` attaches DOM listeners
- [ ] `protected _cleanup()` removes DOM listeners
- [ ] Custom events use `nc-` prefix (e.g., `nc-change`)
- [ ] `defineElement('nc-<name>', Nc<Name>)` at bottom of file
- [ ] Export the class
- [ ] Added to `src/index.ts` barrel
- [ ] `src/components/<name>/<name>.test.ts` — Tests written
- [ ] `src/components/<name>/<name>.stories.ts` — Stories written
- [ ] CSS Parts documented in story `argTypes`
- [ ] Accessibility verified (keyboard + axe-core)

### Code Style

```typescript
// ✅ Use CSS custom properties — never hardcode colors/sizes
background: var(--nc-color-primary-600);

// ✅ Arrow functions for event handlers — stable reference
private _handleClick = () => { ... };

// ✅ Always remove listeners in _cleanup
protected _cleanup() {
  this._btn?.removeEventListener('click', this._handleClick);
}

// ✅ Emit with nc- prefix
this.emit('nc-change', { value: this._value });

// ✅ Use helper methods
const isDisabled = this.getBoolAttr('disabled');
const variant = this.getStrAttr('variant', 'primary');

// ❌ Never access this.shadow in render() — return HTML string only
protected render(): string {
  // this.shadow.querySelector(...)  ← DON'T
  return `<button class="btn">...</button>`; // ← DO
}
```

---

## 15. Troubleshooting

### "Custom element 'nc-button' is not defined"

**Cause:** The component script wasn't imported before the HTML was parsed.

**Fix:**
```javascript
// Ensure import happens before any rendering
import '@novacraft/core'; // registers all elements

// Or cherry-pick
import '@novacraft/core/button';
```

### TypeScript error: "Property 'nc-button' does not exist on JSX.IntrinsicElements"

**Cause:** TypeScript doesn't know about custom element HTML tags in JSX.

**Fix:** Add type declarations (see §9.2 TypeScript Support).

### Boolean attribute stays "true" string in React 18

**Cause:** React 18 passes boolean `false` as the string `"false"`.

**Fix:** Use the React wrapper from `src/wrappers/react/index.tsx` — it handles this automatically. Or use `undefined` for false:
```tsx
<nc-button disabled={isDisabled || undefined}>...</nc-button>
```

### Angular "Can't bind to 'formControlName' since it isn't a known property"

**Cause:** `CUSTOM_ELEMENTS_SCHEMA` alone doesn't register Angular directives.

**Fix:** Import `NovaCraftModule` AND `ReactiveFormsModule` in your `AppModule`.

### Styles not applying in Shadow DOM

**Cause:** You're using regular CSS classes or attribute selectors that don't penetrate Shadow DOM.

**Fix:** Use CSS custom properties (they do penetrate):
```css
/* ✅ Works — custom properties penetrate Shadow DOM */
:root { --nc-color-primary-500: #8b5cf6; }

/* ❌ Doesn't work — class selectors don't penetrate */
.nc-button { background: purple; }

/* ✅ Works — CSS Parts escape hatch */
nc-button::part(base) { background: purple; }
```

### Component not re-rendering after attribute change

**Cause:** The attribute is not in `static observedAttributes`.

**Fix:**
```typescript
// Ensure the attribute name is in the array
static observedAttributes = ['variant', 'size', 'disabled', 'my-new-attr'];
```

### Memory leak — event listener added multiple times

**Cause:** `afterRender()` is called on every re-render. If listeners aren't removed in `_cleanup()`, they stack up.

**Fix:**
```typescript
// ✅ Arrow function — same reference across calls
private _handleClick = () => { ... };

protected afterRender() {
  // Calling removeEventListener before add is safe (no-op if not present)
  this._btn?.removeEventListener('click', this._handleClick);
  this._btn?.addEventListener('click', this._handleClick);
}

protected _cleanup() {
  this._btn?.removeEventListener('click', this._handleClick);
}
```

### Toast not appearing

**Cause:** `<nc-toast-container>` is missing from the DOM.

**Fix:**
```html
<!-- Add once, anywhere in your body -->
<nc-toast-container position="top-right"></nc-toast-container>

<script type="module">
  import { toast } from '@novacraft/core';
  toast({ message: 'Hello!', variant: 'success' });
</script>
```

### Storybook shows blank component

**Cause:** The component's import path is wrong or the custom element isn't registered before Storybook renders the story.

**Fix:**
```typescript
// stories file — import the component DIRECTLY (not from src/index.ts)
import './button'; // ← Direct import ensures registration before render
```

---

*This guide is maintained alongside the NovaCraft UI source code. If something is wrong or missing, open an issue or PR.*
