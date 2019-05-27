import { Component, OnInit, HostListener } from '@angular/core';
import { UIHelper } from '../helpers/ui.helpers';
import { GridComponent, StringFilterMenuComponent } from '@progress/kendo-angular-grid';
import { salesOrderContent } from '../DemoData/sales-order';
import { GroupDescriptor, DataResult, process, GroupResult, groupBy } from '@progress/kendo-data-query';
import { Configuration } from 'src/assets/configuration';
import {QcdataService} from '../services/qcdata.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

//common variables
public ListToolGauge: any[]; 
  public ListInspID: any[];
  public ListResult:any[] = [ {"value":"Pass"},{"value":"Fail"}];

  //Variables for AttributeGrid
  public attrGridData: any[];
  public attrListValue: any[];
  public attrListAllowable: any[];
  public qcOrderData:any;
  public isAllowable:string;

//Variables for VariableGrid
public variGridData:any;
public variMesrdVal:string='';
public variObsrvatn:string='';
public variResult:string='';
public varInspTyp:boolean = false;
public varObservationArr:any[]=[{"value":"Within Range, Acceptable"},{"value":"Out of Range, Acceptable"},{"value":"Out of Range, Not Acceptable"}];

//public varInpTypCol:any[]=[{"value":""},{"value":"Measurement"},{"value":"GoNoGo"}]


  isMobile: boolean;
  isColumnFilter: boolean = false;
  isColumnGroup: boolean = false;
  gridHeight: number;
  showLoader: boolean = false;
  searchRequest: string = '';
  imgPath = Configuration.imagePath;
  showGridLoader: boolean = false;  
  public groups: GroupDescriptor[] = [{ field: 'Category.CategoryName' }];
  public isForced:Boolean=true;
  currentUrl: string;
  companyName: string;
  userName: string;
  password: string;
  public listItems: GroupResult[];
  public ungroupedData: any[];
  qcDocNo:string = '';
  arrCaptions:any[];
  public load:boolean = false;
 
  // UI Section
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // apply grid height
    this.gridHeight = UIHelper.getMainContentHeight();

    // check mobile device
    this.isMobile = UIHelper.isMobile();
  }
  // End UI Section

  constructor(private qcservice: QcdataService ) { }

  ngOnInit() {
    this.showLoader = true;
    // Apply class on body start
    const element = document.getElementsByTagName("body")[0];
    element.className = "";
    element.classList.add("opti_body-dashboard");
    element.classList.add("opti_body-main-module");
    
    // apply grid height
    this.gridHeight = UIHelper.getMainContentHeight();

    // check mobile device
    this.isMobile = UIHelper.isMobile();

    this.arrCaptions = JSON.parse( window.localStorage.getItem("captions"));
    this.companyName = window.localStorage.getItem("companyName");
    this.userName = window.localStorage.getItem("userName");
    this.password = window.localStorage.getItem("password");
    this.currentUrl= window.localStorage.getItem("currentURL");
    this.currentUrl = this.currentUrl.replace('"','');
    this.currentUrl = this.currentUrl.replace('"','');

    this.qcservice.getQCHeaderData(this.currentUrl,this.companyName).subscribe(
        data=>{
          this.ungroupedData = data as string[];
            this.listItems = groupBy(this.ungroupedData, [{field: "U_O_TEST_TRIGGER"}]);
            this.showLoader = false;
        },
        error=>{

        }
      );
  }
  

  /**
   * Method to get list of inquries from server.
  */
   public getSalesOrderContentList() {
  //   this.showLoader = true;
  //   this.gridData = salesOrderContent;
  //   setTimeout(()=>{    
  //     this.showLoader = false;
  //   }, 1000);
  }

  onFilterChange(checkBox:any,grid:GridComponent)
  {
    if(checkBox.checked==false){
      this.clearFilter(grid);
    }
  }

  clearFilter(grid:GridComponent){      
    //grid.filter.filters=[];
  }
  
  // End UI Section
  tabName: string = 'attribute';


  // tab function
  openTab(evt, tabName, tabType) {
    this.tabName = tabName;
    UIHelper.customOpenTab(evt, 'horizontal');
  }

  showClick(docNo:any){
    if(docNo != undefined){
    this.showLoader = true;
    this.qcDocNo = docNo.U_O_QCTEST_DOCNO;
    this.qcservice.GetQCRecord(this.currentUrl,this.companyName,docNo.U_O_QCTEST_DOCNO).subscribe(
      data=>{
          this.qcOrderData = data as any[];
          //Attribute Data
          this.attrGridData = this.qcOrderData.QCTestDataCollectionAttribute.filter(function(obj){
            if(obj.U_O_QC_RESULT=="1"){
            obj.QCRESULT = "Pass";
            }else if(obj.U_O_QC_RESULT=="2"){
              obj.QCRESULT = "Fail";
            }
            obj.currentVal = '';
            obj.isRemarkRequired = false;
            obj.isForcefull = false;
            return obj;
          })
          this.showLoader = false;
          this.attrListValue = this.qcOrderData.QCTestDataCollectionAttributeVal.filter(function(obj){
              
            return obj;
          });
          this.attrListAllowable = this.qcOrderData.GetAttrAllowedValueList;
          //Attribute Data

          //Variable Data
          this.variGridData=this.qcOrderData.QCTestDataCollectionVariable.filter(function(obj){
            obj.isRemarkReqVari=false;
            obj.isRemarkReqAttr=false;
            obj.isValueInvalidVari=false;
            obj.isVariResultAuto=true;
            if(obj.U_O_QC_RESULT=='1'){
              obj.variQCResult='Pass';
            }
            else if(obj.U_O_QC_RESULT=='2'){
              obj.variQCResult='Fail';
            }else{
              obj.variQCResult='';
            }
            if(obj.U_O_OBSERVATION=='1'){
              obj.variObservation='Within Range, Acceptable';
            }
            else if(obj.U_O_OBSERVATION=='2'){
              obj.variObservation='Out of Range, Acceptable';
            }
            else if(obj.U_O_OBSERVATION=='3'){
              obj.variObservation='Out of Range, Not Acceptable';
            }
            else{
              obj.variObservation='';
            }              
            return obj;
          });
          if (this.qcOrderData.QCTestDataCollectionVariable.U_O_INS_TYPE==2)
          {
            this.varInspTyp = true;
          }
          //Variable Data
          
          //Common Data
          this.ListToolGauge = this.qcOrderData.ToolGuage;
          this.ListInspID = this.qcOrderData.InspectorMaster;
          this.isAllowable = this.qcOrderData.QCDefaultSetup[0].U_O_SHOWALLOWABLE;
          //Common Data
        }
    );
  }
  }

  //Attribute Grid Code Starts
  attrGridValChange(attrValue:string,rowdata:any){
    this.attrGridData[rowdata.RowNumber-1].currentVal = attrValue;
     let rs:any = this.attrListValue.filter(function (obj) {
       if(obj.U_O_ATTRI_VAL==attrValue && obj.U_O_TEST_RLSEQ==rowdata.U_O_TEST_RLSEQ ){
         return obj.U_O_QC_RESULT;
       }
     });
     if(rs.length!=0){
          if(rs[0].U_O_QC_RESULT=="1"){
            this.attrGridData[rowdata.RowNumber-1].U_O_ATTRI_MEAS_VAL = attrValue;
            this.attrGridData[rowdata.RowNumber-1].U_O_QC_RESULT = "1"
              this.attrGridData[rowdata.RowNumber-1].QCRESULT = "Pass";
          }else if(rs[0].U_O_QC_RESULT=="2"){
            this.attrGridData[rowdata.RowNumber-1].U_O_ATTRI_MEAS_VAL = attrValue;
            this.attrGridData[rowdata.RowNumber-1].U_O_QC_RESULT = "2";
            this.attrGridData[rowdata.RowNumber-1].QCRESULT = "Fail";
          }
          else if(rs[0].U_O_QC_RESULT!=""){
            this.attrGridData[rowdata.RowNumber-1].U_O_ATTRI_MEAS_VAL = attrValue;
            this.attrGridData[rowdata.RowNumber-1].U_O_QC_RESULT = "";
            this.attrGridData[rowdata.RowNumber-1].QCRESULT = "";
              }
              this.checkResult(rowdata,rs[0].U_O_QC_RESULT);
      }else{
          if( this.attrGridData[rowdata.RowNumber-1].U_O_QC_RESULT != ""){
            this.attrGridData[rowdata.RowNumber-1].isRemarkReqAttr = true;
            this.attrGridData[rowdata.RowNumber-1].isForcefull = true;
          }else{
            this.attrGridData[rowdata.RowNumber-1].isRemarkReqAttr = false;
            this.attrGridData[rowdata.RowNumber-1].isForcefull = false;
          }
      }
     }
 
  //Attribute Grid Code Ends

  //Variable Grid Code Starts
variGridValChange(rowData:any,varMeasrdVal:any){
  if (varMeasrdVal==""){
    this.variGridData[rowData.RowNumber-1].isRemarkReqVari=false;
   }
  else{
    if (this.varInspTyp){
      this.checkForGoNoGo(rowData)
    }
    else{
      this.checkForMeasurment(rowData,varMeasrdVal)
    } 
  }
}

checkForMeasurment(rowData:any,varMeasrdVal:any){
if ((varMeasrdVal==rowData.U_O_VARI_TARGET_VAL)||((varMeasrdVal>=rowData.U_O_VARI_LOWER_VAL)&&((rowData.U_O_VARI_UPPER_VAL>=varMeasrdVal)))){
  this.variGridData[rowData.RowNumber-1].variObservation="Within Range, Acceptable";
  this.variGridData[rowData.RowNumber-1].variQCResult="Pass";
  this.variGridData[rowData.RowNumber-1].U_O_OBSERVATION=1;
  this.variGridData[rowData.RowNumber-1].U_O_QC_RESULT=1;
}
else{
  this.variGridData[rowData.RowNumber-1].variObservation="Out of Range, Not Acceptable";
  this.variGridData[rowData.RowNumber-1].variQCResult="Fail";
  this.variGridData[rowData.RowNumber-1].U_O_OBSERVATION=2;
  this.variGridData[rowData.RowNumber-1].U_O_QC_RESULT=2;
}
}

checkForGoNoGo(rowData:any){
  if ((rowData.U_O_GORESULT=="Pass")&&(rowData.U_O_NOGORESULT=="Pass")){
    this.variGridData[rowData.RowNumber-1].variObservation="Within Range, Acceptable";
    this.variGridData[rowData.RowNumber-1].variQCResult="Pass";
    this.variGridData[rowData.RowNumber-1].U_O_OBSERVATION=1;
    this.variGridData[rowData.RowNumber-1].U_O_QC_RESULT=1;
  }
  else if (((rowData.U_O_GORESULT=="Fail")&&(rowData.U_O_NOGORESULT=="Pass"))||((rowData.U_O_GORESULT=="Pass")&&(rowData.U_O_NOGORESULT=="Fail"))){
    this.variGridData[rowData.RowNumber-1].variObservation="Out of Range, Not Acceptable";
    this.variGridData[rowData.RowNumber-1].variQCResult="Fail";
    this.variGridData[rowData.RowNumber-1].U_O_OBSERVATION=3;
    this.variGridData[rowData.RowNumber-1].U_O_QC_RESULT=2;
  }
  else if ((rowData.U_O_GORESULT=="Fail")&&(rowData.U_O_NOGORESULT=="Fail")){
    this.variGridData[rowData.RowNumber-1].variObservation="Out of Range, Not Acceptable";
    this.variGridData[rowData.RowNumber-1].variQCResult="Fail";
    this.variGridData[rowData.RowNumber-1].U_O_OBSERVATION=3;
    this.variGridData[rowData.RowNumber-1].U_O_QC_RESULT=2;
  }
  if((rowData.U_O_GORESULT=="")&&(rowData.U_O_NOGORESULT=="")){
    this.variGridData[rowData.RowNumber-1].isValueInvalidVari=true;
  }
}
//Variable Grid Code Ends

//common Code Starts
dropDownChanged(grid:string,key:string,rowData:any,fieldValue:any){
  //Variable
  if(grid=="Vari"){
    if(key=="U_O_TG_ID_USED"){
      this.variGridData[rowData.RowNumber-1].U_O_TG_CODE=fieldValue;
    }
    if(key=="U_O_INSPECTOR_CODE"){
      this.variGridData[rowData.RowNumber-1].U_O_INSPECTOR_ID=fieldValue;
    }
    if(key=="U_O_QC_RESULT"){    
        if(this.varInspTyp){
        if(rowData.U_O_REMARKS!="" && fieldValue=='Fail'){
          this.variGridData[rowData.RowNumber-1].variObservation="Out of Range, Acceptable";
          this.variGridData[rowData.RowNumber-1].U_O_OBSERVATION=2;
          this.variGridData[rowData.RowNumber-1].variQCResult="Fail";
          this.variGridData[rowData.RowNumber-1].U_O_QC_RESULT=2;
          this.variGridData[rowData.RowNumber-1].isRemarkReqVari=true;
        }
        else if(rowData.U_O_REMARKS!="" && fieldValue=='Pass'){
          this.variGridData[rowData.RowNumber-1].variObservation="Out of Range, Acceptable";
          this.variGridData[rowData.RowNumber-1].U_O_OBSERVATION=2;
          this.variGridData[rowData.RowNumber-1].variQCResult="Pass";
          this.variGridData[rowData.RowNumber-1].U_O_QC_RESULT=1;
          this.variGridData[rowData.RowNumber-1].isRemarkReqVari=true;
        }
        else if((rowData.U_O_GORESULT=="Pass")&&(rowData.U_O_NOGORESULT=="Pass")&&(fieldValue=='Pass')){
          this.variGridData[rowData.RowNumber-1].isRemarkReqVari=false;
        }
      }
      else{
        if(rowData.U_O_REMARKS!="" && fieldValue=='Fail'){
          this.variGridData[rowData.RowNumber-1].variObservation="Out of Range, Acceptable";1
          this.variGridData[rowData.RowNumber-1].U_O_OBSERVATION=2;
          this.variGridData[rowData.RowNumber-1].variQCResult="Fail";
          this.variGridData[rowData.RowNumber-1].U_O_QC_RESULT=2;
          this.variGridData[rowData.RowNumber-1].isRemarkReqVari=true;
        }
        else if(rowData.U_O_REMARKS!="" && fieldValue=='Pass'){
          this.variGridData[rowData.RowNumber-1].variObservation="Out of Range, Acceptable";
          this.variGridData[rowData.RowNumber-1].U_O_OBSERVATION=2;
          this.variGridData[rowData.RowNumber-1].variQCResult="Pass";
          this.variGridData[rowData.RowNumber-1].U_O_QC_RESULT=1;
          this.variGridData[rowData.RowNumber-1].isRemarkReqVari=true;
        }
        else if (((rowData.U_O_VARI_MEA_VAL==rowData.U_O_VARI_TARGET_VAL)||((rowData.U_O_VARI_MEA_VAL>=rowData.U_O_VARI_LOWER_VAL)&&((rowData.U_O_VARI_UPPER_VAL>=rowData.U_O_VARI_MEA_VAL))))&&(fieldValue='Pass')){
          this.variGridData[rowData.RowNumber-1].isRemarkReqVari=false;
        }
      }    
    }
  }

  //Attribute
  else if(grid=="Attr"){
    if(key=="U_O_TG_ID_USED"){
      this.attrGridData[rowData.RowNumber-1].U_O_TG_CODE_USED = fieldValue;
    }
    if(key=="U_O_INSPECTOR_CODE"){
      this.attrGridData[rowData.RowNumber-1].U_O_INSPECTOR_CODE = fieldValue;
    }
    if(key=="U_O_QC_RESULT"){    
      let resVal:string;
      if(fieldValue=="Pass"){
        resVal = "1";
        this.attrGridData[rowData.RowNumber-1].U_O_QC_RESULT = "1";
        this.attrGridData[rowData.RowNumber-1].QCRESULT = "Pass";
      } else if (fieldValue=="Fail"){
        resVal = "2";
        this.attrGridData[rowData.RowNumber-1].U_O_QC_RESULT = "2";
        this.attrGridData[rowData.RowNumber-1].QCRESULT = "Fail";
      }else {
        resVal = "";
        this.attrGridData[rowData.RowNumber-1].U_O_QC_RESULT = "";
        this.attrGridData[rowData.RowNumber-1].QCRESULT = "";
      }
      this.checkResult(rowData,resVal);
    }
  }
}

checkResult(rowData:any,resVal:string){
  let resCurrVal = rowData.currentVal;
  if(resCurrVal != ""){
  let rs:any = this.attrListValue.filter(function (obj) {
    if(obj.U_O_ATTRI_VAL == resCurrVal && obj.U_O_TEST_RLSEQ==rowData.U_O_TEST_RLSEQ ){
      return obj.U_O_QC_RESULT;
    }
  });
  if(rs[0].U_O_QC_RESULT!=resVal){ 
      this.attrGridData[rowData.RowNumber-1].isRemarkReqAttr = true;
      this.attrGridData[rowData.RowNumber-1].isForcefull = true;
  }else{
    this.attrGridData[rowData.RowNumber-1].isRemarkReqAttr = false;
    this.attrGridData[rowData.RowNumber-1].isForcefull = false;
  }
}
else{
 if(resVal==""){
  this.attrGridData[rowData.RowNumber-1].isRemarkReqAttr = false;
  this.attrGridData[rowData.RowNumber-1].isForcefull = false;
 }else{
  this.attrGridData[rowData.RowNumber-1].isRemarkReqAttr = true;
  this.attrGridData[rowData.RowNumber-1].isForcefull = true;
  }
  }  
}

remarksFilled(grid:string,rowData:any,remarks:any){
  if(remarks!= undefined || remarks!= ""){
    if(grid=="Vari"){
      if(remarks==""){
        this.variGridData[rowData.RowNumber-1].isRemarkReqVari=true;
      }
      this.variGridData[rowData.RowNumber-1].isRemarkReqVari=false;
      this.variGridData[rowData.RowNumber-1].variObservation="Out of Range, Acceptable";
      this.variGridData[rowData.RowNumber-1].U_O_OBSERVATION=2; 
      this.variGridData[rowData.RowNumber-1].U_O_REMARKS=remarks; 
    }
    else if(grid=="Attr"){
        this.attrGridData[rowData.RowNumber-1].U_O_REMARKS = remarks;
        this.attrGridData[rowData.RowNumber-1].U_O_OBSERVATION = remarks;
        if(this.attrGridData[rowData.RowNumber-1].isRemarkReqAttr == true){
          this.attrGridData[rowData.RowNumber-1].isRemarkReqAttr = false;
          this.attrGridData[rowData.RowNumber-1].isForcefull = false;
        }
    }
  }
}
//Common Code Ends

saveClick(){
  let isSaved:boolean;
  if(this.validateGrid('save')){
    this.qcservice.SaveResult(this.currentUrl,this.attrGridData,this.variGridData,this.companyName,this.userName).subscribe(
      data=>{
        isSaved = data as boolean;
    });
  }
}

computeClick(){
  let isSaved:boolean;
  if(this.validateGrid('compute')){
        this.qcservice.ComputeResult(this.currentUrl,this.attrGridData,this.variGridData,this.companyName,this.userName).subscribe(
          data=>{
            isSaved = data as boolean;
        });
      }
  }


 validateGrid(source:String) {
 let save:boolean = true;

 this.attrGridData.filter(function(obj){
   if(obj.isRemarkReqAttr == true && obj.U_O_REMARKS ==""){
    save = false;
   }
 });
//  if(source=="save"){
//   for(var line=0; line<=this.attrGridData.length-1 ; line++){
//     if(this.attrGridData[line].isRemarkReqAttr == true && this.attrGridData[line].U_O_REMARKS==""){
//         this.attrGridData[line].isRemarkReqAttr = true;
//         this.attrGridData[line].isForcefull = true;
//         save = false;
//        break;
//       }
//     }
//   return save;
//  }
//  else if(source=="compute"){
//   for(var line=0; line<=this.attrGridData.length-1 ; line++){
//        if(this.attrGridData[line].isRemarkReqAttr == true && this.attrGridData[line].U_O_REMARKS=="" && this.attrGridData[line].U_O_QC_RESULT==""){
//           this.attrGridData[line].isRemarkReqAttr = true;
//           this.attrGridData[line].isForcefull = true;
//           save = false;
//         break;
//         } 
//     }

//  }
return save;
}

}

