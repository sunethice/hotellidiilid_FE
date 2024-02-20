import "../styles/globals.scss";
import "../styles/main.scss";
import { useEffect, useState } from 'react';
import { appWithTranslation } from 'next-i18next';
import { Provider } from 'react-redux'
import { wrapper } from "../redux/store";
import {useStore} from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import { getClientToken } from "../core/frontend/http-service/api.http";
import Cookies from "js-cookie";
import { useRouter } from 'next/router';
import SimpleReactLightbox from 'simple-react-lightbox';
import { ToastContainer  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyApp = ({ Component, pageProps }) => {
   const router = useRouter();
   useEffect(() => {
      if (router.locale == 'en') {
         Cookies.set("X-localization", "en");
      }
      else {
         Cookies.set("X-localization", "es");
      }
      if (!Cookies.get("access_token")) {
         const res = getClientToken().then((res) => {
            if (res.status == 200) {
               return {
                  props: { res },
               }
            }
         }).catch(error => {
            console.log(error);
         });
      }
   });

   const store = useStore((state) => state);
   return (
      <PersistGate persistor={store.__persistor} loading={<div><img src="/images/loading_gear.gif"/></div>}>
         <SimpleReactLightbox>
            <Component {...pageProps} />
            <ToastContainer
               position="bottom-right"
               autoClose={5000}
               hideProgressBar={true}
               newestOnTop={false}
               closeOnClick
               rtl={false}
               pauseOnFocusLoss
               draggable
               pauseOnHover
            />
         </SimpleReactLightbox>
      </PersistGate>);
}

export default wrapper.withRedux(appWithTranslation(MyApp));



