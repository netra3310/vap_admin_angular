import { ClientModel } from "./ClientModel"
import { IImageModel } from "./ImageModel"

export class CustomerModel extends ClientModel{
    IsOrderCreater?:boolean;
    CustomerID:number;
    FirstName:string;
    CreatedAtForCustomer?:Date;
    UpdatedAtForCustomer?:Date;
    CreatedByUserIDForCustomer?:number;
    IsActiveForCustomer?:boolean;
    IsActive:boolean;
    DiscountGroupID?:any;
    DiscountGroup:string;
    DeliveryPersonID?:any;
    CustomerDataButton:string;
    CurrentBalance?:number;
    CurrentBalanceString:string;
    PhoneNo :string;
    customerEmail:string;
    City:string;
    Address:string;
    ShippingMethodID:any;
    Attachments :IImageModel;
    ClientSourceID : any;
}

