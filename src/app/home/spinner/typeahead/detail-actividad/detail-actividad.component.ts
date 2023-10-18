import { ActividadRiesgos } from 'src/app/interfaces/acitividad-riesgos';
import { DataServiceService } from 'src/services/data-service.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail-actividad',
  templateUrl: './detail-actividad.component.html',
  styleUrls: ['./detail-actividad.component.scss'],
})

export class DetailActividadComponent  implements OnInit {
  title: string = 'Detalle Actividad Riesgos';
  selectedActividadTemporal$ = this.dataService.getObtenerActividadTemporal$;
  itemSeleccionadoTemporal: ActividadRiesgos = {code:'', label:'', showButton: false};

  constructor(private router: Router, private dataService: DataServiceService) { }

  ngOnInit() {
    //console.log(this.selectedActividad$, this.selectedActividadTemporal$, 'desde el observable')
    if(this.selectedActividadTemporal$ == undefined){
      console.log('Nada')
    }
    this.selectedActividadTemporal$.forEach((item)=>{
      this.itemSeleccionadoTemporal.code =item.code;
      this.itemSeleccionadoTemporal.label = item.label;
      this.itemSeleccionadoTemporal.showButton = true;
    });
  }

  public aceptarActividad(item: ActividadRiesgos) {
    // Aquí defines la ruta del componente al que deseas navegar.
    console.log('Regresar con datos', item);
    this.dataService.setdarActividad(item);
    this.router.navigate(['home']);
  }

  /*public getBackToComponent() {
    this.dataService.setActividadTemporal({code:'', label:'', showButton: false});
    // Aquí defines la ruta del componente al que deseas navegar.
    console.log('Regresar sin datos');
    this.router.navigate(['home']); // Reemplaza 'ruta-del-componente' con la ruta real.
  }*/

}
