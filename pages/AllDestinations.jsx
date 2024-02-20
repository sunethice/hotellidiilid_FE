import Layout from "../components/Layout";
import AllDestContent from "../components/Home/AllDestContent";
import Head from "next/head";
import styles from "../styles/Results.module.scss";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const AllDestinations = () => {
   const { t } = useTranslation(['common','results']);
   return (
      <Layout>
         <div className={`${styles.results_page}`}>
            <Head>
               <title>{t('results:title')}</title>
               <link rel="icon" href="/images/favicon.ico" />
            </Head>
            <main>
               <AllDestContent></AllDestContent>
            </main>
         </div>
      </Layout>
   );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common','footer']),
  },
})

export default AllDestinations;
