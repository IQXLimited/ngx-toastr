import { CommonModule } from '@angular/common';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { provideToastr, Toast } from '../../lib/public_api';
import { ActiveToast } from '../../lib/public_api';
import { NotyfToast } from '../notyf.toast';
import { PinkToast } from '../pink.toast';
import { HomeComponent } from './home.component';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideToastr({
          timeOut: 800,
          progressBar: true,
          onActivateTick: true,
          enableHtml: true,
        })
      ],
      imports: [
        FormsModule,
        CommonModule
      ],
    }).compileComponents();
  });

  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it('should trigger onShown', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<Toast> = app.openToast();
    expect(opened).toBeDefined();
    opened.onShown.toPromise().then(() => {
      done();
    });
  });
  it('should trigger onHidden', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<Toast> = app.openToast();
    expect(opened.portal).toBeDefined();
    opened.onHidden.toPromise().then(() => {
      done();
    });
  });
  it('should trigger onTap', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<Toast> = app.openToast();
    expect(opened.portal).toBeDefined();
    opened.onTap.toPromise().then(() => {
      done();
    });
    opened.portal.instance.tapToast();
  });
  it('should extend life on mouseover and exit', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<Toast> = app.openToast();
    opened.portal.instance.stickAround();
    opened.portal.instance.delayedHideToast();
    expect(opened.portal.instance.options.timeOut).toBe(1000);
    done();
  });
  it('should keep on mouse exit with extended timeout 0', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    app.options.extendedTimeOut = 0;
    const opened: ActiveToast<Toast> = app.openToast();
    opened.portal.instance.stickAround();
    opened.portal.instance.delayedHideToast();
    expect(opened.portal.instance.options.timeOut).toBe(0);
    done();
  });
  it('should trigger onShown for openPinkToast', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<PinkToast> = app.openPinkToast();
    expect(opened.portal).toBeDefined();
    opened.onShown.toPromise().then(() => {
      done();
    });
  });
  it('should trigger onHidden for openPinkToast', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<PinkToast> = app.openPinkToast();
    expect(opened.portal).toBeDefined();
    opened.onHidden.toPromise().then(() => {
      done();
    });
  });
  it('should trigger onShown for openNotyf', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<NotyfToast> = app.openNotyf();
    expect(opened.portal).toBeDefined();
    opened.onShown.toPromise().then(() => {
      done();
    });
  });
  it('should trigger onHidden for openNotyf', done => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<NotyfToast> = app.openNotyf();
    expect(opened.portal).toBeDefined();
    opened.onHidden.toPromise().then(() => {
      done();
    });
  });
  it('should have defined componentInstance', waitForAsync(() => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    const opened: ActiveToast<Toast> = app.openToast();
    expect(opened.toastRef.componentInstance).toBeDefined();
  }));
});