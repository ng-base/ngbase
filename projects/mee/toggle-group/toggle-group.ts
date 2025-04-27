import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import { NgbToggleGroup, NgbToggleItem } from '@ngbase/adk/toggle-group';

@Component({
  selector: 'mee-toggle-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    { directive: NgbToggleGroup, inputs: ['value', 'multiple'], outputs: ['valueChange'] },
  ],
  template: ` <ng-content select="[meeToggleItem]" /> `,
  host: {
    class: 'flex gap-1',
  },
})
export class ToggleGroup<T> {}

@Directive({
  selector: 'button[meeToggleItem]',
  hostDirectives: [{ directive: NgbToggleItem, inputs: ['disabled', 'value'] }],
  host: {
    class:
      'inline-block rounded h-9 px-3 hover:bg-opacity-80 active:bg-opacity-70 aria-[selected=true]:bg-foreground',
  },
})
export class ToggleItem<T> {}
