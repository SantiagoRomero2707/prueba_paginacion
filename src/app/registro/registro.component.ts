import { Router } from '@angular/router';
// import { Storage } from '@ionic/storage';
// import { API_CONFIG } from 'src/config/api.config';
// import { StdService } from 'src/providers/std.service';
// import { PipesService } from 'src/pipes/pipes.service';
// import { FrontModel } from '../../../models/front-model';
// import { InfoTarifas } from '../../../models/info-tarifas';
// import { CifrasInteres } from '../../../models/cifras-interes';
// import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
// import { PatthersService } from 'src/providers/patthers.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
// import { ConstantesService } from 'src/providers/constantes.service';
// import { SecurityService } from '../../../providers/security.service';
// import { SinapsisService } from '../../../providers/sinapsis.service';
// import { LoadListasService } from '../../../providers/load-listas.service';
// import { ValidateLoginService } from 'src/providers/validate-login.service';
// import { CifrasInteresService } from '../../../providers/cifras-interes.service';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
// import { RegistroValidatorService } from '../../../providers/registro-validator.service';
// import { ValidacionTipoDocumento } from 'src/app/validaciones/validacion-tipo-documento';
// import { RegistroAportanteService } from '../../../providers/registro-aportante.service';
import { FormBuilder, FormGroup, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { RegistroAportante } from '../interfaces/registro-aportante';
import { RegistroIndependiente } from '../interfaces/registro-independiente';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit {
  periodoMin!: String;
  periodoMax!: String;
  ultimoDiaHabil!: number;
  showColombiano!: boolean;
  // infoTarifas: InfoTarifas;
  // cifrasInteres: CifrasInteres;
  showResidenteExterior!: boolean;

  registroIndependiente!: RegistroIndependiente;
  registroAportanteModel!: RegistroAportante;
  
  
  iv!: string;
  bloqueo!: boolean;
  keySecret!: string;
  mensaje: string = '';
  // tokenSinapsis: string;
  // frontModel: FrontModel;
  
  
  require = Validators.compose([Validators.required]); /**requerido */ 
  /*validators1 = [
    Validators.compose([Validators.required, this.celularValido('telefono')]),
    Validators.compose([
      Validators.required,
      Validators.pattern(this.patther.address),
    ]),
    this.require,
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

  constructor(
    private router: Router,
    private storage: Storage,
    //private iab: InAppBrowser,
    //public pipes: PipesService,
    //private busines: StdService,
    private navCtrl: NavController,
    private cdref: ChangeDetectorRef,
    //public patther: PatthersService,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    //private constantes: ConstantesService
    private loadingCtrl: LoadingController,
    //private sinapsisService: SinapsisService,
    //private securityProvider: SecurityService,
    //private loadListasService: LoadListasService,
    //private cifrasInteresService: CifrasInteresService,
    //private validateLoginProvider: ValidateLoginService,
    //private registroValidatorService: RegistroValidatorService,
    //private registroAportanteService: RegistroAportanteService
  ) {
    //this.registroAportanteModel = new RegistroAportanteModel();
    //this.registroIndependiente = new RegistroIndependiente();
    //this.frontModel = new FrontModel();
    //this.cifrasInteres = new CifrasInteres();
    //this.frontModel.title = 'Nuevo Registro';
    //this.frontModel.icono = 'people';

    //this.tokenSinapsis = '';
    //this.topeMininoPPS = 0;
    //this.construirFormularios();
    //this.loadForm();
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  ngOnInit() {
    this.bloqueo = false;
    //this.frontModel.cargarAnio();
    /*this.loadListasService.getListTiposDocumento('empleado').subscribe(
      (data) => {
        this.registroAportanteModel.tipoDocumentoCtrl = new FormControl({
          value: 'CC',
        });
        this.registroAportanteModel.tipoDocumentoModel = {
          descripcion: 'Cédula de Ciudadania',
          tipoDocumento: 'CC',
        };
        this.registroAportanteModel.tipoDocumentosList = data['results'];
      },
      (error) => {
        console.log('Error Consultando Tipos de documento ');
        console.log(error);
      }
    );
    this.getTopeMinimoPPS();
    this.cargarDepartamentos();
    this.cargarEps();*/
  }
  
  irHome() {
    this.navCtrl.navigateRoot('/home');
  }




  /*cargarDepartamentos() {
    this.datosBasicosForm.controls['municipio'].setValue('');
    this.registroAportanteService.obtenerDepartamentos().subscribe(
      (data) => {
        let d = [];
        data.forEach((e) => {
          e.code !== '0' ? d.push(e) : {};
        });
        this.registroAportanteModel.departamentoCtrl = new FormControl({
          value: '',
        });
        this.registroAportanteModel.departamentoModel = { label: '', code: '' };

        console.log(this.registroAportanteModel.departamentoList);
        this.registroAportanteModel.departamentoList = d;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  cargarEps() {
    this.registroAportanteService.obtenerAdministradoraSalud().subscribe(
      (data) => {
        this.registroAportanteModel.codigoEPSCtrl.setValue('');
        this.registroAportanteModel.codigoEPSList = data;
        this.registroAportanteModel.codigoEPSList =
          this.registroAportanteModel.codigoEPSList.filter(
            (e) => e.code != 'MIN004'
          );
      },
      (error) => {
        console.log(error);
      }
    );
  }


  extranjeroChange(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {}





  municipioChange(event: { component: IonicSelectableComponent; value: any }) {
    this.datosBasicosForm.controls['municipio'].setValue(event.value.code);
    this.registroAportanteModel.municipioCtrl.setValue(event.value);
    this.registroAportanteModel.municipioModel.code = event.value.code;
    this.registroAportanteModel.municipioModel.label = event.value.label;
  }



  residenteExteriorChange(event: {
    component: IonicSelectableComponent;
    value: any;
  }) {
    console.log('residenteExteriorChange: ' + event.value);
  }


  getTopeMinimoPPS() {
    this.sinapsisService
      .getParametroInterssi('topeMinimoCotizacionPPS')
      .subscribe(
        (data) => {
          this.topeMininoPPS = Number(data[0]);
          console.log('TopeMininoPPS:' + this.topeMininoPPS);
        },
        (e) => {
          console.log(e);
        }
      );
  }

 










}




  
  /**
   * construimos el formulario

  construirFormularios() {
    this.datosBasicosForm = this.formBuilder.group({
      periodo: ['', Validators.compose([Validators.required])],
      tipoDocumento: [
        this.registroAportanteModel.tipoDocumentoModel,
        Validators.compose([Validators.required]),
      ],
      numeroDocumento: [
        this.registroAportanteModel.numeroDocumento,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]{3,16}'),
        ]),
      ],
      primerNombre: ['', Validators.compose([Validators.required])],
      segundoNombre: ['', ''],
      primerApellido: ['', Validators.compose([Validators.required])],
      segundoApellido: ['', ''],

      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.patther.email),
        ]),
      ],
      actividadEconomica: ['', ''],
      telefono: ['', this.validators1[0]],
      direccion: ['', this.validators1[1]],
      departamento: ['', this.validators1[2]],
      municipio: ['', this.validators1[2]],

      // cot69DiasCtrl: ['', c69?Validators.compose([Validators.required]):[]],
      // cot69ValorCtrl: ['', c69?Validators.compose([Validators.required]):[]]
    });

    this.datosCotizanteForm = this.formBuilder.group({
      tipoCotizante: ['', Validators.compose([Validators.required])],
      subTipoCotizante: ['', Validators.compose([Validators.required])],
      residenteExterior: ['', ''],
      fechaRadicacionExt: ['', ''],
      extranjero: ['', ''],
      salario: ['', Validators.compose([Validators.required])],
      cuarentaSalario: ['', Validators.compose([Validators.required])],
      fechaIngreso: ['', Validators.compose([Validators.required])],
    });

    this.datosAdminEpsAfpForm = this.formBuilder.group({
      codigoAFP: ['', Validators.compose([Validators.required])],
      indicadorTarifaEspecial: ['', Validators.compose([Validators.required])],
      tarifaAfp: ['', Validators.compose([Validators.required])],
      codigoEPS: ['', Validators.compose([Validators.required])],
      tarifaEps: ['', Validators.compose([Validators.required])],
    });

    this.datosAdminRiesgosCcfForm = this.formBuilder.group({
      codigoRiesgos: [
        '',
        Validators.compose([Validators.required, Validators.minLength(1)]),
      ],
      claseRiesgo: ['', Validators.compose([Validators.required])],
      codigoCCF: ['', Validators.compose([Validators.required])],
      tarifaCcf: ['', Validators.compose([Validators.required])],
      actividadRiesgos: ['', this.validators1[3]],
    });

    this.datosUsuarioForm = this.formBuilder.group({
      modalidadPago: ['', Validators.compose([Validators.required])],
      usuario: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6)]),
        Validators.composeAsync([
          this.registroValidatorService.validateUser.bind(
            this.registroAportanteModel.usuarioCtrl
          ),
        ]),
      ],
      clave: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[$@$!%*#?¡.&_-])[A-Za-z\d$@$!%*#?¡.&_-]{8,16}$/
          ),
        ]),
      ],
      confirmarClave: [
        '',
        Validators.compose([Validators.required, this.equalto('clave')]),
      ],

      autorizoTratamientoDatos: [
        '',
        Validators.compose([Validators.required, this.tratamientoData()]),
      ],
    });
    this.registroAportanteModel.periodoCtrl =
      this.datosBasicosForm.controls['periodo'];
    this.registroAportanteModel.tipoDocumentoCtrl =
      this.datosBasicosForm.controls['tipoDocumento'];
    this.registroAportanteModel.numeroDocumentoCtrl =
      this.datosBasicosForm.controls['numeroDocumento'];
    this.registroAportanteModel.primerNombreCtrl =
      this.datosBasicosForm.controls['primerNombre'];
    this.registroAportanteModel.segundoNombreCtrl =
      this.datosBasicosForm.controls['segundoNombre'];
    this.registroAportanteModel.primerApellidoCtrl =
      this.datosBasicosForm.controls['primerApellido'];
    this.registroAportanteModel.segundoApellidoCtrl =
      this.datosBasicosForm.controls['segundoApellido'];
    this.registroAportanteModel.emailCtrl =
      this.datosBasicosForm.controls['email'];
    this.registroAportanteModel.telefonoCtrl =
      this.datosBasicosForm.controls['telefono'];
    this.registroAportanteModel.direccionCtrl =
      this.datosBasicosForm.controls['direccion'];
    this.registroAportanteModel.departamentoCtrl =
      this.datosBasicosForm.controls['departamento'];
    this.registroAportanteModel.municipioCtrl =
      this.datosBasicosForm.controls['municipio'];
    this.registroAportanteModel.actividadEconomicaCtrl =
      this.datosBasicosForm.controls['actividadEconomica'];
    // this.registroAportanteModel.cot69DiasCtrl = this.datosBasicosForm.controls['cot69Dias'];
    // this.registroAportanteModel.cot69ValorCtrl = this.datosBasicosForm.controls['cot69Valor'];
    //form 2
    this.registroAportanteModel.tipoCotizanteCtrl =
      this.datosCotizanteForm.controls['tipoCotizante'];
    this.registroAportanteModel.subTipoCotizanteCtrl =
      this.datosCotizanteForm.controls['subTipoCotizante'];
    this.registroAportanteModel.residenteExteriorCtrl =
      this.datosCotizanteForm.controls['residenteExterior'];
    this.registroAportanteModel.fechaRadicacionExtCtrl =
      this.datosCotizanteForm.controls['fechaRadicacionExt'];
    this.registroAportanteModel.extranjeroCtrl =
      this.datosCotizanteForm.controls['extranjero'];
    this.registroAportanteModel.salarioCtrl =
      this.datosCotizanteForm.controls['salario'];
    this.registroAportanteModel.cuarentaSalarioCtrl =
      this.datosCotizanteForm.controls['cuarentaSalario'];
    this.registroAportanteModel.fechaIngresoCtrl =
      this.datosCotizanteForm.controls['fechaIngreso'];
    //form 3
    this.registroAportanteModel.codigoAFPCtrl =
      this.datosAdminEpsAfpForm.controls['codigoAFP'];
    this.registroAportanteModel.indicadorTarifaEspecialCtrl =
      this.datosAdminEpsAfpForm.controls['indicadorTarifaEspecial'];
    this.registroAportanteModel.tarifaAfpCtrl =
      this.datosAdminEpsAfpForm.controls['tarifaAfp'];
    this.registroAportanteModel.codigoEPSCtrl =
      this.datosAdminEpsAfpForm.controls['codigoEPS'];
    this.registroAportanteModel.tarifaEpsCtrl =
      this.datosAdminEpsAfpForm.controls['tarifaEps'];
    //form 4
    this.registroAportanteModel.codigoRiesgosCtrl =
      this.datosAdminRiesgosCcfForm.controls['codigoRiesgos'];
    this.registroAportanteModel.claseRiesgoCtrl =
      this.datosAdminRiesgosCcfForm.controls['claseRiesgo'];
    this.registroAportanteModel.actividadRiesgosCtrl =
      this.datosAdminRiesgosCcfForm.controls['actividadRiesgos'];
    this.registroAportanteModel.codigoCCFCtrl =
      this.datosAdminRiesgosCcfForm.controls['codigoCCF'];
    this.registroAportanteModel.tarifaCcfCtrl =
      this.datosAdminRiesgosCcfForm.controls['tarifaCcf'];
    //form 5
    this.registroAportanteModel.modalidadPagoCtrl =
      this.datosUsuarioForm.controls['modalidadPago'];
    this.registroAportanteModel.usuarioCtrl =
      this.datosUsuarioForm.controls['usuario'];
    this.registroAportanteModel.claveCtrl =
      this.datosUsuarioForm.controls['clave'];
    this.registroAportanteModel.confirmarClaveCtrl =
      this.datosUsuarioForm.controls['confirmarClave'];
    this.registroAportanteModel.autorizoTratamientoDatosCtrl =
      this.datosUsuarioForm.controls['autorizoTratamientoDatos'];
  }   */
}