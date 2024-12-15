import { trigger, state, style, transition, animate } from '@angular/animations';

export const slideAnimation = trigger('slide', [
  state('void', style({ height: '0', overflow: 'hidden' })),
  state('*', style({ height: '*' })),
  transition('void => *', animate('200ms ease')),
  transition('* => void', animate('200ms ease')),
]);
