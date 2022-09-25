import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GridMenuComponent } from './components/grid-menu/grid-menu.component';
import { GridComponent } from './components/grid/grid.component';
import { GridMenuService } from './services/grid-menu.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AnalyticsService } from './services/analytics.service';

@NgModule({
  declarations: [
    AppComponent,
    GridMenuComponent,
    GridComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut:1500,
      positionClass:'toast-top-left'
    }),
  ],
  providers: [GridMenuService, AnalyticsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
