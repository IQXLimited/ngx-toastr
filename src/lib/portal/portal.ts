import {
  ComponentRef,
  Injector,
  ViewContainerRef
} from "@angular/core"

export interface ComponentType<T> {
  new ( ...args: any[] ): T
}


/**
 * A `ComponentPortal` is a portal that instantiates some Component upon attachment.
 */
export class ComponentPortal<T> {
  /** The type of the component that will be instantiated for attachment. */
  public component: ComponentType<T>

  /**
   * [Optional] Where the attached component should live in Angular's *logical* component tree.
   * This is different from where the component *renders*, which is determined by the PortalHost.
   * The origin necessary when the host is outside of the Angular application context.
   */
  public viewContainerRef!: ViewContainerRef

  /** Injector used for the instantiation of the component. */
  public injector: Injector

  private attachedHost?: BasePortalHost

  public constructor ( component: ComponentType<T>, injector: Injector ) {
    this.component = component
    this.injector = injector
  }

  /** Whether this portal is attached to a host. */
  public get isAttached ( ): boolean {
    return this.attachedHost != null
  }

  /** Attach this portal to a host. */
  public attach ( host: BasePortalHost, newestOnTop: boolean ): ComponentRef<any> {
    this.attachedHost = host
    return host.attach ( this, newestOnTop )
  }

  /** Detach this portal from its host */
  public detach ( ) {
    const host = this.attachedHost
    if ( host ) {
      this.attachedHost = undefined
      return host.detach ( )
    }
  }

  /**
   * Sets the PortalHost reference without performing `attach ( )`. This is used directly by
   * the PortalHost when it is performing an `attach ( )` or `detach ( )`.
   */
  public setAttachedHost ( host?: BasePortalHost ) {
    this.attachedHost = host
  }
}

/**
 * Partial implementation of PortalHost that only deals with attaching a
 * ComponentPortal
 */
export abstract class BasePortalHost {
  /** The portal currently attached to the host. */
  private attachedPortal?: ComponentPortal<any>

  /** A function that will permanently dispose this host. */
  private disposeFn?: ( ) => void

  public attach ( portal: ComponentPortal<any>, newestOnTop: boolean ) {
    this.attachedPortal = portal
    return this.attachComponentPortal ( portal, newestOnTop )
  }

  public detach ( ) {
    if ( this.attachedPortal ) {
      this.attachedPortal.setAttachedHost ( )
    }

    this.attachedPortal = undefined
    if ( this.disposeFn ) {
      this.disposeFn ( )
      this.disposeFn = undefined
    }
  }

  public setDisposeFn ( fn: ( ) => void ) {
    this.disposeFn = fn
  }

  public abstract attachComponentPortal<T>( portal: ComponentPortal<T>, newestOnTop: boolean ): ComponentRef<T>
}
