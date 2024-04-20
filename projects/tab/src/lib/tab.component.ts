import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'mee-tab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (active()) {
    <div class="p-4">
      <ng-content></ng-content>
    </div>
  }`,
  styles: ``,
  host: {
    class: 'block',
  },
})
export class Tab {
  active = signal(false);
  title = input('Tab');
}
