import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram } from "@fortawesome/free-brands-svg-icons";
import styles from "../styles/Header.module.scss";
import { useTranslation,withTranslation } from 'next-i18next';
// import { i18n } from 'next-i18next';

const Header = () => {
   const router = useRouter();
   const { t, i18n } = useTranslation('common');
   const [cLang, setLang] = useState((router.locale === "en" ? "English":"Esti"));
   const onLangChange = (key) => {
      let lang = "es";
      if (key == "ES") {
         Cookies.set("X-localization", "es");
         setLang("Esti");
      }
      else {
         Cookies.set("X-localization", "en");
         lang = 'en';
         setLang("English");
      }
      router.replace(router.pathname, router.pathname, { locale: lang })
      // router.reload(window.location.pathname)
   }

   return (
      <header className="site-header">
         <Navbar
            className={`${styles.nav_bar}`}
            bg="light"
            expand="lg"
            sticky="top"
         >
            <Container fluid>
               <Container className="p-0">
                  <Link href="/" passHref>
                     <Navbar.Brand className={`${styles.navbar_brand}`}>
                        <Image
                           src="/images/logo_header.png"
                           alt="Hotellidiilid"
                           className={`${styles.logo}`}
                           width="200"
                           height="53"
                        />
                     </Navbar.Brand>
                  </Link>

                  <div className="flex-grow-1 d-flex justify-content-end px-lg-0 px-1">
                     <Link href="https://www.facebook.com/hotellidiilid" passHref>
                        <a className={`${styles.nav_social_ico}`}>
                           <FontAwesomeIcon
                              className={`${styles.social_ico}`}
                              icon={faFacebookF}
                           />
                        </a>
                     </Link>
                     <Link href="https://www.instagram.com/hotellidiilid/" passHref>
                        <a className={`${styles.nav_social_ico}`}>
                           <FontAwesomeIcon
                              className={`${styles.social_ico}`}
                              icon={faInstagram}
                           />
                        </a>
                     </Link>
                  </div>
                  
                  
                  <Navbar.Toggle aria-controls="site-navbar-nav" />
                  <Navbar.Collapse id="site-navbar-nav" className="flex-grow-0">
                     <Nav className="ml-auto bg-light px-2">
                        {/* <Link
                           href="https://www.facebook.com/hotellidiilid"
                           passHref
                        >
                           <Nav.Link className={`${styles.nav_social_ico}`} target="_blank">
                              <FontAwesomeIcon
                                 className={`${styles.social_ico}`}
                                 icon={faFacebookF}
                              />
                           </Nav.Link>
                        </Link>
                        <Link
                           href="https://www.instagram.com/hotellidiilid/"
                           passHref
                        >
                           <Nav.Link className={`${styles.nav_social_ico}`} target="_blank">
                              <FontAwesomeIcon
                                 className={`${styles.social_ico}`}
                                 icon={faInstagram}
                              />
                           </Nav.Link>
                        </Link> */}
                        <Link href="/AboutUs" passHref>
                           <Nav.Link className={`${styles.nav_link}`}>
                              {t('about')}
                           </Nav.Link>
                        </Link>
                        <NavDropdown
                           title={cLang}
                           id="site-nav-dropdown-1"
                           className={`${styles.nav_link}`}
                           onSelect={onLangChange}
                        >
                           <NavDropdown.Item className={`${styles.nav_link}`} eventKey="ES">
                              Eesti
                           </NavDropdown.Item>
                           <NavDropdown.Item className={`${styles.nav_link}`} eventKey="ENG">
                              English
                           </NavDropdown.Item>
                        </NavDropdown>
                     </Nav>
                  </Navbar.Collapse>
               </Container>
            </Container>
         </Navbar>
      </header>
   );
}

export default withTranslation('common')(Header);
