import React, { Component } from "react";
import Link from "next/link";
import PopularDestStyle from "../../styles/PopularDestinations.module.scss";
import { withTranslation } from 'next-i18next';

class PopularDestinations extends Component {
   render() {
      return (
         <div className="container mt-5">
            <div className="row">
               <div className="col-12">
                  <div className={`${PopularDestStyle.section_title } h2`}>
                     {this.props.t('popular_destinations.heading')}
                  </div>
                  <p className="text-center">
                     {this.props.t('popular_destinations.description_pt1')}
                     <Link href="/AllDestinations"><a className={`${PopularDestStyle.link}`}>{this.props.t('popular_destinations.description_pt2')}</a></Link>
                  </p>
               </div>
            </div>
            <div className="row">
               <div className={`${PopularDestStyle.pin_container}`}>
                  <div className={`${PopularDestStyle.card} ${PopularDestStyle.card_medium}`}>
                     <img className={`${PopularDestStyle.PopDestImg}  ${PopularDestStyle.img_medium}`} src="images/mountain3.jpg" alt="Popular destination" title="" />
                  </div>
                  <div className={`${PopularDestStyle.card} ${PopularDestStyle.card_medium}`}>
                     <img className={`${PopularDestStyle.PopDestImg}  ${PopularDestStyle.img_large}`} src="images/mountain3.jpg" alt="Popular destination" title="" />
                  </div>
                  <div className={`${PopularDestStyle.card} ${PopularDestStyle.card_small}`}>
                     <img className={`${PopularDestStyle.PopDestImg} ${PopularDestStyle.img_small}`} src="images/mountain3.jpg" alt="Popular destination" title="" />
                  </div>
                  <div className={`${PopularDestStyle.card} ${PopularDestStyle.card_medium}`}>
                     <img className={`${PopularDestStyle.PopDestImg}  ${PopularDestStyle.img_medium}`} src="images/mountain3.jpg" alt="Popular destination" title="" />
                  </div>
                  <div className={`${PopularDestStyle.card} ${PopularDestStyle.card_small}`}>
                     <img className={`${PopularDestStyle.PopDestImg}  ${PopularDestStyle.img_small}`} src="images/mountain3.jpg" alt="Popular destination" title="" />
                  </div>
                  {/* <div className={`${PopularDestStyle.card} ${PopularDestStyle.card_large}`}>6</div> */}
               </div>
            </div>
         </div>
      );
   }
}
export default withTranslation('home')(PopularDestinations);
