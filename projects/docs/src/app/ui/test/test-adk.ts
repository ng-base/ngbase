class RenderResult<T> extends ElementHelper<HTMLElement> {
    /**
     * Component instance reference
     */
    host: T;

    /**
     * Creates RenderResult with component fixture
     */
    constructor(public fixture: ComponentFixture<T>);

    /**
     * Triggers change detection
     */
    detectChanges(): void;

    /**
     * Waits for async operations to complete
     */
    whenStable(): Promise<void>;

    /**
     * Waits for form and UI updates to stabilize
     */
    formStable(): Promise<void>;

    /**
     * Pauses execution for specified milliseconds
     */
    sleep(ms: number): Promise<void>;

    /**
     * Gets service instance from injector
     */
    inject<U>(directive: Type<U>): U;

    /**
     * Gets directive instance from host element
     */
    injectHost<U>(directive: Type<U>): U;

    /**
     * Queries element from document root
     */
    queryRoot<U extends HTMLElement>(selector: string): ElementHelper<U>;

    /**
     * Sets input property on component
     */
    setInput(name: string, value: any): void;
  }

  class AngularQuery {
    /**
     * Debug Element for querying the component tree
     */
    constructor(public dEl: DebugElement);

    /**
     * Gets instance of a directive/component from view child
     */
    viewChild<U>(directive: Type<U>, selector?: string | Type<any>): U;

    /**
     * Gets instances of directives/components from view children
     */
    viewChildren<U>(directive: Type<U>, selector?: string): U[];

    /**
     * Gets debug elements for view children
     */
    viewChildrenDebug<U>(directive: string | Type<U>): DebugElement[];

    /**
     * Gets debug element for a single directive/element
     */
    queryNative<U>(directive: string | Type<U>): DebugElement;

    /**
     * Converts directive/selector to appropriate predicate
     */
    private getDirectiveType(directive: string | Type<any>): Predicate<DebugElement>;
  }

  class ElementHelper<T extends HTMLElement> extends AngularQuery {
    /**
     * Holds the native DOM element
     */
    public el: T;

    /**
     * Provides access to the Debug Element
     */
    constructor(public override dEl: DebugElement);

    /**
     * Gets the text content of the element
     */
    get textContent(): string;

    /**
     * Queries for a single element
     */
    $<U extends HTMLElement>(selector: string | Type<any>): ElementHelper<U>;

    /**
     * Queries for multiple elements
     */
    $All<U extends HTMLElement>(selector: string | Type<any>): ElementHelper<U>[];

    /**
     * Finds element by exact text content
     */
    getByText(text: string, root?: string | Type<any>): HTMLElement | null;

    /**
     * Checks if element has specified CSS classes
     */
    hasClass(...classNames: string[]): boolean;

    /**
     * Gets or sets an attribute
     */
    attr(name: string, value?: string): string | null;

    /**
     * Gets or sets a CSS property
     */
    css(name: string, value?: string): string;

    /**
     * Triggers click event
     */
    click(): void;

    /**
     * Triggers focus event
     */
    focus(): void;

    /**
     * Dispatches keydown event
     */
    keydown(key: string, options?: KeyboardEventInit): KeyboardEvent;

    /**
     * Dispatches mousedown event
     */
    mouseDown(options?: MouseEventInit): MouseEvent;

    /**
     * Dispatches mouseenter event
     */
    mouseEnter(options?: MouseEventInit): MouseEvent;

    /**
     * Dispatches mouseleave event
     */
    mouseLeave(options?: MouseEventInit): MouseEvent;

    /**
     * Sets input value and dispatches input event
     */
    input(value: string | ((v: any) => any)): void;

    /**
     * Simulates paste event with provided text
     */
    paste(text: string): CustomEvent;

    /**
     * Simulates typing with optional clear
     */
    type(value: string | string[], clear?: boolean): KeyboardEvent | MouseEvent;
  }

  /**
   * Creates a fake implementation of a service
   */
  function fakeService<T extends Type<any>>(
    service: T,
    impl: Partial<InstanceType<T>> | (() => Partial<InstanceType<T>>)
  ): Provider;
  
  /**
   * Type definitions for test configuration
   */
  type FakeService<T extends Type<any>> = ReturnType<typeof fakeService<T>>;
  type RenderProvider = Provider | EnvironmentProviders | FakeService<any>;
  
  /**
   * Renders a component for testing with optional configuration
   */
  function render<T>(
    component: Type<T>,
    providers?: RenderProvider[],
    options?: {
        /**
         * Initial input values [inputName, value][]
         */
        inputs?: [string, any][];
        /**
         * Component overrides [originalComponent, replacementComponent][]
         */
        components?: [Partial<Component>, Partial<Component>][];
        /**
         * Directive overrides [originalDirective, replacementDirective][]
         */
        directives?: [Partial<Directive>, Partial<Directive>][];
        /**
         * Pipe overrides [originalPipe, replacementPipe][]
         */
        pipes?: [Partial<Pipe>, Partial<Pipe>][];
        /**
         * Additional service providers
         */
        providers?: FakeService<any>[];
    }
  ): Promise<RenderResult<T>>;
  
  /**
   * Injects a service instance with optional providers
   */
  function injectService<T>(
    service: Type<T>, 
    providers?: RenderProvider[]
  ): T;