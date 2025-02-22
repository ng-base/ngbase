import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import { AccessibleGroup } from '@ngbase/adk/a11y';
import { NgbMenu, NgbMenuTrigger, MenuGroup, provideMenu } from '@ngbase/adk/menu';

@Component({
  selector: 'mee-menu',
  exportAs: 'meeMenu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideMenu(Menu)],
  imports: [AccessibleGroup, MenuGroup],
  template: `
    <ng-template #container>
      <div ngbMenuGroup class="flex flex-col p-1">
        <ng-content />
      </div>
    </ng-template>
  `,
})
export class Menu extends NgbMenu {}

@Directive({
  selector: '[meeMenuTrigger]',
  hostDirectives: [
    {
      directive: NgbMenuTrigger,
      inputs: [
        'ngbMenuTrigger: meeMenuTrigger',
        'ngbMenuTriggerData: meeMenuTriggerData',
        'options',
      ],
    },
  ],
  host: {
    class: 'outline-none',
  },
})
export class MenuTrigger {}
