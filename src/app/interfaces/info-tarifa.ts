import { CodigoAFP } from "./codigo-afp";
import { CodigoCCF } from "./codigo-ccf";
import { CodigoEPS } from "./codigo-eps";
import { Departamentos } from "./departamento";
import { IndicadorTarifaEspecial } from "./indicador-tarifa-especial";
import { SubTipoCotizante } from "./sub-tipo-cotizante";
import { TipoCotizante } from "./tipo-cotizante";

export interface InfoTarifas {
    colext : string;
    novedadSln : string;
    tipoEntidad : number;
    codigoEPS : CodigoEPS;
    codigoAFP : CodigoAFP;
    codigoCCF : CodigoCCF;
    tipoPlanilla : string;
    tarifaEvaluar : string;
    diferenciaAnos : string;
    claseAportante : string;
    aportanteExonerado : string;
    cotizanteExonerado : string;
    departamento : Departamentos;
    tipoCotizante : TipoCotizante;
    anoPeriodoSubsistema : string;
    mesPeriodoSubsistema : string;
    nroDocumentoAportante : string;
    subtipoCotizante : SubTipoCotizante;
    extranjeroNoObligadoCotizarPension : boolean;
    indicadorTarifaEspecial : IndicadorTarifaEspecial;
}
