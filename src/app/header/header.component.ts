import { ChangeDetectionStrategy, Component } from "@angular/core"
import { GhButtonModule } from "@ctrl/ngx-github-buttons"

@Component ( {
  selector: "app-header",
  imports: [
    GhButtonModule
  ],
  templateUrl: "./header.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class HeaderComponent {}
