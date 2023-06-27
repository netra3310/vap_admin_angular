import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Brand } from 'src/app/Helper/models/Brand';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-slider-widget2',
  templateUrl: './slider-widget2.component.html',
  styleUrls: ['./slider-widget2.component.scss'],
})

export class SliderWidget2Component implements OnInit {
  @Input() cssClass: string = '';

  tab: string = 'sales';
  interval: any;
  customerData: any;
  supplierData: any;
  TodaySales: any;
  TodayPurchases: any;
  SalesPermission : any;
  PurchasePermission: any;
  ExtrasPermission: any;
  TodayExpenses: any;
  TodayProfit: any;
  TotalOnlineOrder: any;
  TotalVaplongOrder: any;
  TotalVaplongOrderAmount: any;

  constructor(private cdr: ChangeDetectorRef) {
    this.tab = 'sales';
   }

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.reversalSlider();
    }, 3000);
  }
  
  init() {
    // TODO
  }

  setSlider(_tab: any) {
    try {
      this.tab = _tab;
      this.cdr.detectChanges();

      clearInterval(this.interval);
      this.interval = setInterval(() => {
        this.reversalSlider();
      }, 3000);
    } catch (e) {
      console.log(e);
    }
  }

  reversalSlider() {
    try {
      switch(this.tab) {
        case 'sales':
          this.setSlider('purchases');
          break;
        case 'purchases':
          this.setSlider('expenses');
          break;
        case 'expenses':
          this.setSlider('onlineorder');
          break;
        case 'onlineorder':
          this.setSlider('systemorder');
          break;
        case 'systemorder':
          this.setSlider('sales');
          break;
        default:
          break;
      }
    } catch (e) {
      console.log(e);
    }
  }

}
