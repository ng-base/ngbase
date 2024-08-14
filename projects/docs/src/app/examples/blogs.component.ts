import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Card } from '@meeui/card';
import { MarkdownComponent } from './markdown.component';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-blogs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Card, MarkdownComponent],
  template: `
    <mee-card>
      <app-markdown [markdownContent]="data()"></app-markdown>
    </mee-card>
  `,
})
export class BlogsComponent {
  httpClient = inject(HttpClient);
  data = signal('');
  constructor() {
    this.httpClient
      .get('/nodejs.md', {
        responseType: 'text',
      })
      .subscribe(data => {
        // this.data = data;
        this.data.set(data);
      });
    // console.log('BlogsComponent', this.data);
  }
}
