import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];

    password!: string;

    constructor(public layoutService: LayoutService,
        private authService:AuthService,
        private router:Router,
        private messageService: MessageService,
    ) { }

    onSubmit(form: NgForm) {
        if (form.valid) {
          const { email, password } = form.value;
          this.authService.login(email, password).subscribe({
            next: (response) => {
              console.log('Login bem-sucedido:', response);

              if(response.usuarioValido){
                this.showInfoViaToast('Login bem sucedido !')
                this.router.navigate(['/funcao/pedido']); // Redireciona para a página inicial
                //TODO - Armazenar usuário e autentcação
                
                this.authService.setUser(response)
              }else{
                this.showInfoViaToast('Credênciais inválidas !')
              }
             
            },
            error: (error) => {
              console.error('Erro no login:', error);
              this.showInfoViaToast('Erro no login !')
            },
          });
        }
      }


      
    showInfoViaToast(message: string) {
      this.messageService.add({ key: 'tst', severity: 'info', summary: 'Informação', detail: message });
  }

  showWarnViaToast(message: string) {
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Atenção', detail: message });
  }

  showErrorViaToast(message: string) {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: message });
  }
}
