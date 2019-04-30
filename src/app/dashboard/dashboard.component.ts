import { Component, OnInit, HostListener } from '@angular/core';
import { UIHelper } from '../helpers/ui.helpers';
import { GridComponent } from '@progress/kendo-angular-grid';
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

  public attrGridData: any[];
  public varGridData: any[];
  isMobile: boolean;
  isColumnFilter: boolean = false;
  isColumnGroup: boolean = false;
  gridHeight: number;
  showLoader: boolean = false;
  searchRequest: string = '';
  imgPath = Configuration.imagePath;
  showGridLoader: boolean = false;  
  public groups: GroupDescriptor[] = [{ field: 'Category.CategoryName' }];

  currentUrl: string;
  companyName: string;
  userName: string;
  password: string;
  public listItems: GroupResult[];
  public ungroupedData: any[];
  public listVal:any = ['Pass','Fail'];

  
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
    // Apply class on body start
    const element = document.getElementsByTagName("body")[0];
    element.className = "";
    element.classList.add("opti_body-dashboard");
    element.classList.add("opti_body-main-module");
    
    // apply grid height
    this.gridHeight = UIHelper.getMainContentHeight();

    // check mobile device
    this.isMobile = UIHelper.isMobile();

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

  public value = ['Basketball', 'Cricket'];

  // tab function
  openTab(evt, tabName, tabType) {
    this.tabName = tabName;
    UIHelper.customOpenTab(evt, 'horizontal');
  }

  showClick(docNo:any){
    this.qcservice.GetQCRecord(this.currentUrl,this.companyName,docNo.U_O_QCTEST_DOCNO).subscribe(
      data=>{
          this.attrGridData = data as any[];
      }
    );
  }
}
