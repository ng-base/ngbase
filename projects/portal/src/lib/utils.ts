// create a function which accepts target element and host element.
// we need to calculate the position of the tooltip based on the target element.
// we need to check whether the tooltip is overflowing the viewport on top or bottom
// if so, we need to adjust the top position
// if the tooltip is overflowing the viewport on left or right
// we need to adjust the left position
// we need to prioritize the position of the tooltip based on the priority
// we need to update the values directly instead of signal to avoid too many CD checks

import { DialogPosition } from './dialog-ref';

const positionSwap: Record<DialogPosition, DialogPosition> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
  tl: 'bl',
  tr: 'br',
  bl: 'tl',
  br: 'tr',
};

export function tooltipPosition(
  target: HTMLElement,
  el: HTMLElement,
  priority: DialogPosition = 'bottom',
  offset = 5,
): { top: number; left: number; bottom: number; position: DialogPosition } {
  console.log('target', priority);
  let position: DialogPosition = priority;
  const { top, left, width, height } = target.getBoundingClientRect();
  const { width: elWidth, height: elHeight } = el.getBoundingClientRect();
  let tTop = top - elHeight - offset;
  let tLeft = left + width / 2 - elWidth / 2;
  // we need to check whether the tooltip is overflowing the viewport on top
  // if so, we need to adjust the top position
  const isTop = tTop < 0;

  if (tTop < 0) {
    tTop = top + height + offset;
    position = 'bottom';
  } else if (priority === 'bottom') {
    tTop = top + height + offset;
  } else if (priority === 'left' || priority === 'right') {
    tTop = top - elHeight / 2 + height / 2;
  } else if (priority === 'br' || priority === 'bl') {
    tTop = top + height + offset;
  }
  // we need to check whether the tooltip is overflowing the viewport on bottom
  // if so, we need to adjust the top position
  if (!isTop && tTop + elHeight > window.innerHeight) {
    tTop = top - elHeight - offset;
    position = positionSwap[priority];
    if (priority === 'top') {
      tTop = top - elHeight - offset;
    } else if (priority === 'tr' || priority === 'tl') {
      tTop = top;
    }
  }
  // we need to check whether the tooltip is overflowing the viewport on left
  // if so, we need to adjust the left position
  if (tLeft < 0) {
    tLeft = 0;
  } else if (priority === 'left') {
    tLeft = left - elWidth - offset;
  } else if (priority === 'right') {
    tLeft = left + width + offset;
  } else if (priority === 'tr' || priority === 'br') {
    tLeft = left + width + offset;
  }
  // we need to check whether the tooltip is overflowing the viewport on right
  // if so, we need to adjust the left position
  if (tLeft + elWidth > window.innerWidth) {
    tLeft = window.innerWidth - elWidth;
    if (priority === 'left') {
      tLeft = left + width + offset;
    } else if (priority === 'bl') {
      tLeft = left - elWidth + width;
    } else if (priority === 'tl' || priority === 'tr') {
      tLeft = left - elWidth - offset;
    }
  } else if (priority === 'bl' || priority === 'tl') {
    tLeft = left;
  }
  let bottom = 0;
  if (position === 'top') {
    bottom = window.innerHeight - tTop - elHeight;
  }
  return { top: tTop, bottom, left: tLeft, position };
}
