import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { IndividualConfig, ToastPackage } from './toastr-config';
import { ToastrService } from './toastr.service';

@Component({
  selector: '[toast-component]',
  template: `
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
        <div role="alert" [class]="options.messageClass" [innerHTML]="message">
        </div>
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
  `,
  styleUrl: "./toast.component.scss",
  host: {
    '[class]': 'toastPackage.toastType + " " + toastPackage.config.toastClass',
    '[class.active]': 'state().value === "active"',
    '[class.removed]': 'state().value === "removed"',
    '[style.--ease-time.ms]':'state().params.easeTime',
    '[style.--easing]':'state().params.easing',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Toast<ConfigPayload = any> implements OnDestroy {
  message?: string | null;
  title?: string;
  options: IndividualConfig<ConfigPayload>;
  duplicatesCount!: number;
  originalTimeout: number;
  /** width of progress bar has increased- */
  width = signal(-1);

  state: WritableSignal<{
    value: 'inactive' | 'active' | 'removed';
    params: { easeTime: number | string; easing: string };
  }>;

  private timeout: any;
  private intervalId: any;
  private hideTime!: number;
  private sub: Subscription;
  private sub1: Subscription;
  private sub2: Subscription;
  private sub3: Subscription;

  protected readonly toastrService: ToastrService = inject(ToastrService);
  public readonly toastPackage: ToastPackage = inject(ToastPackage);

  constructor( ) {
    this.message = this.toastPackage.message;
    this.title = this.toastPackage.title;
    this.options = this.toastPackage.config;
    this.originalTimeout = this.toastPackage.config.timeOut;
    this.sub = this.toastPackage.toastRef.afterActivate().subscribe(() => {
      this.activateToast();
    });
    this.sub1 = this.toastPackage.toastRef.manualClosed().subscribe(() => {
      this.remove();
    });
    this.sub2 = this.toastPackage.toastRef.timeoutReset().subscribe(() => {
      this.resetTimeout();
    });
    this.sub3 = this.toastPackage.toastRef.countDuplicate().subscribe(count => {
      this.duplicatesCount = count;
    });
    this.state = signal({
      value: 'inactive',
      params: {
        easeTime: this.toastPackage.config.easeTime,
        easing: 'ease-in',
      },
    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
    clearInterval(this.intervalId);
    clearTimeout(this.timeout);
  }
  /**
   * activates toast and sets timeout
   */
  activateToast() {
    // Allow element to render first
    this.state.set({ ...this.state(), value: 'active' })
    if (
      !(this.options.disableTimeOut === true || this.options.disableTimeOut === 'timeOut') &&
      this.options.timeOut
    ) {
      this.timeout = setTimeout ( ( ) => this.remove ( ), this.options.timeOut )
      this.hideTime = new Date().getTime() + this.options.timeOut;
      if (this.options.progressBar) {
        this.intervalId = setInterval(() => this.updateProgress(), 10);
      }
    }
  }
  /**
   * updates progress bar width
   */
  updateProgress() {
    if (this.width() === 0 || this.width() === 100 || !this.options.timeOut) {
      return;
    }
    const now = new Date().getTime();
    const remaining = this.hideTime - now;
    this.width.set((remaining / this.options.timeOut) * 100);
    if (this.options.progressAnimation === 'increasing') {
      this.width.update(width => 100 - width);
    }
    if (this.width() <= 0) {
      this.width.set(0);
    }
    if (this.width() >= 100) {
      this.width.set(100);
    }
  }

  resetTimeout() {
    clearTimeout(this.timeout);
    clearInterval(this.intervalId);
    this.state.set(({ ...this.state(), value: 'active' }));

    this.timeout = setTimeout ( ( ) => this.remove ( ), this.originalTimeout )
    this.options.timeOut = this.originalTimeout;
    this.hideTime = new Date().getTime() + (this.options.timeOut || 0);
    this.width.set(-1);
    if (this.options.progressBar) {
      this.intervalId = setInterval ( ( ) => this.updateProgress ( ), 10 )
    }
  }

  /**
   * tells toastrService to remove this toast after animation time
   */
  remove() {
    if (this.state().value === 'removed') {
      return;
    }
    clearTimeout(this.timeout);
    this.state.set(({ ...this.state(), value: 'removed' }));
    this.timeout = setTimeout ( ( ) => this.toastrService.remove ( this.toastPackage.toastId ), +this.toastPackage.config.easeTime )
  }
  @HostListener('click')
  tapToast() {
    if (this.state().value === 'removed') {
      return;
    }
    this.toastPackage.triggerTap();
    if (this.options.tapToDismiss) {
      this.remove();
    }
  }
  @HostListener('mouseenter')
  stickAround() {
    if (this.state().value === 'removed') {
      return;
    }

    if (this.options.disableTimeOut !== 'extendedTimeOut') {
      clearTimeout(this.timeout);
      this.options.timeOut = 0;
      this.hideTime = 0;

      // disable progressBar
      clearInterval(this.intervalId);
      this.width.set(0);
    }
  }
  @HostListener('mouseleave')
  delayedHideToast() {
    if (
      (this.options.disableTimeOut === true || this.options.disableTimeOut === 'extendedTimeOut') ||
      this.options.extendedTimeOut === 0 ||
      this.state().value === 'removed'
    ) {
      return;
    }
    this.timeout = setTimeout ( ( ) => this.remove ( ), this.options.extendedTimeOut )
    this.options.timeOut = this.options.extendedTimeOut;
    this.hideTime = new Date().getTime() + (this.options.timeOut || 0);
    this.width.set(-1);
    if (this.options.progressBar) {
      this.intervalId = setInterval ( ( ) => this.updateProgress ( ), 10 )
    }
  }
}
