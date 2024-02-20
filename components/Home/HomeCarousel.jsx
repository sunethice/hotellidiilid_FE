import React, { Component } from "react";
import Carousel from "react-bootstrap/Carousel";
import SearchWidget from "../Common/SearchWidget";
import Image from "next/image";
import styles from "../../styles/HomeCarousel.module.scss";

class HomeCarousel extends Component {
   render() {
      return (
         <div className={styles.carousel_wrap}>
            <Carousel>
               <Carousel.Item
                  style={{
                     position: "relative",
                     width: "100%",
                     height: "auto",
                  }}
               >
                  <img
                     className="d-block w-100"
                     src="/images/carousel/1.png"
                     alt="Second slide"
                  />
                  <Carousel.Caption className={`${styles.carousel_caption}`}>
                     <div className={`${styles.slider_header}`}>Hotellipakkumised üle maailma</div>
                  </Carousel.Caption>
               </Carousel.Item>
               <Carousel.Item>
                  <img
                     className="d-block w-100"
                     src="/images/carousel/2.png"
                     alt="Second slide"
                  />
                  <Carousel.Caption className={`${styles.carousel_caption}`}>
                     <div className={`${styles.slider_header}`}>Hotellipakkumised üle maailma</div>
                  </Carousel.Caption>
               </Carousel.Item>
               <Carousel.Item>
                  <img
                     className="d-block w-100"
                     src="/images/carousel/3.png"
                     alt="Third slide"
                  />
                  <Carousel.Caption className={`${styles.carousel_caption}`}>
                     <div className={`${styles.slider_header}`}>Hotellipakkumised üle maailma</div>
                  </Carousel.Caption>
               </Carousel.Item>
            </Carousel>
            <div
               className={[
                  styles.slider_overlay,
                  styles.fixed_width_container,
               ].join(" ")}
            >
               <div
                  className={`col-md-12 col-sm-12 col-xs-12 ${styles.searchbox_panel} ${styles.slider_search_box}`}
               >
                  <SearchWidget></SearchWidget>
               </div>
            </div>
         </div>
      );
   }
}
export default HomeCarousel;
