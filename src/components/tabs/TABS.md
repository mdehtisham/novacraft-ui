# `<nc-tabs>` — Component Documentation

## Overview

Tabbed navigation with three visual variants. Implements the WAI-ARIA Tabs
pattern with roving-tabindex keyboard navigation.

| Element          | Role                                         |
| ---------------- | -------------------------------------------- |
| `<nc-tabs>`      | Container — manages state and coordination   |
| `<nc-tab>`       | Clickable tab trigger                        |
| `<nc-tab-panel>` | Content panel for one tab                    |

---

## Architecture Decisions

1. **Three-element composition** — `nc-tabs` manages state, `nc-tab` is the
   clickable trigger, `nc-tab-panel` is the content. Connected via matching
   `value` attributes.
2. **Roving tabindex** — Only the active tab is tabbable (`tabindex="0"`);
   others are `tabindex="-1"`. Arrow Left / Right moves focus and activates.
3. **Automatic activation** — Moving focus with arrow keys immediately
   activates that tab (no Enter needed), per the WAI-ARIA recommendation.
4. **Lazy rendering** — `nc-tab-panel` with the `lazy` attribute only renders
   its slot when active, reducing initial DOM for many panels.
5. **Panel association** — `nc-tab value="x"` matches `nc-tab-panel value="x"`.
   No index-based matching — explicit and resilient to reordering.

---

## Data Flow

### Data In — `<nc-tabs>`

| Attribute | Type     | Default  | Description                          |
| --------- | -------- | -------- | ------------------------------------ |
| `value`   | `string` | —        | Active tab value                     |
| `variant` | `string` | `"line"` | Visual style: `line|enclosed|pills`  |

### Data In — `<nc-tab>`

| Attribute  | Type      | Default | Description              |
| ---------- | --------- | ------- | ------------------------ |
| `value`    | `string`  | —       | **Required.** Tab key    |
| `disabled` | `boolean` | `false` | Disables the tab trigger |

### Data In — `<nc-tab-panel>`

| Attribute | Type      | Default | Description                        |
| --------- | --------- | ------- | ---------------------------------- |
| `value`   | `string`  | —       | **Required.** Matches a tab value  |
| `lazy`    | `boolean` | `false` | Defer rendering until active       |

### Data Out

| Event            | Emitted on   | Detail            | Description                    |
| ---------------- | ------------ | ----------------- | ------------------------------ |
| `nc-tab-change`  | `<nc-tabs>`  | `{ value: string }` | Fires when active tab changes |

### Slots

| Component        | Slot        | Description                          |
| ---------------- | ----------- | ------------------------------------ |
| `<nc-tabs>`      | *(default)* | `nc-tab` and `nc-tab-panel` children |
| `<nc-tab>`       | *(default)* | Tab label content                    |
| `<nc-tab-panel>` | *(default)* | Panel content                        |

---

## Extending Styles

### CSS Custom Properties

| Property                  | Description                  |
| ------------------------- | ---------------------------- |
| `--nc-tab-active-color`   | Active tab indicator color   |
| `--nc-tab-hover-color`    | Hover state color            |
| `--nc-tab-border-color`   | Border / divider color       |
| `--nc-tab-padding`        | Tab button padding           |
| `--nc-tab-gap`            | Gap between tabs             |

### Shadow Parts

| Part            | Component        | Description       |
| --------------- | ---------------- | ----------------- |
| `::part(tablist)` | `<nc-tabs>`    | The tab list row  |
| `::part(tab)`     | `<nc-tab>`     | Individual tab    |
| `::part(panel)`   | `<nc-tab-panel>` | Content panel   |

---

## Accessibility

- `<nc-tabs>` container → `role="tablist"`
- `<nc-tab>` → `role="tab"`, `aria-selected`, `aria-controls` → panel ID
- `<nc-tab-panel>` → `role="tabpanel"`, `aria-labelledby` → tab ID
- **Arrow Left / Right** — navigate between tabs
- **Home / End** — jump to first / last tab

---

## Usage Examples

### Basic

```html
<nc-tabs value="one">
  <nc-tab value="one">Tab 1</nc-tab>
  <nc-tab value="two">Tab 2</nc-tab>
  <nc-tab value="three" disabled>Tab 3</nc-tab>

  <nc-tab-panel value="one">Content for tab 1</nc-tab-panel>
  <nc-tab-panel value="two">Content for tab 2</nc-tab-panel>
  <nc-tab-panel value="three">Content for tab 3</nc-tab-panel>
</nc-tabs>
```

### Pills variant with lazy panels

```html
<nc-tabs variant="pills" value="info">
  <nc-tab value="info">Info</nc-tab>
  <nc-tab value="specs">Specs</nc-tab>
  <nc-tab value="reviews">Reviews</nc-tab>

  <nc-tab-panel value="info">Product information</nc-tab-panel>
  <nc-tab-panel value="specs" lazy>Specifications loaded on demand</nc-tab-panel>
  <nc-tab-panel value="reviews" lazy>Reviews loaded on demand</nc-tab-panel>
</nc-tabs>
```

### Listening for tab changes

```html
<nc-tabs id="myTabs" value="general">
  <!-- tabs and panels -->
</nc-tabs>

<script>
  document.getElementById('myTabs')
    .addEventListener('nc-tab-change', (e) => {
      console.log('Active tab:', e.detail.value);
    });
</script>
```

---

## Consumer Projects

| Project       | Usage                                      |
| ------------- | ------------------------------------------ |
| **TaskFlow**  | Settings tabs                              |
| **ShopWave**  | Product info tabs, admin sections          |
| **InkFlow**   | Editor / preview tabs, dashboard sections  |
