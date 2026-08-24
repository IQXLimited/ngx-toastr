# ngx-toastr Angular Library

**@m-f-1998/ngx-toastr** is an Angular toast notification library (currently targeting Angular 22.x). The repository is an Angular workspace containing the publishable library and a demo application.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Essential setup commands

- **Install dependencies**: `PUPPETEER_SKIP_DOWNLOAD=true npm ci`
  - Use `PUPPETEER_SKIP_DOWNLOAD=true` in CI/sandboxed environments to skip Puppeteer browser download
- **Build library**: `npm run build` — outputs publishable package to `dist/` via ng-packagr
- **Build demo**: `npm run demo:build` — outputs static site to `dist-demo/browser/` for GitHub Pages
- **Start dev server**: `npm start` — runs `ng serve demo` at http://localhost:4200/
- **Lint**: `npm run lint` — ESLint via `eslint.config.mjs`
- **Test**: `npm test` — runs `tsc-verify` then Karma unit tests (33 tests)
- **CI tests**: `npm run test:ci` — headless Chrome with code coverage

Node version is pinned via Volta in `package.json` (`node`: 24.x).

## Project structure

### Workspace layout

```
projects/
├── ngx-toastr/          # Publishable library (@m-f-1998/ngx-toastr)
│   ├── ng-package.json  # ng-packagr config
│   ├── package.json     # npm manifest (synced from root before build)
│   └── src/
│       ├── public_api.ts
│       ├── toastr.css
│       ├── toastr-bs-alert.scss
│       ├── toastr/      # Service, components, config, providers
│       ├── overlay/     # Overlay positioning
│       └── portal/      # Dynamic component rendering
└── demo/                # GitHub Pages demo app
    └── src/
        ├── app/         # Demo components
        ├── testing/     # Library unit tests (discovered via src/**/*.spec.ts)
        ├── main.ts
        └── styles.scss
```

### Build outputs

| Command | Output | Purpose |
| ------- | ------ | ------- |
| `npm run build` | `dist/` | npm package |
| `npm run demo:build` | `dist-demo/browser/` | GitHub Pages |

Do not conflate the two — they use separate output directories.

### Important files

- `package.json` — root workspace scripts and devDependencies
- `projects/ngx-toastr/package.json` — published package metadata (version synced pre-build)
- `projects/ngx-toastr/ng-package.json` — library entry point and asset config
- `angular.json` — `demo` application project config
- `scripts/sync-lib-package.mjs` — syncs name/version/repository from root → library package.json
- `eslint.config.mjs` — ESLint flat config (stylistic rules aligned with other Angular projects)
- `karma.conf.js` — Karma config; coverage via `karma-coverage` + Angular CLI `--code-coverage`

## Validation

### Standard workflow

```bash
PUPPETEER_SKIP_DOWNLOAD=true npm ci
npm run lint
npm run build
npm test
npm start   # manual demo validation
```

### Manual demo checks

- Toast types: success, error, warning, info
- No-animation toasts
- No-animation toasts via `openToastNoAnimation()`
- Duplicate prevention, progress bar, inline container

## Common tasks

### Library changes

1. Edit files under `projects/ngx-toastr/src/`
2. `npm run build`
3. `npm test` and `npm run lint`
4. Library tests live in `projects/demo/src/testing/` (co-located with demo workspace for Karma discovery)

### Demo changes

1. Edit files under `projects/demo/src/`
2. `npm start` for live reload, or `npm run demo:build` for production build

### Publishing

Handled by `.github/workflows/ci-cd.yml` on merge to `master`:

1. CI runs lint, tests, library build
2. Version bump + `npm run sync-package`
3. `npm publish ./dist`
4. Demo deploys to GitHub Pages from `dist-demo/browser/` when demo files change

## Key API surface

### Providers

- `provideToastr(config?)` — default animated `Toast` component
- `provideToastrNoAnimation(config?)` — uses `NoAnimationToast` (alias: deprecated `ToastNoAnimation`)

### Exports

- `ToastrService`, `Toast`, `NoAnimationToast`, `ToastContainerDirective`
- `ToastRef`, `ActiveToast`, `GlobalConfig`, `IndividualConfig`
- Style exports: `@m-f-1998/ngx-toastr/toastr`, `@m-f-1998/ngx-toastr/toastr-bs-alert`

## npm scripts

| Script | Description |
| ------ | ----------- |
| `npm start` | `ng serve demo` |
| `npm run build` | Build library to `dist/` |
| `npm run demo:build` | Build demo to `dist-demo/` |
| `npm run sync-package` | Sync root metadata to `projects/ngx-toastr/package.json` |
| `npm run lint` / `lint:fix` | ESLint |
| `npm test` | `tsc-verify` + unit tests |
| `npm run test:ci` | CI tests with coverage (ChromeHeadlessCustom) |
| `npm run tsc-verify` | TypeScript check without emit |

## Troubleshooting

- **Puppeteer install fails**: use `PUPPETEER_SKIP_DOWNLOAD=true npm ci`
- **Library vs demo output clash**: library → `dist/`, demo → `dist-demo/` — never the same path
- **Tests not finding library specs**: they must live under `projects/demo/src/testing/`
- **Style import in demo**: `@import "toastr"` with `includePaths: ["projects/ngx-toastr/src"]` in `angular.json`
