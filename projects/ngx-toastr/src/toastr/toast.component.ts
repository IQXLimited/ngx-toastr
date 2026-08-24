import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  WritableSignal,
  signal,
} from "@angular/core"

import { toastComponentTemplate, ToastBaseDirective } from "./toast-base"

@Component ( {
  selector: "[toast-component]",
  template: toastComponentTemplate,
  styleUrl: "./toast.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class]": "toastPackage.toastType + \" \" + toastPackage.config.toastClass",
    "[class.active]": "state().value === \"active\"",
    "[class.removed]": "state().value === \"removed\"",
    "[style.--ease-time.ms]": "state().params.easeTime",
    "[style.--easing]": "state().params.easing",
  },
  preserveWhitespaces: false
} )
export class Toast<ConfigPayload = unknown> extends ToastBaseDirective<ConfigPayload> {
  public state!: WritableSignal<{
    value: "inactive" | "active" | "removed"
    params: { easeTime: number | string; easing: string }
  }>

  public constructor () {
    super ()
    this.state = signal ( {
      value: "inactive",
      params: {
        easeTime: this.toastPackage.config.easeTime,
        easing: "ease-in",
      },
    } )
  }

  protected isRemoved (): boolean {
    return this.state ().value === "removed"
  }

  protected setActive (): void {
    this.state.set ( { ...this.state (), value: "active" } )
  }

  protected setRemoved (): void {
    this.state.set ( { ...this.state (), value: "removed" } )
  }

  protected getRemovalDelay (): number {
    return +this.toastPackage.config.easeTime
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
