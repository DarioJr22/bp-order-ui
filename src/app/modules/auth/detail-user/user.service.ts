import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { URL } from "src/app/services/constants";
import { SimplePage } from "./paged-user";
import { User } from "../auth.service";

@Injectable({
    providedIn:'root'
})

export class UserService{
    constructor(private http:HttpClient){
    }


    getPagedUsers(page:number,limit:number):Observable<SimplePage<User>>{
       return this.http.get<SimplePage<User>>(`${URL}/user?page=${page}&limit=${limit}`)
    }
}