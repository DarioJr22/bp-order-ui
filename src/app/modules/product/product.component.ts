import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProductService } from './product.service';
import { SimplePage } from '../auth/detail-user/paged-user';
import { AuthService, User } from '../auth/auth.service';
import { ProductTinyApi } from '../orders/dto/product';
import { Product } from './dto/product';
import { ProductSearchReturn } from '../orders/dto/returnProduct';
import { CLASSPRODUCT_DATABASE_MAPPER, PRICE_STATUS, ProducPricing, ProdutoStatus, Role } from 'src/app/services/constants';
import { BehaviorSubject, switchMap } from 'rxjs';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrl:'./product.component.scss'

})
export class ProductsComponent implements OnInit {

   /* 
  - [x] Fazer paginação no front OK
  - [x] Fazer paginação no back OK
  - [x] Fazer filtragem no front / Back OK
  - [X] Fazer desserialização de produtos
  - [ ] Fazer edição front 
  - [ ] back
  - [ ] Implementar um bom design 
   
   */
    price_statuslist = [
      'precificado',
      'atencao',
      'urgente'
    ]
    products: Product[] =  [];
    products$:BehaviorSubject<Product[]> = new BehaviorSubject([])
    price_status = PRICE_STATUS
    pageUser = {
      page:1,
      limit:3
    }

    constructor(
        public layoutService: LayoutService,
        private authService:AuthService,
        private router:Router,
        private messageService: MessageService,
        private productService:ProductService
    ) {


    }


  ngOnInit(): void {
    this.isUserLoggedIn()
    this.getAllProducts()
  }

  verifyProductStats(){
    this.productService.statusControl(this.products)
  }

    isUserLoggedIn(){


      if(this.authService.verifyIfItsLoggedIn() &&
        this.authService.getCoockieUser().role == Role.ADMIN){
        return
      }else{
        this.router.navigate(['/funcao/pedido'])
      }
    }

    load(){
      this.productService.loadNewProducts(this.authService.getCoockieUser().email).subscribe({
        next:()=>{
          this.showSucsessViaToast("Produtos sendo carregados da base do tiny, em breve enviaremos um email quando finalizar.")
        },
        error:()=>{
          this.showErrorViaToast("Produtos sendo carregados da base do tiny, em breve enviaremos um email quando finalizar.")
        }
      })
    }

    getAllProducts(){
      this.productService.getAllProducts().subscribe({
        next:(products)=>{
          console.log(this.productMapping(products));
          const mappedProducts =  [...this.productMapping(products)]
        this.desserialize([...mappedProducts])
        this.verifyProductStats()
        }
       })
    }

    updateProduct(newProduct:Product){
      this.productService.getProductById(newProduct.id).pipe(switchMap(
        (oldProduct:any)=>{
          let productPricing = oldProduct[0].preco_marketplace

           productPricing.forEach((productPricing)=>{
            if(newProduct.marketPlace == productPricing.marketplace){
                productPricing.lucro_liquido = newProduct.lucro_liquido
                productPricing.margem_contribuicao = newProduct.margem_contrib
                productPricing.preco_custo = `${newProduct.preco_custo}`
                productPricing.preco_venda = `${newProduct.preco_venda}`
                productPricing.data_precificacao = new Date();
                productPricing.status = ProdutoStatus.PRECIFICADO;
            }
          })

          return this.productService.updateProdut(newProduct.sku,productPricing)
        })).subscribe({ 
          next:()=>{
            this.showSucsessViaToast(`Produto ${ newProduct.nome} atualizado com sucesso !`)
            newProduct.status = ProdutoStatus.PRECIFICADO
          },
          error:()=>{
            this.showErrorViaToast(`Erro ao atualizar Produto ${ newProduct.nome} !`)
          }
      })
    }

    productMapping(products:any[]){
      return products.map(
        (product:{produto:any}) => {

          let mappedProduct:Product[] = [] 
          
          product.produto.preco_marketplace.forEach((marketPlaceData:ProducPricing) => {
            mappedProduct.push({
              id:product.produto.id,
              sku:product.produto.codigo,
              nome:product.produto.nome,
              codigo_ean:product.produto.gtin,
              imagem:product.produto.anexos[0] ? product.produto.anexos[0].anexo : "Sem imagens para o produto" ,
              fornecedor:product.produto.nome_fornecedor,
              classe:CLASSPRODUCT_DATABASE_MAPPER[product.produto.classe_produto],
              marketPlace:marketPlaceData.marketplace,
              comissao:marketPlaceData.comissao,
              preco_custo:`${marketPlaceData.preco_custo}`,
              preco_venda:`${marketPlaceData.preco_venda}`,
              margem_contrib:`${marketPlaceData.margem_contribuicao}`,
              lucro_liquido:`${marketPlaceData.lucro_liquido}`,
              status:marketPlaceData.status,
              data_ultima_prec:marketPlaceData.data_precificacao,
            })
          });
          
          return mappedProduct
        }
      )
    }

  desserialize(prod:any[]){
    const flatedArray = prod.flat()
    this.products = flatedArray
    console.log(flatedArray);
    
  }
      
  showInfoViaToast(message: string) {
    this.messageService.add({ key: 'tst', severity: 'info', summary: 'Informação', detail: message });
  }

  showSucsessViaToast(message: string) {
    this.messageService.add({ key: 'tst', severity: 'success', summary: 'Sucesso', detail: message });
  }

  showWarnViaToast(message: string) {
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Atenção', detail: message });
  }

  showErrorViaToast(message: string) {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: message });
  }

 

  onEdit(event) {
      if (!this.isPositiveInteger(event.target.value)) {
          event.stopPropagation();
      }
  }

  isPositiveInteger(val) {
      let str = String(val);

      str = str.trim();

      if (!str) {
          return false;
      }

      str = str.replace(/^0+/, '') || '0';
      var n = Math.floor(Number(str));

      return n !== Infinity && String(n) === str && n >= 0;
  }

}
