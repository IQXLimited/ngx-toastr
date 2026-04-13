import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EmbeddedViewRef,
} from "@angular/core"
import { BasePortalHost, ComponentPortal } from "./portal"

/**
 * A PortalHost for attaching portals to an arbitrary DOM element outside of the Angular
 * application context.
 *
 * This is the only part of the portal core that directly touches the DOM.
 */
export class DomPortalHost extends BasePortalHost {
  public constructor (
    private _hostDomElement: Element,
    private _appRef: ApplicationRef,
  ) {
    super ( )
  }

  /**
   * Attach the given ComponentPortal to DOM element using the ComponentFactoryResolver.
   * @param portal Portal to be attached
   */
  public attachComponentPortal<T>(
    portal: ComponentPortal<T>,
    newestOnTop: boolean,
  ): ComponentRef<T> {
    const componentRef = createComponent ( portal.component, {
      environmentInjector: this._appRef.injector, // Use AppRef's injector
      elementInjector: portal.injector,           // Use the portal's specific injector
    } )

    // When creating a component outside of a ViewContainer, we need to manually register
    // its ChangeDetector with the application. This API is unfortunately not yet published
    // in Angular core. The change detector must also be deregistered when the component
    // is destroyed to prevent memory leaks.
    this._appRef.attachView ( componentRef.hostView )

    this.setDisposeFn ( ( ) => {
      this._appRef.detachView ( componentRef.hostView )
      componentRef.destroy ( )
    } )

    // At this point the component has been instantiated, so we move it to the location in the DOM
    // where we want it to be rendered.
    if ( newestOnTop ) {
      this._hostDomElement.insertBefore (
        this.getComponentRootNode ( componentRef ),
        this._hostDomElement.firstChild,
      )
    } else {
      this._hostDomElement.appendChild (
        this.getComponentRootNode ( componentRef ),
      )
    }

    return componentRef
  }

  /** Gets the root HTMLElement for an instantiated component. */
  private getComponentRootNode ( componentRef: ComponentRef<any> ): HTMLElement {
    return ( componentRef.hostView as EmbeddedViewRef<any> ).rootNodes[0] as HTMLElement
  }
}
