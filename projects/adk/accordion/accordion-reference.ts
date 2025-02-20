/**
 * Reference Implementation
 * ----------------------
 * These are the underlying directives from @meeui/adk/accordion
 * that power the component. You don't need to copy these.
 */

import { booleanAttribute, contentChildren, Directive, input, model, signal } from '@angular/core';
import { uniqueId } from '@meeui/adk/utils';

/**
 * Core group directive that handles:
 * - Multiple accordion management
 * - Child accordion tracking
 * - Active state management
 */
@Directive({
  selector: '[meeAccordionGroup]',
  exportAs: 'meeAccordionGroup',
})
export class MeeAccordionGroup {
  // Tracks all child accordion items
  readonly items = contentChildren(MeeAccordion);

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
  selector: '[meeAccordion]',
  exportAs: 'meeAccordion',
})
export class MeeAccordion {
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
  selector: '[meeAccordionContent]',
})
export class MeeAccordionContent {}

@Directive({
  selector: '[meeAccordionHeader]',
})
export class MeeAccordionHeader {}
