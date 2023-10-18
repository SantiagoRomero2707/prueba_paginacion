import { Component, OnInit } from '@angular/core';
import { FormularioBuilder } from '../forms.builder';
import { FormGroup, Validators } from '@angular/forms';
import { InfoTarifas } from 'src/app/interfaces/info-tarifa';
import { PatthersService } from 'src/services/patthers.service';
import { RegistroAportante } from 'src/app/interfaces/registro-aportante';

@Component({
  selector: 'app-datos-admin-riesgos',
  templateUrl: './datos-admin-riesgos.component.html',
  styleUrls: ['./datos-admin-riesgos.component.scss'],
})
export class DatosAdminRiesgosComponent implements OnInit {
  
  infoTarifas!: InfoTarifas;
  formularioDatosAdminRiesgosCcf: FormGroup;
  registroAportanteModel!: RegistroAportante;
  require = Validators.compose([Validators.required]); /**requerido */
  
  constructor(public patther: PatthersService, private formBuilder: FormularioBuilder) {
    this.formularioDatosAdminRiesgosCcf = this.formBuilder.construirFormularioRegistro();
  }

  validators1 = [
    Validators.compose([Validators.required, this.formBuilder.celularValido()]),
    Validators.compose([Validators.required, Validators.pattern(this.patther.address),]),
    this.require,Validators.compose([Validators.required,Validators.pattern(this.patther.actividadRiesgos), Validators.pattern(this.patther.cero),]),
    Validators.compose([ Validators.required,Validators.pattern(this.patther.actividadSinRiesgos)]),
  ];

  ngOnInit() {}

  /** valor del campo en el formulario */
  public valorCampoFormulario(formulario: FormGroup, campo: string): string {
    const campoControl = formulario.get(campo);
    if (campoControl !== null && campoControl !== undefined) {
      return campoControl.value;
    }
    return ''; // Si campoControl es nulo, retorna una cadena vacía
  }

  public cargarClasesRiesgo() {
    this.seleccionarActividadRiesgo();
    if (this.formularioDatosAdminRiesgosCcf.get('codigoRiesgosCtrl')?.value == 'SINARP') {
      this.registroAportanteModel.claseRiesgo = { code: '0-0', label: 'Sin Aporte' };
    }
  }

  /** defino el valor de actividad riesgos según la condición */
  public seleccionarActividadRiesgo() {
    setTimeout(() => {
      let r = this.formularioDatosAdminRiesgosCcf.controls['actividadRiesgos'];
      r.clearValidators();
      const control = this.formularioDatosAdminRiesgosCcf.get('actividadRiesgoCtrl');
      if (control) {
        control.setValue( this.validarActividadRiesgos() ? '' : { code: '0', label: '0' } );
      } 
      else {
        console.error("El control 'actividadRiesgoCtrl' no se encontró en el formulario.");
      }
      r.setValidators(
        this.validators1[
          this.validarActividadRiesgos()
            ? 3
            : this.registroAportanteModel.tipoCotizante.code == '3'
            ? 2
            : 4
        ]
      );
      r.updateValueAndValidity();
    });
  }

  /**
   * Validacion de periodo, tipos de cotizantes para actividad economica de riesgos
   * HU21148
   */
  public validarActividadRiesgos(): boolean {
    let cotizanteSoloSalud = ['57', '67'];
    let encontro = cotizanteSoloSalud.filter((cotizante) => {
      cotizante == this.registroAportanteModel.tipoCotizante.code;
    });
    return (
      encontro &&
      this.registroAportanteModel.codigoRiesgos != null &&
      this.registroAportanteModel.codigoRiesgos.code != null &&
      !['SINARP', 'SINARL'].includes(
        this.registroAportanteModel.codigoRiesgos.code
      ) &&
      this.pipes.toDate(this.registroAportanteModel.periodo + '-01 00:00:00') >=
        this.constantes.periodoActividadRiesgos
    );
  }

  public calcularTotalARL() {
    this.registroAportanteModel.showPagoEps = true;
    let tarifaArl = this.registroAportanteModel.claseRiesgo.code?.split('-')[1];
    this.registroAportanteService
      .calcularCotizacion(
        this.valorCampoFormulario(this.formularioDatosAdminRiesgosCcf,'cuarentaSalarioCtrl'),
        tarifaArl,
        'ARL',
        this.registroAportanteModel.tipoCotizante.code,
        this.registroAportanteModel.subTipoCotizante.code,
        false,
        this.valorCampoFormulario(this.formularioDatosAdminRiesgosCcf,'cuarentaSalarioCtrl').substring(0, 10),
        this.valorCampoFormulario(this.formularioDatosAdminRiesgosCcf,'cuarentaSalarioCtrl').substring(0, 7)
      )
      .subscribe(
        (data: any) => {
          this.registroAportanteModel.totalPagoArl = data;
        },
        (error: Error) => {
          console.log(error);
        }
      );
  }

  public cargarTarifasCcf() {
    this.infoTarifas.codigoCCF = this.registroAportanteModel.codigoCCF;
    this.infoTarifas.tipoCotizante = this.registroAportanteModel.tipoCotizante;
    this.infoTarifas.subtipoCotizante =
      this.registroAportanteModel.subTipoCotizante;
    this.registroAportanteService
      .obtenerTarifasCajas(this.infoTarifas)
      .subscribe(
        (data: any) => {
          this.registroAportanteModel.tarifaCcfList = data;
        },
        (error: Error) => {
          console.log(error);
        }
      );
    const tarifaCCFControl = this.formularioDatosAdminRiesgosCcf.get('tarifaCcfCtrl');
    if (tarifaCCFControl) {
      tarifaCCFControl.setValue('');
    } else {
      console.error("El control 'tarifaCcfCtrl' no se encontró en el formulario.");
    }
  }

  public calcularTotalCCF() {
    this.registroAportanteModel.showPagoCcf = true;
    this.registroAportanteService
      .calcularCotizacion(
        this.valorCampoFormulario(this.formularioDatosAdminRiesgosCcf, 'cuarentaSalarioCtrl'),
        this.registroAportanteModel.tarifaCCF.code,
        'CCF',
        this.registroAportanteModel.tipoCotizante.code,
        this.registroAportanteModel.subTipoCotizante.code,
        false,
        this.valorCampoFormulario(this.formularioDatosAdminRiesgosCcf,'fechaIngresoCtrl').substring(0, 10),
        this.valorCampoFormulario(this.formularioDatosAdminRiesgosCcf,'fechaIngresoCtrl').substring(0, 7)
      )
      .subscribe(
        (data: number) => {
          this.registroAportanteModel.totalPagoCcf = data;
        },
        (error: Error) => {
          console.log(error);
        }
      );
  }

  public backDatosAdminEpsAfp() {
    this.registroAportanteModel.showDatosAdminRiesgosCcf = false;
    this.registroAportanteModel.showDatosBasicos = false;
    this.registroAportanteModel.showDatosCotizante = false;
    this.registroAportanteModel.showDatosAdminEpsAfp = true;
  }

  public irDatosLogin(flag: boolean) {
    if (
      this.registroAportanteModel.tarifaCCF.code == '' ||
      this.registroAportanteModel.tarifaCCF == undefined ||
      this.registroAportanteModel.tarifaCCF.code == undefined
    ) {
      this.registroAportanteModel.tarifaCCF = { code: '0.0', label: '0%' };
    } 
    else if (['SINCCF', ''].includes(this.registroAportanteModel.codigoCCF.code) && this.registroAportanteModel.tarifaCCF.code != '0.0') 
    {
      this.formularioDatosAdminRiesgosCcf.controls['codigoCCF'].setErrors({
        incorrect: true,
      });
    } 
    else if (!['SINCCF', ''].includes(this.registroAportanteModel.codigoCCF.code) && this.registroAportanteModel.tarifaCCF.code == '0.0') 
    {
      this.formularioDatosAdminRiesgosCcf.controls['tarifaCcf'].setErrors({
        required: true,
      });
    } 
    else {
      this.registroAportanteModel.showUser = flag;
      this.registroAportanteModel.showDatosAdminRiesgosCcf = !flag;
      this.registroAportanteModel.showDatosBasicos = !flag;
      this.registroAportanteModel.showDatosCotizante = !flag;
      this.registroAportanteModel.showDatosAdminEpsAfp = !flag;
      this.registroAportanteModel.modalidadPago = { code: '1', label: 'PSE' };
      this.registroAportanteModel.modalidadPagoList = [
        { code: '1', label: 'PSE' },
        { code: '2', label: 'ASISTIDA' },
      ];
      // this.registroAportanteModel.autorizoTratamientoDatosCtrl.setValue(true); se necesita un servicio
    }
  }

  public validarClaseRiesgo(): boolean {
    let formulario = this.formularioDatosAdminRiesgosCcf.get('claseRiesgo')?.value;
    return !!formulario && !!formulario.code;
  }

}
