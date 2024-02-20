import React, { Component } from "react";
import axios from "axios";
import SidebarSearch from "../Common/SidebarSearch";
import { Accordion, Card, Button } from "react-bootstrap";
import _ from "lodash";
import DatePicker from "react-datepicker";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { selectStyles_2, selectStyles } from "../../styles/SelectStyles";
import { connect } from "react-redux";
import { updateSearchObj } from '../../redux/actions/searchActions';
import { getAvailabilities } from "../../core/frontend/http-service/hb.http";
import { updateAvailabilityList,updateIsLoading,updateAvailabilityMeta } from "../../redux/actions/searchActions";
import Slider, { SliderTooltip, Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import makeAnimated from "react-select/animated";
import sidebarStyles from "../../styles/SideBar.module.scss";
import { getHotelByName } from "../../core/frontend/http-service/hb.http";
import { withTranslation } from 'next-i18next';

class SideBar extends Component {
   constructor(props){
      super(props);
      this.state = {
         filters: {
            price: {
               min_rate:0,
               max_rate:1000
            },
            rating:[],
            boards:{
               board:[],
               included: false
            },
            hotels:[],//add hotel
            review:[]
         }
      }
   }

   searchForHotel = _.debounce((query, callback) => {
      getHotelByName(query)
         .then((response) => {
            if (response.status == 200) {
               const requestResults = this.generateHotelNameFilterOptions(
                  response.data.pResultObj
               );
               callback(requestResults);
            }
         })
         .catch((error) => {
            console.log(error);
         });
   }, 1000);

   generateHotelNameFilterOptions(pResults){
      pResults.forEach(function (val, inx) {
         val.value = val.hotel_code;
         val.label = val.name;
      });
      return pResults;
   }

   onHotelNameChange(pHotelNameObj) {
      const { filters } = this.state;
      if(pHotelNameObj !== null)
         this.setState({ filters: { ...filters, hotels: [pHotelNameObj.hotel_code] } }, this.updateParentFilterObj);
      else
         this.setState({ filters: { ...filters, hotels: [] } }, this.updateParentFilterObj);
   }

   updateParentFilterObj = () => {
      const { filters } = this.state;
      this.props.updateSearchObj({ ...this.props.search, filters: filters });
      this.getAval()
      // this.props.filterObjUpdate(filters);
   };

   getAval() {
      this.props.updateIsLoading(true);
      setTimeout(() =>getAvailabilities(this.props.search)
         .then((response) => {
            if (response.status == 200) {
               // this.props.resultsCountUpdate(response.data.pResultObj);
               if (response.data.pResultObj != null) {
                  this.props.onGetAvalList(response.data.pResultObj.data);
                  this.props.onGetAvalMeta(response.data.pResultObj.meta);
               }
               else {
                  this.props.onGetAvalList([]);
               }
               this.props.updateIsLoading(false);
            }
         })
         .catch((error) => {
            this.props.onGetAvalList([]);
            this.props.updateIsLoading(false);
         }), 1000);
   }

   onPriceRangeChange = _.debounce((priceRange) => {
      const { filters } = this.state;
      this.setState({ filters: { ...filters, price: { min_rate: priceRange[0], max_rate: priceRange[1] } } }, this.updateParentFilterObj);
      this.getAval();
   }, 1000);


   getZoomLevel = (pDistance) => {
      if(pDistance > 10000) return 10;
      else if(pDistance > 5000) return 11;
      else if(pDistance > 1000) return 12;
      else if(pDistance > 0) return 14;
   }
   
   onDistanceRangeChange = _.debounce((distanceRange) => {
      this.props.changeOptions({...this.props.options, radius: distanceRange*1000});
      this.props.changeMapZoom(this.getZoomLevel(distanceRange*1000));
      // this.props.updateSearchObj({ ...this.props.search, geolocation: {
      //    latitude: 48.8566,
      //    longitude: 2.3522,
      //    radius: distanceRange,
      //    unit: "km"
      // }});
      // this.getAval()
   }, 1000);

   onTARatingChange(event) {
      const { filters } = this.state;
      this.setState({ filters: { ...filters, review: [{ type: "TRIPADVISOR", rate: event.target.value }] } }, this.updateParentFilterObj);
      this.getAval();
   }

   onRatingChange(event) {
      const { filters } = this.state;
      let mRatingArr = filters.rating;
      if (mRatingArr.includes(parseInt(event.target.value))) {
         mRatingArr.splice(mRatingArr.indexOf(parseInt(event.target.value)), 1);
      } else {
         mRatingArr.push(parseInt(event.target.value));
      }
      this.setState({ filters: { ...filters, rating: mRatingArr } }, this.updateParentFilterObj);
      this.getAval();
   }

   render() {
      const { filters: { price } } = this.state;
      const mPriceMarks = {
         0:<strong>{`\u20ac${0}`}</strong>,
         1000:<strong>{`\u20ac${1000}`}</strong>
      }
      const mDistanceMarks = {
         0:<strong>0km</strong>,
         10:<strong>10km</strong>
      }
      const animatedComponents = makeAnimated();
      const Range = Slider.createSliderWithTooltip(Slider.Range);
      return (
         <div className={`col-lg-3 ${sidebarStyles.sidebar}`}>
            <SidebarSearch showLocationSelect={true}></SidebarSearch>
            <Accordion defaultActiveKey="0" className="mb-3">
               <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                     {this.props.t('common:filter_by_star_rating')}
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                     <Card.Body>
                        <div className="checkbox" id="starboxWrapper" onChange={(evt)=>this.onRatingChange(evt)}>
                           <div className="row no-gutters" id="1star">
                              <div className="col-1">
                                 <input type="checkbox" name="starcheckbox" value="1" />
                              </div>
                              <label className="col-3">{`1 ${this.props.t('common:star')}`}</label>
                              <span className="col-8">
                                 <FontAwesomeIcon icon={faStar} className={`${sidebarStyles.star} ${sidebarStyles.checked}`}/>
                              </span>
                           </div>
                           <div className="row no-gutters" id="2star">
                              <div className="col-1">
                                 <input type="checkbox" name="starcheckbox" value="2" />
                              </div>
                              <label className="col-3">{`2 ${this.props.t('common:star')}`}</label>
                              <span className="col-8">
                                 <FontAwesomeIcon icon={faStar} className={`${sidebarStyles.star} ${sidebarStyles.checked}`}/>
                                 <FontAwesomeIcon icon={faStar} className={`${sidebarStyles.star} ${sidebarStyles.checked}`}/>
                              </span>
                           </div>
                           <div className="row no-gutters" id="3star">
                              <div className="col-1">
                                 <input type="checkbox" name="starcheckbox" value="3" />
                              </div>
                              <label className="col-3">{`3 ${this.props.t('common:star')}`}</label>
                              <span className="col-8">
                                 <FontAwesomeIcon icon={faStar} className={`${sidebarStyles.star} ${sidebarStyles.checked}`}/>
                                 <FontAwesomeIcon icon={faStar} className={`${sidebarStyles.star} ${sidebarStyles.checked}`}/>
                                 <FontAwesomeIcon icon={faStar} className={`${sidebarStyles.star} ${sidebarStyles.checked}`}/>

                              </span>
                           </div>
                           <div className="row no-gutters" id="4star">
                              <div className="col-1">
                                 <input type="checkbox" name="starcheckbox" value="4" />
                              </div>
                              <label className="col-3">{`4 ${this.props.t('common:star')}`}</label>
                              <span className="col-8">
                                 <FontAwesomeIcon icon={faStar} className={`${sidebarStyles.star} ${sidebarStyles.checked}`}/>
                                 <FontAwesomeIcon icon={faStar} className={`${sidebarStyles.star} ${sidebarStyles.checked}`}/>
                                 <FontAwesomeIcon icon={faStar} className={`${sidebarStyles.star} ${sidebarStyles.checked}`}/>
                                 <FontAwesomeIcon icon={faStar} className={`${sidebarStyles.star} ${sidebarStyles.checked}`}/>
                              </span>
                           </div>
                           <div className="row no-gutters" id="5star">
                              <div className="col-1">
                                 <input type="checkbox" name="starcheckbox" value="5" />
                              </div>
                              <label className="col-3">{`5 ${this.props.t('common:star')}`}</label>
                              <span className="col-8">
                                 <FontAwesomeIcon icon={faStar} className={`${sidebarStyles.star} ${sidebarStyles.checked}`} />
                                 <FontAwesomeIcon icon={faStar} className={`${sidebarStyles.star} ${sidebarStyles.checked}`}/>
                                 <FontAwesomeIcon icon={faStar} className={`${sidebarStyles.star} ${sidebarStyles.checked}`}/>
                                 <FontAwesomeIcon icon={faStar} className={`${sidebarStyles.star} ${sidebarStyles.checked}`}/>
                                 <FontAwesomeIcon icon={faStar} className={`${sidebarStyles.star} ${sidebarStyles.checked}`}/>
                              </span>
                           </div>
                        </div>
                     </Card.Body>
                  </Accordion.Collapse>
               </Card>
            </Accordion>
            <Accordion defaultActiveKey="0" className="mb-3">
               <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                     {this.props.t('common:filter_by_hotel_name')}
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                     <Card.Body>
                        <div className="main">
                              <AsyncSelect
                                 instanceId="id_hotel_name"
                                 cacheOptions
                                 loadOptions={this.searchForHotel}
                                 styles={selectStyles_2}
                                 components={animatedComponents}
                                 isClearable
                                 openMenuOnClick={false}
                                 menuPortalTarget={document.body}
                                 placeholder={this.props.t('placeholders.enter_hotel')}
                                 onChange={(obj) => this.onHotelNameChange(obj)}
                              ></AsyncSelect>
                              {/* <div className="input-group-append">
                                 <button className="btn btn-secondary" type="button">
                                    <FontAwesomeIcon
                                       icon={faSearch}
                                       className={`${styles.fa_btn_icon}`}
                                    />
                                 </button>
                              </div> */}
                        </div>
                        {/* <FilterByHotelName></FilterByHotelName> */}
                     </Card.Body>
                  </Accordion.Collapse>
               </Card>
            </Accordion>
            <Accordion defaultActiveKey="0" className="mb-3">
               <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                     {this.props.t('common:filter_by_price')}
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                     <Card.Body>
                        <div className="main">
                           <div className="input-group pb-3">
                              <Range min={0} max={1000} marks={mPriceMarks} defaultValue={[price.min_rate, price.max_rate]} tipFormatter={value => `${value}`} onChange={(obj)=>this.onPriceRangeChange(obj)}></Range>
                           </div>
                        </div>
                     </Card.Body>
                  </Accordion.Collapse>
               </Card>
            </Accordion>
            <Accordion defaultActiveKey="0" className="mb-3">
               <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                     {this.props.t('common:filter_by_distance')}
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                     <Card.Body>
                        <div className="main">
                           <div className="input-group pb-3">
                              <Slider min={0} max={10} step={0.5} marks={mDistanceMarks} defaultValue={[0, 10]} tipFormatter={value => `${value}`} onChange={(obj)=>this.onDistanceRangeChange(obj)}></Slider>
                           </div>
                        </div>
                     </Card.Body>
                  </Accordion.Collapse>
               </Card>
            </Accordion>
            <Accordion defaultActiveKey="0" className="mb-3">
               <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                     {this.props.t('common:filter_by_trip_advisor')}
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                     <Card.Body>
                        <div className="radio" id="starboxWrapper" onChange={(evt)=>this.onTARatingChange(evt) }>
                           <div className="row mt-1" id="1star">
                              <div className="col-1">
                                 <input type="radio" name="starcheckbox" value="5" />
                              </div>
                              <span className="col-8">
                                 <img className={`${sidebarStyles.ta_rating}`} alt="5" src="/images/tripadvisor/filter_5.png"/>
                              </span>
                           </div>
                           <div className="row mt-1" id="2star">
                              <div className="col-1">
                                 <input type="radio" name="starcheckbox" value="4" />
                              </div>
                              <span className="col-8">
                                 <img className={`${sidebarStyles.ta_rating}`} alt="4 &amp; up" src="/images/tripadvisor/filter_4.png"/>
                                 &nbsp;&#38; up
                              </span>
                           </div>
                           <div className="row mt-1" id="3star">
                              <div className="col-1">
                                 <input type="radio" name="starcheckbox" value="3" />
                              </div>
                              <span className="col-8">
                                 <img className={`${sidebarStyles.ta_rating}`} alt="3 &amp; up" src="/images/tripadvisor/filter_3.png"/>
                                 &nbsp;&#38; up
                              </span>
                           </div>
                           <div className="row mt-1" id="4star">
                              <div className="col-1">
                                 <input type="radio" name="starcheckbox" value="2" />
                              </div>
                              <span className="col-8">
                                 <img className={`${sidebarStyles.ta_rating}`} alt="2 &amp; up" src="/images/tripadvisor/filter_2.png"/>
                                 &nbsp;&#38; up
                              </span>
                           </div>
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

export default withTranslation(['common','results'])(connect(mapStateToProps, mapDispatchToProps)(SideBar));
// export default SideBar;
