import React, { Component } from "react";

import DatePicker, { registerLocale } from "react-datepicker";
import enUS from "date-fns/locale/en-US";
import es from "date-fns/locale/es";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import _ from "lodash";
import { rooms, adults, children } from "../Data/SearchWidgetData";
import makeAnimated from "react-select/animated";
import "react-datepicker/dist/react-datepicker.css";
import SidebarSearchStyles from "../../styles/SideBarSearch.module.scss";
import { smallSelectStyles_2, selectStyles_2 } from "../../styles/SelectStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/Filter.module.scss";
import { addDaysHelper, noOfDaysHelper, formatDateHelper4 } from "../Data/helper";
import { connect } from "react-redux";
import { updateSearchObj, updateAvailabilityList, updateIsLoading, updateAvailabilityMeta, updateSelectedHotel} from '../../redux/actions/searchActions';
import { getLocationsByPhrase,getAvailabilities } from "../../core/frontend/http-service/hb.http";
import { Formik } from "formik";
import * as Yup from "yup";
import { withTranslation } from 'next-i18next';
import Cookies from "js-cookie";
import CustomInput from "./CustomDateInput";

class SidebarSearch extends Component {
   constructor(props) {
      super(props);
      this.state = {
         location_code: this.props.search ? this.props.search.destination_code : "",
         selectedlocation: this.props.search?this.props.search.selectedlocation:"",
         checkinDate: this.props.search?new Date(this.props.search.check_in):null,
         checkoutDate: this.props.search?new Date(this.props.search.check_out):null,
         minCheckIn: new Date(),
         minCheckOut: addDaysHelper(1),
         noNights: noOfDaysHelper(this.props.search.check_in,this.props.search.check_out).toString(),
         noRooms: this.props.search?this.props.search.occupancies.length.toString():"1",
         occupancies: this.props.search?this.props.search.occupancies:[
            {
               room_no: 1,
               adults: 2,
               children: 0,
               children_age: [],
            },
         ],
         hasChildren: false
      }
      this.checkinVal = new Date(this.props.search.check_in);
      this.checkoutVal = new Date(this.props.search.check_out);
      registerLocale('es', es);
      registerLocale('en', enUS);
   }

   generateLocationOptions(pResults) {
      pResults.forEach(function (val, inx) {
         val.value = val.destination_code;
         val.label = `${val.name}, ${val.country.custom_description}`;
      });
      return pResults;
   }

   searchForLocations = _.debounce((query, callback) => {
      getLocationsByPhrase(query)
         .then((response) => {
            if (response.status == 200) {
               const requestResults = this.generateLocationOptions(
                  response.data.pResultObj
               );
               callback(requestResults);
            }
         })
         .catch((error) => {
            console.log(error);
         });
   }, 1000);

   onLocationChange(pLocationObj) {
      this.setState({ selectedlocation: pLocationObj.label });
      this.setState({ location_code: pLocationObj.destination_code });
      return pLocationObj.destination_code;
   }

   onDateChange() {
      let mNoOfNights = null;
      const { checkinDate, checkoutDate } = this.state;
      if (checkinDate !== null && checkoutDate !== null) {
         mNoOfNights = noOfDaysHelper(checkinDate, checkoutDate);
         this.setState({ noNights: mNoOfNights.toString() });
      }
      return mNoOfNights;
   }

   onNoOfRoomsChange(pNoOfRooms) {
      const { occupancies } = this.state;
      let mSelectedNoRooms = parseInt(pNoOfRooms);
      this.setState({ noRooms: mSelectedNoRooms });
      let mOccupancies = [];
      for (var i = 0; i < mSelectedNoRooms; i++) {
         if (occupancies[i] !== undefined) {
            mOccupancies.push(occupancies[i]);
         } else {
            const mRoomNo = 1;
            mOccupancies.push({
               room_no: mRoomNo,
               adults: 2,
               children: 0,
               children_age: [],
            });
         }
      }
      this.setState({ occupancies: mOccupancies });
   }

   onAgeChange(pAgeObj, pRoomInx, pAgeSelectInx) {
      const { occupancies } = this.state;
      let mRoomObj = occupancies.find((obj, inx) => inx == pRoomInx);
      mRoomObj.children_age[pAgeSelectInx] = pAgeObj.value;
      this.setState(this.updateOccupancies(this.state, mRoomObj, pRoomInx));
   }

   onNoOfAdultsChange(pNoOfAdultsObj, pRoom, pInx) {
      let mSelectedNoAdults = parseInt(pNoOfAdultsObj.value);
      let newRoomObj = {
         room_no: pRoom.room_no,
         adults: mSelectedNoAdults,
         children: pRoom.children,
         children_age: pRoom.children_age
      };
      this.setState(this.updateOccupancies(this.state, newRoomObj, pInx));
   }

   onNoOfChildrenChange(pNoOfChildrenObj, pRoom, pInx) {
      let mSelectedNoChildren = parseInt(pNoOfChildrenObj.value);
      if (mSelectedNoChildren > 0) this.setState({ hasChildren: true });
      else this.setState({ hasChildren: false });
      let newRoomObj = {
         room_no: pRoom.room_no,
         adults: pRoom.adults,
         children: mSelectedNoChildren,
         children_age: [],
      };

      for (var i = 0; i < mSelectedNoChildren; i++) {
         if (pRoom.children_age[i] !== undefined) {
            newRoomObj.children_age.push(pRoom.children_age[i]);
         } else {
            newRoomObj.children_age.push(1);
         }
      }
      this.setState(this.updateOccupancies(this.state, newRoomObj, pInx));
   }

   onSearchClick() {
      this.props.updateSearchObj(this.createSearchParamObj());
      this.props.showLocationSelect ? this.getAval():this.getAvalForHotel();
   }

   getAval() {
      this.props.updateIsLoading(true);
      console.log("this.props.search",this.props.search)

      setTimeout(() =>getAvailabilities(this.props.search)
         .then((response) => {
            if (response.status == 200) {
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

   getAvalForHotel() {
      this.props.updateIsLoading(true);
      const newSearchObj = { ...this.props.search, filters: { hotels: [this.props.selectedHotel.code] } };
      getAvailabilities(newSearchObj)
         .then((response) => {
            console.log("newSearchObj-response",response)
            if (response.status == 200) {
               if (response.data.pResultObj != null) {
                  if(response.data.pResultObj.data.length !== 0){
                     this.props.onHotelSelect(response.data.pResultObj.data[0]);
                  } else {
                     this.props.onHotelSelect([]);
                  }
                  console.log(response.data.pResultObj.data[0])
               }
               else {

               }
               this.props.updateIsLoading(false);
            }
         })
         .catch((error) => {
            this.props.onHotelSelect([]);
         })
   }

   createSearchParamObj(){
      const {
         checkinDate,
         checkoutDate,
         location_code,
         occupancies,
         selectedlocation
      } = this.state;
      return {
         check_in: checkinDate,
         check_out: checkoutDate,
         destination_code: location_code,
         occupancies: occupancies,
         selectedlocation: selectedlocation
      };
   }

   updateOccupancies(state, props, pInx) {
      let mOccupancies = state.occupancies.map((obj, inx) => {
         if (inx === pInx) {
            return props;
         } else return obj;
      });
      return { ...state, occupancies: mOccupancies };
   }

   render() {
      const {
         selectedlocation,
         minCheckIn,
         minCheckOut,
      } = this.state;
      const nights = [];
      for (var i = 1; i <= 30; i++) {
         nights.push({
            value: i.toString(),
            label: i == 1 ? i + " Night" : i + " Nights",
         });
      }
      const animatedComponents = makeAnimated({ DropdownIndicator:() => null, IndicatorSeparator:() => null });

      const initialValues = {
         location: this.props.search ? {
            isCountry: false,
            locationCode: this.props.search.destination_code
         }:{},
         inpLocation:selectedlocation,
         checkinDate: this.props.search?new Date(this.props.search.check_in):null,
         checkoutDate: this.props.search?new Date(this.props.search.check_out):null,
         noNights: noOfDaysHelper(this.props.search.check_in,this.props.search.check_out).toString(),
         noRooms: this.props.search?this.props.search.occupancies.length:1,
      };

      const data = {showLocationSelect: this.props.showLocationSelect};
      const SearchSchema = Yup.object().shape({
         location: Yup.object()
            .nullable()
            .when('$showLocationSelect', {
               is: true,
               then: Yup.string()
                  .required("Destination is required")
            }),
         checkinDate: Yup.date()
            .nullable()
            .default(null)
            .min(new Date(), 'Check-in date must be later than today')
            .required("Check-in is required"),
         checkoutDate: Yup.date()
            .nullable()
            .default(null)
            .min(Yup.ref('checkinDate'), 'Check-out date must be later Check-in date')
            .required("Check-out is required"),
         noNights: Yup.number().nullable()
            .required("No of nights is required"),
         noRooms: Yup.number().nullable().required("No of rooms is required")
      });
      SearchSchema.isValid('showLocation', { context: { showLocationSelect: this.props.showLocationSelect } })

      const onCheckinUpdate = (pCheckinVal) => {
         this.checkinVal = pCheckinVal;
      }

      const onCheckoutUpdate = (pCheckoutVal) => {
         this.checkoutVal = pCheckoutVal;
      }

      const onSetDatePicker = () => {
         let mNoNights = null;
         if (this.checkinVal !== null && this.checkoutVal !== null) {
            mNoNights = noOfDaysHelper(this.checkinVal, this.checkoutVal);
         }
         return mNoNights;
      }

      return (
         <Formik
            initialValues={initialValues}
            validationSchema={SearchSchema}
            onSubmit={(values) => this.onSearchClick(values)}
         >
            {(formik) => {
               const {
                  values,
                  handleChange,
                  handleSubmit,
                  errors,
                  touched,
                  handleBlur,
                  isValid,
                  setFieldValue,
                  setValues,
                  dirty
               } = formik;
               return (
         <form className={`${SidebarSearchStyles.font_size_13}`} onSubmit={formik.handleSubmit}>
            {this.props.showLocationSelect ? <div className="form-row mb-3">
               <div className="col">
                  <label className="font-weight-bold">{this.props.t('sidebar_search.enter_destination')}</label>
                  <AsyncSelect
                     instanceId="id_location"
                     name="location"
                     cacheOptions
                     defaultInputValue={selectedlocation}
                     loadOptions={this.searchForLocations}
                     styles={selectStyles_2}
                     components={animatedComponents}
                     openMenuOnClick={false}
                     // onChange={(obj) => this.onLocationChange(obj)}
                     onChange={obj => {
                        setFieldValue('location', obj);
			               setFieldValue('inpLocation', obj.label );
                        this.onLocationChange(obj)
                     }}
                     placeholder={this.props.t('common:placeholders.type_loc')}
                     onInputChange={(inputValue, event) => {
                        if (event.action !== "input-blur" && event.action !== "menu-close") {
                           setFieldValue('inpLocation', inputValue);
                        }
                     }}
		               inputValue={values.inpLocation}
                  ></AsyncSelect>
                  <div className={`${SidebarSearchStyles.invalid_feedback} d-block`}>{errors.location && touched.location ? (
                     <div>{errors.location}</div>
                  ) : null}</div>
               </div>
            </div> : <></>}
            <div className="form-row mb-3">
                        <div className="col">
                           <label className="font-weight-bold">{this.props.t('sidebar_search.check_in')}</label>
                           <DatePicker
                              name="checkinDate"
                              placeholderText={this.props.t('common:placeholders.check_in')}
                              className={`form-control ${SidebarSearchStyles.form_control}`}
                              dateFormat="dd/MM/yyyy"
                              locale={Cookies.get("X-localization") === 'en'?"en":"es"}
                              value={values.checkinDate}
                              onBlur={handleBlur}
                              selected={values.checkinDate}
                              minDate={minCheckIn}
                              autoComplete='off'
                              onChange={date => {
                                 setFieldValue('checkinDate', date);
                                 let checkoutDt = addDaysHelper(1,date)
				                     setFieldValue('checkoutDate', checkoutDt);
                                 onCheckinUpdate(date);
                                 onCheckoutUpdate(checkoutDt);
                                 let mNoOfNights = onSetDatePicker();
                                 if (mNoOfNights !== null)
                                    setFieldValue('noNights', mNoOfNights.toString());
                                 else
                                    setFieldValue('noNights', "1");
                                 this.setState({ 
                                    checkinDate: formatDateHelper4(date),
                                    checkoutDate: formatDateHelper4(checkoutDt)
                                 }, () => this.onDateChange());
                              }}
                              customInput={<CustomInput/>}
                              // onChange={(date) => console.log(date)}
                           />
                           {/* <FontAwesomeIcon
                              icon={faCalendarAlt}
                              className={`${styles.fa_btn_icon} ${styles.fa_calendar}`}
                           /> */}
                           <div className={`${SidebarSearchStyles.invalid_feedback} d-block`}>{errors.checkinDate && touched.checkinDate ? (
                              <div>{errors.checkinDate}</div>
                           ) : null}</div>
                        </div>
                        <div className="col datepicker2">
                           <label className="font-weight-bold">{this.props.t('sidebar_search.check_out')}</label>
                           <DatePicker
                              name="checkoutDate"
                              placeholderText={this.props.t('common:placeholders.check_out')}
                              className={`form-control ${SidebarSearchStyles.form_control}`}
                              dateFormat="dd/MM/yyyy"
                              locale={Cookies.get("X-localization") === 'en'?"en":"es"}
                              value={values.checkoutDate}
                              selected={values.checkoutDate}
                              minDate={values.checkinDate !== null?addDaysHelper(1,values.checkinDate): minCheckOut}
                              autoComplete='off'
                              onChange={date => {
                                 setFieldValue('checkoutDate', date);
                                 onCheckoutUpdate(date);
                                 let mNoOfNights = onSetDatePicker();
                                 if (mNoOfNights !== null)
                                    setFieldValue('noNights', mNoOfNights.toString());
                                 else
                                    setFieldValue('noNights', "1");
                                 this.setState({ checkoutDate: formatDateHelper4(date) }, () => this.onDateChange());
                              }}
                              // onChange={(date) => this.onCheckOutChange(date)}
                              customInput={<CustomInput/>}
                           />
                           {/* <FontAwesomeIcon
                              icon={faCalendarAlt}
                              className={`${styles.fa_btn_icon} ${styles.fa_calendar}`}
                           /> */}
                           <div className={`${SidebarSearchStyles.invalid_feedback} d-block`}>{errors.checkoutDate && touched.checkoutDate ? (
                              <div>{errors.checkoutDate}</div>
                           ) : null}</div>
                        </div>
                     </div>
                     <div className="form-row mb-3">
                        <div className="col">
                           <label className="font-weight-bold">{this.props.t('sidebar_search.nights')}</label>
                           <Select
                              instanceId="id_noOfNights"
                              name="noNights"
                              placeholder={this.props.t('common:placeholders.no_of_nights')}
                              value={nights.find((obj) => obj.value === values.noNights)}
                              options={nights}
                              styles={selectStyles_2}
                              onChange={val => {
                                 setFieldValue('noNights', parseInt(val.value));
                                 if (values.checkinDate !== null) {
                                    let mNewCheckout = addDaysHelper((val.value), values.checkinDate);
                                    setFieldValue('checkoutDate', mNewCheckout);
                                    this.setState({ checkoutDate: mNewCheckout });
                                 }
                                 this.setState({ noNights: parseInt(val.value) });
                              }}
                           />
                           <div className={`${SidebarSearchStyles.invalid_feedback} d-block`}>{errors.noNights && touched.noNights ? (
                              <div>{errors.noNights}</div>
                           ) : null}</div>
                        </div>
                        <div className="col">
                           <label className="font-weight-bold">{this.props.t('sidebar_search.rooms')}</label>
                           <Select
                              instanceId="id_noOfRooms"
                              name="noOfRooms"
                              placeholder={this.props.t('placeholders.no_of_nights')}
                              value={rooms.find((obj) => parseInt(obj.value) === values.noRooms)}
                              options={rooms}
                              styles={selectStyles_2}
                              onChange={val => {
                                 setFieldValue('noRooms', parseInt(val.value));
                                 this.onNoOfRoomsChange(val.value);
                              }}
                           />
                           <div className={`${SidebarSearchStyles.invalid_feedback} d-block`}>{errors.noRooms && touched.noRooms ? (
                              <div>{errors.noRooms}</div>
                           ) : null}</div>
                        </div>
                     </div>
                     <div className="form-row mb-3">
                        <div className="col-12">
                           <div className="row no-gutters">
                              <div className="col-2 text-right"></div>
                              <div className="col-4 text-right">
                                 <label className="font-weight-bold">{this.props.t('sidebar_search.adults')}</label>
                              </div>
                              <div className="col-3 text-right">
                                 <label className="font-weight-bold">{this.props.t('sidebar_search.children')}</label>
                              </div>
                              <div className={`col-3 text-right pl-1`}>
                                 <label className="font-weight-bold">{this.props.t('sidebar_search.age_of_children')}</label>
                              </div>
                           </div>
                        </div>
                        <div className="col-12">{this.renderRoomRow()}</div>
                     </div>
                     <div className="form-row mb-3">
                        <div className="col">
                           <button
                              type="submit"
                              className="btn btn-primary w-100"
                           >
                              {this.props.t('sidebar_search.search')}
                           </button>
                        </div>
                     </div>
                  </form>
               );
            }}
         </Formik>
      );
   }

   renderRoomRow() {
      const { occupancies } = this.state;
      const children_age = [];
      for (var i = 1; i <= 17; i++) {
         children_age.push({
            value: i,
            label: i,
         });
      }

      const renderAgeSelect = (pNoOfChildren, pRoom, pRoomInx) => {
         let ageSelectArr = [];
         for (let i = 0; i < pNoOfChildren; i++) {
            ageSelectArr.push(
               <Select
                  className="justify-content-end d-flex"
                  key={`${pRoomInx}_${i}_ageKey`}
                  instanceId={`${pRoomInx}_${i}_age`}
                  value={children_age.find(
                     (obj) => obj.value === pRoom.children_age[i]
                  )}
                  styles={smallSelectStyles_2}
                  options={children_age}
                  onChange={(obj) => this.onAgeChange(obj, pRoomInx, i)}
               />
            );
         }
         return ageSelectArr;
      };

      return occupancies.map((item,inx) => (
         <div
            className={`row no-gutters ${SidebarSearchStyles.room_row}`}
            key={inx}
         >
            <div className="col-2 d-flex justify-content-end">{` ${this.props.t('sidebar_search.room')} ${inx}`}</div>
            <div className="col-4 d-flex justify-content-end">
               <Select
                  instanceId="id_noOfAdults"
                  value={adults.find((obj) => obj.value === item.adults)}
                  styles={smallSelectStyles_2}
                  options={adults}
                  onChange={(obj) => this.onNoOfAdultsChange(obj, item, inx)}
               />
            </div>
            <div className="col-3 d-flex justify-content-end">
               <Select
                  instanceId="id_noOfChildren"
                  value={children.find((obj) => obj.value === item.children)}
                  styles={smallSelectStyles_2}
                  options={children}
                  onChange={(obj) => this.onNoOfChildrenChange(obj, item, inx)}
               />
            </div>
            <div id={`${inx}_age`} className="col-3">
               {renderAgeSelect(item.children, item, inx )}
            </div>
         </div>
      ));
   }
}

const mapStateToProps = state => ({
   search: state.search.searchObj,
   avalMeta: state.search.avalMeta,
   selectedHotel: state.search.selectedHotel,
});

const mapDispatchToProps = (dispatch) => ({
   updateSearchObj: (pSearchObj) => {
      dispatch(updateSearchObj(pSearchObj));
   },
   updateIsLoading: (pIsLoading) => dispatch(updateIsLoading(pIsLoading)),
   onGetAvalList: (pList) => dispatch(updateAvailabilityList(pList)),
   onGetAvalMeta: (pMeta) => dispatch(updateAvailabilityMeta(pMeta)),
   onHotelSelect: (pHotel) => dispatch(updateSelectedHotel(pHotel))
});

export default withTranslation("common")(connect(mapStateToProps, mapDispatchToProps)(SidebarSearch));
