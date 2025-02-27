import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import {
  aliasPopover,
  NgbPopover,
  NgbPopoverBackdrop,
  NgbPopoverClose,
  NgbPopoverMain,
  ngbPopoverPortal,
  NgbPopoverTrigger,
  registerNgbPopover,
} from '@ngbase/adk/popover';

@Component({
  selector: 'mee-popover',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [aliasPopover(Popover)],
  imports: [NgbPopoverBackdrop, NgbPopoverMain],
  template: ` <style>
      .popover-anchor {
        --action-angle: 180deg;
        --action-left: 50%;
        --action-top: -1rem;
      }
      .popover-anchor::before {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-style: solid;
        border-top: 0.8rem solid;
        @apply border-foreground;
        border-left: 0.5rem solid transparent;
        border-right: 0.5rem solid transparent;
        top: var(--action-top);
        left: var(--action-left);
        transform: translateX(-50%) rotate(var(--action-angle, 180deg));
      }
    </style>
    <div
      ngbPopoverMain
      [@slideInOutAnimation]
      class="{{
        'menu-container pointer-events-auto fixed z-10 flex flex-col rounded-lg border bg-foreground shadow-md ' +
          (options().anchor ? 'popover-anchor ' : 'overflow-auto ')
      }}"
    >
      <div class="flex flex-1 flex-col overflow-auto">
        <ng-container #myDialog />
      </div>
    </div>
    @if (options().backdrop) {
      <div ngbPopoverBackdrop class="pointer-events-auto fixed top-0 h-full w-full"></div>
    }`,
  host: {
    class:
      'fixed top-0 left-0 w-full h-full pointer-events-none z-p flex items-center justify-center',
  },
})
class Popover extends NgbPopover {}

export function registerPopover() {
  return registerNgbPopover(Popover);
}

export const popoverPortal = ngbPopoverPortal;

@Directive({
  selector: '[meePopoverTrigger]',
  hostDirectives: [
    {
      directive: NgbPopoverTrigger,
      inputs: [
        'ngbPopoverTrigger: meePopoverTrigger',
        'ngbPopoverTriggerData: meePopoverTriggerData',
        'options',
      ],
    },
  ],
  providers: [registerPopover()],
})
export class PopoverTrigger {}

@Directive({
  selector: '[meePopoverClose]',
  hostDirectives: [NgbPopoverClose],
})
export class PopoverClose {}
