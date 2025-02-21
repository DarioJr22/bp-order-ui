import { Component, effect, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { OrdersService } from '../modules/orders/orders.service';
import { OrdersComponent } from '../modules/orders/orders.component';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { Router } from '@angular/router';
import { AuthService, User } from '../modules/auth/auth.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    cartCount: number = 0
    user!: User

    @ViewChild(OrdersComponent) orderComponent!: OrdersComponent

    @ViewChild(ConfirmPopup) confirmPopup!: ConfirmPopup;

    viewDialogCarrinho: boolean = false

    constructor(
        public layoutService: LayoutService,
        private orderService: OrdersService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private auth: AuthService
    ) {
        effect(() => {
            this.cartCount = this.orderService.cart();
            this.userUpdate()



        })
    }
    ngOnInit(): void {
        this.userUpdate()

    }


    userUpdate() {
        if (this.verifyIfItsAlredyLoggedIn()) {
            this.auth.setUser(this.auth.getCoockieUser())
            this.user = this.auth.getUser();
        } else {
            this.user = this.auth.getUser();
        }
    }

    abrirCarrinho() {
        this.orderService.openModal()
    }

    accept() {
        this.confirmPopup.accept();
    }

    verifyIfItsAlredyLoggedIn() {
        return this.auth.verifyIfItsLoggedIn()
    }

    reject() {
        this.confirmPopup.reject();
    }

    goToEditProductsModule(){
        
    }

    loginQuestion(event: Event) {
        console.log(this.user);
        
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Fazer login',
            accept: () => {
                this.router.navigate(['/auth/login'])
            },
            reject: () => {
            }
        });
    }

    detalhamentoUsuario(){
        this.router.navigate(['/funcao/detail-user'])
    }

    emBreve(e: any, string: string) {
        this.confirmationService.confirm({
            key: 'confirm2',
            target: e.target || new EventTarget,
            acceptLabel: 'SIM', // Texto do botão
            rejectLabel: 'NÃO',
            rejectVisible: false, // Esconde o botão "No"
            message: `Você não está logado, deja logar na plataforma ?`,
            icon: 'pi pi-exclamation-triangle',
        });
    }
    darkMode: boolean = false
    toggleTheme() {
        //
        this.darkMode = !this.darkMode
        this.darkMode ?
            this.orderService.changeTheme('lara-dark-blue', 'dark') :
            this.orderService.changeTheme('lara-light-blue', 'light')


    }

    outSystem(){
        this.user = {
            logado:false,
            email:''
          }
        this.auth.setUser(this.user)
        this.auth.out()
        window.location.reload()
       
    }
}
