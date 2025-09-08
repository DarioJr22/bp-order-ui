import { HttpClient } from "@angular/common/http";
import { Injectable, ViewChild } from "@angular/core";
import { Observable, switchMap } from "rxjs";
import { PRICE_STATUS, ProducPricing, ProdutoStatus, URL } from "src/app/services/constants";
import { SimplePage } from "../auth/detail-user/paged-user";
import { User } from "../auth/auth.service";
import { ProductSearchReturn } from "../orders/dto/returnProduct";
import { Product } from "./dto/product";
import { MessageService } from "primeng/api";
import { ProductsComponent } from "./product.component";


@Injectable({
  providedIn: 'root'
})

export class ProductService {
  @ViewChild('') productComponent:ProductsComponent;
  constructor(private http: HttpClient
  ) {
  }


  getAllProducts() {
    return this.http.get<any[]>(`${URL}/product`)
  }
  getPagedUsers(page: number, limit: number): Observable<SimplePage<User>> {
    return this.http.get<SimplePage<User>>(`${URL}/user?page=${page}&limit=${limit}`)
  }

  loadNewProducts(email: string) {
    return this.http.get(`${URL}/product/update-admin-products/${email}`)
  }

  updateProdut(codigo: string, productPricing: ProducPricing[]) {
    return this.http.put(`${URL}/product/update-product`, {
      codigo: codigo,
      preco: productPricing
    })
  }

  getProductById(id: string) {
    return this.http.get(`${URL}/product/byId/${id}`)
  }

  // Adicionar marketplace pricing
  addMarketplacePricing(codigo: string, pricing: ProducPricing) {
    return this.http.post(`${URL}/product/marketplace-pricing`, {
      codigo: codigo,
      pricing: pricing
    })
  }

  // Remover marketplace pricing
  deleteMarketplacePricing(codigo: string, marketplace: string) {
    return this.http.delete(`${URL}/product/marketplace-pricing`, {
      body: {
        codigo: codigo,
        marketplace: marketplace
      }
    })
  }

  //Expiration Pricing


  setStatusByExpirationTime(date, label, expiration, today, newProduct:Product) {
    let expirationDate = new Date(date.getTime() + expiration).getTime();
    if (today >= expirationDate) {
      //TODO - Update

      this.getProductById(newProduct.id).pipe(switchMap(
        (oldProduct: any) => {
          let productPricing = oldProduct[0].preco_marketplace
              productPricing.forEach((productPricing) => {
            if (newProduct.marketPlace == productPricing.marketplace) {
              productPricing.status = label;
              newProduct.status = label
            }
          })

          return this.updateProdut(newProduct.sku, productPricing)
        })).subscribe({
          next: () => {
            this.productComponent.getAllProducts()
          },
          error: (erro) => {
            console.log(erro)
          }
        })

    };
  }

  statusControl(products: Product[]) {
    products.forEach((product) => {

      let status = product.status
      let statusDate = new Date(product.data_ultima_prec)
      let today = new Date().getTime()


      //Verify if the time is 3three months from now, if its true then change the status 
      // 'priced' > 'atention'
      // if is alredy in status 'atention' verify if its 1 month from now
      // then changes the status 'atention' > 'urgent'


      //TODO - Now do you just have to metrify you status 
      switch (status) {
        case PRICE_STATUS.precificado.label:
          this.setStatusByExpirationTime(
            statusDate,
            PRICE_STATUS.atencao.label,
            PRICE_STATUS.precificado.expirationTime,
            today,
            product)
          return;
        case PRICE_STATUS.atencao.label:
          this.setStatusByExpirationTime(
            statusDate,
            PRICE_STATUS.urgente.label,
            PRICE_STATUS.atencao.expirationTime,
            today,
            product);
          return;
        case PRICE_STATUS.urgente.label:
          return;
        default:
          throw new Error('Precificação não reconhecida')
      }
    }
    )
  }

  





}


 export enum CalculateStrategy{
    PROFIT = 'PROFIT',
    MARGIN = 'MARGIN'
  }