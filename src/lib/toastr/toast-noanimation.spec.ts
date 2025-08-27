import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ApplicationRef, provideZonelessChangeDetection } from '@angular/core'
import { of } from 'rxjs'
import { ToastNoAnimation } from './toast-noanimation.component'
import { ToastrService } from './toastr.service'
import { ToastPackage } from './toastr-config'

describe('ToastNoAnimation', () => {
  let component: ToastNoAnimation
  let fixture: ComponentFixture<ToastNoAnimation>
  let toastrServiceMock: jasmine.SpyObj<ToastrService>
  let toastRefMock: any
  let toastPackageMock: ToastPackage

  beforeEach(() => {
    toastrServiceMock = jasmine.createSpyObj('ToastrService', ['remove'])

    toastRefMock = {
      afterActivate: () => of(void 0),
      manualClosed: () => of(void 0),
      timeoutReset: () => of(void 0),
      countDuplicate: () => of(0),
    }

    toastPackageMock = {
      message: 'test message',
      title: 'test title',
      config: {
        timeOut: 100,
        extendedTimeOut: 50,
        progressBar: false,
        progressAnimation: 'decreasing',
        disableTimeOut: false,
        onActivateTick: false,
        toastClass: 'toast-class',
        tapToDismiss: true,
      },
      toastRef: toastRefMock,
      toastType: 'success',
      toastId: 1,
      triggerTap: jasmine.createSpy('triggerTap'),
    } as any

    TestBed.configureTestingModule({
      providers: [
        ApplicationRef,
        { provide: ToastrService, useValue: toastrServiceMock },
        { provide: ToastPackage, useValue: toastPackageMock },
        provideZonelessChangeDetection ( )
      ],
    })
    fixture = TestBed.createComponent(ToastNoAnimation)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
    expect(component.message).toBe('test message')
    expect(component.title).toBe('test title')
  })

  it('should activate toast with timeout and no progress bar', done => {
    component.activateToast()
    setTimeout(() => {
      expect(toastrServiceMock.remove).toHaveBeenCalledWith(1)
      done()
    }, 120)
  })

  it('should activate toast with progress bar decreasing', done => {
    component.options.progressBar = true
    component.activateToast()
    setTimeout(() => {
      expect(component.width()).toBeLessThan(100)
      done()
    }, 40)
  })

  it('should updateProgress with increasing mode', () => {
    component.options.progressBar = true
    component.options.progressAnimation = 'increasing'
    component['hideTime'] = new Date().getTime() + 50
    component.options.timeOut = 50
    component.width.set(50)
    component.updateProgress()
    expect(component.width()).toBeGreaterThanOrEqual(0)
  })

  it('should clamp width to 0 and 100', () => {
    component.options.timeOut = 100
    component['hideTime'] = new Date().getTime() + 100
    component.width.set(-10)
    component.updateProgress()
    component.width.set(200)
    component.updateProgress()
    expect(component.width()).toBeLessThanOrEqual(100)
  })

  it('should reset timeout', done => {
    component.activateToast()
    component.resetTimeout()
    setTimeout(() => {
      expect(toastrServiceMock.remove).toHaveBeenCalled()
      done()
    }, component.originalTimeout + 21)
  })

  it('should remove only once', done => {
    component.remove()
    expect(component.state()).toBe('removed')
    component.remove()
    setTimeout(() => {
      expect(toastrServiceMock.remove).toHaveBeenCalledWith(1)
      done()
    }, 10)
  })

  it('should tapToast and remove when tapToDismiss true', () => {
    component.tapToast()
    expect(toastPackageMock.triggerTap).toHaveBeenCalled()
    expect(component.state()).toBe('removed')
  })

  it('should not remove when already removed', () => {
    component.state.set('removed')
    component.tapToast()
    component.stickAround()
    component.delayedHideToast()
    expect(toastrServiceMock.remove).not.toHaveBeenCalled()
  })

  it('should stickAround and disable progress', () => {
    component.activateToast()
    component.stickAround()
    expect(component.options.timeOut).toBe(0)
    expect(component.width()).toBe(0)
  })

  it('should delayedHideToast trigger remove after extended timeout', done => {
    component.activateToast()
    component.delayedHideToast()
    setTimeout(() => {
      expect(toastrServiceMock.remove).toHaveBeenCalled()
      done()
    }, component.options.extendedTimeOut + 21)
  })

  it('should not delayedHideToast when disableTimeOut true', () => {
    component.options.disableTimeOut = true
    component.delayedHideToast()
    expect(toastrServiceMock.remove).not.toHaveBeenCalled()
  })

  it('should trigger tick when onActivateTick true', () => {
    const appRef = TestBed.inject(ApplicationRef)
    spyOn(appRef, 'tick')
    component.options.onActivateTick = true
    component.activateToast()
    expect(appRef.tick).toHaveBeenCalled()
  })
})
