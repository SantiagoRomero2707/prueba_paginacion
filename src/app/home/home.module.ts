import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { SpinnerComponent } from './spinner/spinner.component';
import { TypeaheadComponent } from './spinner/typeahead/typeahead.component';
import { DetailActividadComponent } from './spinner/typeahead/detail-actividad/detail-actividad.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, SpinnerComponent, TypeaheadComponent, DetailActividadComponent]
})
export class HomePageModule {}
