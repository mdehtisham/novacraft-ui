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