import { 
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  OnChanges,
  SimpleChanges
 } from '@angular/core';
import { SupplierPermissionEnum } from "src/app/shared/constant/supplier-permission";
import { CustomerPermissionEnum } from "src/app/shared/constant/customer-permission";
import { ReportPermissionEnum } from "src/app/shared/constant/report-permission";
import { getCSSVariableValue } from '../../../../app/_metronic/kt/_utils';

import { trigger, state, style, animate, transition } from '@angular/animations';

export const displayAnimation = trigger('display', [
  state('none', style({ display: 'none' })),
  state('block', style({ display: 'block' })),
  transition('none <=> block', [
    animate('0.2s')
  ])
]);
 
@Component({
  selector: 'app-overview-card',
  templateUrl: './overview-card.component.html',
  styleUrls: ['./overview-card.component.scss'],
  // animations: [displayAnimation]
})
export class OverviewCardComponent implements OnInit {

  @Input() cssClass: string = '';
  @Input() chartSize: number = 70;
  @Input() chartLine: number = 11;
  @Input() chartRotate?: number = 145;
  @Input() TotalCustomerBalance: any;
  @Input() TotalSupplierBalance: any;
  @Input() isLoading : boolean;
  
  CustomerPermission = CustomerPermissionEnum;
  SupplierPermission = SupplierPermissionEnum;
  ReportPermission = ReportPermissionEnum;
  tab: string = 'customer';
  interval: any;
  customerData: any;
  supplierData: any;
  // TotalCustomerBalance: any = 500;
  // TotalSupplierBalance : any = 500;
  isCustomerbalance = true;
  isSupplierbalance = true;

  constructor(private cdr: ChangeDetectorRef) {
    this.tab = 'customer';
   }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.TotalCustomerBalance || changes.TotalSupplierBalance || changes.isLoading) {
      // this.chartOptions = this.setChartOption();
    }
  }

     
  Supplierbalance() {
    this.isSupplierbalance = !this.isSupplierbalance;
  }
  
  Customerbalance() {
    this.isCustomerbalance = !this.isCustomerbalance;
  }

  ngOnInit(): void {
    // this.interval = setInterval(() => {
    //   this.reversalSlider();
    // }, 4000);
    // setTimeout(() => {
    //   initChart1(this.chartSize, this.chartLine, this.chartRotate);
    //   initChart2(this.chartSize, this.chartLine, this.chartRotate);
    // }, 10);
    initChart1(this.chartSize, this.chartLine, this.chartRotate);
    initChart2(this.chartSize, this.chartLine, this.chartRotate);
  }
  
  init() {
    // TODO
  }

  setSlider(_tab: 'customer' | 'supplier') {
    // try {
    //   this.tab = _tab;
    //   this.cdr.detectChanges();

    //   clearInterval(this.interval);
    //   this.interval = setInterval(() => {
    //     this.reversalSlider();
    //   }, 4000);
    // } catch (e) {
    //   console.log(e);
    // }
  }

  reversalSlider() {
    // try {
    //   if (this.tab == 'customer') {
    //     this.setSlider('supplier');
    //   } else {
    //     this.setSlider('customer');
    //   }
    // } catch (e) {
    //   console.log(e);
    // }
  }
}


const initChart1 = function (
  chartSize: number = 70,
  chartLine: number = 11,
  chartRotate: number = 145
) {
  const el = document.getElementById('kt_card_widget_17_chart');

  if (!el) {
    return;
  }

  var options = {
    size: chartSize,
    lineWidth: chartLine,
    rotate: chartRotate,
    //percent:  el.getAttribute('data-kt-percent') ,
  };

  const canvas = document.createElement('canvas');
  const span = document.createElement('span');

  // @ts-ignore
  if (typeof G_vmlCanvasManager !== 'undefined') {
    // @ts-ignore
    G_vmlCanvasManager.initElement(canvas);
  }

  const ctx = canvas.getContext('2d');
  canvas.width = canvas.height = options.size;

  el.appendChild(span);
  el.appendChild(canvas);

  // @ts-ignore
  ctx.translate(options.size / 2, options.size / 2); // change center
  // @ts-ignore
  ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg

  //imd = ctx.getImageData(0, 0, 240, 240);
  const radius = (options.size - options.lineWidth) / 2;

  const drawCircle = function (
    color: string,
    lineWidth: number,
    percent: number
  ) {
    percent = Math.min(Math.max(0, percent || 1), 1);
    if (!ctx) {
      return;
    }

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
    ctx.strokeStyle = color;
    ctx.lineCap = 'round'; // butt, round or square
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  // Init
  drawCircle('#E4E6EF', options.lineWidth, 100 / 100);
  drawCircle(getCSSVariableValue('--kt-primary'), options.lineWidth, 100 / 150);
  drawCircle(getCSSVariableValue('--kt-success'), options.lineWidth, 100 / 250);
};
const initChart2 = function (
  chartSize: number = 70,
  chartLine: number = 11,
  chartRotate: number = 145
) {
  const el = document.getElementById('kt_card_widget_18_chart');

  if (!el) {
    return;
  }

  var options = {
    size: chartSize,
    lineWidth: chartLine,
    rotate: chartRotate,
    //percent:  el.getAttribute('data-kt-percent') ,
  };

  const canvas = document.createElement('canvas');
  const span = document.createElement('span');

  // @ts-ignore
  if (typeof G_vmlCanvasManager !== 'undefined') {
    // @ts-ignore
    G_vmlCanvasManager.initElement(canvas);
  }

  const ctx = canvas.getContext('2d');
  canvas.width = canvas.height = options.size;

  el.appendChild(span);
  el.appendChild(canvas);

  // @ts-ignore
  ctx.translate(options.size / 2, options.size / 2); // change center
  // @ts-ignore
  ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg

  //imd = ctx.getImageData(0, 0, 240, 240);
  const radius = (options.size - options.lineWidth) / 2;

  const drawCircle = function (
    color: string,
    lineWidth: number,
    percent: number
  ) {
    percent = Math.min(Math.max(0, percent || 1), 1);
    if (!ctx) {
      return;
    }

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
    ctx.strokeStyle = color;
    ctx.lineCap = 'round'; // butt, round or square
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  // Init
  drawCircle('#E4E6EF', options.lineWidth, 100 / 100);
  drawCircle(getCSSVariableValue('--kt-primary'), options.lineWidth, 100 / 150);
  drawCircle(getCSSVariableValue('--kt-success'), options.lineWidth, 100 / 250);
};
