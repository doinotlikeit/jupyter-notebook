import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import { NotebookWorkflowComponent } from './components/notebook-workflow/notebook-workflow.component';
import {MatStepperModule} from "@angular/material/stepper";
import {LoggerModule, NgxLoggerLevel} from "ngx-logger";

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    LandingPageDashboardComponent,
    NotebookWorkflowComponent
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
    LoggerModule.forRoot({ level: NgxLoggerLevel.INFO }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
