import styles from "../styles/Footer.module.scss";
import Link from "next/link";
import Image from "next/image";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { useTranslation,withTranslation } from 'next-i18next';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Footer = () => {
   const { t, i18n } = useTranslation('footer');
   return (
      <footer
         className="pt-5 pb-5"
         style={{
            borderTop: "1px solid #d9d9d9",
            textAlign: "center",
            backgroundColor: "#26272b"
         }}
      >
         <Container fluid>
               <Container className="p-0">
                  <Link href="/" passHref>
                     <Navbar.Brand className={`${styles.navbar_brand}`}>
                        <Image
                           src="/images/logo_footer.png"
                           alt="Hotellidiilid"
                           className={`${styles.logo}`}
                           width="200"
                           height="53"
                        />
                     </Navbar.Brand>
                  </Link>
                  <Container id="site-navbar-nav">
                     <div className={`pb-3 row justify-content-center ${styles.footer_link_wrap}`}>
                        <Link href="/PrivacyPolicy" passHref>
                           <a className={`${styles.footer_link} col-12 col-sm-auto`}>{t('privacy_policy')}</a>
                        </Link>
                        <Link href="/TermsConditions" passHref>
                           <a className={`${styles.footer_link} col-12 col-sm-auto`}>{t('terms_and_conditions')}</a>
                        </Link>
                        <Link href="/FAQs" passHref>
                           <a className={`${styles.footer_link} col-12 col-sm-auto`}>{t('FAQ')}</a>
                        </Link>
                        <Link href="/AboutUs" passHref>
                           <a className={`${styles.footer_link} col-12 col-sm-auto`}>{t('about')}</a>
                        </Link>
                        <Link href="/Contact" passHref>
                           <a className={`${styles.footer_link} col-12 col-sm-auto`}>{t('contact')}</a>
                        </Link>
                     </div>
                  </Container>
               <Container className={`pt-4 ${styles.copyright_wrap}`}>
                  <div className={`pb-3`}>
                  All rights are reserved for &nbsp;
                     <Link href="/AboutUs" passHref>
                        <a className={`${styles.copyright_link}`}>Reisidiilid OÜ</a>
                     </Link>
                  </div>
                  <div className={`pb-3`}>
                     <Link
                           href="https://www.facebook.com/hotellidiilid"
                           target="_blank"
                           passHref
                        >
                           <a className={`${styles.nav_social_ico}`} target="_blank">
                              <FontAwesomeIcon
                                 className={`${styles.social_ico}`}
                                 icon={faFacebookF}
                              />
                           </a>
                        </Link>
                        <Link
                           href="https://www.instagram.com/hotellidiilid/"
                           target="_blank"
                           passHref
                        >
                           <a className={`${styles.nav_social_ico}`} target="_blank">
                              <FontAwesomeIcon
                                 className={`${styles.social_ico}`}
                                 icon={faInstagram}
                              />
                           </a>
                        </Link>
                  </div>
               </Container>
               </Container>
            </Container>

         {/* <div>
            <a className={`${styles.footer_link}`}>Privacy Policy</a>
            <a className={`${styles.footer_link}`}>terms of Use</a>
            <a className={`${styles.footer_link}`}>FAQs</a>
            <a className={`${styles.footer_link}`}>About Us</a>
            <a className={`${styles.footer_link}`}>Contact</a>
         </div> */}
      </footer>
   );
}

// export const getStaticProps = async ({ locale }) => ({
//    props: {
//      ...await serverSideTranslations(locale, ['common', 'footer']),
//    },
// })

export default Footer;
