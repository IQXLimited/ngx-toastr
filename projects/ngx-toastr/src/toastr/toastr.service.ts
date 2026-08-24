import { ComponentRef, inject, Service, Injector, SecurityContext } from "@angular/core"
import { DomSanitizer } from "@angular/platform-browser"

import { Observable } from "rxjs"

import { Overlay } from "../overlay/overlay"
import { ComponentPortal } from "../portal/portal"
import { ToastContainerDirective } from "./toast.directive"
import { ToastRef } from "./toast-ref"
import {
  GlobalConfig,
  IndividualConfig,
  ToastPackage,
  ToastToken,
  TOAST_CONFIG,
} from "./toastr-config"

export interface ActiveToast<C> {
  /** Your Toast ID. Use this to close it individually */
  toastId: number
  /** the title of your toast. Stored to prevent duplicates */
  title: string
  /** the message of your toast. Stored to prevent duplicates */
  message: string
  /** a reference to the component see portal.ts */
  portal: ComponentRef<C>
  /** a reference to your toast */
  toastRef: ToastRef<C>
  /** triggered when toast is active */
  onShown: Observable<void>
  /** triggered when toast is destroyed */
  onHidden: Observable<void>
  /** triggered on toast click */
  onTap: Observable<void>
  /** available for your use in custom toast */
  onAction: Observable<unknown>
}

@Service (  )
export class ToastrService {
  public toastrConfig: GlobalConfig
  public currentlyActive = 0
  public toasts: ActiveToast<unknown>[] = []
  public overlayContainer?: ToastContainerDirective
  public previousToastMessage: string | undefined

  public readonly token: ToastToken = inject ( TOAST_CONFIG )

  private index = 0
  private readonly overlay: Overlay = inject ( Overlay )
  private readonly sanitizer: DomSanitizer = inject ( DomSanitizer )
  private readonly injector: Injector = inject ( Injector )

  public constructor () {
    this.toastrConfig = {
      ...this.token.default,
      ...this.token.config,
    }

    if ( this.token.config.iconClasses ) {
      this.toastrConfig.iconClasses = {
        ...this.token.default.iconClasses,
        ...this.token.config.iconClasses,
      }
    }
  }

  /** show toast */
  public show<ConfigPayload = unknown> (
    message?: string,
    title?: string,
    override: Partial<IndividualConfig<ConfigPayload>> = {},
    type = "",
  ): ActiveToast<unknown> | null {
    return this.buildNotification ( type, message, title, this.applyConfig ( override ) )
  }

  /** show successful toast */
  public success<ConfigPayload = unknown> (
    message?: string,
    title?: string,
    override: Partial<IndividualConfig<ConfigPayload>> = {},
  ): ActiveToast<unknown> | null {
    const type = this.toastrConfig.iconClasses.success || ""
    return this.buildNotification ( type, message, title, this.applyConfig ( override ) )
  }

  /** show error toast */
  public error<ConfigPayload = unknown> (
    message?: string,
    title?: string,
    override: Partial<IndividualConfig<ConfigPayload>> = {},
  ): ActiveToast<unknown> | null {
    const type = this.toastrConfig.iconClasses.error || ""
    return this.buildNotification ( type, message, title, this.applyConfig ( override ) )
  }

  /** show info toast */
  public info<ConfigPayload = unknown> (
    message?: string,
    title?: string,
    override: Partial<IndividualConfig<ConfigPayload>> = {},
  ): ActiveToast<unknown> | null {
    const type = this.toastrConfig.iconClasses.info || ""
    return this.buildNotification ( type, message, title, this.applyConfig ( override ) )
  }

  /** show warning toast */
  public warning<ConfigPayload = unknown> (
    message?: string,
    title?: string,
    override: Partial<IndividualConfig<ConfigPayload>> = {},
  ): ActiveToast<unknown> | null {
    const type = this.toastrConfig.iconClasses.warning || ""
    return this.buildNotification ( type, message, title, this.applyConfig ( override ) )
  }

  /** Remove all or a single toast by id */
  public clear ( toastId?: number ): void {
    for ( const toast of this.toasts ) {
      if ( toastId !== undefined ) {
        if ( toast.toastId === toastId ) {
          toast.toastRef.manualClose ()
          return
        }
      } else {
        toast.toastRef.manualClose ()
      }
    }
  }

  /** Remove and destroy a single toast by id */
  public remove ( toastId: number ): boolean {
    const found = this.findToast ( toastId )
    if ( !found ) {
      return false
    }

    found.activeToast.toastRef.close ()
    this.toasts.splice ( found.index, 1 )
    this.currentlyActive = this.currentlyActive - 1

    if ( !this.toastrConfig.maxOpened || !this.toasts.length ) {
      return false
    }

    if ( this.currentlyActive < this.toastrConfig.maxOpened && this.toasts[this.currentlyActive] ) {
      const toastRef = this.toasts[this.currentlyActive].toastRef
      if ( !toastRef.isInactive () ) {
        this.currentlyActive = this.currentlyActive + 1
        toastRef.activate ()
      }
    }

    return true
  }

  /** Determines if toast message is already shown */
  public findDuplicate (
    title = "",
    message = "",
    resetOnDuplicate: boolean,
    countDuplicates: boolean,
  ): ActiveToast<unknown> | null {
    const { includeTitleDuplicates } = this.toastrConfig

    for ( const toast of this.toasts ) {
      const hasDuplicateTitle = includeTitleDuplicates && toast.title === title
      if ( ( !includeTitleDuplicates || hasDuplicateTitle ) && toast.message === message ) {
        toast.toastRef.onDuplicate ( resetOnDuplicate, countDuplicates )
        return toast
      }
    }

    return null
  }

  private applyConfig ( override: Partial<IndividualConfig> = {} ): GlobalConfig {
    return { ...this.toastrConfig, ...override }
  }

  private findToast ( toastId: number ): { index: number; activeToast: ActiveToast<unknown> } | null {
    for ( let i = 0; i < this.toasts.length; i++ ) {
      if ( this.toasts[i].toastId === toastId ) {
        return { index: i, activeToast: this.toasts[i] }
      }
    }

    return null
  }

  private buildNotification (
    toastType: string,
    message: string | undefined,
    title: string | undefined,
    config: GlobalConfig,
  ): ActiveToast<unknown> | null {
    if ( !config.toastComponent ) {
      throw new Error ( "toastComponent required" )
    }

    const duplicate = this.findDuplicate (
      title,
      message,
      this.toastrConfig.resetTimeoutOnDuplicate && config.timeOut > 0,
      this.toastrConfig.countDuplicates,
    )

    if (
      ( ( this.toastrConfig.includeTitleDuplicates && title ) || message ) &&
      this.toastrConfig.preventDuplicates &&
      duplicate !== null
    ) {
      return duplicate
    }

    this.previousToastMessage = message
    let keepInactive = false

    if ( this.toastrConfig.maxOpened && this.currentlyActive >= this.toastrConfig.maxOpened ) {
      keepInactive = true
      if ( this.toastrConfig.autoDismiss ) {
        this.clear ( this.toasts[0].toastId )
      }
    }

    const overlayRef = this.overlay.create ( config.positionClass, this.overlayContainer )
    this.index = this.index + 1

    let sanitizedMessage: string | undefined | null = message
    if ( message && config.enableHtml ) {
      sanitizedMessage = this.sanitizer.sanitize ( SecurityContext.HTML, message )
    }

    const toastRef = new ToastRef ( overlayRef )
    const toastPackage = new ToastPackage (
      this.index,
      config,
      sanitizedMessage,
      title,
      toastType,
      toastRef,
    )

    const toastInjector = Injector.create ( {
      providers: [ { provide: ToastPackage, useValue: toastPackage } ],
      parent: this.injector,
    } )

    const component = new ComponentPortal ( config.toastComponent, toastInjector )
    const portal = overlayRef.attach ( component, config.newestOnTop )
    toastRef.componentInstance = portal.instance

    const activeToast: ActiveToast<unknown> = {
      toastId: this.index,
      title: title || "",
      message: message || "",
      toastRef,
      onShown: toastRef.afterActivate (),
      onHidden: toastRef.afterClosed (),
      onTap: toastPackage.onTap (),
      onAction: toastPackage.onAction (),
      portal,
    }

    if ( !keepInactive ) {
      this.currentlyActive = this.currentlyActive + 1
      setTimeout ( () => {
        activeToast.toastRef.activate ()
      } )
    }

    this.toasts.push ( activeToast )
    return activeToast
  }
}
