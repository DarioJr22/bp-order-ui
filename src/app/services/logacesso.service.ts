import { HttpClient } from "@angular/common/http";
import { effect, Injectable } from "@angular/core";
import { CookieServiceImp } from "./coockie.service";
import { LayoutService } from "../layout/service/app.layout.service";
import { URL } from "./constants";

export enum TipoAcao {

    ENTRAR = 'entrarplataforma',
    VISUALIZACAO = 'visualizacaoproduto',
    CLIQUE = 'cliqueproduto',
    DETALHEPRODUTO = 'detalheproduto',
    PRODUTONOCARRINHO = 'carrinhoproduto',
    EXPORTARPEDIDO = 'exportarpedido',
  }

  @Injectable({providedIn:'root'})

  export class LogService{

 constructor(
    private http:HttpClient,
   
  ) {
    effect(()=>{
        
    })
  }

    createLog(
        acao:TipoAcao,
        usuarioId:number,
        produtoId:string
    ){
       return this.http.post(`${URL}/log`,{
        acao:acao,
        usuarioId:usuarioId,
        produtoId:produtoId 
        })
    }

  }