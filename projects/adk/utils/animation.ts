import {
  animate,
  animateChild,
  AnimationTriggerMetadata,
  group,
  query,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const createHostAnimation = function dialogHostAnimation(animationNames: string[]) {
  return trigger('parentAnimation', [
    transition(':enter', [query(animationNames.join(', '), [animateChild()], { optional: true })]),
    transition(':leave', [
      group(animationNames.map(x => query(x, [animateChild()], { optional: true }))),
    ]),
  ]);
};

// fade in and out animation
export function fadeAnimation(time: string): AnimationTriggerMetadata {
  return trigger('fadeAnimation', [
    state('1', style({ opacity: 1 })),
    state('void', style({ opacity: 0 })),
    state('0', style({ opacity: 0 })),
    transition('* => *', animate(`${time} ease`)),
  ]);
}
