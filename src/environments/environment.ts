// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const serverurl = 'http://85.215.230.111:543/'; // new test server for testing

export const environment = {
  production: true,
  appVersion: 'v8.1.6',
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: true,
  apiUrl: 'api',
  appThemeName: 'Metronic',
  appPurchaseUrl: 'https://1.envato.market/EA4JP',
  appHTMLIntegration:
    'https://preview.keenthemes.com/metronic8/demo1/documentation/base/helpers/flex-layouts.html',
  appPreviewUrl: 'https://preview.keenthemes.com/metronic8/angular/demo1/',
  appPreviewAngularUrl:
    'https://preview.keenthemes.com/metronic8/angular/demo1',
  appPreviewDocsUrl: 'https://preview.keenthemes.com/metronic8/angular/docs',
  appPreviewChangelogUrl:
    'https://preview.keenthemes.com/metronic8/angular/docs/changelog',
  appDemos: {
    demo1: {
      title: 'Demo 1',
      description: 'Default Dashboard',
      published: true,
      thumbnail: './assets/media/demos/demo1.png',
    }
  },

  APP_HELP_URL : "http://85.215.230.111:543/Help",
  API_URL: serverurl,
  url: serverurl + 'api',
  imageBasePath: serverurl + 'Content/',
  USER_IMAGE_PATH: serverurl + 'Images/UserImages/',
  
  HELP_IMAGE_PATH: serverurl + 'Images/Help/',
  CUSTOMER_IMAGE_PATH: serverurl + 'Images/CustomerImages/',
  SUPPLIER_IMAGE_PATH: serverurl + 'Images/SupplierImages/',
  CUSTOMER_DOCUMENT_PATH: serverurl + 'Images/CustomerDocuments/',
  SHIPMENT_PATH: serverurl + 'Images/Shipment/',


  companyName: 'Euro Mobile Company',
  companyAddress: 'Innsbruckweg 40 3047AH Rotterdam',
  vatNo: 'NL854260936B01',
  telephone: '0104151550',
  email: 'info@emcgsm.fr',
  website: 'https://emcparts.shop',
  SECRET_KEY: 'y_#U$.&^$*fcx@t28mu',


  // system static variable changes

  //For Vaplong System 
  MENU_THEME : 'layout-sidebar-darkgray',
  APP_LOGO: 'assets/media/logos/logo.png',
  //Menu_Name: 'Vaplong',
  Menu_Name:'Software',
  //FOOTER_TEXT:'Vaplong - 2020',
  FOOTER_TEXT:'Software - 2020',

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
