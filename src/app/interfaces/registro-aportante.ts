import { Sucursal } from "./sucursal";
import { TarifaAFP } from "./tarifa-afp";
import { Municipios } from "./municipio";
import { CodigoAFP } from "./codigo-afp";
import { CodigoCCF } from "./codigo-ccf";
import { CodigoEPS } from "./codigo-eps";
import { TarifaCcf } from "./tarifa-ccf";
import { TarifaEps } from "./tarifa-eps";
import { ClaseRiesgo } from "./clase-riesgo";
import { Departamentos } from "./departamento";
import { TipoCotizante } from "./tipo-cotizante";
import { TipoDocumento } from "./tipo-documento";
import { ModalidadPago } from "./modalidad-pago";
import { PrestadorasCCF } from "./prestadora-ccf";
import { CodigoRiesgos } from "./codigo-riesgo-model";
import { SubTipoCotizante } from "./sub-tipo-cotizante";
import { ActividadEconomica } from "./actividad-economica";
import { IndicadorTarifaEspecial } from "./indicador-tarifa-especial";
import { ActividadRiesgos } from "./acitividad-riesgos";

export interface RegistroAportante{
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
    periodo: string;
    email: string;
    telefono: string;
    direccion: string;
    actividadEconomica: ActividadEconomica;

    //Formulario Datos Cotizante
    salario: number;
    extranjeroNoObligadoCotizarPension: boolean;
    fechaIngreso: string | null;
    tipoCotizante: TipoCotizante;
    cuarentaPorcientoSalario: number;
    subTipoCotizante: SubTipoCotizante;
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
    sucursal: string;
    usuario: string;
    clave: string;
    confirmarClave: string;
    periodoPago: string;
    modalidadPago: ModalidadPago;
    autorizoTratamientoDatos: boolean;
    
    //Utils por revisar
    cot69Dias: string; 
    cot69Valor: number;
    salarioMinimo: number;
    totalPagoAfp: number;
    tarifasSalud: number;
    totalPagoEps: number;
    totalPagoArl: number;
    totalPagoCcf: number;
    prestadorasCCF: string;
 
    //Banderas ocultar o mostrar campos
    showUser:boolean;
    showNames:boolean;
    showPagoAfp:boolean;
    showPagoEps:boolean;
    ShowRiesgos:boolean;
    showPagoCcf:boolean;
    showBotonBDUA:boolean;
    showColombiano:boolean;
    showExtranjero:boolean;
    showDatosBasicos:boolean;
    showDatosCotizante:boolean;
    showDatosAdminEpsAfp:boolean;
    showResidenteExterior:boolean;
    showDatosAdminRiesgosCcf:boolean;

    //Arreglos para vista de items Creo que todo esto sobra
    // registros:any[]; por revisar para qué funciona
    sucursalList: Sucursal [];
    codigoAFPList: CodigoAFP [];
    codigoEPSList: CodigoEPS [];
    tarifaEpsList: TarifaEps [];
    codigoCCFList: CodigoCCF [];
    tarifaAfpList: TarifaAFP [];
    tarifaCcfList: TarifaCcf [];
    municipioList: Municipios [];
    claseRiesgoList: ClaseRiesgo [];
    departamentoList: Departamentos [];
    tipoCotizanteList: TipoCotizante [];
    codigoRiesgosList: CodigoRiesgos [];
    modalidadPagoList: ModalidadPago [];
    tipoDocumentosList: TipoDocumento [];
    prestadorasCCFList: PrestadorasCCF [];
    subTipoCotizanteList: SubTipoCotizante [];
    actividadEconomicaList: ActividadEconomica [];
    indicadorTarifaEspecialList: IndicadorTarifaEspecial [];
}
