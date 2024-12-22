import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';
import { AccessibleGroup } from '@meeui/adk/a11y';
import { MeeMenu, MeeMenuTrigger, MenuGroup, provideMenu } from '@meeui/adk/menu';

@Component({
  selector: 'mee-menu',
  exportAs: 'meeMenu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideMenu(Menu)],
  imports: [AccessibleGroup, MenuGroup],
  template: `
    <ng-template #container>
      <div meeMenuGroup class="flex flex-col p-b">
        <ng-content />
      </div>
    </ng-template>
  `,
})
export class Menu extends MeeMenu {}

@Directive({
  selector: '[meeMenuTrigger]',
  hostDirectives: [
    { directive: MeeMenuTrigger, inputs: ['meeMenuTrigger', 'meeMenuTriggerData', 'options'] },
  ],
})
export class MenuTrigger {}
