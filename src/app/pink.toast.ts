import { Component } from '@angular/core';
import { Toast, ToastrService, ToastPackage } from '../lib/public_api';

@Component({
  selector: '[pink-toast-component]',
  styles: [
    `:host {
      background-color: #FF69B4;
      position: relative;
      overflow: hidden;
      margin: 0 0 6px;
      padding: 10px 10px 10px 10px;
      width: 300px;
      border-radius: 3px 3px 3px 3px;
      color: #FFFFFF;
      pointer-events: all;
      cursor: pointer;
    }
    .btn-pink {
      -webkit-backface-visibility: hidden;
      -webkit-transform: translateZ(0);
    }`
  ],
  template: `
    <div class="row" [style.display]="state().value === 'inactive' ? 'none' : ''" [class]="state().value">
      <div class="col-9">
        @if (title) {
          <div [class]="options.titleClass" [attr.aria-label]="title">
            {{ title }}
          </div>
        }
        @if (message) {
          @if (options.enableHtml) {
            <div role="alert"
              [class]="options.messageClass" [innerHTML]="message">
            </div>
          } @else {
            <div role="alert"
              [class]="options.messageClass" [attr.aria-label]="message">
              {{ message }}
            </div>
          }
        }
      </div>
      <div class="col-3 text-right">
        @if (options.closeButton) {
          <a (click)="remove()" class="btn btn-pink btn-sm">
            close
          </a>
        } @else {
          <a class="btn btn-pink btn-sm" (click)="action($event)">
            {{ undoString }}
          </a>
        }
      </div>
    </div>
    @if (options.progressBar) {
      <div>
        <div class="toast-progress" [style.width]="width() + '%'"></div>
      </div>
    }
  `,
  preserveWhitespaces: false,
  styleUrl: "./pink.toast.component.scss"
})
export class PinkToast extends Toast {
  // used for demo purposes
  undoString = 'undo';

  action(event: Event) {
    event.stopPropagation();
    this.undoString = 'undid';
    this.toastPackage.triggerAction();
    return false;
  }
}
