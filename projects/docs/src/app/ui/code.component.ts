import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Injectable,
  input,
  linkedSignal,
  resource,
  Signal,
  signal,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Button } from '@meeui/ui/button';
import { Icon } from '@meeui/ui/icon';
import { Selectable, SelectableItem } from '@meeui/ui/selectable';
import { CopyToClipboard } from '@ngbase/adk/clipboard';
import { provideIcons } from '@ng-icons/core';
import { lucideCopy } from '@ng-icons/lucide';
import { BundledLanguage, BundledTheme, createHighlighter, HighlighterGeneric } from 'shiki';
import { Heading } from '@meeui/ui/typography';
import { injectTheme } from '@meeui/ui/theme';
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';

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
  imports: [Selectable, SelectableItem, CopyToClipboard, Button, Icon, Heading],
  providers: [provideIcons({ lucideCopy })],
  template: `
    <mee-selectable [(activeIndex)]="selected" class="mb-b2 text-xs">
      @if (!hidePreview()) {
        <button meeSelectableItem [value]="1">Preview</button>
      }
      <button meeSelectableItem [value]="2">Usage</button>
      <button meeSelectableItem [value]="3">Adk Code</button>
    </mee-selectable>

    @if (selected() === 1 && !hidePreview()) {
      <div class="flex min-h-80 items-center justify-center rounded-base border">
        <div class="relative p-b4 md:w-auto">
          <ng-content />
        </div>
      </div>
    } @else if (selected() === 2) {
      <div class="relative overflow-hidden rounded-base border font-body">
        <button
          meeButton="outline"
          class="absolute right-0 top-0 h-8 w-8"
          [ngbCopyToClipboard]="tsCode()"
        >
          <mee-icon name="lucideCopy" />
        </button>
        <div [innerHTML]="ts.value()"></div>
      </div>
    } @else {
      @if (adk.value(); as av) {
        <div class="relative overflow-hidden rounded-base border font-body">
          <button
            meeButton="outline"
            class="dark absolute right-0 top-0 h-8 w-8"
            [ngbCopyToClipboard]="adkCode()"
          >
            <mee-icon name="lucideCopy" />
          </button>
          <div [innerHTML]="av"></div>
        </div>
      }
      @if (references.value(); as rv) {
        <h4 meeHeader="md" class="mb-3 mt-5">References</h4>
        <div class="relative overflow-hidden rounded-base border font-body">
          <div [innerHTML]="rv"></div>
        </div>
      }
    }
  `,
  host: {
    class: 'block',
  },
  styles: [
    `
      :host ::ng-deep pre {
        @apply overflow-auto p-3 pr-b5;
      }
      :host ::ng-deep pre,
      :host ::ng-deep code {
        @apply font-dm-mono;
      }
      :host ::ng-deep code {
        counter-reset: step;
        counter-increment: step 0;
      }

      :host ::ng-deep code .line::before {
        content: counter(step);
        counter-increment: step;
        width: 1rem;
        margin-right: 1.5rem;
        display: inline-block;
        text-align: right;
        color: rgba(115, 138, 148, 0.4);
      }
    `,
  ],
})
export class DocCode {
  private codeService = inject(CodeService);
  readonly sanitizer = inject(DomSanitizer);
  readonly themeService = injectTheme();

  readonly tsCode = input<string>('');
  readonly adkCode = input<string>('');
  readonly referencesCode = input<string>('');
  readonly hidePreview = input(false, { transform: booleanAttribute });

  readonly selected = linkedSignal(() => (this.hidePreview() ? 2 : 1));
  readonly activeTab = signal(0);

  readonly ts = this.getThemeCode(this.tsCode);

  readonly adk = this.getThemeCode(this.adkCode);

  readonly references = this.getThemeCode(this.referencesCode);

  private getThemeCode(code: Signal<string>) {
    return resource({
      request: () => ({ code: code(), theme: this.themeService.mode() }),
      loader: async ({ request: { code, theme } }) => {
        if (!code) return null;
        const highlighter = await this.codeService.getHighlighter();
        const html = highlighter.codeToHtml(code, {
          lang: 'angular-ts',
          themes: { light: 'github-light', dark: 'github-dark' },
          defaultColor: theme,
        });
        return this.sanitizer.bypassSecurityTrustHtml(html);
      },
    });
  }
}

export function getCode(path: string) {
  const httpClient = inject(HttpClient);
  const x = rxResource({
    loader: () => httpClient.get(path, { responseType: 'text' }),
  });
  return computed(() => x.value()?.trim() ?? '');
}
