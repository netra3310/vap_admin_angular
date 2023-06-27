import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard_new/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'purchase',
    loadChildren: () =>
      import('../modules/purchase/purchase.module').then((m) => m.PurchaseModule),
  },
  {
    path: 'sale',
    loadChildren: () =>
      import('../modules/sales/sales.module').then((m) => m.SalesModule),
  },
  {
    path: 'customer',
    loadChildren: () =>
      import('../modules/customer/customer.module').then((m) => m.CustomerModule),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('../modules/reports/reports.module').then((m) => m.ReportsModule),
  },
  {
    path: 'supplier',
    loadChildren: () =>
      import('../modules/supplier/supplier.module').then((m) => m.SupplierModule),
  },
  {
    path: 'catalog',
    loadChildren: () =>
      import('../modules/catalog/catalog.module').then((m) => m.CatalogModule),
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('../modules/orders/orders.module').then((m) => m.OrdersModule),
  },
  // {
  //   path: 'crafted/account',
  //   loadChildren: () =>
  //     import('../modules/account/account.module').then((m) => m.AccountModule),
  //   data: { layout: 'dark-header' },
  // },
  // {
  //   path: 'crafted/pages/wizards',
  //   loadChildren: () =>
  //     import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
  //   data: { layout: 'light-header' },
  // },
  // {
  //   path: 'crafted/widgets',
  //   loadChildren: () =>
  //     import('../modules/widgets-examples/widgets-examples.module').then(
  //       (m) => m.WidgetsExamplesModule
  //     ),
  //   data: { layout: 'light-header' },
  // },
  // {
  //   path: 'apps/chat',
  //   loadChildren: () =>
  //     import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
  //   data: { layout: 'light-sidebar' },
  // },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
