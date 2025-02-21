import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role, URL } from 'src/app/services/constants';
import { Password } from 'primeng/password';
import { CookieService } from 'ngx-cookie-service';

export interface User {
  logado:boolean;
  id?: number;
  email: string;
  name?: string;
  role?:string;
  username?:string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = URL; // URL do backend

   
    //Produtos no carrinho
    loggedUser:WritableSignal<User> = signal<User>({
      logado:false,
      email:''
    })

    setUser(newUser:User){
      this.loggedUser.update((actualUser) => {
        Object.assign(actualUser,newUser)
        actualUser.logado = true
        console.log(actualUser);
        
        this.coockie.set('userLogged',JSON.stringify(actualUser))   
        
        return actualUser
      })
    }

    getUser(){
      return this.loggedUser()
     }  
  constructor(
    private http: HttpClient,
    private coockie:CookieService
  ) {}

  // Login
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/valid-user`, { email, password });
  }


  // Cadastro
  register(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/user`, user);
  }

  verifyIfItsLoggedIn(){
    console.log(this.coockie.check('userLogged'));
    
   return this.coockie.check('userLogged') && JSON.parse(this.coockie.get('userLogged')).logado
  }

  getCoockieUser(){
    return JSON.parse(this.coockie.get('userLogged')) as User
  }

  isAdmin(){
    return this.verifyIfItsLoggedIn() ? JSON.parse(this.coockie.get('userLogged')).role == Role.ADMIN : false
  }

  out(){
    this.verifyIfItsLoggedIn() ? this.coockie.delete('userLogged'): null
  }
}