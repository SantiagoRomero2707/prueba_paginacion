import { Component, OnInit } from '@angular/core';
import { FormularioBuilder } from '../forms.builder';
import { FormGroup, Validators } from '@angular/forms';
import { TarifaAFP } from 'src/app/interfaces/tarifa-afp';
import { InfoTarifas } from 'src/app/interfaces/info-tarifa';
import { PatthersService } from 'src/services/patthers.service';
import { RegistroAportante } from 'src/app/interfaces/registro-aportante';

@Component({
  selector: 'app-datos-afp-eps',
  templateUrl: './datos-afp-eps.component.html',
  styleUrls: ['./datos-afp-eps.component.scss'],
})

export class DatosAfpEpsComponent  implements OnInit {
  
  infoTarifas!: InfoTarifas;
  formularioDatosAdminEpsAfp: FormGroup;
  registroAportanteModel!: RegistroAportante;
  require = Validators.compose([Validators.required]); /**requerido */

  constructor(private patther: PatthersService, private formBuilder:FormularioBuilder) {
    this.formularioDatosAdminEpsAfp = this.formBuilder.construirFormularioRegistro(); 
   }

  ngOnInit() {}

  validators1 = [
    Validators.compose([Validators.required, this.formBuilder.celularValido()]),
    Validators.compose([Validators.required, Validators.pattern(this.patther.address),]),
    this.require,Validators.compose([Validators.required,Validators.pattern(this.patther.actividadRiesgos), Validators.pattern(this.patther.cero),]),
    Validators.compose([ Validators.required,Validators.pattern(this.patther.actividadSinRiesgos)]),
  ];

  codigoAfpChange(event: any) {}

  indicadorTarifaEspecialChange() {
    this.cargarTarifasAfp(this.registroAportanteModel.codigoAFP.code);
    this.registroAportanteModel.tarifaAFP.code = null;
    // this.registroAportanteModel.tarifaAFP.setValue(''); Revisar esta linea de código
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
        this.formularioDatosAdminEpsAfp.get('datosTipoCotizante')?.get('cuarentaSalarioCtrl')?.value,
        this.registroAportanteModel.tarifaAFP.code,
        'AFP',
        this.registroAportanteModel.tipoCotizante.code,
        this.registroAportanteModel.subTipoCotizante.code,
        false,
        this.formularioDatosAdminEpsAfp.get('datosTipoCotizante')?.get('fechaIngresoCtrl')?.value.substring(0,10),
        this.formularioDatosAdminEpsAfp.get('datosTipoCotizante')?.get('fechaIngresoCtrl')?.value.substring(0, 7),
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

  
  public cargarTarifasEps(event:any) {
    this.infoTarifas.tipoCotizante = this.registroAportanteModel.tipoCotizante;
    this.infoTarifas.subtipoCotizante = this.registroAportanteModel.subTipoCotizante;
    this.infoTarifas.colext = this.formularioDatosAdminEpsAfp.get('datosTipoCotizante')?.get('residenteExteriorCtrl')?.value
    this.infoTarifas.departamento = this.registroAportanteModel.departamento;
    this.infoTarifas.diferenciaAnos = '0';
    this.infoTarifas.codigoEPS = event.value.code;
    this.infoTarifas.novedadSln = '';
    this.infoTarifas.tipoEntidad = 2;
    this.infoTarifas.tipoPlanilla = 'I';
    this.infoTarifas.claseAportante = 'I';
    this.infoTarifas.anoPeriodoSubsistema = this.registroAportanteModel.periodo.split('-')[0];
    this.infoTarifas.mesPeriodoSubsistema = this.registroAportanteModel.periodo.split('-')[1];
    this.infoTarifas.aportanteExonerado = 'false';
    this.infoTarifas.cotizanteExonerado = 'false';
    this.infoTarifas.nroDocumentoAportante =
    this.formularioDatosAdminEpsAfp.get('datosBasicoAportante')?.get('numeroDocumentoCtrl')?.value
    if (this.registroAportanteModel.tipoCotizante.code != '66') {
      this.registroAportanteService
        .obtenerTarifasSalud(this.infoTarifas)
        .subscribe(
          (data: any) => {
            this.registroAportanteModel.tarifaEpsList = data;
          },
          (error:Error) => {
            console.error(error);
          }
        );
    }
  }

  calcularTotalEPS() {
    this.registroAportanteModel.showPagoEps = true;
    this.registroAportanteService
      .calcularCotizacion(
        this.registroAportanteModel.cuarentaSalario,
        this.registroAportanteModel.tarifaEps.code,
        'EPS',
        this.registroAportanteModel.tipoCotizante.code,
        this.registroAportanteModel.subTipoCotizante.code,
        false,
        this.registroAportanteModel.fechaIngreso.substring(0, 10),
        this.registroAportanteModel.fechaIngreso.substring(0, 7)
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

  backDatosCotizante() {
    this.registroAportanteModel.showDatosBasicos = false;
    this.registroAportanteModel.showDatosCotizante = true;
    this.registroAportanteModel.showDatosAdminEpsAfp = false;
  }

  irDatosAdminRiesgosCcf(flag: boolean) {
    this.registroAportanteModel.showDatosAdminRiesgosCcf = flag;
    this.registroAportanteModel.showDatosBasicos = !flag;
    this.registroAportanteModel.showDatosCotizante = !flag;
    this.registroAportanteModel.showDatosAdminEpsAfp = !flag;
    if (this.registroAportanteModel.tipoCotizante.code == '66') {
      this.formularioDatosAdminEpsAfp.get('tarifaCCFCtrl')?.disable();
      this.formularioDatosAdminEpsAfp.get('codigoCCFCtrl')?.disable();
    }
    this.registroAportanteModel.tarifaCCF = { code: '0.0', label: '0' };
    this.registroAportanteModel.codigoCCF = { code: 'SINCCF', label: 'Sin Aporte' };
    this.mostrarRiesgos();
  }

  

  mostrarRiesgos() {
    if (
      ['57', '59'].includes(this.registroAportanteModel.tipoCotizante.code)
    ) {
      this.registroAportanteModel.ShowRiesgos = true;
      this.formularioDatosAdminEpsAfp.get('datosAdminstradoraRiesgo')?.get('codigoRiesgosCtrl')?.setValue(null);
      this.formularioDatosAdminEpsAfp.get('datosAdminstradoraRiesgo')?.get('claseRiesgoCtrl')?.setValue('0-0');
      this.registroAportanteModel.codigoRiesgos = { code: null, label: '' };
      this.registroAportanteModel.claseRiesgo = { code: null, label: '' };
    } else {
      this.registroAportanteModel.ShowRiesgos = false;
      this.formularioDatosAdminEpsAfp.get('datosAdminstradoraRiesgo')?.get('codigoRiesgosCtrl')?.setValue('SINARP');
      this.formularioDatosAdminEpsAfp.get('datosAdminstradoraRiesgo')?.get('claseRiesgoCtrl')?.setValue('0-0');
      this.registroAportanteModel.codigoRiesgos = { code: 'SINARP', label: 'SINARP'};
      this.registroAportanteModel.claseRiesgo = { code: '0-0', label: '0'};
    }
    setTimeout(() => {
      this.valArl();
      this.setActRi();
    });

    if (this.registroAportanteModel.tipoCotizante.code == '59') {
      //this.clasesRiesgo = this.clasesRiesgoIni.filter(c=>c.code.split("-")[0]!=4 && c.code.split("-")[0]!=5);
      this.registroAportanteModel.claseRiesgoList =
        this.registroAportanteModel.claseRiesgoList.filter(
          (c:any) => c.code.split('-')[0] != 4 && c.code.split('-')[0] != 5
        );
    } else {
      //this.clasesRiesgo = this.clasesRiesgoIni;
    }

    if (
      this.registroAportanteModel.tipoCotizante.code == '57' &&
      (this.registroAportanteModel.subTipoCotizante.code == '11' ||
        this.registroAportanteModel.subTipoCotizante.code == '12')
    ) {
      this.registroAportanteModel.claseRiesgoList =
        this.registroAportanteModel.claseRiesgoList.filter(
          (c:any) => c.code.split('-')[0] == 4
        );
    }
  }

  //REVISAR ESTA VALIDACIÓN
  public valArl() {
    this.formularioDatosAdminEpsAfp.get('datosAdministradoraRiesgo')?.get('codigoRiesgoCtrl')?.updateValueAndValidity();
    this.formularioDatosAdminEpsAfp.get('datosAdministradoraRiesgo')?.get('claseRiesgoCtrl')?.updateValueAndValidity();
    this.formularioDatosAdminEpsAfp.get('datosAdministradoraRiesgo')?.get('actividadRiesgosCtrl')?.updateValueAndValidity();
  }

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

  /** defino el valor de actividad riesgos según la condición */
  public setActRi(){
      setTimeout(() => {
        let r =  this.formularioDatosAdminEpsAfp.controls['actividadRiesgosCtrl'];
        r.clearValidators();
        this.formularioDatosAdminEpsAfp.get('datosAdministradoraRiesgo')?.get('claseRiesgoCtrl')?.setValue(this.validarActividadRiesgos()?'':{code:'0', label:'0'});
        r.setValidators(this.validators1[(this.validarActividadRiesgos()?3:
        (this.registroAportanteModel.tipoCotizante.code == '3' ? 2:4))]);
        r.updateValueAndValidity();
      });
    }
}
