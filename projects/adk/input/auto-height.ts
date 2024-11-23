import { afterNextRender, Directive, effect, ElementRef, inject, Injector } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'textarea[meeAutoHeight]',
})
export class AutoHeight {
  private el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private model = inject(NgControl, { optional: true });

  constructor() {
    // Disable textarea resizing
    this.el.nativeElement.style.resize = 'none';

    const injector = inject(Injector);
    effect(cleanup => {
      // required for updating the height for the initial value
      this.update();

      const sub = this.model?.valueChanges?.subscribe(v => {
        if (v === this.el.nativeElement.value) {
          this.update();
        } else {
          // Wait for Angular to update the DOM with the new value
          // Use a settimeout to wait for the next tick
          afterNextRender(() => this.update(), { injector });
        }
      });
      cleanup(() => sub?.unsubscribe());

      const ro = new ResizeObserver(entries => {
        for (let entry of entries) {
          this.update();
        }
      });

      // Observe one or multiple elements
      ro.observe(this.el.nativeElement);
      cleanup(() => ro.disconnect());
    });
  }

  private update() {
    const el = this.el.nativeElement;
    el.style.height = 'auto';
    // also we need to consider the border so we need to calculate the border using height
    const borderHeight = el.offsetHeight - el.clientHeight;
    el.style.height = el.scrollHeight + borderHeight + 'px';
  }
}
