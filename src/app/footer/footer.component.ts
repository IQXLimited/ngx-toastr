import { ChangeDetectionStrategy, Component, VERSION } from "@angular/core"

@Component ( {
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrl: "./footer.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class FooterComponent {
  public version = VERSION.full
}
