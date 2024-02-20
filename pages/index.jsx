import Layout from "../components/Layout";
import HomeCarousel from "../components/Home/HomeCarousel";
import PopularDestinations from "../components/Home/PopularDestinations";
import AdvantageBar from "../components/Home/AdvantageBar";
import Head from "next/head";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Home = () => {
   const { t } = useTranslation('home');
   return (
      <Layout>
         <div className="">
            <Head>
               <title>{t('title')}</title>
               <link rel="icon" href="/images/favicon.ico" />
            </Head>
            <main className="">
               <HomeCarousel></HomeCarousel>
               <AdvantageBar></AdvantageBar>
               <PopularDestinations></PopularDestinations>
            </main>
         </div>
      </Layout>
   );
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'home','footer']),
  },
})

export default Home;