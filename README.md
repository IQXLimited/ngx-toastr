> **Note:** This repository is a fork of [ngx-toastr](https://github.com/scttcper/ngx-toastr). It builds upon the original project to provide additional features, fixes, or customizations.

-------------------------------------------------------------------------------

<div align="center">
  <img src="https://raw.githubusercontent.com/IQXLimited/ngx-toastr/master/misc/documentation-assets/ngx-toastr-example.png" width="300" alt="Angular Toastr">
  <br>
  <h1>@iqx-limited/ngx-toastr</h1>
  <br>
  <a href="https://www.npmjs.com/package/@iqx-limited/ngx-toastr">
    <img src="https://badge.fury.io/js/@iqx-limited%2Fngx-toastr.svg" alt="npm">
  </a>
  <br>
  <br>
</div>

DEMO: https://iqxlimited.github.io/ngx-toastr/

## Features

- Toast Component Injection without being passed `ViewContainerRef`
- No use of `@for`. Fewer dirty checks and higher performance.
- AoT compilation and lazy loading compatible
- Component inheritance for custom toasts
- SystemJS/UMD rollup bundle
- Animations using Pure CSS Animations
- Output toasts to an optional target directive

## Dependencies

Latest version available for each version of Angular

| ngx-toastr | Angular     |
| ---------- | ----------- |
| 13.2.1     | 10.x 11.x   |
| 14.3.0     | 12.x 13.x   |
| 15.2.2     | 14.x.       |
| 16.2.0     | 15.x        |
| 17.0.2     | 16.x        |
| 18.0.0     | 17.x        |
| 19.0.0     | 18.x        |
| current    | 20.x        |

## Install

```bash
npm install @iqx-limited/ngx-toastr --save
```

## Setup

**step 1:** add css

- copy
  [toast css](/src/lib/toastr.css)
  to your project.
- If you are using sass you can import the css.

```scss
// regular style toast
@import 'ngx-toastr/toastr';

// bootstrap style toast
// or import a bootstrap 4 alert styled design (SASS ONLY)
// should be after your bootstrap imports, it uses bs4 variables, mixins, functions
@import 'ngx-toastr/toastr-bs4-alert';

// if you'd like to use it without importing all of bootstrap it requires
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins';
// bootstrap 4
@import 'ngx-toastr/toastr-bs4-alert';
// boostrap 5
@import 'ngx-toastr/toastr-bs5-alert';
```

- If you are using angular-cli you can add it to your angular.json

```ts
"styles": [
  "styles.scss",
  "node_modules/ngx-toastr/toastr.css" // try adding '../' if you're using angular cli before 6
]
```

**step 2:** add `provideToastr`, or `provideToastrNoAnimation`, to providers.

- Standalone

```typescript
import { AppComponent } from './src/app.component';
import { provideToastr } from '@iqx-limited/ngx-toastr';

bootstrapApplication(AppComponent, {
  providers: [
    provideToastr(), // Toastr providers
  ]
});
```

## Use

```typescript
import { ToastrService } from '@iqx-limited/ngx-toastr';

@Component({...})
export class YourComponent {
  constructor(private toastr: ToastrService) {}

  showSuccess() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }
}
```

## Options

There are **individual options** and **global options**.

### Individual Options

Passed to `ToastrService.success/error/warning/info/show()`

| Option            | Type                           | Default                        | Description
| ----------------- | ------------------------------ | ------------------------------ | ------------------------------------------------- |
| toastComponent    | Component                      | Toast                          | Angular component that will be used               |
| closeButton       | boolean                        | false                          | Show close button                                 |
| timeOut           | number                         | 5000                           | Time to live in milliseconds                      |
| extendedTimeOut   | number                         | 1000                           | Time to close after a user hovers over toast      |
| disableTimeOut    | `boolean \| 'timeOut' \| 'extendedTimeOut'`  | false              | Disable both timeOut and extendedTimeOut when set to `true`. Allows specifying which timeOut to disable, either: `timeOut` or `extendedTimeOut` |
| easing            | string                         | 'ease-in'                      | Toast component easing                            |
| easeTime          | string \| number               | 300                            | Time spent easing                                 |
| enableHtml        | boolean                        | false                          | Allow html in message                             |
| newestOnTop       | boolean                        | true                           | New toast placement                               |
| progressBar       | boolean                        | false                          | Show progress bar                                 |
| progressAnimation | `'decreasing' \| 'increasing'` | 'decreasing'                   | Changes the animation of the progress bar.        |
| toastClass        | string                         | 'ngx-toastr'                   | CSS class(es) for toast                           |
| positionClass     | string                         | 'toast-top-right'              | CSS class(es) for toast container                 |
| titleClass        | string                         | 'toast-title'                  | CSS class(es) for inside toast on title           |
| messageClass      | string                         | 'toast-message'                | CSS class(es) for inside toast on message         |
| tapToDismiss      | boolean                        | true                           | Close on click                                    |
| onActivateTick    | boolean                        | false                          | Fires `changeDetectorRef.detectChanges()` when activated. Helps show toast from asynchronous events outside of Angular's change detection |

#### Setting Individual Options

success, error, info, warning take `(message, title, ToastConfig)` pass an
options object to replace any default option.

```typescript
this.toastrService.error('everything is broken', 'Major Error', {
  timeOut: 3000,
});
```

### Global Options

All [individual options](#individual-options) can be overridden in the global
options to affect all toasts. In addition, global options include the following
options:

| Option                  | Type    | Default                            | Description                                                                                                   |
| ----------------------- | ------- | ---------------------------------- | ------------------------------------------------------------------ |
| maxOpened               | number  | 0                                  | Max toasts opened. Toasts will be queued. 0 is unlimited           |
| autoDismiss             | boolean | false                              | Dismiss current toast when max is reached                          |
| iconClasses             | object  | [see below](#iconclasses-defaults) | Classes used on toastr service methods                             |
| preventDuplicates       | boolean | false                              | Block duplicate messages                                           |
| countDuplicates         | boolean | false                              | Displays a duplicates counter (preventDuplicates must be true). Toast must have a title and duplicate message |
| resetTimeoutOnDuplicate | boolean | false                              | Reset toast timeout on duplicate (preventDuplicates must be true)  |
| includeTitleDuplicates  | boolean | false                              | Include the title of a toast when checking for duplicates (by default only message is compared) |

##### iconClasses defaults

```typescript
iconClasses = {
  error: 'toast-error',
  info: 'toast-info',
  success: 'toast-success',
  warning: 'toast-warning',
};
```

#### Setting Global Options

Pass values to `provideToastr()` to set global options.

```typescript
import { AppComponent } from './src/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from '@iqx-limited/ngx-toastr';

bootstrapApplication(AppComponent, {
  providers: [
    provideToastr({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ]
});
```


### Toastr Service methods return:

```typescript
export interface ActiveToast {
  /** Your Toast ID. Use this to close it individually */
  toastId: number;
  /** the title of your toast. Stored to prevent duplicates if includeTitleDuplicates set */
  title: string;
  /** the message of your toast. Stored to prevent duplicates */
  message: string;
  /** a reference to the component see portal.ts */
  portal: ComponentRef<any>;
  /** a reference to your toast */
  toastRef: ToastRef<any>;
  /** triggered when toast is active */
  onShown: Observable<any>;
  /** triggered when toast is destroyed */
  onHidden: Observable<any>;
  /** triggered on toast click */
  onTap: Observable<any>;
  /** available for your use in custom toast */
  onAction: Observable<any>;
}
```

### Put toasts in your own container

Put toasts in a specific div inside your application. This should probably be
somewhere that doesn't get deleted. Make sure that your container has
an `aria-live="polite"` attribute, so that any time a toast is injected into
the container it is announced by screen readers.

Add a div with `toastContainer` directive on it.

```typescript
import { Component, OnInit, ViewChild } from '@angular/core';

import { ToastContainerDirective, ToastrService } from '@iqx-limited/ngx-toastr';

@Component({
  selector: 'app-root',
  template: `
    <h1><a (click)="onClick()">Click</a></h1>
    <div aria-live="polite" toastContainer></div>
  `,
})
export class AppComponent implements OnInit {
  @ViewChild(ToastContainerDirective, { static: true })
  toastContainer: ToastContainerDirective;

  constructor(private toastrService: ToastrService) {}
  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer;
  }
  onClick() {
    this.toastrService.success('in div');
  }
}
```

## Functions

##### Clear

Remove all or a single toast by optional id

```ts
toastrService.clear(toastId?: number);
```

##### Remove

Remove and destroy a single toast by id

```
toastrService.remove(toastId: number);
```

## SystemJS

If you are using SystemJS, you should also adjust your configuration to point to
the UMD bundle.

In your SystemJS config file, `map` needs to tell the System loader where to
look for `ngx-toastr`:

```js
map: {
  'ngx-toastr': 'node_modules/ngx-toastr/bundles/ngx-toastr.umd.min.js',
}
```

## Using A Custom Toast

Create your toast component extending Toast see the demo's pink toast for an example
https://github.com/IQXLimited/ngx-toastr/blob/master/src/app/pink.toast.ts

```typescript
import { ToastrModule } from '@iqx-limited/ngx-toastr';

@NgModule({
  imports: [
    ToastrModule.forRoot({
      toastComponent: YourToastComponent, // added custom toast!
    }),
  ],
  bootstrap: [App],
  declarations: [App, YourToastComponent], // add!
})
class AppModule {}
```

## License

MIT
