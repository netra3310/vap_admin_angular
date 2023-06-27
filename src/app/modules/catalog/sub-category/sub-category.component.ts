import { Component, OnDestroy, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
//import { Table } from 'primeng/table';
////import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';
import { SubCategory } from '../../../Helper/models/SubCategory';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';


import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';

import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { ToastService } from '../../shell/services/toast.service';
import { CatalogPermissionEnum } from 'src/app/shared/constant/catalog-permission';


@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styles: []
})
export class SubCategoryComponent implements OnInit, OnDestroy {
  CatalogPermission = CatalogPermissionEnum;
  AllSubCategoryList: SubCategory[] = [];
  selectedSubCategory: SubCategory;
  subCategory: SubCategory;
  updateStatusModel: UpdateStatus;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';
  selectedClassificationID: any = null;
  selectedDepartmentID: any = null;
  selectedCategoryID: any = null;

  items: any[];
  ClassificationDropdown: any[];
  DepartmentDropdown: any[];
  CategoryDropdown: any[];
  IsSpinner = false;
  IsAdd = false;
  loading: boolean;
  first = 0;
  rows = 25;
  alwaysShowPaginator = true;
  // last = 25;
  totalRecords = 0;

  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'ID', permission: CatalogPermissionEnum.UpdateSubcategory }
  ];
  columns: Columns[] = [

    { field: 'IsActive', header: 'Status', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'Category', header: 'Category', sorting: 'Category', placeholder: '', translateCol: 'SSGENERIC.CATEGORY' },
    { field: 'Department', header: 'Department', sorting: 'Department', placeholder: '', translateCol: 'SSGENERIC.DEPARTMENT' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' },

  ];
  globalFilterFields = ['Name', 'Category', 'Department', 'Description'];
  rowsPerPageOptions = [10, 20, 50, 100];

  @ViewChild('btn_open_modal_add_sub_category') btn_open_modal_add_sub_category: ElementRef;


  constructor(private apiService: vaplongapi, private toastService: ToastService,
    private cdr: ChangeDetectorRef) {
    this.subCategory = new SubCategory();
  }

  ngOnInit(): void {
    this.GetAllSubCategoriesList();
    this.GetClassificationList();

  }
  ngOnDestroy(): void {
  }
  emitAction(event: any) {
    this.EditSubCategory(event.selectedRowData);
  }
  GetAllSubCategoriesList() // Get All Sub Categories Method Get Data from Service 
  {
    this.IsSpinner = true;
    this.apiService.GetAllSubCategories().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {

        this.AllSubCategoryList = response.AllSubCategoryList;
        this.totalRecords = response.AllSubCategoryList.length;
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);
        console.log('internal server error ! not getting api data');
      }
      this.cdr.detectChanges();
    },
    );

  }
  // Get  Classification data for dropdownlist
  GetClassificationList() {
    this.ClassificationDropdown = [];
    this.IsSpinner = true;
    this.apiService.GetClassificationDropList().pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.IsSpinner = false;
      if (response.ResponseText === 'success') {
        for (let i = 0; i < response.DropDownData.length; i++) {
          this.ClassificationDropdown.push({
            value: response.DropDownData[i].ID,
            label: response.DropDownData[i].Name,
          });
        }
        if (this.ClassificationDropdown.length > 0) // set default value
        {
          this.selectedClassificationID = this.ClassificationDropdown[0].value;
          this.GetDepartmentByClassificationID(this.selectedClassificationID); // Bind Department dropdownlist 
        } else {
          this.selectedClassificationID = null;
          this.selectedCategoryID = null;
          this.selectedDepartmentID = null;
        }
      }
      else {
        console.log('internal serve Error', response);
      }
      
      this.cdr.detectChanges();
    }
    );
  }
  // Get  Department data by classification id for dropdownlist
  GetDepartmentByClassificationID(classificationId: any) {

    const id = {
      ID: classificationId
    };
    this.DepartmentDropdown = [];
    this.IsSpinner = true;
    this.apiService.GetDepartmentByClassificationID(id).pipe(untilDestroyed(this)).subscribe((response: any) => {
      this.IsSpinner = false;
      if (response.ResponseText === 'success') {

        for (let i = 0; i < response.DropDownData.length; i++) {
          this.DepartmentDropdown.push({
            value: response.DropDownData[i].ID,
            label: response.DropDownData[i].Name,
          });
        }

        if (this.DepartmentDropdown.length > 0) // set default value
        {
          this.selectedDepartmentID = this.DepartmentDropdown[0].value;
          this.GetCategoryByDepartmentID(this.selectedDepartmentID);
        } else {
          this.selectedDepartmentID = null;
          this.selectedCategoryID = null;
        }
      }
      else {
        console.log('internal serve Error', response);
      }
      this.cdr.detectChanges();
    });
  }
  // Get  Categories data by department id for dropdownlist
  GetCategoryByDepartmentID(DepartmentId: any) {

    // tslint:disable-next-line: prefer-const
    let id = {
      ID: DepartmentId
    };
    this.CategoryDropdown = [];
    this.IsSpinner = true;
    this.apiService.GetCategoryByDepartmentID(id).pipe(untilDestroyed(this)).subscribe((response) => {
      this.IsSpinner = false;
      if (response.ResponseText === 'success') {
        for (let i = 0; i < response.DropDownData.length; i++) {
          this.CategoryDropdown.push({
            value: response.DropDownData[i].ID,
            label: response.DropDownData[i].Name,
          });
        }
        if (this.CategoryDropdown.length > 0) {
          this.selectedCategoryID = this.CategoryDropdown[0].value;
        } else {
          this.selectedCategoryID = null;
        }

      }
      else {
        console.log('internal serve Error', response);
      }
      this.cdr.detectChanges();
    });
  }

  AddSubCategory()// Open Add New Sub Category Section
  {
    this.IsAdd = true;
    this.ResetFields();
    this.btn_open_modal_add_sub_category.nativeElement.click();
  }
  CloseAddSection()// Close Add New Sub Category Section
  {
    this.IsAdd = false;
    this.btn_open_modal_add_sub_category.nativeElement.click();
  }

  SaveUpdateSubCategoryDetails() {
    if (this.subCategory.ID > 0) {
      this.UpdateSubCategory();
    }
    else {
      this.SaveSubCategory();
    }
  }

  SaveSubCategory() // Save Sub Category Method To Communicate API
  {
    this.IsSpinner = true;
    this.subCategory.ClassificationID = Number(this.selectedClassificationID);
    this.subCategory.DepartmentID = Number(this.selectedDepartmentID);
    this.subCategory.CategoryID = Number(this.selectedCategoryID);
    this.subCategory.SeriesID = 0;
    this.apiService.AddSubCategory(this.subCategory).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllSubCategoriesList();
        this.IsSpinner = false;
        this.IsAdd = false;
        this.btn_open_modal_add_sub_category.nativeElement.click();

      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);

      }
    },
    );
  }

  EditSubCategory(subCategory: SubCategory) {
    this.subCategory = subCategory;
    this.selectedClassificationID = this.subCategory.ClassificationID?.toString() ?? "";
    this.selectedDepartmentID = this.subCategory.DepartmentID?.toString() ?? "";
    this.selectedCategoryID = this.subCategory.CategoryID?.toString() ?? "";
    this.IsAdd = true;
    this.btn_open_modal_add_sub_category.nativeElement.click();
  }

  UpdateSubCategory() // Update Sub Category Method To Communicate API
  {
    this.IsSpinner = true;
    this.subCategory.ClassificationID = Number(this.selectedClassificationID);
    this.subCategory.DepartmentID = Number(this.selectedDepartmentID);
    this.subCategory.SeriesID = 0;
    this.apiService.UpdateSubCategory(this.subCategory).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllSubCategoriesList();
        this.IsAdd = false;
        this.btn_open_modal_add_sub_category.nativeElement.click();
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);
      }
    },
    );
  }

  UpdateSubCategoryStatus(subCategory: any) // Update SubCategory Status Method To Communicate API
  {
    this.IsSpinner = true;

    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = subCategory.ID;
    this.updateStatusModel.Status = !subCategory.IsActive;
    this.updateStatusModel.UpdatedByUserID = subCategory.CreatedByUserID;
    this.apiService.UpdateSubCategoryStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllSubCategoriesList();
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);
      }
    },
    );
  }

  BindDepartment(event: any) // Bind Department On Onchange event off classification dropdownlist
  {
    this.GetDepartmentByClassificationID(event.value);
  }

  BindCategory(event: any) // Bind Category On Onchange event off department dropdownlist
  {
    this.GetCategoryByDepartmentID(event.value);
  }

  ResetFields() // Reset Object
  {
    this.subCategory = new SubCategory();
  }


}
