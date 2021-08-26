module.exports.ErrorCode = {
  ApplicationError: 500,
  Invalid_Request: 501,
  Invalid_Request_Url: 10001,
  Invalid_User_Credentials: 10002,
  Invalid_Restaurant_Ref: 10003,
  Invalid_Authentication: 10004,
  Invalid_User: 10005,
  Invalid_User_Name_Or_Password: 10006,
  Unable_To_Place_Delivery: 10007,
  Delivery_No_Longer_Available: 10008,
  User_Assigned_To_Another_Delivery: 10009,
  Rider_Not_Assigned_For_Delivery: 10010,
  Unable_To_Update_Status: 10011,
  Invalid_Status: 10012,
  Delivery_Already_In_Progress: 10013,
  Delivery_Already_Completed: 10014,
  Delivery_Already_Cancelled: 10015,
  Delivery_Already_Accepted: 10016,
  Delivery_Already_Rejected: 10017,
  Phone_Already_In_Use: 10018,
  Email_Already_In_Use: 10019,
  Max_Rider_Accepted_Time_Exceeded: 10020,
  Invalid_Address_Reference: 10021,
  Rider_Already_Accepted_Delivery: 10022,
  Invalid_Delivery_Ref: 10023,
  Delivery_Already_Prepared: 10024,
  Incorrect_OTP: 10025,
  Delivery_Not_In_Progress: 10026,
  Delivery_Not_Prepared: 10027,
  Invalid_Wallet_Amount_Applied: 10028,
  Invalid_Dish_Ref: 10029,
  Dish_Not_Available: 10030,
  Restaurant_Details_Updated: 10031,
  Delivery_Not_Estimated: 10032,
  Pickup_Not_Estimated: 10033,
  Invalid_Pickup_Ref: 10034,
  Invalid_Promo_Ref: 10035,
  Promo_code_Expired: 10036,
  Promo_Code_Doesnot_Support_Service: 10037,
  Not_Eligible_For_PromoCode: 10038,
  Pickup_Already_Accepted: 10039,
  Pickup_Already_Rejected: 10040,
  Pickup_Not_Placed: 10041,
  Pickup_Already_Prepared: 10042,
  Pickup_Not_Accepted: 10043,
  Pickup_Already_Completed: 10044,
  Pickup_Not_Prepared: 10045,
  Inserviceable_Address: 10046,
  Not_Eligile_For_Feedback: 10047,
  Feedback_Already_Given: 10048,
  Delivery_InServiceable: 10049,
  Pickup_InServiceable: 10050,
  Pickup_No_Longer_Available: 10051,
  User_Permission_Not_Granted: 10052,
  Invalid_Rider_Reference: 10053,
  Delivery_Cant_Be_Edited: 10054,
  Delivery_Already_Assigned_To_The_Rider: 10055,
  Rider_Already_Assigned_With_A_Delivery: 10056,
  Inactive_Rider: 10057,
  Reservation_InServiceable: 10058,
  Booking_Time_Already_Passed: 20000,
  Booking_Already_Cancelled :  20001,
  Booking_Already_Accepted :  20002,
  Booking_Customer_Visited_Restaurant  : 20003,
  Booking_Req_Not_Fulfilled : 20004,
  Invalid_Booking_Ref : 20005,
  Customer_Completed_Booking : 20006,
  InSufficient_No_Of_Seats : 20007
};

module.exports.ErrorMessage = {
  ApplicationError: "An Application Error Has Occured",
  Invalid_Request: "Invalid Request",
  Invalid_Login_Credentials: "Invalid username or password",
  Invalid_User_Credentials: "Invalid User Credentials",
  Invalid_Restaurant_Ref: "Invalid Restaurant Reference",
  Invalid_Request_Url: "Invalid Request URL",
  Invalid_User: "Invalid User",
  Invalid_User_Name_Or_Password: "Invalid UserName or Password",
  Invalid_Authentication: "Invalid Authentication",
  Unable_To_Place_Delivery: "Unable to Place Delivery",
  Delivery_No_Longer_Available: "Delivery No Longer Available",
  User_Assigned_To_Another_Delivery:
    "Rider Already Assigned To Another Delivery",
  Rider_Not_Assigned_For_Delivery: "Rider is not assigned for delivery",
  Unable_To_Update_Status: "Unable to update Status",
  Invalid_Status: "Invalid Status",
  Delivery_Already_In_Progress: "Delivery Already in Progress",
  Delivery_Already_Completed: "Delivery Already finished",
  Delivery_Already_Cancelled: "Delivery Already cancelled",
  Delivery_Already_Accepted: "Delivery Already Accepted By The Restaurant",
  Delivery_Already_Rejected: "Delivery Already Rejected By The Restaurant",
  Email_Already_In_Use: "Email address already in use",
  Phone_Already_In_Use: "Phone number already in use",
  Max_Rider_Accepted_Time_Exceeded: "Max rider to accept time exceeded",
  Invalid_Address_Reference: "Invalid Address Reference",
  Rider_Already_Accepted_Delivery: "Rider Already Accepted the trip",
  Invalid_Delivery_Ref: "Invalid Delivery Ref",
  Delivery_Already_Prepared: "Delivery Already Prepared By The Restaurant",
  Incorrect_OTP: "Incorrect OTP",
  Delivery_Not_In_Progress: "Rider Did Not Collect The Delivery",
  Delivery_Not_Prepared: "Restaurant Did Not Prepare The Delivery",
  Invalid_Wallet_Amount_Applied: "Invalid Wallet Balance Applied",
  Invalid_Dish_Ref: "Invalid Dish Ref",
  Dish_Not_Available: "Dish $dishname not available",
  Restaurant_Details_Updated: "We have update our Details",
  Delivery_Not_Estimated: "Delivery not Estimated",
  Pickup_Not_Estimated: "Pickup is not Estimated",
  Invalid_Pickup_Ref: "Invalid Pickup Ref",
  Invalid_Promo_Ref: "Invalid Promocode",
  Promo_code_Expired: "Promo Code Expired",
  Promo_Code_Doesnot_Support_Service:
    "This promo code is not eligible for this service",
  Not_Eligible_For_PromoCode: "You are not eligible for this promo code",
  Pickup_Already_Accepted: "Restaurant Already Accepted Pickup",
  Pickup_Already_Rejected: "Restaurant Already Rejected Pickup",
  Pickup_Not_Placed: "Pickup not placed",
  Pickup_Already_Prepared: "Restaurant Already Prepared Pickup",
  Pickup_Not_Accepted: "Pickup Not Accepted By Restaurant",
  Pickup_Already_Completed: "Pickup Already Completed Restaurant",
  Pickup_Not_Prepared: "Pickup Not Prepared By Restaurant",
  Inserviceable_Address: "Oops! we are not servicing in this area.",
  Not_Eligile_For_Feedback: "Oops! You cannot give feedback at this moment",
  Feedback_Already_Given: "Feedback already given",
  Delivery_InServiceable: "Sorry, We are not servicing at this moment",
  Pickup_InServiceable: "Sorry, We are not servicing at this moment",
  Pickup_No_Longer_Available: "Pickup No Longer Available",
  User_Permission_Not_Granted: "You Are Not Permitted To Pass This Request",
  Invalid_Rider_Reference: "Invalid Rider Reference",
  Delivery_Cant_Be_Edited: "This Delivery Cannot Be Edited",
  Delivery_Already_Assigned_To_The_Rider:
    "This Delivery Already  Assigned To The Rider",
  Rider_Already_Assigned_With_A_Delivery:
    "Rider Already Assigned With A Delivery",
  Inactive_Rider: "Rider Is Not Active",
  Reservation_InServiceable:
    "Sorry, We are not accepting reservation at this moment",
  Booking_Time_Already_Passed:
    "Oops looks like booking time has already passed",
    Booking_Already_Cancelled :  "Looks like booking was already been cancelled",
    Booking_Already_Accepted :  "Booking has already been accepted.",
    Booking_Customer_Visited_Restaurant : "Customer have already visited the restaurant",
    Booking_Req_Not_Fulfilled : "Oops! Looks like booking request was not fulfilled",
    Invalid_Booking_Ref : "Booking Reference is invalid",
    Customer_Completed_Booking : "Customer already completed booking",
    InSufficient_No_Of_Seats : "Looks like selected number of seats no available."
};

module.exports.RequestType = {
  ADMINLOGOUT:"AL",
  GETCUSTOMERDETAILS: "GCD",
  ISCUSTOMERPRESENT: "ICP",
  SAVESYSTEMUSER: "SSR",
  ADDRESTUSER: "ARU",
  AUTHENTICATEREQUEST: "AR",
  GETCUSTOMERADDRESSLIST: "GCAL",
  UPDATECUSTOMERDETAILS: "UCD",
  GETRESTAURANTSLIST: "GRL",
  SAVECUSTOMERADDRESS: "SCD",
  RIDERLOGIN: "RL",
  GETRESTAURANTITEMDETAILS: "GRID",
  PLACEDELIVERY: "PD",
  SAVERESTAURANT: "SR",
  SAVERESTAURANTCONFIGURATION: "SRC",
  REGISTERDEVICETOKEN: "RRDT",
  SAVERESTAURANTITEMDETAILS: "SRID",
  DELIVERYDETAILSFORPUSHNOTIFICATION: "DDFPN",
  UPDATEDELIVERYSTATUS: "UDS",
  GETRIDERDETAILS: "GRD",
  DELIVERYVIEW: "DV",
  RESTAURANTLOGIN: "RSL",
  DELIVERYLIST: "DL",
  RIDERACTIVEDELIVERYLIST: "RADL",
  GETRESTAURANTFORDELIVERY: "GRFD",
  RESTAURANTDELIVERYLIST: "RDL",
  CUSTOMERAPPSETTINGS: "CAS",
  RESTAURANTAPPSETTINGS: "RAS",
  CUSTOMERLOGIN: "CL",
  ADMINLOGIN: "ADCL",
  RESTAURANTIMAGES: "RI",
  GETRIDERACTIVEDELIVERY: "GRAD",
  HASACTIVEPICKUP: "HAP",
  GETWALLETBALANCE: "GWB",
  SAVEFAVOURITE: "SF",
  VALIDATEPLACEPICKUP: "VPP",
  VALIDATEPLACEDELIVERY: "VPD",
  GETALLPROMOCODES: "PLFC",
  PLACEPICKUP: "PP",
  PICKUPLIST: "PL",
  UPDATEPICKUPSTATUS: "UPS",
  PICKUPLIST: "PL",
  GETNOTIFICATIONLIST: "GNL",
  RESTAURANTPROFILE: "RP",
  SAVEFEEDBACK: "SFD",
  GETRESTAURANTDISHES: "GRD",
  GETAVAILABLERIDERS: "GAR",
  EDITDELIVERY: "ED",
  DISHESFORPICKUP: "DFP",
  GETRESTAURANTBOOKATABLESETTING: "GRBTS",
  CONFIRMBOOKTABLE: "CBT",
  GETBOOKATABLELIST: "GBATL",
  UPDATEBOOKINGSTATUS :"UBS",
  GETBOOKINGLISTFORRESTAURANT: "GBLFR",
  BOOKINGVIEW : "BV",
  GETBOOKINGCONFIGURATION : "GBC",
  SAVEBOOKINGCONFIG :"SBC"
};

module.exports.UserType = {
  CUSTOMER: 1,
  RIDER: 2,
  RESTAURANT: 3,
  SUPERADMIN: 4,
};

module.exports.RiderVerificationStatus = {
  PENDING: 1,
  VERIFIED: 2,
};

module.exports.CustomerVerificationStatus = {
  PENDING: 1,
  VERIFIED: 2,
};

module.exports.DeliveryStatus = {
  DELIVERY_PLACED: 1,
  DELIVERY_ACCEPTED: 2,
  DELIVERY_IN_PROGRESS: 3,
  DELIVERY_CANCELLED_BY_CUSTOMER: 4,
  DELIVERY_CANCELLED_BY_RIDER: 5,
  DELIVERY_COMPLETED: 6,
  DELIVERY_PAYMENT_SUCCESSFUL: 7,
  DELIVERY_PAYMENT_UNSUCCESSFUL: 8,
  DELIVERY_FORCE_COMPLETE: 9,
  RESTAURANT_ACCEPT_DELIVERY: 10,
  RESTAURANT_REJECT_DELILVERY: 11,
  DELIVERY_REQUEST_UNFUFILLED: 12,
  RESTAURANT_DELIVERY_PREPARED: 13,
  NO_RIDERS_AVAILABLE: 14,
  DELIVERY_ESTIMATED_BY_CUSTOMER: 15,
  DELIVERY_PAYMENT_REFUND_BY_RESTAURANT: 16,
  RIDER_ASSIGNED: 17,
  RIDER_REPLACED: 18,
};

module.exports.PickupStatus = {
  PICKUP_ESTIMATE: 1,
  PICKUP_PLACED: 2,
  RESTAURANT_ACCEPT_PICKUP: 3,
  RESTAURANT_CANCEL_PICKUP: 4,
  RESTAURANT_PICKUP_PREPARED: 5,
  PICKUP_COMPLETE: 6,
  PICKUP_PAYMENT_FAILURE: 7,
  PICKUP_REQUEST_NOT_FULFILLED: 8,
  PICKUP_PAYMENT_REFUND_BY_RESTAURANT: 9,
};

module.exports.PushNotificationType = {
  Rider_Delivery_Request: 1,
  Restaurant_Delivery_Request: 2,
  Restaurant_Accept_Delivery: 3,
  Restaurant_Reject_Delivery: 4,
  Customer_Request_Not_Fulfilled: 5,
  Restaurant_Pickup_Request: 6,
  Rider_Accept_Delivery: 7,
  Restaurant_Order_Prepared: 8,
  Rider_Pickup_Restaurant_Order: 9,
  Customer_Delivery_Complete: 10,
  Restaurant_Pickup_Accept: 11,
  Restaurant_Pickup_Cancel: 12,
  Restaurant_Pickup_Prepared: 13,
  Restaurant_Pickup_Complete: 14,
  Restaurant_No_Riders_Available: 15,
  Restaurant_Cancel_Delivery_On_Post_Complete: 16,
  Restaurant_Cancel_Pickup_On_Post_Complete: 17,
  Customer_Rider_Assigned_For_Delivery: 18,
  Rider_Assigned_For_Delivery: 19,
  Rider_Replaced_For_Delivery: 20,
  Restaurant_Booking_Request : 21,
  Customer_Booking_Request_Not_Fulfilled : 22,
  Restaurant_Booking_Accepted : 23,
  Restaurant_Booking_Reject : 24,
  Customer_Visited_Booking_Restaurant : 25,
  Customer_Booking_Complete : 26
};

module.exports.RestaurantUserType = {
  Type_Owner: 1,
  Type_Manager: 2,
  Type_Cashier: 3,
};

module.exports.DishCategory = {
  Normal: 1,
  BestSeller: 2,
  CustomerPreviousOrder: 3,
};

module.exports.LoginType = {
  PHONELOGIN: 1,
  EMAILLOGIN: 2,
};

module.exports.PaymentOption = {
  COD: 1,
  CC: 2,
};

module.exports.PromoType = {
  Normal: 1,
  Customizable: 2,
};

module.exports.ServiceType = {
  Delivery: 1,
  Pickup: 2,
  BookATable: 3,
};

module.exports.PromoValueType = {
  Amount: 1,
  Percentage: 2,
};

module.exports.ServiceSchedule = {
  Start: 1,
  Stop: 0,
};

module.exports.DishType = {
  Combos: 1,
  Soups: 2,
  Starters: 3,
  TandoorSe: 4,
  SeafoodStarters: 5,
  SeafoodPrawns: 6,
  SeafoodKingfish: 7,
  SeafoodPomfret: 8,
  SeafoodChonak: 9,
  SeafoodTamoshi: 10,
  SeafoodModso: 11,
  SeafoodSquid: 12,
  SeafoodCrabs: 13,
  SeafoodMackeral: 14,
  ContinentalPicks: 15,
  IndianMainCourseVeg: 16,
  IndianMainCourseNonVeg: 17,
  GoanCurries: 18,
  ChineseMainCourse: 19,
  RiceAndNoodles: 20,
  Accompaniments: 21,
  SaladsAndRaita: 22,
  Desserts: 23,
};

module.exports.FeedbackRatingType = {
  Star: 1,
  Text: 2,
  Conditional : 3
};

module.exports.APPTYPE = {
  Android: 1,
  iOS: 2,
};

module.exports.DishItemImageOperation = {
  NoChange: 1,
  ItemImageReplace: 2,
  DeleteItemImage: 3,
};

module.exports.BookTableStatus = {
  BookingPlaced: 1,
  BookingAccepted: 2,
  BookingCancelled: 3,
  CustomerVisited: 4,
  BookingReqNotfufilled: 5,
  CustomerBookingCompleted: 6,
};

module.exports.BookingSlotDayShift = {
  DayShift_1: 1,
  DayShift_2: 2,
};

module.exports.BookingStatusFilter = {
  ActiveBookings: 1,
  AllBookings: 2,
};

module.exports.BookingFeedbackRatingMapKey = {
  Excellent: 1,
  Very_Good: 2,
  Good : 3,
  Average : 4 ,
  Poor : 5,
  NA : 6
};

module.exports.BookingFeedbackRatingMapValue = {
  Excellent: "Excellent",
  Very_Good: "Very Good",
  Good : "Good",
  Average : "Average" ,
  Poor : "Poor",
  NA : "N/A"
};
