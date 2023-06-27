import { Component,OnDestroy, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
// //import { Table } from 'primeng/table';
// import { LazyLoadEvent, MenuItem, SelectItem} from 'primeng/api';
// import { TranslateService } from '@ngx-translate/core';
import { Classification } from '../../../Helper/models/Classification';
import { UpdateStatus } from '../../../Helper/models/UpdateStatus';
import { vaplongapi } from '../../../Service/vaplongapi.service';


import { Columns } from 'src/app/shared/model/columns.model';
import { GenericMenuItems } from 'src/app/shared/model/genric-menu-items.model';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
// 
import { TableColumnEnum } from 'src/app/shared/Enum/table-column.enum';
import { ToastService } from '../../shell/services/toast.service';
// import { ToastService } from '../../shell/services/toast.service';

@Component({
  selector: 'app-classification',
  templateUrl: './classification.component.html',
  styles: [
  ],
})
export class ClassificationComponent implements OnInit,OnDestroy {

  // 
  AllClassificationList: Classification[]=[];
  selectedClassification: Classification;
  public classification :Classification;
  updateStatusModel:UpdateStatus;
  PaginationData: any = [];
  
  valCheck = '';
  ProductSearch = '';

  items: any[];
  IsSpinner = false;
  IsAdd = false;
  loading: boolean;
  first = 0;
  rows = 10;
  alwaysShowPaginator = true;
  // last = 10;
  totalRecords = 0;

  
  genericMenuItems: GenericMenuItems[] = [
    { label: 'Update', icon: 'fas fa-pencil-alt',  dependedProperty: 'ID' }
  ];
  columns: Columns[] = [
    
    { field: 'IsActive', header: 'Status', sorting: '', placeholder: '',type: TableColumnEnum.TOGGLE_BUTTON , translateCol: 'SSGENERIC.STATUS'},
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '', translateCol: 'SSGENERIC.NAME' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '', translateCol: 'SSGENERIC.DESCRIPTION' },

  ];
  globalFilterFields = ['Name','Description'];
  rowsPerPageOptions = [10, 20, 50, 100]

  @ViewChild('btn_open_modal_add_classification') btn_open_modal_add_classification: ElementRef;

  constructor(private apiService: vaplongapi, 
    // private toastService: ToastService
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {
    this.classification = new Classification();
  }


  ngOnInit(): void {
    this.GetAllClassificationList(); //Get All Classification List On Page Load
  }
  ngOnDestroy(): void {
  }
  emitAction(event: any) {
    this.EditClassification(event.selectedRowData);
  }
  GetAllClassificationList() //Get All Classification Method Get Data from Service 
  {
    this.IsSpinner=true;

    this.apiService.GetAllClassification().pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
          
         this.AllClassificationList = response.AllClassificationList;
         this.totalRecords=response.AllClassificationList.length;
         this.IsSpinner = false;
        this.cdr.detectChanges();
      }
      else {
        this.IsSpinner = false;
        console.log('internal server error ! not getting api data');
      }
    },
    );
  
  }

  AddClassification()//Open Add New Classification Section
  {
    this.ResetFields();
    this.IsAdd=true;
    this.btn_open_modal_add_classification.nativeElement.click();
  }
  CloseAddSection()//Close Add New Classification Section
  {
    this.IsAdd=false;
    this.btn_open_modal_add_classification.nativeElement.click();
    
  }
  SaveUpdateClassificationDetails()
  {

   if(this.classification.ID > 0)  //for Update
   {
     this.UpdateClassification();
   }
   else
   {
     this.SaveClassification(); //for save
   }


  }
  SaveClassification() // Save Classification Method To Communicate API
  {
    this.IsSpinner=true;
    this.apiService.AddClassifications(this.classification).pipe(untilDestroyed(this)).subscribe((response: any) => {
      
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllClassificationList();
        this.IsSpinner = false;
         this.IsAdd=false;
         this.btn_open_modal_add_classification.nativeElement.click();
  
      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);
      }
    },
    );
  }
  UpdateClassification() // Update Classification Method To Communicate API
  {
    this.IsSpinner=true;
    this.apiService.UpdateClassifications(this.classification).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllClassificationList();
        this.IsSpinner = false;
         this.IsAdd=false;
  
         this.btn_open_modal_add_classification.nativeElement.click();
      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);
      }
    },
    );
  }

  EditClassification(classification:Classification) {
    this.classification=classification;
    this.IsAdd=true;
    this.btn_open_modal_add_classification.nativeElement.click();
   }
  UpdateClassificationStatus(classification:any) // Update Classification Status Method To Communicate API
  { 
    this.IsSpinner = true;
    this.updateStatusModel= new UpdateStatus();
    this.updateStatusModel.ID=classification.ID;
    this.updateStatusModel.Status=!classification.IsActive;
    this.updateStatusModel.UpdatedByUserID=classification.CreatedByUserID;
    this.apiService.UpdateClassificationStatus(this.updateStatusModel).pipe(untilDestroyed(this)).subscribe((response: any) => {
      if (response.ResponseText === 'success') {
        this.toastService.showSuccessToast('Success', response.ResponseText);
        this.GetAllClassificationList();
        this.IsSpinner = false;
  
      }
      else {
        this.IsSpinner = false;
        this.toastService.showErrorToast('Error', response.ResponseText);
        
      }
    },
    );
  }

  ResetFields() // Reset Object
  {
    this.classification= new Classification(); 
  }

}
