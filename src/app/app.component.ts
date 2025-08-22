import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    template: `
  <app-header></app-header>
  <app-home></app-home>
  <app-footer></app-footer>
`,
    standalone: false
})
export class AppComponent {}
