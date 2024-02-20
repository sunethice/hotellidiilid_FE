import React, { Component } from "react";
import { connect } from "react-redux"
import styles from "../../styles/Banner.module.scss";
import { formatDateHelper2, noOfDaysHelper } from "../Data/helper";
import { withTranslation } from 'next-i18next';

class Banner extends Component{ //Component<BannerProps> {
   constructor(props){//}:BannerProps) {
      super(props);
   }

   getBannerContent() {
      let mResult = "";
      if (this.props.avalList) {
         if (this.props.avalList.length === 0) {
            mResult = `${this.props.t('results:no_results')}`;
         }
         else {
            mResult = ( this.props.avalMeta ? this.props.avalMeta.total:0) + ` ${this.props.t('results:results_found')}. `;
         }
         mResult = mResult +
            `Searched Rooms in ${this.props.search?this.props.search.selectedlocation:""} on: ${formatDateHelper2(this.props.search.check_in)}, ${noOfDaysHelper(this.props.search.check_in, this.props.search.check_out)} ${this.props.t('results:banner_nights')}.`;
      }
      return mResult;
   }

   render() {
      return (
         <div className={`${styles.banner_wrap}`}>
            <div className={`${styles.banner_text}`}>
               {this.props.isLoading ? this.props.t('results:loading')
                  : this.getBannerContent()}
               {/* Searched Rooms in {this.props.SearchParamObj} on: {this.props.SearchParamObj}{" "}
               {this.props.SearchParamObj} night(s). */}
            </div>
         </div>
      );
   }
}

const mapStateToProps = state => ({
   search: state.search.searchObj,
   avalList: state.search.avalList,
   avalMeta: state.search.avalMeta,
   isLoading: state.search.isLoading
});

export default withTranslation(['common','results'])(connect(mapStateToProps, null)(Banner));


