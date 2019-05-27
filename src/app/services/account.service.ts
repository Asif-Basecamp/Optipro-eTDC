import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http'; 
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  
  constructor(private _httpsClient:HttpClient) { }

   //defining properties for the call 
   httpOptions = {
    headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Accept':'application/json'
      })
    };

    getAdminUrl(baseUrl:string):Observable<any>{
      let jObject:any = {ETDC: JSON.stringify([{CompanyDBId:"OPTIPROADMIN"}])};
       return this._httpsClient.post(baseUrl+"/Login/GetPSURL",jObject,this.httpOptions);
    }

    login(username:string,password:string,adminUrl:string):Observable<any>{
      let jObject:any={ Login: JSON.stringify([{ User: username, Password: password, IsAdmin: false }]) };
      return this._httpsClient.post(adminUrl+"api/login/ValidateUserLogin",jObject,this.httpOptions);
     
    }


    
}
