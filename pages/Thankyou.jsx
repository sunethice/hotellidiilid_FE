import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Head from "next/head";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Thankyou = () => {
   const router = useRouter();
   let mBookingDetails = "";
   if (router.query.bookingDetails !== undefined)
      mBookingDetails = router.query.bookingDetails;
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
                     <h1 className="sitemainheadding">Thank you</h1>
                  </div>
                  <div className="col-md-12 about-content">
                     <p>{mBookingDetails}</p>
                  </div>
               </div>
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

export default Thankyou;