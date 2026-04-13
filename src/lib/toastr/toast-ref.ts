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
  private afterClosed = new Subject<void> ( )
  /** triggered when toast is activated */
  private activate = new Subject<void> ( )
  /** notifies the toast that it should close before the timeout */
  private manualClose = new Subject<void> ( )
  /** notifies the toast that it should reset the timeouts */
  private resetTimeout = new Subject<void> ( )
  /** notifies the toast that it should count a duplicate toast */
  private countDuplicate = new Subject<number> ( )

  public constructor ( private overlayRef: OverlayRef ) {}

  public manualCloseComplete ( ) {
    this.manualClose.next ( )
    this.manualClose.complete ( )
  }

  public manualClosed ( ): Observable<any> {
    return this.manualClose.asObservable ( )
  }

  public timeoutReset ( ): Observable<any> {
    return this.resetTimeout.asObservable ( )
  }

  public countDuplicateObservable ( ): Observable<number> {
    return this.countDuplicate.asObservable ( )
  }

  /**
   * Close the toast.
   */
  public close ( ): void {
    this.overlayRef.detach ( )
    this.afterClosed.next ( )
    this.manualClose.next ( )
    this.afterClosed.complete ( )
    this.manualClose.complete ( )
    this.activate.complete ( )
    this.resetTimeout.complete ( )
    this.countDuplicate.complete ( )
  }

  /** Gets an observable that is notified when the toast is finished closing. */
  public afterClosedObservable ( ): Observable<any> {
    return this.afterClosed.asObservable ( )
  }

  public isInactive ( ) {
    return this.activate.closed
  }

  public activateComplete ( ) {
    this.activate.next ( )
    this.activate.complete ( )
  }

  /** Gets an observable that is notified when the toast has started opening. */
  public afterActivate ( ): Observable<any> {
    return this.activate.asObservable ( )
  }

  /** Reset the toast timouts and count duplicates */
  public onDuplicate ( resetTimeout: boolean, countDuplicate: boolean ) {
    if ( resetTimeout ) {
      this.resetTimeout.next ( )
    }
    if ( countDuplicate ) {
      this.countDuplicate.next ( ++this.duplicatesCount )
    }
  }
}
