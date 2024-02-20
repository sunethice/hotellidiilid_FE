import axios, { AxiosPromise } from 'axios';

class hotelbedsService {

   private authToken: string;

   constructor(authToken: string = null) {
      this.authToken = authToken;
   }

   getClientCredentialToken() {
      return axios.post(process.env.HB_API_ENDPOINT + "/oauth/token", {
         grant_type: "client_credentials",
         client_id: process.env.NEXT_PUBLIC_HB_CLIENT_ID,
         client_secret: process.env.NEXT_PUBLIC_HB_CLIENT_SECRET,
         scope: "user",
      });
   }

   getPasswordGrantToken(pUserName, pPassword, pScope = "user") {
      return axios.post(process.env.HB_API_ENDPOINT + "/oauth/token", {
         grant_type: "password",
         client_id: process.env.NEXT_PUBLIC_HB_CLIENT_ID,
         client_secret: process.env.NEXT_PUBLIC_HB_CLIENT_SECRET,
         username: pUserName, //"taylor@laravel.com",
         password: pPassword,//"my-password",
         scope: pScope, //or admin
      });
   }

   refreshPasswordGrantToken(pRefreshToken) {
      return axios.post(process.env.HB_API_ENDPOINT + "/oauth/token", {
         grant_type: "refresh_token",
         refresh_token:pRefreshToken,
         client_id: process.env.NEXT_PUBLIC_HB_CLIENT_ID,
         client_secret: process.env.NEXT_PUBLIC_HB_CLIENT_SECRET,
         scope: ''
      });
   }

   valuateHotelBooking(pBookingReference) {
      return axios.post(process.env.HB_API_ENDPOINT + "/api/check_rates", {rate_key:pBookingReference},{
         headers: {
            'Authorization': this.authToken
         }
      });
   }

   insertHotelBooking(pBookingDetails) : Promise<AxiosPromise>{
        return axios.post(process.env.HB_API_ENDPOINT + "/api/process_booking", pBookingDetails,{
         headers: {
            'Authorization': this.authToken
         }
      });
    }

}

export default hotelbedsService;