import Layout from "../components/Layout";
import HomeCarousel from "../components/Home/HomeCarousel";
import PopularDestinations from "../components/Home/PopularDestinations";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { withTranslation } from "react-i18next";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const AboutUs = () => {

   const { t } = useTranslation(['common','aboutus']);
   return (
      <Layout>
         <div className="">
            <Head>
               <title>Hotellidiilid.ee - soodsad hotellid</title>
               <link rel="icon" href="/images/favicon.ico" />
            </Head>
            <main className="">
               <div className="container about-container">
                  <div className="col-md-12 about-content">
                        <h1 className="sitemainheadding">{t('aboutus:heading')}</h1>
                        <p>
                           {t('aboutus:description1')}
                        </p>
                        <p>
                           {t('aboutus:description2')}
                        </p>

                        <h3>{t('aboutus:subheading')}</h3>
                        <p>
                           <strong>{t('aboutus:point1')}</strong>: 12472112 <br/>
                           <strong>{t('aboutus:point2')}</strong>: EE101740010 <br/>
                           <strong>{t('aboutus:point3')}</strong>: EE387700771003647650 (LHV) <br/>
                           <strong>{t('aboutus:point4')}</strong>: {t('aboutus:point5')} <br/>
                           <strong>{t('aboutus:point5')}</strong>: info@hotellidiilid.ee <br/>
                           <strong>{t('aboutus:point6')}</strong>: +372 55 600 554 ({t('aboutus:point5')} 10.00-16.00) <br/>
                        </p>
                  </div>
               </div>
            </main>
         </div>
      </Layout>
   );
}

export const getStaticProps = async ({ locale }) => ({
   props: {
     ...await serverSideTranslations(locale, ['common', 'aboutus']),
   },
 })

export default AboutUs;