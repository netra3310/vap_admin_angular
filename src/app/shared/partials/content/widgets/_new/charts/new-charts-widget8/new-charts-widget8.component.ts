import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as ApexCharts from 'apexcharts';
import { retry } from 'rxjs';
import { getCSSVariableValue } from 'src/app/_metronic/kt/_utils';

@Component({
  selector: 'app-new-charts-widget8',
  templateUrl: './new-charts-widget8.component.html',
  styleUrls: ['./new-charts-widget8.component.scss'],
})
export class NewChartsWidget8Component implements OnInit {
  @ViewChild('weekChart') weekChart: ElementRef<HTMLDivElement>;
  @ViewChild('monthChart') monthChart: ElementRef<HTMLDivElement>;

  @Input() chartHeight: string = '425px';
  @Input() chartHeightNumber: number = 425;
  @Input() cssClass: string = '';
  tab: 'sale' | 'purchase' = 'sale';
  chart1Options: any = {};
  chart2Options: any = {};
  chart3Options: any = {};
  chart4Options: any = {};
  hadDelay: boolean = false;

  constructor(private cdr: ChangeDetectorRef, private translate: TranslateService) {}

  ngOnInit(): void {
    this.setupCharts();
  }

  init() {
    this.chart1Options = getChart1Options(this.chartHeightNumber);
    this.chart2Options = getChart2Options(this.chartHeightNumber);
    
    this.chart3Options = getChart3Options(this.chartHeightNumber);
    this.chart4Options = getChart4Options(this.chartHeightNumber);
  }

  setTab(_tab: 'sale' | 'purchase') {
    if(this.tab == _tab) {
      return;
    }
    this.tab = _tab;
    if (_tab === 'sale') {
      this.chart2Options = getChart2Options(this.chartHeightNumber);
      this.chart4Options = getChart4Options(this.chartHeightNumber);

    }

    if (_tab === 'purchase') {
      this.chart1Options = getChart1Options(this.chartHeightNumber);
      this.chart3Options = getChart3Options(this.chartHeightNumber);
    }

    this.setupCharts();
  }

  setupCharts() {
    setTimeout(() => {
      this.hadDelay = true;
      this.init();
      this.cdr.detectChanges();
    }, 100);
  }
}

function getChart1Options(chartHeightNumber: number) {
  const data = [
    [[100, 250, 30]],
    [[225, 300, 35]],
    [[300, 350, 25]],
    [[350, 350, 20]],
    [[450, 400, 25]],
    [[550, 350, 35]],
  ];
  const height = chartHeightNumber;
  const borderColor = getCSSVariableValue('--kt-border-dashed-color');

  const options = {
    series: [
    {
      name: "High - 2013",
      data: [28, 29, 33, 36, 32, 32, 33]
    },
    {
      name: "Low - 2013",
      data: [12, 11, 14, 18, 17, 13, 13]
    }
  ],
    chart: {
    height: 350,
    type: 'line',
    dropShadow: {
      enabled: true,
      color: '#000',
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.2
    },
    toolbar: {
      show: false
    }
  },
  colors: ['#77B6EA', '#545454'],
  dataLabels: {
    enabled: true,
  },
  stroke: {
    curve: 'smooth'
  },
  title: {
    text: 'Average High & Low Temperature',
    align: 'left'
  },
  grid: {
    borderColor: '#e7e7e7',
    row: {
      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5
    },
  },
  markers: {
    size: 1
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    title: {
      text: 'Month'
    }
  },
  yaxis: {
    title: {
      text: 'Temperature'
    },
    min: 5,
    max: 40
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    floating: true,
    offsetY: -25,
    offsetX: -5
  }
  };
  return options;
}
function getChart3Options(chartHeightNumber: number) {
  const data = [
    [[100, 250, 30]],
    [[225, 300, 35]],
    [[300, 350, 25]],
    [[350, 350, 20]],
    [[450, 400, 25]],
    [[550, 350, 35]],
  ];
  const height = chartHeightNumber;
  const borderColor = getCSSVariableValue('--kt-border-dashed-color');

  const options = {
    series: [44, 55, 13, 43, 22],
    chart: {
    width: 380,
    type: 'pie',
  },
  labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200,
        height: height
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
  };
  return options;
}
function getChart2Options(chartHeightNumber: number) {
  const data = [
    [[125, 300, 40]],
    [[250, 350, 35]],
    [[350, 450, 30]],
    [[450, 250, 25]],
    [[500, 500, 30]],
    [[600, 250, 28]],
  ];
  const height = chartHeightNumber;
  const borderColor = getCSSVariableValue('--kt-border-dashed-color');

  const options = {
    series: [
    {
      name: "High - 2013",
      data: [28, 29, 33, 36, 32, 32, 33]
    },
    {
      name: "Low - 2013",
      data: [12, 11, 14, 18, 17, 13, 13]
    }
  ],
    chart: {
    height: 350,
    type: 'line',
    dropShadow: {
      enabled: true,
      color: '#000',
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.2
    },
    toolbar: {
      show: false
    }
  },
  colors: ['#77B6EA', '#545454'],
  dataLabels: {
    enabled: true,
  },
  stroke: {
    curve: 'smooth'
  },
  title: {
    text: 'Average High & Low Temperature',
    align: 'left'
  },
  grid: {
    borderColor: '#e7e7e7',
    row: {
      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5
    },
  },
  markers: {
    size: 1
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    title: {
      text: 'Month'
    }
  },
  yaxis: {
    title: {
      text: 'Temperature'
    },
    min: 5,
    max: 40
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    floating: true,
    offsetY: -25,
    offsetX: -5
  }
  };
  return options;
}
function getChart4Options(chartHeightNumber: number) {
  const data = [
    [[125, 300, 40]],
    [[250, 350, 35]],
    [[350, 450, 30]],
    [[450, 250, 25]],
    [[500, 500, 30]],
    [[600, 250, 28]],
  ];
  const height = chartHeightNumber;
  const borderColor = getCSSVariableValue('--kt-border-dashed-color');

  const options = {
    series: [44, 55, 13, 43, 22],
    chart: {
    width: 380,
    type: 'pie',
  },
  labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200,
        height: height
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
  };
  return options;
}
