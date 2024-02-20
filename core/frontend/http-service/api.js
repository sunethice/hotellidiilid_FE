import axios from "axios";
import { getClientToken } from "./api.http";
import hotelbedsService from "../../backend/services/hotelbeds.service";
import Cookies from "js-cookie";

/* API */
const api = axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
});

const hbApi = axios.create({
   baseURL: process.env.NEXT_PUBLIC_HB_API_ENDPOINT,
});

const getRefreshToken = () => {
   return Cookies.get("refresh_token");
};

const handleException = (error, msg = "") => {
   // if (process && process.env && (process.env.DEVELOPMENT)) {
   console.log(`[ERR] : [${msg}] `, error);
   // }
};

hbApi.interceptors.request.use((config) => {
   try {
      const token = Cookies.get("access_token");
      config.headers.Authorization = token ? `Bearer ${token}` : "";
      config.headers["X-localization"] = Cookies.get("X-localization")
         ? Cookies.get("X-localization")
         : "es";
      return config;
   } catch (error) {
      handleException(error, "Could not get app token");
   }
   return config;
});

// api : handle response errors
hbApi.interceptors.response.use(
   (response) => {
      return response;
   },
   (error) => {
      if (error.response.status === 401) {
         const initialReq = error.response.config;
         if (!initialReq._retry) {
            initialReq._retry = true;
            const refreshToken = getRefreshToken();
            // check if the user logged in by using the 'user cookie'
            if (refreshToken) {
               const mHotelbedsService = new hotelbedsService();
               mHotelbedsService
                  .refreshPasswordGrantToken()
                  .then((response) => {
                     if (response.status == 200) {
                        res.setHeader(
                           "Set-Cookie",
                           serialize(
                              "access_token",
                              response.data.access_token,
                              {
                                 path: "/",
                                 httpOnly: false, // no javascript can read
                                 secure: process.env.ENV !== "development", // only send this cookie over https connections when environment not in development
                                 maxAge: response.data.expires_in,
                                 // expires:new Date(0),
                              }
                           )
                        );
                        res.setHeader(
                           "Set-Cookie",
                           serialize(
                              "refresh_token",
                              response.data.refresh_token,
                              {
                                 path: "/",
                                 httpOnly: false, // no javascript can read
                                 secure: process.env.ENV !== "development", // only send this cookie over https connections when environment not in development
                                 maxAge: response.data.expires_in,
                                 // expires:new Date(0),
                              }
                           )
                        );
                        return api(initialReq);
                     }
                  })
                  .catch((error) => {
                     console.log(error);
                  });
            } else {
               return getClientToken()
                  .then((res) => {
                     return api(initialReq);
                  })
                  .catch((err) => {
                     console.log(err);
                  });
            }
         } else {
            console.log("not retry hbapi");
         }
      }
      return Promise.reject(error);
   }
);

api.interceptors.request.use((config) => {
   try {
      const token = Cookies.get("access_token");
      config.headers.Authorization = token ? `Bearer ${token}` : "";
      config.headers["X-localization"] = Cookies.get("X-localization")
         ? Cookies.get("X-localization")
         : "es";
      return config;
   } catch (error) {
      handleException(error, "Could not get app token");
   }
   return config;
});

api.interceptors.response.use(
   (response) => {
      return response;
   },
   (error) => {
      if (error.status === 401) {
         // return authErrorHandler(api, error);
         const initialReq = error.config;
         if (!initialReq._retry) {
            initialReq._retry = true;
            const refreshToken = getRefreshToken();
            // check if the user logged in by using the 'user cookie'
            if (refreshToken) {
               const mHotelbedsService = new hotelbedsService();
               mHotelbedsService
                  .refreshPasswordGrantToken()
                  .then((response) => {
                     if (response.status == 200) {
                        res.setHeader(
                           "Set-Cookie",
                           serialize(
                              "access_token",
                              response.data.access_token,
                              {
                                 path: "/",
                                 httpOnly: false, // no javascript can read
                                 secure: process.env.ENV !== "development", // only send this cookie over https connections when environment not in development
                                 maxAge: response.data.expires_in,
                                 // expires:new Date(0),
                              }
                           )
                        );
                        res.setHeader(
                           "Set-Cookie",
                           serialize(
                              "refresh_token",
                              response.data.refresh_token,
                              {
                                 path: "/",
                                 httpOnly: false, // no javascript can read
                                 secure: process.env.ENV !== "development", // only send this cookie over https connections when environment not in development
                                 maxAge: response.data.expires_in,
                                 // expires:new Date(0),
                              }
                           )
                        );
                        return api(initialReq);
                     }
                  })
                  .catch((error) => {
                     console.log(error);
                  });
            } else {
               return getClientToken()
                  .then((res) => {
                     return api(initialReq);
                  })
                  .catch((err) => {
                     console.log(err);
                  });
            }
         } else {
            console.log("not retry");
         }
      }
      return Promise.reject(error);
   }
);

export { api, hbApi };
