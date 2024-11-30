import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MeeToggleItem } from '@meeui/adk/toggle-group';

@Component({
  selector: 'button[meeToggleItem]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: MeeToggleItem, inputs: ['disabled', 'value'] }],
  template: `<ng-content />`,
  host: {
    class:
      'inline-block rounded h-9 px-3 hover:bg-opacity-80 active:bg-opacity-70 aria-[selected=true]:bg-background',
  },
})
export class ToggleItem<T> {}
