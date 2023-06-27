import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { UserModel } from '../../Helper/models/UserModel';
import { vaplongapi } from '../../Service/vaplongapi.service';
import { WishlistModel } from '../../Helper/models/WishlistModel';
import { StorageService } from 'src/app/shared/services/storage.service';
// import { ToastService } from 'src/app/modules/shell/services/toast.service';
import { ToastService } from 'src/app/modules/shell/services/toast.service';


@Component({
  selector: 'app-addwishlist-dialog',
  templateUrl: './addwishlist-dialog.component.html',
  styleUrls: ['./addwishlist-dialog.component.scss']
})
export class AddwishlistDialogComponent implements OnInit {

  @Input() ProductVariantID: number;
  @Input() ProductName: string;
  @Output() ReturnCall = new EventEmitter<{ IsDone: boolean }>();

  Remarks = '';
  Quantity = 1;

  usermodel: UserModel;


  constructor(
    private apiService: vaplongapi, private storageService: StorageService,
    // private toastService: ToastService
    private toastService : ToastService
    ) {

  }
  ngOnInit(): void {
    this.usermodel = this.storageService.getItem('UserModel');

  }
  CreateOrder() // Create InternalOrder Method To Communicate API
  {
    const internalOrder = new WishlistModel();
    internalOrder.ProductVariantID = this.ProductVariantID;
    internalOrder.Remarks = this.Remarks;
    internalOrder.Quantity = this.Quantity;
    internalOrder.CreatedByID = this.usermodel.ID;
    internalOrder.OutletID = this.usermodel.OutletID;
    this.apiService.AddWishlist(internalOrder).subscribe((response: any) => {
      if (response.ResponseCode === 0) {
        // this.notificationService.notify(NotificationEnum.SUCCESS, 'Success', 'order has been added successfully.');
        this.toastService.showSuccessToast('Success', 'order has been added successfully.');
        this.ReturnCall.emit({ IsDone: true });
      }
      else {
        // this.toastService.showErrorToast('Error', response.ResponseText);
        this.toastService.showErrorToast('Error', response.ResponseText);
        this.ReturnCall.emit({ IsDone: true });

      }
    },
    );
  }
  clearData(){
    this.Remarks = '';
    this.Quantity = 1;
  }
}
