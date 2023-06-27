import { vaplongapi } from './../../../Service/vaplongapi.service';
import { UpdateStatus } from './../../../Helper/models/UpdateStatus';
import { Category } from './../../../Helper/models/Category';
import { Component, OnDestroy, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
// //import { Table } from 'primeng/table';
// //import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/api';


import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
// import { ToastService } from '../../shell/services/toast.service';
// 
import { CatalogPermissionEnum } from 'src/app/shared/constant/catalog-permission';
import { ToastService } from '../../shell/services/toast.service';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styles: []
})
export class CategoryComponent implements OnInit, OnDestroy {
  CatalogPermission = CatalogPermissionEnum;
  AllCategoryList: Category[] = [];
  selectedCategory: Category;
  category: Category;
  updateStatusModel: UpdateStatus;
  PaginationData: any = [];

  valCheck = '';
  ProductSearch = '';
  selectedClassificationID: any = null;
  selectedDepartmentID: any = null;

  items: any[];
  ClassificationDropdown: any[];
  DepartmentDropdown: any[];
  IsSpinner = false;
  IsAdd = false;
  loading: boolean;
  first = 0;
  rows = 10;
  alwaysShowPaginator = true;
  // last = 10;
  totalRecords = 0;


  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-pencil-alt', dependedProperty: 'ID', permission: CatalogPermissionEnum.UpdateCategory }
  ];
  columns: Columns[] = [

    { field: 'IsActive', header: 'Status', sorting: '', placeholder: '', type: TableColumnEnum.TOGGLE_BUTTON, translateCol: 'SSGENERIC.STATUS' },
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'Department', header: 'Department', sorting: 'Department', placeholder: '', translateCol: 'SSGENERIC.DEPARTMENT' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '' , translateCol: 'SSGENERIC.DESCRIPTION'},

  ];
  globalFilterFields = ['Name', 'Department', 'Description'];
  rowsPerPageOptions = [10, 20, 50, 100];

  @ViewChild('btn_open_modal_add_category') btn_open_modal_add_category: ElementRef;

  constructor(private apiService: vaplongapi, 
    // private toastService: ToastService
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {

    this.category = new Category();
  }

  ngOnInit(): void {
    this.GetAllCategoriesList();
    this.GetClassificationList();

  }
  ngOnDestroy(): void {
  }
  emitAction(event: any) {
    this.EditCategory(event.selectedRowData);
  }
  GetAllCategoriesList() // Get All Categories Method Get Data from Service
  {
    this.IsSpinner = true;
    this.apiService.GetAllCategories().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.AllCategoryList = response.AllCategoryList;
        this.totalRecords = response.AllCategoryList.length;
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

  GetClassificationList() {
    this.ClassificationDropdown = [];

    this.apiService.GetClassificationDropList().pipe(untilDestroyed(this)).subscribe((response: any) => {
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
        }

      }
      else {
        console.log('internal serve Error', response);
      }
      this.cdr.detectChanges()
    }
    );
  }

  GetDepartmentByClassificationID(classificationId: any) {
    this.IsSpinner = true;
    const id = {
      ID: classificationId
    };
    this.DepartmentDropdown = [];
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
        }
        else {
          this.selectedDepartmentID = null;
        }
        console.log('aaaaaaa', this.selectedDepartmentID);
      }
      else {
        console.log('internal serve Error', response);
      }
      this.cdr.detectChanges();
    });
  }

  AddCategory() // Open Add New Category Section
  {
    this.ResetFields();
    this.IsAdd = true;
    this.btn_open_modal_add_category.nativeElement.click();
  }
  CloseAddSection() // Close Add New Category Section
  {
    this.IsAdd = false;
    this.btn_open_modal_add_category.nativeElement.click();
  }

  SaveUpdateCategoryDetails() {
    if (this.category.ID > 0) {
      this.UpdateCategory();
    }
    else {
      this.SaveCategory();
    }
  }

  SaveCategory() // Save Category Method To Communicate API
  {
    this.category.ClassificationID = Number(this.selectedClassificationID);
    this.category.DepartmentID = Number(this.selectedDepartmentID);
    if(this.category.DepartmentID <= 0) {
      this.toastService.showErrorToast("Error", "Select the Department!");
      return;
    }
    this.IsSpinner = true;
    this.apiService.AddCategory(this.category).pipe(untilDestroyed(this)).subscribe((response: any) => {
        this.IsSpinner = false;
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllCategoriesList();
        this.IsAdd = false;
        this.btn_open_modal_add_category.nativeElement.click();


      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);
      }
      this.cdr.detectChanges();
    },
    );
  }

  EditCategory(category: Category) {

    this.category = category;
    this.selectedClassificationID = this.category.ClassificationID?.toString() ?? "";
    this.GetDepartmentByClassificationID(this.selectedClassificationID); // Bind Department dropdownlist 
    this.selectedDepartmentID = this.category.DepartmentID?.toString() ?? "";
    this.IsAdd = true;
    this.btn_open_modal_add_category.nativeElement.click();
  }

  UpdateCategory() // Update Category Method To Communicate API
  {
    this.IsSpinner = true;
    this.category.ClassificationID = Number(this.selectedClassificationID);
    this.category.DepartmentID = Number(this.selectedDepartmentID);
    this.apiService.UpdateCategory(this.category).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllCategoriesList();
        this.IsAdd = false;
        this.btn_open_modal_add_category.nativeElement.click();
        this.IsSpinner = false;

      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);

      }
    },
    );
  }

  UpdateCategoryStatus(category: any) // Update Category Status Method To Communicate API
  {
    this.IsSpinner = true;

    this.updateStatusModel = new UpdateStatus();
    this.updateStatusModel.ID = category.ID;
    this.updateStatusModel.Status = !category.IsActive;
    this.updateStatusModel.UpdatedByUserID = category.CreatedByUserID;
    this.apiService.UpdateCategoryStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllCategoriesList();
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

  ResetFields() // Reset Object
  {
    this.category = new Category();
  }


}
