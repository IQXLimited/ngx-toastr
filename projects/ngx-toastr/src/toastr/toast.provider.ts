import { EnvironmentProviders, makeEnvironmentProviders, Provider } from "@angular/core"

import { DefaultNoComponentGlobalConfig, GlobalConfig, TOAST_CONFIG } from "./toastr-config"
import { Toast } from "./toast.component"
import { DefaultNoAnimationsGlobalConfig } from "./toast-noanimation.component"

export const DefaultGlobalConfig: GlobalConfig = {
  ...DefaultNoComponentGlobalConfig,
  toastComponent: Toast,
}

/**
 * @description
 * Provides the `TOAST_CONFIG` token with the given config.
 */
export const provideToastr = ( config: Partial<GlobalConfig> = {} ): EnvironmentProviders => {
  const providers: Provider[] = [
    {
      provide: TOAST_CONFIG,
      useValue: {
        default: DefaultGlobalConfig,
        config,
      },
    },
  ]

  return makeEnvironmentProviders ( providers )
}

/**
 * @description
 * Provides the `TOAST_CONFIG` token without CSS animations.
 */
export const provideToastrNoAnimation = ( config: Partial<GlobalConfig> = {} ): EnvironmentProviders => {
  return makeEnvironmentProviders ( [
    {
      provide: TOAST_CONFIG,
      useValue: {
        default: DefaultNoAnimationsGlobalConfig,
        config,
      },
    },
  ] )
}
