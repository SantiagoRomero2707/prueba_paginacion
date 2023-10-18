import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormularioBuilder } from '../forms.builder';
import { RegistroAportante } from 'src/app/interfaces/registro-aportante';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { RegistroIndependiente } from 'src/app/interfaces/registro-independiente';

@Component({
  selector: 'app-datos-asopagos-sistemas',
  templateUrl: './datos-asopagos-sistemas.component.html',
  styleUrls: ['./datos-asopagos-sistemas.component.scss'],
})
export class DatosAsopagosSistemasComponent  implements OnInit {
  
  cotizante69!: string;
  
  /** ayudas de contraseña*/ h: boolean = false;
  /** mostrar contraseña*/ y: boolean = false;
  formularioDatosAsoPagosUsuario: FormGroup;
  registroAportanteModel!: RegistroAportante;
  registroIndependiente!: RegistroIndependiente;

  constructor(  
    private navCtrl: NavController, 
    private alertBuilder: AlertController, 
    private formBuilder:FormularioBuilder, 
    private loadingCtrl: LoadingController) {
    this.formularioDatosAsoPagosUsuario = this.formBuilder.construirFormularioRegistro(); 
   }

  ngOnInit() {}

  encrypt(source:string): string {
    return this.pipes.encrypt(source);
  }

  validarModalidad(event:any) {
    this.registroAportanteModel.modalidadPago.code = event.value.code;
    if (this.registroAportanteModel.modalidadPago.code == '2') {
      this.registroAportanteService.validarModalidad(
        this.formularioDatosAsoPagosUsuario.get('datosTipoCotizante')?.get('cuarentaPorcientoSalarioCtrl')?.value,
        this.formularioDatosAsoPagosUsuario.get('datosTipoCotizante')?.get('fechaIngresoCtrl')?.value.split('-')[0].toString(),
          this.registroAportanteModel.departamento.id,
          this.registroAportanteModel.municipio.id
        )
        .subscribe((data:any) => {
            if (!data) {
              this.alertBuilder.create({
                header: 'Alerta',
                subHeader: 'Validacion Modalidad de Pago',
                message: 'La planilla no puede ser asistida debido a que supera el salario permitido para pago en banco',
                buttons: ['Aceptar']}).then((alert) => alert.present());
              this.formularioDatosAsoPagosUsuario.get('datosAccesoAsopagos')?.get('modalidadPagoCtrl')?.setValue(1);
            }
          },
          (error: Error) => {
            console.error(error);
          }
        );
    }
  }

  public valPass() {
    this.formularioDatosAsoPagosUsuario.get('datosAccesoAsopagos')?.get('claveCtrl')?.setValue(this.registroAportanteModel.clave);
    this.formularioDatosAsoPagosUsuario.get('datosAccesoAsopagos')?.get('claveCtrl')?.updateValueAndValidity;
    this.formularioDatosAsoPagosUsuario.get('datosAccesoAsopagos')?.get('confirmarClaveCtrl')?.setValue(this.registroAportanteModel.confirmarClave);
    this.formularioDatosAsoPagosUsuario.get('datosAccesoAsopagos')?.get('confirmarClaveCtrl')?.updateValueAndValidity;
  }

  public direccionarTerminosCondicionesPage() {
    //this.navCtrl.push(TerminosCondicionesPage);
    const browser = this.iab.create('https://www.enlace-apb.com/interssi/convenio.jsp');
    browser.show();
  }

  usuarioRegistradoAlerta = (): void => {
    this.alertBuilder
    .create({
      header: 'Alerta',
      subHeader: 'La información ingresada puede ser erronea, intente:',
      buttons: [
        {
          text: 'Nuevo registro',
          cssClass: 'primary',
          handler: () => {
            document.location.reload();
          },
        },
        {
          text: 'Recuperar contraseña',
          cssClass: 'primary',
          handler: () => {
            this.navCtrl.navigateRoot('/recuperar-clave');
          },
        },
        {
          text: 'Iniciar sesión',
          cssClass: 'primary',
          handler: () => {
            this.navCtrl.navigateRoot('/home');
          },
        },
      ],
    })
    .then((alert) => alert.present());
};

    /** retorno en cot69 hacia tab 2 */
  public retornoCotizante() {
    this.registroAportanteModel.showUser = false;
    this.irDatosCotizante(true);
  }
  
  async registrarIndependiente() {
    const loader = await this.loadingCtrl.create({
      message: 'Generando Planilla',
      duration: 2000,
      translucent: true,
      cssClass: 'custom-class custom-loading',
    });

    let fecha: string = this.formularioDatosAsoPagosUsuario.get('datosTipoCotizante')?.get('fechaRadicacionExtCtrl')?.value.toString();
    fecha = fecha.includes('T') ? fecha.split('T')[0] : fecha;
          this.registroIndependiente.codigoAFP = this.registroAportanteModel.codigoAFP;
    this.registroValidatorService
     .validatePreRegistro(
        this.registroAportanteModel.tipoDocumento.tipoDocumento,
        this.formularioDatosAsoPagosUsuario.get('datosBasicoAportante')?.get('numeroDocumentoCtrl')
      ).then((data:any) => {
        if (data) {
          this.usuarioRegistradoAlerta();
        } 
        else {
          if (this.registroAportanteModel.modalidadPago.code == '2') {
            this.registroIndependiente.validacionModalidad = {code: '0', label: 'ASISTIDA'};
          }
          /** retorno la posición de la fecha respecto al tipo de cotizante */
          let fechas = (posicion: number):string =>{
            return this.registroAportanteModel.periodo.split('-')[posicion];
          }
          this.registroIndependiente.tipoDocumento = this.registroAportanteModel.tipoDocumento;
          this.registroIndependiente.numeroDocumento = this.registroAportanteModel.numeroDocumento;
          this.registroIndependiente.primerNombre = this.registroAportanteModel.primerNombre;
          this.registroIndependiente.segundoNombre = this.registroAportanteModel.segundoNombre;
          this.registroIndependiente.primerApellido = this.registroAportanteModel.primerApellido;
          this.registroIndependiente.segundoApellido = this.registroAportanteModel.segundoApellido;
          this.registroIndependiente.razonSocial = (  this.registroAportanteModel.primerNombre + ' ' +
                                                      this.registroAportanteModel.segundoNombre + ' ' +
                                                      this.registroAportanteModel.primerApellido + ' ' +
                                                      this.registroAportanteModel.segundoApellido);
          this.registroIndependiente.departamento = this.registroAportanteModel.departamento;
          this.registroIndependiente.municipio = this.registroAportanteModel.municipio;
          this.registroIndependiente.telefono = this.registroAportanteModel.telefono;
          this.registroIndependiente.celular = this.registroAportanteModel.telefono;
          this.registroIndependiente.direccion = this.registroAportanteModel.direccion;
          this.registroIndependiente.email = this.registroAportanteModel.email;
          this.registroIndependiente.tipoCotizante = this.registroAportanteModel.tipoCotizante;
          this.registroIndependiente.subtipoCotizante = this.registroAportanteModel.subTipoCotizante;
          this.registroIndependiente.extranjeroNoObligadoCotizarPension = this.registroAportanteModel.extranjeroNoObligadoCotizarPension;
          this.registroIndependiente.colombianoRadicadoExterior = this.registroAportanteModel.colombianoRadicadoExterior;
          this.registroIndependiente.fechaRadicacionExterior = fecha;
          this.registroIndependiente.salario = this.registroAportanteModel.salario;
          this.registroIndependiente.salarioBasico = this.registroAportanteModel.cuarentaPorcientoSalario;
          this.registroIndependiente.cuarentaPorcientoSalario = this.registroIndependiente.salarioBasico;
          this.registroIndependiente.formaPago = 'N';
          this.registroIndependiente.salarioIntegral = 'false';
          this.registroIndependiente.fechaFinBloqueo = '1900-01-01';
          this.registroIndependiente.fechaIngreso = this.cotizante69 ? null : this.registroAportanteModel.fechaIngreso?.split('T')[0];
          this.registroIndependiente.pensionPeriodoAno = fechas(0);
          this.registroIndependiente.pensionPeriodoMes = fechas(1);
          this.registroIndependiente.codigoAFP = this.registroAportanteModel.codigoAFP;
          this.registroIndependiente.indicadorTarifaEspecial = this.registroAportanteModel.indicadorTarifaEspecial;
          this.registroIndependiente.tarifaAFP = this.registroAportanteModel.tarifaAFP;
          this.registroIndependiente.codigoEPS = this.registroAportanteModel.codigoEPS;
          this.registroIndependiente.tarifaEps = this.registroAportanteModel.tarifaEps;
          this.registroIndependiente.codigoCCF = this.registroAportanteModel.codigoCCF;
          this.registroIndependiente.tarifaCCF = this.registroAportanteModel.tarifaCCF;
          this.registroIndependiente.trabajo = 'RegistroIndApp';
          this.registroIndependiente.usuario = this.encrypt(this.registroAportanteModel.usuario);
          this.registroIndependiente.clave = this.encrypt(this.registroAportanteModel.clave);
          this.registroIndependiente.modalidadPago = this.registroAportanteModel.modalidadPago;
          this.registroIndependiente.codigoRiesgos = this.registroAportanteModel.codigoRiesgos;
          this.registroIndependiente.claseRiesgo = this.registroAportanteModel.claseRiesgo;
          this.registroIndependiente.medio = '';
          this.registroIndependiente.accion = '';
          this.registroIndependiente.autorizoTratamientoDatos = true;
          this.registroIndependiente.actividadEconomica = {code: '7490', label:''}
          this.registroIndependiente.aportaEsapMinedu = 'N';
          this.registroIndependiente.aportanteExceptuadoPagoModalidadElectronica = false;
          this.registroIndependiente.bancoDebito = 0;
          this.registroIndependiente.causal = '';
          this.registroIndependiente.centroTrabajoStr = 0;
          this.registroIndependiente.claseAportante = 'I';
          this.registroIndependiente.concordato = false;
          this.registroIndependiente.cuentaDebito = 0;
          this.registroIndependiente.digitoVerificacion = 0;
          this.registroIndependiente.envioInformacionCelular = false;
          this.registroIndependiente.envioSoportePagoAportante = false;
          this.registroIndependiente.envioSoportePagoCotizante = false;
          this.registroIndependiente.exoneradoPagoSaludParafiscales = 'N';
          this.registroIndependiente.fax = 0;
          this.registroIndependiente.fechaFinalAccion = null;
          this.registroIndependiente.fechaInicioAccion = null;
          this.registroIndependiente.actividadRiesgos = this.pipes.number(this.vcf('datosAdminRiesgosCcf', 'actividadRiesgos') || this.registroAportanteModel.actividadRiesgos.code, 0).toString();
          this.registroIndependiente.formaPresentacion = 'U';
          this.registroIndependiente.mesada = 0;
          this.registroIndependiente.soportePago = 0;
          this.registroIndependiente.tipoAportante = 3;
          this.registroIndependiente.tipoCuentaDebito = 0;
          this.registroIndependiente.tipoEntidad = 2;
          this.registroIndependiente.tipoPersona = 'N';
          this.registroAportanteService
            .registrarIndependiente(this.registroIndependiente)
            .subscribe(
              (data:any) => {
                this.datosLogin(data);
                if (data['message'] != '-1') {
                  const alert = this.alertBuilder
                    .create({
                      header: 'Alerta',
                      subHeader: 'Registro Aportante',
                      message: 'Registro Exitoso. ' + data['message'],
                      buttons: [
                        {
                          text: 'Aceptar',
                          cssClass: 'asopagos',
                          handler: () => {
                            this.sendMailApp();
                          },
                        },
                      ],
                    })
                    .then((alert) => alert.present());
                } else {
                  const alert = this.alertBuilder
                    .create({
                      header: 'Alerta',
                      subHeader: 'Registro Aportante',
                      message: 'Error. ' + data['value'],
                      buttons: [
                        {
                          text: 'Aceptar',
                          cssClass: 'asopagos',
                          handler: () => {
                            this.registroAportanteModel.showDatosBasicos = false;
                            this.registroAportanteModel.showDatosCotizante = true;
                            this.registroAportanteModel.subTipoCotizante = { code: '5', label: '[5] Cotizante a quien se le ha reconocido indemnización sustitutiva o devolución de saldos'};
                            this.registroAportanteModel.showDatosAdminEpsAfp = false;
                            this.registroAportanteModel.showDatosAdminRiesgosCcf = false;
                            this.registroAportanteModel.showUser = false;
                            this.navCtrl.navigateRoot('/registro-aportante');
                          },
                        },
                      ],
                    })
                    .then((alert) => alert.present());
                }
              },
              (error:Error) => {
                console.error(error);
                loader.dismiss();
              }
            );
        }
      });
    await loader.present();
  }

  datosLogin(data: any) {
    this.storage.set('aportante', {
      nombre:
        this.registroIndependiente.primerNombre +
        ' ' +
        this.registroIndependiente.primerApellido,
      tipoIde: this.registroIndependiente.tipoDocumento,
      numeroIde: this.registroIndependiente.numeroDocumento,
      sucursal: 0,
      ultimoLogueo: new Date().toISOString().substr(0, 10),
    });
    this.storage.set('USER', this.registroIndependiente.usuario);
    setTimeout(() => {
      this.navCtrl.navigateRoot('/tabs/tab1');
    }, 100);
  }



  
  sendMailApp() {
    this.securityProvider.getToken().subscribe(
      (data) => {
        window.localStorage.token = data['token'];
        this.sinapsisService
          .sendMailApp(
            this.registroIndependiente.tipoDocumento,
            this.registroIndependiente.numeroDocumento
          )
          .subscribe((data) => {
            console.log(JSON.stringify(data));
          });
        this.datosLogin(null);
      },
      (error:Error) => {
        console.error(error);
        const alert = this.alertBuilder
          .create({
            header: 'Alerta',
            subHeader: 'Alerta Conección',
            message: String(error), //'Red no disponible. Revisa tu conexión a internet e intenta nuevamente',
            buttons: ['Aceptar'],
          })
          .then((alert) => alert.present());
      }
    );
  }
  
  backDatosAdminCcf(flag: boolean) {
    this.registroAportanteModel.showDatosAdminRiesgosCcf = flag;
    this.registroAportanteModel.showUser = !flag;
    this.registroAportanteModel.showDatosBasicos = !flag;
    this.registroAportanteModel.showDatosCotizante = !flag;
    this.registroAportanteModel.showDatosAdminEpsAfp = !flag;
  }


}
