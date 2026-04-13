import { DOCUMENT } from "@angular/common"
import { ApplicationRef, inject, Injectable } from "@angular/core"

import { DomPortalHost } from "../portal/dom-portal-host"
import { ToastContainerDirective } from "../toastr/toast.directive"
import { OverlayContainer } from "./overlay-container"
import { OverlayRef } from "./overlay-ref"

/**
 * Service to create Overlays. Overlays are dynamically added pieces of floating UI, meant to be
 * used as a low-level building building block for other components. Dialogs, tooltips, menus,
 * selects, etc. can all be built using overlays. The service should primarily be used by authors
 * of re-usable components rather than developers building end-user applications.
 *
 * An overlay *is* a PortalHost, so any kind of Portal can be loaded into one.
 */
@Injectable ( { providedIn: "root" } )
export class Overlay {
  private overlayContainer = inject ( OverlayContainer )
  private appRef = inject ( ApplicationRef )
  private document = inject ( DOCUMENT )

  // Namespace panes by overlay container
  private paneElements: Map<ToastContainerDirective, Record<string, HTMLElement>> = new Map ( )

  /**
   * Creates an overlay.
   * @returns A reference to the created overlay.
   */
  public create ( positionClass?: string, overlayContainer?: ToastContainerDirective ): OverlayRef {
    // get existing pane if possible
    return this.createOverlayRef ( this.getPaneElement ( positionClass, overlayContainer ) )
  }

  public getPaneElement (
    positionClass: string = "",
    overlayContainer?: ToastContainerDirective,
  ): HTMLElement {
    if ( !this.paneElements.get ( overlayContainer as ToastContainerDirective ) ) {
      this.paneElements.set ( overlayContainer as ToastContainerDirective, {} )
    }

    if ( !this.paneElements.get ( overlayContainer as ToastContainerDirective )![positionClass] ) {
      this.paneElements.get ( overlayContainer as ToastContainerDirective )![
        positionClass
      ] = this.createPaneElement ( positionClass, overlayContainer )
    }

    return this.paneElements.get ( overlayContainer as ToastContainerDirective )![positionClass]
  }

  /**
   * Creates the DOM element for an overlay and appends it to the overlay container.
   * @returns Newly-created pane element
   */
  private createPaneElement (
    positionClass: string,
    overlayContainer?: ToastContainerDirective,
  ): HTMLElement {
    const pane = this.document.createElement ( "div" )

    pane.id = "toast-container"
    pane.classList.add ( positionClass )
    pane.classList.add ( "toast-container" )

    if ( !overlayContainer ) {
      this.overlayContainer.getContainerElement ( ).appendChild ( pane )
    } else {
      overlayContainer.getContainerElement ( ).appendChild ( pane )
    }

    return pane
  }

  /**
   * Create a DomPortalHost into which the overlay content can be loaded.
   * @param pane The DOM element to turn into a portal host.
   * @returns A portal host for the given DOM element.
   */
  private createPortalHost ( pane: HTMLElement ): DomPortalHost {
    return new DomPortalHost ( pane, this.appRef )
  }

  /**
   * Creates an OverlayRef for an overlay in the given DOM element.
   * @param pane DOM element for the overlay
   */
  private createOverlayRef ( pane: HTMLElement ): OverlayRef {
    return new OverlayRef ( this.createPortalHost ( pane ) )
  }
}
