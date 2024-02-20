import Layout from "../components/Layout";
import HomeCarousel from "../components/Home/HomeCarousel";
import PopularDestinations from "../components/Home/PopularDestinations";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { withTranslation } from "react-i18next";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const FAQs = () => {

   const { t } = useTranslation(['common','faq']);
   return (
      <Layout>
         <div className="">
            <Head>
               <title>Hotellidiilid.ee - soodsad hotellid</title>
               <link rel="icon" href="/images/favicon.ico" />
            </Head>
            <main className="">
               <div className="container faq-container">
                  <div className="col-lg-12">
                     <h1 className="sitemainheadding">FAQ</h1>
                     <table border="0" className="content_text" id="table_style" bordercolor="#FFFFFF" width="98%">
                        <tbody>
                           <tr>
                              <td>
                                 <ol className="faq_table_ollist">
                                    <li><a href="#qu_1">{t('faq:qu1')}</a></li>
                                    <li><a href="#qu_2">{t('faq:qu2')}</a></li>
                                    <li><a href="#qu_3">{t('faq:qu3')}</a></li>
                                    <li><a href="#qu_4">{t('faq:qu4')}</a></li>
                                    <li><a href="#qu_5">{t('faq:qu5')}</a></li>
                                    <li><a href="#qu_6">{t('faq:qu6')}</a></li>
                                    <li><a href="#qu_7">{t('faq:qu7')}</a></li>
                                    <li><a href="#qu_8">{t('faq:qu8')}</a></li>
                                    <li><a href="#qu_9">{t('faq:qu9')}</a></li>
                                 </ol>
                              </td>
                           </tr>
                           
                           <tr>
                              <td>
                                 &nbsp;
                              </td>
                           </tr>
                           <tr>
                              <td className="content_heading" >
                                 <a id="qu_1"></a>1.{t('faq:qu1')}
                              </td>
                           </tr>
                           <tr>
                              <td width="97%">
                                 <p>
                                    {t('faq:ans1')}
                                    <br/>
                                    <a href="#top">{t('faq:goto_top')}</a>
                                 </p>
                              </td>
                           </tr>

                           <tr>
                              <td>
                                 &nbsp;
                              </td>
                           </tr>
                           <tr>
                              <td className="content_heading" >
                                 <a id="qu_2"></a>2. {t('faq:qu2')}
                              </td>
                           </tr>
                           <tr>
                              <td width="97%">
                                 <p>
                                    {t('faq:ans2')}
                                    <br/>
                                    <a href="#top">{t('faq:goto_top')}</a>
                                 </p>
                              </td>
                           </tr>
                           
                           <tr>
                              <td>
                                 &nbsp;
                              </td>
                           </tr>
                           <tr>
                              <td className="content_heading" >
                                 <a id="qu_3"></a>3. {t('faq:qu3')}
                              </td>
                           </tr>
                           <tr>
                              <td width="97%">
                                 <p>
                                    
                                    {t('faq:ans3_p1')} <a href="mailto:info@hotellidiilid.ee"> info@hotellidiilid.ee </a>. {t('faq:ans3_p2')}
                                    <br/>
                                    <a href="#top">{t('faq:goto_top')}</a>
                                 </p>
                              </td>
                           </tr>
                           
                           <tr>
                              <td>
                                 &nbsp;
                              </td>
                           </tr>
                           <tr>
                              <td className="content_heading" >
                                 <a id="qu_4"></a>4. {t('faq:qu4')}
                              </td>
                           </tr>
                           <tr>
                              <td width="97%">
                                 <p>
                                    {t('faq:ans4')}
                                    <br/>
                                    <a href="#top">{t('faq:goto_top')}</a>
                                 </p>
                              </td>
                           </tr>
                           
                           <tr>
                              <td>
                                 &nbsp;
                              </td>
                           </tr>
                           <tr>
                              <td className="content_heading" >
                                 <a id="qu_5"></a>5. {t('faq:qu5')}
                              </td>
                           </tr>
                           <tr>
                              <td width="97%">
                                 <p>
                                    {t('faq:ans5')}
                                    <br/>
                                    <a href="#top">{t('faq:goto_top')}</a>
                                 </p>
                              </td>
                           </tr>
                           
                           <tr>
                              <td>
                                 &nbsp;
                              </td>
                           </tr>
                           <tr>
                              <td className="content_heading" >
                                 <a id="qu_6"></a>6. {t('faq:qu6')}
                              </td>
                           </tr>
                           <tr>
                              <td width="97%">
                                 <p>
                                    {t('faq:ans6')}
                                    <br/>
                                    <a href="#top">{t('faq:goto_top')}</a>
                                 </p>
                              </td>
                           </tr>
                           
                           <tr>
                              <td>
                                 &nbsp;
                              </td>
                           </tr>
                           <tr>
                              <td className="content_heading" >
                                 <a id="qu_7"></a>7. {t('faq:qu7')}
                              </td>
                           </tr>
                           <tr>
                              <td width="97%">
                                 <p>
                                    {t('faq:ans7')}
                                    <a href="mailto:info@hotellidiilid.ee"> info@hotellidiilid.ee </a>.
                                    <br/>
                                    <a href="#top">{t('faq:goto_top')}</a>
                                 </p>
                              </td>
                           </tr>
                           
                           <tr>
                              <td>
                                 &nbsp;
                              </td>
                           </tr>
                           <tr>
                              <td className="content_heading" >
                                 <a id="qu_8"></a>8. {t('faq:qu8')}
                              </td>
                           </tr>
                           <tr>
                              <td width="97%">
                                 <p>
                                    {t('faq:ans8')} <a href="mailto:info@hotellidiilid.ee">info@hotellidiilid.ee</a>.
                                    <br/>
                                    <a href="#top">{t('faq:goto_top')}</a>
                                 </p>
                              </td>
                           </tr>
                           
                           <tr>
                              <td>
                                 &nbsp;
                              </td>
                           </tr>
                           <tr>
                              <td className="content_heading" >
                                 <a id="qu_9"></a>9. {t('faq:qu9')}
                              </td>
                           </tr>
                           <tr>
                              <td width="97%">
                                 <p>
                                    {t('faq:ans9')} <a href="mailto:info@hotellidiilid.ee">info@hotellidiilid.ee</a>.
                                    <br/>
                                    <a href="#top">{t('faq:goto_top')}</a>
                                 </p>
                              </td>
                           </tr>
                           
                        </tbody>
                     </table>
                  </div>
               </div>
            </main>
         </div>
      </Layout>
   );
}

export const getStaticProps = async ({ locale }) => ({
   props: {
     ...await serverSideTranslations(locale, ['common', 'faq']),
   },
 })

export default FAQs;