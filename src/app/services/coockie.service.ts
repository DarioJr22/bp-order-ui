import { Injectable } from "@angular/core";
import { CookieService } from 'ngx-cookie-service';
import { Product } from "../modules/orders/dto/product";


@Injectable({
    providedIn:'root'
})

export class CookieServiceImp {

    constructor(private cookieService: CookieService) {}
  // Definir um cookie
  setCookie(cookieId,product:any) {
    this.cookieService.set(cookieId, JSON.stringify(product), 1, '/');
  }

  // Ler um cookie
  getCookie(str:string) {
    let cart = this.cookieService.get(str);
    cart = JSON.parse(cart)

    console.log(str, cart);
    return cart
  }

  // Apagar um cookie
  deleteCookie() {
    this.cookieService.delete('cart');
  }
}
