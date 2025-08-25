import { CommonModule } from '@angular/common';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { GhButtonModule } from '@ctrl/ngx-github-buttons';

import { AppComponent } from './app.component';
import { provideToastr } from '../lib/public_api';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
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
        CommonModule,
        GhButtonModule,
      ],
    }).compileComponents();
  }));

  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});