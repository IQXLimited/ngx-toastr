import { ChangeDetectionStrategy, Component } from "@angular/core"
import { ToastComponent } from "../lib/public_api"

@Component ( {
  selector: "app-pink-toast",
  templateUrl: "./pink.component.html",
  styleUrl: "./pink.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
} )
export class PinkToastComponent extends ToastComponent {
  // used for demo purposes
  public undoString = "undo"

  public action ( event: Event ) {
    event.stopPropagation ( )
    this.undoString = "undid"
    this.toastPackage.triggerAction ( )
    return false
  }
}
