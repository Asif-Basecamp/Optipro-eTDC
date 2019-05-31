import { Component, OnInit, HostListener } from '@angular/core';
import { UIHelper } from '../helpers/ui.helpers';
import { GridComponent, StringFilterMenuComponent } from '@progress/kendo-angular-grid';
import { ToastrService } from 'ngx-toastr';
import { GroupDescriptor, DataResult, process, GroupResult, groupBy } from '@progress/kendo-data-query';
import { Configuration } from 'src/assets/configuration';
import {QcdataService} from '../services/qcdata.service';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

//common variables
public ListToolGauge: any[]; 
  public ListInspID: any[];
  public ListResult:any[]; // [ {"value":"Pass"},{"value":"Fail"}];

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
public varObservationArr:any[];
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
  arrCaptions:any={};
  public load:boolean = false;
  public docNum:string;
 
  // UI Section
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // apply grid height
    this.gridHeight = UIHelper.getMainContentHeight();

    // check mobile device
    this.isMobile = UIHelper.isMobile();
  }
  // End UI Section

  constructor(private qcservice: QcdataService,private toastr: ToastrService) { }

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
    this.ListResult =  [{"value":this.arrCaptions.arrResultPass},{"value":this.arrCaptions.arrResultFail}];
this.varObservationArr = [{"value":this.arrCaptions.arrVarObsWithinAccept},{"value":this.arrCaptions.arrVarObsOutAccept},{"value":this.arrCaptions.arrVarObsOutNotAccept}];
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

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains'
};

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
      this.docNum = docNo;
    this.showLoader = true;
    this.qcDocNo = docNo.U_O_QCTEST_DOCNO;
    this.qcservice.GetQCRecord(this.currentUrl,this.companyName,docNo.U_O_QCTEST_DOCNO).subscribe(
      data=>{
          this.qcOrderData = data as any[];
          //Attribute Data
          this.attrGridData = this.qcOrderData.QCTestDataCollectionAttribute.filter((obj)=>
          {
            if(obj.U_O_QC_RESULT=="1"){
            obj.QCRESULT = "Pass";
            }else if(obj.U_O_QC_RESULT=="2"){
              obj.QCRESULT = "Fail";
            }
            obj.currentVal = '';
            obj.isRemarkReqAttr = false;
            obj.isForcefull = false;
            obj.values = obj.U_O_ATTRI_VAL.split(";");
            return obj;
          })
          this.showLoader = false;
          this.attrListValue = this.qcOrderData.QCTestDataCollectionAttributeVal;
          this.attrListAllowable = this.qcOrderData.GetAttrAllowedValueList;
          //Attribute Data

          //Variable Data
          this.variGridData=this.qcOrderData.QCTestDataCollectionVariable.filter((obj)=>
          {
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
              obj.variObservation=this.arrCaptions.arrVarObsWithinAccept;
            }
            else if(obj.U_O_OBSERVATION=='2'){
              obj.variObservation=this.arrCaptions.arrVarObsOutAccept;
            }
            else if(obj.U_O_OBSERVATION=='3'){
              obj.variObservation=this.arrCaptions.arrVarObsOutNotAccept;
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
    let rs:any = this.attrListValue.filter(obj=>obj.U_O_ATTRI_VAL==attrValue && obj.U_O_TEST_RLSEQ==rowdata.U_O_TEST_RLSEQ);
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
    //this.variGridData[rowData.RowNumber-1].isRemarkReqVari=true;
   }
  else{
    this.variGridData[rowData.RowNumber-1].U_O_VARI_MEA_VAL=varMeasrdVal;
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
  this.variGridData[rowData.RowNumber-1].variObservation=this.arrCaptions.arrVarObsWithinAccept;
  this.variGridData[rowData.RowNumber-1].variQCResult="Pass";
  this.variGridData[rowData.RowNumber-1].U_O_OBSERVATION=1;
  this.variGridData[rowData.RowNumber-1].U_O_QC_RESULT=1;
}
else{
  this.variGridData[rowData.RowNumber-1].variObservation=this.arrCaptions.arrVarObsOutNotAccept;
  this.variGridData[rowData.RowNumber-1].variQCResult="Fail";
  this.variGridData[rowData.RowNumber-1].U_O_OBSERVATION=2;
  this.variGridData[rowData.RowNumber-1].U_O_QC_RESULT=2;
}
}

checkForGoNoGo(rowData:any){
  if ((rowData.U_O_GORESULT=="Pass")&&(rowData.U_O_NOGORESULT=="Pass")){
    this.variGridData[rowData.RowNumber-1].variObservation=this.arrCaptions.arrVarObsWithinAccept;
    this.variGridData[rowData.RowNumber-1].variQCResult="Pass";
    this.variGridData[rowData.RowNumber-1].U_O_OBSERVATION=1;
    this.variGridData[rowData.RowNumber-1].U_O_QC_RESULT=1;
  }
  else if (((rowData.U_O_GORESULT=="Fail")&&(rowData.U_O_NOGORESULT=="Pass"))||((rowData.U_O_GORESULT=="Pass")&&(rowData.U_O_NOGORESULT=="Fail"))){
    this.variGridData[rowData.RowNumber-1].variObservation=this.arrCaptions.arrVarObsOutNotAccept;
    this.variGridData[rowData.RowNumber-1].variQCResult="Fail";
    this.variGridData[rowData.RowNumber-1].U_O_OBSERVATION=3;
    this.variGridData[rowData.RowNumber-1].U_O_QC_RESULT=2;
  }
  else if ((rowData.U_O_GORESULT=="Fail")&&(rowData.U_O_NOGORESULT=="Fail")){
    this.variGridData[rowData.RowNumber-1].variObservation=this.arrCaptions.arrVarObsOutNotAccept;
    this.variGridData[rowData.RowNumber-1].variQCResult="Fail";
    this.variGridData[rowData.RowNumber-1].U_O_OBSERVATION=3;
    this.variGridData[rowData.RowNumber-1].U_O_QC_RESULT=2;
  }
  if((rowData.U_O_GORESULT=="")&&(rowData.U_O_NOGORESULT=="")){
    this.variGridData[rowData.RowNumber-1].isValueInvalidVari=true;
  }
}

resultChangeForGoNoGo(rowData:any,fieldValue:string){
  if(rowData.U_O_REMARKS!="" && fieldValue=='Fail'){
    this.variGridData[rowData.RowNumber-1].variObservation=this.arrCaptions.arrVarObsOutAccept;
    this.variGridData[rowData.RowNumber-1].U_O_OBSERVATION=2;
    this.variGridData[rowData.RowNumber-1].variQCResult="Fail";
    this.variGridData[rowData.RowNumber-1].U_O_QC_RESULT=2;
  }
  else if(rowData.U_O_REMARKS!="" && fieldValue=='Pass'){
    this.variGridData[rowData.RowNumber-1].variObservation=this.arrCaptions.arrVarObsOutAccept;
    this.variGridData[rowData.RowNumber-1].U_O_OBSERVATION=2;
    this.variGridData[rowData.RowNumber-1].variQCResult="Pass";
    this.variGridData[rowData.RowNumber-1].U_O_QC_RESULT=1;
  }
  if((rowData.U_O_GORESULT=="Pass")&&(rowData.U_O_NOGORESULT=="Pass")&&(fieldValue=='Pass')){
    this.variGridData[rowData.RowNumber-1].isRemarkReqVari=false;
  }
  else if((rowData.U_O_GORESULT=="Fail")&&(rowData.U_O_NOGORESULT=="Fail")&&(fieldValue=='Fail')){
    this.variGridData[rowData.RowNumber-1].isRemarkReqVari=false;
  }
  if(((rowData.U_O_GORESULT=="Fail")&&(rowData.U_O_NOGORESULT=="Pass"))||((rowData.U_O_GORESULT=="Pass")&&(rowData.U_O_NOGORESULT=="Fail"))){
    this.variGridData[rowData.RowNumber-1].isRemarkReqVari=false;
  }
  else{
    this.variGridData[rowData.RowNumber-1].isRemarkReqVari=true;
  }
  if ((rowData.U_O_GORESULT=="" || rowData.U_O_NOGORESULT=="")){
    if((fieldValue=='Pass' || fieldValue=='Fail') && rowData.U_O_REMARKS==""){
      this.variGridData[rowData.RowNumber-1].isRemarkReqVari=true;
    }
    else if ((fieldValue=='Pass' || fieldValue=='Fail') && rowData.U_O_REMARKS!=""){
      this.variGridData[rowData.RowNumber-1].isRemarkReqVari=false;
    }
  }
}
resultChangeForMeasurment(rowData:any,fieldValue:string){
  if(rowData.U_O_REMARKS!="" && fieldValue=='Fail'){
    this.variGridData[rowData.RowNumber-1].variObservation=this.arrCaptions.arrVarObsOutAccept;
    this.variGridData[rowData.RowNumber-1].U_O_OBSERVATION=2;
    this.variGridData[rowData.RowNumber-1].variQCResult="Fail";
    this.variGridData[rowData.RowNumber-1].U_O_QC_RESULT=2;
  }
  else if(rowData.U_O_REMARKS!="" && fieldValue=='Pass'){
    this.variGridData[rowData.RowNumber-1].variObservation=this.arrCaptions.arrVarObsOutAccept;
    this.variGridData[rowData.RowNumber-1].U_O_OBSERVATION=2;
    this.variGridData[rowData.RowNumber-1].variQCResult="Pass";
    this.variGridData[rowData.RowNumber-1].U_O_QC_RESULT=1;
  }

  if (rowData.U_O_VARI_MEA_VAL!=""){
    if(fieldValue=="Pass"){
    if(rowData.U_O_VARI_MEA_VAL>=rowData.U_O_VARI_LOWER_VAL && rowData.U_O_VARI_UPPER_VAL>=rowData.U_O_VARI_MEA_VAL){
      this.variGridData[rowData.RowNumber-1].isRemarkReqVari=false;
    }else{
      if( this.variGridData[rowData.RowNumber-1].U_O_REMARKS == "")
      this.variGridData[rowData.RowNumber-1].isRemarkReqVari=true;
    }
  }else if(fieldValue=="Fail"){
    if(rowData.U_O_VARI_MEA_VAL>=rowData.U_O_VARI_LOWER_VAL && rowData.U_O_VARI_UPPER_VAL>=rowData.U_O_VARI_MEA_VAL){
      this.variGridData[rowData.RowNumber-1].isRemarkReqVari=true;
    }else{
      if( this.variGridData[rowData.RowNumber-1].U_O_REMARKS == "")
      this.variGridData[rowData.RowNumber-1].isRemarkReqVari=false;
    }
  }
  else{
    if(rowData.U_O_VARI_MEA_VAL != "" || rowData.U_O_VARI_MEA_VAL != null){
      if( this.variGridData[rowData.RowNumber-1].U_O_REMARKS == "")
      this.variGridData[rowData.RowNumber-1].isRemarkReqVari=true;
    }
  }
  }else{
        if(fieldValue=="Pass" || fieldValue=="Fail"){
          if( this.variGridData[rowData.RowNumber-1].U_O_REMARKS == "")
          this.variGridData[rowData.RowNumber-1].isRemarkReqVari=true;
        }
  }
}
//Variable Grid Code Ends

//common Code Starts
dropDownChanged(grid:string,key:string,rowData:any,fieldValue:any){
  //Variable
  if(grid=="Vari"){
    if(key=="U_O_TG_ID_USED"){
      this.variGridData[rowData.RowNumber-1].U_O_TG_ID_USED=fieldValue;
    }
    if(key=="U_O_INSPECTOR_CODE"){
      let rs:any = this.ListInspID.filter(obj=>obj.Name==fieldValue);
      if(rs.length>0){
      this.variGridData[rowData.RowNumber-1].U_O_INSPECTOR_ID = rs[0].Code;
      }
    }
    if(key=="U_O_QC_RESULT"){    
      if(this.varInspTyp){
          this.resultChangeForGoNoGo(rowData,fieldValue)
      }
      else{
        this.resultChangeForMeasurment(rowData,fieldValue)
      }    
    }
  }

  //Attribute
  else if(grid=="Attr"){
    if(key=="U_O_TG_ID_USED"){
      this.attrGridData[rowData.RowNumber-1].U_O_TG_CODE_USED = fieldValue;
    }
    if(key=="U_O_INSPECTOR_CODE"){
      let rs:any = this.ListInspID.filter(obj=>obj.Name==fieldValue);
      if(rs.length>0){
      this.attrGridData[rowData.RowNumber-1].U_O_INSPECTOR_CODE = rs[0].Code;
      }
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
    let rs:any = this.attrListValue.filter(obj=>obj.U_O_ATTRI_VAL == resCurrVal && obj.U_O_TEST_RLSEQ==rowData.U_O_TEST_RLSEQ);
  if(rs[0].U_O_QC_RESULT!=resVal){ 
    if( this.attrGridData[rowData.RowNumber-1].U_O_REMARKS == "" || this.attrGridData[rowData.RowNumber-1].U_O_REMARKS == null ){
      this.attrGridData[rowData.RowNumber-1].isRemarkReqAttr = true;
      this.attrGridData[rowData.RowNumber-1].isForcefull = true;
    }
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
  if( this.attrGridData[rowData.RowNumber-1].U_O_REMARKS == "" || this.attrGridData[rowData.RowNumber-1].U_O_REMARKS == null){
        this.attrGridData[rowData.RowNumber-1].isRemarkReqAttr = true;
        this.attrGridData[rowData.RowNumber-1].isForcefull = true;
      }
    }
  }  
}

remarksFilled(grid:string,rowData:any,remarks:any){
  if(remarks!= undefined && remarks!= null){
    if(grid=="Vari"){
        this.variGridData[rowData.RowNumber-1].U_O_OBSERVATION=2; 
      this.variGridData[rowData.RowNumber-1].U_O_REMARKS=remarks; 
      this.variGridData[rowData.RowNumber-1].variObservation=this.arrCaptions.arrVarObsOutAccept;
      if(this.variGridData[rowData.RowNumber-1].isRemarkReqVari == true && remarks!=""){
        this.variGridData[rowData.RowNumber-1].isRemarkReqVari = false;
      }
      else if(remarks==""){
        let resultValue = this.variGridData[rowData.RowNumber-1].U_O_QC_RESULT;
      if(this.varInspTyp){
          this.resultChangeForGoNoGo(rowData,resultValue)
      }
      else{
        this.resultChangeForMeasurment(rowData,resultValue)
      }    
      }
    }
    else if(grid=="Attr"){
        this.attrGridData[rowData.RowNumber-1].U_O_REMARKS = remarks;
        this.attrGridData[rowData.RowNumber-1].U_O_OBSERVATION = remarks;
        if(this.attrGridData[rowData.RowNumber-1].isRemarkReqAttr == true && remarks!=""){
          this.attrGridData[rowData.RowNumber-1].isRemarkReqAttr = false;
          this.attrGridData[rowData.RowNumber-1].isForcefull = false;
        }
        else if(remarks==""){
          this.checkResult(rowData,this.attrGridData[rowData.RowNumber-1].U_O_QC_RESULT)
        }
      }
  }
}
//Common Code Ends

saveClick(){
  let isSaved:boolean;
  if(this.validateGrid('save')){
    this.attrGridData = this.attrGridData.filter(function(obj){
      delete obj.values;
      return obj;
    });
    this.qcservice.SaveResult(this.currentUrl,this.attrGridData,this.variGridData,this.companyName,this.userName).subscribe(
      data=>{
        isSaved = data as boolean;
          if(isSaved==true){
            this.showMessage("success");
            this.showClick(this.docNum);
        }else{
          this.showMessage("error");
          this.showClick(this.docNum);
        }
      },
      error=>{
        this.showMessage("error'");
        this.showClick(this.docNum);
      });
    }else{
      this.showMessage("warning");
  }
}

computeClick(){
  let isSaved:boolean;
  if(this.validateGrid('compute')){
    this.attrGridData = this.attrGridData.filter(function(obj){
      delete obj.values;
      return obj;
    });
        this.qcservice.ComputeResult(this.currentUrl,this.attrGridData,this.variGridData,this.companyName,this.userName).subscribe(
          data=>{
            isSaved = data as boolean;
            if(isSaved==true){
              this.showMessage("comupte_success");
              this.showClick(this.docNum);
            }else{
              this.showMessage("comupte_fail");
              this.showClick(this.docNum);
          }
        },
        error=>{
          this.showMessage("comupte_fail");
          this.showClick(this.docNum);
        });
      }
      else{
        this.showMessage("warning");
      }
  }


 validateGrid(source:String) {
    let save:boolean = true;
      if(source=="save"){
        
        let arrAttr:any = this.attrGridData.filter((obj)=>obj.isRemarkReqAttr == true && (obj.U_O_REMARKS =="" || obj.U_O_REMARKS == null));
        let arrVar:any = this.variGridData.filter((obj)=>obj.isRemarkReqVari == true && (obj.U_O_REMARKS =="" || obj.U_O_REMARKS == null));
        
        if(arrAttr.length>0 || arrVar.length>0){
          save = false;
        }
      }
      else if(source=="compute"){
       
        let arrAttr = this.attrGridData.filter(obj=>(obj.isRemarkReqAttr == true) || (obj.U_O_ATTRI_MEAS_VAL == "" && (obj.U_O_QC_RESULT == null || obj.U_O_QC_RESULT == "" || obj.U_O_QC_RESULT == undefined || (obj.U_O_REMARKS =="" || obj.U_O_REMARKS == null))));

        let arrVar = this.variGridData.filter(obj=>(obj.isRemarkReqVari == true) || (obj.U_O_VARI_MEA_VAL == "" && (obj.U_O_QC_RESULT == null || obj.U_O_QC_RESULT == "" || obj.U_O_QC_RESULT == undefined || (obj.U_O_REMARKS =="" || obj.U_O_REMARKS == null))));
        
        // let arrVar = this.variGridData.filter(obj=> (obj.U_O_QC_RESULT == null || obj.U_O_QC_RESULT == undefined || obj.U_O_QC_RESULT == "" || (obj.U_O_REMARKS =="" ||obj.U_O_REMARKS ==null)) || (this.variGridData.isRemarkReqVari==true))
        
        if(arrAttr.length>0 || arrVar.length>0){
          save = false;
        }
      }
    return save;
  }

  showMessage(type:string){
    switch(type){
      case("error"):{
        this.toastr.error(this.arrCaptions.err_fail_cap,this.arrCaptions.err_fail, {
          timeOut: 3000
        });
        break;
      }
      case("warning"):{
        this.toastr.warning(this.arrCaptions.err_warning_cap,this.arrCaptions.err_fail, {
          timeOut: 3000
        });
        break;
      }
      case("success"):{
        this.toastr.success(this.arrCaptions.err_success_cap,this.arrCaptions.err_success, {
          timeOut: 3000
        });
        break;
      }
      case("comupte_success"):{
        this.toastr.success(this.arrCaptions.err_success_compute_cap,this.arrCaptions.err_success, {
          timeOut: 3000
        });
        break;
      }
      case("comupte_fail"):{
        this.toastr.success(this.arrCaptions.err_fail_compute_cap,this.arrCaptions.err_fail, {
          timeOut: 3000
        });
        break;
      }
    }
  }
}

