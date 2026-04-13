import { Directive, ElementRef, inject } from "@angular/core"

@Directive ( {
  standalone: true,
  exportAs: "toastContainer"
} )
export class ToastContainerDirective {
  private readonly el: ElementRef = inject ( ElementRef )
  public getContainerElement ( ): HTMLElement {
    return this.el.nativeElement
  }
}
