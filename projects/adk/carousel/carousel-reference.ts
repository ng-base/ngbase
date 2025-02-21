/**
 * Reference Implementation
 * ----------------------
 * These are the underlying directives from @ngbase/adk/carousel
 * that power the component. You don't need to copy these.
 */

import { computed, Directive, input, signal } from '@angular/core';

/**
 * Core carousel directive that handles:
 * - Items per step
 * - Total steps
 * - Current step
 * - First step
 * - Last step
 */
@Directive({
  selector: '[ngbCarousel]',
  exportAs: 'ngbCarousel',
})
export class Carousel {
  // Items per step
  readonly itemsPerStep = computed(() => 1);

  // Total steps
  readonly totalSteps = computed(() => 1);

  // Current step
  readonly current = signal(0);

  // First step
  readonly isFirst = computed(() => true);

  // Last step
  readonly isLast = computed(() => true);
}

@Directive({
  selector: '[ngbCarouselItem]',
  exportAs: 'ngbCarouselItem',
})
export class CarouselItem {}

@Directive({
  selector: '[ngbCarouselButton]',
  exportAs: 'ngbCarouselButton',
})
export class CarouselButton {
  // The step number or 'next' or 'prev'
  readonly ngbCarouselButton = input.required<number | 'next' | 'prev'>();
}
