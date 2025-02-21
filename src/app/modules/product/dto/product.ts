export interface Product{
    id?:string
    sku:string,
    nome:string,
    imagem:any,
    codigo_ean:string,
    fornecedor:string,
    classe:string,
    marketPlace:string,
    comissao:string,
    preco_custo:string,
    preco_venda:string,
    margem_contrib:string
    lucro_liquido:string,
    status:string,
    data_ultima_prec:Date
}