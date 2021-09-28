var momentTimezone = require("moment-timezone");

class functionContext {
  constructor(requestType, error, res, logger) {
    (this.requestType = requestType),
      (this.requestID = res.apiContext.requestID),
      (this.userRef = res.apiContext.userRef),
      (this.userType = res.apiContext.userType),
      (this.userFirebaseAuth = res.apiContext.userFirebaseAuth),
      (this.error = null),
      (this.res = res),
      (this.logger = logger),
      (this.currentTs = momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss"));
  }
}

class apiContext {
  constructor(requestID, mailer) {
    (this.requestID = requestID),
      (this.userRef = null),
      (this.userType = null),
      (this.userID = null),
      (this.currentTs = momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss"));
  }
}
class errorModel {
  constructor(errorMessage, errorCode, errorDescription) {
    this.ErrorCode = errorCode;
    this.ErrorMessage = errorMessage;
    this.ErrorDescription = errorDescription;
  }
}

class validateRequest {
  constructor(req) {
    (this.apiUri = req.path),
      (this.authToken = req.headers.authtoken),
      (this.authorization = req.headers.authorization),
      (this.appVersion = req.headers.appversion);
  }
}

class validateResponse {
  constructor() {
    (this.Error = null), (this.RequestID = null), (this.Details = null);
  }
}


class isAdminPresentRequest {
  constructor(req) {
    this.phone = req.body.Phone ? req.body.Phone : null;
    this.email = req.body.Email ? req.body.Email : null;
    this.loginType = req.body.LoginType ? req.body.LoginType : null;
    this.currentTimestamp = momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss ");
  }
}

class isAdminPresentResponse {
      constructor() {
        this.Details = {
          CustomerRef: null,
          VerificationStatus: null,
          AuthToken: null,
        };
        (this.RequestID = null), (this.Error = null);
      }
    }

class adminLoginRequest {
  constructor(req) {
    this.email = req.body.Email ? req.body.Email : null;
    this.password = req.body.Password ? req.body.Password : null;
  }
}

class adminLoginResponse {
  constructor() {
    (this.Error = {}),
      (this.Details = {
        AuthToken: null,
        UserRef: null,
        UserType: null
      }),
      (this.RequestID = null);
  }
}

class saveSystemUserRequest {
  constructor(req) {
    this.adminRef = req.body.AdminRef ? req.body.AdminRef : null;
    this.userName = req.body.UserName ? req.body.UserName : null;
    this.email = req.body.Email ? req.body.Email : null;
    this.phone = req.body.Phone ? req.body.Phone : null;
    this.password = req.body.Password ? req.body.Password : null;
    this.isActive = req.body.IsActive ? req.body.IsActive : 0;
  }
}

class saveSystemUserResponse {
  constructor() {
    (this.Error = null), (this.Details = {}), (this.RequestID = null);
  }
}
class getAdminComponentRequest {
  constructor(req) {
    this.componentType = req.query.componenttype ? req.query.componenttype : null;
  }
}

class getAdminComponentResponse {
  constructor() {
    (this.Error = null), (this.Details = {}), (this.RequestID = null);
  }
}

class saveMediaRequest {
  constructor(req) {
    this.userReference = req.body.UserReference ? req.body.UserReference : null;
    this.currentTs = momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss ");
  }
}
class saveMediaResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        Media: [],
      }),
      (this.RequestID = null);
  }
}
class saveMonitorRequest {
  constructor(req) {
    this.monitorRef = req.body.MonitorRef ? req.body.MonitorRef : null;
    this.monitorName = req.body.MonitorName ? req.body.MonitorName : null;
    this.description = req.body.Description ? req.body.Description : null;
    this.defaultPlaylistRef = req.body.DefaultPlaylistRef ? req.body.DefaultPlaylistRef : null;
    this.isActive = req.body.IsActive ? req.body.IsActive : null;
    this.currentTs = momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss ");
  }
}
class saveMonitorResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {}),
      (this.RequestID = null);
  }
}
class savePlaylistRequest {
  constructor(req) {
    this.playlistRef = req.body.PlaylistReference ? req.body.PlaylistReference : null;
    this.playlistName = req.body.PlaylistName ? req.body.PlaylistName : null;
    this.description = req.body.Description ? req.body.Description : null;
    this.playlist = req.body.Playlist ? req.body.Playlist : null;
    this.isActive = req.body.IsActive ? req.body.IsActive : null;
    this.currentTs = momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss ");
  }
}
class savePlaylistResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        PlaylistReference: null,
      }),
      (this.RequestID = null);
  }
}
class saveScheduleRequest {
  constructor(req) {
    this.scheduleRef = req.body.ScheduleRef ? req.body.ScheduleRef : null;
    this.scheduleTitle = req.body.ScheduleTitle ? req.body.ScheduleTitle : null;
    this.description = req.body.Description ? req.body.Description : null;
    this.playlistRef = req.body.PlaylistRef ? req.body.PlaylistRef : null;
    this.schedule = req.body.Schedule ? req.body.Schedule : null;
    this.fixedTimePlayback = req.body.FixedTimePlayback ? req.body.FixedTimePlayback : null;
    this.isActive = req.body.IsActive ? req.body.IsActive : null;
    this.currentTs = momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss ");
  }
}
class saveScheduleResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
      }),
      (this.RequestID = null);
  }
}
class deleteAdminComponentsRequest {
  constructor(req) {
    this.componentType = req.body.ComponentType ? req.body.ComponentType : null;
    this.componentList = req.body.ComponentList ? req.body.ComponentList : null;
    this.currentTs = momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss ");
  }
}
class deleteAdminComponentsResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        IsDeleted:false
      }),
      (this.RequestID = null);
  }
}
//this is for admin
class DaterangeRequest {
  constructor(req) {
    this.date1 = req.body.date1 ? req.body.date1 : null;
    this.date2 = req.body.date2 ? req.body.date2 : null;
    
    this.currentTimestamp = momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss ");
  }
}
class DaterangeRequestForAdmin {
  constructor(req) {
    this.date1 = req.body.date1 ? req.body.date1 : null;
    this.date2 = req.body.date2 ? req.body.date2 : null;
    this.date3 = req.body.date3 ? req.body.date3 : null;
  
    this.currentTimestamp = momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss ");
  }
}
//this is for admin
class analyticsRequest {
  constructor(req) {
    this.date1 = req.body.date1 ? req.body.date1 : null;
    this.date2 = req.body.date2 ? req.body.date2 : null;
    this.date3 = req.body.date3 ? req.body.date3 : null;
  
    this.currentTimestamp = momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss ");
  }
}
//this is for admin
class addRider {
  constructor(req) {
    this.ref = req.body.ref ? req.body.ref : null;
    this.command = req.body.command ? req.body.command : null;
    this.phone = req.body.Phone ? req.body.Phone : null;
    this.email = req.body.Email ? req.body.Email : null;
    this.firstname = req.body.FirstName ? req.body.FirstName : null;
    this.lastname = req.body.LastName ? req.body.LastName : null;
    this.Password = req.body.Password ? req.body.Password : null;
    this.Address1 = req.body.Address1 ? req.body.Address1 : null;
    this.Address2 = req.body.Address2 ? req.body.Address2 : null;
    this.City = req.body.City ? req.body.City : null;
    this.State = req.body.State ? req.body.State : null;
    this.Pincode = req.body.Pincode ? req.body.Pincode : null;

    this.currentTimestamp = momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss ");
  }
}
class AddCustomerSite {
  constructor(req) {
    
    this.ref = req.body.ref ? req.body.ref : null;
    // this.command = req.body.command ? req.body.command : null;
    // this.phone = req.body.Phone ? req.body.Phone : null;
    // this.email = req.body.Email ? req.body.Email : null;
    // this.firstname = req.body.FirstName ? req.body.FirstName : null;
    // this.lastname = req.body.LastName ? req.body.LastName : null;
    // this.Password = req.body.Password ? req.body.Password : null;
    // this.Address1 = req.body.Address1 ? req.body.Address1 : null;
    // this.Address2 = req.body.Address2 ? req.body.Address2 : null;
    // this.City = req.body.City ? req.body.City : null;
    // this.State = req.body.State ? req.body.State : null;
    // this.Pincode = req.body.Pincode ? req.body.Pincode : null;
    this.command=  req.body.command?req.body.command:null;
    this.Firstname= req.body.Firstname?req.body.Firstname:null;
    this.Lastname= req.body.Lastname?req.body.Lastname:null;
    this.Email= req.body.Email?req.body.Email:null,
    this.Pin= req.body.Pin?req.body.Pin:null,
    this.Zone=req.body.Zone?req.body.Zone:null,
    this.Phone= req.body.Phone?req.body.Phone:null,
    this.Address1= req.body.Address1?req.body.Address1:null,
    this.Address2= req.body.Address2?req.body.Address1:null,
    this.City= req.body.City?req.body.City:null,
    this.Panchayat= req.body.Panchayat?req.body.Panchayat:null,
    this.State= req.body.State?req.body.State:null,
    this.Buildingname= req.body.Buildingname?req.body.Buildingname:null,
    this.Description= req.body.Description?req.body.Description:null,
    
    this.Storey= req.body.Storey?req.body.Storey:null,
    this.Condition= req.body.Condition?req.body.Condition:null,
    this.TypeConstruction= req.body.TypeConstruction?req.body.TypeConstruction:null,
    this.BuiltArea= req.body.BuiltArea?req.body.BuiltArea:null,
    this.AddressofSite1= req.body.AddressofSite1?req.body.AddressofSite1:null,
    this.AddressofSite2= req.body.AddressofSite2?req.body.AddressofSite2:null,
    this.Toilet= req.body.Toilet?req.body.Toilet:null,
    this.Operation= req.body.Operation?req.body.Operation:null,
    this.PlotNumber= req.body.PlotNumber?req.body.PlotNumber:null,
    this.Use= req.body.Use?req.body.Use:null,
    this.OccupantName= req.body.OccupantName?req.body.OccupantName:null,
    this.Amount= req.body.Amount?req.body.Amount:null,
    this.CarpetArea= req.body.CarpetArea?req.body.CarpetArea:null,
    this.CustomerRef= req.body.CustomerRef?req.body.CustomerRef:null,
   

    this.currentTimestamp = momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss ");
  }
}class isriderrPresentResponse {
  constructor() {
    this.Details = {};
    (this.RequestID = null), (this.Error = null);
  }
}

class getCustomerDetailsRequest {
  constructor(req) {
    this.customerRef = req.query.customerref ? req.query.customerref : null;
  }
}

class getCustomerDetailsResponse {
  constructor() {
    this.Details = {
      FirstName: null,
      LastName: null,
      DateOfBirth: null,
      Phone: null,
      Email: null,
    };
    this.Error = null;
    this.RequestID = null;
  }
}
//this is for admin
class getCustomerDetailsForAdminResponse {
  constructor() {
    this.Details = {};
    this.Details1 = {};
    this.Details2 = {};
    this.Details3 = {};

    this.Error = null;
    this.RequestID = null;
  }
}
class getTransactionDetailsForAdminResponse {
  constructor() {
    this.Details = {};

    this.Error = null;
    this.RequestID = null;
  }
}

class getCustomerAddressListRequest {
  constructor(req) {
    this.customerRef = req.query.customerref ? req.query.customerref : null;
  }
}

class getCustomerAddressListResponse {
  constructor() {
    this.Details = [];
    this.Error = null;
    this.RequestID = null;
  }
}

class updateCustomerDetailsRequest {
  constructor(req) {
    (this.customerRef = req.body.CustomerRef ? req.body.CustomerRef : null),
      (this.firstName = req.body.FirstName ? req.body.FirstName : null),
      (this.lastName = req.body.LastName ? req.body.LastName : null),
      (this.dateOfBirth = req.body.DateOfBirth ? req.body.DateOfBirth : null),
      (this.phone = req.body.Phone ? req.body.Phone : ""),
      (this.email = req.body.Email ? req.body.Email : "");
  }
}

class updateCustomerDetailsResponse {
  constructor() {
    this.Details = {
      CustomerRef: null,
      VerificationStatus: null,
    };
    this.Error = null;
    this.RequestID = null;
  }
}


class SaveScreensUDELRequest {
  constructor(req) {
    this.MonitorName = req.body.MonitorName ? req.body.MonitorName : null;
    // this.ScheduleId = req.body.ScheduleId ? req.body.ScheduleId : null;
    // this.CreatedOn = momentTimezone
    // .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
    // .tz("Asia/Kolkata")
    // .format("YYYY-MM-DD HH:mm:ss ");
  }
}




class SaveScreensURequest {
  constructor(req) {
    this.MonitorName = req.body.MonitorName ? req.body.MonitorName : null;
    this.ScheduleId = req.body.ScheduleId ? req.body.ScheduleId : null;
    this.CreatedOn = momentTimezone
    .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
    .tz("Asia/Kolkata")
    .format("YYYY-MM-DD HH:mm:ss ");
  }
}





class SaveScreensRequest {
  constructor(req) {
    this.MonitorRef = req.body.MonitorRef ? req.body.MonitorRef : null;
    this.MonitorName = req.body.MonitorName ? req.body.MonitorName : null;
    this.Comand = req.body.Comand ? req.body.Comand : null;
    this.MonitorDescription = req.body.MonitorDescription ? req.body.MonitorDescription : null;
    this.ScheduleId = req.body.ScheduleId ? req.body.ScheduleId : null;
    this.DefaultPlaylistId = req.body.DefaultPlaylistId ? req.body.DefaultPlaylistId : null;
    this.CreatedOn = momentTimezone
    .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
    .tz("Asia/Kolkata")
    .format("YYYY-MM-DD HH:mm:ss ");
  }
}




class saveCustomerAddressRequest {
  constructor(req) {
    (this.customerRef = req.body.CustomerRef ? req.body.CustomerRef : null),
      (this.addressRef = req.body.AddressRef ? req.body.AddressRef : null),
      (this.address1 = req.body.Address1 ? req.body.Address1 : null),
      (this.address2 = req.body.Address2 ? req.body.Address2 : null),
      (this.city = req.body.City ? req.body.City : null),
      (this.state = req.body.State ? req.body.State : null),
      (this.pincode = req.body.Pincode ? req.body.Pincode : null),
      (this.latitude = req.body.Latitude ? req.body.Latitude : null),
      (this.longitude = req.body.Longitude ? req.body.Longitude : null),
      (this.addressNickName = req.body.AddressNickName
        ? req.body.AddressNickName
        : null);
  }
}


class saveMonitorDetailsResponse {
  constructor() {
    // (this.Details = [
    //   MonitorRef: null,
    // ]), 
    // (this.RequestID = null), 
    // (this.Error = null);
    this.Details = {
      MonitorRef: null,
    };
    this.Error = null;
    this.RequestID = null;
  }
}

class SaveScreensResponse{
  constructor() {
    this.Details = {
      MonitorRef: null,
    };
    this.Error = null;
    this.RequestID = null;
  }
}


class SaveScreensUDELResponse{
  constructor() {
    this.Details = {
      message: "UPDATE SUSCESSFULL "
    };
    this.Error = null;
    this.RequestID = null;
  }
}

class SaveScreensUResponse{
  constructor() {
    this.Details = {
      message: "UPDATE SUSCESSFULL "
    };
    this.Error = null;
    this.RequestID = null;
  }
}

class saveCustomerAddressResponse {
  constructor() {
    this.Details = {
      AddressRef: null,
    };
    this.Error = null;
    this.RequestID = null;
  }
}

class getRestaurantListRequest {
  constructor(req) {}
}

class getRestaurantListResponse {
  constructor() {
    (this.Details = []), (this.RequestID = null), (this.Error = null);
  }
}

class getRestaurantItemDetailsRequest {
  constructor(req) {
    this.restaurantRef = req.data.restaurantref
      ? req.data.restaurantref
      : null;
  }
}

class getRestaurantItemDetailsResponse {
  constructor() {
    this.Details = {
      Dishes: [],
      DishType: [],
      BestSellerDishes: null,
      CustomePastPickupDishes: null,
    };
    this.Error = null;
    this.RequestID = null;
  }
}

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Get Packages

class GetPackageItemDetailsResponse {
  constructor() {
    this.Details = {
      PackageName: [],
      PackageDescription: [],
      // BestSellerDishes: null,
      // CustomePastPickupDishes: null,
    };
    this.Error = null;
    this.RequestID = null;
  }
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Get Monitors


class GetMonitorItemDetailsResponse {
  constructor() {
    this.Details = {
      MonitorName: [],
      MonitorDescription: [],
      // BestSellerDishes: null,
      // CustomePastPickupDishes: null,
    };
    this.Error = null;
    this.RequestID = null;
  }
}


class validateScheduleRequest {
  constructor(req) {
   
      (this.schedule = req.body.schedule
        ? req.body.schedule
        : null);
       this.Customer = req.body.Customer ? req.body.Customer : null;
       this.Days = req.body.Days ? req.body.Days : null;
       this.scheduleRef = req.body.scheduleRef ? req.body.scheduleRef : null;
    this.Name = req.body.Name ? req.body.Name : null;
    this.Comand = req.body.Comand ? req.body.Comand : null;
    this.Description = req.body.Description ? req.body.Description : null;

   
  }
}
class getPlaylistAppRequest {
  constructor(req) {
   
     
       this.scheduleRef = req.body.scheduleRef ? req.body.scheduleRef : null;
       this.customerRef = req.body.customerRef ? req.body.customerRef : null;
        this.currentTimestamp = momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss ");

   
  }
}
class validatePlaceDeliveryRequest {
  constructor(req) {
   
      (this.playlist = req.body.playlist
        ? req.body.playlist
        : null);
       this.Customer = req.body.Customer ? req.body.Customer : null;
       this.PlaylistRef = req.body.PlaylistRef ? req.body.PlaylistRef : null;
    this.Name = req.body.Name ? req.body.Name : null;
    this.Comand = req.body.Comand ? req.body.Comand : null;
    this.Description = req.body.Description ? req.body.Description : null;

   
  }
}
class validatePlaceDeliveryResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        playlist:[
          
        ],
        DeliveryRef: null,
        Wallet: {
          Amount: null,
        },
        Promo: {
          Amount: null,
        },
        DeliveryCharges: null,
        ActualCost: null,
        DiscountedCost: null,
        ActualCostAfterDiscount: null,
      });
    this.RequestID = null;
  }
}

class riderLoginRequest {
  constructor(req) {
    this.userName = req.body.Username ? req.body.Username : null;
    this.password = req.body.Password ? req.body.Password : null;
    this.currentTimestamp = momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss ");
  }
}

class riderLoginResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        RiderRef: null,
        AuthToken: null,
        VerificationStatus: null,
      }),
      (this.RequestID = null);
  }
}
class playlistAppResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        playlist: null,
        schedule: null,
       
      }),
      (this.RequestID = null);
  }
}
class validateRequestAdmin {
  constructor(req) {
    (this.apiUri = req.path),
      (this.authToken = req.headers.authtoken),
      (this.authorization = req.headers.authorization);
  }
}


class saveRestaurantRequest {
  constructor(req) {
    (this.restaurantRef = req.body.RestaurantRef ? req.body.RestaurantRef : ""),
      (this.name = req.body.Name ? req.body.Name : null),
      (this.isActive =
        req.body.IsActive == 0 || req.body.IsActive == 1
          ? req.body.IsActive
          : null),
      (this.isReservationAvail =
        req.body.IsReservationAvail == 0 || req.body.IsReservationAvail == 1
          ? req.body.IsReservationAvail
          : null),
      (this.isTakeawayAvail =
        req.body.IsTakeawayAvail == 0 || req.body.IsTakeawayAvail == 1
          ? req.body.IsTakeawayAvail
          : null),
      (this.isDeliveryAvail =
        req.body.IsDeliveryAvail == 0 || req.body.IsDeliveryAvail == 1
          ? req.body.IsDeliveryAvail
          : null),
      (this.minBufferTime = req.body.MinBufferTime
        ? req.body.MinBufferTime
        : null),
      (this.email = req.body.Email ? req.body.Email : null),
      (this.phone = req.body.Phone ? req.body.Phone : null),
      (this.maxNoOfSeats = req.body.MaxNoOfSeats
        ? req.body.MaxNoOfSeats
        : null),
      (this.address1 = req.body.Address1 ? req.body.Address1 : null),
      (this.address2 = req.body.Address2 ? req.body.Address2 : null),
      (this.city = req.body.City ? req.body.City : null),
      (this.state = req.body.State ? req.body.State : null),
      (this.pincode = req.body.Pincode ? req.body.Pincode : null),
      (this.latitude = req.body.Latitude ? req.body.Latitude : null),
      (this.longitude = req.body.Longitude ? req.body.Longitude : null),
      (this.currentTimestamp = momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "));
  }
}
class saveRestaurantResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        RestaurantRef: null,
      }),
      (this.RequestID = null);
  }
}

class saveRestaurantItemDetailsRequest {
  constructor(req) {
    this.restaurantRef = req.body.RestaurantRef ? req.body.RestaurantRef : null;
    this.dishRef = req.body.DishRef ? req.body.DishRef : null;
    this.dishName = req.body.DishName ? req.body.DishName : null;
    this.dishType = req.body.DishType ? req.body.DishType : null;
    this.amount = req.body.Amount ? req.body.Amount : null;
    this.isActive = req.body.IsActive ? req.body.IsActive : null;
    this.deleteItemImage = req.body.DeleteItemImage
      ? req.body.DeleteItemImage
      : null;
    this.description = req.body.Description ? req.body.Description : null;
    this.dishImage = null;
    this.currentTimestamp = momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss ");
  }
}

class saveRestaurantItemDetailsResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        DishRef: null,
      }),
      (this.RequestID = null);
  }
}

class registerDeviceTokenRequest {
  constructor(req) {
    this.deviceToken = req.body.DeviceToken ? req.body.DeviceToken : null;
    this.appType = req.body.AppType ? req.body.AppType : null;
  }
}

class registerDeviceTokenResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        UserRef: null,
      }),
      (this.RequestID = null);
  }
}

class deliveryDetailsForPushNotificationRequest {
  constructor(req) {
    this.deliveryRef = req.query.deliveryref ? req.query.deliveryref : null;
  }
}
class deliveryDetailsForPushNotificationResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        DeliveryRef: null,
        RestaurantName: null,
        Customer: {
          Name: null,
          Phone: null,
        },
        Address: {
          Address1: null,
          Address2: null,
          City: null,
          State: null,
          Pincode: null,
        },
        DishDetails: [],
        Amount: null,
      }),
      (this.RequestID = null);
  }
}

class updateDeliveryStatusRequest {
  constructor(req) {
    this.deliveryRef = req.body.DeliveryRef ? req.body.DeliveryRef : null;
    this.userRef = req.body.UserRef ? req.body.UserRef : null;
    this.status = req.body.Status ? req.body.Status : null;
    this.cancellation = req.body.Cancellation ? req.body.Cancellation : null;
    (this.currentTimestamp = momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss ")),
      (this.otp = req.body.OTP ? req.body.OTP : null);
  }
}

class updateDeliveryStatusResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        DeliveryStatusUpdated: null,
        Status: null,
      }),
      (this.RequestID = null);
  }
}

class getRiderDetailsRequest {
  constructor(req) {
    this.riderRef = req.query.riderref ? req.query.riderref : null;
  }
}

class getRiderDetailsResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        FirstName: null,
        LastName: null,
        Email: null,
        Phone: null,
        ServiceForTheDay: null,
        VerificationStatus: null,

        Address: {
          Address1: null,
          Address2: null,
          City: null,
          State: null,
          Pincode: null,
        },
      }),
      (this.RequestID = null);
  }
}

class deliveryViewRequest {
  constructor(req) {
    this.deliveryRef = req.query.deliveryref ? req.query.deliveryref : null;
  }
}

class deliveryViewResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        DeliveryRef: null,
        DeliveryID: null,
        Restaurant: {
          Reference: null,
          Name: null,
          Phone: null,
          Address1: null,
          Address2: null,
          City: null,
          State: null,
          Pincode: null,
          Latitude: null,
          Longitude: null,
        },
        Customer: {
          FirstName: null,
          LastName: null,
          DateOfBirth: null,
          Phone: null,
        },
        Rider: {
          Name: null,
          Phone: null,
        },
        Address: {
          Address1: null,
          Address2: null,
          City: null,
          State: null,
          Pincode: null,
          Latitude: null,
          Longitude: null,
        },
        DishDetails: [],
        DeliveryEvents: [],
        DeliveryBaseRate: null,
        DeliveryCharges: null,
        ActualAmount: null,
        WalletAmountApplied: null,
        PromoName: null,
        PromoAmountApplied: null,
        DiscountedAmount: null,
        IsRefundInitiated: null,
        Amount: null,
        Status: null,
        CancellationReason: {
          CancelReasonNote: null,
          CancelReasonText: null,
        },
        OTP: null,
        PaymentMode: null,
        Feedback: {
          Comment: null,
          ServiceRating: null,
          CanGiveFeedback: null,
        },
      }),
      (this.RequestID = null);
  }
}

class restaurantLoginRequest {
  constructor(req) {
    this.userName = req.body.Username ? req.body.Username : null;
    this.password = req.body.Password ? req.body.Password : null;
  }
}

class restaurantLoginResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        RestaurantRef: null,
        AuthToken: null,
        UserRef: null,
        UserType: null,
      }),
      (this.RequestID = null);
  }
}
//this is for admin
class deliveryListRequest {
  constructor(req) {
    this.userRef = req.query.userref ? req.query.userref : null;
  }
}

class deliveryListResponse {
  constructor() {
    (this.Error = null),
      (this.Details = { DeliveryList: [], CustomerFavouriteCount: null }),
      (this.RequestID = null);
  }
}

class riderActiveDeliveryListResponse {
  constructor() {
    (this.Error = null), (this.Details = []), (this.RequestID = null);
  }
}

class riderActiveDeliveryListRequest {
  constructor(req) {
    this.userRef = req.query.userref ? req.query.userref : null;
  }
}

class getRestaurantForDeliveryRequest {
  constructor(req) {
    this.addressRef = req.body.AddressRef ? req.body.AddressRef : null;
    this.customerRef = req.body.CustomerRef ? req.body.CustomerRef : null;
  }
}

class getRestaurantForDeliveryResponse {
  constructor() {
    (this.Error = null),
      (this.RequestID = null),
      (this.Details = {
        IsServiceable: null,
        IsDeliveryAvail: null,
        Restaurant: {
          RestaurantRef: null,
          Name: null,
          Address: {
            Address1: null,
            Address2: null,
            City: null,
            State: null,
            Pincode: null,
          },
          Images: [],
          Phone: null,
          Dishes: [],
        },
        BestSellers: {
          Dishes: [],
        },
        CustomerPastOrder: {
          Dishes: null,
        },
        DishTypes: [],
      });
  }
}

class restaurantDeliveryListRequest {
  constructor(req) {
    this.userRef = req.body.UserRef ? req.body.UserRef : null;
    this.statusFilter = req.body.StatusFilter ? req.body.StatusFilter : null;
  }
}

class restaurantDeliveryListResponse {
  constructor() {
    (this.Error = null), (this.Details = []), (this.RequestID = null);
  }
}

class userLogoutRequest {
  constructor(req) {
    this.userRef = req.body.UserRef ? req.body.UserRef : null;
  }
}

class userLogoutResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        UserRef: null,
      }),
      (this.RequestID = null);
  }
}

class customerAppSettingsResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        RestaurantOperatingCities: [],
        DeliveryBaseRate: {
          Amount: null,
        },
        FeedbackRatingMap : null,
        MaxNumberOfFavourites: {
          Favourites: null,
          IsRequired: null,
        },
        FeedbackQuestionSet: null,
        CustomerAppMessages: null,
      }),
      (this.RequestID = null);
  }
}

class updatePasswordRequest {
  constructor(req) {
    (this.password = req.body.Password ? req.body.Password : null),
      (this.currentTimestamp = momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "));
  }
}

class updatePasswordResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        CustomerRef: null,
      }),
      (this.RequestID = null);
  }
}

class restaurantAppSettingsResponse {
  constructor() {
    (this.Error = null),
      (this.Details = { DeliveryCancellationMessages: [] }),
      (this.RequestID = null);
  }
}

class saveFavouriteRequest {
  constructor(req) {
    (this.deliveryRef = req.body.DeliveryRef ? req.body.DeliveryRef : null),
      (this.status =
        req.body.Status == 0 || req.body.Status == 1 ? req.body.Status : null),
      (this.currentTimestamp = momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "));
  }
}

class saveFavouriteResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        DeliveryRef: null,
      }),
      (this.RequestID = null);
  }
}
class customerLoginRequest {
  constructor(req) {
    (this.phone = req.body.Phone ? req.body.Phone : null),
      (this.password = req.body.Password ? req.body.Password : null),
      (this.currentTimestamp = momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "));
  }
}
class customerUploadRequest {
  constructor(req) {
    (this.Name = req.body.name ? req.body.name : null),
      (this.Description = req.body.description ? req.body.description : null),
       (this.Default = req.body.default ? req.body.default : null),
        (this.CustomerImage =  null),
         (this.Mediapath =  req.file?req.file.filename:null),
         (this.Command =  req.body.command?req.body.command:null),
         

       (this.Type = req.body.type ? req.body.type : null),
       (this.customerRef = req.body.customerRef ? req.body.customerRef : null),
       (this.mediaRef = req.body.mediaRef ? req.body.mediaRef : null),
      (this.currentTimestamp = momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "));
  }
}
class customerLoginResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        CustomerRef: null,
        details:null,
        Token:null,
      }),
      (this.RequestID = null);
  }
}
class customerUploadResponse {
  constructor() {
    (this.Error = null),
      (this.Details = []),
      (this.RequestID = null);
  }
}

class restaurantImagesResponse {
  constructor() {
    (this.Error = null), (this.Details = []), (this.RequestID = null);
  }
}

class hasActivePickupResponse {
  constructor() {
    (this.Error = null),
      (this.Details = { DeliveryRef: null }),
      (this.RequestID = null);
  }
}
class getWalletBalanceResponse {
  constructor() {
    (this.Error = null),
      (this.Details = { WalletBalance: null }),
      (this.RequestID = null);
  }
}
class validatePlacePickupRequest {
  constructor(req) {
    (this.restaurantRef = req.body.RestaurantRef
      ? req.body.RestaurantRef
      : null),
      (this.pickupItem = req.body.PickupItem ? req.body.PickupItem : null),
      (this.promoRef = req.body.PromoRef ? req.body.PromoRef : null);
    this.walletAmount = req.body.WalletAmount ? req.body.WalletAmount : null;
  }
}

class placeDeliveryRequest {
  constructor(req) {
    (this.deliveryRef = req.body.DeliveryRef ? req.body.DeliveryRef : null),
      (this.status = req.body.Status ? req.body.Status : null),
      (this.payment = req.body.Payment ? req.body.Payment : null),
      (this.currentTimestamp = momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "));
  }
}

class placeDeliveryResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        DeliveryRef: null,
      }),
      (this.RequestID = null);
  }
}
class placePickupRequest {
  constructor(req) {
    (this.pickupRef = req.body.PickupRef ? req.body.PickupRef : null),
      (this.status = req.body.Status ? req.body.Status : null),
      (this.payment = req.body.Payment ? req.body.Payment : null),
      (this.currentTimestamp = momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "));
  }
}

class placePickupResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        PickupRef: null,
      }),
      (this.RequestID = null);
  }
}

class validatePlacePickupResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        PickupRef: null,
        Wallet: {
          Amount: null,
        },
        Promo: {
          Amount: null,
        },
        ActualCost: null,
        DiscountedCost: null,
        ActualCostAfterDiscount: null,
      });
    this.RequestID = null;
  }
}

class getAllPromoCodesResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        PromoCodeList: [],
      });
    this.RequestID = null;
  }
}

class restaurantPickupListRequest {
  constructor(req) {
    this.restaurantRef = req.body.RestaurantRef ? req.body.RestaurantRef : null;
    this.statusFilter = req.body.StatusFilter ? req.body.StatusFilter : null;
  }
}

class restaurantPickupListResponse {
  constructor() {
    (this.Error = null), (this.Details = []), (this.RequestID = null);
  }
}

class updatePickupStatusRequest {
  constructor(req) {
    this.pickupRef = req.body.PickupRef ? req.body.PickupRef : null;
    this.userRef = req.body.UserRef ? req.body.UserRef : null;
    this.status = req.body.Status ? req.body.Status : null;
    this.cancellation = req.body.Cancellation ? req.body.Cancellation : null;
    (this.currentTimestamp = momentTimezone
      .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DD HH:mm:ss ")),
      (this.otp = req.body.OTP ? req.body.OTP : null);
  }
}

class updatePickupStatusResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        PickupStatusUpdated: null,
        Status: null,
      }),
      (this.RequestID = null);
  }
}

class pickupViewRequest {
  constructor(req) {
    this.pickupRef = req.query.pickupref ? req.query.pickupref : null;
  }
}

class pickupViewResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        PickupRef: null,
        PickupID: null,
        IsRefundInitiated: null,
        Restaurant: {
          Reference: null,
          Name: null,
          Phone: null,
          Address1: null,
          Address2: null,
          City: null,
          State: null,
          Pincode: null,
          Latitude: null,
          Longitude: null,
        },
        Customer: {
          FirstName: null,
          LastName: null,
          DateOfBirth: null,
          Phone: null,
        },
        DishDetails: [],
        PickupEvents: [],
        PickupBaseRate: null,
        ActualAmount: null,
        WalletAmountApplied: null,
        PromoName: null,
        PromoAmountApplied: null,
        DiscountedAmount: null,
        Amount: null,
        Status: null,
        PaymentMode: null,
        CancellationReason: {
          CancelReasonNote: null,
          CancelReasonText: null,
        },
        Feedback: {
          Comment: null,
          ServiceRating: null,
          CanGiveFeedback: null,
        },
      }),
      (this.RequestID = null);
  }
}

class pickupListResponse {
  constructor() {
    (this.Error = null),
      (this.Details = { PickupList: [] }),
      (this.RequestID = null);
  }
}

class getNotificationListResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        NotificationList: [],
      }),
      (this.RequestID = null);
  }
}

class restaurantProfileRequest {
  constructor(req) {
    this.restaurantRef = req.query.restaurantref
      ? req.query.restaurantref
      : null;
  }
}

class restaurantProfileResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        Profile: {
          Username: null,
          Role: null,
          RestaurantName: null,
        },
        Configuration: {
          IsDeliveryAvail: null,
          IsTakeawayAvail: null,
        },
      }),
      (this.RequestID = null);
  }
}
class saveFeedbackRequest {
  constructor(req) {
    (this.deliveryRef = req.body.DeliveryRef ? req.body.DeliveryRef : null),
      (this.pickupRef = req.body.PickupRef ? req.body.PickupRef : null),
      (this.bookingRef = req.body.BookingRef ? req.body.BookingRef : null),
      (this.comment = req.body.Comment ? req.body.Comment : null),
      (this.serviceRating = req.body.ServiceRating
        ? req.body.ServiceRating
        : null),
      (this.currentTimestamp = momentTimezone
        .utc(new Date(), "YYYY-MM-DD HH:mm:ss")
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss "));
  }
}

class saveFeedbackResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        IsFeedbackSaved: null,
      }),
      (this.RequestID = null);
  }
}
class saveRestaurantConfigurationRequest {
  constructor(req) {
    (this.restaurantRef = req.body.RestaurantRef
      ? req.body.RestaurantRef
      : null),
      (this.status =
        req.body.Status == 0 || req.body.Status == 1 ? req.body.Status : null),
      (this.serviceType = req.body.ServiceType ? req.body.ServiceType : null);
  }
}
class saveRestaurantConfigurationResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        IsTakeawayAvail: null,
        IsDeliveryAvail: null,
      }),
      (this.RequestID = null);
  }
}
class getRestaurantDishesRequest {
  constructor(req) {
    this.restaurantRef = req.query.restaurantref
      ? req.query.restaurantref
      : null;
  }
}

class getRestaurantDishesResponse {
  constructor() {
    this.Details = {
      Dishes: [],
      DishType: [],
    };
    this.Error = null;
    this.RequestID = null;
  }
}

class getAvailableRidersRequest {
  constructor(req) {
    this.restaurantRef = req.query.restaurantref
      ? req.query.restaurantref
      : null;
  }
}

class getAvailableRidersResponse {
  constructor() {
    this.Details = {
      AvailableRiders: [],
    };
    this.Error = null;
    this.RequestID = null;
  }
}

class editDeliveryRequest {
  constructor(req) {
    this.deliveryRef = req.body.DeliveryRef ? req.body.DeliveryRef : null;
    this.riderRef = req.body.RiderRef ? req.body.RiderRef : null;
  }
}

class editDeliveryResponse {
  constructor() {
    this.Details = {
      DeliveryRef: null,
    };
    this.Error = null;
    this.RequestID = null;
  }
}

class getRestaurantBookATableSettingRequest {
  constructor(req) {
    this.restaurantRef = req.query.restaurantref
      ? req.query.restaurantref
      : null;
      this.bookingDate = req.query.bookingdate ? req.query.bookingdate : null
  }
}

class getRestaurantBookATableSettingResponse {
  constructor() {
    this.Details = {
      TimeSlots: null,
      ImmediateBookingSlotID: null,
    };
    this.Error = null;
    this.RequestID = null;
  }
}

class dishesForPickupRequest {
  constructor(req) {
    this.restaurantRef = req.query.restaurantref
      ? req.query.restaurantref
      : null;
  }
}

class confirmBookATableRequest {
  constructor(req) {
    this.restaurantRef = req.body.RestaurantRef ? req.body.RestaurantRef : null;
    this.bookingTimestamp = req.body.BookingTimestamp
      ? req.body.BookingTimestamp
      : null;
    this.bookingSlot = req.body.BookingSlot ? req.body.BookingSlot : null;
    this.customerName = req.body.CustomerName ? req.body.CustomerName : null;
    this.customerEmail = req.body.CustomerEmail ? req.body.CustomerEmail : null;
    this.customerPhone = req.body.CustomerPhone ? req.body.CustomerPhone : null;
    this.note = req.body.Note ? req.body.Note : null;
    this.noOfSeats = req.body.NoOfSeats ? req.body.NoOfSeats : null;
  }
}

class confirmBookATableResponse {
  constructor() {
    this.Details = {
      BookingRef: null,
    };
    this.Error = null;
    this.RequestID = null;
  }
}
class getBookingListForRestaurantRequest {
  constructor(req) {
    this.restaurantRef = req.body.RestaurantRef ? req.body.RestaurantRef : null;
    this.statusFilter = req.body.StatusFilter ? req.body.StatusFilter : null;
  }
}
class getBookingListForRestaurantResponse {
  constructor() {
    this.Details = {
      BookingList: [],
    };
    this.Error = null;
    this.RequestID = null;
  }
}

class getBookATableListResponse {
  constructor() {
    this.Details = {
      BookingList: [],
    };
    this.Error = null;
    this.RequestID = null;
  }
}

class updateBookingStatusRequest {
  constructor(req) {
    this.bookingRef = req.body.BookingRef ? req.body.BookingRef : null;
    this.userRef = req.body.UserRef ? req.body.UserRef : null;
    this.status = req.body.Status ? parseInt(req.body.Status) : null;
    this.cancellation = req.body.Cancellation ? req.body.Cancellation : null;
  }
}

class updateBookingStatusResponse {
  constructor() {
    this.Details = {
      BookingRef: null,
    };
    this.Error = null;
    this.RequestID = null;
  }
}

class bookingViewRequest {
  constructor(req) {
    this.bookingRef = req.query.bookingref ? req.query.bookingref : null;
  }
}
class bookingViewResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        BookingRef: null,
        BookingID: null,
        BookingTimeSlot: null,
        BookingTimeStamp: null,
        BookingCustomerName: null,
        BookingCustomerPhone: null,
        BookingCustomerEmail: null,
        SeatsOccupancy: null,
        BookingNote: null,
        Restaurant: {
          Reference: null,
          Name: null,
          Phone: null,
          Address1: null,
          Address2: null,
          City: null,
          State: null,
          Pincode: null,
          Latitude: null,
          Longitude: null,
        },
        Customer: {
          FirstName: null,
          LastName: null,
          Phone: null,
        },
        BookingEvents: [],
        Status: null,
        CancellationReason: {
          CancelReasonNote: null,
          CancelReasonText: null,
        },
        Feedback: {
          Comment: null,
          ServiceRating: null,
          CanGiveFeedback: null,
        },
      }),
      (this.RequestID = null);
  }
}

class getBookingConfigResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
        Configuration: null,
        TimeSlots: null,
      }),
      (this.RequestID = null);
  }
}

class saveBookingConfigRequest {
  constructor(req) {
    this.restaurantRef = req.body.RestaurantRef ? req.body.RestaurantRef : null;
    this.configuration = req.body.Configuration ? req.body.Configuration : [];
    this.timeslots = req.body.TimeSlots ? req.body.TimeSlots : [];
  }
}

class saveBookingConfigResponse {
  constructor() {
    (this.Error = null),
      (this.Details = {
      
        RestaurantRef: null
      }),
      (this.RequestID = null);
  }
}

module.exports.ErrorModel = errorModel;
module.exports.ValidateRequest = validateRequest;
module.exports.ValidateResponse = validateResponse;
module.exports.FunctionContext = functionContext;
module.exports.ApiContext = apiContext;
module.exports.IsAdminPresentRequest = isAdminPresentRequest;
module.exports.IsAdminPresentResponse = isAdminPresentResponse;
module.exports.SaveSystemUserRequest = saveSystemUserRequest;
module.exports.SaveSystemUserResponse = saveSystemUserResponse;
module.exports.SaveMediaRequest = saveMediaRequest;
module.exports.SaveMediaResponse = saveMediaResponse;
module.exports.GetAdminComponentRequest = getAdminComponentRequest;
module.exports.GetAdminComponentResponse = getAdminComponentResponse;
module.exports.SavePlaylistRequest = savePlaylistRequest;
module.exports.SavePlaylistResponse = savePlaylistResponse;
module.exports.SaveScheduleRequest = saveScheduleRequest;
module.exports.SaveScheduleResponse = saveScheduleResponse;
module.exports.SaveMonitorRequest = saveMonitorRequest;
module.exports.SaveMonitorResponse = saveMonitorResponse;
module.exports.DeleteAdminComponentsRequest = deleteAdminComponentsRequest;
module.exports.DeleteAdminComponentsResponse = deleteAdminComponentsResponse;



module.exports.validateScheduleRequest = validateScheduleRequest;

module.exports.customerUploadResponse = customerUploadResponse;
module.exports.GetCustomerDetailsRequest = getCustomerDetailsRequest;
module.exports.GetTransactionDetailsForAdminResponse = getTransactionDetailsForAdminResponse;
module.exports.GetTranDetailsForAdminResponse = getCustomerDetailsForAdminResponse;
module.exports.GetCustomerDetailsResponse = getCustomerDetailsResponse;
module.exports.CustomerUploadRequest = customerUploadRequest;

//this is for admin
module.exports.GetCustomerDetailsForAdminResponse = getCustomerDetailsForAdminResponse;
//this is for admin
module.exports.DaterangeRequest = DaterangeRequest;
module.exports.DaterangeRequestForAdmin = DaterangeRequestForAdmin;
//this is for admin
module.exports.analyticsRequest = analyticsRequest;
//this is for admin
module.exports.AddRider = addRider;
module.exports.AddCustomerSite = AddCustomerSite;

module.exports.IsriderrPresentResponse = isriderrPresentResponse;
module.exports.GetCustomerAddressListRequest = getCustomerAddressListRequest;
module.exports.GetCustomerAddressListResponse = getCustomerAddressListResponse;
module.exports.UpdateCustomerDetailsRequest = updateCustomerDetailsRequest;
module.exports.UpdateCustomerDetailsResponse = updateCustomerDetailsResponse;
module.exports.GetRestaurantsListRequest = getRestaurantListRequest;
module.exports.GetRestaurantsListResponse = getRestaurantListResponse;
module.exports.SaveCustomerAddressRequest = saveCustomerAddressRequest;

module.exports.SaveScreensRequest = SaveScreensRequest;
module.exports.SaveScreensResponse = SaveScreensResponse;

module.exports.SaveScreensURequest = SaveScreensURequest;
module.exports.SaveScreensUResponse = SaveScreensUResponse;

module.exports.SaveScreensUDELRequest = SaveScreensUDELRequest;
module.exports.SaveScreensUDELResponse = SaveScreensUDELResponse;

module.exports.playlistAppResponse =playlistAppResponse;

module.exports.SaveCustomerAddressResponse = saveCustomerAddressResponse;
module.exports.saveMonitorDetailsResponse = saveMonitorDetailsResponse;
module.exports.RiderLoginRequest = riderLoginRequest;
module.exports.RiderLoginResponse = riderLoginResponse;
module.exports.GetRestaurantItemDetailsRequest = getRestaurantItemDetailsRequest;
module.exports.GetRestaurantItemDetailsResponse = getRestaurantItemDetailsResponse;
module.exports.GetPackageItemDetailsResponse = GetPackageItemDetailsResponse;
module.exports.GetMonitorItemDetailsResponse = GetMonitorItemDetailsResponse;
module.exports.ValidatePlaceDeliveryRequest = validatePlaceDeliveryRequest;
module.exports.getPlaylistAppRequest = getPlaylistAppRequest;
module.exports.ValidatePlaceDeliveryResponse = validatePlaceDeliveryResponse;
module.exports.SaveRestaurantRequest = saveRestaurantRequest;
module.exports.SaveRestaurantResponse = saveRestaurantResponse;
module.exports.ValidateRequest = validateRequest;
module.exports.ValidateRequestAdmin = validateRequestAdmin;
module.exports.ValidateResponse = validateResponse;
module.exports.SaveRestaurantItemDetailsRequest = saveRestaurantItemDetailsRequest;
module.exports.SaveRestaurantItemDetailsResponse = saveRestaurantItemDetailsResponse;
module.exports.RegisterDeviceTokenRequest = registerDeviceTokenRequest;
module.exports.RegisterDeviceTokenResponse = registerDeviceTokenResponse;
module.exports.DeliveryDetailsForPushNotificationRequest = deliveryDetailsForPushNotificationRequest;
module.exports.DeliveryDetailsForPushNotificationResponse = deliveryDetailsForPushNotificationResponse;
module.exports.UpdateDeliveryStatusRequest = updateDeliveryStatusRequest;
module.exports.UpdateDeliveryStatusResponse = updateDeliveryStatusResponse;
module.exports.GetRiderDetailsRequest = getRiderDetailsRequest;
module.exports.GetRiderDetailsResponse = getRiderDetailsResponse;
module.exports.DeliveryViewRequest = deliveryViewRequest;
module.exports.DeliveryViewResponse = deliveryViewResponse;
//this is for admin
module.exports.AdminLoginRequest = adminLoginRequest;
module.exports.RestaurantLoginRequest = restaurantLoginRequest;
module.exports.RestaurantLoginResponse = restaurantLoginResponse;
//this is for admin
module.exports.AdminLoginResponse = adminLoginResponse;
module.exports.DeliveryListRequest = deliveryListRequest;
module.exports.DeliveryListResponse = deliveryListResponse;
module.exports.RiderActiveDeliveryListRequest = riderActiveDeliveryListRequest;
module.exports.RiderActiveDeliveryListResponse = riderActiveDeliveryListResponse;
module.exports.GetRestaurantForDeliveryRequest = getRestaurantForDeliveryRequest;
module.exports.GetRestaurantForDeliveryResponse = getRestaurantForDeliveryResponse;
module.exports.RestaurantDeliveryListRequest = restaurantDeliveryListRequest;
module.exports.RestaurantDeliveryListResponse = restaurantDeliveryListResponse;
module.exports.UserLogoutRequest = userLogoutRequest;
module.exports.UserLogoutResponse = userLogoutResponse;
module.exports.UpdatePasswordRequest = updatePasswordRequest;
module.exports.UpdatePasswordResponse = updatePasswordResponse;
module.exports.CustomerAppSettingsResponse = customerAppSettingsResponse;
module.exports.RestaurantAppSettingsResponse = restaurantAppSettingsResponse;
module.exports.CustomerLoginRequest = customerLoginRequest;
module.exports.CustomerLoginResponse = customerLoginResponse;
module.exports.RestaurantImagesResponse = restaurantImagesResponse;
module.exports.HasActivePickupResponse = hasActivePickupResponse;
module.exports.GetWalletBalanceResponse = getWalletBalanceResponse;
module.exports.SaveFavouriteRequest = saveFavouriteRequest;
module.exports.SaveFavouriteResponse = saveFavouriteResponse;
module.exports.PlaceDeliveryRequest = placeDeliveryRequest;
module.exports.PlaceDeliveryResponse = placeDeliveryResponse;
module.exports.PlacePickupRequest = placePickupRequest;
module.exports.PlacePickupResponse = placePickupResponse;
module.exports.ValidatePlacePickupRequest = validatePlacePickupRequest;
module.exports.ValidatePlacePickupResponse = validatePlacePickupResponse;
module.exports.GetAllPromoCodesResponse = getAllPromoCodesResponse;
module.exports.RestaurantPickupListRequest = restaurantPickupListRequest;
module.exports.RestaurantPickupListResponse = restaurantPickupListResponse;
module.exports.UpdatePickupStatusRequest = updatePickupStatusRequest;
module.exports.UpdatePickupStatusResponse = updatePickupStatusResponse;
module.exports.PickupViewRequest = pickupViewRequest;
module.exports.PickupViewResponse = pickupViewResponse;
module.exports.PickupListResponse = pickupListResponse;
module.exports.GetNotificationListResponse = getNotificationListResponse;
module.exports.RestaurantProfileRequest = restaurantProfileRequest;
module.exports.RestaurantProfileResponse = restaurantProfileResponse;
module.exports.SaveFeedbackRequest = saveFeedbackRequest;
module.exports.SaveFeedbackResponse = saveFeedbackResponse;
module.exports.SaveRestaurantConfigurationRequest = saveRestaurantConfigurationRequest;
module.exports.SaveRestaurantConfigurationResponse = saveRestaurantConfigurationResponse;
module.exports.GetRestaurantDishesRequest = getRestaurantDishesRequest;
module.exports.GetRestaurantDishesResponse = getRestaurantDishesResponse;
module.exports.GetAvailableRidersRequest = getAvailableRidersRequest;
module.exports.GetAvailableRidersResponse = getAvailableRidersResponse;
module.exports.EditDeliveryRequest = editDeliveryRequest;
module.exports.EditDeliveryResponse = editDeliveryResponse;
module.exports.EditDeliveryRequest = editDeliveryRequest;
module.exports.DishesForPickupRequest = dishesForPickupRequest;
module.exports.GetRestaurantBookATableSettingRequest = getRestaurantBookATableSettingRequest;
module.exports.GetRestaurantBookATableSettingResponse = getRestaurantBookATableSettingResponse;
module.exports.ConfirmBookATableRequest = confirmBookATableRequest;
module.exports.ConfirmBookATableResponse = confirmBookATableResponse;
module.exports.GetBookingListForRestaurantRequest = getBookingListForRestaurantRequest;
module.exports.GetBookingListForRestaurantResponse = getBookingListForRestaurantResponse;
module.exports.GetBookATableListResponse = getBookATableListResponse;
module.exports.UpdateBookingStatusRequest = updateBookingStatusRequest;
module.exports.UpdateBookingStatusResponse = updateBookingStatusResponse;
module.exports.BookingViewRequest = bookingViewRequest;
module.exports.BookingViewResponse = bookingViewResponse;
module.exports.GetBookingConfigResponse = getBookingConfigResponse;
module.exports.SaveBookingConfigRequest = saveBookingConfigRequest;
module.exports.SaveBookingConfigResponse = saveBookingConfigResponse;


