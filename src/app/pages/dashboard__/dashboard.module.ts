import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent_ } from './dashboard.component';
import { ModalsModule, WidgetsModule, CardsModule } from 'src/app/shared/partials';
@NgModule({
  declarations: [DashboardComponent_],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent_,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    CardsModule
  ],
})
export class DashboardModule {}
