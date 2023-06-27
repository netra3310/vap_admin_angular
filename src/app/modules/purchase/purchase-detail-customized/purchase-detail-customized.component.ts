import { Component, ElementRef, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import * as html2canvas from 'html2canvas';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { StorageService } from 'src/app/shared/services/storage.service';
import { isNullOrUndefined } from 'src/app/Helper/global-functions';

@Component({
  selector: 'app-purchase-detail-customized',
  templateUrl: './purchase-detail-customized.component.html',
  styleUrls: ['./purchase-detail-customized.component.scss']
})
export class PurchaseDetailCustomizedComponent implements OnInit, OnDestroy {
  date = new Date();
  products: any[] = [
    { Product: 'a', Quantity: 3, Price: 1, isRefund: false }
  ];
  purchaseDetail: any = {};
  @ViewChild('screen') screen: ElementRef;
  usermodel: any;

  loadingData = false;
  imgSrc: any;
  imageBasePath: any;
  @ViewChild('btn_open_multi_img_modal') btn_open_multi_img_modal: ElementRef;
  // api/Purchase/GetByPurchaseID
  constructor(
    private api: vaplongapi, 
    private activatedRoute: ActivatedRoute,  
    public route: Router,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef) {
    this.usermodel = this.storageService.getItem('UserModel');

    const obj = {
      Action: 'View',
      Description: `View Customized Purchase Details`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID
  }
  this.api.SaveActivityLog(obj).toPromise().then(x => { });
  }

  ngOnDestroy(): void {

  }
  ngOnInit() {
    const snapshot = this.activatedRoute.snapshot;
    const Param = { ID: snapshot.params.id };
    this.loadingData = true;
    this.api.GetPurchaseById(Param).pipe(untilDestroyed(this)).subscribe(x => {
      if (x.ResponseCode === 0) {

        this.purchaseDetail = x.AllPurchaseList[0];
      }
      this.loadingData = false;
      this.cdr.detectChanges();
    });
  }

  openImageGellary(imagePath: any) {
    this.imgSrc = imagePath;
    this.btn_open_multi_img_modal.nativeElement.click();
  }
 
}
