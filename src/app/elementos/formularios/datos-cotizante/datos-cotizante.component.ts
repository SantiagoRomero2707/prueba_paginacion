import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormularioBuilder } from '../forms.builder';
import { RegistroAportante } from 'src/app/interfaces/registro-aportante';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-datos-cotizante',
  templateUrl: './datos-cotizante.component.html',
  styleUrls: ['./datos-cotizante.component.scss'],
})
export class DatosCotizanteComponent  implements OnInit {
  
  topeMininoPPS!: number;
  cotizante69: boolean = false;
  formularioDatosCotizante: FormGroup;
  registroAportanteModel!: RegistroAportante;

  /** Lista undefined? */
  public listUnDef = (atributo: string): boolean => {
    return this.registroAportanteModel[atributo] === undefined;
  }
    
  /** modelo seleccionado tiene code? */ 
  ModelCode = (d: string) =>{
    this.registroAportanteModel[d] !== undefined &&
    this.registroAportanteModel[d].code !== undefined &&
    this.registroAportanteModel[d].code.toString().trim().length > 0;
  }

      
  constructor(private formBuilder:FormularioBuilder, private alertCtrl: AlertController,
    ) {
    this.formularioDatosCotizante = this.formBuilder.construirFormularioRegistro();
  }

  ngOnInit() {}
  irDatosLogin(flag: boolean) {
    if (
      this.registroAportanteModel.tarifaCCF.code == '' ||
      this.registroAportanteModel.tarifaCCF == undefined ||
      this.registroAportanteModel.tarifaCCF.code == undefined
    ) {
      this.registroAportanteModel.tarifaCCF = { code: '0.0', label: '0%' };
    } else if (
      ['SINCCF', ''].includes(
        this.registroAportanteModel.codigoCCF.code
      ) &&
      this.registroAportanteModel.tarifaCCF.code != '0.0'
    ) {
      this.formularioDatosCotizante.get('datosAdministradoraRiesgo')
      ?.get('codigoCCFCtrl')?.setErrors({incorret:true})
    } else if (
      !['SINCCF', ''].includes(
        this.registroAportanteModel.codigoCCF.code
      ) &&
      this.registroAportanteModel.tarifaCCF.code == '0.0'
    ) {
      this.formularioDatosCotizante.get('datosAdministradoraRiesgo')
      ?.get('tarifaCcfCtrl')?.setErrors({required:true})
    } else {
      this.registroAportanteModel.showUser = flag;
      this.registroAportanteModel.showDatosAdminRiesgosCcf = !flag;
      this.registroAportanteModel.showDatosBasicos = !flag;
      this.registroAportanteModel.showDatosCotizante = !flag;
      this.registroAportanteModel.showDatosAdminEpsAfp = !flag;
      this.registroAportanteModel.modalidadPago = { code: '1', label: 'PSE'};
      this.registroAportanteModel.modalidadPagoList = [{ code: '1', label: 'PSE' }, { code: '2', label: 'ASISTIDA' }];
      this.formularioDatosCotizante.get('datosBasicoAportante')?.get('autorizoTratamientoDatosCtrl')?.setValue(true); 
    }
  }

  public validateSalarioCotizantePPS(salario: number): boolean {
    if (salario >= this.cifrasInteres.salarioMinimo) {
      return false;
    } else if (salario < this.topeMininoPPS) {
      return false;
    }
    return true;
  }

  
  obtenerInfoRiesgos() {
    this.registroAportanteService.obtenerAdministradoraRiesgos().subscribe(
      (data:any) => {
        this.registroAportanteModel.codigoRiesgosList = data.filter(
          (c:any) => c.code != 'ARL001'
        );
      },
      (error:Error) => {
        console.error(error);
      }
    );

    this.registroAportanteService.getClasesRiesgo().subscribe(
      (data:any) => {
        this.registroAportanteModel.claseRiesgoList = data;
        this.registroAportanteModel.claseRiesgoList.sort((a, b) =>
          a.code < b.code ? -1 : 1
        );
      },
      (error:Error) => {
        console.error(error);
      }
    );
  }



  irdatosAdminEpsAfpForm(flag: boolean) {
    if (this.registroAportanteModel.tipoCotizante.code != '66') {
      this.registroAportanteModel.showDatosBasicos = !flag;
      this.registroAportanteModel.showDatosCotizante = !flag;
      this.registroAportanteModel.showDatosAdminEpsAfp = flag;
    } else {
      if (
        this.validateSalarioCotizantePPS(
          parseInt(this.formularioDatosCotizante.get('datosTipoCotizante')?.get('salarioCtrl')?.value, 10)
        )
      ) {
        this.registroAportanteModel.showDatosBasicos = !flag;
        this.registroAportanteModel.showDatosCotizante = !flag;
        this.registroAportanteModel.showDatosAdminEpsAfp = flag;
      }
    }
    this.registroAportanteModel.indicadorTarifaEspecial = {
      code: '0',
      label: 'Normal',
    };
    this.registroAportanteModel.tarifaAFP = { code: '0.16', label: '16%' };
    this.registroAportanteModel.tarifaEps = {
      code: '0.125',
      label: '12.5%',
    };
    this.obtenerInfoRiesgos();
    this.cargarDataFormTipoCotizante();
  }

  
  cargarDataFormTipoCotizante() {
    if (this.registroAportanteModel.tipoCotizante.code == '66') {
      this.formularioDatosCotizante.get('datosAdministradorasAFPEPS')?.get('codigoAFPCtrl')?.setValue('SINARFP');
      this.registroAportanteModel.codigoAFP = {
        code: '251471',
        label: 'PPS (251471)',
      };
      this.registroAportanteModel.codigoEPS = {
        code: 'SINEPS',
        label: 'SINEPS (SIN EPS)',
      };
      this.registroAportanteModel.tarifaEps = { code: '0.0', label: '0%' };
      this.registroAportanteModel.codigoAFPList = [
        { code: '251471', label: 'PPS (251471)' },
      ];
      this.registroAportanteModel.codigoEPSList = [
        { code: 'SINEPS', label: 'SINEPS (SIN EPS)' },
      ];
      this.registroAportanteModel.tarifaEpsList = [
        { code: '0.0', label: '0%' },
      ];
      this.registroAportanteModel.tarifaCcfList = [{ code: '0', label: '0%' }];
      this.registroAportanteModel.tarifaCCF = { code: '0', label: '0.0' };
      this.registroAportanteModel.codigoCCF = {
        code: 'SINCCF',
        label: 'Sin Aporte',
      };
      this.cargarTarifasAfp(this.registroAportanteModel.codigoAFPList[0].code);
    } else {
      this.registroAportanteService
        .obtenerAdministradoraPension(
          this.registroAportanteModel.subTipoCotizante.code,
          this.formularioDatosCotizante.get('datosTipoCotizante')?.get('colombianoRadicadoExteriorCtrl')?.value
        )
        .subscribe(
          (data:any) => {
            data = data.filter((adm:any) => adm.code != '251410');
            if (
              this.registroAportanteModel.subTipoCotizante.code == '5' ||
              this.formularioDatosCotizante.get('datosTipoCotizante')?.get('colombianoRadicadoExteriorCtrl')?.value == 'true'
            ) {
              this.formularioDatosCotizante.get('datosAdministradorasAFPEPS')?.get('codigoAFPCtrl')?.setValue('SINARFP');
              this.registroAportanteModel.codigoAFPList = [{ code: 'SINAFP', label: 'SINAFP' }];
            } else {
              this.formularioDatosCotizante.get('datosAdministradorasAFPEPS')?.get('codigoAFPCtrl')?.setValue('');
              this.registroAportanteModel.codigoAFPList = data;
              if (
                !['65', '66'].includes(
                  this.registroAportanteModel.tipoCotizante.code
                )
              ) {
                this.registroAportanteModel.codigoAFPList =
                  this.registroAportanteModel.codigoAFPList.filter(
                    (adm) => adm.code != '251471'
                  );
              }
            }
          },
          (error:Error) => {
            console.error(error);
          }
        );
    }
    // this.registroAportanteModel.tipoCotizanteCtrl.disable();
    this.cargarTarifaEspecial();
    this.cotizante56SoloSalud();
    if (this.formularioDatosCotizante.get('datosTipoCotizante')?.get('colombianoRadicadoExteriorCtrl')?.value == 'true') {
      this.formularioDatosCotizante.addControl('codigoEPSCtrl','SINEPS')
      
      this.formularioDatosCotizante.get('datosTipoCotizante')?.get('codigoEPSCtrl')?.setValue('SINEPS');
      this.formularioDatosCotizante.get('datosTipoCotizante')?.get('codigoEPSCtrl')
      ?.setValue(new FormControl({ value: 'SINEPS', disabled: true})),
      this.registroAportanteModel.tarifaEps = { code: '0.0', label: '0%' };
      this.registroAportanteModel.codigoEPS = { code: 'SINEPS', label: 'SINEPS'};
    }

    // this.registroAportanteModel.residenteExteriorCtrl.disable();

    let subTipoCotizanteSinAfp = ['2', '3', '4', '5', '9', '12']; //[{'code': 333},{'code': 333}];//[3,33,42,56];
    let encontro = subTipoCotizanteSinAfp.filter(
      (c) => c == this.registroAportanteModel.subTipoCotizante.code
    );
    if (
      encontro.length > 0 ||
      this.formularioDatosCotizante.get('datosTipoCotizante')?.get('colombianoRadicadoExteriorCtrl')?.value == true
    ) {
      this.formularioDatosCotizante.controls['codigoAFP'].setValue('SINAFP');
      this.formularioDatosCotizante.get('datosAdministradorasAFPEPS')?.get('codigoAFPCtrl')?.setValue('SINAFP');
      this.registroAportanteModel.tarifaAFP = { code: '0.0', label: '0%' };
      this.registroAportanteModel.codigoAFP = { code: 'SINAFP', label: 'SINAFP' };
      this.formularioDatosCotizante.get('datosAdministradorasAFPEPS')?.get('codigoAFPCtrl')
      ?.setValue(new FormControl({value:'SINAFP', disable: true}));
      this.formularioDatosCotizante.get('datosAdministradorasAFPEPS')?.get('indicadorTarifaEspecialCtrl')?.setValue('0');
      this.formularioDatosCotizante.get('datosAdministradorasAFPEPS')?.get('indicadorTarifaEspecialCtrl')
      ?.setValue(new FormControl({value:'0', disable: true}));
      this.registroAportanteModel.indicadorTarifaEspecial = { code: '0', label: '0'};
      this.formularioDatosCotizante.get('datosAdministradoraRiesgo')?.get('claseRiesgoCtrl')?.setValue('0');
      this.registroAportanteModel.claseRiesgo = { code: '0-0', label: 'Sin Aporte'};
    }
    this.calcularTotalAFP();
    this.calcularTotalEPS();
    // this.registroAportanteModel.subTipoCotizanteCtrl.disable();
  }

  cargarTarifasAfp(codigo: string) {
    this.infoTarifas.tipoCotizante = this.registroAportanteModel.tipoCotizante;
    this.infoTarifas.subtipoCotizante = this.registroAportanteModel.subTipoCotizante;
    //this.infoTarifas.extranjeroNoObligadoCotizarPension = this.registroAportanteModel.extranjero; Revisar por que se acepta un boolean con un string;
    this.infoTarifas.indicadorTarifaEspecial = this.registroAportanteModel.indicadorTarifaEspecial;
    this.infoTarifas.codigoAFP = this.registroAportanteModel.codigoAFP;
    this.infoTarifas.novedadSln = '';
    this.infoTarifas.tipoEntidad = 2;
    this.infoTarifas.tipoPlanilla =
    this.registroAportanteModel.tipoCotizante.code != '66' ? 'I' : 'B';
    this.infoTarifas.anoPeriodoSubsistema = this.registroAportanteModel.periodo.split('-')[0];
    this.infoTarifas.mesPeriodoSubsistema = this.registroAportanteModel.periodo.split('-')[1];
    this.registroAportanteService.obtenerTarifasPension(this.infoTarifas).subscribe(
      (data: any) => {
        data.forEach((element:TarifaAFP) => {
          this.registroAportanteModel.tarifaAFP = { code: '', label: ''};
          this.registroAportanteModel.tarifaAfpList.push(element);
        });
      },
      (error: Error) => {
        console.error(error);
        }
    );

    if (this.registroAportanteModel.tipoCotizante.code == '66') {
      this.registroAportanteModel.codigoEPSList = [
        { code: 'SINEPS', label: 'SINEPS' },
      ];
      this.registroAportanteModel.codigoEPS = { code: 'SINEPS', label: 'SINEPS' };
      //this.registroAportanteModel.codigoEPSCtrl.disable();
      this.registroAportanteModel.tarifaEpsList = [ { code: '0.0', label: '0.0' } ];
      this.registroAportanteModel.tarifaEps = { code: '0.0', label: '0.0' };
      //this.registroAportanteModel.tarifaEpsCtrl.disable();
      this.calcularTotalEPS();
    }
  }

  calcularTotalAFP() {
    this.registroAportanteModel.showPagoAfp = true;
    this.registroAportanteService
      .calcularCotizacion(
        this.formularioDatosCotizante.get('datosTipoCotizante')?.get('cuarentaSalarioCtrl')?.value,
        this.registroAportanteModel.tarifaAFP.code,
        'AFP',
        this.registroAportanteModel.tipoCotizante.code,
        this.registroAportanteModel.subTipoCotizante.code,
        false,
        this.formularioDatosCotizante.get('datosTipoCotizante')?.get('fechaIngresoCtrl')?.value.substring(0,10),
        this.formularioDatosCotizante.get('datosTipoCotizante')?.get('fechaIngresoCtrl')?.value.substring(0, 7),
      )
      .subscribe(
        (data:any) => {
          this.registroAportanteModel.totalPagoAfp = data;
        },
        (error:Error) => {
          console.log(error);
        }
      );
  }

  cotizante56SoloSalud() {
    let cotizanteSoloSalud = ['56'];
    let encontro = cotizanteSoloSalud.filter(
      (c) => c == this.registroAportanteModel.tipoCotizante.code
    );
    if (encontro.length > 0) {
      this.formularioDatosCotizante.get('datosAdministradorasAFPEPS')?.get('codigoAFPCtrl')?.setValue('SINAFP');
      this.formularioDatosCotizante.get('datosAdministradorasAFPEPS')?.get('codigoAFPCtrl')?.setValue(new FormControl({ value: 'SINAFP', disabled: true }));
      this.registroAportanteModel.codigoAFP = { code: 'SINAFP', label: 'SINAFP'};
      this.formularioDatosCotizante.get('datosAdministradorasAFPEPS')?.get('indicadorTarifaEspecialCtrl')?.setValue('0');
      this.formularioDatosCotizante.get('datosAdministradorasAFPEPS')?.get('indicadorTarifaEspecialCtrl')?.setValue(new FormControl({ value: '0', disabled: true }));
      this.registroAportanteModel.indicadorTarifaEspecial= { code: '0', label: '0'};
      this.formularioDatosCotizante.get('datosAdministradorasAFPEPS')?.get('tarifaAfpCtrl')?.setValue('0.0');
      this.formularioDatosCotizante.get('datosAdministradorasAFPEPS')?.get('tarifaAfpCtrl')?.setValue(
        new FormControl({ value: '0.0', disabled: true }));
      this.registroAportanteModel.tarifaAFP= { code: '0.0', label: '0%' };
      this.formularioDatosCotizante.get('datosAdministradoraRiesgo')?.get('codigoRiesgosCtrl')?.setValue('SINARP');
      this.formularioDatosCotizante.get('datosAdministradorasAFPEPS')?.get('codigoRiesgosCtrl')?.setValue(
        new FormControl({ value: '0.0', disabled: true }));
      this.formularioDatosCotizante.get('datosAdministradoraRiesgo')?.get('claseRiesgoCtrl')?.setValue('0');
      this.formularioDatosCotizante.get('datosAdministradorasAFPEPS')?.get('claseRiesgoCtrl')?.setValue(
        new FormControl({ value: '0.0', disabled: true }));
      this.formularioDatosCotizante.get('datosAdministradoraRiesgo')?.get('codigoCCFCtrl')?.setValue('SINCCF');
      this.formularioDatosCotizante.get('datosAdministradoraRiesgo')?.get('codigoCCFCtrl')?.setValue(
        new FormControl({ value: 'SINCCF', disabled: true }));
      this.registroAportanteModel.codigoCCF = {code: 'SINCCF', label: 'SINCCF'};
      this.formularioDatosCotizante.get('datosAdministradoraRiesgo')?.get('tarifaCcfCtrl')?.setValue('0.0');
      this.formularioDatosCotizante.get('datosAdministradoraRiesgo')?.get('tarifaCcfCtrl')?.setValue(
        new FormControl({ value: '0.0', disabled: true }));
      this.registroAportanteModel.tarifaCCF = { code: '0.0', label: '0%' };
      this.registroAportanteModel.totalPagoAfp = 0;
    }
  }


  calcularTotalEPS() {
    this.registroAportanteModel.showPagoEps = true;
    this.registroAportanteService
      .calcularCotizacion(
        this.registroAportanteModel.cuarentaPorcientoSalario,
        this.registroAportanteModel.tarifaEps.code,
        'EPS',
        this.registroAportanteModel.tipoCotizante.code,
        this.registroAportanteModel.subTipoCotizante.code,
        false,
        this.registroAportanteModel.fechaIngreso?.substring(0, 10),
        this.registroAportanteModel.fechaIngreso?.substring(0, 7)
      )
      .subscribe(
        (data:number) => {
          this.registroAportanteModel.totalPagoEps = data;
        },
        (error:Error) => {
          console.error(error);
        }
      );
  }


  
  irDatosBasicos() {
    this.registroAportanteModel.showDatosBasicos = true;
    this.registroAportanteModel.showDatosCotizante = false;
  }

  validarFecha(fecha: string) {
    let year = parseInt(fecha.split('-')[0]);
    let month = parseInt(fecha.split('-')[1]);
    if (year < API_CONFIG.yearPP) {
      this.registroAportanteService
        .obtenerSubtipoCotizante(
          this.registroAportanteModel.tipoDocumento.tipoDocumento,
          this.registroAportanteModel.numeroDocumento,
          this.registroAportanteModel.tipoCotizante.code
        )
        .subscribe(
          (data:any) => {
            this.registroAportanteModel.subTipoCotizante = {
              code: '0',
              label: '[0] Sin Subtipo',
            };
            this.registroAportanteModel.subTipoCotizanteList = data;
          },
          (error:Error) => {
            console.error(error);
          }
        );
    }
  }

  cargarTarifaEspecial() {
    let year = this.formularioDatosCotizante.get('datosTipoCotizante')?.get('fechaIngresoCtrl')?.value.split('-')[0];
    let month = this.formularioDatosCotizante.get('datosTipoCotizante')?.get('fechaIngresoCtrl')?.value.split('-')[1];
    

    this.registroAportanteService
      .obtenerIndicadorTarifaEspecial(
        year,
        month,
        this.registroAportanteModel.tipoCotizante.code,
        this.registroAportanteModel.subTipoCotizante.code
      )
      .subscribe(
        (data:any) => {
          this.registroAportanteModel.indicadorTarifaEspecialList = data;
        },
        (error:Error) => {
          console.error(error);
        }
      );
  }


  
  public validateMinCuarenta() {

    let salario = parseInt(this.formularioDatosCotizante.get('datosTipoCotizante')?.get('salarioCtrl')?.value);
    this.cifrasInteresService
      .getSalarioByYear(this.registroAportanteModel.periodo.split('-')[0])
      .subscribe(
        (data:any) => {
          this.cifrasInteres.salarioMinimo = Number(data);
          if (this.registroAportanteModel.tipoCotizanteModel.code == '66') {
            if (salario >= this.cifrasInteres.salarioMinimo) 
            {
              this.formularioDatosCotizante.get('datosTipoCotizante')?.get('salarioCtrl')?.setValue('');
              this.formularioDatosCotizante.get('datosTipoCotizante')?.get('cuarentaPorcientoSalarioCtrl')?.setValue(0);
              const alert = this.alertCtrl
                .create({
                  header: 'Alerta',
                  subHeader: 'Validacion Salario',
                  message:
                    'El salario debe ser menor a ' +
                    this.cifrasInteres.salarioMinimo,
                  buttons: ['Aceptar'],
                })
                .then((alert) => alert.present());
            } else if (salario < this.topeMininoPPS) {
              this.formularioDatosCotizante.get('datosTipoCotizante')?.get('salarioCtrl')?.setValue('');
              this.formularioDatosCotizante.get('datosTipoCotizante')?.get('cuarentaPorcientoSalarioCtrl')?.setValue(0);
              const alert = this.alertCtrl
                .create({
                  header: 'Alerta',
                  subHeader: 'Validacion Salario',
                  message: 'El salario debe ser mayor a ' + this.topeMininoPPS,
                  buttons: ['Aceptar'],
                })
                .then((alert) => alert.present());
            } else {
              this.formularioDatosCotizante.get('datosTipoCotizante')?.get('salarioCtrl')?.setValue(this.registroAportanteModel.salario);
              this.formularioDatosCotizante.get('datosTipoCotizante')?.get('cuarentaPorcientoSalarioCtrl')?.setValue(this.registroAportanteModel.salario);
            }
          } else {
            let cuarenta = Math.round(this.formularioDatosCotizante.get('datosTipoCotizante')?.get('salarioCtrl')?.value *0.4);
            if (cuarenta < this.cifrasInteres.salarioMinimo) {
              const alert = this.alertCtrl
                .create({
                  header: 'Alerta',
                  subHeader: 'Validacion Salrio',
                  message:
                    'El cuarenta porciento del salario no puede ser menor a ' +
                    this.cifrasInteres.salarioMinimo,
                  buttons: ['Aceptar'],
                })
                .then((alert) => alert.present());
                this.formularioDatosCotizante.get('datosTipoCotizante')?.get('cuarentaPorcientoSalarioCtrl')?.setValue(this.cifrasIntereses.salarioMinimo);
            } else {
              this.formularioDatosCotizante.get('datosTipoCotizante')?.get('cuarentaPorcientoSalarioCtrl')?.setValue(cuarenta);
            }
          }
        },
        (error: Error) => {
          console.error(error);
        }
      );
  }

  val2() {
    this.formularioDatosCotizante.get('datosTipoCotizante')?.get('tipoCotizanteCtrl')?.setValue(this.registroAportanteModel.tipoCotizante.code);
    this.formularioDatosCotizante.get('datosTipoCotizante')?.get('tipoCotizanteCtrl')?.updateValueAndValidity;
    this.formularioDatosCotizante.get('datosTipoCotizante')?.get('subTipoCotizanteCtrl')?.setValue(this.registroAportanteModel.subTipoCotizante.code);
    this.formularioDatosCotizante.get('datosTipoCotizante')?.get('subTipoCotizanteCtrl')?.updateValueAndValidity;
  }



  cuarentaSalarioEvent() {
    let cuarenta = 0;
    if (this.registroAportanteModel.tipoCotizante.code != '66') {
      cuarenta = Math.round(
        this.formularioDatosCotizante.get('salarioCtrl')?.value * 0.4
      );
    } else {
      cuarenta = this.formularioDatosCotizante.get('salarioCtrl')?.value;
    }
    this.formularioDatosCotizante.get('salarioCtrl')?.setValue(cuarenta);
  }
  
  onChangeResidente(value: any) {
    console.log(value);
    this.formularioDatosCotizante.get('datosTipoCotizante')?.get('fechaRadicacionExtCtrl')?.setValue('');
    if (value.toString() === 'true') {
      this.registroAportanteModel.showResidenteExterior = true;
      this.formularioDatosCotizante.controls['fechaRadicacionExt'].setValidators([Validators.required]);
    } else {
      this.registroAportanteModel.showResidenteExterior = false;
      this.formularioDatosCotizante.controls['fechaRadicacionExt'].setValidators([]);
    }
    this.formularioDatosCotizante.get('datosTipoCotizante')?.get('fechaRadicacionExtCtrl')?.updateValueAndValidity();
  }


  subTipoCotizanteChange(event: any) {
    //console.log('subTipoCotizante:', event.value.code);
  }


  subTipoCotizanteLoad(event: any) {
    console.log(event.value.code);
    this.registroAportanteModel.tipoCotizante.code = event.value.code;
    this.registroAportanteModel.tipoCotizante.label = event.value.label;
    if (event.value.code == 59) {
      this.registroAportanteModel.showColombiano = false;
      this.registroAportanteModel.showResidenteExterior = false;
    } else {
      this.registroAportanteModel.showColombiano = true;
    }

    if (event.value.code == 66) {
      this.registroAportanteModel.subTipoCotizante = {
        code: '0',
        label: '[0] Sin Subtipo',
      };
      this.registroAportanteModel.subTipoCotizanteList = [
        { code: '0', label: '[0] Sin Subtipo' },
      ];
      this.formularioDatosCotizante.get('datosAdministradorasAFPEPS')?.get('codigoEPSCtrl')?.enable();
      this.formularioDatosCotizante.get('datosAdministradorasAFPEPS')?.get('tarifaEpsCtrl')?.enable();

    } else {
      this.registroAportanteService
        .obtenerSubtipoCotizante(
          this.registroAportanteModel.tipoDocumento.tipoDocumento,
          this.registroAportanteModel.numeroDocumento,
          event.value.code
        )
        .subscribe(
          (data:any) => {
            let encontro = data.filter((c:any) => c.code == '5');
            if (encontro.length > 0) {
              this.formularioDatosCotizante.get('datosTipoCotizante')?.get('subTipoCotizanteCtrl')?.setValue(new FormControl({value:'5', disabled:true}));
              this.registroAportanteModel.subTipoCotizante = encontro[0];
              this.registroAportanteModel.subTipoCotizanteList = data;
            } else {
              this.formularioDatosCotizante.get('datosTipoCotizante')?.get('subTipoCotizanteCtrl')?.setValue(new FormControl({value:'0', disabled:true}));
              this.registroAportanteModel.subTipoCotizante = { code: '0', label: '[0] Sin Subtipo'};
              this.registroAportanteModel.subTipoCotizanteList = data;
            }
          },
          (error: Error) => {
            console.error(error);
          }
        );
    }

    //this.validarCoherenciaFechas(this.fechaIngreso.value);
  }


}
