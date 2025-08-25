import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { provideToastr, Toast } from '../../lib/public_api';
import { ActiveToast } from '../../lib/public_api';
import { NotyfToast } from '../notyf.toast';
import { PinkToast } from '../pink.toast';
import { HomeComponent } from './home.component';
import { firstValueFrom } from 'rxjs';
import { provideZonelessChangeDetection } from '@angular/core';

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
        provideToastr( {
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

  it('should trigger onShown', done => {
    const opened: ActiveToast<Toast> | null = component.openToast();
    expect(opened).toBeDefined();
    if ( opened?.onShown ) {
      firstValueFrom ( opened.onShown ).then(() => {
        done();
      });
    } else {
      done.fail('onShown is not defined');
    }
  });
  it('should trigger onHidden', done => {
    const opened: ActiveToast<Toast> | null = component.openToast();
    expect(opened?.portal).toBeDefined();
    if ( opened?.onHidden ) {
      firstValueFrom ( opened.onHidden ).then(() => {
        done();
      });
    } else {
      done.fail('onHidden is not defined');
    }
  });
  it('should trigger onTap', done => {
    const opened: ActiveToast<Toast> | null = component.openToast();
    expect(opened?.portal).toBeDefined();
    if ( opened?.onTap ) {
      firstValueFrom ( opened.onTap ).then(() => {
        done();
      });
    } else {
      done.fail('onTap is not defined');
    }
    opened?.portal.instance.tapToast();
  });
  it('should extend life on mouseover and exit', done => {
    const opened: ActiveToast<Toast> | null = component.openToast();
    opened?.portal.instance.stickAround();
    opened?.portal.instance.delayedHideToast();
    expect(opened?.portal.instance.options.timeOut).toBe(1000);
    done();
  });
  it('should keep on mouse exit with extended timeout 0', done => {
    component.options.extendedTimeOut = 0;
    const opened: ActiveToast<Toast> | null = component.openToast();
    opened?.portal.instance.stickAround();
    opened?.portal.instance.delayedHideToast();
    expect(opened?.portal.instance.options.timeOut).toBe(0);
    done();
  });
  it('should trigger onShown for openPinkToast', done => {
    const opened: ActiveToast<PinkToast> | null = component.openPinkToast();
    expect(opened?.portal).toBeDefined();
    if ( opened?.onShown ) {
      firstValueFrom ( opened.onShown ).then(() => {
        done();
      });
    } else {
      done.fail('onShown is not defined');
    }
  });
  it('should trigger onHidden for openPinkToast', done => {
    const opened: ActiveToast<PinkToast> | null = component.openPinkToast();
    expect(opened?.portal).toBeDefined();
    if ( opened?.onHidden ) {
      firstValueFrom ( opened.onHidden ).then(() => {
        done();
      });
    } else {
      done.fail('onHidden is not defined');
    }
  });
  it('should trigger onShown for openNotyf', done => {
    const opened: ActiveToast<NotyfToast> | null = component.openNotyf();
    expect(opened?.portal).toBeDefined();
    if ( opened?.onShown ) {
      firstValueFrom ( opened.onShown ).then(() => {
        done();
      });
    } else {
      done.fail('onShown is not defined');
    }
  });
  it('should trigger onHidden for openNotyf', done => {
    const opened: ActiveToast<NotyfToast> | null = component.openNotyf();
    expect(opened?.portal).toBeDefined();
    if ( opened?.onHidden ) {
      firstValueFrom ( opened.onHidden ).then(() => {
        done();
      });
    } else {
      done.fail('onHidden is not defined');
    }
  });
  it('should have defined componentInstance', () => {
    const opened: ActiveToast<Toast> | null = component.openToast();
    expect(opened?.toastRef.componentInstance).toBeDefined();
  })
});