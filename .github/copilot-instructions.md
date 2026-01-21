# ngx-toastr Angular Library

**ngx-toastr** is an Angular 21.x library that provides customizable toast notifications. It's a fork of the original ngx-toastr with additional features and fixes. The project includes both the library source code and a demo application showcasing its capabilities.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Essential Setup Commands
- **Install Node.js 22**: Required version specified in `.nvmrc`
- **Install dependencies**: `PUPPETEER_SKIP_DOWNLOAD=true npm ci` -- takes 8 seconds. NEVER CANCEL.
  - **CRITICAL**: Must use `PUPPETEER_SKIP_DOWNLOAD=true` due to network restrictions in sandboxed environments
  - Without this flag, puppeteer installation will fail with ENOTFOUND error
- **Build library**: `npm run build` -- takes 4 seconds. Uses ng-packagr.
- **Build demo application**: `npm run demo:build` -- takes 10 seconds. NEVER CANCEL. Set timeout to 30+ minutes for safety.
- **Start development server**: `npm start` -- build takes 9 seconds, then serves on http://localhost:4200/
- **Lint code**: `npm run lint` -- takes 3 seconds. Uses ESLint.

### Testing Status
- **Unit tests are working** with zoneless Angular setup properly configured
- Tests use `provideZonelessChangeDetection()` and run successfully
- Run tests with: `npm test` (local) or `npm run test:ci` (CI with coverage)
- Tests are configured in `karma.conf.js` with ChromeHeadlessCustom browser for CI
- 13/14 tests pass (1 failure is network-related due to GitHub API calls in headless environment)

## Project Structure

### Key Directories
- **`src/lib/`**: Core library source code
  - `toastr/`: Main toast service, components, and configuration
  - `overlay/`: Overlay system for positioning toasts  
  - `portal/`: Component rendering system
  - `public_api.ts`: Library public API exports
- **`src/app/`**: Demo application
  - `home/`: Main demo component with toast examples
  - `header/`, `footer/`: Layout components
  - Custom toast examples: `pink.toast.ts`, `notyf.toast.ts`, `bootstrap.toast.ts`
- **`dist/`**: Build output directory
  - Library build: Angular package with TypeScript definitions
  - Demo build: Static website deployable to GitHub Pages

### Important Files
- **`package.json`**: Contains all npm scripts and dependencies
- **`angular.json`**: Angular CLI configuration for builds and testing
- **`src/lib/ng-package.json`**: Library build configuration for ng-packagr
- **`.nvmrc`**: Specifies Node.js 22 requirement
- **`src/main.ts`**: Demo app bootstrap with zoneless Angular setup

## Validation

### Manual Testing Workflow
1. **ALWAYS run the complete setup first**:
   ```bash
   PUPPETEER_SKIP_DOWNLOAD=true npm ci
   npm run build
   npm start
   ```
2. **Test toast functionality**: Open http://localhost:4200/ in browser
   - Click "Show Toast" buttons to verify different toast types
   - Test configuration options (timeout, position, styling)
   - Verify custom toast components (Pink, Notyf, Bootstrap themes)
   - Test duplicate prevention and toast queueing
3. **Validate library build**: Check `dist/` contains package.json, TypeScript definitions, CSS files
4. **Always run linting**: `npm run lint` before making changes

### Build Validation
- **Library build**: Creates publishable npm package in `dist/`
- **Demo build**: Creates static site in `dist/browser/` for GitHub Pages deployment
- **Development mode**: Hot reloading works correctly for live development

## Common Tasks

### Making Changes to Library Code
1. Edit files in `src/lib/`
2. Run `npm run build` to rebuild library
3. Test changes with `npm start` and manual validation  
4. Run `npm run lint` to check code style
5. Run `npm test` or `npm run test:ci` to validate changes with tests

### Making Changes to Demo Application  
1. Edit files in `src/app/`
2. If dev server is running, changes auto-reload
3. Otherwise run `npm start` to see changes
4. Test functionality manually in browser

### Publishing Workflow
1. Build library: `npm run build`
2. Build demo: `npm run demo:build`  
3. Deploy demo via GitHub Actions workflow in `.github/workflows/build_deploy_gh_pages.yml`

### Available npm Scripts
- `npm start` or `ng serve`: Start development server
- `npm run build`: Build Angular library package
- `npm run demo:build`: Build demo application for GitHub Pages
- `npm run lint`: Run ESLint on TypeScript and HTML files  
- `npm run lint:fix`: Auto-fix ESLint issues where possible
- `npm run test`: Run tests locally (13/14 tests pass)
- `npm run test:watch`: Run tests in watch mode
- `npm run test:ci`: Run tests with coverage for CI (headless Chrome)

## Reference Information

The following are outputs from frequently run commands. Reference them instead of viewing, searching, or running bash commands to save time.

### Repository Root
```
ls -la [repo-root]
.codecov.yml
.editorconfig  
.eslintrc.json
.git
.github
.gitignore
.nvmrc              # Contains "22" - Node.js version requirement
.prettierrc
LICENSE
README.md           # Comprehensive library documentation
angular.json        # Angular CLI configuration
karma.conf.js       # Test configuration
misc/               # Documentation assets
node_modules/       # Dependencies (after npm ci)
package-lock.json   # Lockfile for exact dependency versions  
package.json        # Project metadata and scripts
src/                # Source code
tsconfig.*.json     # TypeScript configurations
vercel.json         # Vercel deployment config
```

### Source Directory Structure
```
src/
├── app/              # Demo application
│   ├── home/         # Main demo component  
│   ├── header/       # Layout header
│   ├── footer/       # Layout footer
│   ├── pink.toast.ts    # Custom pink toast example
│   ├── notyf.toast.ts   # Notyf-style toast example
│   └── bootstrap.toast.ts # Bootstrap-style toast
├── lib/              # Core library code
│   ├── toastr/       # Main toast components and service
│   ├── overlay/      # Positioning system
│   ├── portal/       # Component rendering
│   └── public_api.ts # Library exports
├── environments/     # Environment configurations
├── assets/          # Static assets
├── main.ts          # Demo app bootstrap (zoneless Angular)
├── index.html       # Demo app HTML template
├── styles.scss      # Global demo app styles
└── test.ts          # Test environment setup
```

## Key Features to Test

### Core Toast Types
- Success, Error, Warning, Info toasts
- Custom toast components (Pink, Notyf, Bootstrap styles)
- HTML content support with `enableHtml: true`

### Configuration Options  
- **Positioning**: toast-top-right, toast-bottom-left, etc.
- **Timing**: timeOut, extendedTimeOut, disableTimeOut options
- **Behavior**: preventDuplicates, maxOpened, autoDismiss
- **Styling**: progressBar, closeButton, custom CSS classes

### Interactive Features
- Click to dismiss (tapToDismiss)
- Hover to extend timeout
- Progress bar animations
- Toast container targeting

## Troubleshooting

### Common Issues
- **Puppeteer download fails**: Always use `PUPPETEER_SKIP_DOWNLOAD=true npm ci`
- **Tests mostly pass**: 13/14 tests pass, 1 network-related failure in headless environment is expected
- **Development server won't start**: Check Node.js version (must be 22) and run full setup
- **Library build fails**: Ensure all dependencies installed and no TypeScript errors

### Build Time Expectations
- **npm ci**: 8 seconds
- **Library build**: 4 seconds  
- **Demo build**: 10 seconds
- **Dev server startup**: 9 seconds
- **Linting**: 3 seconds

### GitHub Actions
- **Deployment**: Automatic deployment to GitHub Pages on push to master branch
- **Build process**: Uses Node.js 20, runs `npm ci`, `npm run demo:build`
- **Pages URL**: https://iqxlimited.github.io/ngx-toastr/