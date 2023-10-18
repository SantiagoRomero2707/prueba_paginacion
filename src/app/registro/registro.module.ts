import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormulariosUsuariosModule } from '../elementos/formularios/formularios-usuarios.module';
import { RegistroComponent } from './registro.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule,
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FormulariosUsuariosModule
  ],
  declarations: [RegistroComponent]
})
export class RegistroModule { }
