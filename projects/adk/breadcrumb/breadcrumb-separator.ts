import { Directive } from '@angular/core';

@Directive({
  selector: '[meeBreadcrumbSeparatorAria]',
  host: {
    tabindex: '-1',
    'aria-hidden': 'true',
    role: 'presentation',
  },
})
export class MeeBreadcrumbSeparatorAria {}

@Directive({
  selector: '[meeBreadcrumbsSeparator]',
})
export class MeeBreadcrumbSeparator {}
