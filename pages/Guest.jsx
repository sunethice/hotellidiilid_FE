import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Head from "next/head";
import SideBar from "../components/Guest/SideBar";
import ContentWrap from "../components/Guest/ContentWrap";
import styles from "../styles/Guest.module.scss";
import { useState, useEffect } from "react";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { LoadScript } from '@react-google-maps/api';

const Guest = () => {
   const { t } = useTranslation('guest');
   const router = useRouter();
   const [cNoOfResults, setResultsCount] = useState();
   const [cResultsObj, setResultsObj] = useState();
   const [cFilterObj, setFilterObj] = useState({});
   let mHotelCode = null;

   const updateResultsCount = (resultsObj) => {
      let total = 0;
      if (resultsObj !== null && resultsObj.total !== undefined) {
         setResultsCount(resultsObj.total);
         setResultsObj(resultsObj);
      } else setResultsCount(total);
   };

   // const updateFilterObj = (filterObj) => {

   //    console.log(filterObj);
   //    setFilterObj(filterObj);
   // }

   if (router.query.hotelcode !== undefined)
      mHotelCode = JSON.parse(router.query.hotelcode);
   return (
      <Layout>
         <div className={`${styles.results_page}`}>
            <Head>
               <title>{t('title')}</title>
               <link rel="icon" href="/images/favicon.ico" />
            </Head>
            <main>
               <div className={`container ${styles.wrapper}`}>
                  <div className="row">
                     <LoadScript
                        googleMapsApiKey={ process.env.NEXT_PUBLIC_GOOGLE_KEY}
                     >
                        <SideBar></SideBar>
                        <ContentWrap HotelCode={mHotelCode}></ContentWrap>
                     </LoadScript>
                  </div>
               </div>
            </main>
         </div>
      </Layout>
   );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'guest','footer']),
  },
})

export default Guest;
