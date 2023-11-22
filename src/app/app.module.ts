import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RequestService } from './shared/services/request.service';
import { TeamClassificationDataService } from './shared/services/classification.service';
import { PopUpService } from './shared/services/pop-up.service';
import { CustomFieldDataService } from './shared/services/custom-field.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,

    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    RequestService,
    TeamClassificationDataService,
    PopUpService,
    CustomFieldDataService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
