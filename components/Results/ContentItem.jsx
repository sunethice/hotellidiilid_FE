import React, { Component } from "react";
import { withRouter } from "next/router";
import { connect } from "react-redux"
import styles from "../../styles/ContentItem.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt, } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarO, faT } from "@fortawesome/free-regular-svg-icons";
import { updateSelectedHotel } from '../../redux/actions/searchActions';
import axios from "axios";
import { withTranslation } from 'next-i18next';
import Cookies from "js-cookie";

class ContentItem extends Component {
   constructor(props) {
      super(props);
      this.state = {
         itemDetails: this.props.item,
      };
   }

   renderReview(pCategoryCode) {
      let mJSX = [];
      let mRate = 0;
      let noOfStars = 0;
      if (pCategoryCode.includes("EST")) {
         mRate = pCategoryCode.substring(0, 1);
      } else {
         mRate = parseInt(pCategoryCode.substring(1, 2));
         mRate = mRate + parseInt(pCategoryCode.substring(3)) / 10;
      }
      for (let index = 0; index < parseInt(mRate); index++) {
         noOfStars++;
         mJSX.push(
            <FontAwesomeIcon
               icon={faStar}
               className={`${styles.star} ${styles.checked}`}
            />
         );
      }
      if (mRate - parseInt(mRate) > 0) {
         noOfStars++;
         mJSX.push(
            <FontAwesomeIcon
               icon={faStarHalfAlt}
               className={`${styles.star} ${styles.checked}`}
            />
         );
      }
      let noOfHollowStars = 5 - noOfStars;
      for (let index = 0; index < noOfHollowStars; index++) {
         mJSX.push(
            <FontAwesomeIcon
               icon={faStarO}
               className={`${styles.star} ${styles.checked}`}
            />
         );
      }
      return mJSX;
   }

   renderTripAdvisor(pRating) {
      let mJSX = [];
      let noOfStars = Math.floor(pRating);
      let noHalfStars = (pRating - noOfStars) > 0 ? 1 : 0;
      let noHollowStars = 5 - noOfStars - noHalfStars;

      for (let index = 0; index < noOfStars; index++) {
         mJSX.push(
            <img className={`${styles.ta_rating}`} src="/images/tripadvisor/dot-circle-fill.png"/>
         );
      }
      if (noHalfStars == 1) {
         mJSX.push(
            <img className={`${styles.ta_rating}`} src="/images/tripadvisor/dot-circle-fill-half.png"/>
         );
      }
      for (let index = 0; index < noHollowStars; index++) {
         mJSX.push(
            <img className={`${styles.ta_rating}`} src="/images/tripadvisor/dot-circle-hollow.png"/>
         );
      }
      return mJSX;
   }

   getJSXWithCurrencySymbol(pCurrencyName) {
      let mCurrency = "";
      switch (pCurrencyName) {
         case "EUR":
            mCurrency = <span>&#8364;</span>;
            break;
         default:
            mCurrency = <span>&#36;</span>;
            break;
      }
      return mCurrency;
   }

   onHotelSelect(pHotelCode) {
      const { itemDetails } = this.state;
      this.props.onHotelSelect(itemDetails);
      window.open (`${process.env.NEXT_PUBLIC_API_ENDPOINT}${Cookies.get("X-localization") === 'en'?"en/":""}Guest?hotelcode=${pHotelCode}`, '_ blank');
      // this.props.router.push({
      //    pathname: "/Guest",
      //    query: { hotelcode: pHotelCode }
      // });
   }

   render() {
      const { itemDetails } = this.state;
      let mNoTripAdvisorReviews = itemDetails.reviews[0].reviewCount;
      let mReviewRateJSX = this.renderTripAdvisor(itemDetails.reviews[0].rate);//
      let mStarRatingJSX = this.renderReview(itemDetails.categoryCode);
      let mCurrency = this.getJSXWithCurrencySymbol(itemDetails.currency);
      return (
         <div key={itemDetails.code} className="col-12 col-md-12">
            <div className={`card mb-3 ${styles.content_item_card}`}>
               <div className="row ">
                  <div className={`col-4 ${styles.content_item_img_wrapper}`}>
                     <img
                        className={`${styles.content_item_img}`}
                        width="100%"
                        src={
                           itemDetails.primary_img == "" ?
                              `https://res.cloudinary.com/muhammederdem/image/upload/v1535759872/kuldar-kalvik-799168-unsplash.jpg` :
                              `https://photos.hotelbeds.com/giata/${itemDetails.primary_img}`
                        }
                        onClick={(event) =>
                           this.onHotelSelect(
                              itemDetails.code
                           )
                        }
                        // src=""
                     />
                  </div>
                  <div className="col-8 content_item_content_wrapper">
                     <div
                        className={`card-body ${styles.content_item_card_body}`}
                     >
                        <div className="card-text px-1">
                           <div className="row">
                              <div className="col">
                                 <div className="row">
                                    <b>
                                       <a
                                          className={`${styles.content_item_name}`}
                                          href='javascript:void(0)' 
                                          onClick={(event) =>
                                             this.onHotelSelect(
                                                itemDetails.code
                                             )
                                          }
                                       >
                                          {itemDetails.name}
                                       </a>
                                    </b>                                    
                                 </div>
                                 <div className="row">
                                    <div className="no-gutters">
                                       {mStarRatingJSX}
                                    </div>
                                 </div>
                                 {/* <div className="row">
                                    <small>
                                       {itemDetails.destinationName +
                                          " - " +
                                          mNoTripAdvisorReviews +
                                          " "+ this.props.t('content_item.reviews')}
                                    </small>
                                 </div> */}

                                 <div className={`row ${styles.ta_rating_wrap}`}>
                                    <div className="col-1 no-gutters">
                                       <img className={`${styles.ta_logo}`} src="/images/tripadvisor/TripAdvisor.png"/>
                                    </div>
                                    <div className="col-6 no-gutters">
                                       {mReviewRateJSX}
                                    </div>
                                 </div>
                                 <div className="row mt-2">
                                    <div className="col-6 p-0">
                                       <div className={`${styles.price_label}`}>
                                          {this.props.t('content_item.price_for')} - {this.props.nights} { this.props.t('content_item.nights') }
                                       </div>
                                       <div className={`${styles.price_label}`}>
                                          <span className={`${styles.hotel_fee}`}>{itemDetails.combined_min_rate.toFixed(2)} {mCurrency}</span>
                                       </div>
                                    </div>
                                    <div
                                       className={`col-6 justify-content-end d-flex ${styles.select_hotel_btn_wrap}`}
                                    >
                                       <button
                                          className={`btn btn-primary px-2 ${styles.select_hotel_btn}`}
                                          onClick={(event) =>
                                             this.onHotelSelect(
                                                itemDetails.code
                                             )
                                          }
                                       >
                                          {this.props.t('content_item.select_hotel')}
                                       </button>
                                       {/* <div className="col-4">{mTripAdvisorReviewRate}</div> */}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   }
}

const mapStateToProps = state => ({
   selectedHotel: state.search.selectedHotel
});

const mapDispatchToProps = (dispatch) => ({
   onHotelSelect: (pHotel) => dispatch(updateSelectedHotel(pHotel))
});

export default withTranslation('results')(connect(mapStateToProps, mapDispatchToProps)(withRouter(ContentItem)));
