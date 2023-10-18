import { ActividadRiesgos } from "./acitividad-riesgos";
import { ActividadEconomica } from "./actividad-economica";
import { ClaseRiesgo } from "./clase-riesgo";
import { CodigoAFP } from "./codigo-afp";
import { CodigoCCF } from "./codigo-ccf";
import { CodigoEPS } from "./codigo-eps";
import { CodigoRiesgos } from "./codigo-riesgo-model";
import { Departamentos } from "./departamento";
import { IndicadorTarifaEspecial } from "./indicador-tarifa-especial";
import { ModalidadPago } from "./modalidad-pago";
import { Municipios } from "./municipio";
import { SubTipoCotizante } from "./sub-tipo-cotizante";
import { TarifaAFP } from "./tarifa-afp";
import { TarifaCcf } from "./tarifa-ccf";
import { TarifaEps } from "./tarifa-eps";
import { TipoCotizante } from "./tipo-cotizante";
import { TipoDocumento } from "./tipo-documento";

export interface RegistroIndependiente {
    //Campos Formularios NO mover el orden de estos atributos.
    // Se encuentra según el orden del FormBuilder
    [key: string]: any; // Firma de índice que permite el acceso a cualquier propiedad usando una cadena
    
    //Formulario Datos Basicos del aportante
    municipio: Municipios;
    departamento: Departamentos;
    tipoDocumento: TipoDocumento;
    numeroDocumento: string;
    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;
    email: string;
    telefono: string;
    direccion: string;
    actividadEconomica: ActividadEconomica;
    
    //Formulario Datos Cotizante
    salario: number;  
    extranjeroNoObligadoCotizarPension: boolean;
    fechaIngreso: string | null | undefined;
    tipoCotizante: TipoCotizante;
    cuarentaPorcientoSalario: number;
    subtipoCotizante: SubTipoCotizante; 
    colombianoRadicadoExterior: string;
    fechaRadicacionExterior: string;
    
    //Formulario adminstadoras de EPS y Fondos
    codigoAFP: CodigoAFP;
    tarifaAFP: TarifaAFP;
    codigoEPS: CodigoEPS;
    tarifaEps: TarifaEps;
    indicadorTarifaEspecial: IndicadorTarifaEspecial;
    
    //Formulario administradoras de riesgos laborales
    codigoCCF: CodigoCCF;
    tarifaCCF: TarifaCcf;
    claseRiesgo: ClaseRiesgo;
    codigoRiesgos: CodigoRiesgos;
    actividadRiesgos: ActividadRiesgos;

    // Datos de formulario a los sistemas de Asopagos 
    usuario: string;
    clave: string;
    modalidadPago: ModalidadPago;
    autorizoTratamientoDatos: boolean;

    //Verificar los demás campos
    validacionModalidad:{'code':string,'label':string};
    pensionPeriodoAno: string;
    pensionPeriodoMes: string;
    razonSocial: string;
    digitoVerificacion: number;
    formaPresentacion: string;
    tipoEntidad: number;
    celular: string;   
    concordato: boolean;
    accion: string;
    fechaFinalAccion: string  | null;
    fechaInicioAccion: string  | null;
    tipoAportante: number;
    claseAportante: string;
    tipoPersona: string;
    formaPago: string;
    bancoDebito: number;
    cuentaDebito: number;
    tipoCuentaDebito: number;
    aportaEsapMinedu: string;
    riesgosAdministradora: string;
    centroTrabajoStr: number;
    aportanteExceptuadoPagoModalidadElectronica: boolean;
    fechaFinBloqueo: string;
    causal: string;
    medio: string;
    preUsuario: string; 
    trabajo: string;
    envioInformacionCelular: boolean;
    envioSoportePagoAportante: boolean;
    envioSoportePagoCotizante: boolean;
    tipoReporte: string; 
    exoneradoPagoSaludParafiscales: string;
    mesada: number;
    salarioBasico: number;
    salarioIntegral: string;
    riesgosTarifa: string; 
    codigoOriginador: string;
    soportePago: number;
    nameTipoIdentificacion: string; 
    estadoUsuario: string;
    fax: number;
    
    
}
