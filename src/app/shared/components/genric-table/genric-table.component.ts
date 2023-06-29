import { 
  Component, 
  EventEmitter, 
  Input, 
  OnChanges, 
  OnInit, 
  Output, 
  SimpleChanges, 
  ChangeDetectorRef,
  ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
// //import { Table } from 'primeng/table';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
// import { MenuItem } from 'primeng/api/menuitem';
import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems, RowGroup } from 'src/app/shared/model/genric-menu-items.model';
import { TableColumnEnum } from '../../Enum/table-column.enum';
import jspdf from 'jspdf'
import 'jspdf-autotable';
import { ActivatedRoute } from '@angular/router';
import { PermissionService } from '../../services/permission.service';
// 
import { RowGroupTypeEnum } from '../../Enum/row-group-type.enum ';
import * as FileSaver from "file-saver";
import { SearchPipe } from '../../pipes/search-pipe';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';

@Component({
  selector: 'app-genric-table',
  templateUrl: './genric-table.component.html',
  styleUrls: ['./genric-table.component.scss']
})
export class GenricTableComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() loadingData : boolean = true;
  @Input() initPageNo = 0;
  columns: Columns[] = [];

  realData : any[] = [];

  viewData: any[] = [];
  selectedColumns: Columns[] = [];
  
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

  @Input('columnsData')

  set model(value: Columns[]) {
    value.forEach((x: any) => {
      if (x.permission) {
        if (this.permission.getPermissionAccess(x.permission)) {
          this.columns.push(x);
          this.selectedColumns.push(x);
        }
      }
      else {
        this.columns.push(x);
        this.selectedColumns.push(x);
      }
    });
  }
    //set model(value: Columns[]) {

    // this.columns = [...value];
    // this.selectedColumns = [...value];

  //}
  @Input() min_height = 'medium';
  @Input() globalFilterFields: string[];
  @Input() row: number = 10;
  @Input() rowGroup: RowGroup = {
    property: 'CreatedAt',
    enableRowGroup: false,
    propertyType: RowGroupTypeEnum.DATE
  };
  @Input() hideToolbar = false;
  @Input() enableGFilter = true;
  @Output() emitMenuAction = new EventEmitter();
  @Output() emitSwitch = new EventEmitter();
  @Output() emitHref = new EventEmitter();
  @Output() emitHref2 = new EventEmitter();
  @Output() emitAttachment = new EventEmitter();
  @Output() emitRemarks = new EventEmitter();
  @Output() emitRowClick = new EventEmitter();
  @Output() emitCheckbox = new EventEmitter();
  @Output() emitDeleteBtnClick = new EventEmitter();
  @Output() emitNarration = new EventEmitter();


  @Input() menuItems: GenericMenuItems[] = [];
  // @Input() columnsData : any;
  @Input() initialColumns : any;
  @Input() rowsPerPageOptions: number[] = [10, 20, 50, 100]
  @Input() enablePrint : boolean = true;
  // @ViewChild('dt') table: any;
  rowGroupMetadata: any = {};
  @Input() totalRecords = 0;
  selectedStock: any = {};
  imageBasePath;
  imgSrc:any ;
  items: any[] = [];
  displayImage = false;
  columnsType = TableColumnEnum;
  rowGroupType = RowGroupTypeEnum;
  displayDialog = false;
  DialogRemarks = '';
  mySearch: any;
  IsImageClicked = false;
  isColumnSort: boolean = false;
  sortStatus: Array<any> = [];
  pageSize : number = 10;
  pager : any;

  switchItem: any = '';
  
  @ViewChild('btn_open_multi_img_modal') btn_open_multi_img_modal: ElementRef;
  @ViewChild('btn_open_img_modal') btn_open_img_modal: ElementRef;


  constructor(private apiService: vaplongapi, private router: ActivatedRoute,
              private permission: PermissionService, private cdr : ChangeDetectorRef) {
    this.imageBasePath = this.apiService.imageBasePath;
  }

  ngOnInit() {
    this.checkSwitchItem();
    this.setSortStatus();
    this.initSelectedColumns();
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
    if(changes.data) {
      this.realData = this.data;
      this.cdr.detectChanges();
    }
    if (changes.selectedColumns) {
      this.cdr.detectChanges();
    }
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

  emitMenuActionTrigger(event: any) {
    event.curPageNo = this.pager.currentPage;
    this.emitMenuAction.emit(event);
  }

  onChangePage(event : any) {
    this.viewData = event.data;
    this.pager = event.pager
    this.cdr.detectChanges();
    // this.loadCustomers(event);
  }

  initSelectedColumns() {
    const temp = [...this.selectedColumns];
    // this.selectedColumns.map((value, index, self) => {})
    temp.forEach((option) => {
      if(this.initialColumns && !this.initialColumns.includes(option.field)){
        const index = this.selectedColumns.indexOf(option);
        if (index !== -1) {
          this.selectedColumns.splice(index, 1);
        }
      }
    })
    this.selectedColumns = this.selectedColumns.slice();
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
    this.sortData(event);
  }

  sortData(event : any) {
    this.realData.sort((a: any, b: any) => {
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
    this.realData = this.realData.slice();
    // this.realData = this.data;
    // setTimeout(() => {
    //   this.data = this.data.slice();
    //   // this.viewData = this.data.slice();
    // }, 0);
    return;
  }

  searchData() {
    console.log("data === ", this.data);
    console.log("selected columns === ", this.selectedColumns);
    console.log("my search === ", this.mySearch);
    let searchResult = new SearchPipe().transform(this.data, this.selectedColumns, this.mySearch);
    console.log("search result === ", searchResult)
    this.realData = searchResult;
  }

  checkMyData(cols : any, rowIndex : any) {
    // console.log(rowIndex);
    let prop = '';
    prop = this.switchCaseForData(prop, cols);
    // console.log(this.rowGroupMetadata[prop]?.index, "===", rowIndex + this.pager.startIndex, "-----", this.pager);
    return this.rowGroupMetadata[prop]?.index === rowIndex + this.pager.startIndex;
  }


  setSortStatus() {
    this.columns.forEach((column : any) => {
      this.sortStatus.push({key: column.field, value: 0});
    });
  }

  switchCaseForData(prop : any, rowData : any) {
    switch (this.rowGroup.propertyType) {
      case RowGroupTypeEnum.DATE: {
        //statements;
        prop = rowData[this.rowGroup.property].split('T')[0];
        break;
      }
      case RowGroupTypeEnum.STRING: {
        //statements;
        prop = rowData[this.rowGroup.property];
        break;
      }
      default: {
        //statements;
        prop = rowData[this.rowGroup.property];
        break;
      }
    }
    return prop;
  }

  emitOnRowClick(cols : any) {
    if(this.IsImageClicked)
    {
      this.IsImageClicked = false;
      return;
    }
    this.emitRowClick.emit(cols);

  }
  emitDeleteButtonClick(cols : any) {
    console.log("sssssssssssss", cols);
    this.emitDeleteBtnClick.emit(cols);
  }
  emitOutput(Property: string, selectedRow: any) {
    const obj = { forLabel: Property, selectedRowData: selectedRow };
    this.emitMenuAction.emit(obj);
    // this.selectedVariantIDforWishlist = ProductVariantID;
    // this.selectedProductNameforWishlist = Product;
    // this.isAddToWishlist = true;
  }
  // showMenuItems(event: any) {

  //   this.items = [];
  //   this.menuItems.forEach((x: any) => {
  //     const perm = this.selectedStock[x.permissionDisplayProperty];
  //     if (x.permission) {
  //       if (this.selectedStock[x.dependedProperty] && this.permission.getPermissionAccess(x.permission)) {
  //         if (!isNullOrUndefined(perm) && perm == true) {
  //           const obj = { label: x.label, icon: x.icon, command: () => this.emitOutput(x.label, this.selectedStock) }
  //           this.items.push(obj);
  //         }
  //         if (isNullOrUndefined(perm)) {
  //           const obj = { label: x.label, icon: x.icon, command: () => this.emitOutput(x.label, this.selectedStock) }
  //           this.items.push(obj);
  //         }
  //       }
  //     } else {
  //       if (this.selectedStock[x.dependedProperty]) {
  //         if (!isNullOrUndefined(perm) && perm == true) {
  //           const obj = { label: x.label, icon: x.icon, command: () => this.emitOutput(x.label, this.selectedStock) }
  //           this.items.push(obj);
  //         }
  //         if (isNullOrUndefined(perm)) {
  //           const obj = { label: x.label, icon: x.icon, command: () => this.emitOutput(x.label, this.selectedStock) }
  //           this.items.push(obj);
  //         }
  //               }
  //     }
  //   })
  //   // this.items = this.menuItems;
  // }
  showMenuItems(event : any) {

    this.items = [];
    this.menuItems.forEach((x : any) => {
      if (x.permission) {
        if (this.selectedStock[x.dependedProperty] && this.permission.getPermissionAccess(x.permission)) {
          const perm = this.selectedStock[x.permissionDisplayProperty];
          // tslint:disable-next-line: deprecation
          if ((perm == null || perm == undefined) || perm === true) {
            const obj = { label: x.label, icon: x.icon, command: () => this.emitOutput(x.label, this.selectedStock) };
            this.items.push(obj);
          }
        }
      } else {
        if (this.selectedStock[x.dependedProperty]) {
          const obj = { label: x.label, icon: x.icon, command: () => this.emitOutput(x.label, this.selectedStock) };
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
        let representativeName = '';

        representativeName = this.switchCaseForData(representativeName, rowData);


        if (i === 0) {
          this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
        }
        else {
          const previousRowData = this.data[i - 1];
          let previousRowGroup = '';

          previousRowGroup = this.switchCaseForData(previousRowGroup, previousRowData);

          if (representativeName === previousRowGroup) {
            this.rowGroupMetadata[representativeName].size++;
          } else {
            this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
          }
        }
      }
    }
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
  emitDisplayAttachment(col : any) {
    this.emitAttachment.emit(col);
  }

  emitRemarkDialog(col : any) {
    this.emitRemarks.emit(col);
  }
  emitNarrationDialog(col : any) {
    this.emitNarration.emit(col);
  }
  emitCheckBoxChange(col : any) {
    alert("s")
    this.emitCheckbox.emit(col);
  }
  onShow() {
    this.items = [];
    this.items.forEach(element => {

    });
  }

  popUpImageFuction(imgSrc : any) {
    this.IsImageClicked = true
    this.imgSrc = [imgSrc];
    this.displayImage = true;
    this.btn_open_img_modal.nativeElement.click();
    // this.openModalImageGallery();
  }
  popUpImageFuctionMultiple(imgSrc : any) {
    // this.IsImageClicked = true
    // if (imgSrc != null && imgSrc != '') {
    //   var imagesArr = imgSrc.split('|');
    //   var ImagenewArr : any = [];
    //   if (imagesArr.length > 0) {
    //     imagesArr.forEach((element : any) => {
    //       ImagenewArr.push(this.imageBasePath +''+ element);
    //     });
    //     this.imgSrc = ImagenewArr;
    //     this.btn_open_multi_img_modal.nativeElement.click();
    //     // this.openModalMultiImageGallery();
    //   }
    //   else {
    //     this.imgSrc = [this.imageBasePath + imgSrc];
    //     this.btn_open_img_modal.nativeElement.click();
    //   }

    // }
    // else {
    //   this.imgSrc = ['../../../../assets/layout/images/no-image.png'];
    //   this.btn_open_img_modal.nativeElement.click();
    // }

    // this.displayImage = true;
    this.IsImageClicked = true
    this.displayImage = true;
    this.imgSrc = imgSrc;
    this.btn_open_multi_img_modal.nativeElement.click();

  }


  getReportName() {
    let title = this.router.snapshot.data.title;
    return title + new Date().getTime();
  }

  exportPdf() {
    const exportColumns = this.selectedColumns.map(col => ({ title: col.header, dataKey: col.field }));

    import("jspdf").then((jsPDF: any) => {
      import("jspdf-autotable").then((x: any) => {
        const doc = new jsPDF.default(0, 0);
        // doc.autoTable(exportColumns, this.data);
        doc.autoTable({
          head: [exportColumns.map(col => col.title)],
          body: this.data.map(row => exportColumns.map(col => row[col.dataKey]))
        });
        const reportName = this.getReportName();
        doc.save(`${reportName}.pdf`);
      })
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      let exportData = this.data.slice();
      
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
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "products");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    // import("file-saver").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, this.getReportName() + EXCEL_EXTENSION);
    // });
  }


  async openModalImageGallery() {
    return await this.modalImageGalleryComponent.open();
  }

  async openModalMultiImageGallery() {
    return await this.modalMultiImageGalleryComponent.open();
  }
}
