import { leadingComment } from '@angular/compiler';
import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef, } from '@angular/core';
// import {
//   MenuItem,
//   SelectItem,
//   ConfirmationService,
// } from 'primeng/api';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { CustomerModel } from 'src/app/Helper/models/CustomerModel';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TrackableCodeDetailModel } from 'src/app/Helper/models/TrackableCodeDetailModel';
import { ShippingMethodModel } from 'src/app/Helper/models/ShippingMethodModel';
import { CustomerProductsDiscountModel } from 'src/app/Helper/models/CustomerProductsDiscountModel';
import { ProductVariant } from 'src/app/Helper/models/Product';
import { Columns } from 'src/app/shared/model/columns.model';
// 
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { NonTrackableProductsLocationModel } from 'src/app/Helper/models/NonTrackableProductsLocationModel';
// import { ToastService } from 'src/app/modules/shell/services/toast.service';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { StorageService } from 'src/app/shared/services/storage.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
// 
import { SalesPermissionEnum } from 'src/app/shared/constant/sales-permission';
import { randomNumber } from 'src/app/Helper/randomNumber';
import { ConfirmationService } from 'src/app/Service/confirmation.service';
import { ToastService } from '../../shell/services/toast.service';
import { ModalConfig, ModalComponent } from 'src/app/shared/partials';

@Component({
  selector: 'app-add-performa-invoice',
  templateUrl: './add-performa-invoice.component.html',
  styleUrls: ['./add-performa-invoice.component.scss'],
  providers: [DatePipe, ConfirmationService],
})
export class AddPerformaInvoiceComponent implements OnInit, OnDestroy {
  
  modalCaptchaConfig: ModalConfig = {
    modalTitle: 'User Captcha',
    modalContent: "Modal Content",
    // dismissButtonLabel: 'Submit',
    // closeButtonLabel: 'Cancel'
    hideCloseButton: () => true,
    hideDismissButton: () => true,
    modalSize: 'md'
  };

  @ViewChild('modalCaptcha') private modalCaptchaComponent: ModalComponent;

  modalConfig: ModalConfig = {
    modalTitle: 'Select Dates',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    modalSize: 'xl',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };
  @ViewChild('modal') private modalComponent: ModalComponent;

  modalLocationConfig: ModalConfig = {
    modalTitle: 'Location',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    modalSize: 'xl',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };
  @ViewChild('modalLocation') private modalLocationComponent: ModalComponent;

  modalProductConfig: ModalConfig = {
    modalTitle: 'Product Info',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    modalSize: 'md',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };
  @ViewChild('modalProduct') private modalProductComponent: ModalComponent;

  modalWishlistConfig: ModalConfig = {
    modalTitle: 'Add to Wishlist',
    modalContent: "Modal Content",
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
    modalSize: 'md',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  };
  @ViewChild('modalWishlist') private modalWishlistComponent: ModalComponent;
  
  modalPaymentConditionConfig: ModalConfig = {
    
    modalTitle: 'Payment Condition',
    modalContent: "Modal Content",
    modalSize: 'md',
    hideCloseButton: () => true,
    hideDismissButton: () => true
  }
  @ViewChild('modalPaymentCondition') private modalPaymentConditionComponent: ModalComponent;

  cartProducts: any[] = [];
  CustomerDiscountList: CustomerProductsDiscountModel[] = [];
  SalePermission = SalesPermissionEnum;
  AllProductTracablesList: TrackableCodeDetailModel[] = [];
  productTracablesList: TrackableCodeDetailModel[];
  AllCustomersList: CustomerModel[];
  AllDeliverMethodList: ShippingMethodModel[];
  orderDate: Date = new Date();
  deliverDate: Date = new Date();
  PaymentType = 'Cash';
  usermodel: UserModel;
  IsDisplay = false;
  printingData: any;
  //#region Product related variables

  AllProductListwithDiscountForSelection: ProductVariant[] = [];
  totalRecordsForProductTable = 0;

  productsColumn: Columns[] = [
    { field: 'ProductImage', header: 'Image', sorting: '', placeholder: '', isImage: true, type: TableColumnEnum.MULTIPLEIMAGES },
    { field: 'Product', header: 'Product', sorting: 'Product', placeholder: '' },
    { field: 'RemainingStock', header: 'Availible Stock', sorting: 'RemainingStock', placeholder: '' },
    { field: 'BLabel', header: 'Model', sorting: 'BLabel', placeholder: '' },
    { field: 'SalePrice', header: 'Price', sorting: 'SalePrice', placeholder: '' },
  ];
  //#endregion

  initialProductsColumns : any = ['ID', 'ProductImage', 'Product', 'BLabel', 'SalePrice', 'RemainingStock'];
  isLoadingProducts : boolean = false;
  //#region Customer selection variables
  orderByDropdown: any[];
  filteredOrderBy: any[];
  selectedOrderBy: any;

  deliverToDropdown: any[];
  filteredDeliverTo: any[];
  selectedDeliverTo: any;

  deliveryAddressDropdown: any[];
  selectedDeliveryAddressID = '';
  selectedDeliveryAddress: any;

  orderByAddressDropdown: any[];
  selectedOrderByAddressID = '';
  selectedOrderByAddress: any;
  //#endregion

  //#region other dropdown menus variables

  deliveryMethodDropdown: any[] = [];
  filteredDeliveryMethod: any[] = [];
  selectedDeliveryMethod: any;

  paymentConditionDropdown: any[] = [];
  filteredPaymentCondition: any[] = [];
  selectedPaymentCondition: any;

  ProductDropdown: any[] = [];
  filteredProduct: any[] = [];
  selectedProductCart: any;

  //#endregion

  //#region all Dialog visiabilty variables

  displayOrderByDialog = false;
  displayDeliverToDialog = false;
  displayDeliveryMethod = false;
  displayPaymentCondition = false;
  displayCustomerPreviousInvoice = false;
  displayProductTrackables = false;
  displayProductLocations = false;
  displayLastAvgPrice = false;
  displayAddPaymentPopup = false;
  displayAddToWishlist = false;
  IsOpenMultiProductDialog = false;
  //#endregion

  IsOpenProductDialog = false;
  displaySelectedProductTrackables = false;
  displayReview = false;
  disabledAgainstPaymentType = true;

  selectedCartRow: any;
  //#region ui variables
  customerPreviousBalance: any;
  customerEmail: any;
  currencySign: string;
  ActionButtonType = 1; // for saveButton=1,Save&Print=2,Save&Email=3 ;
  //#endregion ;

  //#region Location mgt variables
  AllProductLocationList: NonTrackableProductsLocationModel[] = [];
  addedProductLocations = new Array();

  //#endregion

  printingDataPreview: any;
  IsSpinner = false;
  loading: boolean;
  first = 0;
  rows = 10;
  totalRecords = 0;
  isAdded = false;
  isLocationChangedByField: any;
  items: any[];
  details: any[];
  trackables: any[] = [];
  productLocations: any[] = [];
  selectedProductTrackables: any[] = [];
  trackablePopupHeading: string;
  cartDetailID = 0;
  shipmentCost : any = 0;
  subTotal: any = 0;
  grandTotal: any = 0;
  totalDiscount: any = 0;
  paidPayment: any = 0;
  customerCurrentBalance: any = 0;
  payment = 0;
  password: any;
  creditlimit: any;
  orderByContact: any;
  deliverToContact: any = '';
  deliverToAddress: any;
  orderByAddress: any;
  remarks: string;
  rowIndex : any = null;
  invoiceNo: any;
  salePrintDetails = new Array();
  restAmount: any;
  deliverToName: string;
  PerfomaSaleID = 0;
  isTrackable = false;
  productInfo: any = [];
  selectedRowForDialogs: any;
  ProductData: any[] = [];
  dataFunc: any = customSearchFn;
  customerName: string = '';
  orderByName: string;
  RemainingStock: number;

  isCaptchaDisplayed = false;
  isCapchaValidated = false;
  firstNumber=0;
  secondNumber=0;
  ActionType=1;

  mySearch : string ;
  tmpSelectedProductList: any[] = [];

  constructor(
    private apiService: vaplongapi,
    // private toastService: ToastService,
    private toastService : ToastService,
    private cdr : ChangeDetectorRef,
    private datepipe: DatePipe,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private storageService: StorageService,
  ) {
    this.currencySign = '€';
    this.usermodel = this.storageService.getItem('UserModel');
  }

  ngOnDestroy(): void {

  }
  ngOnInit(): void {
    this.GetCustomersDropDownLists(); // Bind customers in order by and deliver to dropdownlist
    this.GetDeliveryMethodDropDownList(); // Bind delivery methods to dropdownlist
    this.GetPaymentConditionDropDownList(); //  Bind payment conditions to dropdownlist
    // this.GetProductDropDownList(); //Get product autocomplete data
    // this.AddNewRow();
    this.productInfo.push({
      CartDetailsID: 0,
      ProductVariantID: 0,
      ProductID: 0,
      ProdMaxDisc: 0,
      ProdMinDisc: 0,
      ProdMinDiscValue: 0,
      ProdMaxDiscValue: 0,
      ProductAddedToList: false,
      ProductArticleNo: false,
      ProductRemovedFromList: false,
      locationChangedByField: false,
      selectedProductCart: null,
      Quantity: 0,
      OriginalStock: 0,
      UnitPrice: 0,
      DiscPer: 0,
      DiscVal: 0,
      NetPrice: 0,
      IsQtyDisable: false,
      IsTrackable: false,
      IsLastAvgPrice: false,
      IsSelectedTrackables: false,
      IsAddToWishList: false,
      IsLocation: false,
      IsAdded: false,
      TrackableProductsSaleDetails: new Array(),
      SaleDetailNonTrackableLocations: new Array(),
    });
    this.selectedCartRow = this.cartProducts;

    this.items = [
      { label: 'Add', icon: 'pi pi-plus', command: () => this.AddProductToList() },
      { label: 'Remove', icon: 'pi pi-times', visible: this.isAdded },
    ];
  }

  //#region Perfoma sale Data Fetching
  getPerfomaSaleDetailsById(Id: any) {
    const param = { ID: Id };
    this.apiService.GetPerformaSalesByID(param).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.PerfomaSaleID = Id;

        this.BindOrderByDetails(response.PerfomaSale.CustomerID);
        this.BindDeliveryToDetails(response.PerfomaSale.DeliveredToID);

        if (response.PerfomaSale.PaymentConditionID != null) {
          const paymentcondition = this.paymentConditionDropdown.filter((x : any) => x.value === response.PerfomaSale.PaymentConditionID).shift();
          this.selectedPaymentCondition = {
            value: paymentcondition.value,
            label: paymentcondition.label,
          };
          this.PaymentType = 'Credit';
          this.disabledAgainstPaymentType = false;
        }
        else {
          this.PaymentType = 'Cash';
          this.disabledAgainstPaymentType = true;
        }

        this.remarks = response.PerfomaSale.sRemarks;
        const deliveryMethod1 : any = this.AllDeliverMethodList.find(
          (x) => x.ID === response.PerfomaSale.ShippingMethodID
        );
        this.selectedDeliveryMethod = {
          value: deliveryMethod1.ID,
          label: deliveryMethod1.Name,
        };

        this.shipmentCost = deliveryMethod1.Cost;

        // tslint:disable-next-line: ban-types
        const prodVarIDs: Number[] = [];
        for (const item of response.PerfomaSale.PerfomaSaleDetails) {

          // const detail = item;

          if (prodVarIDs.filter((x : any) => x === item.ProductVariantID).length > 0) {
            continue;
          }
          // const newTrackableList: TrackableProductsSaleDetailModel[] = [];
          let selectedproduct : any;
          if (this.AllProductListwithDiscountForSelection.length > 0) {
            selectedproduct = this.AllProductListwithDiscountForSelection.filter((x : any) =>
              x.ID === item.ProductVariantID).shift();
          }

          const params = { ID: item.ProductID };
          //this.apiService.GetProductByProductID(params).pipe(untilDestroyed(this)).subscribe((response1: any) => {
            this.apiService.GetProductByID(params).pipe(untilDestroyed(this)).subscribe((response1: any) => {
            if (response1.ResponseCode === 0) {
              const prod: any = {};

              // if (item.TrackableProductsPerfomaSaleDetails.length > 0) {
              //   item.TrackableProductsPerfomaSaleDetails.forEach(element => {
              //     const trackableitem =
              //     {
              //       CreatedAt: element.CreatedAt,
              //       ID: element.ID,
              //       Product: element.Product,
              //       ProductID: element.ProductID,
              //       ProductVariant: element.ProductVariant,
              //       ProductVariantID: element.ProductVariantID,
              //       TrackableCode: element.TrackableCode
              //     }
              //     // newTrackableList.push(trackableitem);
              //   });
              //   prod.DiscPer = item.dTotalDiscount;
              //   // prod.Quantity = newTrackableList.length;
              //   // prod.TrackableProductsSaleDetails = newTrackableList;
              // }
              // else {
              prod.DiscPer = item.dTotalDiscount /
                item.Quantity;
              prod.Quantity = item.Quantity;
              // prod.TrackableProductsSaleDetails = new Array();
              // }

              prod.CartDetailsID = this.cartDetailID;
              prod.ProductVariantID = item.ProductVariantID;
              prod.ProductID = item.ProductID;
              prod.ProdMaxDisc = 0;
              prod.ProdMinDisc = 0,
                prod.ProdMinDiscValue = 0,
                prod.ProdMaxDiscValue = 0,
                prod.ProductAddedToList = false,
                prod.ProductArticleNo = false,
                prod.ProductRemovedFromList = false,
                prod.locationChangedByField = false,
                prod.IsAdded = false,
                // prod.Quantity = 1,
                prod.UnitPrice = response1.ProductModel.SalePrice,
                // prod.DiscPer = 0,
                prod.DiscVal = 0,
                prod.OriginalStock = selectedproduct != null ? selectedproduct.RemainingStock : 0,

                prod.selectedProductCart = {
                  label: item.Product,
                  value: item.ProductVariantID
                };
              // this.products[this.rowIndex].push(this.selectedProduct)
              if (response1.ProductModel.IsTrackable) {
                prod.Quantity = 0;
                prod.IsQtyDisable = true;
                prod.IsTrackable = true;
                prod.IsSelectedTrackables = true;
                prod.IsLocation = false;
                prod.IsAddToWishList = true;
                prod.IsLastAvgPrice = true;
              }
              else {
                prod.IsQtyDisable = false;
                prod.IsTrackable = false;
                prod.IsSelectedTrackables = false;
                prod.IsLocation = true;
                prod.IsAddToWishList = true;
                prod.IsLastAvgPrice = true;
              }
              // prod.TrackableProductsSaleDetails = new Array(),
              prod.SaleDetailNonTrackableLocations = new Array();
              this.OnChangeText(prod);
              this.openLocations(prod, true);
              prod.IsAdded = true,
                this.cartProducts.push(prod);
              this.cartDetailID++;
              this.CalculateCartTotals();
            } else {
              
              this.toastService.showErrorToast('error', 'Internal Server Error! not getting api data');
              // console.log('internal serve Error', response);
            }
            this.cdr.detectChanges();
          });

        }
      }
    });
  }

  //#endregion

  //#region  OrderBy and Deliverto Funtions

  GetCustomersDropDownLists() {
    this.IsSpinner = true;
    this.orderByDropdown = [];
    this.deliverToDropdown = [];
    this.apiService.GetAllCustomer().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        response.AllCustomerList = response.AllCustomerList.filter((x : any) => x.IsActiveForCustomer === true);
        for (const item of response.AllCustomerList) {
          this.orderByDropdown.push({
            value: item.CustomerID,
            label: item.sCompanyName,
          });
          this.deliverToDropdown.push({
            value: item.CustomerID,
            label: item.sCompanyName,
          });
        }
        if (this.orderByDropdown.length > 0) {
          this.filteredOrderBy = this.orderByDropdown;
          this.filteredDeliverTo = this.deliverToDropdown;
          this.IsSpinner = false;
        }

        this.AllCustomersList = response.AllCustomerList;
        this.totalRecords = response.AllCustomerList.length;
        if (this.activatedRoute.snapshot.params.id) {
          this.getPerfomaSaleDetailsById(this.activatedRoute.snapshot.params.id);
        }
        this.cdr.detectChanges();
      } else {
        this.IsSpinner = false;
        
        this.toastService.showErrorToast('error', 'Internal Server Error! not getting api data');
        // console.log('internal serve Error', response);
      }
    });
  }

  searchOrderBy(event : any) {
    const filtered: any[] = [];
    const query = event.query;
    for (const item of this.orderByDropdown) {
      const orderBy = item;

      if (orderBy.label.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(orderBy);
      }
    }

    this.filteredOrderBy = filtered;
  }

  searchDeliverTo(event : any) {
    const filtered: any[] = [];
    const query = event.query;
    for (const item of this.deliverToDropdown) {
      const deliver = item;

      if (deliver.label.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(deliver);
      }
    }

    this.filteredDeliverTo = filtered;
  }

  // Order By on cahnge event
  BindOrderByAddress(event: any) {
    this.BindOrderByDetails(event.value);
  }

  BindOrderByDetails(orderByID: any) {
    const customer : any = this.AllCustomersList.filter((x : any) => x.CustomerID === orderByID).shift();
    this.customerPreviousBalance = this.currencySign + ' ' + customer.CurrentBalance;
    this.creditlimit = customer.dCreditLimit;
    this.orderByContact = customer.PhoneNo;
    this.deliverToContact = customer.PhoneNo;
    this.customerEmail = customer.customerEmail;
    this.customerName = customer.FirstName + ' ' + customer.LastName;
    this.orderByName = customer.FirstName + ' ' + customer.LastName;

    this.GetOrderByAddress(orderByID);
    this.selectedDeliverTo = {
      value: customer.CustomerID,
      label: customer.sCompanyName,
    };
    this.GetDeliveryAddress(this.selectedDeliverTo.value);

    if (customer.FirstName === 'Retail Customer') {
      const ship = this.deliveryMethodDropdown.find((x) =>
        x.label.includes('Self')
      );
      this.selectedDeliveryMethod = ship;
      this.shipmentCost = this.AllDeliverMethodList.filter((x : any) => x.ID === ship.value)[0].Cost;

    } else {
      if (!(customer.ShippingMethodID === null || customer.ShippingMethodID === undefined)) {

        const deliveryMethod = this.deliveryMethodDropdown
          .filter((x) => x.value === customer.ShippingMethodID)
          .shift();
        this.selectedDeliveryMethod = deliveryMethod;
        this.shipmentCost = this.AllDeliverMethodList.filter((x : any) => x.ID === deliveryMethod.value)[0].Cost;
      }
    }
    this.selectedPaymentCondition = this.paymentConditionDropdown[0];

    //#region Code block for Getting all sellable product against customer with discount assisgnments
    this.GetCustomerDiscount(orderByID);
    this.GetAllProductStockCount();
    this.GetAllProductStockList();
    this.ClosePaymentPopup();
    //#endregion

  }

  // Deliver To on change event
  BindDeliveryToDetails(deliverToID: any) {
    const customer : any = this.AllCustomersList.filter(
      (x) => x.CustomerID === deliverToID
    ).shift();
    this.orderByName = customer.FirstName + ' ' + customer.LastName;
    this.deliverToContact = customer.PhoneNo;
    this.deliverToAddress =
      customer.City === null
        ? customer.Address
        : customer.Address + ', ' + customer.City;

    this.GetDeliveryAddress(this.selectedDeliverTo.value);
  }

  // emit event of order by popup
  SelectRowOrderBy(orderBy: any) {
    this.displayOrderByDialog = false;
    this.selectedOrderBy = {
      value: orderBy.CustomerID,
      label: orderBy.sCompanyName,
    };
    this.BindOrderByDetails(this.selectedOrderBy.value);
    // this.GetDeliveryAddress(this.selectedOrderBy.value);
  }

  // emit event of deliver to  popup
  SelectRow(deliverTo: any) {
    this.displayDeliverToDialog = false;
    this.selectedDeliverTo = {
      value: deliverTo.CustomerID,
      label: deliverTo.sCompanyName,
    };
    // const customer = this.AllCustomersList.filter(
    //   (x) => x.CustomerID === this.selectedDeliverTo.value
    // ).shift();
    // this.deliverToContact = customer.PhoneNo;
    // this.deliverToAddress =
    //   customer.City === null
    //     ? customer.Address
    //     : customer.Address + ', ' + customer.City;

    //     this.GetDeliveryAddress(this.selectedDeliverTo.value);
    this.BindDeliveryToDetails(this.selectedDeliverTo.value);
  }

  GetCustomerDiscount(customerId: number) {
    const id = {
      ID: customerId
    };

    this.apiService.GetAllCustomerProductsDiscountByCustomerID(id).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.CustomerDiscountList = response.AllCustomerProductsDiscountList;
        this.cdr.detectChanges();
      }
      else {
        
        this.toastService.showErrorToast('error', 'Internal Server Error! not getting api data');
        // console.log('internal serve Error', response);
      }

    }
    );

  }
  // #endregion

  // #region  Payment Condition Funtions
  GetPaymentConditionDropDownList() {
    this.paymentConditionDropdown = [];
    let paymentList = [];

    this.apiService.GetAllPaymentCondition().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        paymentList = response.AllPaymentConditionList.filter((x : any) => x.IsActive !== false);
        for (const item of paymentList) {
          this.paymentConditionDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }
        this.filteredPaymentCondition = this.paymentConditionDropdown;
        this.cdr.detectChanges();
      } else {
        
        this.toastService.showErrorToast('error', 'Internal Server Error! not getting api data');
        // console.log('internal serve Error', response);
      }
    });
  }

  searchPaymentCondition(event : any) {
    const filtered: any[] = [];
    const query = event.query;
    for (const item of this.paymentConditionDropdown) {
      const paymentCondition = item;
      if (paymentCondition.label.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(paymentCondition);
      }
    }
    this.filteredPaymentCondition = filtered;
  }

  // emit event of payment condition popup
  onPaymentConditionSelectValue(newValue: any) {
    this.displayPaymentCondition = false;
    this.selectedPaymentCondition = {
      value: newValue.selectedPaymentCondition.ID,
      label: newValue.selectedPaymentCondition.Name,
    };
  }

  // radio button on cange event
  onClickPaymentType() {
    if (this.PaymentType === 'Credit') {
      this.disabledAgainstPaymentType = false;
    } else {
      this.disabledAgainstPaymentType = true;
    }
  }

  //#endregion

  //#region   Delivery Method Autocomplete and DropDown Data Funtions
  GetDeliveryMethodDropDownList() {
    this.IsSpinner = true;
    this.deliveryMethodDropdown = [];
    this.apiService.GetAllDeliveryMethod().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.AllDeliverMethodList = response.AllShippingMethodsList.filter((x : any) => x.IsActive !== false);
        for (const item of this.AllDeliverMethodList) {
          this.deliveryMethodDropdown.push({
            value: item.ID,
            label: item.Name,
          });
        }
        this.filteredDeliveryMethod = this.deliveryMethodDropdown;
        this.IsSpinner = false;
        this.cdr.detectChanges;
      } else {
        this.IsSpinner = false;
        
        this.toastService.showErrorToast('error', 'Internal Server Error! not getting api data');
        // console.log('internal serve Error', response);
      }
    });
  }

  searchDeliveryMethod(event : any) {
    const filtered: any[] = [];
    const query = event.query;
    for (const item of this.deliveryMethodDropdown) {
      const deliveryMethod = item;
      if (deliveryMethod.label.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(deliveryMethod);
      }
    }
    this.filteredDeliveryMethod = filtered;
  }

  BindShipmentCost(event: any) {
    const deliveryMethod : any = this.AllDeliverMethodList.find(
      (x) => x.ID === event.value
    );
    this.shipmentCost = deliveryMethod.Cost;
    this.CalculateCartTotals();
  }

  // emit event of delivery method popup
  onDeliveryMethodSelectValue(newValue: any) {
    this.displayDeliveryMethod = false;
    this.selectedDeliveryMethod = {
      value: newValue.selectedDeliveryMethod.ID,
      label: newValue.selectedDeliveryMethod.Name,
    };
    const deliveryMethod : any = this.AllDeliverMethodList.find(
      (x) => x.ID === newValue.selectedDeliveryMethod.ID
    );
    this.shipmentCost = deliveryMethod.Cost;
    this.CalculateCartTotals();
  }

  //#endregion

  //#region  Delivery Address dropdownlist

  GetDeliveryAddress(customerId : any) {
    this.deliveryAddressDropdown = [];
    const id = {
      ID: customerId,
    };
    this.apiService.GetCustomerbyID(id).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.deliveryAddressDropdown.push({
          value: response.CustomerModel.CustomerID,
          label:
            response.CustomerModel.City === null
              ? response.CustomerModel.Address
              : response.CustomerModel.Address +
              ', ' +
              response.CustomerModel.City,
        });
        if (this.deliveryAddressDropdown.length > 0) {
          this.selectedDeliveryAddress = this.deliveryAddressDropdown[0].value;
          this.deliverToAddress = this.deliveryAddressDropdown[0].label;
          this.IsSpinner = false;
        }
        this.cdr.detectChanges();
      } else {
        this.toastService.showErrorToast('error', response.ResponseText);
        // console.log('internal serve Error', response.ResponseText);
      }
    });
  }
  GetOrderByAddress(customerId : any) {
    this.orderByAddressDropdown = [];
    const id = {
      ID: customerId,
    };
    this.apiService.GetCustomerbyID(id).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.orderByAddressDropdown.push({
          value: response.CustomerModel.CustomerID,
          label:
            response.CustomerModel.City === null
              ? response.CustomerModel.Address
              : response.CustomerModel.Address +
              ', ' +
              response.CustomerModel.City,
        });
        if (this.orderByAddressDropdown.length > 0) {
          this.selectedOrderByAddress = this.orderByAddressDropdown[0].value;
          this.orderByAddress = this.orderByAddressDropdown[0].label;
          this.IsSpinner = false;
        }
        this.cdr.detectChanges();
      } else {
        this.toastService.showErrorToast('error', response.ResponseText);
        // console.log('internal serve Error', response.ResponseText);
      }
    });
  }
  //#endregion

  //#region  Open Dialog functions

  OpenOrderByDialog() {
    this.displayOrderByDialog = true;
  }
  OpenDeliveryToDialog() {
    this.displayDeliverToDialog = true;
  }
  OpenDeliveryMethodDialog() {
    this.displayDeliveryMethod = true;
  }
  OpenPaymentConditionDialog() {
    if (!this.disabledAgainstPaymentType) {
      this.displayPaymentCondition = true;
    } else {
      this.toastService.showInfoToast('info', 'payment condition is disabled please change payment type.');
    }
  }
  OpenCustomerPreviousInvoiceDialog() {
    // this.displayCustomerPreviousInvoice = true;
    // this.openModal();
  }

  OpenProductDialog(product: any, index: number | null = null) {
    this.selectedCartRow = product;
    if (index != null) {
      this.rowIndex = index;
    } else {
      this.rowIndex = null;
    }
    this.IsOpenProductDialog = true;
  }

  // Open Add to wishlist popup for cart table
  OpenAddToWishlistPopup(selectedRow : any) {
    this.selectedRowForDialogs = selectedRow;
    this.displayAddToWishlist = true;
  }

  // Open Payment popup to add payment and password
  OpenAddPaymentPopup() {
    if (this.PaymentType !== 'Credit') {
      this.payment = Number(this.grandTotal);
    } else {
      this.payment = 0;
    }

    this.displayAddPaymentPopup = true;
  }

  // Close Add to Wishlist popup
  CloseDialog(newValue: any) {
    this.displayAddToWishlist = false;
  }

  // Get Last Avarage Purchase price details for cart table
  OpenLastAvaragePriceDialog(selectedRow : any) {
    this.selectedRowForDialogs = selectedRow;
    this.displayLastAvgPrice = true;
  }

  // Open Location dialog popup
  OpenProductLocations(selectedRow : any) {
    this.selectedRowForDialogs = selectedRow;
    this.openLocations(this.selectedRowForDialogs, false);
  }
  //#endregion

  //#region Product funtions

  GetProductDropDownList() {
    this.IsSpinner = true;
    this.ProductDropdown = [];
    this.isLoadingProducts = true;
    this.apiService
      .GetProductDropDownDatawithVariantInfo().pipe(untilDestroyed(this)).subscribe((response: any) => {
        this.isLoadingProducts = false;
        if (response.ResponseText === 'success') {
          for (const item of response.DropDownData) {
            this.ProductDropdown.push({
              value: item.ProductVariantID,
              label: item.ProducVariantName,
              RemainingStock: item.RemainingStock,
            });
          }
          this.filteredProduct = this.ProductDropdown;
          if (this.ProductDropdown.length > 0) {
            this.IsSpinner = false;
          }
          this.cdr.detectChanges();

        } else {
          this.IsSpinner = false;
          
          this.toastService.showErrorToast('error', 'Internal Server Error! not getting api data');
          // console.log('internal serve Error', response);
        }
      });
  }

  GetAllProductStockCount() {

    const params = {
      PageNo: 0,
      PageSize: 10000000,
      IsGetAll: true,
      IsAllProduct: true,
      OutletID: this.usermodel.OutletID,
      Search: ''
    };
     // this.apiService.GetAllProductStockForSaleCount(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
     
    //   if (response.ResponseCode === 0) {
    //     this.totalRecordsForProductTable = response.TotalRowCount;
    //   } else {
    //     this.toastService.showErrorToast('error', 'internal server error');
    //   }
    // });
    this.apiService.GetAllProductStockForSaleNewTotalCount(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.cdr.detectChanges();
        this.totalRecordsForProductTable = response.TotalRowCount;
      } else {
        this.toastService.showErrorToast('error', 'internal server error');
      }
    });

  }

  GetAllProductStockList() {

    const params = {
      PageNo: 0,
      PageSize: 10000000,
      IsGetAll: true,
      IsAllProduct: true,
      OutletID: this.usermodel.OutletID,
      Search: ''
    };
    this.isLoadingProducts = true;
    // this.apiService.GetAllProductStockListForSale(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.apiService.GetAllProductStockForSaleNew(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.isLoadingProducts = false;
      if (response.ResponseCode === 0) {
        let minDiscount = 0;
        let maxDiscount = 0;
        let minDiscountValue = 0;
        let maxDiscountValue = 0;
        // const selectedProductDiscount = new CustomerProductsDiscountModel();
        response.AllProductVariantSaleList.forEach((item : any) => {
          const selectedProductDiscount : any = this.CustomerDiscountList.filter((x : any) => x.ProductID === item.ProductID)[0];
          // tslint:disable-next-line: deprecation
          if ((selectedProductDiscount === null || selectedProductDiscount === undefined)) {
            minDiscount = 0;
            maxDiscount = 0;
          }
          else {
            minDiscount = selectedProductDiscount.fMinDiscPrec.valueOf() ? selectedProductDiscount.fMinDiscPrec.valueOf() : 0;
            maxDiscount = selectedProductDiscount.fMaxDiscPerc.valueOf() ? selectedProductDiscount.fMaxDiscPerc.valueOf() : 0;
          }
           // minDiscountValue = (minDiscount * (item.Price.HasValue ? item.Price.Value : 0)) / 100;
          // maxDiscountValue = (maxDiscount * (item.Price.HasValue ? item.Price.Value : 0)) / 100;
          minDiscountValue = (minDiscount * (item.SalePrice.HasValue ? item.SalePrice.Value : 0)) / 100;
          maxDiscountValue = (maxDiscount * (item.SalePrice.HasValue ? item.SalePrice.Value : 0)) / 100;
          // imageSrc = 'http://' + host + '/Content/' + item.ProductImage;
          let product = new ProductVariant();
          product = {
            ID: item.ID,
             //Product: (item.ColorID === 1 && item.SizeID === 1) ? item.Product : (item.ColorID !== 1 && item.SizeID === 1) ? item.Product + '<br>Color: ' + item.Color : (item.ColorID === 1 && item.SizeID !== 1) ? item.Product + '<br>Size: ' + item.Size : item.Product + '<br>Color: ' + item.Color + ', Size:' + item.Size,
             Product:item.Product,
            RemainingStock: item.RemainingStock,
            PurchasePrice: item.PurchasePrice,
            ProductID: item.ProductID,
            BLabel: item.BLabel,
            ArticalNo: item.ArticalNo,
            SizeID: item.SizeID,
            minDisc: minDiscount,
            maxDisc: maxDiscount,
            minDiscValue: minDiscountValue,
            maxDiscValue: maxDiscountValue,
            ColorID: item.ColorID,
            ProductImage: item.ProductImage,
            //PriceString: item.Price,
            SalePrice: item.SalePrice,
          };
          this.AllProductListwithDiscountForSelection.push(product);
          this.ProductDropdown.push({
            value: product.ID,
            label: product.Product,
            RemainingStock: product.RemainingStock,
          });
          this.filteredProduct = this.ProductDropdown;
        });
        this.cdr.detectChanges();

      }
      else {
        
        this.toastService.showErrorToast('error', 'Internal Server Error! not getting api data');
        // console.log('internal server error ! GetAllProductPagination not getting api data');
      }
    });

  }

  // Check Product Trackability
  CheckProductTrackability(productVariantID: number, productID: number, product: any = null) {

    const params = { ID: productID };
    this.isLoadingProducts = true;
    //this.apiService.GetProductByProductID(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.apiService.GetProductByID(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
        this.isLoadingProducts = false;
        if (response.ResponseCode === 0) {
        this.setValueToRow(response, productVariantID, productID, product != null ? product : this.productInfo[0]);
        this.cdr.detectChanges();
      }
      else {
        this.toastService.showErrorToast('error', 'internal server error ! fillFields');
        // console.log('internal server error ! fillFields ');
      }
    },
      error => {
        this.toastService.showErrorToast('error', 'internal server error ! fillFields');
        // console.log('internal server error ! fillFields');
      }
    );
  }

  // emit event on product popup
  onSelectProductValue(newValue: any) {
    this.IsOpenProductDialog = false;
    this.productInfo[0].selectedProductCart = {
      label: newValue.Product,
      value: newValue.ID
    };
    this.productInfo[0].OriginalStock = newValue.RemainingStock;
    this.RemainingStock = newValue.RemainingStock;
    this.CheckProductTrackability(newValue.ID, newValue.ProductID, this.rowIndex === null ? null : this.cartProducts[this.rowIndex]);
  }

  BindProductDetails(event: any, product: any) {
    if (event !== null) {

      const obj : any = this.AllProductListwithDiscountForSelection.filter((x : any) => x.ID === event.value)[0];
      this.CheckProductTrackability(event.value, obj.ProductID, product);
      this.RemainingStock = event.RemainingStock;
    }
  }

  // emit event on on multiple product popup
  addMultipleProduct(event : any) {
    for (const item of event) {
      // this.CheckProductTrackability(element.ID);
      var index = this.cartProducts.findIndex(x=>x.ProductID==item.ProductID);
      if(index!=-1)
      {
        this.toastService.showErrorToast('error', this.cartProducts.find(x=>x.ProductID==item.ProductID).selectedProductCart.label+ ' already exist in cart');
      }
      else
      {
        const params = { ID: item.ProductID };
      //this.apiService.GetProductByProductID(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
        this.apiService.GetProductByID(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
        if (response.ResponseCode === 0) {

          const prod: any = {};

          prod.CartDetailsID = this.cartDetailID;
          prod.ProductVariantID = item.ID;
          prod.ProductID = item.ProductID;
          prod.ProdMaxDisc = 0;
          prod.ProdMinDisc = 0,
            prod.ProdMinDiscValue = 0,
            prod.ProdMaxDiscValue = 0,
            prod.ProductAddedToList = false,
            prod.ProductArticleNo = false,
            prod.ProductRemovedFromList = false,
            prod.locationChangedByField = false,
            prod.IsAdded = false,
            prod.Quantity = 1,
            prod.OriginalStock = item.RemainingStock,
            prod.UnitPrice = response.ProductModel.SalePrice,
            prod.DiscPer = 0,
            prod.DiscVal = 0,
            prod.selectedProductCart = {
              label: item.Product,
              value: item.ID
            };
          // this.products[this.rowIndex].push(this.selectedProduct)
          if (response.ProductModel.IsTrackable) {
            prod.Quantity = 0;
            prod.IsQtyDisable = true;
            prod.IsTrackable = true;
            prod.IsSelectedTrackables = true;
            prod.IsLocation = false;
            prod.IsAddToWishList = true;
            prod.IsLastAvgPrice = true;
          }
          else {
            prod.IsQtyDisable = false;
            prod.IsTrackable = false;
            prod.IsSelectedTrackables = false;
            prod.IsLocation = true;
            prod.IsAddToWishList = true;
            prod.IsLastAvgPrice = true;
          }
          prod.TrackableProductsSaleDetails = new Array(),
            prod.SaleDetailNonTrackableLocations = new Array();
          this.OnChangeText(prod);
          this.openLocations(prod, true);
          prod.IsAdded = true,
            this.cartProducts.push(prod);
          this.cartDetailID++;
          this.CalculateCartTotals();
        }
        else {
          this.toastService.showErrorToast('error', 'internal server error ! fillFields');
          // console.log('internal server error ! fillFields ');
        }
      },
        error => {
          this.toastService.showErrorToast('error', 'internal server error ! fillFields');
          // console.log('internal server error ! fillFields');
        });
      }
    }
    this.IsOpenMultiProductDialog = false;
  }

  // #endregion

  // #region cart management

  // Add new row to cart table
  AddNewRow(isValidate = false, rowIndex = null) {
    const prod = this.cartProducts[rowIndex === null ? this.rowIndex : rowIndex];
    if (isValidate && (prod.Quantity === 0 || prod.selectedProduct === null)) {
      this.toastService.showErrorToast('Error', 'Product,Quantity is required');
      return;
    }
    const newprod = {
      CartDetailsID: 0,
      ProductVariantID: 0,
      ProductID: 0,
      ProdMaxDisc: 0,
      prodMinDisc: 0,
      ProdMinDiscValue: 0,
      ProdMaxDiscValue: 0,
      ProductAddedToList: false,
      ProductArticleNo: false,
      ProductRemovedFromList: false,
      locationChangedByField: false,
      selectedProductCart: null,
      Quantity: 0,
      OriginalStock: 0,
      UnitPrice: 0,
      DiscPer: 0,
      DiscVal: 0,
      NetPrice: 0,
      IsQtyDisable: false,
      IsTrackable: false,
      IsLastAvgPrice: false,
      IsSelectedTrackables: false,
      IsAddToWishList: false,
      IsLocation: false,
      IsAdded: false,
      TrackableProductsSaleDetails: new Array(),
      SaleDetailNonTrackableLocations: new Array(),
    };

    this.productInfo[0].IsAdded = true;

    const ahs = JSON.parse(JSON.stringify(this.productInfo[0]));

    this.cartProducts.push(ahs);
    this.productInfo[0] = newprod;
    setTimeout(() => {

      // this.focus.focus();
      this.cdr.detectChanges();
    }, 0);
  }


  AddProductToList(): void {
    this.RemainingStock = 0;
    if (!this.productInfo[0].selectedProductCart) {
      this.toastService.showErrorToast('Error', 'Please Select Product');
      return;
    }
    if (this.productInfo[0].IsTrackable) {
      this.productInfo[0].Quantity = this.productInfo[0].TrackableProductsSaleDetails.length;
    }

    if ((!this.productInfo[0].IsTrackable && this.productInfo[0].Quantity === 0)) {
      this.toastService.showErrorToast('Error', 'Please enter quantity');
      return;
    }

    var index = this.cartProducts.findIndex(x=>x.ProductID==this.productInfo[0].ProductID);
    if(index!=-1)
    {
      this.toastService.showErrorToast('error', this.cartProducts.find(x=>x.ProductID==this.productInfo[0].ProductID).selectedProductCart.label+ ' already exist in cart');
    return;
    }
    
    // this.openLocations(this.productInfo[0], true);
    this.addTmpProducts(this.productInfo[0].ProductID);
    this.AddNewRow();
    this.CalculateCartTotals();
    this.toastService.showSuccessToast('Success', 'Added To List');

  }

  // calculation on cart value change event
  OnChangeText(product: any) {
    const discValue = product.DiscPer * product.UnitPrice / 100;
    const totaldiscount = discValue * product.Quantity;
    product.DiscVal = totaldiscount.toFixed(2);
    const total = (product.Quantity * product.UnitPrice) - totaldiscount;
    product.NetPrice = total.toFixed(2);
    if (this.cartProducts.length > 0) {
      this.CalculateCartTotals();
    }

  }

  // set values to cart on addToCart
  setValueToRow(response: any, productVariantID: any, productID: any, productInfo : any) {
    productInfo.CartDetailsID = this.cartDetailID;
    productInfo.ProductVariantID = productVariantID;
    productInfo.ProductID = productID;
    productInfo.ProdMaxDisc = response.ProductModel.MaxDiscPer;
    productInfo.prodMinDisc = response.ProductModel.MinDiscPer;
    productInfo.ProdMinDiscValue = 0;
    productInfo.ProdMaxDiscValue = 0;
    productInfo.ProductAddedToList = false;
    productInfo.ProductArticleNo = false;
    productInfo.ProductRemovedFromList = false;
    productInfo.locationChangedByField = false;
    productInfo.Quantity = 1;
    // productInfo.OriginalStock = productInfo.OriginalStock;
    productInfo.UnitPrice = response.ProductModel.SalePrice;
    productInfo.DiscPer = 0;
    productInfo.DiscVal = 0;
    productInfo.IsAdded = false;

    this.selectedProductCart = {
      label: response.ProductModel.Name,
      value: productID
    };
    productInfo.selectedProductCart = {
      label: response.ProductModel.Name,
      value: productID
    };
    productInfo.TrackableProductsSaleDetails = new Array(),
      productInfo.SaleDetailNonTrackableLocations = new Array();
    if (response.ProductModel.IsTrackable) {

      this.isTrackable = true;
      productInfo.IsQtyDisable = true;
      productInfo.Quantity = 0;
      productInfo.IsTrackable = true;
      productInfo.IsSelectedTrackables = true;
      productInfo.IsLocation = false;
      productInfo.IsAddToWishList = true;
      productInfo.IsLastAvgPrice = true;
    }
    else {

      this.isTrackable = false;
      productInfo.IsQtyDisable = false;
      productInfo.IsTrackable = false;
      productInfo.IsSelectedTrackables = false;
      productInfo.IsLocation = true;
      productInfo.IsAddToWishList = true;
      productInfo.IsLastAvgPrice = true;
    }
    this.OnChangeText(productInfo);

    // this.openLocations(productInfo, true);

    this.cartDetailID++;
    this.AddProductToList();
  }

  // on cart quantity field changes
  onChangeProductQuantity(selectedRow : any) {
    const autoAssignLocationWhenProduct = true;
    selectedRow.locationChangedByField = false;
    this.OnChangeText(selectedRow);
    // this.openLocations(selectedRow, autoAssignLocationWhenProduct);
    // this.saveLocations(selectedRow);
  }

  // on cart product removed
  RemoveCartProduct(product : any) {
    // this.cartProducts.splice(rowIndex, 1);
    console.log("delete item from product arr event is ", product);
    const index = this.cartProducts.findIndex((cartProduct) => cartProduct === product);
    if (index !== -1) {
      this.removeTmpProducts(product.ProductID);
      this.cartProducts.splice(index, 1);
    }
    this.CalculateCartTotals();
  }

  // call to calculate cart summery values
  CalculateCartTotals() {
    let totalsubtotal = 0;
    let totaldiscount = 0;
    for (const item of this.cartProducts) {
      const row = item;
      totalsubtotal = totalsubtotal + (row.Quantity * row.UnitPrice);  // calculate subtotal
      if (row.DiscVal > 0) {
        totaldiscount = totaldiscount + Number(row.DiscVal); // calculate discount
      }
    }
    const shipmentCost = Number(this.shipmentCost);
    const subtotal = totalsubtotal;
    if (shipmentCost > 0) {
      totalsubtotal = totalsubtotal + shipmentCost;
    }
    const totalgrandTotal = (totalsubtotal - totaldiscount);
    this.grandTotal = totalgrandTotal.toFixed(2);
    this.subTotal = subtotal.toFixed(2);
    if (totaldiscount > 0) {
      this.totalDiscount = totaldiscount.toFixed(2);
    }
    if (!this.customerPreviousBalance) {
      this.toastService.showErrorToast('error', 'Please Select Customer First.');
      return null;
    }
    let previousBalance = this.customerPreviousBalance.split('€').join('');
    previousBalance = previousBalance.split(' ').join('');
    // this.customerCurrentBalance = (Number(this.grandTotal)-Number(previousBalance)).toFixed(2);
    this.customerCurrentBalance = ((Number(previousBalance) + Number(this.grandTotal)) - Number(this.payment)).toFixed(2);
    this.cdr.detectChanges();

  }

  //#endregion

  //#region Location mgt

  openLocations(selectedRow : any, autoAssignLocationWhenProduct : any) {
    if (selectedRow.IsTrackable === true) {
      return;
    }
    this.GetProductLocationsByID(selectedRow, autoAssignLocationWhenProduct);
    if (!autoAssignLocationWhenProduct) {
      this.displayProductLocations = true;
    }
  }

  GetProductLocationsByID(selectedRow : any, autoAssignLocationWhenProduct : any) {
    this.isLocationChangedByField = selectedRow.locationChangedByField;
    const params = {
      ProductVariantID: selectedRow.ProductVariantID,
      PageNo: 0,
      PageSize: 10000000,
      IsLocationAssigned: false
    };

    this.apiService.GetProductLocationByID(params).pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseCode === 0) {
        this.AllProductLocationList = [];
        this.AllProductLocationList = response.AllNonTrackableProductsLocationModelList;
        this.AllProductLocationList.forEach((x : any) => { x.selectedProductQuantity = 0; });
        let location;
        let checkQty = 0;
        let total = selectedRow.Quantity;

        // save location variables
        let id = 0;
        let levelID = 0;
        let quantity = 0;
        let dd;
        let location1 : any;
        let loc;
        let LocationName;


        this.AllProductLocationList.forEach((item : any) => {
          if (selectedRow.IsAdded) {
            if (this.isLocationChangedByField) {

              const locations = this.cartProducts.filter((x : any) => x.ProductVariantID === item.ProductVariantID).shift();
              if (item.LevelID === null) {
                location = locations.SaleDetailNonTrackableLocations.filter((x : any) => x.NonTrackableProductsLocationID === item.ID).shift();
              } else {
                location = locations.SaleDetailNonTrackableLocations.filter((x : any) => x.LevelID === item.LevelID).shift();
              }

              if (location != null) {
                item.selectedProductQuantity = location.Quantity;
              } else {
                item.selectedProductQuantity = 0;
              }
            }
            else {
              if (item.Quantity != null) {

                if (total === 0) {
                  item.selectedProductQuantity = 0;
                } else if (total > 0) {
                  checkQty = total - item.Quantity;
                  if (checkQty >= 0) {
                    total = checkQty;
                    item.selectedProductQuantity = item.Quantity;
                  }
                  else {
                    item.selectedProductQuantity = total;
                    total = 0;
                  }
                }
              } else {
                item.selectedProductQuantity = 0;
              }
            }
          }
          else if (this.productLocations.length > 0 && this.isLocationChangedByField) {
            if (item.LevelID === null) {
              location = this.productLocations.filter((x : any) => x.NonTrackableProductsLocationID === item.ID).shift();
            } else {
              location = this.productLocations.filter((x : any) => x.LevelID === item.LevelID).shift();
            }

            if (location != null) {
              item.selectedProductQuantity = location.Quantity;
            } else {
              item.selectedProductQuantity = 0;
            }

            this.productInfo[0].SaleDetailNonTrackableLocations = this.productLocations;
            this.productLocations = [];
          }
          else {

            if (item.Quantity != null) {

              if (total === 0) {
                item.selectedProductQuantity = 0;
              }
              else if (total > 0) {
                checkQty = total - item.Quantity;
                if (checkQty >= 0) {
                  total = checkQty;
                  item.selectedProductQuantity = item.Quantity;
                }
                else {
                  item.selectedProductQuantity = total;
                  total = 0;
                }
              }
            } else {
              item.selectedProductQuantity = 0;
            }

          }
          // save location changes for in time response
          if (autoAssignLocationWhenProduct) {
            id = item.ID;
            levelID = item.LevelID;
            quantity = item.selectedProductQuantity;

            LocationName = item.Location;
            location1 = {
              NonTrackableProductsLocationID: id,
              LevelID: (levelID === null) ? null : levelID,
              Quantity: quantity,
              locationName: LocationName,
            };
            if (selectedRow.IsAdded) {
              dd = this.cartProducts.filter((x : any) => x.ProductVariantID === selectedRow.ProductVariantID).shift();

              loc = dd.SaleDetailNonTrackableLocations.filter((x : any) =>
                x.NonTrackableProductsLocationID === location1.NonTrackableProductsLocationID && x.LevelID === location1.LevelID).shift();

              if (!(loc === null || loc === undefined)) {
                loc.Quantity = location1.Quantity;
              }
              else {
                dd.SaleDetailNonTrackableLocations.push(location1);
              }

              if (location1.Quantity < 0) {
                const indexno = dd.SaleDetailNonTrackableLocations.indexOf((x : any) =>
                  x.NonTrackableProductsLocationID === location1.NonTrackableProductsLocationID && x.LevelID === location1.LevelID);
                dd.SaleDetailNonTrackableLocations.splice(indexno, 1);
              }
            }
            else {
              loc = this.productLocations.filter((x : any) => x.NonTrackableProductsLocationID === location1.NonTrackableProductsLocationID &&
                x.LevelID === location1.LevelID).shift();

              // tslint:disable-next-line: deprecation
              if (!(loc === null || loc === undefined)) {
                loc.Quantity = location1.Quantity;
              } else {
                this.productLocations.push(location1);
              }
              this.productInfo[0].SaleDetailNonTrackableLocations = this.productLocations;
              this.productLocations = [];
            }
          }
          // ended save code

        });
        // if (this.AllProductLocationList.length != 0) {
        //   if (!selectedRow.IsAdded && autoAssignLocationWhenProduct)
        //     this.saveLocations(selectedRow);
        // }
        this.cdr.detectChanges();

      }
      else {
        
        this.toastService.showErrorToast('error', 'Internal Server Error! not getting api data');
        // console.log('internal serve Error', response);
      }
      this.cdr.detectChanges();
    });
  }

  onChangeSelectedProductQuantity(event : any) {
    this.isLocationChangedByField = true;
    let totalQty = 0;
    let originalQty = 0;
    for (const item of this.AllProductLocationList) {
      let quantity = item.selectedProductQuantity;
      originalQty = Number(event.Quantity);
      if (quantity > originalQty) {
        quantity = originalQty;
        item.selectedProductQuantity = quantity;
      }
      totalQty = totalQty + quantity;
    }
    let isAdded = false;
    this.cartProducts.filter((x : any) =>
      x.CartDetailID === this.selectedRowForDialogs.CartDetailID &&
      x.ProductVariantID === this.selectedRowForDialogs.ProductVariantID &&
      x.ProductID === this.selectedRowForDialogs.ProductID).forEach(element => {
        element.Quantity = totalQty;
        element.locationChangedByField = true;
        element.DiscVal = ((element.DiscPer * element.UnitPrice / 100) * element.Quantity).toFixed(2);
        element.NetPrice = ((element.Quantity * element.UnitPrice) - element.DiscVal).toFixed(2);
        isAdded = element.IsAdded;
      });
    this.CalculateCartTotals();

    const selectedRow = this.cartProducts.filter((x : any) =>
      x.CartDetailID === this.selectedRowForDialogs.CartDetailID &&
      x.ProductVariantID === this.selectedRowForDialogs.ProductVariantID &&
      x.ProductID === this.selectedRowForDialogs.ProductID)[0];
    if (isAdded) {
      // this.saveLocations(selectedRow);
    }
  }

  saveLocations(selectedRow : any) {
    let id = 0;
    let levelID : any = 0;
    let quantity = 0;
    let location : any;
    const variantID = selectedRow.ProductVariantID;
    let dd;
    let loc;
    let indexno;
    let LocationName;
    for (const item of this.AllProductLocationList) {
      id = item.ID;
      levelID = item.LevelID;
      quantity = item.selectedProductQuantity;

      LocationName = item.Location;
      location = {
        NonTrackableProductsLocationID: id,
        LevelID: (levelID === null) ? null : levelID,
        Quantity: quantity,
        locationName: LocationName,
      };
      if (selectedRow.IsAdded) {
        dd = this.cartProducts.filter((x : any) => x.ProductVariantID === variantID).shift();

        loc = dd.SaleDetailNonTrackableLocations.filter((x : any) =>
          x.NonTrackableProductsLocationID === location.NonTrackableProductsLocationID && x.LevelID === location.LevelID).shift();

        // tslint:disable-next-line: deprecation
        if (!(loc === null || loc === undefined)) {
          loc.Quantity = location.Quantity;
        } else {
          dd.SaleDetailNonTrackableLocations.push(location);
        }

        if (location.Quantity < 0) {
          indexno = dd.SaleDetailNonTrackableLocations.indexOf((x : any) =>
            x.NonTrackableProductsLocationID === location.NonTrackableProductsLocationID && x.LevelID === location.LevelID);
          dd.SaleDetailNonTrackableLocations.splice(indexno, 1);
        }
      }
      else {
        loc = this.productLocations.filter((x : any) => x.NonTrackableProductsLocationID === location.NonTrackableProductsLocationID &&
          x.LevelID === location.LevelID).shift();

        // tslint:disable-next-line: deprecation
        if (!(loc === null || loc === undefined)) {
          loc.Quantity = location.Quantity;
        } else {
          this.productLocations.push(location);
        }

        this.productInfo[0].SaleDetailNonTrackableLocations = this.productLocations;
        this.productLocations = [];
      }
    }
  }
  //#endregion

  //#region Trackables funtions

  OpenProductTrackables(selectedRow : any) {
    this.selectedRowForDialogs = selectedRow;
    if (this.selectedRowForDialogs.selectedProductCart === null) {
      this.toastService.showInfoToast('info', 'Please select a product.');
      return;
    }
    this.GetProductTrackablesList(this.selectedRowForDialogs);
    this.trackablePopupHeading = this.selectedRowForDialogs.selectedProductCart.label;

  }
  GetProductTrackablesList(selectedRow : any) {

    const id = {
      ProductVariantID: selectedRow.ProductVariantID,
      OutletID: this.usermodel.OutletID
    };
    this.apiService.GetProductTrackablesById(id).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.AllProductTracablesList = response.TrackableCodesDetailList;
        this.refreshSelectedProductTrackables(selectedRow);
        this.displayProductTrackables = true;
        this.cdr.detectChanges();

      }
      else {
        
        this.toastService.showErrorToast('error', 'Internal Server Error! not getting api data');
        // console.log('internal serve Error', response);
      }

    });
  }
  refreshSelectedProductTrackables(selectedRow : any) {
    this.productTracablesList = [];
    let code;
    if (selectedRow.IsAdded) {
      const detailsIndex = this.cartProducts.findIndex((x : any) => x.ProductVariantID === selectedRow.ProductVariantID &&
        x.ProductID === selectedRow.ProductID && x.CartDetailID === selectedRow.CartDetailID);
      const prodtrackables = this.cartProducts[detailsIndex].TrackableProductsSaleDetails;
      for (const item of this.AllProductTracablesList) {
        code = prodtrackables.filter((x : any) => x.TrackableCode === item.TrackableCode).shift();
        if (!code) {
          // const trackableCode =item.TrackableCode;
          this.productTracablesList.push(item);
        }
      }
    }
    else {
      for (const item of this.AllProductTracablesList) {
        code = this.trackables.filter((x : any) => x.TrackableCode === item.TrackableCode).shift();
        if (!code) {
          // const trackableCode =item.TrackableCode;
          this.productTracablesList.push(item);
        }
      }
    }
  }

  // Open Product Selected Trackables Popup for cart table
  OpenSelectedProductTrackables(selectedRow : any) {
    this.selectedRowForDialogs = selectedRow;
    if (this.cartProducts.length > 0) {
      this.selectedProductTrackables = this.selectedRowForDialogs.TrackableProductsSaleDetails;
    }
    else {
      this.selectedProductTrackables = this.trackables;
    }
    this.trackablePopupHeading = this.selectedRowForDialogs.selectedProductCart.label;
    this.displaySelectedProductTrackables = true;

  }

  onTrackableSelectValue(event : any) {
    const selectedRow = this.selectedRowForDialogs;
    const trackablecode = event.TrackableCode;

    const saleDetailTrackable = {
      TrackableCode: trackablecode,
      ProductVariantID: selectedRow.ProductVariantID,
    };
    const detailsIndex = this.cartProducts.findIndex((x : any) => x.ProductVariantID === selectedRow.ProductVariantID &&
      x.ProductID === selectedRow.ProductID && x.CartDetailID === selectedRow.CartDetailID);
    if (selectedRow.IsAdded) {
      // const prodtrackables =  this.cartProducts[detailsIndex].TrackableProductsSaleDetails;
      // prodtrackables.push(saleDetailTrackable);
      this.cartProducts[detailsIndex].TrackableProductsSaleDetails.push(saleDetailTrackable);
    } else {
      this.trackables.push(saleDetailTrackable);
    }
    const curentQuantity = selectedRow.Quantity;
    this.cartProducts[detailsIndex].Quantity = curentQuantity + 1;
    this.OnChangeText(this.cartProducts[detailsIndex]);
    this.refreshSelectedProductTrackables(this.cartProducts[detailsIndex]);
    this.toastService.showSuccessToast('success', 'Trackable code added to selected product');
  }

  // onRemoveSelectedTrackable(newValue: any) {
  //   this.cartProducts.filter((x : any) => x.ProductVariantID === this.selectedRowForDialogs.ProductVariantID &&
  // x.ProductID === this.selectedRowForDialogs.ProductID && x.CartDetailID === this.selectedRowForDialogs.CartDetailID)
  // .forEach(element => {
  //     element = this.selectedRowForDialogs;
  //     this.OnChangeText(element);
  //     this.refreshSelectedProductTrackables(element);
  //   });
  // }

  onRemoveSelectedTrackable(newValue: any) {
    let removed = false;
    let selectedtrackables : any;
    const detailsIndex = this.cartProducts.findIndex((x : any) => x.ProductVariantID === this.selectedRowForDialogs.ProductVariantID &&
      x.ProductID === this.selectedRowForDialogs.ProductID && x.CartDetailID === this.selectedRowForDialogs.CartDetailID);
    if (this.cartProducts.length > 0) {
      selectedtrackables = this.cartProducts.filter((x : any) => x.ProductVariantID === this.selectedRowForDialogs.ProductVariantID &&
        x.ProductID === this.selectedRowForDialogs.ProductID && x.CartDetailID === this.selectedRowForDialogs.CartDetailID).shift();
      if (!(selectedtrackables + '' === 'undefined' || selectedtrackables + '' == undefined || selectedtrackables === null)) {
        const i = selectedtrackables.TrackableProductsSaleDetails.findIndex(((obj : any) => obj.TrackableCode === newValue));
        if (i != null) {
          selectedtrackables.TrackableProductsSaleDetails.splice(i, 1);
          removed = true;
        }
        if (removed) {
          // const detailsIndex = this.cartProducts.findIndex((x : any) => x.ProductVariantID === this.selectedRowForDialogs.ProductVariantID &&
          // x.ProductID === this.selectedRowForDialogs.ProductID && x.CartDetailID === this.selectedRowForDialogs.CartDetailID);
          this.cartProducts[detailsIndex].TrackableProductsSaleDetails = selectedtrackables.TrackableProductsSaleDetails;

          this.cartProducts[detailsIndex].Quantity -= 1;
          this.OnChangeText(this.cartProducts[detailsIndex]);
          this.refreshSelectedProductTrackables(this.cartProducts[detailsIndex]);
          this.toastService.showInfoToast('Info', 'Trackable code removed from selected product');

        }
        else {
          this.toastService.showInfoToast('Info', 'No trackable code found to remove for this product');
        }
      }

      else {
        for (let i = 0; i < this.trackables.length; i++) {
          if (this.trackables[i]['TrackableCode'] === newValue) {
            this.trackables.splice(i, 1);
            removed = true;
            break;
          }
        }

        if (removed) {
          this.cartProducts[detailsIndex].TrackableProductsSaleDetails = selectedtrackables.TrackableProductsSaleDetails;

          this.cartProducts[detailsIndex].Quantity -= 1;
          this.OnChangeText(this.cartProducts[detailsIndex]);
          this.refreshSelectedProductTrackables(this.cartProducts[detailsIndex]);
          this.toastService.showInfoToast('Info', 'Trackable code removed from selected product');
        }
        else {
          this.toastService.showInfoToast('Info', 'No trackable code found to remove for this product');
        }
      }
    }
    else {
      for (let i = 0; i < this.trackables.length; i++) {
        if (this.trackables[i]['TrackableCode'] === newValue) {
          this.trackables.splice(i, 1);
          removed = true;
          break;
        }
      }

      if (removed) {
        this.cartProducts[detailsIndex].TrackableProductsSaleDetails = selectedtrackables.TrackableProductsSaleDetails;

        this.cartProducts[detailsIndex].Quantity -= 1;
        this.OnChangeText(this.cartProducts[detailsIndex]);
        this.refreshSelectedProductTrackables(this.cartProducts[detailsIndex]);
        this.toastService.showInfoToast('Info', 'Trackable code removed from selected product');
      }
      else {
        this.toastService.showInfoToast('Info', 'No trackable code found to remove for this product');
      }
    }


  }

  //#endregion

  //#region not implimented yet

  ClosePaymentPopup() {

    this.displayAddPaymentPopup = false;
    this.paidPayment = this.payment;
    if (this.customerPreviousBalance) {
      let previousBalance = this.customerPreviousBalance.split('€').join('');
      previousBalance = previousBalance.split(' ').join('');
      this.customerCurrentBalance = ((Number(previousBalance) + Number(this.grandTotal)) - Number(this.payment)).toFixed(2);
    }
  }

  ValidateSaleSaveDetails() {
    if (!this.selectedOrderBy) {
      this.toastService.showErrorToast('Error', 'please provide order by');
      return false;
    }
    if (!this.selectedDeliverTo) {
      this.toastService.showErrorToast('Error', 'please provide deliver to');
      return false;
    }
    if (!this.selectedPaymentCondition) {
      this.toastService.showErrorToast('Error', 'please provide payment condition');
      return false;
    }
    if (!this.selectedDeliveryMethod) {
      this.toastService.showErrorToast('Error', 'please provide delivery method');
      return false;
    }
    if (!this.selectedDeliveryAddress) {
      this.toastService.showErrorToast('Error', 'please provide delivery address');
      return false;
    }
    // if (this.PaymentType === 'Cash') {
    //   if (this.payment < 1) {
    //     this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Please add payment greater than 0');
    //     this.
    //     return false;
    //   }
    // }
    // else {
    if (!this.selectedPaymentCondition) {
      this.toastService.showErrorToast('Error', 'please provide payment condition');
      return false;
    }

    // }
    if (this.cartProducts === null || this.cartProducts.length === 0) {
      this.toastService.showErrorToast('Error', 'Please add products to cart');
      return false;
    }
    // if (this.payment > this.grandTotal) {
    //   this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Entered payment is more than grand total');
    //   return false;
    // }

    return true;

  }

  

ValidateCaptcha(newValue: any) {
  this.isCaptchaDisplayed = false;
  this.modalCaptchaComponent.close();
  // console.log(newValue.IsDone);
  this.isCapchaValidated = newValue.IsDone;
  if(this.isCapchaValidated)
  {
if(this.ActionType==1)
    this.onClickPaymentPasswordSubmit();
  }
}

close() {
  this.isCaptchaDisplayed = false;
  this.isCapchaValidated =  false;
  this.modalCaptchaComponent.close();
}

openCaptcha(){
  this.firstNumber = randomNumber.generate(1);
  this.secondNumber = randomNumber.generate(1);
  this.isCaptchaDisplayed = true;
  this.modalCaptchaComponent.open();

}


  async onClickPaymentPasswordSubmit() {
    if (this.ActionButtonType === 1) {
      await this.AddSale(false, false);
    }
    else if (this.ActionButtonType === 2) {
      await this.AddSale(false, true);
    }
    else if (this.ActionButtonType === 3) {
    }
  }


  async AddSale(isB: boolean, isPrintable: boolean) {
    
    if (isPrintable) {
      this.ActionButtonType = 2;
    }
    else {
      this.ActionButtonType = 1;
    }

    if (!this.ValidateSaleSaveDetails()) {
      return;

    }
    this.payment = 0;
    // if (!this.payment) {
    //   this.payment = 0;
    // }

    // if ((this.password === '' || this.password == undefined || this.password === null) && (this.PaymentType === 'Cash')) {
    //   this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Please specify password');

    //   this.payment = Number(this.grandTotal);
    //   this.displayAddPaymentPopup = true;
    //   return;
    // }

    // else if((this.PaymentType === 'Cash') && (this.password != '')) {
    //   //if (this.validatePassword()){ return; }
    //   const res = await this.validatePassword(1, this.password, (this.selectedOrderBy.value === '1') ?
    // this.grandTotal : this.payment, this.selectedOrderBy.value);
    //   if (!res) { return; }
    // }

    
    if(!this.isCapchaValidated)
    {
      this.openCaptcha();
      this.ActionType =1;
      return;
    }
    
    this.IsSpinner = true;
    const typeId = 1;


    let detail;
    let productText;
    let isInvoiceCreated;
    let isTraceable;
    let isRefundable;

    const saleDetails = new Array();
    let product;
    let quantity;
    let unitPrice;
    let discount;
    let subtotal;
    let grandTotal;
    for (const item of this.cartProducts) {
      productText = item.selectedProductCart.label;
      product = productText.split('(')[0];
      quantity = item.Quantity;
      unitPrice = item.UnitPrice;
      discount = item.DiscVal;
      subtotal = (quantity * unitPrice);
      grandTotal = subtotal - discount;
      detail = {
        // DetailsID: item.CartDetailsID,
        ID: 0,
        Product: product,
        ProductVariantID: item.ProductVariantID,
        Quantity: quantity,
        dTotalAmount: grandTotal,
        dTotalDiscount: Number(discount),
        TaxAmount: 0,
        TaxPer: 0,
        dTotalValue: subtotal,
        dTotalUnitValue: unitPrice,
        TrackableProductsSaleDetails: item.TrackableProductsSaleDetails,
        // SaleDetailNonTrackableLocations: item.SaleDetailNonTrackableLocations
      };
      if (detail.TrackableProductsSaleDetails.length > 0) {
        detail.TrackableProductsSaleDetails.forEach((x : any) => { x.ID = 0; });
      }
      // if(detail.SaleDetailNonTrackableLocations.length>0)
      // {
      //   detail.SaleDetailNonTrackableLocations.forEach((x : any) => { x.ID=0 });
      // }
      saleDetails.push(detail);
    }


    const discoutPercentage = (this.totalDiscount / this.subTotal) + this.totalDiscount;

    if (this.selectedOrderBy.value === '1') {
      this.payment = this.grandTotal;
    } else {
      const remainingAmount = this.grandTotal - this.payment;
      // if ((remainingAmount + this.customerCurrentBalance) > this.creditlimit) {
      //   this.notificationService.notify(NotificationEnum.ERROR, 'Error', 'Remaining amount (including current balance of selected customer) is greater than credit limit.');
      //   return;
      // }
    }

    // Delete Sale Details if exists already
    if (this.PerfomaSaleID > 0) {
      this.DeleteSaleDetails();
    }

    const params = {
      ID: 0,
      CustomerID: this.selectedOrderBy.value,
      Customer: this.selectedOrderBy.label,
      DeliveredToID: this.selectedDeliverTo.value,
      DeliveredTo: this.selectedDeliverTo.label,
      DeliveryAddressID: this.selectedDeliveryAddress,
      InvoiceAddressID: this.selectedOrderByAddress,
      sRemarks: this.remarks,
      dtDate: this.deliverDate,
      SaleDate: this.orderDate,
      PaymentConditionID: this.selectedPaymentCondition.value,
      ShippingMethodID: this.selectedDeliveryMethod.value,
      ShippingCost: this.shipmentCost,
      dTotalPaidValue: this.payment,
      dDiscountValueString: this.customerCurrentBalance,
      CustomerCreditLimit: this.creditlimit,
      // Password: this.password,
      PaymentModeID: 1,
      // isB: isB,
      PerfomaSaleDetails: saleDetails,
      IsInvoiceCreated: isInvoiceCreated,
      IsTraceable: isTraceable,
      IsRefundable: isRefundable,
      dTotalSaleValue: Number(this.grandTotal) - this.shipmentCost,
      dDiscountValue: Number(this.totalDiscount),
      dDiscountPercentage: Number(discoutPercentage),
      CreatedByUserID: this.usermodel.ID,
      OutletID: this.usermodel.OutletID,
      TypeID: typeId,
      Type: 'Angular Ui',
      IsInComingOrder: false,
      CashRegisterHistoryID: Number(this.storageService.getItem('CashRegisterHistoryID')),
    };
    this.deliverToName = this.selectedDeliverTo.label;
    this.selectedDeliveryAddressID = this.deliverToAddress;


    this.apiService.AddPerfomaSale(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.IsSpinner = false;
      if (response.ResponseCode === 0) {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        if (isPrintable) {
          this.PrintingInvoiceFuntion(response.Sale.ID);
        }
        else {
          this.router.navigate(['/sale/performainvoice-index']);
        }
      }
      else {
        this.toastService.showErrorToast('Error', response.message);
      }
    }, (err: any) => {
      this.toastService.showErrorToast('Error', err.message);
    });

  }
  PrintingInvoiceFuntion(id : any) {
    const req = { ID: id };
    this.apiService.GetPackingSlipByID(req).pipe(untilDestroyed(this)).subscribe((response1: any) => {
      if (response1.ResponseCode === 0) {
        this.printingData = response1.PackingSlip;
        const saleDetails : any = [];
        this.printingData.txtSubTotal = response1.PackingSlip.PackingSlipDetails.reduce((sum : any, current : any) => sum + current.dTotalValue, 0);
        this.printingData.txtTotalDiscount = response1.PackingSlip.PackingSlipDetails.reduce((sum : any, current : any) =>
          sum + current.dTotalDiscount, 0);
        this.printingData.txtTotal = (this.printingData.txtSubTotal - this.printingData.txtTotalDiscount +
          response1.PackingSlip.ShippingCost).toFixed();

        response1.PackingSlip.PackingSlipDetails.forEach((item : any) => {
          const locs = item.Location.split(',');
          if (locs > 1) {
            let i = 0;
            locs.forEach((item1 : any) => {
              if (i === 0) {
                const row = {
                  ProductVariantID: item.ProductVariantID,
                  ArticalNumber: item.ArticalNumber,
                  ProductName: item.ProductName,
                  Location: item1.trim(),
                  Quantity: item.Quantity,
                  dTotalDiscount: item.dTotalDiscount,
                  dTotalUnitValue: item.dTotalUnitValue,
                  dTotalValue: (item.dTotalValue - item.dTotalDiscount).toFixed(2)
                };
                saleDetails.push(row);
              }
              else {
                const row1 = {
                  ProductVariantID: '-',
                  ArticalNumber: '-',
                  ProductName: '-',
                  Location: item1.trim(),
                  Quantity: '-',
                  dTotalDiscount: '-',
                  dTotalUnitValue: '-',
                  dTotalValue: '-',
                };
                saleDetails.push(row1);
              }
              i++;
            });
          }
          else {

            const row2 = {
              ProductVariantID: item.ProductVariantID,
              ArticalNumber: item.ArticalNumber,
              ProductName: item.ProductName,
              Location: item.Location.trim(),
              Quantity: item.Quantity,
              dTotalDiscount: item.dTotalDiscount,
              dTotalUnitValue: item.dTotalUnitValue,
              dTotalValue: (item.dTotalValue - item.dTotalDiscount).toFixed(2)
            };
            saleDetails.push(row2);
          }
        });

        response1.PackingSlip.PackingSlipDetails = saleDetails;
        this.Print();
      }
      else {
        this.toastService.showErrorToast('Error', response1.message);
      }
    });
  }
  Print() {
    setTimeout(() => {


      let printContents;
      let popupWin;

      printContents = document.getElementById('printA4-sale-invoice')?.innerHTML ?? "";
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      if(popupWin) {
        popupWin.document.open();
        popupWin.document.write(`
          <html>
            <head>
              <title>Report</title>
              <style>
              //........Customized style.......
              .sty{
                'width: 67%;color: #000; float: left;text-align: left; margin: 0;font-size: 12px; font-weight: 600;padding-right: 10px;
              }
              </style>
            </head>
            <body onload='window.print();self.close();'>${printContents}</body>
          </html>`);
        popupWin.document.close();
      }
    }, 500);
  }


  DeleteSaleDetails() {

    const params = {
      ID: this.PerfomaSaleID
    };
    this.apiService.DeleteOpenSale(params).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
      }
      else {
        this.toastService.showErrorToast('Error', response.message);
      }
    }
    );
  }
  async validatePassword(type : any, password : any, amount : any, UsedFor : any) {
    if (this.usermodel.ID === 1)// Check Password
    {
      const params = {
        Password: password
      };
      const response = await this.apiService.CheckReceivedPaymentPassword(params).pipe(untilDestroyed(this)).toPromise();
      if (response.ResponseCode !== 0) {
        this.toastService.showErrorToast('Error', 'Wrong password entered to add payment.');
        return false;
      }
      else {
        return true;
      }

    }
    else {
      const params = {
        VerificationCode: password,
        Type: type,
        UserID: this.usermodel.ID,
        Amount: amount,
        UsedFor: null
      };

      const response = await this.apiService.CheckValidationCode(params).toPromise();
      if (response.ResponseCode !== 0) {
        this.toastService.showErrorToast('Error', 'Wrong password entered to add payment.');
        return false;
      }
      else {
        return true;
      }
    }
  }

  //#endregion

  // Close button function
  Close() {
    this.router.navigate(['/sale/performainvoice-index']);
  }
  mapNonTrackablesLocations(orders : any) {
    const quantities = orders.filter((i : any) => i.Quantity !== 0).map((order : any) => order.locationName + ' (Qty = ' + order.Quantity + ') ');

    return quantities.toString();
  }

  async openModal() {
    return await this.modalComponent.open();
  }
  
  addTmpProducts(productID: any) {
    var index = this.AllProductListwithDiscountForSelection.findIndex((x: any)=>x.ProductID==productID);
    const tmpProduct = this.AllProductListwithDiscountForSelection[index];
    if(index > -1) {
      this.tmpSelectedProductList.push(tmpProduct);
      this.AllProductListwithDiscountForSelection.splice(index, 1);
      // this.AllProductListwithDiscountForSelection = this.AllProductListwithDiscountForSelection.slice();
    }
  }

  removeTmpProducts(productID: any) {
    var index = this.tmpSelectedProductList.findIndex((x: any)=>x.ProductID==productID);
    const tmpProduct = this.tmpSelectedProductList[index];
    if(index > -1) {
      this.AllProductListwithDiscountForSelection.push(tmpProduct);
      this.tmpSelectedProductList.splice(index, 1);
      // this.AllProductListwithDiscountForSelection = this.AllProductListwithDiscountForSelection.slice();
    }
  }
}

