import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QcdataService {

  constructor(private httpClient:HttpClient ) { }

    //defining properties for the call 
    httpOptions = {
      headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Accept':'application/json'
        })
      };

      getQCHeaderData(currentUrl:string,companyName:string){
        let jObject:any = { ETDC: JSON.stringify([{CompanyDBId:companyName}])};
        return this.httpClient.post(currentUrl+"/QCOrder/GetAllQCHeader",jObject,this.httpOptions);
      }

      GetQCRecord(currentUrl:string,companyName:string,docNo:string){
        let jObject:any = { ETDC: JSON.stringify([{CompanyDBId:companyName,QCDocNo:docNo}])};
        return this.httpClient.post(currentUrl+"/QCOrder/GetQCRecord",jObject,this.httpOptions);
      }

      SaveResult(currentUrl:string,ag:any,vg:any,companyName:string,userName:string){
      //let jObject:any = {ETDC: JSON.stringify([{Attribute:gridData,CompanyDBId:companyName,UserName:userName}])};
      let jObject:any = {Attribute:JSON.stringify([{ag}]),Variable:JSON.stringify([{vg}]),User: JSON.stringify([{CompanyDBId:companyName,UserName:userName}])}
        return this.httpClient.post(currentUrl+"/QCOrder/SaveResult",jObject,this.httpOptions);
      }
     
      ComputeResult(currentUrl:string,ag:any,vg:any,companyName:string,userName:string){
        //let jObject:any = {ETDC: JSON.stringify([{Attribute:gridData,CompanyDBId:companyName,UserName:userName}])};
        let jObject:any = {Attribute:JSON.stringify([{ag}]),Variable:JSON.stringify([{vg}]),User: JSON.stringify([{CompanyDBId:companyName,UserName:userName}])}
          return this.httpClient.post(currentUrl+"/QCOrder/ComputeResult",jObject,this.httpOptions);
        }
}
