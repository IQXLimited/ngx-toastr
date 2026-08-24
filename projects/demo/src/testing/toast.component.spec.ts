import { ComponentFixture, TestBed } from "@angular/core/testing"
import { provideZonelessChangeDetection } from "@angular/core"
import { of } from "rxjs"

import { Toast, ToastPackage, ToastrService } from "@iqx-limited/ngx-toastr"

describe ( "Toast", () => {
  let component: Toast
  let fixture: ComponentFixture<Toast>
  let toastrServiceMock: jasmine.SpyObj<ToastrService>
  let toastPackageMock: ToastPackage

  beforeEach ( () => {
    toastrServiceMock = jasmine.createSpyObj ( "ToastrService", [ "remove" ] )

    toastPackageMock = {
      message: "test message",
      title: "test title",
      config: {
        timeOut: 100,
        extendedTimeOut: 50,
        easeTime: 300,
        progressBar: false,
        progressAnimation: "decreasing",
        disableTimeOut: false,
        onActivateTick: false,
        toastClass: "toast-class",
        tapToDismiss: true,
      },
      toastRef: {
        afterActivate: () => of ( void 0 ),
        manualClosed: () => of ( void 0 ),
        timeoutReset: () => of ( void 0 ),
        countDuplicate: () => of ( 0 ),
      },
      toastType: "success",
      toastId: 1,
      triggerTap: jasmine.createSpy ( "triggerTap" ),
    } as unknown as ToastPackage

    TestBed.configureTestingModule ( {
      providers: [
        { provide: ToastrService, useValue: toastrServiceMock },
        { provide: ToastPackage, useValue: toastPackageMock },
        provideZonelessChangeDetection (),
      ],
    } )

    fixture = TestBed.createComponent ( Toast )
    component = fixture.componentInstance
    fixture.detectChanges ()
  } )

  it ( "should create", () => {
    expect ( component ).toBeTruthy ()
    expect ( component.message ).toBe ( "test message" )
    expect ( component.title ).toBe ( "test title" )
  } )

  it ( "should activate toast with timeout", done => {
    component.activateToast ()
    setTimeout ( () => {
      expect ( component.state ().value ).toBe ( "active" )
      done ()
    }, 0 )
  } )

  it ( "should remove after easeTime delay", done => {
    component.remove ()
    expect ( component.state ().value ).toBe ( "removed" )
    setTimeout ( () => {
      expect ( toastrServiceMock.remove ).toHaveBeenCalledWith ( 1 )
      done ()
    }, +toastPackageMock.config.easeTime + 20 )
  } )

  it ( "should not stickAround when disableTimeOut is extendedTimeOut", () => {
    component.options.disableTimeOut = "extendedTimeOut"
    component.activateToast ()
    const timeOutBeforeHover = component.options.timeOut
    component.stickAround ()
    expect ( component.options.timeOut ).toBe ( timeOutBeforeHover )
  } )

  it ( "should tapToast and remove when tapToDismiss true", () => {
    component.tapToast ()
    expect ( toastPackageMock.triggerTap ).toHaveBeenCalled ()
    expect ( component.state ().value ).toBe ( "removed" )
  } )
} )
