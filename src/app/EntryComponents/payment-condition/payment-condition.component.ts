import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { PaymentConditionModel } from 'src/app/Helper/models/PaymentConditionModel';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { Columns } from 'src/app/shared/model/columns.model';

@Component({
  selector: 'app-payment-condition',
  templateUrl: './payment-condition.component.html',
  styleUrls: ['./payment-condition.component.scss']
})
export class PaymentConditionComponent implements OnInit, OnDestroy {
  AllPaymentConditionsList: PaymentConditionModel[];
  first = 0;
  rows = 25;
  totalRecords = 0;
  @Output() onPaymentConditionSelectValue = new EventEmitter<{ selectedPaymentCondition: any }>();
  selectedPaymentCondition: any;
  mySearch : string;
  columns: Columns[] = [
    { field: 'Name', header: 'Name', sorting: 'Name', placeholder: '' },
    { field: 'ID', header: 'ID', sorting: 'ID', placeholder: '' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '' },
  ];
  constructor(private apiService: vaplongapi) {
  }
  ngOnDestroy(): void {

  }
  ngOnInit(): void {
    this.GetPaymentConditionList(); // Bind payment conditions 
  }

  GetPaymentConditionList() {

    this.apiService.GetAllPaymentCondition().pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {
        this.AllPaymentConditionsList = response.AllPaymentConditionList;
        this.totalRecords = response.AllPaymentConditionList.length;
      }
      else {

        console.log('internal serve Error', response);
      }

    }
    );
  }

  SelectRow(paymentCondition: any) {

    this.onPaymentConditionSelectValue.emit({ selectedPaymentCondition: paymentCondition });
  }


}
