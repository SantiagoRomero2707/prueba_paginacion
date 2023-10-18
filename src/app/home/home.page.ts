import { Component, OnInit } from '@angular/core';
import { DataServiceService } from 'src/services/data-service.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  constructor(private dataService: DataServiceService) {}
  ngOnInit() {
    console.log('Esta es la versión 7 de Ionic');
    /*this.dataService.getobtenerActividad$.subscribe((data)=>{
      console.log(data, 'en el componente home');
    })*/
  }
}
