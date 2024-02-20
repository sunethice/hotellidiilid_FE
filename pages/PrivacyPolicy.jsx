import Layout from "../components/Layout";
import HomeCarousel from "../components/Home/HomeCarousel";
import PopularDestinations from "../components/Home/PopularDestinations";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { withTranslation } from "react-i18next";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const PrivacyPolicy = () => {

   const { t } = useTranslation(['common','privacy']);
   return (
      <Layout>
         <div className="">
            <Head>
               <title>Hotellidiilid.ee - soodsad hotellid</title>
               <link rel="icon" href="/images/favicon.ico" />
            </Head>
            <main className="">
               <div className="container privacy-container">
                  <div className="col-lg-12 static-content">

                     <h1 className="sitemainheadding">{t('privacy:heading')}</h1>
                     <p>
                        {t('privacy:description')}
                     </p>

                     <h3>1. {t('privacy:point1')}</h3>
                     <p>
                        {t('privacy:desc1_1')} <a href="mailto:info@reisidiilid.ee">info@reisidiilid.ee</a>
                        <br/><br/>
                        {t('privacy:desc1_2')}
                     </p>

                     <h3>2.{t('privacy:point2')}</h3>
                     <ol>
                           <li>{t('privacy:desc2_1')}
                              <ul>
                                 <li>{t('privacy:desc2_1_1')};</li>
                                 <li>{t('privacy:desc2_1_2')};</li>
                                 <li>{t('privacy:desc2_1_3')};</li>
                                 <li>{t('privacy:desc2_1_4')};</li>
                                 <li>{t('privacy:desc2_1_5')};</li>
                                 <li>{t('privacy:desc2_1_6')};</li>
                              </ul>
                           </li>
                           <li>{t('privacy:desc2_2')}
                              <ul>
                                 <li>{t('privacy:desc2_2_1')}</li>
                                 <li>{t('privacy:desc2_2_2')}</li>
                                 <li>{t('privacy:desc2_2_3')}</li>
                                 <li>{t('privacy:desc2_2_4')}</li>
                              </ul>
                           </li>
                     </ol>

                     <h3>3. {t('privacy:point3')}</h3>
                     <p>
                        {t('privacy:desc3_1')}
                        <br/><br/>
                        {t('privacy:desc3_2')}
                     </p>
                     <ul>
                        <li>{t('privacy:desc3_3')}</li>
                        <li>{t('privacy:desc3_4')}</li>
                        <li>{t('privacy:desc3_5')}</li>
                     </ul>
                     <p>
                        {t('privacy:desc3_6')}
                        <br/>
                        {t('privacy:desc3_7')}
                        <br/>
                        {t('privacy:desc3_8')}
                        <br/>
                        {t('privacy:desc3_9')}
                     </p>

                     <h3>4. {t('privacy:point4')}</h3>
                     <ul>
                        <li>{t('privacy:desc4_1')}</li>
                        <li>{t('privacy:desc4_2')}</li>
                        <li>{t('privacy:desc4_3')}</li>
                        <li>{t('privacy:desc4_4')}</li>
                        <li>{t('privacy:desc4_5')}</li>
                        <li>{t('privacy:desc4_6')}</li>
                     </ul>

                     <h3>5. {t('privacy:point5')}</h3>
                     <p>
                        {t('privacy:desc5_1')}
                        <br/>
                        {t('privacy:desc5_2')}
                     </p>

                     <h3>6. {t('privacy:point6')}</h3>
                     <p>
                        {t('privacy:desc6')}
                     </p>

                     <h3>7. {t('privacy:point7')}</h3>
                     <p>
                        {t('privacy:desc7_1')}<a href="mailto:info@reisidiilid.ee">info@reisidiilid.ee</a>. {t('privacy:desc7_2')}
                     </p>

                     <h3>8. {t('privacy:point8')}</h3>
                     <p>
                        {t('privacy:desc8_1')}
                        <br/>
                        {t('privacy:desc8_2_1')}<a href="mailto:info@reisidiilid.ee">info@reisidiilid.ee</a>, {t('privacy:desc8_2_2')}
                        <br/>
                        {t('privacy:desc8_3')}
                        <br/>
                        {t('privacy:desc8_4_1')} <a target="_blank" href="http://ec.europa.eu/newsroom/article29/item-detail.cfm?item_id=612080">{t('privacy:desc8_4_2')}</a>.
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
     ...await serverSideTranslations(locale, ['common','privacy']),
   },
})

export default PrivacyPolicy;