import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { DashboardComponent } from './dashboard.component';
import { ModalsModule, WidgetsModule, CardsModule } from 'src/app/shared/partials';
import { QuickLinkComponent } from './quick-link/quick-link.component';
import { OverviewCardComponent } from './overview-card/overview-card.component';
import { ReadingCardComponent } from './reading-card/reading-card.component';
import { AnnualChartComponent } from './annual-chart/annual-chart.component';
import { ProductTableComponent } from './product-table/product-table.component';
import { YearDropdownComponent } from './year-dropdown/year-dropdown.component';
import { DateDropdownComponent } from './date-dropdown/date-dropdown.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    DashboardComponent,
    QuickLinkComponent,
    OverviewCardComponent,
    ReadingCardComponent,
    AnnualChartComponent,
    ProductTableComponent,
    YearDropdownComponent,
    DateDropdownComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ]),
    InlineSVGModule,
    WidgetsModule,
    ModalsModule,
    NgApexchartsModule,
    SharedModule
  ],
})
export class DashboardModule {}