import { Directive } from '@angular/core';
import { NgbNavigationMenu } from '@ngbase/adk/menu';

@Directive({
  selector: '[meeNavigationMenu]',
  hostDirectives: [{ directive: NgbNavigationMenu, inputs: ['hover'] }],
})
export class NavigationMenu {}
