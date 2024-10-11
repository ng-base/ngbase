import { Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'mee-skeleton',
  template: ``,
  host: {
    class: 'block animate-pulse bg-muted-background',
    '[class]': `shape() === 'circle' ? 'rounded-full' : 'rounded-bt'`,
  },
  //   styles: [
  //     `
  //       :host {
  //         background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  //         background-size: 200% 100%;
  //         animation: loading 1.5s infinite;
  //       }
  //       :host(.skeleton-circle) {
  //         border-radius: 50%;
  //       }
  //       :host(.skeleton-rectangle) {
  //         border-radius: 4px;
  //       }
  //       @keyframes loading {
  //         0% {
  //           background-position: 200% 0;
  //         }
  //         100% {
  //           background-position: -200% 0;
  //         }
  //       }
  //     `,
  //   ],
})
export class Skeleton {
  readonly shape = input<'circle' | 'rectangle'>('rectangle');
  readonly width = input<string>('100%');
  readonly height = input<string>('20px');
}
