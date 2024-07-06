import { Directive, ElementRef, contentChildren, inject, input } from '@angular/core';
import { PicasaContainer } from './picasa.component';
import { picasaPortal } from './picase.service';

@Directive({
  standalone: true,
  selector: '[meePicasa]',
})
export class Picasa {
  dialog = picasaPortal();
  items = contentChildren(PicasaItem);

  open(src: string, id: string, target: HTMLElement) {
    this.dialog.open(PicasaContainer, {
      data: { src, id, target },
      classNames: ['bg-transparent', 'border-0', 'shadow-none'],
      height: '100vh',
    });
  }
}

@Directive({
  standalone: true,
  selector: 'img[meePicasaItem]',
  host: {
    '(click)': 'open()',
    '[style.viewTransitionName]': 'id',
  },
})
export class PicasaItem {
  picasa = inject(Picasa);
  src = input.required<string>();
  el = inject<ElementRef<HTMLElement>>(ElementRef);
  id = 'generateId()';

  constructor() {
    (this.el.nativeElement.style as any).viewTransitionName = this.id;
  }

  open() {
    this.picasa.open(this.src(), this.id, this.el.nativeElement);
  }
}
