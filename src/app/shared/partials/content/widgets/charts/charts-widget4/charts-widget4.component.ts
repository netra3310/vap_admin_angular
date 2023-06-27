import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { getCSSVariableValue } from 'src/app/_metronic/kt/_utils';
import { DashboardComponent } from 'src/app/pages/dashboard_new/dashboard.component';

@Component({
  selector: 'app-charts-widget4',
  templateUrl: './charts-widget4.component.html',
})
export class ChartsWidget4Component implements OnInit {
  @Output() eventSelDate = new EventEmitter();
  chartOptions: any;
  selectValue: any = 'Loading date range...';
  dateArray: any = [
    "Today",
    "Yesterday",
    "Last 7 Days",
    "Last 30 Days",
    "This Month",
    "Last Month",
    "Custom Range"
  ]

  constructor() {}

  ngOnInit(): void {
    this.chartOptions = getChartOptions();
  }

  handleDropEvent(event: any) {
    if(Number(event) < 6)
      this.selectValue = this.dateArray[event];
    else {
      this.selectValue = "cululator...";
    }
    
    this.eventSelDate.emit(event);
  }
}

function getChartOptions() {
  const labelColor = getCSSVariableValue('--kt-gray-500');
  const borderColor = getCSSVariableValue('--kt-gray-200');

  const baseColor = getCSSVariableValue('--kt-success');
  const baseLightColor = getCSSVariableValue('--kt-success-light');
  const secondaryColor = getCSSVariableValue('--kt-warning');
  const secondaryLightColor = getCSSVariableValue('--kt-warning-light');

  return {
    series: [
      {
        name: 'Net Profit',
        data: [190, 230, 230, 200, 200, 190, 190, 200, 200, 220, 220, 200, 200, 210, 210],
      },
      {
        name: 'Revenue',
        data: [140, 180, 180, 100, 100, 120, 120, 250, 250, 120, 120, 100, 100, 160, 160],
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'area',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: { 
      type: "gradient", 
      gradient: { 
        shadeIntensity: 1, 
        opacityFrom: .4, 
        opacityTo: 0, 
        stops: [0, 80, 100] 
      } 
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: ["May 04", "May 05", "May 06", "May 09", "May 10", "May 12", "May 14", "May 17", "May 18", "May 20", "May 22", "May 24", "May 26", "May 28", "May 30"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
      crosshairs: {
        position: 'front',
        stroke: {
          color: labelColor,
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val: number) {
          return '$' + val + ' thousands';
        },
      },
    },
    colors: [baseColor, secondaryColor],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    markers: {
      colors: [baseLightColor, secondaryLightColor],
      strokeColors: [baseLightColor, secondaryLightColor],
      strokeWidth: 3,
    },
  };
}
