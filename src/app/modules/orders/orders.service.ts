import { computed, Injectable, signal, effect, WritableSignal, Signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmailOrder, Order } from './dto/order';
import { ProductSearchReturn, ReturnProductDto } from './dto/returnProduct';
import { Product } from './dto/product';
import { CookieServiceImp } from 'src/app/services/coockie.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(
    private http:HttpClient,
    private coockeService:CookieServiceImp,
    public layoutService: LayoutService,
  ) {
    effect(()=>{
        this.coockeService.setCookie('cart',this.productsOnOrder())
        this.coockeService.setCookie('layoutconfig',this.layoutService._config)
    })
  }

//'https://bp-order-api-production.up.railway.app'


  url = 'http://localhost:3000'

  //Produtos no carrinho
  productsOnOrder:WritableSignal<Product[]> = signal<Product[]>([])

  //Numero de produtos no carrinho
  cart:Signal<number> = computed(() =>  this.productsOnOrder().length)

  //Signal readOnly de produtos no carrinho
  products:Signal<Product[]> = computed(() => this.productsOnOrder())

  //Estado de carregamento do carrinho
  isCartLoading:WritableSignal<boolean> = signal<boolean>(false)

  //Estado de carregamento do carrinho
  printPdf:WritableSignal<boolean> = signal<boolean>(false)


  addProduct(product: Product): void {
    this.productsOnOrder.update(products => {
       //If is a new product
       if(!products.some(prds => prds.id == product.id ))
        return [...products, product]


       let idx = products.findIndex(prd => prd.id == product.id);
       products[idx].quantidade += product.quantidade

       return products
    });
  }

  decrementProductQuantity(product: Product,quantity:number): void {
    this.productsOnOrder.update(products => {

        let idx = products.findIndex(prd => prd.id == product.id);
        products[idx].quantidade -= quantity

        return products
    });
  }


  removeProduct(id: string): void {
    this.productsOnOrder.update(products => products.filter(p => p.id !== id));
  }



    private openModalCart = new Subject<boolean>()

    // Observable para os outros componentes se inscreverem
    modalState$ = this.openModalCart.asObservable();

    // Método para abrir o modal
    openModal() {
    this.openModalCart.next(true);
    }

    // Método para fechar o modal
    closeModal() {
    this.openModalCart.next(false);
    }


  getAllProducts(){
    return this.http.get<ProductSearchReturn[]>(`${this.url}/product`)
  }

  getProductById(id:string){
    return this.http.get<{retorno:{produto:Product}}>(`${this.url}/product/${id}`)
  }

  getSearchFields(){
    return this.http.get<any>(`${this.url}/product/fields/getter`)
  }

  exportToPdf(products:Product[]):Observable<Blob>{

    const httpOptions = {
        responseType: 'blob' as 'json', // Informamos ao HttpClient que queremos um Blob como resposta
      };

    return this.http.post<Blob>(`${this.url}/report/pdf`,products,httpOptions)
  }

  exportToExcel(products:Product[]){

    const httpOptions = {
        responseType: 'blob' as 'json', // Informamos ao HttpClient que queremos um Blob como resposta
      };

    return this.http.post<Blob>(`${this.url}/report/excel`,products,httpOptions)
  }

  getImgs(id:string){
    return this.http.get<{img:string}>(`${this.url}/report/imgs/${id}`)
  }


  //TODO - Se meu cliente quiser tbm né ainda tem isso
  sendToZap(){

  }

  sendToEmail(Order:EmailOrder){
    return this.http.post<any>(`${this.url}/email/send`,Order)
  }


  //Temas



    set theme(val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            theme: val,
        }));
    }

    set colorScheme(val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            colorScheme: val,
        }));
    }

    set menuMode(_val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            menuMode: _val,
        }));
    }

    set visible(_val: boolean) {
        this.layoutService.state.configSidebarVisible = _val;
    }

    set scale(_val: number) {
        this.layoutService.config.update((config) => ({
            ...config,
            scale: _val,
        }));
    }

    changeTheme(theme: string, colorScheme: string) {
        this.theme = theme;
        this.colorScheme = colorScheme;
    }

    decrementScale() {
        this.scale--;
    }

    incrementScale() {
        this.scale++;
    }


}
