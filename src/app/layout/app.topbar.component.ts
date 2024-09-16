import { Component, effect, ElementRef, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { OrdersService } from '../modules/orders/orders.service';
import { OrdersComponent } from '../modules/orders/orders.component';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    cartCount:number = 0

   @ViewChild(OrdersComponent) orderComponent!:OrdersComponent

   viewDialogCarrinho:boolean = false

    constructor(
        public layoutService: LayoutService,
        private orderService:OrdersService,
        private confirmationService:ConfirmationService
    ) {
        effect(() =>{
            this.cartCount = this.orderService.cart()
        })
     }


     seiOqueLla(){
        this.orderService.openModal()
     }

     emBreve(e:any,string:string){
        this.confirmationService.confirm({
            key: 'confirm2',
            target: e.target || new EventTarget,
            message: `Em breve a funcionalidade de ${string} estará disponível`,
            icon: 'pi pi-exclamation-triangle'
        });
    }
    darkMode:boolean = false
    toggleTheme(){
        //
        this.darkMode = !this.darkMode
        this.darkMode ?
        this.orderService.changeTheme('lara-dark-blue', 'dark') :
        this.orderService.changeTheme('lara-light-blue', 'light')


    }
}
