import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService, User } from '../auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from './user.service';
import { SimplePage } from './paged-user';

@Component({
    selector: 'app-detail-user',
    templateUrl: './detail-user.component.html',
    styleUrl:'./detail-user.component.scss'

})
export class DetailUserComponent implements OnInit {

    /* 
    Pendências 

    - [] Finalizar UI da parte da visualização de usuário
    - [] Controle de acesso para cliente e admin
    - [] Lista de usuários
    - [] Gráfico de engajamento
    - [] Lista de produtos com engajamento 
    
    
    */

    form:NgForm;
    usersList:User[] 
    pageUser = {
      page:1,
      limit:3
    }

    constructor(public layoutService: LayoutService,
        private authService:AuthService,
        private router:Router,
        private userService:UserService,
        private messageService: MessageService
    ) {}
  ngOnInit(): void {
    this.getUsers(this.pageUser.page,this.pageUser.limit)
  }

    
    
    updateProfile(form: NgForm) {
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

    nextUserPage(){
      this.pageUser.page += 1;
      this.getUsers(this.pageUser.page,this.pageUser.limit)
    }
    previeusUserPage(){
      this.pageUser.page -= 1;
      if(this.pageUser.page >= 0){
        this.getUsers(this.pageUser.page,this.pageUser.limit)
      }
      
    }
    
    
    getUsers(page:number,limit:number){
      this.userService.getPagedUsers(page,limit).subscribe({
        next:(data:SimplePage<User>) =>{
          this.usersList = data.data
        },
        error:()=>{
          this.showErrorViaToast('Erro ao recuperar usuários')
        }
      })
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

  //Gráfico
   multi = [
    {
      "name": "Germany",
      "series": [
        {
          "name": "1990",
          "value": 62000000
        },
        {
          "name": "2010",
          "value": 73000000
        },
        {
          "name": "2011",
          "value": 89400000
        }
      ]
    },
  
    {
      "name": "USA",
      "series": [
        {
          "name": "1990",
          "value": 250000000
        },
        {
          "name": "2010",
          "value": 309000000
        },
        {
          "name": "2011",
          "value": 311000000
        }
      ]
    },
  
    {
      "name": "France",
      "series": [
        {
          "name": "1990",
          "value": 58000000
        },
        {
          "name": "2010",
          "value": 50000020
        },
        {
          "name": "2011",
          "value": 58000000
        }
      ]
    },
    {
      "name": "UK",
      "series": [
        {
          "name": "1990",
          "value": 57000000
        },
        {
          "name": "2010",
          "value": 62000000
        }
      ]
    }
  ];
  
  view: any[] = [700, 300];
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };  

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
