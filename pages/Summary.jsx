import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Head from "next/head";
import SideBar from "../components/Summary/SideBar";
import ContentWrap from "../components/Summary/ContentWrap";
import styles from "../styles/Summary.module.scss";
import { useState, useEffect } from "react";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SummaryProvider } from '../context/SummaryContext';

const Summary = () => {
   const { t } = useTranslation('summary');
   const router = useRouter();
   const [cNoOfResults, setResultsCount] = useState();
   const [cResultsObj, setResultsObj] = useState();
   const [cFilterObj, setFilterObj] = useState({});
   const [cCurrentPage, setPage] = useState(1);
   let mHotelCode = null;

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
                     <SummaryProvider value={{
                           cCurrentPage: cCurrentPage,
                           setPage:setPage
                        }}>
                        <SideBar
                           // filterObjUpdate={updateFilterObj}
                        ></SideBar>
                        <ContentWrap
                           HotelCode={mHotelCode}
                        ></ContentWrap>
                     </SummaryProvider>
                  </div>
               </div>
            </main>
         </div>
      </Layout>
   );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common','summary','footer']),
  },
})

export default Summary;
