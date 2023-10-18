import { ActividadRiesgos } from 'src/app/interfaces/acitividad-riesgos';
import { DataServiceService } from 'src/services/data-service.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})

export class SpinnerComponent  implements OnInit {
  @ViewChild('modal', { static: true }) modal!: IonModal;  
  
  labelPorDefectoText: string | undefined = 'Seleccione una actividad de riesgo';
  actividadesSeleccionadas: string  [] = [];
  
  actividadesRiesgos: ActividadRiesgos [] = [];
  bandera!: number;
  
  constructor( private dataService: DataServiceService) { }
  ionViewDidEnter(): void {
    // Código que se ejecutará cuando la vista del componente se haya cargado.
  }
  
  ngOnInit() {
    this.dataService.getobtenerActividad$.subscribe((data)=>{
      
      if(data.code!=''&& data.code !=null&& data.code!= undefined){
        console.log('viene con datos ya preestablecidos', data.showButton, data.label);
        this.labelPorDefectoText = data.label;
      }
    })
    this.dataService.getObtenerCantidadListaElementos.subscribe(bandera=>{
      this.bandera = bandera;
    })
    this.generateItems();
  }
  
  public generateItems() {
    // console.log('inicia bandera local', this.bandera)
    if(this.bandera===0){
      var count = this.actividadesRiesgos.length + 1;
      for (let i = 0; i < 1000; i++) {
        this.actividadesRiesgos.push({'label':`Item ${count + i}`, 'code':`${count + i}`, 'showButton':false});  
      }
    }else{
      var count = this.bandera+49;
        for (let i = 0; i < 1000; i++) {
          this.actividadesRiesgos.push({'label':`Item ${count + i}`, 'code':`${count + i}`, 'showButton':false});  
        }
    }
  }
  
  private formatData(data: string[]): string | undefined  {
    console.log(data, 'dato recibido por el usuario')
    if (!data || data.length === 0) {
      return 'Seleccione una actividad de riesgo';
    }
    const actividadMostrar = this.actividadesRiesgos.find((actividad) => actividad.code  === data[0]);
    return actividadMostrar?.label;
  }

  public actividadesSelectionChanged(actividadesInput: string[]): void {
    this.actividadesSeleccionadas = actividadesInput;
    this.labelPorDefectoText = this.formatData(this.actividadesSeleccionadas);
    this.modal.dismiss();
  }

}
