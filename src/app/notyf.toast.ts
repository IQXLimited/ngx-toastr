import { Component } from '@angular/core';
import { Toast } from '../lib/public_api';

@Component({
  selector: 'notyf-toast-component',
  styles: [],
  template: `
    <div class="notyf__toast notyf__toast--success" [class]="state().value">
      <div class="notyf__wrapper">
        <div class="notyf__icon">
          <i class="notyf__icon--success" style="color: rgb(61, 199, 99);"></i>
        </div>
        <div class="notyf__message">{{ title }} {{ message }}</div>
      </div>
      <div
        class="notyf__ripple"
        style="background-color: rgb(61, 199, 99);"
      ></div>
    </div>
  `,
  styleUrl: "./notyf.toast.component.scss"
})
export class NotyfToast extends Toast { }
