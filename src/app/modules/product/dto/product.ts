export interface Product{
    id?:string
    sku:string,
    nome:string,
    imagem:any,
    codigo_ean:string,
    fornecedor:string,
    classe:string,
    marketPlace:any,
    comissao:string,
    preco_custo:string,
    preco_venda:string,
    margem_contrib:string
    lucro_liquido:string,
    empresa?:string,
    status:string,
    data_ultima_prec:Date
}


export interface MarketPlacePricing{
      marketPlace: number,
      comissao: number,
      preco_custo: number,
      preco_venda: number,
      margem_contrib: number,
      lucro_liquido: number,
      status: string,
      data_ultima_prec: Date,
      isNew: boolean
}