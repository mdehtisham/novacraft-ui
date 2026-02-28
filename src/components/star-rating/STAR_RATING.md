# `<nc-star-rating>` — Component Documentation

## Overview

Interactive or read-only star rating display. Supports whole and half stars,
hover preview, and keyboard input. Used for product reviews and aggregate
ratings.

## Architecture Decisions

- **SVG stars (not Unicode/emoji):** Crisp at all sizes, customizable fill
  color, supports half-fill via clip-path or gradient.
- **Half-star support:** Each star has two clickable halves. In half mode,
  clicking the left half sets the value to _X_.5; clicking the right half sets
  it to _X_.0. The visual fill uses a `linear-gradient` stop at 50 %.
- **Hover preview:** On hover, stars fill up to the hovered position
  (transient). Reverts on `mouseleave`. Active only in interactive mode.
- **Readonly mode:** No hover preview, no click events, no focus. Pure display.
- **Keyboard navigation:** Left / Right arrows change the value by 1 (or 0.5
  in half mode). Home = 0, End = max.

## Data Flow

### Data In (Properties / Attributes)

| Property   | Type      | Default | Description                    |
| ---------- | --------- | ------- | ------------------------------ |
| `value`    | `number`  | `0`     | Current rating                 |
| `max`      | `number`  | `5`     | Total number of stars          |
| `readonly` | `boolean` | `false` | Disables interaction           |
| `size`     | `string`  | `"md"`  | Star size — `sm` / `md` / `lg`|
| `half`     | `boolean` | `false` | Allow half-star increments     |

### Data Out (Events)

| Event       | Fires When                          | Detail            |
| ----------- | ----------------------------------- | ----------------- |
| `nc-change` | User clicks a star (interactive)    | `{ value: number }`|
| `nc-hover`  | User hovers over a star (interactive)| `{ value: number }`|

### Slots

None.

## Internal Rendering

Shadow DOM structure:

```
div.rating[role="slider"] part="base"
  └─ button.star part="star" × max
       └─ <svg> (fill / empty / half states)
```

Each star SVG toggles between filled, empty, and half-filled states based on
the current `value` and `max`.

## Extending Styles

### CSS Custom Properties

| Custom Property              | Description                     |
| ---------------------------- | ------------------------------- |
| `--nc-star-color-filled`     | Fill color for active stars     |
| `--nc-star-color-empty`      | Fill color for inactive stars   |
| `--nc-star-color-hover`      | Fill color on hover             |
| `--nc-star-size`             | Width and height of each star   |
| `--nc-star-gap`              | Gap between stars               |

### CSS Parts

| Part           | Target                        |
| -------------- | ----------------------------- |
| `base`         | Outer rating container        |
| `star`         | Individual star button        |
| `star-filled`  | Star in the filled state      |
| `star-empty`   | Star in the empty state       |

### Example — Custom Theme

```css
nc-star-rating {
  --nc-star-color-filled: gold;
  --nc-star-color-empty: #e0e0e0;
  --nc-star-size: 28px;
}

nc-star-rating::part(star):hover {
  transform: scale(1.15);
}
```

## Accessibility

### Interactive Mode

- `role="slider"` on the container.
- `aria-valuenow` reflects the current value.
- `aria-valuemin="0"`, `aria-valuemax` reflects `max`.
- `aria-label="Rating: X out of Y stars"`.
- Keyboard: Arrow Left / Right, Home, End.

### Readonly Mode

- `role="img"` on the container.
- `aria-label` with rating text (e.g., "3.5 out of 5 stars").

## Usage Examples

### Basic Interactive Rating

```html
<nc-star-rating value="3" max="5"></nc-star-rating>
```

### Half-Star, Readonly

```html
<nc-star-rating value="3.5" max="5" half readonly></nc-star-rating>
```

### Listening for Changes

```js
document.querySelector('nc-star-rating')
  .addEventListener('nc-change', (e) => {
    console.log('New rating:', e.detail.value);
  });
```

## Consumer Projects

- **ShopWave** — product ratings display, review submission, rating filter.
