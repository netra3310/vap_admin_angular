import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  AfterViewInit,
  ChangeDetectorRef,
  HostListener, 
  ElementRef
} from "@angular/core";

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { ViewChild } from "@angular/core";
// //import { Table } from "primeng/table";
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
// import { ThirdPartyDraggable } from "@fullcalendar/interaction";
// import { isNullOrUndefined } from "util";
import { ActivatedRoute } from "@angular/router";
import { PermissionService } from "../../services/permission.service";
import { RowGroupTypeEnum } from "../../Enum/row-group-type.enum ";
import { Brand } from "src/app/Helper/models/Brand";
import { retry } from "rxjs";
import * as FileSaver from "file-saver";
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';

@Component({
  selector: "app-ss-generic-table",
  templateUrl: "./ss-generic-table.component.html",
  styleUrls: ["./ss-generic-table.component.scss"],
})
export class SsGenericTableComponent implements OnInit, OnChanges { 
  // @HostListener('document:click', ['$event'])
  // onClick(event: MouseEvent) {
  //   const clickedElement = event.target as HTMLElement;
  //   const classNames = clickedElement.classList;
    
  //   this.showContextMenu = false;
  //   console.log(classNames);
  // }
  @Input() data: any[] = [];
  @Input() isLoading : boolean = true;
  @Input() initialColumns : any;
  @Input() columnsData : any;
  @Input() print: boolean = true;
    
  modalImageGalleryConfig: ModalConfig = {
    modalTitle: '',
    modalContent: "",
    modalSize: 'lg',
    hideCloseButton: () => true,
    hideDismissButton: () => true,
  };
  @ViewChild('modalImageGallery') private modalImageGalleryComponent: ModalComponent;

  modalMultiImageGalleryConfig: ModalConfig = {
    modalTitle: '',
    modalContent: "",
    modalSize: 'lg',
    hideCloseButton: () => true,
    hideDismissButton: () => true,
  };
  @ViewChild('modalMultiImageGallery') private modalMultiImageGalleryComponent: ModalComponent;

  exportdata: any[] = [];
  IsExportPage = false;
  columns: Columns[] = [];
  Column: Columns[];
  rowGroupType = RowGroupTypeEnum;
  sortOrder: number;

  isColumnSort: boolean = false;

  @Input() globalFilterFields: any;
  @Input() row = 10;
  @Input() min_height = 'medium';
  @Output() emitMenuAction = new EventEmitter();
  @Output() emitSwitch = new EventEmitter();
  @Output() emitHref = new EventEmitter();
  @Output() emitHref2 = new EventEmitter();
  @Output() emitAttachment = new EventEmitter();
  @Output() emitRemarks = new EventEmitter();
  @Output() emitRowClick = new EventEmitter();
  @Output() emitCheckbox = new EventEmitter();
  @Output() emitNarration = new EventEmitter();
  @Output() emitPrintSalePackingSlip = new EventEmitter();
  @Output() emitPrintSalePackingList = new EventEmitter();

  rowGroupMetadata: any = {};
  @Output() getLazyData = new EventEmitter();
  @Input() menuItems: GenericMenuItems[] = [];
  @Input() rowsPerPageOptions: number[] = [10, 50, 100];
  // @ViewChild("dt") table: any;
  selectedColumns: Columns[] = [];
  @Input() totalRecords = 0;
  @Input() filterGlobal = true;
  @Input() multiSelect = true;
  @Input() initPageNo = 0;
  @Input() rowGroup: RowGroup = {
    property: "CreatedAt",
    enableRowGroup: false,
    propertyType: RowGroupTypeEnum.DATE,
  };
  @Input() filterColumn = true;
  selectedStock: any = {};
  imageBasePath;
  imgSrcMultiple : any[]= [];
  items: any[] = [];
  displayImage = false;

  imgSrcSingle : any[]= [];
  displayImageSingle = false;

  filterRequestModel: FilterRequestModel;
  columnsType = TableColumnEnum;
  searchColumnArr: any[] = [];
  i = 0;
  mySearch: any;

  switchItem: any = '';

  @ViewChild('btn_open_multi_img_modal') btn_open_multi_img_modal: ElementRef;
  @ViewChild('btn_open_img_modal') btn_open_img_modal: ElementRef;


  constructor(
    private apiService: vaplongapi,
    private router: ActivatedRoute,
    private permission: PermissionService,
    private cdr: ChangeDetectorRef
  ) {
    this.imageBasePath = this.apiService.imageBasePath;
  }
  
  globalFilterValue : string = "";
  
  sortProperty: string = 'id';
  loading = false;

  showContextMenu = false;
  contextMenuX = 0;
  contextMenuY = 0;

  sortStatus: Array<any> = [];
  pageSize : number = 10;
  
  pager : any;
  isGlobalFilter : boolean = false;

  IsImageClicked = false;
  imgSrc = '';
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
  }

  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.checkSwitchItem();

    this.searchSubject.pipe(
      debounceTime(500)
    ).subscribe((event: any) => {
      // Do search with the search term here
      console.log(`Searching for "${event}"`);
      this.onChangeGFilter(event, 'contains');
    });
    // document.addEventListener('click', () => this.onContextMenuClose());
    this.FilterRequestModelInilizationFunction();

    this.setSortStatus();
    // this.items = [
    //   { label: 'Wishlist', icon: 'fas fa-shopping-cart', command: () => this.emitOutput('Wishlist', this.selectedStock) },
    // ];
    this.initSelectedColumns();

    // this.getLazyData.emit(this.filterRequestModel);
  }

  checkSwitchItem() {
    console.log(this.columns);
    this.columns.forEach((item: any) => {
      if(item.type == this.columnsType.TOGGLE_BUTTON) {
        this.switchItem = item.field;
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.data.length > 0 && this.rowGroup.enableRowGroup) {
      this.updateRowGroupMetaData();
    }
    if(changes.totalRecords) {
      
    }

  }

  initSelectedColumns() {
    const temp = [...this.selectedColumns];
    // this.selectedColumns.map((value, index, self) => {})
    temp.forEach((option) => {
      if(!this.initialColumns.includes(option.field)){
        const index = this.selectedColumns.indexOf(option);
        if (index !== -1) {
          this.selectedColumns.splice(index, 1);
        }
      }
    })
  }

  setSortStatus() {
    this.columns.forEach((column : any) => {
      this.sortStatus.push({key: column.field, value: 0});
    });
  }

  onRightClick(event: MouseEvent) {
    // event.preventDefault(); 
    // console.log("ssssssssssssss", event);
    // const element = event.target as HTMLElement;
    // const rect = element.getBoundingClientRect();
    // const bottom = rect.bottom;
    // console.log('Bottom position:', bottom);

    // const right = rect.right;

    // this.showContextMenu = true;
    // this.contextMenuX = right - 100;
    // this.contextMenuY = bottom + 5;
    // const cell = event.target as HTMLTableCellElement;
    // const row = cell.parentNode as HTMLTableRowElement;
    // const rowIndex = row.rowIndex - 1;
    // const colIndex = cell.cellIndex;
    // this.showMenuItems(event);
    // // this.cdr.detectChanges();
  }

  onContextMenuClose() {
    this.showContextMenu = false;
    this.cdr.detectChanges();
  }

  // emitOutput(Property: string, selectedRow: any) {
  //   const obj = { forLabel: Property, selectedRowData: selectedRow };
  //   this.emitMenuAction.emit(obj);
  // }

  emitMenuActionTrigger(event: any) {
    console.log("this.pager.currentPage ", this.pager);
    event.curPageNo = this.pager.currentPage;
    this.emitMenuAction.emit(event);
  }

  test() {
    alert('a');
  }

  sortBy(event : any, property: string) {
    event.preventDefault();
    let sortStatus: any =[] ;
    let sortOrder = 0;
    this.sortStatus.forEach((status : any) => {
      if(status.key == property) {
        if(status.value !== 1) {
          status.value = 1;
          sortOrder = 1;
        } else {
          status.value = 2;
          sortOrder = 2;
        }
      } else {
        status.value = 0;
      }
      sortStatus.push(status);
    });

    this.sortStatus = sortStatus;

    event = {
      ...event,
      sortField : property,
      filters: "local",
      sortOrder: sortOrder,
      rows: this.row,
      columnfilter: true
    }
    this.isColumnSort = true;
    this.loadCustomers(event);
    return;
  }

  sortIcon(property: string) {
    let path = "";
    this.sortStatus.forEach((option) => {
      if(option.key == property) {
        switch(option.value){
          case 0:
            path = './assets/media/icons/duotune/arrows/arr032.svg';
            break;
          case 1:
            path = './assets/media/icons/duotune/arrows/arr082.svg';
            break;
          case 2: 
            path = './assets/media/icons/duotune/arrows/arr081.svg';
            break;
          default:
            break;
        }
      }
    });
    return path;
  }

  onChangePage(event : any) {  
    console.log('ss table onchangepage event is ', event);
    this.pager = event;
    this.loadCustomers(event);
  }

  onSearchInput(event: any) {
    const searchTerm = event.target.value.trim();
    this.searchSubject.next(event);
  }

  onChangeGFilter(event : any, key : string) {
    event.preventDefault();
    event.globalFilter = event.target.value;
    // event.rows = 25;
    if(event.target.value == ''){
      this.isGlobalFilter = false;
    } else {
      this.isGlobalFilter = true;
    }
    this.globalFilterValue = event.target.value;
    this.loadCustomers(event);
  }

  loadCustomers(event: any) {
    if (event.sortField || !event.filters) {
      if (!Array.isArray(this.data)) {
        return;
      }
  
      // if (!event.columnfilter &&((this.pager.startIndex / this.pager.rows) > 0 || event.globalFilter)) {
      if (!event.columnfilter) {
        const start = this.pager.startIndex / this.pager.rows;
        const product = "";
        if (this.isGlobalFilter) {
          this.filterRequestModel.Product = this.globalFilterValue;
        } else {
          this.filterRequestModel.Product = product;
        }
        if(event.globalFilter) {
          this.filterRequestModel.PageNo = 0;
        } else {
          this.filterRequestModel.PageNo = start;
        }
        this.filterRequestModel.PageSize = this.pager.rows;
        this.filterRequestModel.Type = event.sortOrder;
        event.globalFilter = undefined;
        this.getLazyData.emit(this.filterRequestModel);
      }

      this.data.sort((a: any, b: any) => {
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
      
      return;
    } else {
      const start = this.pager.currentPage;
      const product = "";
      if (event.globalFilter) {
        this.filterRequestModel.Product = event.globalFilter;
        // this.filterRequestModel.PageNo = 1;
      } else {
        this.filterRequestModel.Product = product;
      }
      this.filterRequestModel.PageNo = start;
      this.filterRequestModel.PageSize = this.pager.rows;
      this.filterRequestModel.Type = event.sortOrder;
      this.getLazyData.emit(this.filterRequestModel);
    }
    // this.i++;
  }

  switchCaseForData(prop : any, rowData : any) {
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
  emitInputSwitch(col : any) {
    this.emitSwitch.emit(col);
  }
  emitRedirection(col : any) {
    this.emitHref.emit(col);
  }
  emitRedirection2(col : any) {
    this.emitHref2.emit(col);
  }
  emitRemarkDialog(col : any) {
    this.emitRemarks.emit(col);
  }

  emitPrintPackingSlip(col : any) {
    this.emitPrintSalePackingSlip.emit(col);
  }
  emitPrintPackingList(col : any) {
    this.emitPrintSalePackingList.emit(col);
  }
  emitNarrationDialog(col : any) {
    this.emitNarration.emit(col);
  }

  emitCheckBoxChange(col : any) {
    this.emitCheckbox.emit(col);
  }

  AddDataToExportList(col : any) {
    this.IsExportPage = true;
    if (col.productChecked) {
      var index = this.exportdata.findIndex((x) => x.ID == col.ID);
      if (index == -1) this.exportdata.push(col);
    } else {
      var index = this.exportdata.findIndex((x) => x.ID == col.ID);
      if (index != -1) this.exportdata.splice(index, 1);
    }
  }

  // showMenuItems(event : any) {
  //   this.items = [];
  //   this.menuItems.forEach((x : any) => {
  //     console.log("show menu items permission is ", x.permission);
  //     console.log("this.selectedStock is ", this.selectedStock);
  //     if (x.permission) {
  //       if (
  //         this.selectedStock[x.dependedProperty] &&
  //         this.permission.getPermissionAccess(x.permission)
  //       ) {
  //         const perm = this.selectedStock[x.permissionDisplayProperty];
  //         // tslint:disable-next-line: deprecation
  //         if ((perm === null || perm === undefined) || perm === true) {
  //           const obj = {
  //             label: x.label,
  //             icon: x.icon,
  //             command: () => this.emitOutput(x.label, this.selectedStock),
  //           };
  //           this.items.push(obj);
  //         }
  //       }
  //     } else {
  //       if (this.selectedStock[x.dependedProperty]) {
  //         const obj = {
  //           label: x.label,
  //           icon: x.icon,
  //           command: () => this.emitOutput(x.label, this.selectedStock),
  //         };
  //         this.items.push(obj);
  //       }
  //     }
  //   });

  //   // temp without permission so when complete this commend remove.
  //   this.items = this.menuItems;
  // }

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

  emitDisplayAttachment(col : any) {
    this.emitAttachment.emit(col);
  }

  popUpImageFuction(imgSrcSingle : any) {
    this.IsImageClicked = true
    this.imgSrcSingle = [imgSrcSingle];
    this.displayImageSingle = true;
    // this.btn_open_img_modal.nativeElement.click();
    this.openModalImageGallery();
  }
  popUpImageFuctionMultiple(imgSrcMultiple : any) {
    // this.IsImageClicked = true
    // if (!(imgSrcMultiple === null || imgSrcMultiple === "")) {
    //   var imagesArr = imgSrcMultiple.split("|");
    //   var ImagenewArr : any = [];
    //   this.imgSrcMultiple  = [];
    //   if (imagesArr.length > 0) {
    //     imagesArr.forEach((element : any) => {
    //       ImagenewArr.push(this.imageBasePath + "" + element);
    //     });
    //     if(ImagenewArr.length>1)
    //     {
    //       this.imgSrcMultiple = ImagenewArr;
    //       this.displayImage = true;
    //       // this.btn_open_multi_img_modal.nativeElement.click();
    //       this.openModalMultiImageGallery();
    //     }
    //     else
    //     {
    //       this.imgSrcSingle = ImagenewArr;
    //       this.displayImageSingle = true;
    //       this.btn_open_img_modal.nativeElement.click();
    //     }
            
    //   } 
    //   else {
    //     //this.imgSrcMultiple = [this.imageBasePath + imgSrcMultiple];
    //     this.imgSrcSingle = [this.imageBasePath + imgSrcMultiple];
    //     this.displayImageSingle = true;
    //     this.btn_open_img_modal.nativeElement.click();
    //   }
    // } else {
    //   //this.imgSrcMultiple = ["../../../../assets/layout/images/no-image.png"];
    //   this.imgSrcSingle =  ["../../../../assets/layout/images/no-image.png"];
    //       this.displayImageSingle = true;
    //       this.btn_open_img_modal.nativeElement.click();
    // }
    // // console.log("this.imgSrcMultiple", this.imgSrcMultiple);
    // // console.log("this.imgSrcSingle", this.imgSrcSingle);
    // // if(imgSrcMultiple.length > 0)
    // //   this.btn_open_multi_img_modal.nativeElement.click();
    // // else
    // //   this.btn_open_img_modal.nativeElement.click();
    
    this.imgSrc = imgSrcMultiple;
    this.btn_open_multi_img_modal.nativeElement.click();

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
      this.initPageNo,
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
  columnSearch(value: string, field: any, items: any[]) {
    this.mySearch = value;
    this.selectedColumns
      .filter((x) => x.field !== field)
      .forEach((element) => {
        // tslint:disable-next-line: deprecation
        if (
          (element.data && !(element.data === null || element.data === undefined)) ||
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
    matchesFilter = function (item : any) {
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
  checkMyData(cols : any, rowIndex : any) {
    let prop = "";
    prop = this.switchCaseForData(prop, cols);
    return (
      this.rowGroupMetadata[prop].index ===
      this.data.findIndex((x) => x.ID === cols.ID)
    );
  }
  exportPdf() {
    const exportColumns = this.selectedColumns.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));

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

      const ad = this.selectedColumns.map((x) => ({field: x.field, header: x.header, type: x.type}));
      const headers = this.selectedColumns.map((x) => x.header);
      
      exportData = exportData.map(obj => {
        const newObj : any = {};
        for (let i = 0; i < ad.length; i++) {
          if(ad[i].type == TableColumnEnum.DATE_FORMAT) {
            const dateStr = obj[ad[i].field];
            const date = new Date(dateStr);
            const options: any = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
            const formatter = new Intl.DateTimeFormat('en-US', options);
            const formattedDate = formatter.format(date);
            newObj[ad[i].header] = formattedDate;
          } else {
            newObj[ad[i].header] = obj[ad[i].field]; 
          }
        }
        return newObj;
      });
      
      const worksheet = xlsx.utils.json_to_sheet(exportData, { header: headers });
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      
      this.saveAsExcelFile(excelBuffer, "ExportData");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
      const EXCELTYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      const EXCELEXTENSION = ".xlsx";
      const data: Blob = new Blob([buffer], {
        type: EXCELTYPE,
      });
      FileSaver.saveAs(data, this.getReportName() + EXCELEXTENSION);
  }

  getReportName() {
    const title = this.router.snapshot.data.title;
    return title + new Date().getTime();
  }

  emitOnRowClick(cols : any) {
    if(this.IsImageClicked)
    {
      this.IsImageClicked = false;
      return;
    }
    this.emitRowClick.emit(cols);

  }
  
  async openModalImageGallery() {
    return await this.modalImageGalleryComponent.open();
  }

  async openModalMultiImageGallery() {
    return await this.modalMultiImageGalleryComponent.open();
  }
}
