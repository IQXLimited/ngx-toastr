import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhButtonModule } from '@ctrl/ngx-github-buttons';

import { FooterComponent } from './footer.component';
import { provideZonelessChangeDetection } from '@angular/core';

describe ( "FooterComponent", ( ) => {
  let component: FooterComponent
  let fixture: ComponentFixture<FooterComponent>

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
    fixture = TestBed.createComponent ( FooterComponent )
    component = fixture.componentInstance
    fixture.detectChanges ( )
    await fixture.isStable ( )
  } )

  it ( "should create", ( ) => {
    expect ( component ).toBeTruthy ( )
  } )
} )