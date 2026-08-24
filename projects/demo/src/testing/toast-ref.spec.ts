import { OverlayRef, ToastRef } from "@iqx-limited/ngx-toastr"

describe ( "ToastRef", () => {
  const createToastRef = () => {
    const overlayRef = { detach: jasmine.createSpy ( "detach" ) } as unknown as OverlayRef
    return { toastRef: new ToastRef ( overlayRef ), overlayRef }
  }

  it ( "should complete subjects once on close after manualClose", () => {
    const { toastRef, overlayRef } = createToastRef ()

    toastRef.manualClose ()
    toastRef.close ()

    expect ( overlayRef.detach ).toHaveBeenCalled ()
  } )

  it ( "should emit duplicate count when enabled", () => {
    const { toastRef } = createToastRef ()
    const counts: number[] = []

    toastRef.countDuplicate ().subscribe ( count => counts.push ( count ) )
    toastRef.onDuplicate ( false, true )
    toastRef.onDuplicate ( false, true )

    expect ( counts ).toEqual ( [ 1, 2 ] )
  } )

  it ( "should reset timeout subject when requested", () => {
    const { toastRef } = createToastRef ()
    let resetCount = 0

    toastRef.timeoutReset ().subscribe ( () => resetCount++ )
    toastRef.onDuplicate ( true, false )

    expect ( resetCount ).toBe ( 1 )
  } )

  it ( "should activate only once", () => {
    const { toastRef } = createToastRef ()
    let activateCount = 0

    toastRef.afterActivate ().subscribe ( () => activateCount++ )
    toastRef.activate ()
    toastRef.activate ()

    expect ( activateCount ).toBe ( 1 )
    expect ( toastRef.isInactive () ).toBeFalse ()
  } )
} )
