/**
 * Reference Implementation
 * ----------------------
 * These are the underlying directives from @ngbase/adk/accordion
 * that power the component. You don't need to copy these.
 */

import { booleanAttribute, contentChildren, Directive, input, model, signal } from '@angular/core';
import { uniqueId } from '@ngbase/adk/utils';

/**
 * Core group directive that handles:
 * - Multiple accordion management
 * - Child accordion tracking
 * - Active state management
 */
@Directive({
  selector: '[ngbAccordionGroup]',
  exportAs: 'ngbAccordionGroup',
})
export class NgbAccordionGroup {
  // Tracks all child accordion items
  readonly items = contentChildren(NgbAccordion);

  // Controls multiple expansion mode
  readonly multiple = input(false, { transform: booleanAttribute });

  // Manages active accordion state
  readonly activeId = signal('');
}

/**
 * Core accordion directive that handles:
 * - Expansion state
 * - Disabled state
 * - Unique identification
 * - Toggle functionality
 */
@Directive({
  selector: '[ngbAccordion]',
  exportAs: 'ngbAccordion',
})
export class NgbAccordion {
  // Manages the expanded state
  readonly expanded = model(false);

  // Controls the disabled state
  readonly disabled = input(false, { transform: booleanAttribute });

  // Generates a unique ID for the accordion
  readonly id = uniqueId();

  // Toggles the expanded state
  toggle(): void;
}

/**
 * Support directives for content and header
 * These handle the structural aspects of the accordion
 */
@Directive({
  selector: '[ngbAccordionContent]',
})
export class NgbAccordionContent {}

@Directive({
  selector: '[ngbAccordionHeader]',
})
export class NgbAccordionHeader {}
