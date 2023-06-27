import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductModelDropDownData } from 'src/app/Helper/models/DropLists';
import { AllProductModel } from 'src/app/Helper/models/Product';
import { environment } from 'src/environments/environment';
import { Login } from 'src/app/Helper/models/Login';
import { Categories } from 'src/app/Helper/models/Categories';
import { Classification } from 'src/app/Helper/models/Classification';
import { UpdateStatus } from 'src/app/Helper/models/UpdateStatus';
import { Department } from 'src/app/Helper/models/Department';
import { Category } from 'src/app/Helper/models/Category';
import { SubCategory } from 'src/app/Helper/models/SubCategory';
import { ShopCategory } from 'src/app/Helper/models/ShopCategroy';
import { Color } from 'src/app/Helper/models/Color';
import { Series } from 'src/app/Helper/models/Series';

import { Type } from 'src/app/Helper/models/Type';
import { Brand } from 'src/app/Helper/models/Brand';
import { Size } from 'src/app/Helper/models/Size';
import { ProductQuality } from 'src/app/Helper/models/ProductQuality';
import { ProductModel } from 'src/app/Helper/models/ProductModel';
import { DiscountGroup } from 'src/app/Helper/models/DiscountGroup';
import { WareHouse } from 'src/app/Helper/models/WareHouse';
import { Zone } from 'src/app/Helper/models/Zone';
import { GroupDiscountProductWise } from 'src/app/Helper/models/GroupDiscountProdutWise';
import { Country } from 'src/app/Helper/models/Country';
import { State } from 'src/app/Helper/models/State';
import { City } from 'src/app/Helper/models/City';
import { ClientSource } from 'src/app/Helper/models/ClientSource';
import { PaymentCondition } from 'src/app/Helper/models/PaymentCondition';
import { DeliveryMethod } from 'src/app/Helper/models/DeliveryMethod';
import { Role } from 'src/app/Helper/models/Role';
import { Expense } from 'src/app/Helper/models/Expense';
import { ExpenseType } from 'src/app/Helper/models/ExpenseType';
import { Outlet } from 'src/app/Helper/models/Outlet';
import { CashRegister } from 'src/app/Helper/models/CashRegister';
import { ExpenseWage } from 'src/app/Helper/models/ExpenseWage';
import { Section } from 'src/app/Helper/models/Section';
import { UserModel } from 'src/app/Helper/models/UserModel';
import { RequestIDModel } from 'src/app/Helper/models/RequestIDModel';
import { RequestUserByEmail } from 'src/app/Helper/models/RequestUserByEmail';
import { ChangePasswordRequest } from 'src/app/Helper/models/ChangePasswordRequest';
import { Level } from 'src/app/Helper/models/Level';
import { FilterRequestModel } from 'src/app/Helper/models/FilterRequestModel';
import { WishlistModel } from 'src/app/Helper/models/WishlistModel';
import { AssignNonTrackableStockToOutletRequest } from 'src/app/Helper/models/AssignNonTrackableStockToOutletRequest';
import { AssignTrackableStockToOutletRequest } from 'src/app/Helper/models/AssignTrackableStockToOutletRequest';
import { AssignTrackableStockToHeadquarterRequest } from 'src/app/Helper/models/AssignTrackableStockToHeadquarterRequest';
import { AssignNonTrackableStockToHeadquarterRequest } from 'src/app/Helper/models/AssignNonTrackableStockToHeadquarterRequest';
import { ShipmentModel } from '../Helper/models/ShipmentModel';
import { TokenService } from './token.service';
import { ProductIncomingQuantityModel } from '../Helper/models/ProductIncomingQuantityModel';

@Injectable({
  providedIn: 'root',
})
export class vaplongapi {

  headers: HttpHeaders;
  readonly url = environment.url;

  readonly imageBasePath = environment.imageBasePath;

  // let hostname = window.location.hostname;
  // console.log(hostname);
  // console.log(window.location.origin);
  // console.log('port number');
  // console.log(window.location.port)
  constructor(private http: HttpClient, private tokenservice: TokenService) {
    const token = this.tokenservice.getToken();
    this.headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .set('APIKey', 'AccuritaAPIKey987654321')
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Credentials', 'true');
  }

  GetClassificationDropList(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/Classification/GetDropDownData',
      { headers: this.headers }
    );
  }

  GetProductModelDropDownData(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/ProductModel/GetDropDownData',
      { headers: this.headers }
    );
  }

  GetMeasuringUnitDD(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/MeasuringUnit/GetDropDownData',
      { headers: this.headers }
    );
  }
  GetUserAuthorization(req: any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/User/GetAllAuthorizeActionsByUserID',
      req,
      { headers: this.headers }
    );
  }

  QualityLabelDD(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/ProductQuality/GetDropDownData',
      { headers: this.headers }
    );
  }

  GetAllProduct(): Observable<any> {
    return this.http.get<any>(environment.url + '/Product/GetAll', {
      headers: this.headers,
    });
  }

  GetAllProductPagination(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Product/GetAllProductPagination',
      body,
      { headers: this.headers }
    );
  }

  GetAllProductByNewSearchFilter(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Product/GetAllProductByNewSearchFilter',
      body,
      { headers: this.headers }
    );
  }

  GetAllProductPaginationForImageListing(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Product/GetAllProductPaginationForImageListing',
      body,
      { headers: this.headers }
    );
  }

  GetProductLocationByFilter(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/InventoryLocation/GetProductLocationByFilter',
      body,
    {headers: this.headers}
    );
  }

  GetAllProductImagesListingTotalCount(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Product/GetAllProductImagesListingTotalCount',
      body,
      { headers: this.headers }
    );
  }

  GetAllProductWithDifferentStock(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/Product/GetAllProductWithDifferentStock',
      { headers: this.headers }
    );
  }

  GetAllIncomingQuantity(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Product/GetAllIncomingQuantity',
      body,
      { headers: this.headers }
    );
  }

  GetAllIncomingQuantityTotalCount(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Product/GetAllIncomingQuantityTotalCount',
      body,
      { headers: this.headers }
    );
  }

  GetAllProductExportPagination(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Product/GetAllProductExportPagination',
      body,
      { headers: this.headers }
    );
  }

  GetAllProductTotalCountProduct(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Product/GetAllProductTotalCount',
      body,
      { headers: this.headers }
    );
  }

  GetDepartmentByClassificationID(ID : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Department/GetByClassificationID',
      ID,
      { headers: this.headers }
    );
  }

  GetCategoryByDepartmentID(ID : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Category/GetByDepartmentID',
      ID,
      { headers: this.headers }
    );
  }
  GetBrandTypeByBrandID(ID : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/BrandType/GetByBrandID',
      ID,
      { headers: this.headers }
    );
  }

  GetSubCategoryByCategorytID(ID : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/SubCategory/GetByCategoryID',
      ID,
      { headers: this.headers }
    );
  }

  GetCategoryDropDownData(): Observable<any> {
    return this.http.get<any>(environment.url + '/Category/GetDropDownData', {
      headers: this.headers,
    });
  }

  GetShopCategoryDropDownData(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/ShopCategory/GetDropDownData',
      { headers: this.headers }
    );
  }

  GetProductByProductID(ID : any): Observable<any> {
    return this.http.post<any>(environment.url + '/Product/GetByID', ID, {
      headers: this.headers,
    });
  }

  GetProductByID(ID : any): Observable<any> {
    return this.http.post<any>(environment.url + '/ProductReporting/GetProductByID', ID, {
      headers: this.headers,
    });
  }

  GetProductByProductIDWithStock(ID : any): Observable<any> {
    return this.http.post<any>(environment.url + '/Product/GetByIDWithStock', ID, {
      headers: this.headers,
    });
  }
  ProductQualityUpdateStatus(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Product/UpdateStatus',
      body,
      { headers: this.headers }
    );
  }

  GenerateQRCode(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Product/GenerateBarCode',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }
  GenerateLevelQRCode(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Level/GenerateBarCode',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }
  DeleteProduct(ID : any): Observable<any> {
    return this.http.post<any>(environment.url + '/Product/Delete', ID, {
      headers: this.headers,
    });
  }
  DisableProductOnShop(ID : any): Observable<any> {
    return this.http.post<any>(environment.url + '/Product/DisableProductOnShop', ID, {
      headers: this.headers,
    });
  }
  SyncProductImages(ID : any): Observable<any> {
    return this.http.post<any>(environment.url + '/OpenCart/GetProductByIDNew', ID, {
      headers: this.headers,
    });
  }

  SyncProductStock(ID : any): Observable<any> {
    return this.http.post<any>(environment.url + '/ProductReporting/UpdateProductStats', ID, {
      headers: this.headers,
    });
  }

  ProductVariantByID(ID : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductVariant/GetByID',
      ID,
      { headers: this.headers }
    );
  }

  GetAllProductVariantByProductID(ID : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductVariant/GetAllByProductID',
      ID,
      { headers: this.headers }
    );
  }

  GetDropDownDataColor(): Observable<any> {
    return this.http.get<any>(environment.url + '/Color/GetDropDownData', {
      headers: this.headers,
    });
  }
  GetDropDownDataSeries(): Observable<any> {
    return this.http.get<any>(environment.url + '/ProductSeries/GetDropDownData', {
      headers: this.headers,
    });
  }
  GetProductSeriesByBrandID(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/ProductSeries/GetByBrandID', 
    body,
    {
      headers: this.headers,
    });
  }

  GetDropDownDataType(): Observable<any> {
    return this.http.get<any>(environment.url + '/ProductType/GetDropDownData', {
      headers: this.headers,
    });
  }

  GetDropDownDataConnecterType(): Observable<any> {
    return this.http.get<any>(environment.url + '/ConnecterType/GetDropDownData', {
      headers: this.headers,
    });
  }
  GetDropDownDataPower(): Observable<any> {
    return this.http.get<any>(environment.url + '/Power/GetDropDownData', {
      headers: this.headers,
    });
  }
  GetDropDownDataPrint(): Observable<any> {
    return this.http.get<any>(environment.url + '/Print/GetDropDownData', {
      headers: this.headers,
    });
  }
  GetDropDownDataCapacity(): Observable<any> {
    return this.http.get<any>(environment.url + '/Capacity/GetDropDownData', {
      headers: this.headers,
    });
  }
  GetDropDownDataPackaging(): Observable<any> {
    return this.http.get<any>(environment.url + '/Packaging/GetDropDownData', {
      headers: this.headers,
    });
  }
  GetDropDownDataSize(): Observable<any> {
    return this.http.get<any>(environment.url + '/Size/GetDropDownData', {
      headers: this.headers,
    });
  }

  UpdateProductVariantStatus(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductVariant/UpdateStatus',
      body,
      { headers: this.headers }
    );
  }

  SetToObseleteProductFunction(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Product/SetProductAsObselete',
      body,
      { headers: this.headers }
    );
  }

  // post to shop  or OpenCart/AddProduct
  PostTOShopOrAddProductToOpenCart(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/OpenCart/AddProduct', body, {
      headers: this.headers,
    });
  }
  PostTOShopMultiple(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/OpenCart/MultiProduct',
      body, {
      headers: this.headers,
    });
  }

  AddProductVariant(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/ProductVariant/Add', body, {
      headers: this.headers,
    });
  }



  GetNonTrackableProductLocationDetailReport(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetNonTrackableProductLocationReport',
      body,
      { headers: this.headers }
    );
  }



  GetAllFolderHierarchyPaginationFolderHierarchy(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/FolderHierarchy/GetAllFolderHierarchyPagination',
      body,
      { headers: this.headers }
    );
  }

  GetFolderHierarchyByID(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/FolderHierarchy/GetByID',
      body,
      { headers: this.headers }
    );
  }

  GetAllPostableTotalCount(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductVariant/GetAllPostableTotalCount',
      JSON.stringify(body),
      { headers: this.headers }
    );
  }

  GetAllPostable(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductVariant/GetAllPostable',
      JSON.stringify(body),
      { headers: this.headers }
    );
  }
  //#region Product Classification API's
  GetAllClassification(): Observable<any> {
    return this.http.get<any>(environment.url + '/Classification/GetAll', {
      headers: this.headers,
    });
  }

  AddClassifications(ClassificationModel: Classification): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Classification/Add',
      JSON.stringify(ClassificationModel),
      { headers: this.headers }
    );
  }
  UpdateClassifications(ClassificationModel: Classification): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Classification/Update',
      JSON.stringify(ClassificationModel),
      { headers: this.headers }
    );
  }
  AddMultipleClassifications(CategoryList: Categories): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Classification/AddMultiple',
      JSON.stringify(CategoryList),
      { headers: this.headers }
    );
  }
  UpdateClassificationStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Classification/UpdateStatus',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }

  //#endregion

  //#region Product Department API's

  GetAllDepartments(): Observable<any> {
    return this.http.get<any>(environment.url + '/Department/GetAll', {
      headers: this.headers,
    });
  }
  AddDepartment(DepartmenModel: Department): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Department/Add',
      JSON.stringify(DepartmenModel),
      { headers: this.headers }
    );
  }
  UpdateDepartment(DepartmenModel: Department): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Department/Update',
      JSON.stringify(DepartmenModel),
      { headers: this.headers }
    );
  }
  GetDepartmentByID(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Department/GetByID',
      JSON.stringify(body),
      { headers: this.headers }
    );
  }
  AddMultipleDepartment(CategoryList: Categories): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Department/AddMultiple',
      JSON.stringify(CategoryList),
      { headers: this.headers }
    );
  }
  UpdateDepartmentStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Department/UpdateStatus',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }

  //#endregion

  //#region Product Category API's

  GetAllCategories(): Observable<any> {
    return this.http.get<any>(environment.url + '/Category/GetAll', {
      headers: this.headers,
    });
  }
  AddCategory(CategoryModel: Category): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Category/Add',
      JSON.stringify(CategoryModel),
      { headers: this.headers }
    );
  }
  UpdateCategory(CategoryModel: Category): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Category/Update',
      JSON.stringify(CategoryModel),
      { headers: this.headers }
    );
  }
  AddMultipleCategories(CategoryList: Categories): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Category/AddMultiple',
      JSON.stringify(CategoryList),
      { headers: this.headers }
    );
  }
  UpdateCategoryStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Category/UpdateStatus',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }

  //#endregion

  //#region Product BrandType API's

  GetAllBrandTypes(): Observable<any> {
    return this.http.get<any>(environment.url + '/BrandType/GetAll', {
      headers: this.headers,
    });
  }
  AddBrandType(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/BrandType/Add',
      JSON.stringify(body),
      { headers: this.headers }
    );
  }
  UpdateBrandType(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/BrandType/Update',
      JSON.stringify(body),
      { headers: this.headers }
    );
  }
  
  UpdateBrandTypeStatus(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/BrandType/UpdateStatus',
      JSON.stringify(body),
      { headers: this.headers }
    );
  }
  
  //#endregion

  //#region Product SubCategory API's

  GetAllSubCategories(): Observable<any> {
    return this.http.get<any>(environment.url + '/SubCategory/GetAll', {
      headers: this.headers,
    });
  }
  AddSubCategory(SubCategoryModel: SubCategory): Observable<any> {
    return this.http.post<any>(
      environment.url + '/SubCategory/Add',
      JSON.stringify(SubCategoryModel),
      { headers: this.headers }
    );
  }
  UpdateSubCategory(SubCategoryModel: SubCategory): Observable<any> {
    return this.http.post<any>(
      environment.url + '/SubCategory/Update',
      JSON.stringify(SubCategoryModel),
      { headers: this.headers }
    );
  }
  AddMultipleSubCategories(CategoryList: Categories): Observable<any> {
    return this.http.post<any>(
      environment.url + '/SubCategory/AddMultiple',
      JSON.stringify(CategoryList),
      { headers: this.headers }
    );
  }
  UpdateSubCategoryStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/SubCategory/UpdateStatus',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }

  //#endregion

  //#region Product ShopCategory API's

  GetAllShopCategories(): Observable<any> {
    return this.http.get<any>(environment.url + '/ShopCategory/GetAll', {
      headers: this.headers,
    });
  }
  GetAllShopCategoryPagination(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/ShopCategory/GetAllShopCategoryPagination',
      JSON.stringify(body),

      {
        headers: this.headers,
      });
  }
  GetAllShopCategoryTotalCount(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/ShopCategory/GetAllShopCategoryTotalCount',
      JSON.stringify(body),
      {
        headers: this.headers,
      });
  }
  GetShopCategoriesForDropdown(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/ShopCategory/GetDropDownData',
      { headers: this.headers }
    );
  }

  AddShopCategory(ShopCategoryModel: ShopCategory): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ShopCategory/Add',
      JSON.stringify(ShopCategoryModel),
      { headers: this.headers }
    );
  }
  UpdateShopCategory(ShopCategoryModel: ShopCategory): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ShopCategory/Update',
      JSON.stringify(ShopCategoryModel),
      { headers: this.headers }
    );
  }
  AddMultipleShopCategories(CategoryList : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/SubCategory/AddMultiple',
      JSON.stringify(CategoryList),
      { headers: this.headers }
    );
  }
  UpdateShopCategoryStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ShopCategory/UpdateStatus',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }

  //#endregion

  //#region Product Color API's

  GetAllColors(): Observable<any> {
    return this.http.get<any>(environment.url + '/Color/GetAll', {
      headers: this.headers,
    });
  }
  AddColor(ColorModel: Color): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Color/Add',
      JSON.stringify(ColorModel),
      { headers: this.headers }
    );
  }
  UpdateColor(ColorModel: Color): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Color/Update',
      JSON.stringify(ColorModel),
      { headers: this.headers }
    );
  }
  UpdateColorStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Color/UpdateStatus',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }

  //#endregion
   //#region Product Series API's

   GetAllSeries(): Observable<any> {
    return this.http.get<any>(environment.url + '/ProductSeries/GetAll', {
      headers: this.headers,
    });
  }
  AddSeries(SeriesModel: Series): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductSeries/Add',
      JSON.stringify(SeriesModel),
      { headers: this.headers }
    );
  }
  UpdateSeries(SeriesModel: Series): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductSeries/Update',
      JSON.stringify(SeriesModel),
      { headers: this.headers }
    );
  }
  UpdateSeriesStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductSeries/UpdateStatus',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }

  //#endregion
 //#region Product Type API's

 GetAllTypes(): Observable<any> {
  return this.http.get<any>(environment.url + '/ProductType/GetAll', {
    headers: this.headers,
  });
}
AddType(TypeModel: Type): Observable<any> {
  return this.http.post<any>(
    environment.url + '/ProductType/Add',
    JSON.stringify(TypeModel),
    { headers: this.headers }
  );
}
UpdateType(TypeModel: Type): Observable<any> {
  return this.http.post<any>(
    environment.url + '/ProductType/Update',
    JSON.stringify(TypeModel),
    { headers: this.headers }
  );
}
UpdateTypeStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
  return this.http.post<any>(
    environment.url + '/ProductType/UpdateStatus',
    JSON.stringify(UpdateStatusModel),
    { headers: this.headers }
  );
}

//#endregion


//#region Product Power API's

GetAllPowers(): Observable<any> {
  return this.http.get<any>(environment.url + '/Power/GetAll', {
    headers: this.headers,
  });
}
AddPower(body : any): Observable<any> {
  return this.http.post<any>(
    environment.url + '/Power/Add',
    body,
    { headers: this.headers }
  );
}
UpdatePower(body : any): Observable<any> {
  return this.http.post<any>(
    environment.url + '/Power/Update',
    body,
    { headers: this.headers }
  );
}
UpdatePowerStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
  return this.http.post<any>(
    environment.url + '/Power/UpdateStatus',
    JSON.stringify(UpdateStatusModel),
    { headers: this.headers }
  );
}

//#endregion

//#region Product Print API's

GetAllPrints(): Observable<any> {
  return this.http.get<any>(environment.url + '/Print/GetAll', {
    headers: this.headers,
  });
}
AddPrint(body : any): Observable<any> {
  return this.http.post<any>(
    environment.url + '/Print/Add',
    body,
    { headers: this.headers }
  );
}
UpdatePrint(body : any): Observable<any> {
  return this.http.post<any>(
    environment.url + '/Print/Update',
    body,
    { headers: this.headers }
  );
}
UpdatePrintStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
  return this.http.post<any>(
    environment.url + '/Print/UpdateStatus',
    JSON.stringify(UpdateStatusModel),
    { headers: this.headers }
  );
}

//#endregion

//#region Product Capacity API's

GetAllCapacity(): Observable<any> {
  return this.http.get<any>(environment.url + '/Capacity/GetAll', {
    headers: this.headers,
  });
}
AddCapacity(body : any): Observable<any> {
  return this.http.post<any>(
    environment.url + '/Capacity/Add',
    body,
    { headers: this.headers }
  );
}
UpdateCapacity(body : any): Observable<any> {
  return this.http.post<any>(
    environment.url + '/Capacity/Update',
    body,
    { headers: this.headers }
  );
}
UpdateCapacityStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
  return this.http.post<any>(
    environment.url + '/Capacity/UpdateStatus',
    JSON.stringify(UpdateStatusModel),
    { headers: this.headers }
  );
}

//#endregion

//#region Product Packaging API's

GetAllPackaging(): Observable<any> {
  return this.http.get<any>(environment.url + '/Packaging/GetAll', {
    headers: this.headers,
  });
}
AddPackaging(body : any): Observable<any> {
  return this.http.post<any>(
    environment.url + '/Packaging/Add',
    body,
    { headers: this.headers }
  );
}
UpdatePackaging(body : any): Observable<any> {
  return this.http.post<any>(
    environment.url + '/Packaging/Update',
    body,
    { headers: this.headers }
  );
}
UpdatePackagingStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
  return this.http.post<any>(
    environment.url + '/Packaging/UpdateStatus',
    JSON.stringify(UpdateStatusModel),
    { headers: this.headers }
  );
}

//#endregion

//#region Size API's

GetAllSizes(): Observable<any> {
  return this.http.get<any>(environment.url + '/Size/GetAll', {
    headers: this.headers,
  });
}
AddSize(body : any): Observable<any> {
  return this.http.post<any>(
    environment.url + '/Size/Add',
    body,
    { headers: this.headers }
  );
}
UpdateSize(body : any): Observable<any> {
  return this.http.post<any>(
    environment.url + '/Size/Update',
    body,
    { headers: this.headers }
  );
}
UpdateSizeStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
  return this.http.post<any>(
    environment.url + '/Size/UpdateStatus',
    JSON.stringify(UpdateStatusModel),
    { headers: this.headers }
  );
}

//#endregion
 
//#region Connecter Type API's

 GetAllConnecterTypes(): Observable<any> {
  return this.http.get<any>(environment.url + '/ConnecterType/GetAll', {
    headers: this.headers,
  });
}
AddConnecterType(body : any): Observable<any> {
  return this.http.post<any>(
    environment.url + '/ConnecterType/Add',
    body,
    { headers: this.headers }
  );
}
UpdateConnecterType(body : any): Observable<any> {
  return this.http.post<any>(
    environment.url + '/ConnecterType/Update',
    body,
    { headers: this.headers }
  );
}
UpdateConnecterTypeStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
  return this.http.post<any>(
    environment.url + '/ConnecterType/UpdateStatus',
    JSON.stringify(UpdateStatusModel),
    { headers: this.headers }
  );
}

//#endregion



 
//#region Product Brands API's

   GetAllBrands(): Observable<any> {
    return this.http.get<any>(environment.url + '/Brand/GetAll', {
      headers: this.headers,
    });
  }
  AddBrand(BrandModel: Brand): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Brand/Add',
      JSON.stringify(BrandModel),
      { headers: this.headers }
    );
  }
  UpdateBrand(BrandModel: Brand): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Brand/Update',
      JSON.stringify(BrandModel),
      { headers: this.headers }
    );
  }
  UpdateBrandStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Brand/UpdateStatus',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }

  GetDropDownDataBrand(): Observable<any> {
    return this.http.get<any>(environment.url + '/Brand/GetDropDownData', {
      headers: this.headers,
    });
  }
  //#endregion
 
  //#region Product Code API's

  GetAllCodes(): Observable<any> {
    return this.http.get<any>(environment.url + '/Size/GetAll', {
      headers: this.headers,
    });
  }
  AddCode(SizeModel: Size): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Size/Add',
      JSON.stringify(SizeModel),
      { headers: this.headers }
    );
  }
  UpdateCode(SizeModel: Size): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Size/Update',
      JSON.stringify(SizeModel),
      { headers: this.headers }
    );
  }
  UpdateCodeStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Size/UpdateStatus',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }

  //#endregion

  //#region Product Quality Label API's

  GetAllQualityLabels(): Observable<any> {
    return this.http.get<any>(environment.url + '/ProductQuality/GetAll', {
      headers: this.headers,
    });
  }
  AddQualityLabel(ProductQualityModel: ProductQuality): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductQuality/Add',
      JSON.stringify(ProductQualityModel),
      { headers: this.headers }
    );
  }
  UpdateQualityLabel(ProductQualityModel: ProductQuality): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductQuality/Update',
      JSON.stringify(ProductQualityModel),
      { headers: this.headers }
    );
  }
  UpdateQualityLabelStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductQuality/UpdateStatus',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }

  //#endregion

  //#region Product Model API's

  GetAllProductModels(): Observable<any> {
    return this.http.get<any>(environment.url + '/ProductModel/GetAll', {
      headers: this.headers,
    });
  }
  AddProductModel(productModel: ProductModel): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductModel/Add',
      JSON.stringify(productModel),
      { headers: this.headers }
    );
  }
  UpdateProductModel(productModel: ProductModel): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductModel/Update',
      JSON.stringify(productModel),
      { headers: this.headers }
    );
  }
  UpdateProductModelStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductModel/UpdateStatus',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }

  //#endregion

  //#region Discount Groups API's

  GetAllDiscountGroups(): Observable<any> {
    return this.http.get<any>(environment.url + '/DiscountGroup/GetAll', {
      headers: this.headers,
    });
  }
  AddDiscountGroup(DiscountGroupModel: DiscountGroup): Observable<any> {
    return this.http.post<any>(
      environment.url + '/DiscountGroup/Add',
      JSON.stringify(DiscountGroupModel),
      { headers: this.headers }
    );
  }
  UpdateDiscountGroup(DiscountGroupModel: DiscountGroup): Observable<any> {
    return this.http.post<any>(
      environment.url + '/DiscountGroup/Update',
      JSON.stringify(DiscountGroupModel),
      { headers: this.headers }
    );
  }
  UpdateDiscountGroupStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/DiscountGroup/UpdateStatus',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }

  //#region Discount Group Product Wise
  GetAllProductsByDiscountID(ID : any): Observable<any> {
    return this.http.post<any>(
      environment.url +
      '/DiscountGroup/GetAllGroupDiscountProductWiseByDiscountGroupID',
      ID,
      { headers: this.headers }
    );
  }
  AddProducDiscount(
    GroupDiscountProductWiseModel: GroupDiscountProductWise
  ): Observable<any> {
    return this.http.post<any>(
      environment.url + '/DiscountGroup/AddGroupDiscountProductWise',
      JSON.stringify(GroupDiscountProductWiseModel),
      { headers: this.headers }
    );
  }
  UpdateProductDiscount(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/DiscountGroup/UpdateGroupDiscountProductWise',
      body,
      { headers: this.headers }
    );
  }
  UpdateProductDiscountStatus(
    UpdateStatusModel: UpdateStatus
  ): Observable<any> {
    return this.http.post<any>(
      environment.url + '/DiscountGroup/UpdateGroupDiscountProductWiseStatus',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }

  //#endregion

  //#endregion

  //#region Location Warehouse API's

  GetAllWarehouses(): Observable<any> {
    return this.http.get<any>(environment.url + '/WareHouse/GetAll', {
      headers: this.headers,
    });
  }
  GetWarehouseDropDownData(): Observable<any> {
    return this.http.get<any>(environment.url + '/WareHouse/GetDropDownData', {
      headers: this.headers,
    });
  }
  AddWarehouse(WareHouseModel: WareHouse): Observable<any> {
    return this.http.post<any>(
      environment.url + '/WareHouse/Add',
      JSON.stringify(WareHouseModel),
      { headers: this.headers }
    );
  }
  UpdateWarehouse(WareHouseModel: WareHouse): Observable<any> {
    return this.http.post<any>(
      environment.url + '/WareHouse/Update',
      JSON.stringify(WareHouseModel),
      { headers: this.headers }
    );
  }
  UpdateWarehouseStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/WareHouse/UpdateStatus',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }

  //#endregion

  //#region Location Zones API's

  GetAllZones(): Observable<any> {
    return this.http.get<any>(environment.url + '/Zone/GetAll', {
      headers: this.headers,
    });
  }
  AddZone(ZoneModel: Zone): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Zone/Add',
      JSON.stringify(ZoneModel),
      { headers: this.headers }
    );
  }
  SaveActivityLog(data: any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ActivityLog/InsertActivityLog',
      JSON.stringify(data),
      { headers: this.headers }
    );
  }
  UpdateZone(ZoneModel: Zone): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Zone/Update',
      JSON.stringify(ZoneModel),
      { headers: this.headers }
    );
  }
  UpdateZoneStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Zone/UpdateStatus',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }

  //#endregion

  //#region Country API's

  GetAllCountries(): Observable<any> {
    return this.http.get<any>(environment.url + '/Country/GetAll', {
      headers: this.headers,
    });
  }
  GetCountriesForDropdown(): Observable<any> {
    return this.http.get<any>(environment.url + '/Country/GetDropDownData', {
      headers: this.headers,
    });
  }
  AddCountry(CountryModel: Country): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Country/Add',
      JSON.stringify(CountryModel),
      { headers: this.headers }
    );
  }
  UpdateCountry(CountryModel: Country): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Country/Update',
      JSON.stringify(CountryModel),
      { headers: this.headers }
    );
  }
  UpdateCountryStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Country/UpdateStatus',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }

  //#endregion

  //#region States API's

  GetAllStates(): Observable<any> {
    return this.http.get<any>(environment.url + '/State/GetAll', {
      headers: this.headers,
    });
  }
  GetStatesForDropdown(): Observable<any> {
    return this.http.get<any>(environment.url + '/State/GetDropDownData', {
      headers: this.headers,
    });
  }
  GetStatesForDropdownByCountryId(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/State/GetDropDownDataByCountryID',
      body,
      { headers: this.headers }
    );
  }
  AddState(StateModel: State): Observable<any> {
    return this.http.post<any>(
      environment.url + '/State/Add',
      JSON.stringify(StateModel),
      { headers: this.headers }
    );
  }
  UpdateState(StateModel: State): Observable<any> {
    return this.http.post<any>(
      environment.url + '/State/Update',
      JSON.stringify(StateModel),
      { headers: this.headers }
    );
  }
  UpdateStateStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/State/UpdateStatus',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }

  //#endregion

  //#region City API's

  GetAllCities(): Observable<any> {
    return this.http.get<any>(environment.url + '/City/GetAll', {
      headers: this.headers,
    });
  }
  GetCitiesForDropdown(): Observable<any> {
    return this.http.get<any>(environment.url + '/City/GetDropDownData', {
      headers: this.headers,
    });
  }
  GetCitiesForDropdownByStateId(StateId : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/City/GetDropDownDataByStateID', StateId,
      { headers: this.headers }
    );
  }
  AddCity(CityModel: City): Observable<any> {
    return this.http.post<any>(
      environment.url + '/City/Add',
      JSON.stringify(CityModel),
      { headers: this.headers }
    );
  }
  UpdateCity(CityModel: City): Observable<any> {
    return this.http.post<any>(
      environment.url + '/City/Update',
      JSON.stringify(CityModel),
      { headers: this.headers }
    );
  }
  UpdateCityStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/City/UpdateStatus',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }

  //#endregion

  //#region   Client Source API's

  // GetAllClientSource(): Observable<any> {
  //   return this.http.get<any>(environment.url + '/ClientSource/GetAll', {
  //     headers: this.headers,
  //   });
  // }

  // AddClientSource(ClientSourceModel: ClientSource): Observable<any> {
  //   return this.http.post<any>(
  //     environment.url + '/ClientSource/Add',
  //     JSON.stringify(ClientSourceModel),
  //     { headers: this.headers }
  //   );
  // }
  // UpdateClientSource(ClientSourceModel: ClientSource): Observable<any> {
  //   return this.http.post<any>(
  //     environment.url + '/ClientSource/Update',
  //     JSON.stringify(ClientSourceModel),
  //     { headers: this.headers }
  //   );
  // }
  // UpdateClientSourceStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
  //   return this.http.post<any>(
  //     environment.url + '/ClientSource/UpdateStatus',
  //     JSON.stringify(UpdateStatusModel),
  //     { headers: this.headers }
  //   );
  // }

  //#endregion

  //#region   Payment Condition API's
  GetAllPaymentCondition(): Observable<any> {
    return this.http.get<any>(environment.url + '/PaymentCondition/GetAll', {
      headers: this.headers,
    });
  }

  AddPaymentCondition(
    PaymentConditionModel: PaymentCondition
  ): Observable<any> {
    return this.http.post<any>(
      environment.url + '/PaymentCondition/Add',
      JSON.stringify(PaymentConditionModel),
      { headers: this.headers }
    );
  }
  UpdatePaymentCondition(
    PaymentConditionModel: PaymentCondition
  ): Observable<any> {
    return this.http.post<any>(
      environment.url + '/PaymentCondition/Update',
      JSON.stringify(PaymentConditionModel),
      { headers: this.headers }
    );
  }
  UpdatePaymentConditionStatus(
    UpdateStatusModel: UpdateStatus
  ): Observable<any> {
    return this.http.post<any>(
      environment.url + '/PaymentCondition/UpdateStatus',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }

  // //#endregion

  // //#region   Delivery Method API's
  // GetAllDeliveryMethod(): Observable<any> {
  //   return this.http.get<any>(environment.url + '/ShippingMethod/GetAll', {
  //     headers: this.headers,
  //   });
  // }

  // AddDeliveryMethod(DeliveryMethodModel: DeliveryMethod): Observable<any> {
  //   return this.http.post<any>(
  //     environment.url + '/ShippingMethod/Add',
  //     JSON.stringify(DeliveryMethodModel),
  //     { headers: this.headers }
  //   );
  // }
  // UpdateDeliveryMethod(DeliveryMethodModel: DeliveryMethod): Observable<any> {
  //   return this.http.post<any>(
  //     environment.url + '/ShippingMethod/Update',
  //     JSON.stringify(DeliveryMethodModel),
  //     { headers: this.headers }
  //   );
  // }
  // UpdateDeliveryMethodStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
  //   return this.http.post<any>(
  //     environment.url + '/ShippingMethod/UpdateStatus',
  //     JSON.stringify(UpdateStatusModel),
  //     { headers: this.headers }
  //   );
  // }

  // //#endregion

  //#region Role API's
  GetAllRoles(): Observable<any> {
    return this.http.get<any>(environment.url + '/Role/GetAll', {
      headers: this.headers,
    });
  }

  AddRole(RoleModel: Role): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Role/Add',
      JSON.stringify(RoleModel),
      { headers: this.headers }
    );
  }
  UpdateRole(RoleModel: Role): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Role/Update',
      JSON.stringify(RoleModel),
      { headers: this.headers }
    );
  }

  //#endregion

  //#region  Expense Overview API's

  GetAllExpenses(): Observable<any> {
    return this.http.get<any>(environment.url + '/Expense/GetAll', {
      headers: this.headers,
    });
  }

  GetExpenseTypesForDropdown(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/ExpenseType/GetDropDownData',
      { headers: this.headers }
    );
  }

  AddExpense(ExpenseModel: Expense): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Expense/Add',
      JSON.stringify(ExpenseModel),
      { headers: this.headers }
    );
  }
  UpdateExpense(ExpenseModel: Expense): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Expense/Update',
      JSON.stringify(ExpenseModel),
      { headers: this.headers }
    );
  }
  UpdateExpenseStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Expense/UpdateStatus',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }

  //#endregion
  //#region   Expense Type API's
  GetAllExpenseType(): Observable<any> {
    return this.http.get<any>(environment.url + '/ExpenseType/GetAll', {
      headers: this.headers,
    });
  }

  AddExpenseType(ExpenseTypeModel: ExpenseType): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ExpenseType/Add',
      JSON.stringify(ExpenseTypeModel),
      { headers: this.headers }
    );
  }
  UpdateExpenseType(ExpenseTypeModel: ExpenseType): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ExpenseType/Update',
      JSON.stringify(ExpenseTypeModel),
      { headers: this.headers }
    );
  }
  UpdateExpenseTypeStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ExpenseType/UpdateStatus',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }
  GetWagesExpenseByID(requestIDModel: RequestIDModel): Observable<any> {
    return this.http.post<any>(
      environment.url + '/WagesExpense/GetByID',
      JSON.stringify(requestIDModel),
      { headers: this.headers }
    );
  }

  //#endregion

  //#region  Outlet API's
  GetAllOutlet(): Observable<any> {
    return this.http.get<any>(environment.url + '/Outlet/GetAll', {
      headers: this.headers,
    });
  }
  AddOutlet(OutletModel: Outlet): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Outlet/Add',
      JSON.stringify(OutletModel),
      { headers: this.headers }
    );
  }
  UpdateOutlet(OutletModel: Outlet): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Outlet/Update',
      JSON.stringify(OutletModel),
      { headers: this.headers }
    );
  }
  UpdateOutletStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Outlet/UpdateStatus',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }
  // in the below service list of all outlets including headquarter
  GetOutletForDropdown(): Observable<any> {
    return this.http.get<any>(environment.url + '/Outlet/GetDropDownData', {
      headers: this.headers,
    });
  }
  // in the below service list of all outlets excluding headquarter
  GetOutletForDropdownWithoutHeadQuarter(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/Outlet/GetDropDownDataOfOutlet',
      { headers: this.headers }
    );
  }

  //#endregion

  //#region  Cash Register API's
  GetAllCashRegister(): Observable<any> {
    return this.http.get<any>(environment.url + '/CashRegister/GetAll', {
      headers: this.headers,
    });
  }
  AddCashRegister(CashRegisterModel: CashRegister): Observable<any> {
    return this.http.post<any>(
      environment.url + '/CashRegister/Add',
      JSON.stringify(CashRegisterModel),
      { headers: this.headers }
    );
  }
  UpdateCashRegister(CashRegisterModel: CashRegister): Observable<any> {
    return this.http.post<any>(
      environment.url + '/CashRegister/Update',
      JSON.stringify(CashRegisterModel),
      { headers: this.headers }
    );
  }
  UpdateCashRegisterStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/CashRegister/UpdateStatus',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }
  GetCashRegisterForDropdown(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/CashRegister/GetDropDownData',
      { headers: this.headers }
    );
  }
  CheckUserOpenCashRegisterByUserID(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/CashRegister/CheckUserOpenCashRegisterByUserID',
      body,
      { headers: this.headers }
    );
  }

  //#endregion

  //#region  Manage Wadges

  GetAllExpenseWages(): Observable<any> {
    return this.http.get<any>(environment.url + '/WagesExpense/GetAll', {
      headers: this.headers,
    });
  }

  AddExpenseWage(ExpenseWageModel: ExpenseWage): Observable<any> {
    return this.http.post<any>(
      environment.url + '/WagesExpense/Add',
      JSON.stringify(ExpenseWageModel),
      { headers: this.headers }
    );
  }
  UpdateExpenseWage(ExpenseWageModel: ExpenseWage): Observable<any> {
    return this.http.post<any>(
      environment.url + '/WagesExpense/Update',
      JSON.stringify(ExpenseWageModel),
      { headers: this.headers }
    );
  }
  UpdateExpenseWageStatus(ExpenseWageModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/WagesExpense/UpdateStatus',
      JSON.stringify(ExpenseWageModel),
      { headers: this.headers }
    );
  }

  //#endregion

  //#region  Section API's
  GetAllSections(): Observable<any> {
    return this.http.get<any>(environment.url + '/Section/GetAll', {
      headers: this.headers,
    });
  }

  GetZonesByWarehouseIDForDropdown(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Zone/GetByWareHouseID',
      body,
      { headers: this.headers }
    );
  }

  AddSection(SectionModel: Section): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Section/Add',
      JSON.stringify(SectionModel),
      { headers: this.headers }
    );
  }
  UpdateSection(SectionModel: Section): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Section/Update',
      JSON.stringify(SectionModel),
      { headers: this.headers }
    );
  }
  UpdateSectionStatus(ExpenseWageModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Section/UpdateStatus',
      JSON.stringify(ExpenseWageModel),
      { headers: this.headers }
    );
  }

  //#endregion

  //#region  Levels API's
  GetAllLevel(): Observable<any> {
    return this.http.get<any>(environment.url + '/Level/GetAll', {
      headers: this.headers,
    });
  }
  GetAllLevelTotalCount(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/Level/GetAllLevelTotalCount', body, {
      headers: this.headers,
    });
  }
  GetAllLevelPagination(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/Level/GetAllLevelPagination',
      body,
      {
        headers: this.headers,
      });
  }
  GetSectionsByZoneIDForDropdown(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/Section/GetByZoneID', body, {
      headers: this.headers,
    });
  }
  GetLevelsBySectionID(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/Level/GetAvailibleBySectionID', body, {
      headers: this.headers,
    });
  }
  GetAllLevelsBySectionID(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/Level/GetBySectionID', body, {
      headers: this.headers,
    });
  }
  AddLevel(LevelModel: Level): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Level/Add',
      JSON.stringify(LevelModel),
      { headers: this.headers }
    );
  }
  UpdateLevel(LevelModel: Level): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Level/Update',
      JSON.stringify(LevelModel),
      { headers: this.headers }
    );
  }
  UpdateLevelStatus(ExpenseWageModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Level/UpdateStatus',
      JSON.stringify(ExpenseWageModel),
      { headers: this.headers }
    );
  }

  //#endregion

  //#region User Services

  UserLogin(loginmodel: Login): Observable<any> {
    return this.http.post<any>(
      environment.url + '/User/Login',
      JSON.stringify(loginmodel),
      { headers: this.headers }
    );
  }
  AddUser(userModel: UserModel): Observable<any> {
    return this.http.post<any>(
      environment.url + '/User/AddForNewUI',
      JSON.stringify(userModel),
      { headers: this.headers }
    );
  }

  UpdateUser(userModel: UserModel): Observable<any> {
    return this.http.post<any>(
      environment.url + '/User/UpdateForNewUI',
      JSON.stringify(userModel),
      { headers: this.headers }
    );
  }
  AssignRoleToUser(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/User/AssignRoleToUser',
      body,
      { headers: this.headers }
    );
  }
  UpdateUserStatus(updateStatus: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/User/UpdateStatus',
      JSON.stringify(updateStatus),
      { headers: this.headers }
    );
  }
  GetUserByID(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/User/GetByID', body, {
      headers: this.headers,
    });
  }
  GetUserByEmail(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/User/GetByUserEmail', body, {
      headers: this.headers,
    });
  }
  GetUsersForDropdown(): Observable<any> {
    return this.http.get<any>(environment.url + '/User/GetDropDownData', {
      headers: this.headers,
    });
  }
  GetDeliveryPersonForDropdown(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/User/GetDeliveryPersonDropDownData',
      { headers: this.headers }
    );
  }
  GetAllUsers(): Observable<any> {
    return this.http.get<any>(environment.url + '/User/GetAll', {
      headers: this.headers,
    });
  }
  ChangeUserPassword(
    changepasswordRequest: ChangePasswordRequest
  ): Observable<any> {
    return this.http.post<any>(
      environment.url + '/User/ChangePassword',
      changepasswordRequest,
      { headers: this.headers }
    );
  }
  ChangePasswordBySuperadmin(
    changepasswordRequest: ChangePasswordRequest
  ): Observable<any> {
    return this.http.post<any>(
      environment.url + '/User/ChangePasswordBySuperadmin',
      changepasswordRequest,
      { headers: this.headers }
    );
  }
  ChangePaymentPasswordBySuperadmin(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/User/ChangePaymentPasswordBySuperadmin',
      body,
      { headers: this.headers }
    );
  }
  GetAllPaymentPasswordRecords(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/User/GetAllPaymentPasswordRecords', 
     {headers: this.headers}
     );
  }
  //#endregion

  //#region Internal Order

  GetAllInternalOrderList(
    filterRequestModel: FilterRequestModel
  ): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Wishlist/GetAllByFilter',
      filterRequestModel,
      { headers: this.headers }
    );
  }

  GetProductDropDownDatawithVariantInfo(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/ProductVariant/GetProductDropDownDatawithVariantInfo',
      { headers: this.headers }
    );
  }

  GetProductDropDownDatawithVariantInfoForReseller(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductVariant/GetProductDropDownDatawithVariantInfoForReseller',
      body,
      { headers: this.headers }
    );
  }

  GetProductDropDownDatawithVariantInfoActiveInactive(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/ProductVariant/GetProductDropDownDatawithVariantInfoActiveInactive',
      { headers: this.headers }
    );
  }
  GetPurchaseProduct(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/ProductVariant/GetAll',
      { headers: this.headers }
    );
  }
  
  GetPurchaseProductWithStock(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/ProductVariant/GetAllByStock',
      { headers: this.headers }
    );
  }

  AddUpdateProductIncomingQuantity(model: ProductIncomingQuantityModel): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Product/AddUpdateProductIncomingQuantity',
      model,
      { headers: this.headers }
    );
  }

  AddWishlist(wishlistModel: WishlistModel): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Wishlist/Add',
      wishlistModel,
      { headers: this.headers }
    );
  }
  UpdateWishlist(wishlistModel: WishlistModel): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Wishlist/Update',
      wishlistModel,
      { headers: this.headers }
    );
  }
  UpdateWishlistStatusToPurchased(updateStatus: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Wishlist/UpdateStatusToPurchased',
      updateStatus,
      { headers: this.headers }
    );
  }
  UpdateWishlistStatusToApproved(updateStatus: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Wishlist/UpdateStatusToApproved',
      updateStatus,
      { headers: this.headers }
    );
  }
  UpdateWishlistStatusToRejected(updateStatus: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Wishlist/UpdateStatusToRejected',
      updateStatus,
      { headers: this.headers }
    );
  }

  //#endregion

  //#region  Available Stock API's

  GetDepartmentsForDropDown(): Observable<any> {
    return this.http.get<any>(environment.url + '/Department/GetDropDownData', {
      headers: this.headers,
    });
  }
  GetSubCategoriesForDropDown(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/SubCategory/GetDropDownData',
      { headers: this.headers }
    );
  }

  GetProductVariantsForDropDown(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductVariant/GetDropDownDataByProductID',
      body,
      { headers: this.headers }
    );
  }

  GetAllSalesByFiltersTotalCount(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Sale/GetAllByFiltersTotalCount',
      body,
      { headers: this.headers }
    );
  }

  GetAllIDsForPrinting(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Sale/GetAllIDsForPrinting',
      body,
      { headers: this.headers }
    );
  }

  GetAllNotPrintedSales(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Sale/GetAllNotPrintedSales',
      body,
      { headers: this.headers }
    );
  }

  GetAllNotPrintedPackingSlip(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Sale/GetAllNotPrintedPackingSlip',
      body,
      { headers: this.headers }
    );
  }

  GetProductStockListTotalCount(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetProductStockListTotalCount',
      body,
      { headers: this.headers }
    );
  }

  GetAllProductStockPurchaseWiseTotalCount(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetAllProductStockPurchaseWiseTotalCount',
      body,
      { headers: this.headers }
    );
  }
  GetAllProductStockOverallPurchaseWise(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetAllProductStockOverallPurchaseWise',
      body,
      { headers: this.headers }
    );
  }
  GetAllProductStockOverall(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetAllProductStockOverall',
      body,
      { headers: this.headers }
    );
  }
  GetAllProductStockOverallForAngularUI(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetAllProductStockOverallForAngularUI',
      body,
      { headers: this.headers }
    );
  }

  GetStockReportByCategoryFilters(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetStockReportByCategoryFilters',
      body,
      { headers: this.headers }
    );
  }
  GetShopCategoryForDropdown(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/ShopCategory/GetDropDownData',

      { headers: this.headers }
    );
  }

  GetAllStockByShopCategoryID(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductVariant/GetAllByShopCategoryID',
      body,
      { headers: this.headers }
    );
  }

  GetTrackableProductLocationDetailTotalCountReport(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetTrackableProductLocationDetailTotalCountReport',
      body,
      { headers: this.headers }
    );
  }
  GetTrackableProductLocationDetailReport(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetTrackableProductLocationDetailReport',
      body,
      { headers: this.headers }
    );
  }

  GetNonTrackableProductLocationTotalCountReport(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetNonTrackableProductLocationTotalCountReport',
      body,
      { headers: this.headers }
    );
  }
  GetNonTrackableProductLocationTotalCountReportNew(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetNonTrackableProductLocationTotalCountReportNew',
      body,
      { headers: this.headers }
    );
  }
  GetNonTrackableProductLocationReportByProduct(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetNonTrackableProductLocationReportByProduct',
      body,
      { headers: this.headers }
    );
  }
  GetNonTrackableProductLocationReport(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetNonTrackableProductLocationReport',
      body,
      { headers: this.headers }
    );
  }
  GetNonTrackableProductLocationReportNew(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetNonTrackableProductLocationReportNew',
      body,
      { headers: this.headers }
    );
  }
  GetSupplierInvoicePaymentHistory(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/Report/GetSupplierInvoicePaymentHistory',

      { headers: this.headers }
    );
  }
  GetOnlineCustomerDetail(filterRequestModel: FilterRequestModel): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Sale/GetOnlineCustomerDetail',
      filterRequestModel,
      { headers: this.headers }
    );
  }
  AddMultipleCustomer(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Customer/AddMultiple',
      body,
      { headers: this.headers }
    );
  }
  GetProductModelListData(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/ProductModel/GetAll',
      { headers: this.headers }
    );
  }
  AddMultipleSupplier(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Supplier/AddMultiple',
      body,
      { headers: this.headers }
    );
  }
  GetAllBySupplierInvoiceNO(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Purchase/GetAllBySupplierInvoiceNO',
      body,
      { headers: this.headers }
    );
  }
  GetAllSalesByFilters(body : any): Observable<any> {
    console.log('body is ', body)
    return this.http.post<any>(
      environment.url + '/Sale/GetAllByFilters',
      body,
      { headers: this.headers }
    );
  }
  GetAllActivity(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ActivityLog/GetAllByFilter',
      body,
      { headers: this.headers }
    );
  }
  GetAllActivityByFilterForLifeLineReports(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ActivityLog/GetAllByFilterForLifeLineReports',
      body,
      { headers: this.headers }
    );
  }
  GetCashInOutByFilter(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetCashInOutByFilter',
      body,
      { headers: this.headers }
    );
  }

  GetAllOpenCartLogs(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/OpenCart/GetAllOpenCartLogs',
      body,
      { headers: this.headers }
    );
  }

  GetStockAlertReportByFilters(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetStockAlertReportByFilters',
      body,
      { headers: this.headers }
    );
  }

  GetSaleByID(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Sale/GetByID',
      body,
      { headers: this.headers }
    );
  }

  HalfSaleReturn(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ReturnSale/HalfSaleReturn',
      body,
      { headers: this.headers }
    );
  }
  FullSaleReturn(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ReturnSale/FullSaleReturn',
      body,
      { headers: this.headers }
    );
  }
  GetAllByFiltersTotalCount(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Purchase/GetAllByFiltersTotalCount',
      body,
      { headers: this.headers }
    );
  }
  GetAllByFiltersTotalCountByRemarks(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Purchase/GetAllByFiltersTotalCountByRemarks',
      body,
      { headers: this.headers }
    );
  }
  GetAllByModelsTotalCount(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductVariant/GetAllByModelsTotalCount',
      body,
      { headers: this.headers }
    );
  }
  
  GetAllByModelsPagination(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductVariant/GetAllByModelsPagination',
      body,
      { headers: this.headers }
    );
  }
  GetAllPurchaseByFilters(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Purchase/GetAllByFilters',
      body,
      { headers: this.headers }
    );
  }
  GetAllByFiltersByRemarks(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Purchase/GetAllByFiltersByRemarks',
      body,
      { headers: this.headers }
    );
  }
  GetPurchaseById(body : any): Observable<any> {

    return this.http.post<any>(
      environment.url + `/Purchase/GetByPurchaseID`,
      body,
      { headers: this.headers }
    );
  }
  
  GetOpenPurchaseById(body : any): Observable<any> {

    return this.http.post<any>(
      environment.url + `/OpenPurchase/GetByPurchaseID`,
      body,
      { headers: this.headers }
    );
  }
  GetHelpById(body : any): Observable<any> {

    return this.http.post<any>(
      environment.url + `/Help/GetByID`,
      body,
      { headers: this.headers }
    );
  }
  GetReturnPurchaseByID(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ReturnPurchase/GetByReturnPurchaseID',
      body,
      { headers: this.headers }
    );
  }
  FullPurchaseReturn(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ReturnPurchase/FullPurchaseReturn',
      body,
      { headers: this.headers }
    );
  }
  HalfPurchaseReturn(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ReturnPurchase/HalfPurchaseReturn',
      body,
      { headers: this.headers }
    );
  }
  GetAllReturnPurchaseByFilters(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ReturnPurchase/GetAllByFilters',
      body,
      { headers: this.headers }
    );
  }

  GetAllOpenSalesByFilters(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/OpenSale/GetAllByFilters',
      body,
      { headers: this.headers }
    );
  }
  GetAllOpenPurchasesByFilters(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/OpenPurchase/GetAllByFilters',
      body,
      { headers: this.headers }
    );
  }
  GetOpenSalesByID(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/OpenSale/GetByID',
      body,
      { headers: this.headers }
    );
  }
  DeleteOpenSale(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/OpenSale/Delete',
      body,
      { headers: this.headers }
    );  
  }
  DeleteOpenPurchase(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/OpenPurchase/Delete',
      body,
      { headers: this.headers }
    );
  }
  DeleteAllBackupByFilter(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/User/DeleteAllBackupByFilter',
      body,
      { headers: this.headers }
    );
  }
  DeleteAllOpenPurchaseByFilter(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/OpenPurchase/DeleteAllByFilter',
      body,
      { headers: this.headers }
    );
  }
  DeleteAllByFilter(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/OpenSale/DeleteAllByFilter',
      body,
      { headers: this.headers }
    );
  }
  GetAllPerfomaSaleByFilters(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/PerfomaSale/GetAllByFilters',
      body,
      { headers: this.headers }
    );
  }
  UpdatePerformaSalesStatus(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/PerfomaSale/UpdatePerformaSalesStatus',
      body,
      { headers: this.headers }
    );
  }

  GetAllReturnSaleByFilters(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ReturnSale/GetAllByFilters',
      body,
      { headers: this.headers }
    );
  }
  GetSaleReportOfProductByFilters(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetSaleReportOfProductByFilters',
      body,
      { headers: this.headers }
    );
  }
  GetSaleReportOfUsersByFilters(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetSaleReportOfUsersByFilters',
      body,
      { headers: this.headers }
    );
  }
  GetSaleReportOfSubCategoryByFilters(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetSaleReportOfSubCategoryByFilters',
      body,
      { headers: this.headers }
    );
  }
  GetSaleDashboardReportByFilters(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetSaleDashboardReportByFilters',
      body,
      { headers: this.headers }
    );
  }
  GetSaleDashboardReportNewByFilters(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetSaleDashboardReportNewByFilters',
      body,
      { headers: this.headers }
    );
  }
  GetAllCustomer(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/Customer/GetAll',
      { headers: this.headers }
    );
  }
  GetAllbyFilter(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Customer/GetAllByFilter',
      body,
      { headers: this.headers }
    );
  }
  GetAllBlacklisted(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Customer/GetAllBlacklisted',
      body,
      { headers: this.headers }
    );
  }
  DeleteCustomer(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Customer/Delete',
      body,
      { headers: this.headers }
    );
  }

  ReverseCustomerPaymentExtras(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Customer/ReverseCustomerPaymentExtras',
      body,
      { headers: this.headers }
    );
  }

  DeleteSupplier(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Supplier/Delete',
      body,
      { headers: this.headers }
    );
  }
  PostFailsRequestAgain(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/OpenCart/PostFailsRequestAgain',
      body,
      { headers: this.headers }
    );
  }
  GetCustomerReportByAddressFilter(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Customer/GetCustomerReportByAddressFilter',
      body,
      { headers: this.headers }
    );
  }

  UpdateCustomerStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Customer/UpdateStatus',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }
  UpdateSupplierStatus(UpdateStatusModel: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Supplier/UpdateStatus',
      JSON.stringify(UpdateStatusModel),
      { headers: this.headers }
    );
  }
  GetAllSupplier(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/Supplier/GetAll',
      { headers: this.headers }
    );
  }
  GetSupplierByID(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Supplier/GetByID',
      body,
      { headers: this.headers }
    );
  }
  GetSupplierLeadgerByFilter(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Supplier/GetSupplierLeadgerByFilter',
      body,
      { headers: this.headers }
    );
  }
  GetSupplierOpenInvoices(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Supplier/GetSupplierOpenInvoices',
      body,
      { headers: this.headers }
    );
  }
  AddSupplierPayment(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Supplier/AddSupplierPayment',
      body,
      { headers: this.headers }
    );
  }
  GetCustomerLeadgerByFilter(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Customer/GetCustomerLeadgerByFilter',
      body,
      { headers: this.headers }
    );
  }
  GetCustomerReversablePayments(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Customer/GetCustomerReversablePayments',
      body,
      { headers: this.headers }
    );
  }
  GetCustomerOpenInvoicesForClearance(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Customer/GetCustomerOpenInvoicesForClearance',
      body,
      { headers: this.headers }
    );
  }
  GetCustomerAllOpenInvoices(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Customer/GetCustomerAllOpenInvoices',
      body,
      { headers: this.headers }
    );
  }
  GetSupplierAllOpenInvoices(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Supplier/GetSupplierAllOpenInvoices',
      body,
      { headers: this.headers }
    );
  }
  
  GetSupplierAllPurchases(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Supplier/GetSupplierAllPurchases',
      body,
      { headers: this.headers }
    );
  }
  AddCustomerPaymentExtras(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Customer/AddCustomerPaymentExtras',
      body,
      { headers: this.headers }
    );
  }
  AddCustomerPaymentAttachmentOnly(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Customer/AddCustomerPaymentAttachmentOnly',
      body,
      { headers: this.headers }
    );
  }
  UpdateCustomerPaymentInvoices(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Customer/UpdateCustomerPaymentInvoices',
      body,
      { headers: this.headers }
    );
  }
  GetValidationCodeRequestedByWeb(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/User/GetValidationCodeRequestedByWeb',
      body,
      { headers: this.headers }
    );
  }

  GetCustomerForDropdown(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/Customer/GetDropDownData',
      { headers: this.headers }
    );
  }
  AddCustomer(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Customer/Add',
      body,
      { headers: this.headers }
    );
  }
  UpdateCustomer(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Customer/Update',
      body,
      { headers: this.headers }
    );
  }
  AddSupplier(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Supplier/Add',
      body,
      { headers: this.headers }
    );
  }
  UpdateSupplier(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Supplier/Update',
      body,
      { headers: this.headers }
    );
  }

  //#endregion

  //#region Incoming Orders
  UpdateIncomingOrderStatus(updateStatus: UpdateStatus): Observable<any> {
    return this.http.post<any>(
      environment.url + '/PerfomaSale/UpdateStatus',
      updateStatus,
      { headers: this.headers }
    );
  }

  GetAllIncomingOrderList(
    filterRequestModel: FilterRequestModel
  ): Observable<any> {
    return this.http.post<any>(
      environment.url + '/PerfomaSale/GetAllByFilters',
      filterRequestModel,
      { headers: this.headers }
    );
  }
  //#endregion

  //#region Role Permissions

  GetAllActionsList(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/Action/GetAll',
      { headers: this.headers }
    );
  }

  GetAllActionsByRoleID(ID : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Action/GetAllActionByRoleID',
      ID,
      { headers: this.headers }
    );
  }

  AssignActionToRole(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Role/AssignActionToRole',
      body,
      { headers: this.headers }
    );
  }

  UpdateRoleActionStatus(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Role/UpdateRoleAction',
      body,
      { headers: this.headers }
    );
  }

  //#endregion

  //#region   CheckOut API's

  TransferTrackable(transferTrackable: AssignTrackableStockToOutletRequest): Observable<any> {
    return this.http.post<any>(
      environment.url + '/OutletStock/AssignTrackableStockToOutlet',
      transferTrackable,
      { headers: this.headers }
    );
  }
  TransferNonTrackable(transferNonTrackable: AssignNonTrackableStockToOutletRequest): Observable<any> {
    return this.http.post<any>(
      environment.url + '/OutletStock/AssignNonTrackableStockToOutlet',
      transferNonTrackable,
      { headers: this.headers }
    );
  }

  CheckAllProductsTrackability(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/Product/CheckAllProductsTrackability',
      { headers: this.headers }
    );
  }

  CheckAllProductsTrackaGetNonTrackableProductLocationByLevelIDbility(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/InventoryLocation/GetNonTrackableProductLocationByLevelID',
      body,
      { headers: this.headers }
    );
  }
  
  GetTrackableProducts(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/OutletStock/GetTrackableStockForOutletTransfer',
      body,
      { headers: this.headers }
    );
  }

  GetNonTrackableProducts(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/OutletStock/GetNonTrackableStockForOutletTransfer',
      body,
      { headers: this.headers }
    );
  }

  //#endregion

  GetTrackableReturnProducts(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/OutletStock/GetTrackableStockToHeadquarterTransfer',
      body,
      { headers: this.headers }
    );
  }

  GetNonTrackableReturnProducts(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/OutletStock/GetNonTrackableStockToHeadquarterTransfer',
      body,
      { headers: this.headers }
    );
  }

  ReturnTrackable(transferTrackable: AssignTrackableStockToHeadquarterRequest): Observable<any> {
    return this.http.post<any>(
      environment.url + '/OutletStock/AssignTrackableStockToHeadquarter',
      transferTrackable,
      { headers: this.headers }
    );
  }
  ReturnNonTrackable(returnNonTrackable: AssignNonTrackableStockToHeadquarterRequest): Observable<any> {
    return this.http.post<any>(
      environment.url + '/OutletStock/AssignNonTrackableStockToHeadquarter',
      returnNonTrackable,
      { headers: this.headers }
    );
  }

  GetTrackeableProductsLocation(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/InventoryLocation/GetTrackableProductLocationDetail',
      body,
      { headers: this.headers }
    );
  }

  GetNonTrackeableProductsLocation(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/InventoryLocation/GetNonTrackableProductLocationDetail',
      body,
      { headers: this.headers }
    );
  }
  GetAllDeliveryMethod(): Observable<any> {
    return this.http.get<any>(environment.url + '/ShippingMethod/GetAll', {
      headers: this.headers,
    });
  }

  GetCustomerbyID(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Customer/GetByID',
      body,
      { headers: this.headers }
    );
  }

  UpdatePrintingStatus(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Sale/UpdatePrintingStatus',
      body,
      { headers: this.headers }
    );
  }

  UpdateAllNotPrintedInvoiceStatus(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Sale/UpdateAllNotPrintedInvoiceStatus',
      body,
      { headers: this.headers }
    );
  }
  CheckReceivedPaymentPassword(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/User/CheckReceivedPaymentPassword',
      body,
      { headers: this.headers }
    );
  }

  GetPaymentPasswordById(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/User/GetPaymentPasswordById',
      body,
      { headers: this.headers }
    );
  }

  CheckValidationCode(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/User/CheckValidationCode',
      body,
      { headers: this.headers }
    );
  }

  SaveOpenSaleDetails(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/OpenSale/Add',
      body,
      { headers: this.headers }
    );
  }

  GetProductLocationByID(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/InventoryLocation/GetNonTrackableProductLocationForSale',
      body,
      { headers: this.headers }
    );
  }

  GetProductTrackablesById(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Product/GetTrackbleAgainstProductVarientID',
      body,
      { headers: this.headers }
    );
  }
  AddProduct(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Product/Add',
      body,
      { headers: this.headers }
    );
  }
  AddMultipleProduct(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Product/AddMultiple',
      body,
      { headers: this.headers }
    );
  }
   
  AddMultipleShopProduct(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Product/AddMultipleShop',
      body,
      { headers: this.headers }
    );
  }
  CorrectImages(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Product/CorrectImages',
      body,
      { headers: this.headers }
    );
  }
  UpdateProduct(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Product/Update',
      body,
      { headers: this.headers }
    );
  }

  SaveSaleDetails(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Sale/Add',
      body,
      { headers: this.headers }
    );
  }
  AddShipment(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '//Shipment/Add',
      body,
      { headers: this.headers }
    );
  }
  UpdateSalePayment(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/EditSale/UpdateSalePayment',
      body,
      { headers: this.headers }
    );
  }

  AddPerfomaSale(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/PerfomaSale/Add',
      body,
      { headers: this.headers }
    );
  }
  GetPackingSlipByID(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Sale/GetPackingSlipByID',
      body,
      { headers: this.headers }
    );
  }
  GetOnlineCustomerDetailTotalCount(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Sale/GetOnlineCustomerDetailTotalCount',
      body,
      { headers: this.headers }
    );
  }
  getSaleById(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Sale/GetByID',
      body,
      { headers: this.headers }
    );
  }
  GetOnlineOrderPackingSlipByID(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Sale/GetOnlineOrderPackingSlipByID',
      body,
      { headers: this.headers }
    );
  }

  getPerfomaSaleById(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/PerfomaSale/GetByID',
      body,
      { headers: this.headers }
    );
  }
  getOpenSaleById(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/OpenSale/GetByID',
      body,
      { headers: this.headers }
    );
  }
  GetFolderImagesById(id : any): Observable<any> {
    const obj = {
      ID: id
    };
    return this.http.post<any>(
      environment.url + '/FolderHierarchy/GetByID',
      obj,
      { headers: this.headers }
    );
  }
  GetReturnSaleByID(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ReturnSale/GetByID',
      body,
      { headers: this.headers }
    );
  }
  GetCustomerPreviousInvoices(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetSaleByCustomerByFilters',
      body,
      { headers: this.headers }
    );
  }
  GetCustomerPreviousInvoicesTotalCount(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetSaleByCustomerByFiltersTotalCount',
      body,
      { headers: this.headers }
    );
  }

  GetAllProductVariantTotalCount(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductVariant/GetAllProductVariantTotalCount',
      body,
      { headers: this.headers }
    );
  }

  GetAllProductVariantPagination(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductVariant/GetAllProductVariantPagination',
      body,
      { headers: this.headers }
    );
  }

  GetAllProductStockForSaleCount(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetAllProductStockForSaleNewTotalCount',
      body,
      { headers: this.headers }
    );
  }

  GetAllProductStockForSaleNewTotalCount(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductReporting/GetAllProductStockForSaleNewTotalCount',
      body,
      { headers: this.headers }
    );
  }

  GetAllProductStockForSaleNew(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductReporting/GetAllProductStockForSaleNew',
      body,
      { headers: this.headers }
    );
  }


  GetAllProductStockListForSale(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetAllProductStockForSaleNew',
      body,
      { headers: this.headers }
    );
  }

  GetAllCustomerProductsDiscountByCustomerID(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/DiscountGroup/GetAllCustomerProductsDiscountsByCustomerID',
      body,
      { headers: this.headers }
    );
  }

  GetAddressDetailByAPI(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/APIAddress/GetAddress',
      body,
      { headers: this.headers }
    );
  }

  GetClientSourceDropDownData(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/ClientSource/GetDropDownData',
      { headers: this.headers }
    );
  }
  GetDeliverPersonDropDownData(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/User/GetDeliveryPersonDropDownData',
      { headers: this.headers }
    );
  }
  GetDiscountGroupDropDownData(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/DiscountGroup/GetDropDownData',
      { headers: this.headers }
    );
  }
  GetShippingMethodDropDownData(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/ShippingMethod/GetDropDownData',
      { headers: this.headers }
    );
  }
  GetPaymentModeDropDownData(): Observable<any> {
    return this.http.get<any>(
      environment.url + '/PaymentMode/GetDropDownData',
      { headers: this.headers }
    );
  }
  GetCustomerOpenInvoices(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Customer/GetCustomerOpenInvoices',
      body,
      { headers: this.headers }
    );
  }
  AddCustomerPayment(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Customer/AddCustomerPayment',
      body,
      { headers: this.headers }
    );
  }
  ClearCustomerPayments(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Customer/ClearCustomerPayments',
      body,
      { headers: this.headers }
    );
  }
  GetCustomerTotalDirectPayments(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Customer/GetCustomerTotalDirectPayments',
      body,
      { headers: this.headers }
    );
  }
  UpdateCustomerProductsDiscountStatus(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/DiscountGroup/UpdateCustomerProductsDiscountStatus',
      body,
      { headers: this.headers }
    );
  }
  UpdateCustomerProductsDiscount(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/DiscountGroup/UpdateCustomerProductsDiscount',
      body,
      { headers: this.headers }
    );
  }
  AddCustomerProductWiseDiscount(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/DiscountGroup/AddCustomerProductWiseDiscount',
      body,
      { headers: this.headers }
    );
  }

  GetProductForPurchase(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductVariant/GetAll',
      body,
      { headers: this.headers }
    );
  }
  UpdatePurchaseOrderStatusToPurchase(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Purchase/UpdatePurchaseStatus',
      body,
      { headers: this.headers }
    );
  }
  GetExchangeRateDD(): Observable<any> {
    return this.http.get<any>(environment.url + '/ExchangeRate/GetDropDownData', {
      headers: this.headers,
    });
  }
  GetAllExchangeRate(): Observable<any> {
    return this.http.get<any>(environment.url + '/ExchangeRate/GetAll', {
      headers: this.headers,
    });
  }
  AddPurchase(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Purchase/Add',
      body,
      { headers: this.headers }
    );
  }
  AddOpenPurchase(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/OpenPurchase/Add',
      body,
      { headers: this.headers }
    );
  }
  GetAllProductVariantWithStockTotalCount(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductVariant/GetAllProductVariantWithStockTotalCount',
      body,
      { headers: this.headers }
    );
  }
  GetAllProductVariantWithStockPagination(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ProductVariant/GetAllProductVariantWithStockPagination',
      body,
      { headers: this.headers }
    );
  }
  SetTrackableProductLocation(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/InventoryLocation/SetTrackableProductLocation',
      body,
      { headers: this.headers }
    );
  }
  SetNonTrackableProductLocation(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/InventoryLocation/SetNonTrackableProductLocation',
      body,
      { headers: this.headers }
    );
  }

  GetAllFolderHierarchyTotalCount(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/FolderHierarchy/GetAllFolderHierarchyTotalCount',
      body, {
      headers: this.headers,
    });
  }
  GetAllFolderHierarchyPagination(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/FolderHierarchy/GetAllFolderHierarchyPagination',
      body, {
      headers: this.headers,
    });
  }
  GetAllFolderHierarchy(): Observable<any> {
    return this.http.get<any>(environment.url + '/FolderHierarchy/GetAll', {
      headers: this.headers,
    });
  }
  GetAllHelp(): Observable<any> {
    return this.http.get<any>(environment.url + '/Help/GetAll', {
      headers: this.headers,
    });
  }

  GetAllHelpByFilter(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/Help/GetAllByFilter', body, {
      headers: this.headers,
    });
  }

  GetAllBackupHistory(): Observable<any> {
    return this.http.get<any>(environment.url + '/User/GetAllBackupHistory', {
      headers: this.headers,
    });
  }
  CreateBackup(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/User/CreateBackup', body, {
      headers: this.headers,
    });
  }
  GetAllHelpActive(): Observable<any> {
    return this.http.get<any>(environment.url + '/Help/GetAllActive', {
      headers: this.headers,
    });
  }
  UpdateFolderHierarchyStatus(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/FolderHierarchy/UpdateStatus', body, {
      headers: this.headers,
    });
  }
  UpdateHelpStatus(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/Help/UpdateStatus', body, {
      headers: this.headers,
    });
  }
  DeleteHelp(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/Help/Delete', body, {
      headers: this.headers,
    });
  }
  UpdateFolderHierarchy(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/FolderHierarchy/UpdateForNewUI', body, {
      headers: this.headers,
    });
  }

  SaveFolderHierarchy(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/FolderHierarchy/AddForNewUI', body, {
      headers: this.headers,
    });
  }
  SaveHelp(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/Help/Add', body, {
      headers: this.headers,
    });
  }
  UpdateHelp(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/Help/Update', body, {
      headers: this.headers,
    });
  }
  UploadImageFolderHierarchy(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/FolderHierarchy/AddImagesByIDForNewUI', body, {
      headers: this.headers,
    });
  }
  GeTrackbleAgainstProductVariantById(body : any): Observable<any> {
    return this.http.post<any>(environment.url + '/Product/GetTrackbleAgainstProductVarientID', body, {
      headers: this.headers,
    });
  }




  GetAllShipmentTransfers(
    filterRequestModel: FilterRequestModel
  ): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Shipment/GetAllByFilters',
      filterRequestModel,
      { headers: this.headers }
    );
  }

  GetShipmentTransfersDetailsById(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Shipment/GetByID',
      body,
      { headers: this.headers }
    );
  }
  GetTrackableStockForOutletTransfer(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/OutletStock/GetTrackableStockForOutletTransfer',
      body,
      { headers: this.headers }
    );
  }
  AddShipmentDelivery(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Shipment/AddShipmentDelivery',
      body,
      { headers: this.headers }
    );
  }

  UpdateInternalShipment(shipmentModel: ShipmentModel): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Shipment/Update',
      shipmentModel,
      { headers: this.headers }
    );
  }

  GetOutLetById(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Outlet/GetByID',
      body,
      { headers: this.headers }
    );
  }

  GetTodayHeadQuarterDashBoardStatsCount(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetTodayHeadQuarterDashBoardStatsCount',
      body,
      { headers: this.headers }
    );
  }
  GetTopProductBySaleForDashboard(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetTopProductBySaleForDashboard',
      body,
      { headers: this.headers }
    );
  }
  GetTopProductBySaleForCustomerDashboard(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetTopProductBySaleForCustomerDashboard',
      body,
      { headers: this.headers }
    );
  }

  GetTopProductByPurchaseForDashboard(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetTopProductByPurchaseForDashboard',
      body,
      { headers: this.headers }
    );
  }
  GetAnnualCustomerDashboardStatsForSale(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetAnnualCustomerDashboardStatsForSale',
      body,
      { headers: this.headers }
    );
  }
  GetAnnualDashboardStatsForSale(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetAnnualDashboardStatsForSale',
      body,
      { headers: this.headers }
    );
  }
  GetAnnualDashboardStatsForPurchase(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetAnnualDashboardStatsForPurchase',
      body,
      { headers: this.headers }
    );
  }

  GetProductDetailHistoryReport(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetProductDetailHistoryReport',
      body,
      { headers: this.headers }
    );
  }

  GetProductDetailHistoryReportDetailsOnly(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetProductDetailHistoryReportDetailsOnly',
      body,
      { headers: this.headers }
    );
  }

  GetPreOrderDetailHistoryReportDetailsOnly(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetPreOrderDetailHistoryReportDetailsOnly',
      body,
      { headers: this.headers }
    );
  }

  GetPreOrderDetailHistoryReportPurchasesOnly(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetPreOrderDetailHistoryReportPurchasesOnly',
      body,
      { headers: this.headers }
    );
  }

  GetProductDetailHistoryReportPurchasesOnly(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetProductDetailHistoryReportPurchasesOnly',
      body,
      { headers: this.headers }
    );
  }

  GetProductDetailHistoryReportSalesOnly(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetProductDetailHistoryReportSalesOnly',
      body,
      { headers: this.headers }
    );
  }

  GetPerformaSalesByID(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/PerfomaSale/GetByID',
      body,
      { headers: this.headers }
    );
  }
  GetCustomerDetailHistoryReport(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetCustomerDetailHistoryReport',
      body,
      { headers: this.headers }
    );
  }

  GetCustomerDetailHistoryReportDetailsOnly(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetCustomerDetailHistoryReportDetailsOnly',
      body,
      { headers: this.headers }
    );
  }
  GetCustomerDetailHistoryReportOpenInvoicesOnly(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetCustomerDetailHistoryReportOpenInvoicesOnly',
      body,
      { headers: this.headers }
    );
  }
  GetCustomerDetailHistoryReportSalesOnly(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetCustomerDetailHistoryReportSalesOnly',
      body,
      { headers: this.headers }
    );
  }

  GetCustomerAttachmentsByFilter(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Customer/GetCustomerAttachmentsByFilter',
      body,
      { headers: this.headers }
    );
  }

  GetSupplierDetailHistoryReportDetailsOnly(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetSupplierDetailHistoryReportDetailsOnly',
      body,
      { headers: this.headers }
    );
  }
  GetSupplierDetailHistoryReportOpenInvoicesOnly(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetSupplierDetailHistoryReportOpenInvoicesOnly',
      body,
      { headers: this.headers }
    );
  }

  GetInventoryWorthReport(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetInventoryWorthReport',
      body,
      { headers: this.headers }
    );
  }

  GetSupplierDetailHistoryReport(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetSupplierDetailHistoryReport',
      body,
      { headers: this.headers }
    );
  }
  GetSupplierDetailHistoryReportPurchasesOnly(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/Report/GetSupplierDetailHistoryReportPurchasesOnly',
      body,
      { headers: this.headers }
    );
  }
  GetshippingMethodByID(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/ShippingMethod/GetByID',
      body,
      { headers: this.headers }
    );
  }

  autoPostCodeComplete(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/APIAddressNew/autoPostCodeComplete',
      body,
      { headers: this.headers }
    );
  }
  autoCityComplete(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/APIAddressNew/autoCityComplete',
      body,
      { headers: this.headers }
    );
  }
  autoStreetComplete(body : any): Observable<any> {
    return this.http.post<any>(
      environment.url + '/APIAddressNew/autoStreetComplete',
      body,
      { headers: this.headers }
    );
  }
}
