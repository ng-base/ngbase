import {
  AnimationTriggerMetadata,
  trigger,
  state,
  style,
  transition,
  animate,
  query,
  animateChild,
  group,
} from '@angular/animations';

export const sideAnimation: AnimationTriggerMetadata = trigger('sideAnimation', [
  state('1', style({ transform: 'none' })),
  state('void', style({ transform: 'translate3d(100%, 0, 0)' })),
  state('0', style({ transform: 'translate3d(100%, 0, 0)' })),
  transition('* => *', animate('300ms cubic-bezier(0.55, 0.31, 0.15, 0.93)')),
]);

// fade in and out animation
export function fadeAnimation(time: string): AnimationTriggerMetadata {
  return trigger('fadeAnimation', [
    state('1', style({ opacity: 1 })),
    state('void', style({ opacity: 0 })),
    state('0', style({ opacity: 0 })),
    transition('* => *', animate(`${time} ease`)),
  ]);
}

export const viewAnimation: AnimationTriggerMetadata = trigger('viewAnimation', [
  state('1', style({ transform: 'none', opacity: 1 })),
  state('void', style({ transform: 'translate3d(0, 10px, 0) scale(0.99)', opacity: 0 })),
  state('0', style({ transform: 'translate3d(0, 10px, 0)', opacity: 0 })),
  transition('* => *', animate('200ms ease')),
]);
// cubic-bezier(0.25, 0.8, 0.25, 1)

export const createHostAnimation = function dialogHostAnimation(animationNames: string[]) {
  return trigger('parentAnimation', [
    transition(':enter', [query(animationNames.join(', '), [animateChild()], { optional: true })]),
    transition(':leave', [
      group(animationNames.map(x => query(x, [animateChild()], { optional: true }))),
    ]),
  ]);
};
