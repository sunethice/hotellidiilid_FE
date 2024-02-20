import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Head from "next/head";
import SideBar from "../components/Results/SideBar";
import Banner from "../components/Results/Banner";
import ContentWrap from "../components/Results/ContentWrap";
import Map from "../components/Results/Map";
import styles from "../styles/Results.module.scss";
import { useState, useEffect } from "react";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Results = () => {
   const [mapOptions, setMapOptions]= useState({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      radius: 15000, //this is in meters
      zIndex: 1
   });
   const [zoomLevel, setZoomLevel]= useState(10);

   const { t } = useTranslation(['common','results']);
   return (
      <Layout>
         <div className={`${styles.results_page}`}>
            <Head>
               <title>{t('results:title')}</title>
               <link rel="icon" href="/images/favicon.ico" />
            </Head>
            <main>
               <Banner></Banner>
               <div className={`container ${styles.wrapper}`}>
                  <div className="row">
                     <SideBar options={mapOptions} changeOptions={setMapOptions} changeMapZoom={setZoomLevel}></SideBar>
                     <ContentWrap></ContentWrap>
                     <div className={`col-lg-4 border ${styles.google_map}`}>
                        <Map options={mapOptions} zoomLevel={zoomLevel}></Map>
                     </div>
                  </div>
               </div>
            </main>
         </div>
      </Layout>
   );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'results','footer']),
  },
})

export default Results;
