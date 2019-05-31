import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { SigninComponent } from './signin/signin.component';



import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';




@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,

    // BS
    PerfectScrollbarModule,

    ButtonsModule,
    DropDownsModule,

    HttpClientModule,         
    FormsModule,
    TooltipModule.forRoot(),
  ],
  declarations: [SigninComponent]
})
export class AccountModule { }
