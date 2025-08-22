import { DefaultNoComponentGlobalConfig, GlobalConfig, TOAST_CONFIG } from './toastr-config';
import { EnvironmentProviders, makeEnvironmentProviders, Provider } from '@angular/core';
import { Toast } from './toast.component';
import { DefaultNoAnimationsGlobalConfig, ToastNoAnimation } from './toast-noanimation.component';

export const DefaultGlobalConfig: GlobalConfig = {
  ...DefaultNoComponentGlobalConfig,
  toastComponent: Toast,
};

/**
 * @description
 * Provides the `TOAST_CONFIG` token with the given config.
 *
 * @param config The config to configure toastr.
 * @returns The environment providers.
 *
 * @example
 * ```ts
 * import { provideToastr } from 'ngx-toastr';
 *
 * bootstrap(AppComponent, {
 *   providers: [
 *     provideToastr({
 *       timeOut: 2000,
 *       positionClass: 'toast-top-right',
 *     }),
 *   ],
 * })
 */
export const provideToastr = (config: Partial<GlobalConfig> = {}): EnvironmentProviders => {
  const providers: Provider[] = [
    {
      provide: TOAST_CONFIG,
      useValue: {
        default: DefaultGlobalConfig,
        config,
      }
    }
  ];

  return makeEnvironmentProviders(providers);
};

/**
*  @description
*  Provides the `TOAST_CONFIG` token without animations.
*
* @param config The config to configure toastr.
* @returns The environment providers.
*
* @example
* ```ts
* import { provideToastrNoAnimation } from 'ngx-toastr';
*
* bootstrap(AppComponent, {
*   providers: [
*     provideToastrNoAnimation({
*       timeOut: 2000,
*       positionClass: 'toast-top-right',
*     }),
*   ],
* })
* ```
*/

export function provideToastrNoAnimation(config: Partial<GlobalConfig> = {}) {
  return makeEnvironmentProviders([
    ToastNoAnimation,
    {
      provide: TOAST_CONFIG,
      useValue: {
        default: DefaultNoAnimationsGlobalConfig,
        config,
      },
    },
  ])
}