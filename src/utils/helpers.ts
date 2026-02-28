/** Utility to define a custom element only once. */
export function defineElement(tagName: string, elementClass: CustomElementConstructor) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, elementClass);
  }
}

/** Utility to create a CSSStyleSheet from a string. */
export function css(strings: TemplateStringsArray, ...values: unknown[]): string {
  return strings.reduce((acc, str, i) => acc + str + (values[i] ?? ''), '');
}

/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Debounce a function call. */
export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}

/** Generate a unique ID for accessibility linkage. */
let idCounter = 0;
export function uniqueId(prefix = 'nc'): string {
  return `${prefix}-${++idCounter}`;
}
