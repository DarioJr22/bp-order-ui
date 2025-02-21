import { Component, OnInit, ViewChild } from '@angular/core';
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

    @ViewChild('myForm') form:NgForm;
    user:any

    //ADMIN
    usersList:User[] 
    pageUser = {
      page:1,
      limit:3
    }

    constructor(public layoutService: LayoutService,
        private auth:AuthService,
        private router:Router,
        private userService:UserService,
        private messageService: MessageService
    ) {}
  ngOnInit(): void {
    this.loggedInUser();
    this.isAdmin()
  }

  isAdmin(){
    this.auth.isAdmin() ? this.adminChargeUser() : this.clientChargeUser()
  }

  loggedInUser(){
    if(this.auth.verifyIfItsLoggedIn()){
      this.user  =  this.auth.getCoockieUser()
      this.fillUserData()
    }else{
      this.router.navigate(['funcao/pedido'])
    }
  }

  fillUserData(){
    setTimeout(()=>{
      this.form.setValue({
        email:this.user.email,
     //   username:this.user.username,
        name:this.user.name
      })


      this.userService.getUserById(this.user.id).subscribe((user:any)=>{
        this.imagePreview = user.profilePicture
        
      })

      
      console.log(this.user);

      
      console.log(this.form);
    })
  

   
  }

  adminChargeUser(){
    this.getUsers(this.pageUser.page,this.pageUser.limit)
  }

  clientChargeUser(){

  }

    
    
    updateProfile(form: NgForm) {
        if (form.valid) {
          const { email, password } = form.value;
          this.auth.login(email, password).subscribe({
            next: (response) => {
              console.log('Login bem-sucedido:', response);

              if(response.usuarioValido){
                this.showInfoViaToast('Login bem sucedido !')
                this.router.navigate(['/funcao/pedido']); // Redireciona para a página inicial
                
                //TODO - Armazenar usuário e autentcação
                
                this.auth.setUser(response)
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
          /* this.showErrorViaToast('Erro ao recuperar usuários') */
        }
      })
    }

    updateUser(){

     let {email,username, name} = this.form.value
     console.log(this.form.value);
     
     this.user.email = email
     //this.user.username = username
     this.user.name = name
     this.user.profilePicture = this.imagePreview
      this.userService.updateUser(`${this.user.id}`,this.user).subscribe(
        {
          next:(usuario:any)=>{
            this.showInfoViaToast('Usuário atualizado.')
            this.showInfoViaToast(JSON.stringify(usuario))
            delete usuario.profilePicture
            this.auth.setUser(usuario)
            this.user  =  this.auth.getCoockieUser()
          },
          error:(erro)=>{
            this.showErrorViaToast('Erro ao atualizar usuário.')
          }
        }
      )
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
   single = [
    { "name": "cliqueproduto", "value": 30 },
    { "name": "carrinhoproduto", "value": 25 },
    { "name": "entrarplataforma", "value": 15 },
    { "name": "detalheproduto", "value": 5 },
    { "name": "exportarpedido", "value": 8 }
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
   // options
   showXAxis: boolean = true;
   showYAxis: boolean = true;
   gradient: boolean = false;
   showLegend: boolean = true;
  
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

  imagePreview: string | ArrayBuffer | null = null;

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Gera a pré-visualização da imagem
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }


  //obtenção e tratamento de logs TODO 

  // Método para processar os dados brutos e transformá-los no formato do ngx-charts
  processData(rawData: any[]): { name: string, value: number }[] {
    // Objeto para armazenar a contagem de cada ação
    const actionCounts: { [key: string]: number } = {};

    // Contar as ocorrências de cada ação
    rawData.forEach(entry => {
      const action = entry.acao;
      if (actionCounts[action]) {
        actionCounts[action]++;
      } else {
        actionCounts[action] = 1;
      }
    });

    // Transformar o objeto em um array no formato esperado pelo ngx-charts
    const result = Object.keys(actionCounts).map(action => ({
      name: action,
      value: actionCounts[action]
    }));

    return result;

    /*  rawData = [
    { id: 1, acao: 'cliqueproduto', data: '2025-02-21 13:15:38.416', userId: 4, productId: 797 },
    { id: 2, acao: 'cliqueproduto', data: '2025-02-21 13:15:50.619', userId: 4, productId: 797 },
    { id: 3, acao: 'cliqueproduto', data: '2025-02-21 13:18:14.258', userId: 4, productId: 797 },
    { id: 4, acao: 'carrinhoproduto', data: '2025-02-21 13:18:14.374', userId: 4, productId: 797 },
    // Adicione os demais dados aqui...
  ]; */
  }

  
}
