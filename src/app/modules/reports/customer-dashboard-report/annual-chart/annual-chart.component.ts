import { Component, OnInit, Output, Input, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { getCSSVariableValue } from 'src/app/_metronic/kt/_utils';
import { DashboardComponent } from 'src/app/pages/dashboard_new/dashboard.component';


@Component({
  selector: 'app-annual-chart',
  templateUrl: './annual-chart.component.html',
  styleUrls: ['./annual-chart.component.scss']
})
export class AnnualChartComponent implements OnInit {
  @Input() years : Array<{year: number}> ;
  @Input() data : any;
  @Input() isLoading : boolean;
  @Output() eventSelYear = new EventEmitter();
  chartOptions: any;
  selectValue: any = new Date().getFullYear();

  constructor() {
  }

  ngOnInit(): void {
    this.chartOptions = this.setChartOption();
  }

  handleDropEvent(event: any) {
    this.selectValue = event;
    this.eventSelYear.emit(event);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.data) {
      this.chartOptions = this.setChartOption();
    }
    if(changes.isLoading) {
      console.log('annual loading value is', this.isLoading);
    }
  }

  setChartOption() {
    const labelColor = getCSSVariableValue('--kt-gray-500');
    const borderColor = getCSSVariableValue('--kt-gray-200');

    const baseColor = getCSSVariableValue('--kt-success');
    const baseLightColor = getCSSVariableValue('--kt-success-light');
    const secondaryColor = getCSSVariableValue('--kt-warning');
    const secondaryLightColor = getCSSVariableValue('--kt-warning-light');

    const chartOption = {
      series: [
        {
          name: this.data?.datasets[0]?.label || '',
          data: this.data?.datasets[0]?.data || [],
        },
        {
          name: this.data?.datasets[1]?.label || '',
          data: this.data?.datasets[1]?.data || [],
        },
        {
          name: this.data?.datasets[2]?.label || '',
          data: this.data?.datasets[2]?.data || [],
        }
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
        categories: this.data?.labels || [],
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
            return val;
          },
        },
      },
      colors: [baseColor, secondaryColor, 'red'],
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
    return chartOption;
  }

}

