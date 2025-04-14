import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  Renderer2,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { injectTheme } from '@meeui/ui/theme';
import hljs from 'highlight.js';
import { marked } from 'marked';

@Component({
  selector: 'app-markdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<article
    [innerHTML]="htmlContent()"
    class="markdown prose max-w-none"
    [class]="theme.mode() === 'dark' ? 'dark:prose-invert' : ''"
  ></article>`,
  styles: [
    `
      :host {
        ::ng-deep {
          display: block;
          font-family: 'Roboto', sans-serif;

          .llm-code {
            /* background: #f5f5f5; */
            margin: 0;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
          }

          #typing-animation {
            @apply bg-muted-background;
            display: inline-block;
            width: 5px;
            height: 15px;
            margin-left: 5px;
            margin-bottom: -2px;
            overflow: hidden;
            animation: typing 0.5s linear infinite;
          }

          @keyframes typing {
            0% {
              opacity: 0;
            }
            50% {
              opacity: 0.5;
            }
            100% {
              opacity: 1;
            }
          }

          .hljs {
            padding: 1em;
            overflow-x: auto;
          }

          .markdown table {
            @apply border;
          }

          .markdown table th,
          .markdown table td {
            padding: 0.5rem;
            /* text-align: left; */
            /* border: 1px solid; */
          }
        }
      }
    `,
  ],
})
export class MarkdownComponent {
  readonly el = inject(ElementRef);
  readonly theme = injectTheme();
  private sanitizer = inject(DomSanitizer);
  private renderer = inject(Renderer2);

  readonly markdownContent = model('');
  readonly isStreaming = input(false);
  readonly htmlContent = computed(() => {
    let unsafeHtmlContent = '';
    if (this.markdownContent() || this.isStreaming()) {
      if (this.isStreaming()) {
        this.markdownContent.set(this.markdownContent + `<span id="typing-animation"></span>`);
      } else {
        this.markdownContent.update(x => x.replace(`<span id="typing-animation"></span>`, ''));
      }
      const processedMarkdownContent = this.appendClosingBackticks(this.markdownContent() || '');
      // console.log(processedMarkdownContent);
      // console.log(this.markdownToPlainText(processedMarkdownContent));
      unsafeHtmlContent = marked(processedMarkdownContent, {
        breaks: true,
      });
    }
    return this.sanitizer.bypassSecurityTrustHtml(unsafeHtmlContent);
  });

  constructor() {
    // Configure the marked renderer
    const renderer = new marked.Renderer();

    renderer.code = (code: string, language: string) => {
      return this.codeBlock(code, language);
    };

    marked.setOptions({
      renderer: renderer,
      highlight: this.highlightCode,
    });

    afterRenderEffect(cleanup => {
      const copyButtons = this.el.nativeElement.querySelectorAll('.copy-button');
      copyButtons.forEach((button: HTMLElement) => {
        const listener = this.renderer.listen(button, 'click', () => {
          const base64Code = button.getAttribute('data-code')!;
          const code = atob(base64Code);
          this.copyToClipboard(code);
          const text = button.textContent;
          button.textContent = 'Copied!';
          setTimeout(() => (button.textContent = text), 2000);
        });

        // Add the new listener to the listeners array
        cleanup(() => listener());
      });
    });
  }

  private highlightCode(code: string, language: string): string {
    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
    return hljs.highlight(code, { language: validLanguage }).value;
  }

  private appendClosingBackticks(markdownContent: string): string {
    const trimmedContent = markdownContent.trim();
    const backticks = trimmedContent.match(/```/g);

    if (backticks && backticks.length % 2 !== 0) {
      return trimmedContent + '\n```';
    }
    return trimmedContent;
  }

  private codeBlock(code: string, language: string): string {
    const highlighted = this.highlightCode(code, language);
    const base64Code = btoa(code);
    return `
      <div class="text-gray-600 bg-gray-300 px-2 py-1 flex justify-between items-center rounded-t-md mt-4">
        <span class="">${language?.toUpperCase()}</span>
        <button class="copy-button py-1 px-2 text-xs rounded-md transition-colors duration-200 ease-in-out hover:bg-gray-400" data-code="${base64Code}">Copy</button>
      </div>
      <pre class="llm-code"><code class="hljs ${language}">${highlighted}</code></pre>
    `;
  }

  copyToClipboard(code: string): void {
    const textarea = document.createElement('textarea');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.value = code;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  private markdownToPlainText(markdown: string): string {
    const plainText = markdown
      .replace(/[_*`~]/g, '') // Remove basic formatting characters
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
      .replace(/\[([^\[]+?)\]\(.*?\)/g, '$1') // Remove links, keep the link text
      .replace(/#{1,6}\s?/g, '') // Remove heading characters
      .replace(/^-{3,}\s?/g, '') // Remove horizontal rules
      .replace(/`{3,}.*\n/g, '') // Remove code block languages
      .replace(/<\/?.+?>/g, '') // Remove any HTML tags
      .replace(/[\[\]!()<>]/g, ''); // Remove any remaining special characters

    // Split the markdown into lines
    const lines = plainText.split('\n');

    // Process each line to remove the | character in tables
    const processedLines = lines.map(line => {
      // Check if the line is a table row or a table header separator
      const isTableRow = line.match(/^\|?[^|\n]+\|[^|\n]+(\|[^|\n]+)*\|?$/);
      const isTableHeaderSeparator = line.match(/^\|?:?-+:?\|+$/);

      if (isTableRow || isTableHeaderSeparator) {
        // Remove the | character
        return line.replace(/\|/g, '');
      } else {
        // Keep the original line
        return line;
      }
    });

    // Join the processed lines back into a single string
    return processedLines.join('\n');
  }
}
