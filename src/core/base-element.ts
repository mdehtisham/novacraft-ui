/**
 * NcBaseElement — Abstract base class for all NovaCraft UI components.
 * Provides Shadow DOM encapsulation, attribute observation, event emission,
 * and style application via adoptedStyleSheets.
 */
export abstract class NcBaseElement extends HTMLElement {
  protected shadow: ShadowRoot;
  private _initialized = false;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (!this._initialized) {
      this._applyStyles();
      this._initialized = true;
    }
    this._render();
  }

  disconnectedCallback() {
    this._cleanup();
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue !== newValue && this._initialized) {
      this._render();
    }
  }

  /** Return the component's HTML template string. */
  protected abstract render(): string;

  /** Called after every render — use to attach event listeners. */
  protected afterRender(): void {}

  /** Override to clean up event listeners or resources on disconnect. */
  protected _cleanup(): void {}

  private _render() {
    const template = document.createElement('template');
    template.innerHTML = this.render();
    this.shadow.innerHTML = '';
    this.shadow.appendChild(template.content.cloneNode(true));
    this.afterRender();
  }

  private _applyStyles() {
    const ctor = this.constructor as typeof NcBaseElement & { styles?: string };
    if (ctor.styles) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(ctor.styles);
      this.shadow.adoptedStyleSheets = [sheet];
    }
  }

  /** Dispatch a composed, bubbling custom event. */
  protected emit<T>(event: string, detail?: T, options?: Partial<CustomEventInit>) {
    this.dispatchEvent(
      new CustomEvent(event, {
        detail,
        bubbles: true,
        composed: true,
        ...options,
      })
    );
  }

  // ─── Attribute ↔ Property Helpers ──────────────────────────

  public getBoolAttr(name: string): boolean {
    return this.hasAttribute(name);
  }

  public getStrAttr(name: string, fallback = ''): string {
    return this.getAttribute(name) ?? fallback;
  }

  public getNumAttr(name: string, fallback = 0): number {
    return Number(this.getAttribute(name)) || fallback;
  }

  public setBoolAttr(name: string, value: boolean) {
    if (value) {
      this.setAttribute(name, '');
    } else {
      this.removeAttribute(name);
    }
  }

  public setStrAttr(name: string, value: string) {
    this.setAttribute(name, value);
  }
}
