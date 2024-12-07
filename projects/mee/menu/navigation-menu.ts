import { Directive } from '@angular/core';
import { MeeNavigationMenu } from '@meeui/adk/menu';

@Directive({
  selector: '[meeNavigationMenu]',
  hostDirectives: [{ directive: MeeNavigationMenu, inputs: ['hover'] }],
})
export class NavigationMenu {}
