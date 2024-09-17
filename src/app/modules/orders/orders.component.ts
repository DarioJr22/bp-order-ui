import { Component, effect, OnInit } from '@angular/core';
import { BehaviorSubject, tap, switchMap, catchError } from 'rxjs';
import { Product } from './dto/product';
import { OrdersService } from './orders.service';
import { ProductSearchReturn, ReturnProductDto } from './dto/returnProduct';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HtmlContent } from 'src/app/services/html-sanitizer';
import { AppConfig, LayoutService } from '../../layout/service/app.layout.service';
import { CookieService } from 'ngx-cookie-service';
import { CookieServiceImp } from 'src/app/services/coockie.service';
export class FilterProductDto {
    id: string | string[]
    nome: string | string[]
    tipoVariacao: string | string[]
    situacao: string
    codigo: string | string[]
    preco: [number, number]
    constructor(private newP:Partial<FilterProductDto>){
        Object.assign(this,newP)
    }
}


export class FilterProductLists {
    id: string[]
    nome: string[]
    tipoVariacao: string[]
    situacao: string[]
    codigo: string[]
    constructor(private newP:Partial<FilterProductLists>){
        Object.assign(this,newP)
    }
}
@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrl: './orders.component.scss',
    animations: [
        trigger('fadeSlideIn', [
          transition(':enter', [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ]
})
export class OrdersComponent implements OnInit {

    imgs:{[key:string]:BehaviorSubject<any>} = {
        notFoundCart:new BehaviorSubject<string>('')
    }

    _config: AppConfig = {
        ripple: false,
        inputStyle: 'outlined',
        menuMode: 'static',
        colorScheme: 'light',
        theme: 'lara-light-indigo',
        scale: 14,
    };

    //Entidades & elementos
    products: BehaviorSubject<ProductSearchReturn[]> = new BehaviorSubject([]);
    filterProductDto: FilterProductDto = new FilterProductDto(
        {
            id:'',
            nome:'',
            situacao:'',
            codigo:'',
            preco:[0,2000]
        }
    );

    filterProductLists: FilterProductLists = new FilterProductLists({
            id:[],
            nome:[],
            situacao:[],
            codigo:[]
        }
    );

    productDetail: Product = new Product({
            quantidade: 0
        }
    )

    viewDialog: boolean = false
    viewDialogCarrinho:boolean = false


    //Estado de elementos da tela
    isLoading: boolean = true
    situacaoValues:string[] = []
    situacaoMapper: any = {
        'A': 'Ativo',
        'I': 'Inativo',
        'E': 'Excluído'
    }






    constructor(
        private orderService: OrdersService,
        private messageService: MessageService,
        private sanitizer: DomSanitizer,
        private confirmationService: ConfirmationService,
        private CookieService:CookieServiceImp,
        public layoutService:LayoutService
    ) {
        this.situacaoValues = Object.values(this.situacaoMapper);
        this.orderService.modalState$.subscribe((state:boolean) => {
            this.viewDialogCarrinho = state
            this.tst(this.orderService.productsOnOrder())
        })

        effect(()=>{
            if(this.orderService.productsOnOrder().length == 0) this.getImgs('notFoundCart');
        })
    }

    ngOnInit() {
        this.getAllProducts();
        this.getImgs('notFoundCart');


        this.orderService.changeTheme('lara-light-blue', 'light')
    }


    //TODO - Gravar layout do cliente
    layoutConfig(){
        const productsCookie = this.CookieService.getCookie('layoutconfig');
        const products = JSON.parse(productsCookie);
        console.log('Produtos carregados do cookie:', products);
        this.orderService.changeTheme('lara-light-blue', 'light')
    }



    sortOptions: SelectItem[] = [];

    sortOrder: number = 0;

    sortField: string = '';

    sourceCities: any[] = [];

    targetCities: any[] = [];

    orderCities: any[] = [];



    getAllProducts() {
        this.orderService.getSearchFields()
            .pipe(
                switchMap((value) => {
                    //Retorna e popula os campo
                    let returnFunc = value
                    Object.keys(returnFunc).forEach((field:string)=>{
                        this.filterProductLists[field] = returnFunc[field]
                    })

                    console.log(value);
                    console.log(this.filterProductLists);


                    return this.orderService.getAllProducts();
                }),
                //Depois que retorna os produto encerra o carregamento
                tap(() => this.isLoading = false))
            .subscribe({
                next: (data: ProductSearchReturn[]) => {

                    this.products.next(data);
                    this.applyFilter()
                    this.showSuccessViaToast('Produtos consultados con sucesso !')
                },
                error: (erro: HttpErrorResponse) => {
                    this.showErrorViaToast('Erro ao consultar os produtos ! \n Erro: ' + erro.message)
                    this.isLoading = false
                },
                complete: () => {

                }
            }
            )
    }

    filteredProducts: ProductSearchReturn[] = [];

    clearFilter(){
        this.filterProductDto = new FilterProductDto({
            id:[],
            nome: [], // Limpa o MultiSelect de Nomes
            situacao: '', // Limpa o SelectButton de Situação
            codigo: [], // Limpa o MultiSelect de Códigos
            preco: [0, 2000]
        })
        this.applyFilter()
    }

    viewModalCarrinho(){
        this.viewDialogCarrinho = true
    }

    applyFilter() {
        const allProducts = this.products.getValue(); // Obtém os produtos atuais
        this.filteredProducts = this.filterProducts(allProducts); // Aplica o filtro aos produtos
      }


      filterProducts(products: ProductSearchReturn[]): ProductSearchReturn[] {
        console.log(this.filterProductDto);

        return products.filter(product => {
            // Filtro para ID
            const idFilter = this.filterProductDto.id.length === 0 || this.filterProductDto.id.includes(product.produto.id);

            // Filtro para Nome
            const nomeFilter = this.filterProductDto.nome.length === 0 || this.filterProductDto.nome.includes(product.produto.nome);

            // Filtro para Situação
            const situacaoFilter = !this.filterProductDto.situacao || this.filterProductDto.situacao.substring(0,1) === product.produto.situacao;

            // Filtro para Código
            const codigoFilter = this.filterProductDto.codigo.length === 0 || this.filterProductDto.codigo.includes(product.produto.codigo);

            // Filtro para Preço
            const precoFilter = product.produto.preco >= this.filterProductDto.preco[0] && product.produto.preco <= this.filterProductDto.preco[1];

            // Retorna verdadeiro se todos os filtros forem correspondentes
            return idFilter && nomeFilter && situacaoFilter && codigoFilter && precoFilter;
        });
    }

    /* Cart */


    getDetailProduct(id: string) {
        this.viewDialog = true
        this.orderService.isCartLoading.set(true)
        this.orderService.getProductById(id).subscribe({
            next: (prod) => {
                let produto = prod.retorno.produto as Product
                produto.quantidade = 0
                this.productDetail = produto
                this.orderService.isCartLoading.set(false)
            }, error: (error) => {
                this.orderService.isCartLoading.set(false)
                this.showErrorViaToast('Erro ao buscar o produto')
            }
        })
    }

    getDetailCart() {

    }

    tst(tst: any) {
        console.log(tst);

    }



    addToCart(id: string, quantity: number) {
        this.orderService.isCartLoading.set(true)


        this.orderService.getProductById(id).pipe(tap(() => this.orderService.isCartLoading.set(false))).subscribe({
            next: (prod) => {
                let produto = prod.retorno.produto as Product
                produto.quantidade = quantity // Add the quantity before insert at the cart
                this.orderService.addProduct(produto);

            }, error: (error) => {
                this.orderService.isCartLoading.set(false)
                this.showErrorViaToast('Erro ao adicionar o produto ao carrinho ! \n Error:' + error.message)
            }
        })
    }

    safeUrl!:SafeResourceUrl

    exportToPdf(){
        this.orderService.isCartLoading.set(true)
        this.setPdfState(true)
        let cart = this.orderService.productsOnOrder().map(i => i)
        this.orderService.exportToPdf(cart).pipe(tap(() => this.orderService.isCartLoading.set(false))).subscribe({
            next: (order) => {
                let orderBlob = order
                let url = URL.createObjectURL(orderBlob);
                this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url)

            }, error: (error) => {
                console.log(error);

                this.orderService.isCartLoading.set(false)
                this.setPdfState(false)
                this.showErrorViaToast('Erro ao exportar para relatório! \n Error:' + error.message)
            }
        })
    }

    exportToExcel(){
        this.orderService.isCartLoading.set(true)
        let cart = this.orderService.productsOnOrder().map(i => i)
        this.orderService.exportToExcel(cart).pipe(tap(() => this.orderService.isCartLoading.set(false))).subscribe({
            next: (order) => {
                const blob = new Blob([order], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const fileName = 'pedido_bravan_parts.xlsx';

                // Usa a API de download nativa do navegador
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = fileName;
                link.click();
                this.orderService.isCartLoading.set(false)

                // Limpa o objeto blob após o uso
                window.URL.revokeObjectURL(link.href);
            }, error: (error) => {
                console.log(error);

                this.orderService.isCartLoading.set(false)
                this.setPdfState(false)
                this.showErrorViaToast('Erro ao exportar para relatório! \n Error:' + error.message)
            }
        })
    }

    getImgs(idImgs:string){
        this.orderService.isCartLoading.set(true)
        this.orderService.getImgs(idImgs).pipe(tap(() => this.orderService.isCartLoading.set(false))).subscribe({
            next: (base64Img) => {
                this.imgs[idImgs].next(base64Img.img)
            }, error: (error) => {
                console.log(error);

                this.orderService.isCartLoading.set(false)
                this.showErrorViaToast('Erro ao adicionar o produto ao carrinho ! \n Error:' + error.message)
            }
        })
    }

    emBreve(e:any,string:string){
        this.confirmationService.confirm({
            key: 'confirm2',
            target: e.target || new EventTarget,
            acceptLabel: 'OK', // Texto do botão
            rejectVisible: false, // Esconde o botão "No"
            message: `Em breve a funcionalidade de ${string} estará disponível`,
            icon: 'pi pi-exclamation-triangle'
        });
    }


    removeProductFromCart(id: string) {
        this.orderService.removeProduct(id)
    }

    decrementProductFromCart(product:Product,quantity:number) {
        if (product.quantidade == 1)
            this.removeProductFromCart(product.id)

        this.orderService.decrementProductQuantity(product,quantity)
    }

    printPdf(print?:boolean){
        this.orderService.printPdf.set(print)
    }

    getGetPdfState(){
        return this.orderService.printPdf()
    }

    setPdfState(OraBool:boolean){
         this.orderService.printPdf.set(OraBool)
    }



    /* Formulários */

    onQuantityChange(event: any) {
        this.productDetail['quantidade'] = event.value; // Captura o valor diretamente
        console.log('Quantidade atualizada:', this.productDetail['quantidade']);
    }


    /* Messages */

    showInfoViaToast(message: string) {
        this.messageService.add({ key: 'tst', severity: 'info', summary: 'Informação', detail: message });
    }

    showWarnViaToast(message: string) {
        this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Atenção', detail: message });
    }

    showErrorViaToast(message: string) {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: message });
    }

    showSuccessViaToast(message: string) {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Sucesso', detail: message });
    }

    /* Utils */

    counterArray(n: number): any[] {
        return Array(n);
    }
}
