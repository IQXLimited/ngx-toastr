import { CommonModule } from "@angular/common"
import { ComponentFixture, TestBed } from "@angular/core/testing"
import { FormsModule } from "@angular/forms"
import { GhButtonModule } from "@ctrl/ngx-github-buttons"
import { AppComponent } from "./app.component"
import { provideToastr } from "../lib/public_api"
import { provideZonelessChangeDetection } from "@angular/core"

describe ( "AppComponent", ( ) => {
  let component: AppComponent
  let fixture: ComponentFixture<AppComponent>

  beforeEach ( async ( ) => {
    await TestBed.configureTestingModule ( {
      teardown: {
        destroyAfterEach: true
      },
      imports: [
        FormsModule,
        CommonModule,
        GhButtonModule,
      ],
      providers: [
        provideZonelessChangeDetection ( ),
        provideToastr ( {
          timeOut: 800,
          progressBar: true,
          enableHtml: true,
        } )
      ]
    } ).compileComponents ( )
  } )

  beforeEach ( ( ) => {
    fixture = TestBed.createComponent ( AppComponent )
    component = fixture.componentInstance
    fixture.detectChanges ( )
    fixture.isStable ( )
  } )

  it ( "should create", ( ) => {
    expect ( component ).toBeTruthy ( )
  } )
} )