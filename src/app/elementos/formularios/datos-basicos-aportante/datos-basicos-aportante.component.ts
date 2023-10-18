import { Component, OnInit } from '@angular/core';
import { FormularioBuilder } from '../forms.builder';
import { AlertController, NavController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistroAportante } from 'src/app/interfaces/registro-aportante';

@Component({
  selector: 'app-datos-basicos-aportante',
  templateUrl: './datos-basicos-aportante.component.html',
  styleUrls: ['./datos-basicos-aportante.component.scss'],
})
export class DatosBasicosAportanteComponent  implements OnInit {
  
  bloqueo!: boolean;
  mensaje: string = '';
  cotizante69: boolean = false;
  formularioDatosBasicos: FormGroup;

  registroAportanteModel!: RegistroAportante;
  constructor
  (
    //private busines: StdService,
    private navCtrl: NavController,
    private alertBuilder: AlertController, 
    private formBuilder:FormularioBuilder, 
    ) { 
      this.formularioDatosBasicos = this.formBuilder.construirFormularioRegistro(); 
  }
  
  ngOnInit() {}  
  
    /** Validaciones de correo */
    public correoValidar = (correo: string): boolean => {
      return ![' ', 'ñ', 'Ñ', ''].includes(correo);
    };
  
    /** Lista undefined? */
    public listUnDef = (atributo: string):boolean => {
      return this.registroAportanteModel[atributo] === undefined;
    }
  
    /** modelo seleccionado tiene code? */ 
    public ModelCode = (dato: string) => {
      this.registroAportanteModel[dato] !== undefined &&
        this.registroAportanteModel[dato].code !== undefined &&
        this.registroAportanteModel[dato].code.toString().trim().length > 0;
    }
    /** Alerta de correo invalido */
    public correoInvalido = (): void =>{
      this.alertBuilder.create({
        header: 'Alerta',
        subHeader: 'Validacion Registro',
        message: 'El correo no puede contener espacios, ñ Ñ.',
        buttons: ['Aceptar'],
      })
      .then((alert) => alert.present());
    }
  
  /** alerta de aportante registrado*/ 
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

  public cargarFormulario() {
    this.registroAportanteModel.tipoDocumento = this.registroAportanteModel.tipoDocumento;
    this.registroAportanteModel.numeroDocumento = this.formularioDatosBasicos.controls['numeroDocumento'].value;
    this.registroAportanteModel.primerNombre = this.formularioDatosBasicos.controls['primerNombre'].value;
    this.registroAportanteModel.segundoNombre = this.formularioDatosBasicos.controls['segundoNombre'].value;
    this.registroAportanteModel.primerApellido = this.formularioDatosBasicos.controls['primerApellido'].value;
    this.registroAportanteModel.segundoApellido = this.formularioDatosBasicos.controls['segundoApellido'].value;
    this.registroAportanteModel.direccion = this.formularioDatosBasicos.controls['direccion'].value;
    this.registroAportanteModel.departamento = this.registroAportanteModel.departamento;
    this.registroAportanteModel.actividadEconomica = this.registroAportanteModel.actividadEconomica;
    this.registroAportanteModel.municipio =  this.registroAportanteModel.municipio;
  }


  public loadControl(name: string, validate: boolean) {
    validate ? this.formularioDatosBasicos.controls[name].setValue('') : {};
    this.formularioDatosBasicos.controls[name].clearValidators();
    this.formularioDatosBasicos.controls[name].setValidators(
      validate ? [Validators.required] : []
    );
    this.formularioDatosBasicos.controls[name].updateValueAndValidity();
  }

  public consultarBDUA() {
    const periodoControl = this.formularioDatosBasicos.get('periodoCtrl');
    if (periodoControl) {
      this.registroAportanteModel.periodo = periodoControl.value.substring(0, 7);
    } else {
      this.registroAportanteModel.periodo = '';
      console.error("El control 'periodoCtrl' no se encontró en el formulario.");
    }
    this.cargarFormulario();
    this.bloqueo = true;
    this.loadControl('actividadEconomica', false);
    let setNombres = (data: any, eps: boolean = true, variable: string) => {
      if (this.cotizante69) {
        this.loadControl('actividadEconomica', true);
      } else {
        this.loadControl('actividadEconomica', false);
      }
      this.registroAportanteModel.showNames =
        data['primerNombre' + variable] === undefined ||
        data['primerNombre' + variable] == null ||
        data['primerNombre' + variable] == 'null';
      
        this.formularioDatosBasicos.get('primerNombreCtrl')?.setValue(
          this.pipes.toUpper(data['primerNombre' + variable])
        );

        this.formularioDatosBasicos.get('segundoNombreCtrl')?.setValue(
          this.pipes.toUpper(data['segundoNombre' + variable])
        );

        this.formularioDatosBasicos.get('primerApellidoCtrl')?.setValue(
          this.pipes.toUpper(data['primerApellido' + variable])
        );

        this.formularioDatosBasicos.get('segundoApellidoCtrl')?.setValue(
          this.pipes.toUpper(data['segundoApellido' + variable])
        );
        
      eps? this.formularioDatosBasicos.get('codigoEPSCtrl')?.setValue(data['codigoEps']): {};
      if (this.cotizante69) {
        this.registroAportanteModel.cot69Dias = data['diasCotizados'];
        this.registroAportanteModel.cot69Valor = data['valorLiquidado'];
      }
    };

    if (this.registroAportanteModel.numeroDocumento != '') {
      this.registroValidatorService
        .validatePreRegistro(
          this.registroAportanteModel.tipoDocumento,
          this.registroAportanteModel.numeroDocumento
        )
        .then((data:any) => {
          console.log(data);
          if (data) {
            this.usuarioRegistradoAlerta();
          } else {
            this.registroAportanteService
              .validarNumeroDocumento(
                this.registroAportanteModel.tipoDocumento.tipoDocumento,
                this.registroAportanteModel.numeroDocumento
              )
              .subscribe((data:any) => {
                if (data['label'] != null && data['label'] != '') {
                  const alert = this.alertBuilder
                    .create({
                      header: 'Alerta',
                      subHeader: 'Validacion Registro',
                      message: data['label'],
                      buttons: ['OK'],
                    })
                    .then((alert) => {
                      alert.present();
                      this.bloqueo = false;
                    });
                } else {
                  this.registroAportanteService
                    .obtenerBDUA(
                      this.registroAportanteModel.tipoDocumento.tipoDocumento,
                      this.registroAportanteModel.numeroDocumento
                    )
                    .subscribe(
                      (data:any) => {
                        // console.log("consultarBDUA: "+ JSON.stringify(data));
                        this.formularioDatosBasicos.get('codigoEPSCtrl')?.enable();
                        if (data != null) {
                          setNombres(data, true, '');
                          if (data['coincidencia'] == 1) {
                            this.formularioDatosBasicos.get('codigoEPSCtrl')?.setValue(
                              new FormControl({
                                value: data['codigoEps'],
                                disabled: true,
                              })
                            ) 
                          
                            this.registroAportanteModel.codigoEPS = { code: data['codigoEps'].toString(), label: data['nombreEps'].toString()};
                          }
                        } else {
                          this.registroAportanteModel.showNames = true;
                        }
                      },
                      (error: Error) => {
                        console.error('Error Consultando consultarBDUA:' + error);
                      }
                    );
                  this.registroAportanteModel.showBotonBDUA = true;
                }
                this.busines
                  .get(
                    'persona/' + 
                    this.registroAportanteModel.tipoDocumento.tipoDocumento + '/' + 
                    this.registroAportanteModel.numeroDocumento + '/' + 
                    this.registroAportanteModel.periodo,
                    true
                  )
                  .subscribe(
                    (da: any) => {
                      if (da !== null) {
                        this.cotizante69 =
                          da.cotizanteContribucionSolidaria === undefined
                            ? false
                            : da.cotizanteContribucionSolidaria;
                        if (this.cotizante69) {
                          //Pendiente ajustar con HU
                          const alert = this.alertBuilder
                            .create({
                              cssClass: 'alert-ion-mes',
                              header: 'Apreciado usuario',
                              subHeader:
                                'Usted se encuentra incluido en la base de datos de contribución solidaria, ¿Desea registrarse como cotizante 69?',
                              message: data['label'],
                              buttons: [
                                {
                                  text: 'Si',
                                  cssClass: 'primary',
                                  handler: () => {
                                    this.cargarActividadEconomica();
                                    setNombres(da, false, 'ContS');
                                  },
                                },
                                {
                                  text: 'No',
                                  cssClass: 'secondary',
                                  handler: () => {
                                    this.cotizante69 = false;
                                    setNombres(da, false, '');
                                  },
                                },
                              ],
                            })
                            .then((alert) => {
                              alert.present();
                              this.bloqueo = true;
                            });
                        }
                        setNombres(da, false, '');
                      }
                    },
                    (error: Error) => {
                      console.error('Error,',error)
                    }
                  );
              });
          }
        });
      this.consultarRUAF();
    }
  }

  
  /**
   * construimos los formularios acorde a la necesidad
   */
  cargarActividadEconomica() {
    this.busines.get('lists/ACTIVIDAD_ECONOMICA').subscribe(
      (data:any) => {
        this.formularioDatosBasicos.controls['actividadEconomica'].setValue('');
        this.registroAportanteModel.actividadEconomicaList = data;
      },
      (error:Error) => {
        console.error(error);
      }
    );
  }


  
  consultarRUAF() {
    console.log('RUAF');
    this.registroAportanteService
      .obtenerRUAF(
        this.formularioDatosBasicos.get('tipoDocumentoCtrl'),
        this.formularioDatosBasicos.get('numeroDocumentoCtrl')?.value
      )
      .subscribe(
        (data:any) => {
          if (data != null) {
            this.formularioDatosBasicos.get('codigoAFPCtrl')?.setValue(
              data['codigoAfp']
            );
            //this.fechaAfiliacionRuaf = data['fechaAfiliacion'];
            this.formularioDatosBasicos.get('codigoAFPCtrl')?.setValue(
              new FormControl({
                value: data['codigoAfp'],
                disabled: true,
              })
            ) 
            this.registroAportanteModel.codigoAFP = {code: data['codigoAfp'], label: data['nombreAfp']};
            //this.cargarTarifasAfp(this.codigoAfpModel.code);
          }
        },
        (error: Error) => {
          console.error('Error Consultando consultarRUAF:' + error);
        }
      );
  }


  irDatosCotizante(datosBasicos: boolean) {
    if (datosBasicos) {
      this.registroAportanteModel.showDatosBasicos = !datosBasicos;
      this.registroAportanteModel.showDatosCotizante = datosBasicos;
      let tipoDoc =
        this.registroAportanteModel.tipoDocumento.tipoDocumento;
      if (['CE', 'PA', 'CD', 'DC'].includes(tipoDoc)) {
        this.registroAportanteModel.showExtranjero = true;
        this.registroAportanteModel.showColombiano = true;
      } else if (['CC', 'TI'].includes(tipoDoc)) {
        this.registroAportanteModel.showColombiano = true;
      } else if (tipoDoc == 'PT') {
        this.registroAportanteModel.showExtranjero = true;
        this.registroAportanteModel.showColombiano = false;
      }
      //inicializa campos
      if (this.cotizante69) {
        this.registroAportanteModel.tipoCotizante = {code: '69', label: '[69] Contribución solidaria'};
        this.formularioDatosBasicos.get('tipoCotizanteCtrl')?.setValue(
          new FormControl({
                  value: '69',
                  disabled: true,
                })
        )
        this.registroAportanteModel.codigoEPS = { code: 'MIN004', label: 'MIN004'};
        this.registroAportanteModel.codigoAFP = { code: 'SINAFP', label: 'SINAFP'};
        this.registroAportanteModel.codigoCCF = { code: 'SINCCF', label: 'SINCCF'};
        this.formularioDatosBasicos.get('codigoRiesgosCtrl')?.setValue('SINARP');
        this.formularioDatosBasicos.get('claseRiesgoCtrl')?.setValue('0-0');
        this.registroAportanteModel.codigoRiesgos = { code: 'SINARP', label: 'SINARP'};
        this.registroAportanteModel.claseRiesgo = { code: '0-0', label: '0'};
        this.registroAportanteModel.tarifaAFP = { code: '0.0', label: '0%'};
        this.registroAportanteModel.tarifaEps = { code: '0.0', label: '0%'};
        this.registroAportanteModel.tarifaCCF = { code: '0.0', label: '0%'};
      } else {
        if (
          !this.formularioDatosBasicos.get('tipoCotizanteCtrl')?.disabled &&
          this.listUnDef('tipoCotizanteList')
        ) {
          this.registroAportanteService
            .obtenerTipoCotizante(
              tipoDoc,
              this.registroAportanteModel.numeroDocumento
            )
            .subscribe(
              (data:any) => {
                let per = new Date().toISOString().substr(0, 7);
                console.log(per, this.registroAportanteModel.periodo);
                data = data.filter((c:any) => c.code != '65');
                this.registroAportanteModel.tipoCotizanteList = data;
                this.registroAportanteModel.tipoCotizanteList =
                  this.registroAportanteModel.tipoCotizanteList.filter(
                    (c) =>
                      c.code != '69' &&
                      (this.registroAportanteModel.periodo === per
                        ? true
                        : c.code != '66')
                  ); // el cot 66 solo aparece en el periodo actual
                this.formularioDatosBasicos.get('tipoCotizanteCtrl')?.setValue(
                  new FormControl({
                    value: '3',
                    disabled: true,
                  })
                ) 
                this.registroAportanteModel.tipoCotizante = { label: '[3] Independiente', code: '3'};
              },
              (error:Error) => {
                console.error(error);
              }
            );
        }
      }

      this.registroAportanteService
        .obtenerSubtipoCotizante(this.registroAportanteModel.tipoDocumento.tipoDocumento, this.registroAportanteModel.numeroDocumento,'3')
        .subscribe(
          (data:any) => {
            setTimeout(() => {
              this.val2();
            }, 100);
            let encontro = data.filter((c:any) => c.code == '5');
            if (encontro.length > 0) {
              // this.registroAportanteModel.subTipoCotizanteCtrl = new FormControl({ value: '5' });
              this.registroAportanteModel.subTipoCotizante = encontro[0];
              this.registroAportanteModel.subTipoCotizanteList = encontro;
            } else {
              let coincide = data.filter(
                (c:any) =>
                  c.code ==
                  this.registroAportanteModel.subTipoCotizante.code
              );
              if (!this.ModelCode('subTipoCotizanteModel') || !coincide) {
                this.formularioDatosBasicos.get('subTipoCotizanteCtrl')?.setValue('0');
                this.registroAportanteModel.subTipoCotizante = {code: '0',label: '[0] Sin Subtipo'};
                this.registroAportanteModel.subTipoCotizanteList = data;
              }
            }
          },
          (error:Error) => {
            console.error(error);
          }
        );

      /*this.registroAportanteModel.tipoCotizante = this.registroAportanteModel.tipoCotizanteModel.code;
      this.registroAportanteModel.subTipoCotizante = this.registroAportanteModel.subTipoCotizanteModel.code;
      this.registroAportanteModel.residenteExterior = this.datosCotizanteForm.controls['residenteExterior'].value;
      this.registroAportanteModel.fechaRadicacionExterior = this.datosCotizanteForm.controls['fechaRadicacionExt'].value;
      this.registroAportanteModel.salario = this.datosCotizanteForm.controls['salario'].value;
      this.registroAportanteModel.cuarentaSalario = this.datosCotizanteForm.controls['cuarentaSalario'].value;
      this.registroAportanteModel.fechaIngreso = this.datosCotizanteForm.controls['fechaIngreso'].value;
      this.registroAportanteModel.residenteExteriorCtrl.setValue('false');
      this.registroAportanteModel.extranjeroCtrl.setValue('false');*/
    }
    setTimeout(() => {
      this.val2();
    }, 100);
  }


  val2() {
    this.formularioDatosBasicos.get('datosTipoCotizante')?.get('tipoCotizanteCtrl')?.setValue(this.registroAportanteModel.tipoCotizante.code);
    this.formularioDatosBasicos.get('datosTipoCotizante')?.get('tipoCotizanteCtrl')?.updateValueAndValidity;
    this.formularioDatosBasicos.get('datosTipoCotizante')?.get('subTipoCotizanteCtrl')?.setValue(this.registroAportanteModel.subTipoCotizante.code);
    this.formularioDatosBasicos.get('datosTipoCotizante')?.get('subTipoCotizanteCtrl')?.updateValueAndValidity;
  }


  municipioChange(event:any) {
    this.formularioDatosBasicos.controls['municipio'].setValue(event.value.code);
    this.registroAportanteModel.municipioCtrl.setValue(event.value);
    this.registroAportanteModel.municipioModel.code = event.value.code;
    this.registroAportanteModel.municipioModel.label = event.value.label;
  }

  tipoDocumentoChange(event: any) {
    this.mensaje = '';
    this.frontModel.minFecha = event.value.tipoDocumento == 'PT' ? '2021-09-01' : '1995-01-01';
    this.formularioDatosBasicos.controls['tipoDocumento'].setValue(event.value);
    this.formularioDatosBasicos.controls['numeroDocumento'].setValue('');
    this.formularioDatosBasicos.controls['numeroDocumento'].setErrors({
      incorrect: true,
    });
    this.formularioDatosBasicos.controls['numeroDocumento'].setValidators([
      Validators.required,
      Validators.pattern(ValidacionTipoDocumento.obtenerPattern(event.value.tipoDocumento)),
    ]);
  }

  
  numeroDocumentoChange(event: any) {
    if (this.formularioDatosBasicos.controls['tipoDocumento'].value !== null) {
      let tipoDoc =
        this.formularioDatosBasicos.controls['tipoDocumento'].value.tipoDocumento;
      let numDoc = this.formularioDatosBasicos.get('numeroDocumento')?.value;
      let regex = new RegExp('[0-9]+');
      !regex.test(numDoc)? this.formularioDatosBasicos.get('datosBasicoAportante')?.get('numeroDocumentoCtrl')?.setErrors({
            incorrect: true,
          })
        : {};
      this.mensaje =
        !this.formularioDatosBasicos.get('numeroDocumento')?.hasError('pattern') &&
        regex.test(numDoc)
          ? ''
          : ValidacionTipoDocumento.obtenerMensaje(tipoDoc);
    }
  }

  cargarMunicipios(event: any) {
    this.formularioDatosBasicos.controls['departamento'].setValue(event.value.code);
    this.registroAportanteModel.departamentoModel.code = event.value.code;
    this.registroAportanteModel.departamentoModel.label = event.value.label;
    this.registroAportanteModel.municipioList = undefined;
    this.registroAportanteModel.municipioCtrl = new FormControl({ value: '' });
    this.registroAportanteModel.municipioModel = { label: '', code: '' };
    this.registroAportanteService.obtenerMunicipios(event.value.code).subscribe(
      (data:any) => {
        this.registroAportanteModel.municipioList = data;
      },
      (error:Error) => {
        console.log(error);
      }
    );
    this.obtenerCajas(event.value.code);
  }

  actividadEconomicaChange(event:any) {
    this.formularioDatosBasicos.get('datosBasicoAportante')?.get('actividadEconomicaCtrl')?.setValue(event.value.code);
    this.registroAportanteModel.actividadEconomica.code = event.value.code;
    this.registroAportanteModel.actividadEconomica.label = event.value.label;
  }

  obtenerCajas(departamento:string) {
    this.registroAportanteService
      .obtenerAdministradoraCajaByDpto(departamento)
      .subscribe(
        (data:any) => {
          this.registroAportanteModel.codigoCCFList = data;
        },
        (error:Error) => {
          console.error(error);
        }
      );
  }

}
