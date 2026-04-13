import {
  Component,
  QueryList,
  Renderer2,
  ViewChildren,
  VERSION,
  ChangeDetectionStrategy,
  inject,
} from "@angular/core"
import { cloneDeep, random } from "lodash-es"

import {
  GlobalConfig,
  ToastrService,
  ToastContainerDirective,
  ToastNoAnimationComponent,
} from "../../lib/public_api"

import { NotyfToastComponent } from "../notyf.toast"
import { PinkToastComponent } from "../pink.component"
import { BootstrapToastComponent } from "../bootstrap.toast"
import { FormsModule } from "@angular/forms"

interface Quote {
  title?: string
  message?: string
}

const quotes: Quote[] = [
  {
    title: "Title",
    message: "Message",
  },
  {
    title: "😃",
    message: "Supports Emoji",
  },
  {
    message: "My name is Inigo Montoya. You killed my father. Prepare to die!",
  },
  {
    message: "Titles are not always needed",
  },
  {
    title: "Title only 👊",
  },
  {
    title: "",
    message: `Supports Angular ${VERSION.full}`,
  },
]
const types = [ "success", "error", "info", "warning" ]

@Component ( {
  selector: "app-home",
  imports: [
    FormsModule
  ],
  templateUrl: "./home.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class HomeComponent {
  @ViewChildren ( ToastContainerDirective ) public inlineContainers!: QueryList<ToastContainerDirective>

  public options: GlobalConfig
  public title = ""
  public message = ""
  public type = types[0]
  public version = VERSION
  public enableBootstrap = false
  public inline = false
  public inlinePositionIndex = 0

  public readonly toastr: ToastrService = inject ( ToastrService )
  private readonly renderer: Renderer2 = inject ( Renderer2 )

  private lastInserted: number [ ] = [ ]

  public constructor ( ) {
    this.options = this.toastr.toastrConfig
  }

  public getMessage ( ) {
    let m: string | undefined = this.message
    let t: string | undefined = this.title
    if ( !this.title.length && !this.message.length ) {
      const randomMessage = quotes[random ( 0, quotes.length - 1 )]
      m = randomMessage.message
      t = randomMessage.title
    }
    return {
      message: m,
      title: t,
    }
  }
  public openToast ( ) {
    const { message, title } = this.getMessage ( )
    // Clone current config so it doesn't change when ngModel updates
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

  public openToastNoAnimation ( ) {
    const { message, title } = this.getMessage ( )
    const opt = cloneDeep ( this.options )
    opt.toastComponent = ToastNoAnimationComponent
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

  public openPinkToast ( ) {
    const opt = cloneDeep ( this.options )
    opt.toastComponent = PinkToastComponent
    opt.toastClass = "pinktoast"
    const { message, title } = this.getMessage ( )
    const inserted = this.toastr.show ( message, title, opt )
    if ( inserted && inserted.toastId ) {
      this.lastInserted.push ( inserted.toastId )
    }
    return inserted
  }

  public openBootstrapToast ( ) {
    const opt = cloneDeep ( this.options )
    opt.toastComponent = BootstrapToastComponent
    opt.toastClass = "toast"
    const { message, title } = this.getMessage ( )
    const inserted = this.toastr.show ( message, title, opt )
    if ( inserted && inserted.toastId ) {
      this.lastInserted.push ( inserted.toastId )
    }
    return inserted
  }

  public openNotyf ( ) {
    const opt = cloneDeep ( this.options )
    opt.toastComponent = NotyfToastComponent
    opt.toastClass = "notyf confirm"
    // opt.positionClass = 'notyf__wrapper';
    // this.options.newestOnTop = false;
    const { message, title } = this.getMessage ( )
    const inserted = this.toastr.show ( message || "Success", title, opt )
    if ( inserted && inserted.toastId ) {
      this.lastInserted.push ( inserted.toastId )
    }
    return inserted
  }

  public clearToasts ( ) {
    this.toastr.clear ( )
  }

  public clearLastToast ( ) {
    this.toastr.clear ( this.lastInserted.pop ( ) )
  }

  public fixNumber ( field: keyof GlobalConfig ): void {
    ( this.options as any )[field] = Number ( this.options[field] ) as any
  }

  public setInlineClass ( enableInline: boolean ) {
    if ( enableInline ) {
      this.toastr.overlayContainer = this.inlineContainers.toArray ( ) [ this.inlinePositionIndex ]
      this.options.positionClass = "inline"
    } else {
      this.toastr.overlayContainer = undefined
      this.options.positionClass = "toast-top-right"
    }
  }

  public setInlinePosition ( index: number ) {
    this.toastr.overlayContainer = this.inlineContainers.toArray ( ) [ index ]
  }

  public setClass ( enableBootstrap: boolean ) {
    const add = enableBootstrap ? "bootstrap" : "normal"
    const remove = enableBootstrap ? "normal" : "bootstrap"
    this.renderer.addClass ( document.body, add )
    this.renderer.removeClass ( document.body, remove )
  }
}
