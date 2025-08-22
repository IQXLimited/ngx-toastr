import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[toastContainer]',
  exportAs: 'toastContainer',
  standalone: true
})
export class ToastContainerDirective {
  private readonly el: ElementRef = inject(ElementRef);
  getContainerElement(): HTMLElement {
    return this.el.nativeElement;
  }
}
