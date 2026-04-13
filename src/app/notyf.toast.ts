import { ChangeDetectionStrategy, Component } from "@angular/core"
import { ToastComponent } from "../lib/public_api"

@Component ( {
  selector: "app-notyf-toast",
  templateUrl: "./notyf.toast.html",
  styleUrl: "./notyf.toast.component.scss",
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class NotyfToastComponent extends ToastComponent { }
