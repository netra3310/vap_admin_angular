import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';
import { Brand } from 'src/app/Helper/models/Brand';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-reading-card',
  templateUrl: './reading-card.component.html',
  styleUrls: ['./reading-card.component.scss']
})
export class ReadingCardComponent implements OnInit {
  @Input() cssClass: string = '';
  @Input() TodayExpenses: any;
  @Input() TodayProfit: any;
  @Input() TotalOnlineOrder: any;
  @Input() TotalVaplongOrder: any;
  @Input() TotalVaplongOrderAmount: any;
  @Input() isLoading : boolean;
  @Input() TodaySales: any;
  @Input() TodayPurchases: any;

  tab: string = 'sales';
  interval: any;
  customerData: any;
  supplierData: any;
  SalesPermission : any;
  PurchasePermission: any;
  ExtrasPermission: any;

  constructor(private cdr: ChangeDetectorRef) {
    this.tab = 'sales';
   }

  ngOnInit(): void {
    // this.interval = setInterval(() => {
    //   this.reversalSlider();
    // }, 3000);
  }
  
  init() {
    // TODO
  }

  setSlider(_tab: any) {
    // try {
    //   this.tab = _tab;
    //   this.cdr.detectChanges();

    //   clearInterval(this.interval);
    //   this.interval = setInterval(() => {
    //     this.reversalSlider();
    //   }, 3000);
    // } catch (e) {
    //   console.log(e);
    // }
  }

  reversalSlider() {
    // try {
    //   switch(this.tab) {
    //     case 'sales':
    //       this.setSlider('purchases');
    //       break;
    //     case 'purchases':
    //       this.setSlider('expenses');
    //       break;
    //     case 'expenses':
    //       this.setSlider('onlineorder');
    //       break;
    //     case 'onlineorder':
    //       this.setSlider('systemorder');
    //       break;
    //     case 'systemorder':
    //       this.setSlider('sales');
    //       break;
    //     default:
    //       break;
    //   }
    // } catch (e) {
    //   console.log(e);
    // }
  }

}
