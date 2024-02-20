import { hbApi } from "./api";

export function getAvailabilities(pSearchParam, pPageNo = 1) {
   return hbApi.post("/api/get_aval_by_hotel?page=" + pPageNo, pSearchParam);
}

export function getHotelDetails(pHotelCode) {
   return hbApi.get("/api/get_hotel_by_code", {
      params: {
         hotel_code: pHotelCode,
      },
   });
}

export function getHotelByName(pHotelName) {
   return hbApi.get("/api/get_hotel_by_name", {
      params: {
         name: pHotelName,
      },
   });
}

export function getCountyList() {
   return hbApi.get("/api/list_countries");
}

export function getDestByCountry(pCountryCode){
   return hbApi.get("/api/list_country_destinations", {
      params: {
         country_code: pCountryCode,
      },
   });
}

export function getZonesByDestination(pDestCode){
   return hbApi.get("/api/list_destination_zones", {
      params: {
         destination_code: pDestCode,
      },
   });
}

export function getHotelsByZone(pCountryCode,pDestCode,pZoneCode){
   return hbApi.get("/api/list_hotels_by_zone", {
      params: {
         country_code: pCountryCode,
         destination_code: pDestCode,
         zone_code: pZoneCode
      },
   });
}


export function processBooking(pBookingParam) {
   return hbApi.post("/api/process_booking", pBookingParam);
}

export function getLocationsByPhrase(pStrPhrase) {
   return hbApi.get("/api/list_loc_by_phrase", {
      params: {
         phrase: pStrPhrase,
      },
   });
}

export function registerClient(pRegisterInfo) {
   return hbApi.post("/api/signup", pRegisterInfo);
}

export function signinClient(pLoginInfo) {
   return hbApi.post("/api/signin", pLoginInfo);
}

export function forgotPassword(pInfo) {
   return hbApi.post("/api/send_reset_link", pInfo);
}

export function resetPassword(pNewPWDDetails) {
   return hbApi.post("/api/reset_password", pNewPWDDetails);
}

export function getTurnoverReport(pSearchData, pPageNo = 1) {
   return hbApi.get("/api/list_turnover?page=" + pPageNo, {
      params: pSearchData
   });
}

export function getReservationReport(pSearchData, pPageNo = 1) {
   return hbApi.get("/api/list_bookings?page=" + pPageNo, {
      params: pSearchData
   });
}

export function getMarkupReport(pSearchData, pPageNo = 1) {
   return hbApi.get("/api/search_markup?page=" + pPageNo, {
      params: pSearchData
   });
}

export function updateGeneralMarkup(pGeneralMarkupData){
   return hbApi.post("/api/update_general_markup", pGeneralMarkupData);
}

export function createDestinationMarkup(pDestinationMarkupData){
   return hbApi.post("/api/create_markup", pDestinationMarkupData);
}

export function updateDestinationMarkup(pDestinationMarkupData){
   return hbApi.post("/api/update_markup",pDestinationMarkupData);
}

export function getBookingDetails(pReferenceNo){
   return hbApi.get("/api/get_booking_details",{
      params : {
         booking_reference : pReferenceNo
      }
   });
}

export function cancelBooking(pReferenceNo){
   return hbApi.post("/api/cancel_booking",{booking_reference : pReferenceNo});
}