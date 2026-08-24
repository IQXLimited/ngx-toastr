> **Note:** This repository is a fork of [ngx-toastr](https://github.com/scttcper/ngx-toastr). It builds upon the original project to provide additional features, fixes, and customizations.

-------------------------------------------------------------------------------

<div align="center">
  <img src="https://raw.githubusercontent.com/IQXLimited/ngx-toastr/master/misc/documentation-assets/ngx-toastr-example.png" width="300" alt="Angular Toastr">
  <br>
  <h1>@iqx-limited/ngx-toastr</h1>
  <br>
  <a href="https://www.npmjs.com/package/@iqx-limited/ngx-toastr">
    <img src="https://badge.fury.io/js/@iqx-limited%2Fngx-toastr.svg" alt="npm">
  <br>
  <br>
</div>

DEMO: https://iqxlimited.github.io/ngx-toastr/

## Features

- Toast component injection without being passed `ViewContainerRef`
- AoT compilation and lazy loading compatible
- Component inheritance for custom toasts
- Animations using pure CSS transitions
- Output toasts to an optional target directive
- Zoneless Angular compatible

See [CHANGELOG.md](./CHANGELOG.md) for 3.x migration notes.

## Dependencies

| ngx-toastr | Angular |
| ---------- | ------- |
| 1.x        | 20.x    |
| 2.x        | 21.x    |
| 3.x        | 22.x    |

Peer dependencies: `@angular/core`, `@angular/common`, and `@angular/platform-browser` >= 20.

## Install

```bash
npm install @iqx-limited/ngx-toastr
```

## Setup

### Step 1: Add styles

**Option A — import in global styles (recommended)**

```scss
// Default toast styles — use the package export path, not node_modules/
@import "@iqx-limited/ngx-toastr/toastr";

// Optional: Bootstrap alert-style toast (SASS only)
// Import after your Bootstrap functions, variables, and mixins
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/mixins";
@import "@iqx-limited/ngx-toastr/toastr-bs-alert";
```

**Option B — add to `angular.json`**

```json
"styles": [
  "src/styles.scss",
  "node_modules/@iqx-limited/ngx-toastr/toastr.css"
]
```

Published style exports (files ship at the package root):

| Import path | Resolves to |
| ----------- | ----------- |
| `@iqx-limited/ngx-toastr/toastr` | `toastr.css` |
| `@iqx-limited/ngx-toastr/toastr.css` | `toastr.css` |
| `@iqx-limited/ngx-toastr/toastr-bs-alert` | `toastr-bs-alert.scss` |
| `@iqx-limited/ngx-toastr/toastr-bs-alert.scss` | `toastr-bs-alert.scss` |

### Step 2: Add providers

```typescript
import { bootstrapApplication } from "@angular/platform-browser"
import { AppComponent } from "./app/app.component"
import { provideToastr } from "@iqx-limited/ngx-toastr"

bootstrapApplication(AppComponent, {
  providers: [
    provideToastr(),
  ],
})
```

For toasts without CSS enter/exit animations (uses `display: none` instead):

```typescript
import { provideToastrNoAnimation } from "@iqx-limited/ngx-toastr"

bootstrapApplication(AppComponent, {
  providers: [
    provideToastrNoAnimation(),
  ],
})
```

## Use

```typescript
import { Component, inject } from "@angular/core"
import { ToastrService } from "@iqx-limited/ngx-toastr"

@Component({
  selector: "app-example",
  template: `<button (click)="showSuccess()">Show toast</button>`,
})
export class ExampleComponent {
  private readonly toastr = inject(ToastrService)

  showSuccess() {
    this.toastr.success("Hello world!", "Toastr fun!")
  }
}
```

## Options

There are **individual options** and **global options**.

### Individual options

Passed to `ToastrService.success()`, `error()`, `warning()`, `info()`, or `show()`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| toastComponent | `Component` | `Toast` | Angular component used to render the toast |
| closeButton | `boolean` | `false` | Show close button |
| timeOut | `number` | `5000` | Time to live in milliseconds |
| extendedTimeOut | `number` | `1000` | Time to close after hover ends |
| disableTimeOut | `boolean \| 'timeOut' \| 'extendedTimeOut'` | `false` | Disable timeout behaviour |
| easing | `string` | `'ease-in'` | CSS easing for animated toasts |
| easeTime | `string \| number` | `300` | CSS transition duration (ms) |
| enableHtml | `boolean` | `false` | Allow HTML in message (sanitized) |
| newestOnTop | `boolean` | `true` | Insert new toasts at the top |
| progressBar | `boolean` | `false` | Show progress bar |
| progressAnimation | `'decreasing' \| 'increasing'` | `'decreasing'` | Progress bar direction |
| toastClass | `string` | `'ngx-toastr'` | CSS class on toast element |
| positionClass | `string` | `'toast-top-right'` | CSS class on toast container |
| titleClass | `string` | `'toast-title'` | CSS class on title |
| messageClass | `string` | `'toast-message'` | CSS class on message |
| tapToDismiss | `boolean` | `true` | Close on click |
| onActivateTick | `boolean` | `false` | Call `ApplicationRef.tick()` when a no-animation toast activates |

#### Setting individual options

```typescript
this.toastr.error("everything is broken", "Major Error", {
  timeOut: 3000,
})
```

### Global options

All [individual options](#individual-options) can be set globally via `provideToastr()` / `provideToastrNoAnimation()`.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| maxOpened | `number` | `0` | Max open toasts (0 = unlimited) |
| autoDismiss | `boolean` | `false` | Dismiss oldest toast when max is reached |
| iconClasses | `object` | [see below](#iconclasses-defaults) | CSS classes per toast type |
| preventDuplicates | `boolean` | `false` | Block duplicate messages |
| countDuplicates | `boolean` | `false` | Show duplicate counter |
| resetTimeoutOnDuplicate | `boolean` | `false` | Reset timeout on duplicate |
| includeTitleDuplicates | `boolean` | `false` | Compare title when checking duplicates |

##### iconClasses defaults

```typescript
iconClasses = {
  error: "toast-error",
  info: "toast-info",
  success: "toast-success",
  warning: "toast-warning",
}
```

#### Setting global options

```typescript
import { bootstrapApplication } from "@angular/platform-browser"
import { provideToastr } from "@iqx-limited/ngx-toastr"
import { AppComponent } from "./app/app.component"

bootstrapApplication(AppComponent, {
  providers: [
    provideToastr({
      timeOut: 10000,
      positionClass: "toast-bottom-right",
      preventDuplicates: true,
    }),
  ],
})
```

### Toastr service return value

```typescript
export interface ActiveToast<C = unknown> {
  toastId: number
  title: string
  message: string
  portal: ComponentRef<C>
  toastRef: ToastRef<C>
  onShown: Observable<void>
  onHidden: Observable<void>
  onTap: Observable<void>
  onAction: Observable<unknown>
}
```

## Custom toast components

Extend `Toast` (animated) or `NoAnimationToast` and pass your component via `toastComponent`:

```typescript
import { Component } from "@angular/core"
import { Toast, ToastrService } from "@iqx-limited/ngx-toastr"

@Component({
  selector: "[my-toast-component]",
  template: `
    <div>{{ title }} — {{ message }}</div>
    <button (click)="remove()">Close</button>
  `,
})
export class MyToast extends Toast {
  // ToastrService and ToastPackage are available on the base class
}
```

```typescript
this.toastr.show("Saved!", "Done", {
  toastComponent: MyToast,
})
```

> **Note:** `ToastNoAnimation` is deprecated. Use `NoAnimationToast` instead (the alias remains exported for backwards compatibility).

## Custom toast container

Place toasts inside a specific element using the `toastContainer` directive. The container should have `aria-live="polite"`.

```typescript
import { Component, inject, OnInit, ViewChild } from "@angular/core"
import { ToastContainerDirective, ToastrService } from "@iqx-limited/ngx-toastr"

@Component({
  selector: "app-root",
  template: `
    <button (click)="onClick()">Show toast</button>
    <div aria-live="polite" toastContainer></div>
  `,
})
export class AppComponent implements OnInit {
  @ViewChild(ToastContainerDirective, { static: true })
  toastContainer!: ToastContainerDirective

  private readonly toastrService = inject(ToastrService)

  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer
  }

  onClick() {
    this.toastrService.success("in div")
  }
}
```

## API

### Clear

Remove all toasts, or a single toast by id:

```typescript
toastrService.clear()
toastrService.clear(toastId)
```

### Remove

Remove and destroy a single toast by id:

```typescript
toastrService.remove(toastId)
```

## Development

This repo is an Angular workspace with two projects:

| Project | Path | Purpose |
| ------- | ---- | ------- |
| Library | `projects/ngx-toastr/` | Published npm package (`@iqx-limited/ngx-toastr`) |
| Demo | `projects/demo/` | GitHub Pages demo app |

```bash
npm ci
npm run build          # Build library → dist/
npm start              # Serve demo at http://localhost:4200
npm run demo:build     # Build demo → dist-demo/
npm test               # tsc-verify + unit tests
npm run lint           # ESLint
```

The library `package.json` at `projects/ngx-toastr/package.json` is synced from the root manifest before each build via `npm run sync-package`.

## License

MIT
