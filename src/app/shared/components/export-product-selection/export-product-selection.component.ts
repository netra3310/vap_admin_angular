import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from "@angular/core";

import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

// import { Table } from "primeng/table";
import { vaplongapi } from "src/app/Service/vaplongapi.service";
// import { MenuItem } from "primeng/api/menuitem";
import { Columns } from "src/app/shared/model/columns.model";
import {
  GenericMenuItems,
  RowGroup,
} from "src/app/shared/model/genric-menu-items.model";
// import { LazyLoadEvent } from "primeng/api";
import { FilterRequestModel } from "src/app/Helper/models/FilterRequestModel";
import { TableColumnEnum } from "../../Enum/table-column.enum";
import { isNullOrUndefined } from "src/app/Helper/global-functions";
import { ActivatedRoute } from "@angular/router";
import { PermissionService } from "../../services/permission.service";
import { RowGroupTypeEnum } from "../../Enum/row-group-type.enum ";

@Component({
  selector: "app-export-product-selection",
  templateUrl: "./export-product-selection.component.html",
  styleUrls: ["./export-product-selection.component.scss"],
})
export class ExportProductSelectionComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  exportdata: any[] = [];
  IsExportPage = false;
  columns: Columns[] = [];
  Column: Columns[];
  rowGroupType = RowGroupTypeEnum;
  sortOrder: number;
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

  private searchSubject = new Subject<string>();

  @Input() globalFilterFields: string;
  @Input() row = 25;
  @Output() emitMenuAction = new EventEmitter();
  @Output() emitSwitch = new EventEmitter();
  @Output() emitHref = new EventEmitter();
  @Output() emitHref2 = new EventEmitter();
  @Output() emitRemarks = new EventEmitter();
  @Output() emitRowClick = new EventEmitter();
  @Output() emitCheckbox = new EventEmitter();
  rowGroupMetadata: any = {};
  @Output() getLazyData = new EventEmitter();
  @Input() menuItems: GenericMenuItems[] = [];
  @Input() rowsPerPageOptions: number[] = [25, 50, 100];
  // @ViewChild("dt") table: Table;
  selectedColumns: Columns[] = [];
  @Input() totalRecords = 0;
  @Input() filterGlobal = true;
  @Input() multiSelect = true;
  @Input() rowGroup: RowGroup = {
    property: "CreatedAt",
    enableRowGroup: false,
    propertyType: RowGroupTypeEnum.DATE,
  };
  selectedStock: any = {};
  imageBasePath;
  imgSrc: any = "";
  items: any[] = [];
  displayImage = false;
  filterRequestModel: FilterRequestModel;
  columnsType = TableColumnEnum;
  searchColumnArr: any[] = [];
  i = 0;
  mySearch: any;
  constructor(
    private apiService: vaplongapi,
    private router: ActivatedRoute,
    private permission: PermissionService
  ) {
    this.imageBasePath = this.apiService.imageBasePath;
  }

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(500)
    ).subscribe((event: any) => {
      // Do search with the search term here
      console.log(`Searching for "${event}"`);
      this.onChangeGFilter(event, 'contains');
    });
    // this.newData = [...this.data];
    this.FilterRequestModelInilizationFunction();
    // this.items = [
    //   { label: 'Wishlist', icon: 'fas fa-shopping-cart', command: () => this.emitOutput('Wishlist', this.selectedStock) },
    // ];
  }

  emitOutput(Property: string, selectedRow: any) {
    const obj = { forLabel: Property, selectedRowData: selectedRow };
    this.emitMenuAction.emit(obj);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.data.length > 0 && this.rowGroup.enableRowGroup) {
      this.updateRowGroupMetaData();
    }
  }

  switchCaseForData(prop: any, rowData: any) {
    switch (this.rowGroup.propertyType) {
      case RowGroupTypeEnum.DATE: {
        // statements;
        prop = rowData[this.rowGroup.property].split("T")[0];
        break;
      }
      case RowGroupTypeEnum.STRING: {
        // statements;
        prop = rowData[this.rowGroup.property];
        break;
      }
      default: {
        // statements;
        prop = rowData[this.rowGroup.property];
        break;
      }
    }
    return prop;
  }
  emitInputSwitch(col: any) {
    this.emitSwitch.emit(col);
  }
  emitRedirection(col: any) {
    this.emitHref.emit(col);
  }
  emitRedirection2(col: any) {
    this.emitHref2.emit(col);
  }
  emitRemarkDialog(col: any) {
    this.emitRemarks.emit(col);
  }
  emitCheckBoxChange(col: any) {
    this.emitCheckbox.emit(col);
  }

  AddDataToExportList(col: any) {
    this.IsExportPage = true;
    if (col.productChecked) {
      var index = this.exportdata.findIndex((x) => x.ID == col.ID);
      if (index == -1) this.exportdata.push(col);
    } else {
      var index = this.exportdata.findIndex((x) => x.ID == col.ID);
      if (index != -1) this.exportdata.splice(index, 1);
    }
  }

  showMenuItems(event: any) {
    this.items = [];
    this.menuItems.forEach((x: any) => {
      if (x.permission) {
        if (
          this.selectedStock[x.dependedProperty] &&
          this.permission.getPermissionAccess(x.permission)
        ) {
          const perm = this.selectedStock[x.permissionDisplayProperty];
          // tslint:disable-next-line: deprecation
          if (isNullOrUndefined(perm) || perm === true) {
            const obj = {
              label: x.label,
              icon: x.icon,
              command: () => this.emitOutput(x.label, this.selectedStock),
            };
            this.items.push(obj);
          }
        }
      } else {
        if (this.selectedStock[x.dependedProperty]) {
          const obj = {
            label: x.label,
            icon: x.icon,
            command: () => this.emitOutput(x.label, this.selectedStock),
          };
          this.items.push(obj);
        }
      }
    });
    // this.items = this.menuItems;
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};

    if (this.data) {
      for (let i = 0; i < this.data.length; i++) {
        const rowData = this.data[i];
        let representativeName = "";

        representativeName = this.switchCaseForData(
          representativeName,
          rowData
        );

        if (i === 0) {
          this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
        } else {
          const previousRowData = this.data[i - 1];
          let previousRowGroup = "";

          previousRowGroup = this.switchCaseForData(
            previousRowGroup,
            previousRowData
          );

          if (representativeName === previousRowGroup) {
            this.rowGroupMetadata[representativeName].size++;
          } else {
            this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
          }
        }
      }
    }
  }

  popUpImageFuction(imgSrc: any) {
    this.imgSrc = [imgSrc];
    this.displayImage = true;
  }
  popUpImageFuctionMultiple(imgSrc: any) {
    if (imgSrc != null || imgSrc != "") {
      var imagesArr = imgSrc.split("|");
      var ImagenewArr: any = [];
      if (imagesArr.length > 0) {
        imagesArr.forEach((element: any) => {
          ImagenewArr.push(this.imageBasePath + "" + element);
        });
        this.imgSrc = ImagenewArr;
      } else {
        this.imgSrc = [this.imageBasePath + imgSrc];
      }
    } else {
      this.imgSrc = ["../../../../assets/layout/images/no-image.png"];
    }

    this.displayImage = true;
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
      150000,
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
      ""
    );
  }
  loadCustomers(event: any) {
    // this.loading = true;
    // if(this.i!=0)
    // {
    //   let searchItem = {
    //     Field:"Supplier",
    //     Values:["VaPlong","QC Center China"],
    //   }
    //   this.searchColumnArr.push(searchItem);
    //   this.ColumnSearchFilter(this.searchColumnArr,this.data);
    // }
    if (event.sortField || !event.filters) {
      if (!Array.isArray(this.data)) {
        return;
      }
      if (event.first / event.rows > 0 || event.globalFilter) {
        const start = event.first / event.rows;
        const product = "";
        if (event.globalFilter) {
          this.filterRequestModel.Product = event.globalFilter;
          // this.filterRequestModel.PageNo = 1;
        } else {
          this.filterRequestModel.Product = product;
        }
        this.filterRequestModel.PageNo = start;
        this.filterRequestModel.PageSize = event.rows;
        this.filterRequestModel.Type = event.sortOrder;
        this.getLazyData.emit(this.filterRequestModel);
      }

      const arr = this.data.sort((a: any, b: any) => {
        if (event.sortOrder === 1) {
          if (a[event.sortField] < b[event.sortField]) {
            return 1;
          } else if (a[event.sortField] > b[event.sortField]) {
            return -1;
          } else {
            return 0;
          }
        } else {
          if (a[event.sortField] < b[event.sortField]) {
            return -1;
          } else if (a[event.sortField] > b[event.sortField]) {
            return 1;
          } else {
            return 0;
          }
        }
      });
      this.data = [];
      setTimeout(() => {
        this.data = arr;
      }, 0);
      return;
    } else {
      const start = event.first / event.rows;
      const product = "";
      if (event.globalFilter) {
        this.filterRequestModel.Product = event.globalFilter;
        // this.filterRequestModel.PageNo = 1;
      } else {
        this.filterRequestModel.Product = product;
      }
      this.filterRequestModel.PageNo = start;
      this.filterRequestModel.PageSize = event.rows;
      this.filterRequestModel.Type = event.sortOrder;
      this.getLazyData.emit(this.filterRequestModel);
    }
    // this.i++;
  }
  columnSearch(value: string, field: any, items: any[]) {
    this.mySearch = value;
    this.selectedColumns
      .filter((x) => x.field !== field)
      .forEach((element) => {
        // tslint:disable-next-line: deprecation
        if (
          (element.data && !isNullOrUndefined(element.data)) ||
          element.data !== ""
        ) {
          element.data = "";
        }
      });
    this.Column = this.selectedColumns.filter((x) => x.field === field);
  }

  ColumnSearchFilter(searchData: any[], TableData: any[]) {
    let matchesFilter;
    const matches = [];
    let count = 0;

    // tslint:disable-next-line: only-arrow-functions
    matchesFilter = function (item: any) {
      for (const item1 of searchData) {
        if (item1.Values.indexOf(item[item1.Field]) > -1) {
          count++;
        }
      }
      return count === searchData.length;
    };

    // Loop through each item in the array
    for (const item2 of TableData) {
      // Determine if the current item matches the filter criteria
      if (matchesFilter(item2)) {
        matches.push(item2);
      }
    }
    // Give us a new array containing the objects matching the filter criteria
    return matches;
  }
  checkMyData(cols: any, rowIndex: any) {
    let prop = "";
    prop = this.switchCaseForData(prop, cols);
    return (
      this.rowGroupMetadata[prop].index ===
      this.data.findIndex((x) => x.ID === cols.ID)
    );
  }
  exportPdf() {
    let pdfColumns = this.selectedColumns.filter(
      (x) => x.field != "productChecked"
    );
    const exportColumns = pdfColumns.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
    // const doc = new jsPDF()
    // autoTable(doc, {
    //   head: this.exportColumns,
    //   body: this.data
    // });
    // doc.save('ExportData.pdf');

    let exportData: any[] = [];
    if (this.IsExportPage) {
      exportData = this.exportdata;
    } else {
      exportData = this.data;
    }

    import("jspdf").then((jsPDF: any) => {
      import("jspdf-autotable").then((x) => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(exportColumns, exportData);
        const reportName = this.getReportName();
        doc.save(`${reportName}.pdf`);
      });
    });
  }

  exportExcel() {
    import("xlsx").then((xlsx) => {
      let exportData: any[] = [];
      if (this.IsExportPage) {
        exportData = this.exportdata;
      } else {
        exportData = this.data;
      }
      let pdfColumns = this.selectedColumns.filter(
        (x) => x.field != "productChecked"
      );
      //const exportColumns = pdfColumns.map(col => ({ title: col.header, dataKey: col.field }));
      const ad = pdfColumns.map((x) => x.field);
      var selectedDataWithColumn: any = [];

      exportData.forEach((element) => {
        var singleItem: any = {};
        ad.forEach((columnName) => {
          singleItem[columnName] = element[columnName];
        });
        selectedDataWithColumn.push(singleItem);
      });
      const worksheet = xlsx.utils.json_to_sheet(selectedDataWithColumn, {
        header: ad,
      });
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      this.saveAsExcelFile(excelBuffer, "ExportData");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then((FileSaver) => {
      const EXCELTYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const EXCELEXTENSION = ".xlsx";
      const data: Blob = new Blob([buffer], {
        type: EXCELTYPE,
      });
      FileSaver.saveAs(data, this.getReportName() + EXCELEXTENSION);
    });
  }

  getReportName() {
    const title = this.router.snapshot.data.title;
    return title + new Date().getTime();
  } 

  onSearchInput(event: any) {
    const searchTerm = event.target.value.trim();
    this.searchSubject.next(event);
  }
  
  onChangeGFilter(event : any, key : string) {
    // event.preventDefault();
    // event.globalFilter = event.target.value;
    // // event.rows = 25;
    // if(event.target.value == ''){
    //   this.isGlobalFilter = false;
    // } else {
    //   this.isGlobalFilter = true;
    // }
    // this.globalFilterValue = event.target.value;
    // this.loadCustomers(event);
  }
}
