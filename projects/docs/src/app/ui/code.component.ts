import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injectable,
  input,
  resource,
  signal,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Button } from '@meeui/ui/button';
import { Icon } from '@meeui/ui/icon';
import { Selectable, SelectableItem } from '@meeui/ui/selectable';
import { CopyToClipboard } from '@meeui/adk/clipboard';
import { provideIcons } from '@ng-icons/core';
import { lucideCopy } from '@ng-icons/lucide';
import { BundledLanguage, BundledTheme, createHighlighter, HighlighterGeneric } from 'shiki';

@Injectable({ providedIn: 'root' })
export class CodeService {
  highlighter?: HighlighterGeneric<BundledLanguage, BundledTheme>;

  async getHighlighter() {
    if (this.highlighter) return this.highlighter;
    this.highlighter = await createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: ['angular-ts'],
    });
    return this.highlighter!;
  }
}

@Component({
  selector: 'app-doc-code',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Selectable, SelectableItem, CopyToClipboard, Button, Icon],
  providers: [provideIcons({ lucideCopy })],
  template: `
    <mee-selectable [(activeIndex)]="selected" class="mb-b2 text-xs">
      <button meeSelectableItem [value]="1">Preview</button>
      <button meeSelectableItem [value]="2">Code</button>
      <button meeSelectableItem [value]="3">Usage</button>
    </mee-selectable>

    @if (selected() === 1) {
      <div class="flex min-h-80 items-center justify-center rounded-base border">
        <div class="relative p-b4 md:w-auto">
          <ng-content />
        </div>
      </div>
    } @else if (selected() === 2) {
      <div class="relative overflow-hidden rounded-base border font-body">
        <button
          meeButton="outline"
          class="dark absolute right-0 top-0 h-8 w-8"
          [meeCopyToClipboard]="adkCode()"
        >
          <mee-icon name="lucideCopy" />
        </button>
        <div [innerHTML]="adk.value()"></div>
      </div>
    } @else {
      <div class="relative overflow-hidden rounded-base border font-body">
        <button
          meeButton="outline"
          class="dark absolute right-0 top-0 h-8 w-8"
          [meeCopyToClipboard]="tsCode()"
        >
          <mee-icon name="lucideCopy" />
        </button>
        <div [innerHTML]="ts.value()"></div>
      </div>
    }
  `,
  host: {
    class: 'block',
  },
  styles: [
    `
      :host ::ng-deep pre {
        @apply overflow-auto pr-b5;
      }
      :host ::ng-deep pre,
      :host ::ng-deep code {
        @apply font-dm-mono;
      }
    `,
  ],
})
export class DocCode {
  private codeService = inject(CodeService);
  selected = signal(1);
  activeTab = signal(0);
  sanitizer = inject(DomSanitizer);
  tsCode = input<string>('');
  adkCode = input<string>('');

  ts = resource({
    request: this.tsCode,
    loader: async ({ request }) => {
      const highlighter = await this.codeService.getHighlighter();
      const html = highlighter.codeToHtml(request, {
        lang: 'angular-ts',
        themes: { light: 'github-light', dark: 'github-dark' },
        defaultColor: 'dark',
      });
      return this.sanitizer.bypassSecurityTrustHtml(html);
    },
  });

  adk = resource({
    request: this.adkCode,
    loader: async ({ request }) => {
      const highlighter = await this.codeService.getHighlighter();
      const html = highlighter.codeToHtml(request, {
        lang: 'angular-ts',
        themes: { light: 'github-light', dark: 'github-dark' },
        defaultColor: 'dark',
      });
      return this.sanitizer.bypassSecurityTrustHtml(html);
    },
  });
}
