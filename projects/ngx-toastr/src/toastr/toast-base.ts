import { DestroyRef, Directive, inject, OnDestroy, OnInit, signal, WritableSignal } from "@angular/core"
import { takeUntilDestroyed } from "@angular/core/rxjs-interop"

import { IndividualConfig, ToastPackage } from "./toastr-config"
import { ToastrService } from "./toastr.service"

export const toastComponentTemplate = `
  @if (options.closeButton) {
    <button (click)="remove()" type="button" class="toast-close-button" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  }
  @if (title) {
    <div [class]="options.titleClass" [attr.aria-label]="title">
      {{ title }}
      @if (duplicatesCount) {
        <ng-container>
          [{{ duplicatesCount + 1 }}]
        </ng-container>
      }
    </div>
  }
  @if (message) {
    @if (options.enableHtml) {
      <div role="alert" [class]="options.messageClass" [innerHTML]="message"></div>
    } @else {
      <div role="alert" [class]="options.messageClass" [attr.aria-label]="message">
        {{ message }}
      </div>
    }
  }
  @if (options.progressBar) {
    <div>
      <div class="toast-progress" [style.width]="width() + '%'"></div>
    </div>
  }
`

@Directive ()
export abstract class ToastBaseDirective<ConfigPayload = unknown> implements OnInit, OnDestroy {
  public message?: string | null
  public title?: string
  public options!: IndividualConfig<ConfigPayload>
  public duplicatesCount!: number
  public originalTimeout!: number
  public width: WritableSignal<number> = signal ( -1 )

  protected readonly toastrService = inject ( ToastrService )
  public readonly toastPackage = inject ( ToastPackage )

  private readonly destroyRef = inject ( DestroyRef )
  private timeout?: ReturnType<typeof setTimeout>
  private intervalId?: ReturnType<typeof setInterval>
  private hideTime = 0

  public constructor () {
    this.message = this.toastPackage.message
    this.title = this.toastPackage.title
    this.options = this.toastPackage.config
    this.originalTimeout = this.toastPackage.config.timeOut
  }

  public ngOnInit (): void {
    this.toastPackage.toastRef
      .afterActivate ()
      .pipe ( takeUntilDestroyed ( this.destroyRef ) )
      .subscribe ( () => this.activateToast () )

    this.toastPackage.toastRef
      .manualClosed ()
      .pipe ( takeUntilDestroyed ( this.destroyRef ) )
      .subscribe ( () => this.remove () )

    this.toastPackage.toastRef
      .timeoutReset ()
      .pipe ( takeUntilDestroyed ( this.destroyRef ) )
      .subscribe ( () => this.resetTimeout () )

    this.toastPackage.toastRef
      .countDuplicate ()
      .pipe ( takeUntilDestroyed ( this.destroyRef ) )
      .subscribe ( count => {
        this.duplicatesCount = count
      } )
  }

  public ngOnDestroy (): void {
    this.clearTimers ()
  }

  protected abstract isRemoved (): boolean
  protected abstract setActive (): void
  protected abstract setRemoved (): void
  protected abstract getRemovalDelay (): number
  protected onAfterActivate (): void {}

  public activateToast (): void {
    this.setActive ()

    if (
      !( this.options.disableTimeOut === true || this.options.disableTimeOut === "timeOut" ) &&
      this.options.timeOut
    ) {
      this.timeout = setTimeout ( () => this.remove (), this.options.timeOut )
      this.hideTime = Date.now () + this.options.timeOut

      if ( this.options.progressBar ) {
        this.intervalId = setInterval ( () => this.updateProgress (), 10 )
      }
    }

    this.onAfterActivate ()
  }

  public updateProgress (): void {
    if ( this.width () === 0 || this.width () === 100 || !this.options.timeOut ) {
      return
    }

    const remaining = this.hideTime - Date.now ()
    this.width.set ( ( remaining / this.options.timeOut ) * 100 )

    if ( this.options.progressAnimation === "increasing" ) {
      this.width.update ( width => 100 - width )
    }

    if ( this.width () <= 0 ) {
      this.width.set ( 0 )
    }

    if ( this.width () >= 100 ) {
      this.width.set ( 100 )
    }
  }

  public resetTimeout (): void {
    clearTimeout ( this.timeout )
    clearInterval ( this.intervalId )
    this.setActive ()

    this.options.timeOut = this.originalTimeout
    this.timeout = setTimeout ( () => this.remove (), this.originalTimeout )
    this.hideTime = Date.now () + ( this.originalTimeout || 0 )
    this.width.set ( -1 )

    if ( this.options.progressBar ) {
      this.intervalId = setInterval ( () => this.updateProgress (), 10 )
    }
  }

  public remove (): void {
    if ( this.isRemoved () ) {
      return
    }

    clearTimeout ( this.timeout )
    this.setRemoved ()
    this.timeout = setTimeout (
      () => this.toastrService.remove ( this.toastPackage.toastId ),
      this.getRemovalDelay (),
    )
  }

  public tapToast (): void {
    if ( this.isRemoved () ) {
      return
    }

    this.toastPackage.triggerTap ()
    if ( this.options.tapToDismiss ) {
      this.remove ()
    }
  }

  public stickAround (): void {
    if ( this.isRemoved () ) {
      return
    }

    if ( this.options.disableTimeOut !== "extendedTimeOut" ) {
      clearTimeout ( this.timeout )
      this.options.timeOut = 0
      this.hideTime = 0
      clearInterval ( this.intervalId )
      this.width.set ( 0 )
    }
  }

  public delayedHideToast (): void {
    if (
      this.options.disableTimeOut === true ||
      this.options.disableTimeOut === "extendedTimeOut" ||
      this.options.extendedTimeOut === 0 ||
      this.isRemoved ()
    ) {
      return
    }

    this.timeout = setTimeout ( () => this.remove (), this.options.extendedTimeOut )
    this.options.timeOut = this.options.extendedTimeOut
    this.hideTime = Date.now () + ( this.options.timeOut || 0 )
    this.width.set ( -1 )

    if ( this.options.progressBar ) {
      this.intervalId = setInterval ( () => this.updateProgress (), 10 )
    }
  }

  private clearTimers (): void {
    clearInterval ( this.intervalId )
    clearTimeout ( this.timeout )
  }
}
