import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActividadRiesgos } from 'src/app/interfaces/acitividad-riesgos';

const initActividad: ActividadRiesgos = { code: '', label: '', showButton: false }

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  
  private banderaListaActividadRiesgo$ = new BehaviorSubject<number>(0);
  private actividadRiesgoSeleccionada$ = new BehaviorSubject<ActividadRiesgos>(initActividad);
  private actividadRiesgoSeleccionadaTemporal$ = new BehaviorSubject<ActividadRiesgos>(initActividad);

  constructor() { }

  get getobtenerActividad$(): Observable<ActividadRiesgos>{
    return this.actividadRiesgoSeleccionada$.asObservable();
  }

  public setdarActividad(actividad: ActividadRiesgos): void{
   this.actividadRiesgoSeleccionada$.next(actividad);
  }

  get getObtenerActividadTemporal$(): Observable<ActividadRiesgos>{
    return this.actividadRiesgoSeleccionadaTemporal$.asObservable();
  }

  public setActividadTemporal(actividadTemporal:ActividadRiesgos):void{
    this.actividadRiesgoSeleccionadaTemporal$.next(actividadTemporal);
  }

  get getObtenerCantidadListaElementos(): Observable<number>{
    return this.banderaListaActividadRiesgo$.asObservable();
  }

  public setBanderaLista(bandera:number): void{
    this.banderaListaActividadRiesgo$.next(bandera);
  }

  private radioSelected: string = '';

  getRadioSelected(): string {
    return this.radioSelected;
  }

  setRadioSelected(value: string): void {
    this.radioSelected = value;
  }

}
