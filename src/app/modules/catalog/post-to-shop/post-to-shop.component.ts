import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { LazyLoadEvent, SelectItem } from 'primeng/api';
//import { Table } from 'primeng/table';
import { FilterRequestModel } from '../../../Helper/models/FilterRequestModel';
import { ProductVariant } from '../../../Helper/models/Product';
import { vaplongapi } from '../../../Service/vaplongapi.service';
import { datefilter } from 'src/app/Helper/datefilter';
import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems } from 'src/app/shared/model/genric-menu-items.model';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';

import { ToastService } from '../../shell/services/toast.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';
import { CustomInputComponent } from 'src/app/shared/components/custom-input/custom-input.component';


@Component({
  selector: 'app-post-to-shop',
  templateUrl: './post-to-shop.component.html',
  styleUrls: ['./post-to-shop.component.scss'],
  styles: [
  ],
  providers: [DatePipe]
})
export class PostToShopComponent implements OnInit, OnDestroy {
  @ViewChild('input_payment_password') private input_payment_password: CustomInputComponent;

  dateModalConfig: ModalConfig = {
    modalTitle: 'Select Dates',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };

  @ViewChild('datepicker') private datepickerModalComponent: ModalComponent;
   
  modalPaymentPasswordConfig: ModalConfig = {
    modalTitle: 'User Payment password',
    modalContent: "",
    modalSize: 'md',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };
  @ViewChild('modalPaymentPassword') private modalPaymentPasswordComponent: ModalComponent;

  // 
  dateForDD: any;
  SearchByDateDropdown: any[];
  selectedSearchByDateID = '';
  totalRecords = 0;
  rows = 10;
  first = 0;
  IsSpinner = false;
  ProductVariants: any[] = [];
  filterRequestModel: FilterRequestModel;
  mySearch: any;
  dateId = 6;
  filterModel = {
    PageNo: 0,
    PageSize: 10,
    Product: '',
  };
  isCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  toDate = this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
  password='';
  displayPasswordPopup = false;
  selectedForPost:any;
  postType:any;
  genericMenuItems: GenericMenuItems[] = [
    { label: 'Post To Shop', icon: 'fas fa-paper-plane', dependedProperty: 'ID' },
  ];
  columns: Columns[] = [

    {
      field: 'productChecked', header: 'Select', sorting: '', placeholder: '',
      type: TableColumnEnum.CHECKBOX_COLUMN, translateCol: 'SSGENERIC.SELECT'
    },
    { field: 'DisplayImage', header: 'Product Image', sorting: '', searching: true, placeholder: '', isImage: true, type: TableColumnEnum.IMAGE, translateCol: 'SSGENERIC.PRODUCTIMAGE' },
    { field: 'ID', header: 'SKU', sorting: 'ID', searching: true, placeholder: '', translateCol: 'SSGENERIC.SKU' },
    { field: 'Product', header: 'Product', sorting: 'Product', searching: true, placeholder: '', translateCol: 'SSGENERIC.PRODUCT' },
    // tslint:disable-next-line: max-line-length
    { field: 'ShopSalePrice', header: 'Shop Sale Price', sorting: 'ShopSalePrice', searching: true, placeholder: '', type:TableColumnEnum.CURRENCY_SYMBOL, translateCol: 'SSGENERIC.SHOPSALEP' },
    { field: 'Barcode', header: 'EAN', sorting: 'Barcode', searching: true, placeholder: '', translateCol: 'SSGENERIC.EAN' },
    {
      field: 'RemainingStock', header: 'Stock', sorting: 'RemainingStock', searching: true, placeholder: '',
      translateCol: 'SSGENERIC.STOCK'
    },
  ];

  globalFilterFields = ['ID', 'Product', 'Color', 'Size', 'Barcode', 'RemainingStock'];
  initialColumns : any = ['productChecked', 'DisplayImage', 'ID', 'Product', 'ShopSalePrice', 'RemainingStock'];  
  rowsPerPageOptions = [10, 20, 50, 100];
  usermodel: any;

  isLoading: boolean = true;

  placeholderSelector : string = "Select Search By Date"

  constructor(
    private route: ActivatedRoute, private datepipe: DatePipe, private router: Router,
    private vapLongApiService: vaplongapi,private storageService: StorageService, 
    private toastService: ToastService, private cdr: ChangeDetectorRef) {
    this.totalRecords = this.route.snapshot.data.val;
    this.usermodel = this.storageService.getItem('UserModel');
    const obj = {
      Action: 'Update',
      Description: `Post Product to Shop`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
    }
    this.vapLongApiService.SaveActivityLog(obj).toPromise().then((x: any) => { });
  }

  ngOnDestroy(): void {

  }
  ngOnInit(): void {
    this.GetSearchByDateDropDownList();
  }
  emitAction(event: any) {
    if (event.forLabel === 'Post To Shop') {
      this.PostTOShopOrAddProductToOpenCartFunction(event.selectedRowData.ID);
    }

  }
  GetSearchByDateDropDownList() {
    this.SearchByDateDropdown = [];
    this.SearchByDateDropdown.push({ value: '0', label: 'Today' });
    this.SearchByDateDropdown.push({ value: '1', label: 'Yesterday' });
    this.SearchByDateDropdown.push({ value: '2', label: 'Last7Days' });
    this.SearchByDateDropdown.push({ value: '3', label: 'Last30Days' });
    this.SearchByDateDropdown.push({ value: '4', label: 'ThisMonth' });
    this.SearchByDateDropdown.push({ value: '5', label: 'LastMonth' });
    this.SearchByDateDropdown.push({ value: '6', label: 'All' });
    this.SearchByDateDropdown.push({ value: '7', label: 'Custom' });
    this.selectedSearchByDateID = '6';
  }
  onChangeDate(event: any) {
    if (event === '7') {
      this.isCustomDate = true;
      this.openDatePickerModal();
    }
    else {

      // this.getAllSaleList(this.selectedSearchByDateID);
      this.dateId = Number(this.selectedSearchByDateID);
      this.GetAllPostTableWithLazyLoadinFunction(this.filterModel);
    }
  }
  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;

    // this.getAllSaleList(7);
    this.dateId = 7;
    this.datepickerModalComponent.close();
    this.GetAllPostTableWithLazyLoadinFunction(this.filterModel);
  }


  GetAllPostTableWithLazyLoadinFunction(filterRM: any) {
    this.ProductVariants = [];
    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    filterRequestModel.ToDate = new Date((this.datepipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    filterRequestModel.PageNo = filterRM.PageNo;
    filterRequestModel.PageSize = filterRM.PageSize;
    filterRequestModel.IsGetAll = false;
    filterRequestModel.Product = filterRM.Product;


    if (this.dateId !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(this.dateId);
      filterRequestModel.IsGetAll = daterequest.IsGetAll;
      filterRequestModel.ToDate = new Date((this.datepipe.transform(daterequest.ToDate, 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
      filterRequestModel.FromDate = new Date((this.datepipe.transform(daterequest.FromDate, 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    }
    else {
      filterRequestModel.IsGetAll = false;
      filterRequestModel.ToDate = new Date((this.datepipe.transform(this.toDate, 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
      filterRequestModel.FromDate = new Date((this.datepipe.transform(this.fromDate, 'yyyy-MM-ddTHH:mm:ss') ?? "") + "Z");
    }
    this.vapLongApiService.GetAllPostableTotalCount(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseText === 'success') {
        this.totalRecords = response1.TotalRowCount;
      }
      else {
        this.toastService.showErrorToast('error', 'internal server error');
      }
    },
    );
    this.isLoading = true;
    this.vapLongApiService.GetAllPostable(filterRequestModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.isLoading = false;
      if (response.ResponseText === 'success') {
        this.ProductVariants = response.AllProductVariantList;
        this.ProductVariants.forEach(element => {
          element.productChecked = false;
          if (element.ProductImage != null && element.ProductImage != '') {
            element.DisplayImage = element.ProductImage.split('|')[0];
          }
          else {
            element.DisplayImage = null;
          }
        });
        this.cdr.detectChanges();
      }
      else {
        this.toastService.showErrorToast('error', 'internal server error');
      }
    },
    );

  }
  PostToShopPasswordClick(){
    
    if (this.postType==2)  // for Update
    {
      this.PostAllSelectedRows();
    }
    else if(this.postType==1) {
      this.PostTOShopOrAddProductToOpenCartFunction(this.selectedForPost); // for save
    }
  }

  async PostAllSelectedRows() {
    this.postType = 2;
    if (this.password === '' || this.password === null) {
      this.toastService.showInfoToast('info', 'please enter password');
      this.displayPasswordPopup = true;
      this.openModalPaymentPassword();
      return;
    }
    else {
      const res = await this.validatePassword(this.password);
      if (!res) { return; }
    }
    this.IsSpinner = true;
    const Ids = this.ProductVariants.filter((x: any) => x.productChecked === true).map((x: any) => x.ID);

    if (Ids.length <= 0) {
      this.toastService.showErrorToast('Error', 'Please select rows to post');
      return;
    }
    const IDsList: any = [];
    Ids.forEach((x: any) => {
      const model = { ID: x };
      IDsList.push(model);
    });
    const param = {
      ProductIDs: IDsList,
    };

    this.vapLongApiService.PostTOShopMultiple(param).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.displayPasswordPopup = false;
        this.modalPaymentPasswordComponent.close();
        this.password = '';
        this.GetAllPostTableWithLazyLoadinFunction(this.filterModel);
      }
      else if (response.ResponseCode === -1) {
        this.toastService.showErrorToast('Error', response.ResponseText);
      }
      else {
        this.toastService.showErrorToast('Error', response.ResponseText);
      }
      this.IsSpinner = false;
      this.cdr.detectChanges();
    },
      error => {
        this.toastService.showErrorToast('error', 'internal server error');
        
        this.IsSpinner = false;
        this.cdr.detectChanges();
      }
    );
  }
  async PostTOShopOrAddProductToOpenCartFunction(para: any) {
    this.selectedForPost = para;
    this.postType=1;
    if (this.password === '' || this.password === null) {
      this.toastService.showInfoToast('info', 'please enter password');
      
      this.displayPasswordPopup = true;
      this.openModalPaymentPassword();
      return;
    }
    else {
      const res = await this.validatePassword(this.password);
      if (!res) { return; }
    }
    this.IsSpinner = true;
    const ID = {
      ID: para
    };
    this.vapLongApiService.PostTOShopOrAddProductToOpenCart(ID).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success' || response.ResponseCode === 0) {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.displayPasswordPopup = false;
        this.modalPaymentPasswordComponent.close();
        this.password = '';
        this.GetAllPostTableWithLazyLoadinFunction(this.filterModel);
      }
      else if (response.ResponseCode === -1) {
        this.toastService.showErrorToast('Error', response.ResponseText);
      }
      else {
        this.toastService.showErrorToast('Error', response.ResponseText);
      }
      this.IsSpinner = false;
      this.cdr.detectChanges();
    },
      error => {
        this.toastService.showErrorToast('error', 'internal server error');
        
        this.IsSpinner = false;
        this.cdr.detectChanges();
      }
    );
  }
  async validatePassword(password: any) {
    // if (this.usermodel.ID === 1)// Check Password
    // {
      const params = {
        ID:4,
        Password: password,
        Name:'',
        IsActive:true,
        UpdatedByUserID:this.usermodel.ID,
      };
      const response = await this.vapLongApiService.CheckReceivedPaymentPassword(params).toPromise();
      if (response.ResponseCode !== 0) {
        this.toastService.showErrorToast('Error', 'Wrong password entered');
        this.openModalPaymentPassword();
        return false;
      }
      else {
        return true;
      }

    // }
    // else {
    //   const params = {
    //     VerificationCode: password,
    //     Type: 2,
    //     UserID: this.usermodel.ID,
    //     Amount: 0,
    //     UsedFor: (this.customer.CustomerID !== 0) ? this.customer.CustomerID : 0
    //   };

    //   const response = await this.vapLongApiService.CheckValidationCode(params).toPromise();
    //   if (response.ResponseCode !== 0) {
    //     this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Wrong password entered to add payment.');
    //     return false;
    //   }
    //   else {
    //     return true;
    //   }
    // }
  }
  
  async openDatePickerModal() {
    return await this.datepickerModalComponent.open();
  }
      
  async openModalPaymentPassword() {
    return await this.modalPaymentPasswordComponent.open();
  }
  
  focusPaymentPassword() {
    this.input_payment_password.focusInput();
  }
}
