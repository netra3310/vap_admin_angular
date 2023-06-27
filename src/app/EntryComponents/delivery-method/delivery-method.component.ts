import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ShippingMethodModel } from 'src/app/Helper/models/ShippingMethodModel';
import { vaplongapi } from 'src/app/Service/vaplongapi.service';
import { untilDestroyed } from 'src/app/shared/services/until-destroy';
import { environment } from 'src/environments/environment';
import { Columns } from 'src/app/shared/model/columns.model';

@Component({
  selector: 'app-delivery-method',
  templateUrl: './delivery-method.component.html',
  styleUrls: ['./delivery-method.component.scss']
})
export class DeliveryMethodComponent implements OnInit, OnDestroy {
  AllDeliveryMethodsList: ShippingMethodModel[];
  first = 0;
  rows = 25;
  totalRecords = 0;
  currencySign: string;
  rowsPerPageOptions = [10, 20, 50, 100];
  IsSpinner = false;
  globalFilterFields = ['Name']
  columns: Columns[] = [
    { field: 'ID', header: 'ID', sorting: 'ID', placeholder: '' },
    { field: 'Name', header: 'PaymentCondition', sorting: 'Name', placeholder: '' },
    { field: 'Cost', header: 'Cost', sorting: 'Cost', placeholder: '' },
    { field: 'Description', header: 'Description', sorting: 'Description', placeholder: '' },
  ];
  initialColumns = ['ID', 'Name', 'Cost', 'Description'];

  @Output() onDeliveryMethodSelectValue = new EventEmitter<{ selectedDeliveryMethod: any }>();
  selectedDeliveryMethod: any;
  constructor(private apiService: vaplongapi) {
    // this.currencySign = environment.currencySign;
    this.currencySign = '€';

  }
  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.GetDeliveryMethodsList(); // Bind delivery methods
  }
  
  GetDeliveryMethodsList() {

    this.apiService.GetAllDeliveryMethod().pipe(untilDestroyed(this)).subscribe((response: any) => {

      if (response.ResponseText === 'success') {

        this.AllDeliveryMethodsList = response.AllShippingMethodsList;
        this.totalRecords = response.AllShippingMethodsList.length;
      }
      else {

        console.log('internal serve Error', response);
      }

    }
    );
  }

  SelectRow(deliveryMethod: any) {

    this.onDeliveryMethodSelectValue.emit({ selectedDeliveryMethod: deliveryMethod });
  }


}
