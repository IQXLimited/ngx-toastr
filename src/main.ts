import { enableProdMode, provideZonelessChangeDetection } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideToastr, provideToastrNoAnimation } from './lib/public_api';

if (environment.production) {
  enableProdMode();
}

/*
    AppComponent,
    PinkToast,
    BootstrapToast,
    NotyfToast,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastContainerDirective,
    GhButtonModule,
  ],
*/

bootstrapApplication(AppComponent, {
  providers: [
    provideToastr(),
    provideZonelessChangeDetection(),
    provideToastrNoAnimation(),
  ]
})
  .catch(err => console.log(err));
