# `<nc-input>` — Component Documentation

## Overview

Text input field with label, validation error display, hint text, and prefix/suffix slots. Supports 7 input types. Participates in native forms via the ElementInternals API.

## Architecture Decisions

- **ElementInternals for form participation:** `setFormValue()` enables `nc-input` inside `<form>` with native submit. Falls back gracefully in older browsers.
- **Label is internal** (not external `<label>`) — clicking the label focuses the input via Shadow DOM forwarding. Keeps label + input as a single unit.
- **Error state:** red border + error message below. Error message overrides hint when present.
- **Prefix/suffix slots:** for icons, buttons, or text adornments (e.g., `"$"` prefix, `".com"` suffix).
- **Two-way binding:** attribute `value` sets the initial value; property `value` always reflects current user input.

## Data Flow

### Data In (Attributes / Properties)

| Attribute    | Type                                                   | Default  | Description                  |
| ------------ | ------------------------------------------------------ | -------- | ---------------------------- |
| `type`       | `text\|email\|password\|number\|tel\|url\|search`     | `"text"` | Input type                   |
| `label`      | `string`                                               | —        | Label text                   |
| `placeholder`| `string`                                               | —        | Placeholder text             |
| `value`      | `string`                                               | `""`     | Current value                |
| `error`      | `string`                                               | —        | Error message (shows error state) |
| `hint`       | `string`                                               | —        | Helper text below input      |
| `required`   | `boolean`                                              | `false`  | Marks field as required      |
| `disabled`   | `boolean`                                              | `false`  | Disables the input           |
| `size`       | `sm\|md\|lg`                                           | `"md"`   | Input size variant           |
| `full-width` | `boolean`                                              | `false`  | Stretches to container width |
| `name`       | `string`                                               | —        | Form field name              |
| `maxlength`  | `number`                                               | —        | Maximum character count      |
| `minlength`  | `number`                                               | —        | Minimum character count      |
| `pattern`    | `string`                                               | —        | Regex validation pattern     |

### Data Out (Events)

| Event       | Fires When                        | Detail          |
| ----------- | --------------------------------- | --------------- |
| `nc-input`  | Every keystroke                   | `{ value }`     |
| `nc-change` | On blur after value changed       | `{ value }`     |
| `nc-focus`  | On focus                          | `{}`            |
| `nc-blur`   | On blur                           | `{ value }`     |

### Slots

| Slot     | Description                                              |
| -------- | -------------------------------------------------------- |
| `prefix` | Leading icon/text (e.g., search icon, `"$"`)             |
| `suffix` | Trailing icon/text (e.g., clear button, unit label)      |

## Internal Rendering

Shadow DOM structure:

```
div.field         [part="field"]
├── label         [part="label"]
├── div.input-wrapper [part="wrapper"]
│   ├── slot[prefix]  [part="prefix"]
│   ├── input         [part="input"]
│   └── slot[suffix]  [part="suffix"]
└── span.error    [part="error"]   ← shown when `error` is set
    OR
    span.hint     [part="hint"]    ← shown otherwise
```

## Extending Styles

### CSS Custom Properties

| Property                   | Description            |
| -------------------------- | ---------------------- |
| `--nc-input-border-color`  | Default border color   |
| `--nc-input-focus-color`   | Focus ring / border    |
| `--nc-input-error-color`   | Error state color      |
| `--nc-input-bg`            | Background color       |
| `--nc-input-radius`        | Border radius          |
| `--nc-input-font-size`     | Font size              |

### CSS Parts

Style internal elements from the outside via `::part()`:

```css
nc-input::part(field)   { /* field container */ }
nc-input::part(label)   { /* label element */ }
nc-input::part(wrapper) { /* input wrapper */ }
nc-input::part(input)   { /* native input */ }
nc-input::part(prefix)  { /* prefix slot */ }
nc-input::part(suffix)  { /* suffix slot */ }
nc-input::part(error)   { /* error message */ }
nc-input::part(hint)    { /* hint message */ }
```

## Accessibility

- `<label>` element linked to `<input>` via `for`/`id` (auto-generated).
- `aria-invalid="true"` when `error` is set.
- `aria-describedby` points to the error or hint element.
- `aria-required` when `required` is set.
- Focus ring via `:focus-visible`.

## Usage Examples

### Basic

```html
<nc-input label="Username" placeholder="Enter username"></nc-input>
```

### With Error

```html
<nc-input label="Email" type="email" error="Invalid email address"></nc-input>
```

### With Prefix Icon

```html
<nc-input label="Search" type="search" placeholder="Search…">
  <svg slot="prefix" aria-hidden="true"><!-- icon --></svg>
</nc-input>
```

### Email Type with Hint

```html
<nc-input
  label="Email"
  type="email"
  hint="We'll never share your email."
  required
></nc-input>
```

### React (with react-hook-form)

```jsx
function ContactForm() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <nc-input
        label="Name"
        ref={(el) => el && register("name").ref(el)}
        onNc-change={(e) => register("name").onChange(e)}
      />
    </form>
  );
}
```

### Angular (Reactive Form)

```typescript
@Component({
  template: `
    <nc-input
      label="Email"
      type="email"
      [value]="form.get('email')?.value"
      [error]="form.get('email')?.errors ? 'Invalid email' : ''"
      (nc-change)="form.get('email')?.setValue($event.detail.value)"
    ></nc-input>
  `,
})
export class ContactComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
}
```

## Consumer Projects

- **DevFolio** — contact form (name, email, subject)
- **TaskFlow** — task title, workspace name, search
- **ShopWave** — checkout address fields, admin product fields, search
- **InkFlow** — article title, search, publish settings
