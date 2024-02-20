import React, { Component } from "react";
import { withRouter } from "next/router";
import { Accordion, Card, Button } from "react-bootstrap";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft,faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { updateSearchObj } from '../../redux/actions/searchActions';
import { updateAvailabilityList, updateIsLoading, updateSelectedHotel } from "../../redux/actions/searchActions";
import styles from "../../styles/Filter.module.scss";
import sidebarStyles from "../../styles/SideBar.module.scss";
import { withTranslation } from "next-i18next";
import SummaryContext from '../../context/SummaryContext';

class SideBar extends Component {
   static contextType = SummaryContext;
   constructor(props){
      super(props);
      this.state = {
      }
   }

   drawConditions() {
      return (<div className="conditionWrap">
         <div className={`${sidebarStyles.condition}`}>
            <FontAwesomeIcon icon={faChevronRight}/>&nbsp;&nbsp; {this.props.t('conditions.term_1')}
         </div>
         <div className={`${sidebarStyles.condition}`}>
            <FontAwesomeIcon icon={faChevronRight}/>&nbsp;&nbsp; {this.props.t('conditions.term_2')}
         </div>
         <div className={`${sidebarStyles.condition}`}>
            <FontAwesomeIcon icon={faChevronRight}/>&nbsp;&nbsp; {this.props.t('conditions.term_3')}
         </div>
         <div className={`${sidebarStyles.condition}`}>
            <FontAwesomeIcon icon={faChevronRight}/>&nbsp;&nbsp; {this.props.t('conditions.term_4')}
         </div>
         <div className={`${sidebarStyles.condition}`}>
            <FontAwesomeIcon icon={faChevronRight}/>&nbsp;&nbsp; {this.props.t('conditions.term_5')}
         </div>
         <div className={`${sidebarStyles.condition}`}>
            <FontAwesomeIcon icon={faChevronRight}/>&nbsp;&nbsp; {this.props.t('conditions.term_6')}
         </div>
         <div className={`${sidebarStyles.condition}`}>
            <FontAwesomeIcon icon={faChevronRight}/>&nbsp;&nbsp; {this.props.t('conditions.term_7')}
         </div>
      </div>);
   }

   navigateBack() {
      const { cCurrentPage, setPage } = this.context;
      if (cCurrentPage == 1) this.props.router.back();
      else if (cCurrentPage == 2) setPage(1);
   }

   render() {
      return (
         <div className={`col-lg-4 ${sidebarStyles.sidebar}`}>
            <div className={``}>
               <Button className="btn btn-primary w-100" onClick={() => this.navigateBack()}>
                  <FontAwesomeIcon icon={faChevronLeft} className="" />&nbsp;&nbsp; {this.props.t('conditions.back_to_search_results')}
               </Button>
            </div>
            <Accordion defaultActiveKey="0" className="mb-3 mt-3">
               <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                     {this.props.t('conditions.booking_conditions')}
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                     <Card.Body>
                        {this.drawConditions()}
                     </Card.Body>
                  </Accordion.Collapse>
               </Card>
            </Accordion>
         </div>
      );
   }
}
const mapStateToProps = state => ({
   search: state.search.searchObj,
   isLoading: state.search.isLoading,
   selectedHotel: state.search.selectedHotel,
   selectedBoards: state.search.selectedBoards
});

const mapDispatchToProps = (dispatch) => ({
   updateSearchObj: (pSearchObj) => {
      dispatch(updateSearchObj(pSearchObj));
   },
   onGetAvalList: (pList) => dispatch(updateAvailabilityList(pList)),
   updateIsLoading: (pIsLoading) => dispatch(updateIsLoading(pIsLoading)),
   onHotelSelect: (pHotel) => dispatch(updateSelectedHotel(pHotel))
});

export default withTranslation('summary')(connect(mapStateToProps, mapDispatchToProps)(withRouter(SideBar)));
