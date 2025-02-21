import { ex } from "@fullcalendar/core/internal-common";

export const URL = 'https://bp-order-api-production-31fb.up.railway.app';

//Time
const MONTHS = 3;
const DAYS_PER_MONTH = 30; 
const HOUR_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_MINUTE = 60;
const MILLISECOND_PER_SECOND = 1000;
const THREE_MONTHS_MILLISECOND = MONTHS * DAYS_PER_MONTH * HOUR_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECOND_PER_SECOND;
const ONE_MONTH_MILLISECOND = MONTHS-2 * DAYS_PER_MONTH * HOUR_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECOND_PER_SECOND;

//Product
export const CLASSPRODUCT_DATABASE_MAPPER ={
    'K':"Kit",
    'S':"Simples",
    'V':"Com variações",
    'F':"Fabricado",
    'M':"Matéria-prima"
  }
  

//pricestatus
export const PRICE_STATUS = {
    precificado:{
        label:'precificado',
        expirationTime:THREE_MONTHS_MILLISECOND,
        severity:"success"
      }, 
    atencao:{
        label:'atencao',
        expirationTime:ONE_MONTH_MILLISECOND,
        severity:"warning"
      }, 
    urgente:{
        label:'urgente',
        expirationTime:0,
        severity:"danger"
      } 
  }
  
  export class ProducPricing{
    marketplace:string;
    comissao:string;
    preco_custo:number;
    preco_venda: number;
    margem_contribuicao: number;
    lucro_liquido: number;
    data_precificacao: Date;
    status:ProdutoStatus
}


export enum ProdutoStatus {
  PRECIFICADO = 'precificado',
  ATENCAO = 'atencao',
  URGENTE = 'urgente',
}

export enum Role{
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  CLIENT = 'client',

}
