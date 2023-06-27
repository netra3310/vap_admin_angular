import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import {
  GenericMenuItems,
  RowGroup,
} from "src/app/shared/model/genric-menu-items.model";
import { Columns } from "src/app/shared/model/columns.model";
import { PermissionService } from "src/app/shared/services/permission.service";
import { RowGroupTypeEnum } from "src/app/shared/Enum/row-group-type.enum ";
import { FilterRequestModel } from "src/app/Helper/models/FilterRequestModel";
import { vaplongapi } from "src/app/Service/vaplongapi.service";
import { StickyComponent } from 'src/app/_metronic/kt/components';
import { Brand } from 'src/app/Helper/models/Brand';

@Component({
  selector: 'app-lists-widget-notifications',
  templateUrl: './lists-widget-notifications.component.html',
  styleUrls: ['./lists-widget-notifications.component.scss']
})
export class ListsWidgetNotificationsComponent implements OnInit {
  @Input() menuItems: GenericMenuItems[] = [];
  @Input() data: any[] = [];
  @Input() globalFilterFields: string[];
  @Input() totalRecords = 0;
  @Input() rowsPerPageOptions: number[] = [25, 50, 100];
  @Input() row = 25;
  @Input() section : string = 'success';
  @Input() rowGroup: RowGroup = {
    property: "CreatedAt",
    enableRowGroup: false,
    propertyType: RowGroupTypeEnum.DATE,
  };
  @Input("columnsData")
  set model(value: Columns[]) {
    value.forEach((x) => {
      if (x.permission) {
        if (this.permission.getPermissionAccess(x.permission)) {
          this.columns.push(x);
          this.selectedColumns.push(x);
        }
      } else {
        this.columns.push(x);
        this.selectedColumns.push(x);
      }
    });

    //this.columns = [...value];
    //this.selectedColumns = [...value];
  }

  @Output() emitMenuAction = new EventEmitter();
  @Output() getLazyData = new EventEmitter();
  @Output() emitHref = new EventEmitter();
  @Output() setTotalCounts = new EventEmitter();

  columns: Columns[] = [];
  Column: Columns[];
  selectedColumns: Columns[] = [];
  filterRequestModel: FilterRequestModel;
  imageBasePath;
  groupedByDate : any = [];
  

  constructor(
    private permission: PermissionService,
    private apiService: vaplongapi,
    private cdr: ChangeDetectorRef
  ) { 
    this.imageBasePath = this.apiService.imageBasePath;
    this.FilterRequestModelInilizationFunction();
    
    this.getLazyData.emit(this.filterRequestModel);
  }

  logData: Array<{date: string, data: any}> = []

  showCounts : number;

  ngOnInit(): void {
    // this.newData = [...this.data];
    // this.items = [
    //   { label: 'Wishlist', icon: 'fas fa-shopping-cart', command: () => this.emitOutput('Wishlist', this.selectedStock) },
    // ];

    this.FilterRequestModelInilizationFunction();
    
    this.getLazyData.emit(this.filterRequestModel);

    // setInterval(()=>{
    //   this.getLazyData.emit(this.filterRequestModel);
    // }, 30000)
    
  }
  FilterRequestModelInilizationFunction(): void {
    this.filterRequestModel = new FilterRequestModel(
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      new Date(),
      new Date(),
      10,
      0,
      true,
      false,
      -1,
      -1,
      -1,
      false,
      false,
      false,
      "",
      "",
      false,
      false,
      -1,
      -1,
      false,
      false,
      "",
      "",
      "",
      0
    );
  }

  
  ngOnChanges(changes: SimpleChanges) {
    if(changes.data || changes.section) {
      this.setNotifications();
    }
  }

  getGroupByDate(status: string) {
    type dataType = {
      ID: number,
      Request: any,
      Response: any,
      IsPosted: boolean,
      ActionID: number,
      ActionName: string,
      CreateAt: string,
      FailedLogID: number,
      OpenChartActionType: number,
      RequestModel: any,
      Status: string,
      Type: number,
      UpdatedAt: string
    };
    type GroupedByDate = {
      [key: string]: dataType[];
    };
   
    let filterData : any;
    
    if(status == 'success') {
      filterData = this.data.filter(
        (x : any) => x.showPostable == false
      );
    } else if (status == 'failed') {
      filterData = this.data.filter(
        (x : any) => x.showPostable == true
      );
    } else {
      filterData = this.data.filter(
        (x : any) => x.showPostable == true
      );
    }

    this.showCounts = filterData.length;
    this.setTotalCounts.emit(filterData.length);
   
    let groupedByDate: GroupedByDate = {};

    filterData.forEach((item : any) => {
      const dateKey = item.UpdatedAt.slice(0, 10);
      if (groupedByDate[dateKey]) {
        groupedByDate[dateKey].push(item);
      } else {
        groupedByDate[dateKey] = [item];
      }
    });

    let sortedKeys = Object.keys(groupedByDate).sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime();
    });

    let sortedData: any = [];
    for (const key of sortedKeys) {
      // sortedData = {
      //   ...sortedData,
      //   [key]: groupedByDate[key]
      // }
      sortedData.push({date: key, data: groupedByDate[key]})
    }
    
    return sortedData;
  }

  setNotifications() {
    if(this.data.length < 1){
      return;
    }

    if(this.section == 'success') {
      this.groupedByDate = this.getGroupByDate('success');
    } else if(this.section == 'failed') {
      this.groupedByDate = this.getGroupByDate('failed');
    } 
    this.cdr.detectChanges();
     
  }

  ArrayNotifications(arrays : any) {
    return arrays;
  }

}

