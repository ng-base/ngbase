import { trigger, state, style, transition, animate } from '@angular/animations';
import { createHostAnimation, fadeAnimation } from '@ngbase/adk/utils';

export const slideInOutAnimation = trigger('slideInOutAnimation', [
  state('1', style({ transform: 'none', opacity: 1 })),
  state('void', style({ transform: 'translateY(-20px)', opacity: 0 })),
  state('0', style({ transform: 'translateY(-20px)', opacity: 0 })),
  transition('* => *', animate('100ms ease-out')),
]);

export const tourAnimation = [
  createHostAnimation(['@slideInOutAnimation', '@fadeAnimation']),
  slideInOutAnimation,
  fadeAnimation('200ms'),
];
