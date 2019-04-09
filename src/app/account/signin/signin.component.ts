import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentSidebarInfo } from '../../models/sidebar/current-sidebar-info';


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
  userNotExist:boolean=false;

  // Cookie
  userName: string;
  password: string;
  

  
  
  constructor(private router: Router) { }

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
   * Function for login
   */
  public async login() {

    this.showLoader = true;
    setTimeout(()=>{ 
      this.showLoader = false;
      this.router.navigateByUrl('home/dashboard');
    }, 500);    
  }

  /**
   * Function for redirect to forget password
   */
  navigateToResetPassword(){
    this.router.navigateByUrl('account/resetpassword');
  }
}
