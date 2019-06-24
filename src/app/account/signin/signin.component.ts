import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentSidebarInfo } from '../../models/sidebar/current-sidebar-info';
import {AccountService} from '../../services/account.service';
import {HttpClient,HttpClientModule} from '@angular/common/http'; 
import {Base} from 'src/app/common/base';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  
  showLoader: boolean = false;
  isError: boolean = false;
  listItems: any[];

  invalidCredentialMsg: string = "";
  isUserEmpty:boolean;
  isPwdEmpty:boolean;
  adminURL: string = "";
  public selectedValue:any;

  // Cookie
  userName: string;
  password: string;

  private baseObj = new Base();
  currentPath: string;
  configData: any[];
  public arrCaptions: any[];
  public language: string;
  public load:boolean = false;


  constructor(private router: Router, private _accountService:AccountService, private _httpsClient:HttpClient) { }

  @ViewChild('myCanvas') myCanvas;
 
  ngOnInit() {

    // Get cookie start
    if(this.getCookie('cookieEmail') != '' && this.getCookie('cookiePassword') != ''){
      this.userName = this.getCookie('cookieEmail');
      this.password = this.getCookie('cookiePassword');
    }else{
      this.userName = '';
      this.password = '';
    }

    this.currentPath = this.baseObj.getCurrentUrl();

    this._httpsClient.get(this.currentPath + '/assets/configuration.json').subscribe(
      data =>{
        this.configData = data as string[];
        this.language = this.configData[0].language;
        this._httpsClient.get(this.currentPath + '/assets/i18n/'+this.language+'.json').subscribe(
          data=>{
                this.arrCaptions = data as string[];
                this.load = true;
                window.localStorage.setItem('captions',JSON.stringify(this.arrCaptions));
          } 
       );
        window.localStorage.setItem('currentURL',JSON.stringify(this.configData[0].optiProETDCAPIURL));
        this.getAdminUrl();
        
      }
    );

    
    // Apply classes on Body
    const element = document.getElementsByTagName("body")[0];
    element.className = "";
    element.classList.add("opti_body-login");
    element.classList.add("opti_account-module");

  }


  /**
   * function for get cookie data
   * @param cname 
   */
public getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
          }
      }
      return "";
  }

  /**
   * Function for set cookie data
   * @param cname 
   * @param cvalue 
   * @param exdays 
   */
  public setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires="+d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

 /**
   * Function to get admin url
   */
  public getAdminUrl(){
    this.showLoader = true;
    this._accountService.getAdminUrl(this.configData[0].optiProETDCAPIURL).subscribe(
        data => {
          this.adminURL = data;
          this.showLoader = false;
        }
      )
  }

public onPasswordBlur(username:string,password:string){
  if(this.adminURL != ""){
    let qcdcstr = "QCDC";
   this.showLoader = true;
   this.listItems = null;
   this.selectedValue = null;
      this._accountService.login(username,password,this.adminURL).subscribe(
        data => {
          if(data!= null && data.Table.length > 0 ){
            // this.listItems = data.Table.filter(function(obj){
            //   if(obj.OPTM_OPTIADDON.indexOf('QCDC') !== -1){ return obj; }
            // });
            
              this.listItems = data.Table.filter(a=>a.OPTM_OPTIADDON.indexOf('QCDC') !== -1);
              this.selectedValue = this.listItems[0];
              this.isError = false;
              this.showLoader = false;
          }
          else{
            this.showLoader = false;
            this.isError = true;
          }
         
        }
      )
  }
}

 
public async login(username:string,password:string,companyName:any) {
  this.showLoader = true;
  if(companyName != undefined && this.isError==false){
      window.localStorage.setItem("companyName",companyName.OPTM_COMPID);
      window.localStorage.setItem("userName",username);
      window.localStorage.setItem("password",password);
      this.router.navigateByUrl('home/dashboard');
  }else{
    if(username == ""){
    this.showLoader = false;
    this.isUserEmpty = true;
    this.invalidCredentialMsg = "Login Failed";
    }else if(password == ""){
      this.showLoader = false;
      this.isPwdEmpty = true;
      this.invalidCredentialMsg = "Login Failed";
    }
    else if(companyName == undefined){
        this.isError = true;
        this.showLoader = false;
    }
  } 
}

/**
   * Function for redirect to forget password
   */
  navigateToResetPassword(){
    this.router.navigateByUrl('account/resetpassword');
  }
}
