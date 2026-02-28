# `<nc-search-input>` — Component Documentation

## Overview

Specialized input with built-in search icon, debounced search event, clear button, and loading state. Extends `nc-input`'s visual pattern but adds search-specific UX: debounce prevents excessive API calls, clear button resets with one click.

## Architecture Decisions

- **Built-in debounce:** `setTimeout`-based, resets on each keystroke. Default 300 ms. Prevents firing search on every character.
- **`nc-search` event** only fires after debounce completes — consumers never handle raw keystrokes.
- **Clear button (×):** appears when value is non-empty. Clicking it clears the value AND fires `nc-clear` (distinct from `nc-search`).
- **Loading spinner:** replaces the clear-button position when `loading=true`. Tells the user a search is in progress.
- **Search icon:** built-in as a prefix, not a slot — it is always a magnifying glass. This is opinionated by design.
- **Does NOT handle search results display** — that is the consumer's responsibility (dropdown, page, etc.).

## Data Flow

### Data In (Properties / Attributes)

| Property      | Type    | Default      | Description                        |
| ------------- | ------- | ------------ | ---------------------------------- |
| `value`       | string  | `""`         | Current input value                |
| `placeholder` | string  | `"Search…"`  | Placeholder text                   |
| `debounce`    | number  | `300`        | Debounce delay in milliseconds     |
| `loading`     | boolean | `false`      | Show loading spinner               |
| `disabled`    | boolean | `false`      | Disable the input                  |
| `size`        | string  | `"md"`       | Input size — `sm` \| `md` \| `lg` |

### Data Out (Events)

| Event      | Detail             | Description                                        |
| ---------- | ------------------ | -------------------------------------------------- |
| `nc-search`| `{ value: string }`| Fires after the debounce period elapses            |
| `nc-clear` | `{}`               | Fires when the clear button is clicked             |
| `nc-input` | `{ value: string }`| Fires on every keystroke (raw, **not** debounced)  |

### Slots

| Name     | Description                                          |
| -------- | ---------------------------------------------------- |
| `suffix` | Override the clear / loading area (advanced use)     |

## Internal Rendering

```
Shadow DOM
└─ div.field          part="field"
   └─ div.wrapper
      ├─ nc-icon[search]   part="search-icon"
      ├─ input             part="input"
      └─ button.clear      part="clear"      ← or nc-spinner part="spinner" when loading
```

## Extending Styles

Inherits the same `--nc-input-*` custom properties, plus:

| Token                     | Description        |
| ------------------------- | ------------------ |
| `--nc-search-icon-color`  | Search icon color  |

Exposed CSS parts: `::part(field | input | search-icon | clear | spinner)`

## Accessibility

- `<input type="search">` — enables native clear behavior in some browsers.
- `aria-label="Search"` by default (override via the `label` attribute).
- Clear button: `aria-label="Clear search"`.
- Loading spinner: `aria-label="Searching"`.
- **Escape** key clears the input and fires `nc-clear`.

## Usage Examples

### Basic

```html
<nc-search-input placeholder="Search items…"></nc-search-input>
```

### Custom Debounce

```html
<nc-search-input debounce="500"></nc-search-input>
```

```js
document.querySelector('nc-search-input')
  .addEventListener('nc-search', (e) => {
    console.log('Search for:', e.detail.value);
  });
```

### Loading State

```html
<nc-search-input loading></nc-search-input>
```

```js
const search = document.querySelector('nc-search-input');
search.addEventListener('nc-search', async (e) => {
  search.loading = true;
  await fetchResults(e.detail.value);
  search.loading = false;
});
```

### React

```tsx
function SearchBar() {
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: CustomEvent<{ value: string }>) => {
    setLoading(true);
    await fetchResults(e.detail.value);
    setLoading(false);
  };

  return (
    <nc-search-input
      loading={loading}
      onNcSearch={handleSearch}
      onNcClear={() => clearResults()}
    />
  );
}
```

### Angular

```html
<nc-search-input
  [loading]="isSearching"
  (nc-search)="onSearch($event)"
  (nc-clear)="onClear()">
</nc-search-input>
```

## Consumer Projects

| Project      | Usage                                     |
| ------------ | ----------------------------------------- |
| **TaskFlow** | Global search (Cmd+K), task filter search |
| **ShopWave** | Product search header, admin search       |
| **InkFlow**  | Article search header, full-text search   |
