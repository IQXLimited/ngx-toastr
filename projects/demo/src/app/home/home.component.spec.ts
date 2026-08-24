import { CommonModule } from "@angular/common"
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { FormsModule } from "@angular/forms"

import { provideToastr, ActiveToast, Toast } from "@iqx-limited/ngx-toastr"
import { HomeComponent } from "./home.component"
import { firstValueFrom } from "rxjs"
import { provideZonelessChangeDetection } from "@angular/core"

describe ( "HomeComponent", ( ) => {
  let component: HomeComponent
  let fixture: ComponentFixture<HomeComponent>

  beforeEach ( async ( ) => {
    await TestBed.configureTestingModule ( {
      teardown: {
        destroyAfterEach: true
      },
      providers: [
        provideZonelessChangeDetection ( ),
        provideToastr ( {
          timeOut: 800,
          progressBar: true,
          enableHtml: true,
        } )
      ],
      imports: [
        FormsModule,
        CommonModule
      ],
    } ).compileComponents ( )
  } )

  beforeEach ( async ( ) => {
    fixture = TestBed.createComponent ( HomeComponent )
    component = fixture.componentInstance
    fixture.detectChanges ( )
    await fixture.isStable ( )
  } )

  it ( "should create", ( ) => {
    expect ( component ).toBeTruthy ( )
  } )

  it ( "should trigger onShown", done => {
    const opened = component.openToast ()
    expect ( opened ).toBeDefined ()
    if ( opened?.onShown ) {
      firstValueFrom ( opened.onShown ).then ( () => {
        done ()
      } )
    } else {
      done.fail ( "onShown is not defined" )
    }
  } )
  it ( "should trigger onHidden", done => {
    const opened = component.openToast ()
    expect ( opened?.portal ).toBeDefined ()
    if ( opened?.onHidden ) {
      firstValueFrom ( opened.onHidden ).then ( () => {
        done ()
      } )
    } else {
      done.fail ( "onHidden is not defined" )
    }
  } )
  it ( "should trigger onTap", done => {
    const opened = component.openToast ()
    expect ( opened?.portal ).toBeDefined ()
    if ( opened?.onTap ) {
      firstValueFrom ( opened.onTap ).then ( () => {
        done ()
      } )
    } else {
      done.fail ( "onTap is not defined" )
    }
    ( opened?.portal.instance as Toast ).tapToast ()
  } )
  it ( "should extend life on mouseover and exit", done => {
    const opened = component.openToast ()
    const toast = opened?.portal.instance as Toast
    toast.stickAround ()
    toast.delayedHideToast ()
    expect ( toast.options.timeOut ).toBe ( 1000 )
    done ()
  } )
  it ( "should keep on mouse exit with extended timeout 0", done => {
    component.options.extendedTimeOut = 0
    const opened = component.openToast ()
    const toast = opened?.portal.instance as Toast
    toast.stickAround ()
    toast.delayedHideToast ()
    expect ( toast.options.timeOut ).toBe ( 0 )
    done ()
  } )
  it ( "should have defined componentInstance", () => {
    const opened = component.openToast ()
    expect ( opened?.toastRef.componentInstance ).toBeDefined ()
  } )
} )