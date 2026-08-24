import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
} from "@angular/core"

import {
  DefaultNoComponentGlobalConfig,
  GlobalConfig,
} from "./toastr-config"
import { toastComponentTemplate, ToastBaseDirective } from "./toast-base"

@Component ( {
  selector: "[toast-component]",
  template: toastComponentTemplate,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "toastPackage.toastType + \" \" + toastPackage.config.toastClass",
    "[style.display]": "displayStyle",
  },
} )
export class NoAnimationToast extends ToastBaseDirective {
  public state = signal<"inactive" | "active" | "removed"> ( "inactive" )

  protected readonly appRef = inject ( ApplicationRef )

  public get displayStyle (): string {
    return this.state () === "removed" ? "none" : ""
  }

  protected isRemoved (): boolean {
    return this.state () === "removed"
  }

  protected setActive (): void {
    this.state.set ( "active" )
  }

  protected setRemoved (): void {
    this.state.set ( "removed" )
  }

  protected getRemovalDelay (): number {
    return 0
  }

  protected override onAfterActivate (): void {
    if ( !this.options.onActivateTick || this.appRef.destroyed ) {
      return
    }

    this.appRef.tick ()
  }

  @HostListener ( "click" )
  public onClick (): void {
    this.tapToast ()
  }

  @HostListener ( "mouseenter" )
  public onMouseEnter (): void {
    this.stickAround ()
  }

  @HostListener ( "mouseleave" )
  public onMouseLeave (): void {
    this.delayedHideToast ()
  }
}

/** @deprecated Use {@link NoAnimationToast} */
export const ToastNoAnimation = NoAnimationToast

export const DefaultNoAnimationsGlobalConfig: GlobalConfig = {
  ...DefaultNoComponentGlobalConfig,
  toastComponent: NoAnimationToast,
}
