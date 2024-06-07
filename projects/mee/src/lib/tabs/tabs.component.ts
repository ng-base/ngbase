import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  contentChild,
  input,
  signal,
} from '@angular/core';

@Component({
  selector: 'mee-tab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (active()) {
    <div class="p-b4">
      <ng-content></ng-content>
    </div>
  }`,
  host: {
    class: 'block',
  },
})
export class Tab {
  header = contentChild(TabHeader, { read: TemplateRef });
  active = signal(false);
  label = input('Tab');
}

@Directive({
  standalone: true,
  selector: '[meeTabHeader]',
})
export class TabHeader {}
