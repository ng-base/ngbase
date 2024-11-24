import { Component, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { DialogRef } from '@meeui/adk/portal';
import { PicasaBase } from './picasa-base.component';

@Component({
  selector: 'mee-picasa',
  template: `
    <img
      #imgEl
      [src]="data.data.src"
      alt="Placeholder"
      class="max-h-[100vh] max-w-[100vw] object-contain"
      [style.viewTransitionName]="data.data.id"
    />
  `,
  host: {
    class: 'block',
  },
})
export class PicasaContainer {
  data = inject(DialogRef);
  imgEl = viewChild<ElementRef<HTMLImageElement>>('imgEl');
  dialogRef = inject(DialogRef);
  picasa = inject(PicasaBase);

  constructor() {
    let transform = '';
    afterNextRender(() => {
      const imgEl = this.imgEl()!.nativeElement;
      const target = this.data.data.target as HTMLElement;
      const { width, height, top, left } = target.getBoundingClientRect();
      const { clientWidth, clientHeight } = document.documentElement;
      const imgRect = imgEl.getBoundingClientRect();
      const scale = Math.max(width / imgRect.width, height / imgRect.height);
      imgEl.style.transform = `scale(${scale})`;
      const x = left + width / 2 - clientWidth / 2;
      const y = top + height / 2 - clientHeight / 2;
      transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      imgEl.style.transform = transform;
      console.log(transform);
      setTimeout(() => {
        imgEl.style.transition = '300ms cubic-bezier(0.55, 0.31, 0.15, 0.93)';
        imgEl.style.transform = `none`;
      });
    });

    this.dialogRef.afterClosed.subscribe(() => {
      const imgEl = this.imgEl()!.nativeElement;
      imgEl.style.transition = '300ms cubic-bezier(0.55, 0.31, 0.15, 0.93)';
      imgEl.style.transform = transform;
      console.log(transform);
      imgEl.addEventListener('transitionend', this.picasa.onClose, {
        once: true,
      });
    });
  }
}
