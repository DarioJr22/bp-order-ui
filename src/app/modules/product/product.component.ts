import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Router } from '@angular/router';
import { MessageService, SelectItem } from 'primeng/api';
import { CalculateStrategy, ProductService } from './product.service';
import { SimplePage } from '../auth/detail-user/paged-user';
import { AuthService, User } from '../auth/auth.service';
import { ProductTinyApi } from '../orders/dto/product';
import { MarketPlacePricing, Product } from './dto/product';
import { ProductSearchReturn } from '../orders/dto/returnProduct';
import { CLASSPRODUCT_DATABASE_MAPPER, PRICE_STATUS, ProducPricing, ProdutoStatus, Role, STORE_DATABASE_MAPPER_TO } from 'src/app/services/constants';
import { BehaviorSubject, switchMap } from 'rxjs';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrl:'./product.component.scss'

})
export class ProductsComponent implements OnInit {


    price_statuslist = [
      'precificado',
      'atencao',
      'urgente'
    ]
    products: Product[] =  [];
    groupedProducts: Product[] = []; // Nova propriedade para produtos agrupados
    products$:BehaviorSubject<Product[]> = new BehaviorSubject([])
    @ViewChild('scrollContainer') scrollContainer!: ElementRef; 
    price_status = PRICE_STATUS
    
    // Propriedades do Modal
    displayProductModal: boolean = false;
    selectedProduct: Product | null = null;
    productMarketplaces: any[] = [];
    editingRows: { [key: number]: boolean } = {};
    
    // Propriedades para adição de marketplace
    displayAddMarketplaceDialog: boolean = false;
    newMarketplace: any = {
      marketPlace: '',
      comissao: '',
      preco_custo: '',
      preco_venda: '',
      margem_contrib: '',
      lucro_liquido: '',
      status: 'precificado',
      data_ultima_prec: new Date(),
      isNew: true // Flag para identificar que é um novo marketplace
    };


  
    availableMarketplaces: string[] = ['Mercado Livre Clássico', 'Mercado Livre Premium', 'Shopee', 'Amazon', 'Magazine Luiza'];
    filteredMarketplaces: string[] = [];
    
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

  scrollToEnd() {
    const container = this.scrollContainer.nativeElement;
    container.scrollTo({
        right: container.scrollWidth, // Rola até o final
        behavior: 'smooth' // Adiciona uma animação suave
    });
}
  empresas:any[]
  fornecedores:SelectItem[]
  selectedFornecedores!: SelectItem[];

  getSelectFields(products:any[]){
   this.empresas = Array.from(this.getValoresUnicosPorAtributo(products,'empresa'));
   this.fornecedores = this.mapDropValuesSupplier(Array.from(this.getValoresUnicosPorAtributo(products,'fornecedor')));

    console.log(this.empresas);
    console.log(this.fornecedores);
    
  }
  onFilterChange(value: any) {
    console.log("Valor selecionado:", value);
}

   getValoresUnicosPorAtributo<T>(array: T[], atributo: keyof T) {
    const valoresUnicos = new Set(); // Armazena valores únicos do atributo
     array.filter((item) => {
        const valorAtributo = item[atributo];
        if (!valoresUnicos.has(valorAtributo)) {
            valoresUnicos.add(item[atributo]);
            return true;
        }
        return false;
    });


    return valoresUnicos
}


  mapDropValuesSupplier(vl:any){
    return vl.map((i,index )=> 
    {
      return {
        value:index,
        name:i
      }
    }
    )
  }

  mapDropValuesStore(vl:any){
    return vl.map((i,index )=> 
    {
      return STORE_DATABASE_MAPPER_TO[i]
    }
    )
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
      console.log(newProduct);
      console.log(this.productMarketplaces);

      newProduct.marketPlace = this.productMarketplaces
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


    addMarketPlace(product: Product) {
      // Abre o diálogo de adição de marketplace
      this.resetNewMarketplace();
      this.filterAvailableMarketplaces();
      this.displayAddMarketplaceDialog = true;
    }

    // Filtrar marketplaces que ainda não foram adicionados
    filterAvailableMarketplaces() {
      const currentMarketplaces = this.productMarketplaces.map(mp => mp.marketPlace);
      this.filteredMarketplaces = this.availableMarketplaces.filter(
        mp => !currentMarketplaces.includes(mp)
      );
    }

    // Resetar o novo marketplace
    resetNewMarketplace() {
      this.newMarketplace = {
        marketPlace: '',
        comissao: '',
        preco_custo: 0,
        preco_venda: 0,
        margem_contrib: 0,
        lucro_liquido: 0,
        status: 'precificado',
        data_ultima_prec: new Date(),
        isNew: true
      };
    }

    // Adicionar o novo marketplace à lista local
    addNewMarketplaceToList() {
      if (!this.newMarketplace.marketPlace) {
        this.showWarnViaToast("Selecione um marketplace!");
        return;
      }

      // Adicionar à lista local
      this.productMarketplaces.push({...this.newMarketplace});
      
      // Fechar o diálogo
      this.displayAddMarketplaceDialog = false;
    }

    // Salvar o novo marketplace no backend
    saveNewMarketplace(marketplace: any) {
      if (!this.selectedProduct) return;
      
      // Converter para o formato esperado pela API
      const pricingData: ProducPricing = {
        marketplace: marketplace.marketPlace,
        comissao: marketplace.comissao,
        preco_custo: marketplace.preco_custo.toString(),
        preco_venda: marketplace.preco_venda.toString(),
        margem_contribuicao: marketplace.margem_contrib.toString(),
        lucro_liquido: marketplace.lucro_liquido.toString(),
        data_precificacao: new Date(),
        status: ProdutoStatus.PRECIFICADO
      };
      
      this.productService.addMarketplacePricing(this.selectedProduct.sku, pricingData)
        .subscribe({
          next: (response: any) => {
            // Remover a flag isNew
            marketplace.isNew = false;
            this.showSucsessViaToast(`Marketplace ${marketplace.marketPlace} adicionado com sucesso!`);
            
            // Atualizar a lista principal de produtos
            this.refreshProductAfterMarketplaceChange();
          },
          error: (error) => {
            this.showErrorViaToast(`Erro ao adicionar marketplace: ${error.message || 'Erro desconhecido'}`);
          }
        });
    }

    deleteMarketPlace(marketplace: any) {
      if (!this.selectedProduct) return;
      
      // Confirmar antes de excluir
      if (!confirm(`Tem certeza que deseja remover o marketplace ${marketplace.marketPlace}?`)) {
        return;
      }
      
      this.productService.deleteMarketplacePricing(this.selectedProduct.sku, marketplace.marketPlace)
        .subscribe({
          next: (response: any) => {
            // Remover da lista local
            this.productMarketplaces = this.productMarketplaces.filter(
              mp => mp.marketPlace !== marketplace.marketPlace
            );
            
            this.showSucsessViaToast(`Marketplace ${marketplace.marketPlace} removido com sucesso!`);
            
            // Atualizar a lista principal de produtos
            this.refreshProductAfterMarketplaceChange();
          },
          error: (error) => {
            this.showErrorViaToast(`Erro ao remover marketplace: ${error.message || 'Erro desconhecido'}`);
          }
        });
    }

    // Método para atualizar a lista de produtos após alterações de marketplace
    refreshProductAfterMarketplaceChange() {
      // Recarregar os dados do produto específico
      if (this.selectedProduct) {
        this.productService.getProductById(this.selectedProduct.id).subscribe({
          next: (product: any) => {
            // Atualizar a lista de produtos
            const productIndex = this.products.findIndex(p => p.id === this.selectedProduct!.id);
            if (productIndex !== -1) {
              // Remover os produtos antigos com este SKU
              this.products = this.products.filter(p => p.sku !== this.selectedProduct!.sku);
              
              // Adicionar os novos produtos com marketplace atualizado
              const updatedProducts = this.productMapping([{produto: product[0]}]).flat();
              this.products = [...this.products, ...updatedProducts];
              
              // Reagrupar produtos
              this.groupProductsBySku();
              
              // Atualizar a lista de marketplaces no modal
              this.openProductModal(this.groupedProducts.find(p => p.sku === this.selectedProduct!.sku)!);
            }
          }
        });
      }
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
              empresa:STORE_DATABASE_MAPPER_TO[product.produto.empresa],
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
    this.getSelectFields(this.products)
    
    // Agrupar produtos por SKU (um produto por linha na tabela principal)
    this.groupProductsBySku();
  }

  groupProductsBySku() {
    const grouped = new Map<string, Product>();
    
    this.products.forEach(product => {
      if (!grouped.has(product.sku)) {
        grouped.set(product.sku, { ...product });
      }
    });
    
    this.groupedProducts = Array.from(grouped.values());
  }

  openProductModal(product: Product) {
    this.selectedProduct = { ...product };
    this.displayProductModal = true;
    
    // Buscar todos os marketplaces para este produto
    this.productMarketplaces = this.products
      .filter(p => p.sku === product.sku)
      .map(p => ({
        marketPlace: p.marketPlace,
        comissao: p.comissao,
        preco_custo: parseFloat(p.preco_custo.toString()),
        preco_venda: parseFloat(p.preco_venda.toString()),
        margem_contrib: parseFloat(p.margem_contrib.toString()),
        lucro_liquido: parseFloat(p.lucro_liquido.toString()),
        status: p.status,
        data_ultima_prec: p.data_ultima_prec
      }));
  }

  onRowEditInit(marketplace: any, index: number) {
    this.editingRows[index] = true;
  }

  onRowEditSave(marketplace: any, index: number) {
    // Encontrar o produto correspondente na lista principal
    const productToUpdate = this.products.find(p => 
      p.sku === this.selectedProduct!.sku && 
      p.marketPlace === marketplace.marketPlace
    );
    
    if (productToUpdate) {
      // Atualizar os valores
      productToUpdate.preco_custo = marketplace.preco_custo.toString();
      productToUpdate.preco_venda = marketplace.preco_venda.toString();
      productToUpdate.margem_contrib = marketplace.margem_contrib.toString();
      productToUpdate.lucro_liquido = marketplace.lucro_liquido.toString();
      
      // Chamar o método de atualização existente
      this.updateProduct(productToUpdate);
    }
    
    delete this.editingRows[index];
  }

  onRowEditCancel(marketplace: any, index: number) {
    // Restaurar valores originais se necessário
    delete this.editingRows[index];
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


  calculate(newMarketplace:MarketPlacePricing, strategy:string){
    switch(strategy){
      case CalculateStrategy.MARGIN:
        newMarketplace.margem_contrib = this.calculateMargin(newMarketplace);
        break;
      case CalculateStrategy.PROFIT:
        newMarketplace.lucro_liquido = this.calculateProfit(newMarketplace);
        break;
    }
  }

  calculateMargin(newMarketplace: MarketPlacePricing) {
    // Converter comissão para número e calcular a porcentagem
    const comissaoPercent = parseFloat(newMarketplace.comissao.toString()) / 100;
    
    // Calcular o valor da comissão
    const valorComissao = newMarketplace.preco_venda * comissaoPercent;
    
    // Calcular o custo total (custo do produto + comissão)
    const custoTotal = newMarketplace.preco_custo + valorComissao;
    
    // Calcular a margem como porcentagem
    const margem = ((newMarketplace.preco_venda - custoTotal) / newMarketplace.preco_venda) * 100;
    
    return margem;
  }

  calculateProfit(newMarketplace: MarketPlacePricing) {
    // Converter comissão para número e calcular a porcentagem
    const comissaoPercent = parseFloat(newMarketplace.comissao.toString()) / 100;
    
    // Calcular o valor da comissão
    const valorComissao = newMarketplace.preco_venda * comissaoPercent;
    
    // Calcular o lucro líquido
    const lucroLiquido = newMarketplace.preco_venda - newMarketplace.preco_custo - valorComissao;
    
    return lucroLiquido;
  }

  


  // Margem = Valor das Vendas – (Custos Variáveis + Despesas Variáveis)
    //Lucro Líquido = (Receita Total – Custos Totais – Despesas Totais – Impostos)
}
