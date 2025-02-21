import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }

        

        .form-wapper{
          display:grid;
          grid-template-columns:1fr 1fr;
          column-gap:1rem;
          row-gap:1rem
        }
        .address{
          display:grid;
          grid-column:span 2;
          row-gap:1rem
        }
        .register-button{
          grid-column:span 2;
        }
    `]
})
export class RegisterComponent {

    valCheck: string[] = ['remember'];

    password!: string;

    constructor(public layoutService: LayoutService,
        private authService:AuthService,
        private router:Router,
        private messageService:MessageService
    ) { }
    showWarnViaToast(message: string) {
      this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Atenção', detail: message });
  }

  showSucsessViaToast(message: string) {
    this.messageService.add({ key: 'tst', severity: 'success', summary: 'Sucesso', detail: message });
  }
    onSubmit(form: NgForm) {
        if (form.valid) {
          const { email, senha } = form.value;
          console.log(form.value);
          
          this.authService.register(form.value).subscribe({
            next: (response) => {
              this.showSucsessViaToast('Sucesso ao se registrar na plataforma !')
              this.authService.setUser(response)
              this.router.navigate(['/funcao/pedido']); // Redireciona para a página inicial
            },
            error: (error) => {
              this.showWarnViaToast("Erro ao fazer o cadastro, contate o suporte para saber mais")
            },
          });
        }
      }
}
