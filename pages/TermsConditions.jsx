import Layout from "../components/Layout";
import HomeCarousel from "../components/Home/HomeCarousel";
import PopularDestinations from "../components/Home/PopularDestinations";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { withTranslation } from "react-i18next";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const TermsConditions = () => {

   const { t } = useTranslation(['common','privacy']);
   return (
      <Layout>
         <div className="">
            <Head>
               <title>Hotellidiilid.ee - soodsad hotellid</title>
               <link rel="icon" href="/images/favicon.ico" />
            </Head>
            <main className="">
               <div className="container terms-container">
                  <div className="col-lg-12 static-content">
                     <h1 className="sitemainheadding">{t('terms:heading')}<a name="_GoBack"></a></h1>
                     <p>{t('terms:description')}</p>
                     
                        <h3>1. {t('terms:point1')}</h3>
                     <p>
                        <strong>{t('terms:desc1_1')}</strong>&nbsp; – {t('terms:desc1_2')}
                     </p>
                     <strong>{t('terms:desc1_3')} </strong>&nbsp; – {t('terms:desc1_4')}<br/>
                     <strong>{t('terms:desc1_5')}</strong>&nbsp;– {t('terms:desc1_6')}  <a href="http://www.hotellidiilid.ee">www.hotellidiilid.ee </a><br/>
                     <strong>{t('terms:desc1_7')}</strong>&nbsp;– {t('terms:desc1_8')}<br/>
                     <strong>{t('terms:desc1_9')}</strong>&nbsp;– {t('terms:desc1_10')}<br/>
                     <strong>{t('terms:desc1_11')}</strong>&nbsp;– {t('terms:desc1_12')}<br/>
                     
                     <h3>2. {t('terms:point2')}</h3>
                     <p>
                        {t('terms:desc2_1')} <a href="mailto:info@hotellidiilid.ee">info@hotellidiilid.ee</a> {t('terms:desc2_2')} <br/>
                        {t('terms:desc2_3')}
                     </p>
                     
                     <h3>3. {t('terms:point3')}</h3>
                     <p>
                        {t('terms:desc3_1')} <a href="mailto:info@hotellidiilid.ee">info@hotellidiilid.ee</a> {t('terms:desc3_2')}
                        <br/>
                           {t('terms:desc3_3')}
                     </p>
                     
                     <h3>4. {t('terms:point4')}</h3>
                     <p>{t('terms:desc4')}</p>
                     
                     <h3>5. {t('terms:point5')}</h3>
                     <p>{t('terms:desc5')}</p>
                     
                     <h3>6. {t('terms:point6')}</h3>
                     <p>{t('terms:desc6')}</p>
                     
                     <h3>7. {t('terms:point7')}</h3>
                     <p>{t('terms:desc7_1')}<br/>
                        {t('terms:desc7_2')}
                     </p>
                     
                     <h3>8. {t('terms:point8')}</h3>
                     <p>{t('terms:desc8')}</p>
                     
                     <h3>9. {t('terms:point9')}</h3>
                     <p>{t('terms:desc9')}</p>
                     
                     <h3>10. {t('terms:point10')}</h3>
                     <p>{t('terms:desc10')}</p>
                     
                     <h3>11. {t('terms:point11')}</h3>
                     <p>{t('terms:desc11_1')}</p>
                     <br/>
                     <p>{t('terms:desc11_2')} <a href="mailto:info@hotellidiilid.ee">info@hotellidiilid.ee</a></p>
                     
                     <h3>12. {t('terms:point12')}</h3>
                     <p>{t('terms:desc12')}</p>
                     
                     <h3>13. {t('terms:point13')}</h3>
                     <p>{t('terms:desc13')}</p>
                     
                     <h3>14. {t('terms:point14')}</h3>
                     <p>{t('terms:desc14')}</p>
                  </div>
               </div>
            </main>
         </div>
      </Layout>
   );
}

export const getStaticProps = async ({ locale }) => ({
   props: {
     ...await serverSideTranslations(locale, ['common', 'terms']),
   },
 })

export default TermsConditions;