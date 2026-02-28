# `<nc-textarea>` — Component Documentation

## Overview

Multi-line text input with auto-grow, character counter, resize control, and form participation. Uses the same label/error/hint pattern as `nc-input` for visual consistency.

## Architecture Decisions

- **Auto-grow:** sets `textarea.style.height = 'auto'` then assigns `scrollHeight`. Pure JS — no hidden mirror div, no CSS grid hack. Auto-grow forces `resize: none`.
- **Character counter:** shows `"X / maxlength"` when `maxlength` is set. Counter turns red when the count exceeds the limit.
- **Resize property:** maps to CSS `resize` on the textarea via BEM modifier classes (`--resize-none`, `--resize-vertical`, etc.). Auto-grow overrides resize.
- **ElementInternals:** same form participation as `nc-input` — `setFormValue()` enables native `<form>` submit.
- **Same visual design as `nc-input`** — label, border, error, hint patterns are identical.

## Data Flow

### Data In (Attributes / Properties)

| Attribute     | Type                                        | Default      | Description                      |
| ------------- | ------------------------------------------- | ------------ | -------------------------------- |
| `label`       | `string`                                    | —            | Label text                       |
| `placeholder` | `string`                                    | —            | Placeholder text                 |
| `value`       | `string`                                    | `""`         | Current value                    |
| `rows`        | `number`                                    | `3`          | Visible row count                |
| `resize`      | `none\|vertical\|horizontal\|both`          | `"vertical"` | CSS resize behavior              |
| `auto-grow`   | `boolean`                                   | `false`      | Expand height to fit content     |
| `maxlength`   | `number`                                    | —            | Max character count (shows counter) |
| `error`       | `string`                                    | —            | Error message (shows error state)|
| `hint`        | `string`                                    | —            | Helper text below textarea       |
| `required`    | `boolean`                                   | `false`      | Marks field as required          |
| `disabled`    | `boolean`                                   | `false`      | Disables the textarea            |
| `name`        | `string`                                    | —            | Form field name                  |

### Data Out (Events)

| Event       | Fires When                  | Detail      |
| ----------- | --------------------------- | ----------- |
| `nc-input`  | Every keystroke             | `{ value }` |
| `nc-change` | On change (native)         | `{ value }` |
| `nc-focus`  | On focus                    | `{}`        |
| `nc-blur`   | On blur                     | `{}`        |

### Slots

None.

## Internal Rendering

Shadow DOM structure:

```
div.textarea-field          [part="base"]
├── label                   [part="label"]       ← if label is set
├── textarea                [part="textarea"]
└── div.textarea-field__footer                   ← if error/hint/counter
    ├── span.error          [part="error"]       ← shown when error is set
    │   OR
    │   span.hint           [part="hint"]        ← shown otherwise
    └── span.counter        [part="counter"]     ← shown when maxlength is set
```

## Extending Styles

### CSS Custom Properties

Inherits all `--nc-color-*`, `--nc-spacing-*`, `--nc-font-*`, and `--nc-radius-*` design tokens from the theme. Key tokens used:

| Property                     | Description                |
| ---------------------------- | -------------------------- |
| `--nc-color-neutral-300`     | Default border color       |
| `--nc-color-primary-500`     | Focus border color         |
| `--nc-color-danger-500`      | Error state border         |
| `--nc-color-danger-600`      | Error/counter-over text    |
| `--nc-color-neutral-50`      | Background color           |
| `--nc-radius-md`             | Border radius              |
| `--nc-font-size-sm`          | Textarea font size         |
| `--nc-focus-ring-offset`     | Focus ring box-shadow      |

### CSS Parts

Style internal elements from the outside via `::part()`:

```css
nc-textarea::part(base)     { /* field container */ }
nc-textarea::part(label)    { /* label element */ }
nc-textarea::part(textarea) { /* native textarea */ }
nc-textarea::part(counter)  { /* character counter */ }
nc-textarea::part(error)    { /* error message */ }
nc-textarea::part(hint)     { /* hint message */ }
```

## Accessibility

- `<label>` element rendered inside Shadow DOM with label class.
- `aria-invalid="true"` when `error` is set.
- Required fields show a red asterisk via `::after` pseudo-element on the label.
- Focus ring via `--nc-focus-ring-offset` on `:focus`.

## Usage Examples

### Basic

```html
<nc-textarea label="Message" placeholder="Type your message…" rows="5"></nc-textarea>
```

### Auto-grow

```html
<nc-textarea label="Bio" auto-grow placeholder="Tell us about yourself…"></nc-textarea>
```

### With Maxlength Counter

```html
<nc-textarea label="Description" maxlength="280" hint="Keep it brief."></nc-textarea>
```

### Error State

```html
<nc-textarea label="Comments" error="This field is required" required></nc-textarea>
```

### React

```jsx
function FeedbackForm() {
  const [msg, setMsg] = useState('');

  return (
    <nc-textarea
      label="Feedback"
      maxlength="500"
      value={msg}
      onNc-input={(e) => setMsg(e.detail.value)}
    />
  );
}
```

### Angular (Reactive Form)

```typescript
@Component({
  template: `
    <nc-textarea
      label="Notes"
      [value]="form.get('notes')?.value"
      [error]="form.get('notes')?.errors ? 'Required' : ''"
      (nc-change)="form.get('notes')?.setValue($event.detail.value)"
    ></nc-textarea>
  `,
})
export class NotesComponent {
  form = new FormGroup({
    notes: new FormControl('', [Validators.required]),
  });
}
```

## Consumer Projects

- **DevFolio** — contact form message field
- **TaskFlow** — task description (fallback when TipTap not loaded), comments
- **ShopWave** — product description (admin), order notes, review text
- **InkFlow** — draft notes, AI prompt input
