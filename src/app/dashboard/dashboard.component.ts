import { Component, OnInit, HostListener } from '@angular/core';
import { UIHelper } from '../helpers/ui.helpers';
import { GridComponent } from '@progress/kendo-angular-grid';
import { salesOrderContent } from '../DemoData/sales-order';
import { GroupDescriptor, DataResult, process } from '@progress/kendo-data-query';
import { Configuration } from 'src/assets/configuration';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public gridData: any[];
  isMobile: boolean;
  isColumnFilter: boolean = false;
  isColumnGroup: boolean = false;
  gridHeight: number;
  showLoader: boolean = false;
  searchRequest: string = '';

  imgPath = Configuration.imagePath;

  showGridLoader: boolean = false;  
  public groups: GroupDescriptor[] = [{ field: 'Category.CategoryName' }];

  
  // UI Section
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // apply grid height
    this.gridHeight = UIHelper.getMainContentHeight();

    // check mobile device
    this.isMobile = UIHelper.isMobile();
  }
  // End UI Section

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

    this.getSalesOrderContentList();
  }

  /**
   * Method to get list of inquries from server.
  */
  public getSalesOrderContentList() {
    this.showLoader = true;
    this.gridData = salesOrderContent;
    setTimeout(()=>{    
      this.showLoader = false;
    }, 1000);
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

  constructor() { }

  public listItems: Array<string> = [
      'Baseball', 'Basketball', 'Cricket', 'Field Hockey',
      'Football', 'Table Tennis', 'Tennis', 'Volleyball'
  ];

  public value = ['Basketball', 'Cricket'];


  // tab function
  openTab(evt, tabName, tabType) {
    this.tabName = tabName;
    UIHelper.customOpenTab(evt, 'horizontal');
  }

 
}
