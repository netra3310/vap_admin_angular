import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { RouterModule, Routes } from '@angular/router';
import {
  NgbDropdownModule,
  NgbProgressbarModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ShellComponent } from './shell.component';
import { TranslationModule } from '../../modules/i18n';
import { AsideComponent } from './aside/aside.component';
import { ContentComponent } from './content/content.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ScriptsInitComponent } from './scripts-init/scripts-init.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { AsideMenuComponent } from './aside/aside-menu/aside-menu.component';
import { HeaderMenuComponent } from './header/header-menu/header-menu.component';
import { NavbarComponent } from './header/navbar/navbar.component';
import { PageTitleComponent } from './header/page-title/page-title.component';
import { SidebarFooterComponent } from './sidebar/sidebar-footer/sidebar-footer.component';
import { SidebarLogoComponent } from './sidebar/sidebar-logo/sidebar-logo.component';
import { SidebarMenuComponent } from './sidebar/sidebar-menu/sidebar-menu.component';
import {
    DrawersModule,
    DropdownMenusModule,
    ModalsModule,
    EngagesModule,
} from 'src/app/shared/partials';
import { EngagesComponent } from 'src/app/shared/partials/layout/engages/engages.component';
import { ThemeModeModule } from 'src/app/shared/partials/layout/theme-mode-switcher/theme-mode.module';
import { AccountingComponent } from './toolbar/accounting/accounting.component';
import { ClassicComponent } from './toolbar/classic/classic.component';
import { ExtendedComponent } from './toolbar/extended/extended.component';
import { ReportsComponent } from './toolbar/reports/reports.component';
import { SaasComponent } from './toolbar/saas/saas.component';
import { ExtrasModule } from 'src/app/shared/partials/layout/extras/extras.module';
import { Routing } from '../../pages/routing';
import { MixedWidgetNotificationsComponent } from './header/navbar/components/mixed-widget-notifications/mixed-widget-notifications.component';
import { ListsWidgetNotificationsComponent } from './header/navbar/components/lists-widget-notifications/lists-widget-notifications.component';
import { ActivityListWidgetComponent } from './header/navbar/components/activity-list-widget/activity-list-widget.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: Routing,
  },
];
@NgModule({
    declarations: [
        ShellComponent,
        AsideComponent,
        ContentComponent,
        FooterComponent,
        HeaderComponent,
        ScriptsInitComponent,
        SidebarComponent,
        ToolbarComponent,
        TopbarComponent,
        AsideMenuComponent,
        HeaderMenuComponent,
        NavbarComponent,
        PageTitleComponent,
        EngagesComponent,
        SidebarFooterComponent,
        SidebarLogoComponent,
        SidebarMenuComponent,
        AccountingComponent,
        ClassicComponent,
        ExtendedComponent,
        ReportsComponent,
        SaasComponent,
        MixedWidgetNotificationsComponent,
        ListsWidgetNotificationsComponent,
        ActivityListWidgetComponent,
        BreadcrumbComponent,
    ],
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      TranslationModule,
      InlineSVGModule,
      NgbDropdownModule,
      NgbProgressbarModule,
      ExtrasModule,
      ModalsModule,
      DrawersModule,
      EngagesModule,
      DropdownMenusModule,
      NgbTooltipModule,
      ThemeModeModule,
      SharedModule
    ],
})
export class ShellModule {}