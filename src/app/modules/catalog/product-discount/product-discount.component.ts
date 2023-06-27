import { Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
//import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
//import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { GroupDiscountProductWise } from 'src/app/Helper/models/GroupDiscountProdutWise';
import { UpdateStatus } from 'src/app/Helper/models/UpdateStatus';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';


import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';

import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { ToastService } from 'src/app/modules/shell/services/toast.service';
import { customSearchFn } from 'src/app/shared/constant/product-search';
import { StorageService } from 'src/app/shared/services/storage.service';
import { UserModel } from 'src/app/Helper/models/UserModel';


@Component({
  selector: 'app-product-discount',
  templateUrl: './product-discount.component.html',
  styleUrls: ['./product-discount.component.scss']
})
export class ProductDiscountComponent implements OnInit, OnDestroy {
  @ViewChild("btn_open_modal_add_discount") btn_open_modal_add_discount: ElementRef;
  @ViewChild("btn_open_modal_products") btn_open_modal_products: ElementRef;

  AllProductDiscountList: GroupDiscountProductWise[] = [];
  selectedProductDiscount: GroupDiscountProductWise;
  public productDiscount: GroupDiscountProductWise;
  updateStatusModel: UpdateStatus;
  PaginationData: any = [];
 disabledProductDD = false;
  valCheck = '';
  ProductSearch = '';
  selectedProduct: any;

  items: any[];
  ProductList: any[];
  filteredProductList: any[];
  IsSpinner = false;
  IsAdd = false;
  loading: boolean;
  first = 0;
  rows = 25;
  alwaysShowPaginator = true;
  // last = 25;
  totalRecords = 0;
  groupDiscountID = 0;
  usermodel: UserModel;

  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'ID' },
  ];
  columns: Columns[] = [

    { field: 'IsActive', header: 'Status', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON },
    { field: 'Product', header: 'Product', sorting: 'Product', placeholder: '' },
    { field: 'MinDiscountPerc', header: 'Min Disc.', sorting: 'MinDiscountPerc', placeholder: '' },
    { field: 'MaxDiscountPerc', header: 'Max Disc.', sorting: 'MaxDiscountPerc', placeholder: '' },

  ];

  globalFilterFields = ['MaxDiscountPerc', 'MaxDiscountPerc', 'Product'];
  rowsPerPageOptions = [10, 20, 50, 100];
  ProductData: any[] = [];
  dataFunc: any = customSearchFn;
  IsOpenProductDialog = false;
  productsColumn: Columns[] = [
    { field: 'Product', header: 'Product', sorting: 'Product', placeholder: '' },
    { field: 'Color', header: 'Color', sorting: 'Color', placeholder: '' },
    { field: 'PurchasePrice', header: 'PurchasePrice', sorting: 'PurchasePrice', placeholder: '' }
  ];
  isLoadingProducts = false;
  constructor(
    private toastService: ToastService,
    private route: ActivatedRoute, 
    private apiService: vaplongapi, 
    private storageService: StorageService,
    private cdr: ChangeDetectorRef) {
    this.groupDiscountID = this.route.snapshot.params.id;
    this.usermodel = this.storageService.getItem('UserModel');
    this.productDiscount = new GroupDiscountProductWise();
  }

  ngOnInit(): void {
    this.GetAllProductDiscountList(); // Get All Shop Categories List On Page Load
    this.BindProductDiscountDropdownList(); // Bind Autocomplete

  }
  ngOnDestroy(): void {
  }
  emitAction(event: any) {
    if (event.forLabel === 'Update') {
      this.EditProductDiscount(event.selectedRowData);
    }

  }
  GetAllProductDiscountList() // Get All Product Discount Method Get Data from Service
  {
    const param = {
      ID: this.groupDiscountID
    };
    this.IsSpinner = true;
    this.apiService.GetAllProductsByDiscountID(param).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.IsSpinner = false;
      if (response.ResponseText === 'success') {
        this.AllProductDiscountList = response.AllGroupDiscountProductWise;
        this.totalRecords = response.AllGroupDiscountProductWise.length;
      }
      else {
        
        this.toastService.showErrorToast('Error', response.ResponseText);
        console.log('internal server error ! not getting api data');
      }
      this.cdr.detectChanges();
    },
    );

  }

  AddProductDiscount()// Open Add Product Discount Section
  {
    this.ResetFields();
    this.IsAdd = true;
    this.btn_open_modal_add_discount.nativeElement.click();
  }
  CloseAddSection()// Close Add New Product Discount Section
  {
    this.IsAdd = false;
    this.btn_open_modal_add_discount.nativeElement.click();

  }
  SaveUpdateProductDiscountDetails() {

    if (this.productDiscount.ID > 0)  // for Update
    {
      this.UpdateProductDiscount();
    }
    else {
      this.SaveProductDiscount(); // for save
    }


  }
  SaveProductDiscount() // Save Classification Method To Communicate API
  {
    this.productDiscount.ID = 0;
    this.productDiscount.DiscountGroupID = Number(this.groupDiscountID);
    this.productDiscount.ProductID = this.selectedProduct.value;
    this.productDiscount.CreatedByUserID = this.usermodel.ID;

    this.apiService.AddProducDiscount(this.productDiscount).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllProductDiscountList();
        this.IsAdd = false;
        this.btn_open_modal_add_discount.nativeElement.click();

      }
      else {
        this.toastService.showErrorToast('Error', response.ResponseText);
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }
  UpdateProductDiscount() // Update Product Discount Method To Communicate API
  {
    let discountlist : GroupDiscountProductWise[]= [];
    discountlist.push(this.productDiscount);

    const param = {
      CreatedByUserID : this.usermodel.ID,
      UpdatedList :discountlist,
    }
    
    this.apiService.UpdateProductDiscount(param).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseCode == 0) {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllProductDiscountList();
        this.IsAdd = false;
        this.btn_open_modal_add_discount.nativeElement.click();
        this.disabledProductDD=false; 
      }
      else {
        this.toastService.showErrorToast('Error', response.ResponseText);
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }

  EditProductDiscount(productDiscount: GroupDiscountProductWise) {
    this.productDiscount = productDiscount;
    let product = this.ProductData.find(x=>x.ProductID==productDiscount.ProductID);
    this.selectedProduct = { value:product.ProductID,label:product.Product };
    this.IsAdd = true;
    this.btn_open_modal_add_discount.nativeElement.click();
    this.disabledProductDD=true; 
  }
  UpdateProductDiscountStatus(productDiscount: any) // Update Product Discount Status Method To Communicate API
  {
    
    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = productDiscount.ID;
    this.updateStatusModel.Status = productDiscount.IsActive;
    this.updateStatusModel.UpdatedByUserID = productDiscount.CreatedByUserID;
    this.apiService.UpdateProductDiscountStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllProductDiscountList();
        

      }
      else {
        
        this.toastService.showErrorToast('Error', response.ResponseText);
        console.log('internal server error ! not getting api data');
      }
    },
    );
  }
  // search(event: any) {
  //   let filtered: any[] = [];
  //   let query = event.query;
  //   for (let i = 0; i < this.ProductList.length; i++) {
  //     let product = this.ProductList[i];
  //     if (product.label.toLowerCase().indexOf(query.toLowerCase()) == 0) {
  //       filtered.push(product);
  //     }
  //   }

  //   this.filteredProductList = filtered;
  //   console.log(this.filteredProductList);
  // }

  BindProductDiscountDropdownList() {
    this.ProductList = [];
    this.isLoadingProducts = true;
    this.apiService.GetPurchaseProduct().pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.isLoadingProducts = false;
      if (response.ResponseText === 'success') {

        response.AllProductVariantList = response.AllProductVariantList.filter((x: any) => x.IsActive === true);
        this.ProductData = response.AllProductVariantList;
        for (const item of response.AllProductVariantList) {
          this.ProductList.push({
            value: item.ProductID,
            label: item.Product,
          });
        }
        this.filteredProductList = this.ProductList;

      }
      else {
        
        this.toastService.showErrorToast('Error', response.ResponseText);
        console.log('internal server error ! not getting api data');
      }
      this.cdr.detectChanges();
    },
    );

  }

  ResetFields() // Reset Object
  {
    this.productDiscount = new GroupDiscountProductWise();
  }
  OpenProductDialog() {
    this.IsOpenProductDialog = true;
    this.btn_open_modal_products.nativeElement.click();
  }
  selectValue(newValue: any) {
    this.IsOpenProductDialog = false;
    this.btn_open_modal_products.nativeElement.click();
    this.btn_open_modal_add_discount.nativeElement.click();
    const obj = {
      value: newValue.ID,
      label: newValue.Product
    };
    this.selectedProduct = obj;
  }

}
