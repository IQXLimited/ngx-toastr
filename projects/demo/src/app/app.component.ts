import { ChangeDetectionStrategy, Component } from "@angular/core"
import { HomeComponent } from "./home/home.component"
import { HeaderComponent } from "./header/header.component"
import { FooterComponent } from "./footer/footer.component"

@Component ( {
  selector: "app-root",
  imports: [
    HomeComponent,
    HeaderComponent,
    FooterComponent
  ],
  template: `
    <app-header />
    <app-home />
    <app-footer />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class AppComponent {}
