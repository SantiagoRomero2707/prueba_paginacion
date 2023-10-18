import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormularioBuilder } from './forms.builder';
import { DatosAfpEpsComponent } from './datos-afp-eps/datos-afp-eps.component';
import { DatosCotizanteComponent } from './datos-cotizante/datos-cotizante.component';
import { DatosAdminRiesgosComponent } from './datos-admin-riesgos/datos-admin-riesgos.component';
import { DatosAsopagosSistemasComponent } from './datos-asopagos-sistemas/datos-asopagos-sistemas.component';
import { DatosBasicosAportanteComponent } from './datos-basicos-aportante/datos-basicos-aportante.component';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    DatosAfpEpsComponent, 
    DatosCotizanteComponent,
    DatosAdminRiesgosComponent, 
    DatosAsopagosSistemasComponent, 
    DatosBasicosAportanteComponent,
  ],
  exports:[
    DatosAfpEpsComponent, 
    DatosCotizanteComponent,
    DatosAdminRiesgosComponent, 
    DatosAsopagosSistemasComponent, 
    DatosBasicosAportanteComponent,
  ],
  providers:[FormularioBuilder]
})
export class FormulariosUsuariosModule { }
