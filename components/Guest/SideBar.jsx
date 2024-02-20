import React, { Component } from "react";
import SidebarSearch from "../Common/SidebarSearch";
import axios from "axios";
import { Accordion, Card, Button } from "react-bootstrap";
import _ from "lodash";
import DatePicker from "react-datepicker";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faStar } from "@fortawesome/free-solid-svg-icons";
import { selectStyles } from "../../styles/SelectStyles";
import { connect } from "react-redux";
import { updateSearchObj } from '../../redux/actions/searchActions';
import { updateAvailabilityList, updateIsLoading, updateSelectedHotel } from "../../redux/actions/searchActions";
import { getAvailabilities } from "../../core/frontend/http-service/hb.http";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styles from "../../styles/Filter.module.scss";
import makeAnimated from "react-select/animated";
import sidebarStyles from "../../styles/SideBar.module.scss";
import mapStyles from "../../styles/map.module.scss";
import { withTranslation } from "next-i18next";
import Cookies from "js-cookie";

class SideBar extends Component {
   constructor(props){
      super(props);
      this.state = {
         filters: {
            boards:{
               board:[],
               included: true
            },
            hotels:this.props.selectedHotel?[this.props.selectedHotel.code]:[],//add hotel
         }
      }
   }

   drawBoardFilter() {
      if (this.props.selectedBoards) {
         const jsx = [];
         this.props.selectedBoards.map((board, inx) => {
            jsx.push(<div className="row no-gutters" key={`board_${inx}`}>
               <div className="col-1">
                  <input type="checkbox" name="starcheckbox" value={board} />
               </div>
               <label className="col-11">{board}</label>
            </div>);
         });
         return jsx;
      }
   }

   onBoardTypeChange(event) {
      const { filters, filters: { boards: { board } } } = this.state;
      let mBoardsArr = board;
      if (mBoardsArr.includes(event.target.value)) {
         mBoardsArr.splice(mBoardsArr.indexOf(event.target.value), 1);
      } else {
         mBoardsArr.push(event.target.value);
      }
      this.setState({ filters: { ...filters, boards: { board: mBoardsArr } } }, this.updateContent());
   }

   updateContent() {
      const { filters } = this.state;
      const serachObj = { ...this.props.search, filters: filters };
      this.props.updateIsLoading(true);
      getAvailabilities(serachObj, 1)
      .then((response) => {
         if (response.status == 200) {
            if (response.data.pResultObj != null) {
               this.props.onHotelSelect(response.data.pResultObj.data[0]);
            }
            else {
               this.props.onHotelSelect({});
            }
         }
      })
      .catch((error) => {
         this.props.onHotelSelect({});
      })
   }

   render() {
      return (
         <div className={`col-lg-4 ${sidebarStyles.sidebar}`}>
            <SidebarSearch showLocationSelect={false}></SidebarSearch>
            <div className={`${sidebarStyles.map_wrapper} d-lg-block d-md-none`}>
                  <GoogleMap
                     id="circle-example"
                     mapContainerStyle={{
                        width: '100%',
                        height: '100%'
                     }}
                     center={{ lat: parseFloat(this.props.selectedHotel.latitude), lng: parseFloat(this.props.selectedHotel.longitude) }}
                     zoom={10}
                     >
                     <Marker position={{ lat: parseFloat(this.props.selectedHotel.latitude), lng: parseFloat(this.props.selectedHotel.longitude) }} />
                  </GoogleMap>
            </div>
            <Accordion defaultActiveKey="0" className="mb-3 mt-3">
               <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                     { this.props.t('filter_by_board_type')}
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                     <Card.Body>
                        <div className="checkbox" id="starboxWrapper" onChange={(evt) => this.onBoardTypeChange(evt)}>
                           {this.drawBoardFilter()}
                        </div>
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

export default withTranslation('common')(connect(mapStateToProps, mapDispatchToProps)(SideBar));
// export default SideBar;
