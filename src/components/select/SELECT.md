# `<nc-select>` — Component Documentation

## Overview

Custom dropdown select with single/multi-select modes and searchable filtering.
Renders a fully custom listbox (not native `<select>`) for consistent cross-browser
styling and multi-select support.

## Architecture Decisions

- **Custom listbox over native `<select>`:** consistent styling across browsers,
  multi-select with chips, searchable.
- **`<nc-option>` as child element:** each option is a Custom Element with
  `value`/`label`/`disabled` attributes. Discovered via `querySelectorAll` on
  light DOM children.
- **Searchable mode:** filters visible `<nc-option>` elements by label text. Pure
  string matching, no fuzzy search (keep it simple).
- **Multi-select:** selected items shown as removable badges (uses `<nc-badge>`
  internally).
- **Click-outside to close:** uses a one-time `document` click listener added on
  open, removed on close.
- **Keyboard:** Arrow Up/Down to navigate, Enter to select, Escape to close,
  type-ahead by character.

## Data Flow

### Data In — `<nc-select>`

| Attribute     | Type    | Default       | Description                                          |
|---------------|---------|---------------|------------------------------------------------------|
| `label`       | string  | —             | Visible label text                                   |
| `placeholder` | string  | `"Select..."` | Placeholder shown when nothing is selected           |
| `value`       | string  | —             | Selected value(s), comma-separated for multi         |
| `multiple`    | boolean | `false`       | Enable multi-select mode                             |
| `searchable`  | boolean | `false`       | Show a search/filter input inside the dropdown       |
| `error`       | string  | —             | Error message text                                   |
| `disabled`    | boolean | `false`       | Disable the entire select                            |
| `name`        | string  | —             | Form field name                                      |
| `open`        | boolean | `false`       | Programmatically open/close the dropdown             |

### Data In — `<nc-option>`

| Attribute  | Type    | Default | Description                                      |
|------------|---------|---------|--------------------------------------------------|
| `value`    | string  | —       | **Required.** Option value                       |
| `label`    | string  | —       | Display text (falls back to `textContent`)       |
| `disabled` | boolean | `false` | Disable this option                              |

### Data Out (Events)

| Event      | Detail                          | Description                          |
|------------|---------------------------------|--------------------------------------|
| `nc-change`| `{ value: string \| string[] }` | Fires when selection changes         |
| `nc-search`| `{ query: string }`            | Fires when search input changes      |
| `nc-open`  | —                               | Fires when the dropdown opens        |
| `nc-close` | —                               | Fires when the dropdown closes       |

### Slots

| Component     | Slot        | Description                              |
|---------------|-------------|------------------------------------------|
| `<nc-select>` | (default)   | `<nc-option>` children                   |
| `<nc-option>` | (default)   | Custom content for the option            |

## Internal Rendering

```
Shadow DOM:
div.select
├── button.trigger  part="trigger"   ← shows selected value or placeholder
└── div.dropdown    part="dropdown"  [role="listbox"]
    ├── input.search  part="search"  ← only when searchable
    └── <slot>                       ← nc-option elements projected
```

## Extending Styles

### CSS Custom Properties

| Property                    | Default  | Description                       |
|-----------------------------|----------|-----------------------------------|
| `--nc-select-max-height`    | `240px`  | Dropdown max height               |
| `--nc-select-option-height` | —        | Individual option height           |
| `--nc-input-border-color`   | —        | Border color (shared with inputs)  |
| `--nc-input-focus-color`    | —        | Focus ring color                   |
| `--nc-input-error-color`    | —        | Error state color                  |

### Shadow Parts

`::part(trigger)` · `::part(dropdown)` · `::part(search)` · `::part(option)`

## Accessibility

- **Trigger:** `role="combobox"`, `aria-expanded`, `aria-haspopup="listbox"`
- **Dropdown:** `role="listbox"`, `aria-multiselectable` (multi mode)
- **Options:** `role="option"`, `aria-selected`, `aria-disabled`
- `aria-activedescendant` on trigger tracks the focused option
- **Keyboard:** Arrow keys, Enter, Escape, Home, End, type-ahead

## Usage Examples

### Single Select

```html
<nc-select label="Priority" placeholder="Choose priority">
  <nc-option value="low">Low</nc-option>
  <nc-option value="medium">Medium</nc-option>
  <nc-option value="high">High</nc-option>
</nc-select>
```

### Multi-Select

```html
<nc-select label="Assignees" multiple>
  <nc-option value="alice">Alice</nc-option>
  <nc-option value="bob">Bob</nc-option>
  <nc-option value="carol">Carol</nc-option>
</nc-select>
```

### Searchable

```html
<nc-select label="Country" searchable placeholder="Search countries...">
  <nc-option value="us">United States</nc-option>
  <nc-option value="ca">Canada</nc-option>
  <nc-option value="mx">Mexico</nc-option>
</nc-select>
```

### With Error

```html
<nc-select label="Status" error="Selection is required">
  <nc-option value="active">Active</nc-option>
  <nc-option value="inactive">Inactive</nc-option>
</nc-select>
```

### React

```jsx
<NcSelect label="Size" value={size} onNcChange={(e) => setSize(e.detail.value)}>
  <NcOption value="sm">Small</NcOption>
  <NcOption value="md">Medium</NcOption>
  <NcOption value="lg">Large</NcOption>
</NcSelect>
```

### Angular Reactive Form

```html
<nc-select label="Role" formControlName="role">
  <nc-option value="admin">Admin</nc-option>
  <nc-option value="editor">Editor</nc-option>
  <nc-option value="viewer">Viewer</nc-option>
</nc-select>
```

## Consumer Projects

### TaskFlow
Assignee picker · Priority selector · Label picker · Column selector

### ShopWave
Variant selectors (size/color) · Shipping method · Category filter · Admin status filter

### InkFlow
Language selector (translate) · Visibility selector · Tag selector
