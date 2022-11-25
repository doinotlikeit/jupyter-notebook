import { NgModule } from '@angular/core';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { LandingPageDashboardComponent } from './components/landing-page-dashboard/landing-page-dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { ServerOperationsComponent } from './components/server-peations/server-operations.component';
import {MatStepperModule} from "@angular/material/stepper";
import {LoggerModule, NgxLoggerLevel} from "ngx-logger";
import {HttpClientModule} from "@angular/common/http";
import {ErrorDialogComponent} from "./components/error-dialog/error-dialog.component";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatFormFieldModule } from "@angular/material/form-field";
import {MatTabsModule} from "@angular/material/tabs";
import { DataOperationsComponent } from './components/data-operations/data-operations/data-operations.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";


@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    LandingPageDashboardComponent,
    ServerOperationsComponent,
    ErrorDialogComponent,
    DataOperationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatStepperModule,
    HttpClientModule,
    MatDialogModule,
    MatSnackBarModule,
    LoggerModule.forRoot({level: NgxLoggerLevel.INFO}),
    MatFormFieldModule,
    MatTabsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
