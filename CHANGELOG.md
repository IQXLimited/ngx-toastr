# Changelog

## 4.0.1

### Fixes

- Style assets (`toastr.css`, `toastr-bs-alert.scss`) now ship at the package root so `node_modules/@iqx-limited/ngx-toastr/toastr.css` and package export paths resolve correctly
- Added explicit `./toastr.css` and `./toastr-bs-alert.scss` export entries

## 4.0.0

### Breaking changes

- Removed Bootstrap 4 styles (`toastr-bs4-alert`)
- Removed legacy `toastr-old.css` export
- Renamed `toastr-bs5-alert` to `toastr-bs-alert`
- Removed deprecated config type aliases (`GlobalToastrConfig`, `IndividualToastrConfig`, `ToastrConfig`)
- Library source moved to `projects/ngx-toastr/`
- Demo app moved to `projects/demo/`
- Demo build output moved to `dist-demo/` (library continues to publish from `dist/`)
- `provideToastrNoAnimation()` no longer registers `ToastNoAnimation` as a redundant provider
- Renamed `ToastNoAnimation` class to `NoAnimationToast` (`ToastNoAnimation` export kept as deprecated alias)

### Fixes

- Fixed `NoAnimationToast` hover behaviour when `disableTimeOut: 'extendedTimeOut'`
- Fixed `ToastRef.close()` completing subjects that `manualClose()` had already closed
- Fixed `ApplicationRef` destroyed warning when `onActivateTick` runs after test/app teardown

### Improvements

- Extracted shared toast logic into `ToastBaseDirective`
- Added unit tests for `Toast`, `NoAnimationToast`, and `ToastRef`
- Aligned ESLint config and code style with other Angular projects
- Added `prebuild` package.json sync for library manifest metadata
- Updated repository URL to `IQXLimited/ngx-toastr`
- Fixed Sass `mixed-decls` and `color-functions` deprecations in demo styles
- Improved Karma coverage reporting via Angular CLI
- CHANGELOG included in npm package
- Documentation updated for 3.x workspace layout and API changes

### Migration guide (2.x → 3.x)

**Style imports**

```scss
// Before
@import 'ngx-toastr/toastr-bs4-alert';
@import 'ngx-toastr/toastr-bs5-alert';
@import 'ngx-toastr/toastr-old';

// After
@import '@iqx-limited/ngx-toastr/toastr';
@import '@iqx-limited/ngx-toastr/toastr-bs-alert';
```

**Types**

```typescript
// Before
import { GlobalToastrConfig, IndividualToastrConfig } from '@iqx-limited/ngx-toastr'

// After
import { GlobalConfig, IndividualConfig } from '@iqx-limited/ngx-toastr'
```

**No-animation toast component**

```typescript
// Before
import { ToastNoAnimation } from '@iqx-limited/ngx-toastr'

// After (preferred)
import { NoAnimationToast } from '@iqx-limited/ngx-toastr'

// Still works (deprecated alias)
import { ToastNoAnimation } from '@iqx-limited/ngx-toastr'
```

**angular.json styles**

```json
// Before
"node_modules/ngx-toastr/toastr.css"

// After
"node_modules/@iqx-limited/ngx-toastr/toastr.css"
```
