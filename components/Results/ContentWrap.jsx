import React, { Component } from "react";
import { connect } from "react-redux"
import { withRouter } from "next/router";
import ContentItem from "./ContentItem";
import styles from "../../styles/ContentWrap.module.scss";
import paginationStyles from "../../styles/pagination.module.scss";
import Select from "react-select";
import Pagination from "react-js-pagination";
import { selectStyles_2 } from "../../styles/SelectStyles";
import { getAvailabilities } from "../../core/frontend/http-service/hb.http";
import { updateSearchObj,updateIsLoading,updateAvailabilityList, updateAvailabilityMeta } from '../../redux/actions/searchActions';
import { noOfDaysHelper } from "../Data/helper";
import { withTranslation } from 'next-i18next';

class ContentWrap extends Component {
   constructor(props) {
      super(props);
      this.state = {
         availabilityList: [],
         noNights: this.props.search !== undefined ? noOfDaysHelper(this.props.search.check_in, this.props.search.check_out) : 0,
         activePage: 1,
         totalItemCount:0
      };
   }

   componentDidMount() {
      this.getAval();
   }

   getAval() {
      const { activePage } = this.state;
      this.props.updateIsLoading(true);
      setTimeout(() =>getAvailabilities(this.props.search, activePage)
         .then((response) => {
            if (response.status == 200) {
               // this.props.resultsCountUpdate(response.data.pResultObj);
               if (response.data.pResultObj != null) {

                  this.props.onGetAvalList(response.data.pResultObj.data);
                  this.props.onGetAvalMeta(response.data.pResultObj.meta);
                  this.setState({ totalItemCount: response.data.pResultObj.total });
               }
               else {
                  this.props.onGetAvalList([]);
               }
               this.props.updateIsLoading(false);
            }
         })
         .catch((error) => {
            console.log(error)
            this.props.onGetAvalList([]);
            this.props.updateIsLoading(false);
         }), 1000);
   }

   onSortByChange(pSortBy) {
      this.props.updateSearchObj({ ...this.props.search, sortby: pSortBy.value });
      this.getAval()
   }

   handlePageChange(pageNumber) {
      this.setState({ activePage: pageNumber }, () => { this.getAval() });
   }

   render() {
      const { noNights, totalItemCount, activePage } = this.state;
      const sortByOpt = [
         { value: 'PRLH', label: `${this.props.t('results:sort.PRLH')}`},
         { value: 'PRHL', label: `${this.props.t('results:sort.PRHL')}`},
         { value: 'SRLH', label: `${this.props.t('results:sort.SRLH')}`},
         { value: 'SRHL', label: `${this.props.t('results:sort.SRHL')}`},
         { value: 'HNLH', label: `${this.props.t('results:sort.HNLH')}`},
         { value: 'HNHL', label: `${this.props.t('results:sort.HNHL')}`},
      ]

      return (
         <div className={`col-lg-5 w-100 p-3 ${styles.outerwrap}`}>
            <div className="row">
               <div className="col-lg-6 col-sm-12">
                  <Pagination
                     linkClass={`${paginationStyles.page_link}`}
                     activeClass={`${paginationStyles.active_page}`}
                     activePage={activePage}
                     itemsCountPerPage={10}
                     totalItemsCount={totalItemCount}
                     pageRangeDisplayed={3}
                     onChange={this.handlePageChange.bind(this)}
                  />
               </div>
               <div className="col-lg-6 col-sm-12 d-flex justify-content-end no-gutters pb-3">
                  <div className={styles.sort_by_wrap}>
                     <Select
                        instanceId="id_sortby"
                        placeholder="No of nights"
                        defaultValue={ sortByOpt[0]}
                        // value={nights.find((obj) => obj.value === noNights)}
                        options={sortByOpt}
                        styles={selectStyles_2}
                        onChange={(obj) => this.onSortByChange(obj)}
                     />
                  </div>
               </div>
            </div>
            <div className="row">
               {this.props.isLoading || this.props.avalList === undefined ?
               (<div className="w-100 d-flex justify-content-center">
                  <img
                     className={`${styles.loading_gif}`}
                     src="/images/loading.gif"
                  />
               </div>) :
                  this.props.avalList.length === 0 ? (
                     <div className="w-100 d-flex justify-content-center">
                        No results found...
                     </div>
                  ) :
                  (
                     this.props.avalList.map((item, i) => {
                        return <ContentItem
                           key={item.code}
                           item={item}
                           nights={noNights}
                        ></ContentItem>
                  })
               )}
            </div>
            <div className="row">
               <div className="col-6">
                  <Pagination
                     linkClass={`${paginationStyles.page_link}`}
                     activeClass={`${paginationStyles.active_page}`}
                     activePage={activePage}
                     itemsCountPerPage={10}
                     totalItemsCount={totalItemCount}
                     pageRangeDisplayed={3}
                     onChange={this.handlePageChange.bind(this)}
                  />
               </div>
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

const mapDispatchToProps = (dispatch) => ({
   updateSearchObj: (pSearchObj) => {
      dispatch(updateSearchObj(pSearchObj));
   },
   onGetAvalList: (pList) => dispatch(updateAvailabilityList(pList)),
   onGetAvalMeta: (pMeta) => dispatch(updateAvailabilityMeta(pMeta)),
   updateIsLoading: (pIsLoading) => dispatch(updateIsLoading(pIsLoading))
});

export default withTranslation(['common','results'])(connect(mapStateToProps, mapDispatchToProps)(withRouter(ContentWrap)));
