// create a function which accepts target element and host element.
// we need to calculate the position of the tooltip based on the target element.
// we need to check whether the tooltip is overflowing the viewport on top or bottom
// if so, we need to adjust the top position
// if the tooltip is overflowing the viewport on left or right
// we need to adjust the left position
// we need to prioritize the position of the tooltip based on the priority
// we need to update the values directly instead of signal to avoid too many CD checks

import { DialogPosition } from './dialog-ref';

export function tooltipPosition(
  target: HTMLElement,
  el: HTMLElement,
  priority: DialogPosition = 'bottom',
): { top: number; left: number } {
  const { top, left, width, height } = target.getBoundingClientRect();
  const { width: elWidth, height: elHeight } = el.getBoundingClientRect();
  let tTop = top - elHeight - 5;
  let tLeft = left + width / 2 - elWidth / 2;
  // we need to check whether the tooltip is overflowing the viewport on top
  // if so, we need to adjust the top position
  if (tTop < 0) {
    tTop = top + height + 5;
  } else if (priority === 'bottom') {
    tTop = top + height + 5;
  }
  // we need to check whether the tooltip is overflowing the viewport on bottom
  // if so, we need to adjust the top position
  if (tTop + elHeight > window.innerHeight) {
    tTop = top - elHeight - 5;
  } else if (priority === 'top') {
    tTop = top - elHeight - 5;
  }
  // we need to check whether the tooltip is overflowing the viewport on left
  // if so, we need to adjust the left position
  if (tLeft < 0) {
    tLeft = 0;
  } else if (priority === 'right') {
    tLeft = left - elWidth - 5;
  }
  // we need to check whether the tooltip is overflowing the viewport on right
  // if so, we need to adjust the left position
  if (tLeft + elWidth > window.innerWidth) {
    tLeft = window.innerWidth - elWidth;
  } else if (priority === 'left') {
    tLeft = left + width + 5;
  }
  return { top: tTop, left: tLeft };
}
