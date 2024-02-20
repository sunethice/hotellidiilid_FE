import Layout from "../components/Layout";
import HomeCarousel from "../components/Home/HomeCarousel";
import PopularDestinations from "../components/Home/PopularDestinations";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { withTranslation } from "react-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Contact = () => {
   return (
      <Layout>
         <div className="">
            <Head>
               <title>Hotellidiilid.ee - soodsad hotellid</title>
               <link rel="icon" href="/images/favicon.ico" />
            </Head>
            <main className="">
               <div className="container contact-container">
                  <div className="col-md-12">
                     <h1 className="sitemainheadding">Contact Us</h1>
                  </div>
                  <div className="col-md-12">
                     <div className="form-area">
                        <form role="form" id="contact-form">
                           <div className="form-group">
                              <input type="text" className="form-control" id="firstName"
                                 name="firstName" placeholder="First Name" required/>
                           </div>
                           <div className="form-group">
                              <input type="text" className="form-control" id="lastName"
                                 name="lastName" placeholder="Last Name" required/>
                           </div>
                           <div className="form-group">
                              <input type="text" className="form-control" id="email" name="email"
                                 placeholder="Your Email" required/>
                           </div>
                           <div className="form-group">
                              <input type="text" className="form-control" id="phoneNumber"
                                 name="phoneNumber" placeholder="Phone Number (optional)" required/>
                           </div>
                           <div className="form-group">
                              <textarea className="form-control" type="textarea" id="specialReq"
                                 name="specialReq"
                                 placeholder="Special Requirements, Interests Or Further Info"
                                 maxLength="140" rows="7"></textarea>
                              <span className="help-block">
                                 <p id="characterLeft" className="help-block ">You have reached the limit</p>
                              </span>
                           </div>
                           <div id="contact-alert-sending" className="alert alert-info" style={{display: 'none'}}>
                              <strong>
                                 <i className="fa fa-circle-o-notch fa-spin"></i>
                              </strong>
                              &nbsp; Sending Your Message, Please wait..
                           </div>
                           <div id="contact-alert-success" className="alert alert-success"
                              style={{display: 'none'}}>
                              <strong>
                                 <i className="fa fa-check-circle"></i>
                              </strong> 
                              &nbsp; Your Message has been sent successfully.
                           </div>
                           <div id="contact-alert-fail" className="alert alert-danger" style={{display: 'none'}}>
                              <strong>
                                 <i className="fa fa-warning"></i>
                              </strong> 
                              &nbsp; Something went wrong while sending your message. Please try again.
                           </div>

                           <div className="form-group">
                              <button type="submit" id="submit" name="submit"
                                 className="btn btn-primary pull-right btn-change8">Submit</button>
                           </div>
                        </form>
                     </div>
                  </div>

                  {/* <div className="col-md-6">
                     <div className="row col-lg-12">
                        <div className="col-md-offset-2"></div>
                        <div className="col-lg-8">
                           <h4 className="contact_title_head">Our e-mails</h4>
                           <p>
                              <span className="textblack_bold padding-left-zero">General</span><a
                                 className="special_englishfont_load"
                                 href="mailto:info@hotellidiilid.ee">info@hotellidiilid.ee</a>
                           </p>
                           <br />
                           <h4 className="contact_title_head">Telephone Lines</h4>
                           <p className="text-left">
                              <span
                                 className="textblack_bold special_englishfont_load padding-left-zero">Estonia</span>
                              +372 55 600 554 (tööpäeviti 10.00-16.00)
                           </p>
                        </div>
                        <div className="col-lg-2"></div>

                     </div>
                  </div> */}
               </div>
            </main>
         </div>
      </Layout>
   );
}

export const getStaticProps = async ({ locale }) => ({
   props: {
     ...await serverSideTranslations(locale, ['common', 'home','contact']),
   },
 })

export default Contact;