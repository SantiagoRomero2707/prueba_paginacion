import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { DetailActividadComponent } from './spinner/typeahead/detail-actividad/detail-actividad.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'detalle-actividad',
    component: DetailActividadComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
