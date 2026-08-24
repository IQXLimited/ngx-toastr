import { Observable, Subject } from "rxjs"

import { OverlayRef } from "../overlay/overlay-ref"

/**
 * Reference to a toast opened via the Toastr service.
 */
export class ToastRef<T> {
  /** The instance of component opened into the toast. */
  public componentInstance!: T

  /** Count of duplicates of this toast */
  private duplicatesCount = 0

  /** Subject for notifying the user that the toast has finished closing. */
  private readonly _afterClosed = new Subject<void> ()
  /** triggered when toast is activated */
  private readonly _activate = new Subject<void> ()
  /** notifies the toast that it should close before the timeout */
  private readonly _manualClose = new Subject<void> ()
  /** notifies the toast that it should reset the timeouts */
  private readonly _resetTimeout = new Subject<void> ()
  /** notifies the toast that it should count a duplicate toast */
  private readonly _countDuplicate = new Subject<number> ()

  public constructor ( private readonly _overlayRef: OverlayRef ) {}

  public manualClose (): void {
    if ( this._manualClose.closed ) {
      return
    }

    this._manualClose.next ()
    this._manualClose.complete ()
  }

  public manualClosed (): Observable<void> {
    return this._manualClose.asObservable ()
  }

  public timeoutReset (): Observable<void> {
    return this._resetTimeout.asObservable ()
  }

  public countDuplicate (): Observable<number> {
    return this._countDuplicate.asObservable ()
  }

  /**
   * Close the toast.
   */
  public close (): void {
    this._overlayRef.detach ()

    if ( !this._afterClosed.closed ) {
      this._afterClosed.next ()
      this._afterClosed.complete ()
    }

    if ( !this._manualClose.closed ) {
      this._manualClose.complete ()
    }

    if ( !this._activate.closed ) {
      this._activate.complete ()
    }

    if ( !this._resetTimeout.closed ) {
      this._resetTimeout.complete ()
    }

    if ( !this._countDuplicate.closed ) {
      this._countDuplicate.complete ()
    }
  }

  /** Gets an observable that is notified when the toast is finished closing. */
  public afterClosed (): Observable<void> {
    return this._afterClosed.asObservable ()
  }

  public isInactive (): boolean {
    return this._activate.closed
  }

  public activate (): void {
    if ( this._activate.closed ) {
      return
    }

    this._activate.next ()
    this._activate.complete ()
  }

  /** Gets an observable that is notified when the toast has started opening. */
  public afterActivate (): Observable<void> {
    return this._activate.asObservable ()
  }

  /** Reset the toast timouts and count duplicates */
  public onDuplicate ( resetTimeout: boolean, countDuplicate: boolean ): void {
    if ( resetTimeout && !this._resetTimeout.closed ) {
      this._resetTimeout.next ()
    }

    if ( countDuplicate && !this._countDuplicate.closed ) {
      this._countDuplicate.next ( ++this.duplicatesCount )
    }
  }
}
