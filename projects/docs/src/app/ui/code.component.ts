import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Button } from '@meeui/button';
import { Icon } from '@meeui/icon';
import { Selectable, SelectableItem } from '@meeui/selectable';
import { Tab, Tabs } from '@meeui/tabs';
import { CopyToClipboard } from '@meeui/utils';
import { provideIcons } from '@ng-icons/core';
import { lucideCopy } from '@ng-icons/lucide';
import { createHighlighter } from 'shiki';

@Component({
  standalone: true,
  selector: 'app-doc-code',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Selectable, SelectableItem, Tabs, Tab, CopyToClipboard, Button, Icon],
  providers: [provideIcons({ lucideCopy })],
  template: `
    <mee-selectable [(activeIndex)]="selected" class="mb-b2 text-xs">
      <button meeSelectableItem [value]="1">Preview</button>
      <button meeSelectableItem [value]="2">Source</button>
    </mee-selectable>

    @if (selected() === 1) {
      <div class="flex min-h-80 items-center justify-center rounded-base border">
        <div class="relative p-b4 md:w-auto">
          <ng-content></ng-content>
        </div>
      </div>
    } @else {
      <div class="relative overflow-hidden rounded-base border font-body">
        <button
          meeButton
          variant="outline"
          class="dark absolute right-0 top-0 h-8 w-8"
          [meeCopyToClipboard]="tsCode()"
        >
          <mee-icon name="lucideCopy"></mee-icon>
        </button>
        <div [innerHTML]="ts()"></div>
      </div>
      <!-- <mee-tabs
        [(selectedIndex)]="activeTab"
        class="small dark overflow-hidden rounded-base border bg-black font-body text-xs"
      >
        <mee-tab label="Typescript" class="!p-0">
          <div [innerHTML]="ts()"></div>
        </mee-tab>
        <mee-tab label="HTML" class="!p-0">
          <div [innerHTML]="html()"></div>
        </mee-tab>
      </mee-tabs> -->
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
  selected = signal(1);
  activeTab = signal(0);
  sanitizer = inject(DomSanitizer);
  tsCode = input<string>('');
  htmlCode = input<string>('');
  html = signal<any>('');
  ts = signal<any>('');

  constructor() {
    effect(
      () => {
        // this.genHtml();
        this.genTs();
      },
      { allowSignalWrites: true },
    );
  }

  async genHtml() {
    const highlighter = await createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: ['angular-html'],
    });
    const html = highlighter.codeToHtml(this.htmlCode(), {
      lang: 'angular-html',
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: 'dark',
      colorReplacements: {
        backgroundColor: '#ffffff',
      },
    });
    this.html.set(this.sanitizer.bypassSecurityTrustHtml(html));
  }

  async genTs() {
    const highlighter = await createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: ['angular-ts'],
    });
    const ts = highlighter.codeToHtml(this.tsCode(), {
      lang: 'angular-ts',
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: 'dark',
    });
    this.ts.set(this.sanitizer.bypassSecurityTrustHtml(ts));
  }
}
