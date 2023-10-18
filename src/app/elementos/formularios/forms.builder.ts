import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
// import { PatthersService } from 'src/providers/patthers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class FormularioBuilder {
  require = Validators.compose([Validators.required]);
  constructor(
    private formBuilder: FormBuilder
  ) //public patther: PatthersService
  {}
  public construirFormularioRegistro(): FormGroup {
    //Formulario para el registro del aportante
    let formulario: FormGroup = this.formBuilder.group({
      //Datos Basicos del aportante
      datosBasicoAportante: this.formBuilder.group({
        municipioCtrl: ['', Validators.required],
        departamentoCtrl: ['', Validators.required],
        tipoDocumentoCtrl: ['', Validators.required],
        numeroDocumentoCtrl: ['', Validators.required],

        primerNombreCtrl: ['', Validators.required],
        segundoNombreCtrl: ['', Validators.required],
        primerApellidoCtrl: ['', Validators.required],
        segundoApellidoCtrl: ['', Validators.required],

        periodoCtrl: [null, Validators.required],
        emailCtrl: ['', Validators.required],
        telefonoCtrl: ['', Validators.required],
        direccionCtrl: ['', Validators.required],
        actividadEconomicaCtrl: ['', Validators.required],
      }),
      //Datos Cotizante
      datosTipoCotizante: this.formBuilder.group({
        salarioCtrl: ['', Validators.required],
        extranjeroNoObligadoCotizarPensionCtrl: ['', Validators.required],
        fechaIngresoCtrl: ['', Validators.required],
        tipoCotizanteCtrl: ['', Validators.required],
        cuarentaPorcientoSalarioCtrl: ['', Validators.required],
        subTipoCotizanteCtrl: ['', Validators.required],
        colombianoRadicadoExteriorCtrl: ['', Validators.required],
        fechaRadicacionExtCtrl: ['', Validators.required],
      }),
      // Datos administadoras de eps  y fondos
      datosAdministradorasAFPEPS: this.formBuilder.group({
        codigoAFPCtrl: ['', Validators.required],
        tarifaAfpCtrl: ['', Validators.required],
        codigoEPSCtrl: ['', Validators.required],
        tarifaEpsCtrl: ['', Validators.required],
        indicadorTarifaEspecialCtrl: ['', Validators.required],
      }),
      // DatosAdminRiesgos
      datosAdministradoraRiesgo: this.formBuilder.group({
        codigoCCFCtrl: ['', Validators.required],
        tarifaCcfCtrl: ['', Validators.required],
        claseRiesgoCtrl: ['', Validators.required],
        codigoRiesgosCtrl: ['', Validators.required],
        actividadRiesgoCtrl: ['', Validators.required],
      }),
      // Datos de acceso a los sistemas de Asopagos
      datosAccesoAsopagos: this.formBuilder.group({
        sucursalCtrl: ['', Validators.required],
        usuarioAliasCtrl: ['', Validators.required],
        claveCtrl: ['', Validators.required],
        confirmarClaveCtrl: ['', Validators.required],
        periodoPagoCtrl: ['', Validators.required],
        modalidadPagoCtrl: ['', Validators.required],
        autorizoTratamientoDatosCtrl: ['', Validators.required, this.tratamientoData()],
      }),
    });
    return formulario;
  }

  public construirFormularioCambiarClave(): FormGroup {
    let formulario: FormGroup = this.formBuilder.group({
      claveNuevaCtrl: ['', Validators.required],
      confirmarClaveCtrl: ['', Validators.required],
    });
    return formulario;
  }

  

  //Formulario para los datos básicos del usuario
  /*
    this.datosBasicosForm = this.formBuilder.group({
      periodoCtrl: ['', Validators.compose([Validators.required])],
      tipoDocumento: [this.registroAportanteModel.tipoDocumentoModel, Validators.compose([Validators.required])],
      numeroDocumento: [this.registroAportanteModel.numeroDocumento, Validators.compose([Validators.required, Validators.pattern("^[0-9]{3,16}")])],
      primerNombre: ['', Validators.compose([Validators.required])],
      segundoNombre: ['', ''],
      primerApellido: ['', Validators.compose([Validators.required])],
      segundoApellido: ['', ''],
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.patther.email)
      ])],
      actividadEconomica: ['', ''],
      telefono: ['', this.validators1[0]],
      direccion: ['', this.validators1[1]],
      departamento: ['', this.validators1[2]],
      municipio: ['', this.validators1[2]],
      // cot69DiasCtrl: ['', c69?Validators.compose([Validators.required]):[]],
      // cot69ValorCtrl: ['', c69?Validators.compose([Validators.required]):[]]
    });*/

  /*
    this.datosCotizanteForm = this.formBuilder.group({
      tipoCotizante: ['', Validators.compose([Validators.required])],
      subTipoCotizante: ['', Validators.compose([Validators.required])],
      residenteExterior: ['', ''],
      fechaRadicacionExt: ['', ''],
      extranjero: ['', ''],
      salario: ['', Validators.compose([Validators.required])],
      cuarentaSalario: ['', Validators.compose([Validators.required])],
      fechaIngreso: ['', Validators.compose([Validators.required])],
    })

    this.datosAdminEpsAfpForm = this.formBuilder.group({
      codigoAFP: ['', Validators.compose([Validators.required])],
      indicadorTarifaEspecial: ['', Validators.compose([Validators.required])],
      tarifaAfp: ['', Validators.compose([Validators.required])],
      codigoEPS: ['', Validators.compose([Validators.required])],
      tarifaEps: ['', Validators.compose([Validators.required])],
    });

    this.datosAdminRiesgosCcfForm = this.formBuilder.group({
      codigoRiesgos: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      claseRiesgo: ['', Validators.compose([Validators.required])],
      codigoCCF: ['', Validators.compose([Validators.required])],
      tarifaCcf: ['', Validators.compose([Validators.required])],
      actividadRiesgos: ['', this.validators1[3]],

    });

    /*this.datosUsuarioForm = this.formBuilder.group({
      modalidadPago: ['', Validators.compose([Validators.required])],
      usuario: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      clave: ['', Validators.compose([Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[$@$!%*#?¡.&_-])[A-Za-z\d$@$!%*#?¡.&_-]{8,16}$/)])],
      confirmarClave: ['', Validators.compose([Validators.required, this.equalto('clave')])],
      autorizoTratamientoDatos: ['', Validators.compose([Validators.required, this.tratamientoData()])],
    })*/

  /*validators1 = [
    this.require,
    Validators.compose([Validators.required, this.celularValido()]),
    Validators.compose([
      Validators.required,
      Validators.pattern(this.patther.address),
    ]),
    Validators.compose([
      Validators.required,
      Validators.pattern(this.patther.actividadRiesgos),
      Validators.pattern(this.patther.cero),
    ]),
    Validators.compose([
      Validators.required,
      Validators.pattern(this.patther.actividadSinRiesgos),
    ]),
  ];*/

  equalto(clave: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let input = control.value;
      let isValid = control.root.value[clave] == input;
      if (!isValid) return { equalTo: { isValid } };
      else return null;
    };
  }

  tratamientoData(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let isValid = control.value;
      if (!isValid) return { tratamientoData: { isValid } };
      else return null;
    };
  }

  celularValido(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      let input = control.value;
      let isValid =
        input !== null &&
        input > 2999999999 &&
        input.toString().substr(0, 1) === '3';
      if (!isValid) {
        return { celularValido: !isValid };
      } else {
        return null;
      }
    };
  }
}
