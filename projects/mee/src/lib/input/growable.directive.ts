import {
  Directive,
  ElementRef,
  OnDestroy,
  inject,
  afterNextRender,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  standalone: true,
  selector: 'textarea[growable]',
})
export class Growable implements OnDestroy {
  private el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private model = inject(NgControl, { optional: true });
  private sub?: Subscription;

  constructor() {
    // Disable textarea resizing
    this.el.nativeElement.style.resize = 'none';

    afterNextRender(() => {
      // required for updating the height for the initial value
      this.update();

      this.sub = this.model?.valueChanges?.subscribe((v) => {
        if (v === this.el.nativeElement.value) {
          this.update();
        } else {
          // Wait for Angular to update the DOM with the new value
          // Use a settimeout to wait for the next tick
          setTimeout(() => this.update());
        }
      });
    });
  }

  private update() {
    const el = this.el.nativeElement;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
