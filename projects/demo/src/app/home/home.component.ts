import {
  ChangeDetectionStrategy,
  Component,
  QueryList,
  VERSION,
  ViewChildren,
  inject,
} from "@angular/core"
import { FormsModule } from "@angular/forms"
import { cloneDeep, random } from "lodash-es"

import {
  GlobalConfig,
  ToastContainerDirective,
  NoAnimationToast,
  ToastrService,
} from "@iqx-limited/ngx-toastr"

interface Quote {
  title?: string
  message?: string
}

const quotes: Quote[] = [
  { title: "Title", message: "Message" },
  { title: "😃", message: "Supports Emoji" },
  { message: "My name is Inigo Montoya. You killed my father. Prepare to die!" },
  { message: "Titles are not always needed" },
  { title: "Title only 👊" },
  { title: "", message: `Supports Angular ${ VERSION.full }` },
]

const types = [ "success", "error", "info", "warning" ]

@Component ( {
  selector: "app-home",
  imports: [ FormsModule ],
  templateUrl: "./home.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class HomeComponent {
  public options: GlobalConfig
  public title = ""
  public message = ""
  public type = types[0]
  public version = VERSION
  public inline = false
  public inlinePositionIndex = 0

  @ViewChildren ( ToastContainerDirective )
  public inlineContainers!: QueryList<ToastContainerDirective>

  public readonly toastr: ToastrService = inject ( ToastrService )

  private lastInserted: number[] = []

  public constructor () {
    this.options = this.toastr.toastrConfig
  }

  public getMessage (): { message: string | undefined; title: string | undefined } {
    let message: string | undefined = this.message
    let title: string | undefined = this.title

    if ( !this.title.length && !this.message.length ) {
      const randomMessage = quotes[random ( 0, quotes.length - 1 )]
      message = randomMessage.message
      title = randomMessage.title
    }

    return { message, title }
  }

  public openToast () {
    const { message, title } = this.getMessage ()
    const opt = cloneDeep ( this.options )
    const inserted = this.toastr.show (
      message,
      title,
      opt,
      this.options.iconClasses[this.type],
    )

    if ( inserted ) {
      this.lastInserted.push ( inserted.toastId )
    }

    return inserted
  }

  public openToastNoAnimation () {
    const { message, title } = this.getMessage ()
    const opt = cloneDeep ( this.options )
    opt.toastComponent = NoAnimationToast
    const inserted = this.toastr.show (
      message,
      title,
      opt,
      this.options.iconClasses[this.type],
    )

    if ( inserted ) {
      this.lastInserted.push ( inserted.toastId )
    }

    return inserted
  }

  public clearToasts (): void {
    this.toastr.clear ()
  }

  public clearLastToast (): void {
    this.toastr.clear ( this.lastInserted.pop () )
  }

  public fixNumber ( field: keyof GlobalConfig ): void {
    const value = Number ( this.options[field] )
    Object.assign ( this.options, { [field]: value } )
  }

  public setInlineClass ( enableInline: boolean ): void {
    if ( enableInline ) {
      this.toastr.overlayContainer = this.inlineContainers.toArray ()[this.inlinePositionIndex]
      this.options.positionClass = "inline"
    } else {
      this.toastr.overlayContainer = undefined
      this.options.positionClass = "toast-top-right"
    }
  }

  public setInlinePosition ( index: number ): void {
    this.toastr.overlayContainer = this.inlineContainers.toArray ()[index]
  }
}
