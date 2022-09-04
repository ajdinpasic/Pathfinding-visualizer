import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GridMenuComponent } from './components/grid-menu/grid-menu.component';
import { GridComponent } from './components/grid/grid.component';
import { GridMenuService } from './services/grid-menu.service';

@NgModule({
  declarations: [
    AppComponent,
    GridMenuComponent,
    GridComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [GridMenuService],
  bootstrap: [AppComponent]
})
export class AppModule { }
