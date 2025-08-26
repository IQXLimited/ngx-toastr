import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GhButtonModule } from '@ctrl/ngx-github-buttons';
import { HeaderComponent } from './header.component';
import { provideZonelessChangeDetection } from '@angular/core';

describe ( "HeaderComponent", ( ) => {
  let component: HeaderComponent
  let fixture: ComponentFixture<HeaderComponent>

  beforeEach ( async ( ) => {
    await TestBed.configureTestingModule ( {
      teardown: {
        destroyAfterEach: true
      },
      providers: [
        provideZonelessChangeDetection ( ),
      ],
      imports: [
        GhButtonModule,
      ]
    } ).compileComponents ( )
  } )

  beforeEach ( async ( ) => {
    fixture = TestBed.createComponent ( HeaderComponent )
    component = fixture.componentInstance
    fixture.detectChanges ( )
    await fixture.isStable ( )
  } )


  it ( "should create", ( ) => {
    expect ( component ).toBeTruthy ( )
  } )
} )