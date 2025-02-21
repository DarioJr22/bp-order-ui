import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from '../modules/auth/auth.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService,
        private auth:AuthService
    ) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Produtos',
                items: [
                    { label: 'Página inicial', icon: 'pi pi-fw pi-home', routerLink: ['/'],visible:true },
                    { label: 'Produtos', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['/funcao/pedido'],visible:true },
                    { label: 'Gestão de Produtos', icon: 'pi pi-fw pi-box', routerLink: ['/funcao/produto'],visible:this.auth.isAdmin()},
                ]
            },
            {
                label: 'Usuário',
                items: [
                    { label: 'Usuário', icon: 'pi pi-fw pi-user', routerLink: ['/funcao/detail-user'] },
                ]
            },
        ];
    }
}
