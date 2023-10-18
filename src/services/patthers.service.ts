import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PatthersService {

  constructor() { } 
  /** validacion de actividad economica */public actividadRiesgos =  new RegExp(/[0-9]{7}/);
  /** validacion de actividad economica */public actividadSinRiesgos =  new RegExp(/[0]{1}/);
  /** validacion de actividad economica */public cero =  new RegExp(/^(?!0+$)[\s\S]+$/);
  /** direcciones respecto registros de aportante*/public address = "[a-zA-ZÑñ0-9#-\\s]{4,40}";
  public numbers =  new RegExp(/[0-9]/);
  /** correo electrónico */ public email ="^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[a-z0-9-]*[A-Za-z0-9])?$"
}
