import { computed, Directive, inject, input, resource } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IconService } from './icon.service';

@Directive({
  selector: '[meeIcon]',
  host: {
    '[innerHTML]': 'svg()',
  },
})
export class MeeIcon {
  readonly service = inject(IconService);
  readonly sanitizer = inject(DomSanitizer);

  readonly name = input.required<string>();

  private readonly icon = resource({
    request: this.name,
    loader: ({ request }) => this.service.getIcon(request),
  });

  readonly svg = computed(() => {
    const txt = this.icon.value() || '';
    return this.sanitizer.bypassSecurityTrustHtml(txt);
  });
}
