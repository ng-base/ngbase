import { Directive } from '@angular/core';
import { injectDirectionality } from '@ngbase/adk/bidi';

@Directive({
  selector: '[ngbBreadcrumbsSeparator]',
  host: {
    tabindex: '-1',
    'aria-hidden': 'true',
    role: 'presentation',
  },
})
export class NgbBreadcrumbSeparator {
  readonly dir = injectDirectionality();
}
