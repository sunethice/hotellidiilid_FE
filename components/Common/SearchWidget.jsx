import React, { Component } from "react";
import { withRouter } from "next/router";
import DatePicker, { registerLocale } from "react-datepicker";
import enUS from "date-fns/locale/en-US";
import es from "date-fns/locale/es";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import _ from "lodash";
import { rooms, roomsES, adults, children } from "../Data/SearchWidgetData";
import makeAnimated from "react-select/animated";
import "react-datepicker/dist/react-datepicker.css";
import searchWidgetStyles from "../../styles/SearchWidget.module.scss";
import { selectStyles, smallSelectStyles, selectWidth175 } from "../../styles/SelectStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/Filter.module.scss";
import { addDaysHelper, noOfDaysHelper, formatDateHelper4 } from "../Data/helper";
import { connect } from "react-redux";
import { updateSearchObj } from '../../redux/actions/searchActions';
import { getLocationsByPhrase } from "../../core/frontend/http-service/hb.http";
import { Formik } from "formik";
import * as Yup from "yup";
import { withTranslation } from 'next-i18next';
import Cookies from "js-cookie";
import CustomInput from './CustomDateInput';

class SearchWidget extends Component {
   constructor(props) {
      super(props);
      this.state = {
         location_code: "",
         selectedlocation: "",
         checkinDate: null,
         checkoutDate: null,
         minCheckIn: new Date(),
         minCheckOut: addDaysHelper(1),
         noNights: 1,
         noRooms: 1,
         occupancies: [
            {
               room_no: 1,
               adults: 2,
               children: 0,
               children_age: [],
            },
         ],
         hasChildren: false
      }
      this.checkinVal = null;
      this.checkoutVal = null;
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
      this.props.router.push({
         pathname: `${Cookies.get("X-localization") === 'en'?'/en':''}/Results`,
         query: { searchparam: JSON.stringify(this.state) },
      });
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
         minCheckIn,
         minCheckOut
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
         location: {},
         inpLocation:"",
         selectedItems:[],
         checkinDate: null,
         checkoutDate: null,
         noNights: null,
         noRooms: 1,
      };

      const SearchSchema = Yup.object().shape({
         location: Yup.object().nullable().required('Destination is required'),
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

      const roomOptions = Cookies.get("X-localization") === "en" ? rooms : roomsES;
      
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
                  <form className={`${searchWidgetStyles.font_size_13}`} onSubmit={formik.handleSubmit}>
                     <div className="form-row mb-3">
                        <div className="col">
                           <label className="text-white">{ this.props.t('search_widget.enter_destination')}</label>
                           <AsyncSelect
                              name="location"
                              instanceId="id_location"
                              cacheOptions={false}
                              loadOptions={this.searchForLocations}
                              styles={selectStyles}
                              components={animatedComponents}
                              onBlur={this.handleBlur}
                              onChange={obj => {
                                 setFieldValue('location', obj);
                                 this.onLocationChange(obj)
                              }}
                              placeholder={this.props.t('placeholders.type_loc')}
                              onInputChange={(inputValue, event) => {
                                 if (event.action !== "input-blur" && event.action !== "menu-close") {
                                    setFieldValue('inpLocation', inputValue);
                                 }
                              }}
                              inputValue={values.inpLocation}
                           ></AsyncSelect>
                           <div className={`${searchWidgetStyles.invalid_feedback} d-block`}>{errors.location && touched.location ? (
                              <div>{errors.location}</div>
                           ) : null}</div>
                        </div>
                     </div>
                     <div className="form-row mb-3">
                        <div className="col">
                           <label className="text-white">{ this.props.t('search_widget.check_in')}</label>
                           <DatePicker
                              name="checkinDate"
                              placeholderText={this.props.t('placeholders.check_in')}
                              className={`form-control ${searchWidgetStyles.form_control}`}
                              dateFormat="dd/MM/yyyy"
                              locale={Cookies.get("X-localization") === 'en'?"en":"es"}
                              value={values.checkinDate}
                              onBlur={handleBlur}
                              customInput={<CustomInput/>}
                              selected={values.checkinDate}
                              minDate={minCheckIn}
                              autoComplete='off'
                              onChange={date => {
                                 setFieldValue('checkinDate', date);;
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
                           />
                           {/* <FontAwesomeIcon
                              icon={faCalendarAlt}
                              className={`${styles.fa_btn_icon} ${styles.fa_calendar}`}
                           /> */}
                           <div className={`${searchWidgetStyles.invalid_feedback} d-block`}>{errors.checkinDate && touched.checkinDate ? (
                              <div>{errors.checkinDate}</div>
                           ) : null}</div>
                        </div>
                        <div className="col datepicker2">
                           <label className="text-white">{ this.props.t('search_widget.check_out')}</label>
                           <DatePicker
                              name="checkoutDate"
                              placeholderText={this.props.t('placeholders.check_out')}
                              className={`form-control ${searchWidgetStyles.form_control}`}
                              dateFormat="dd/MM/yyyy"
                              locale={Cookies.get("X-localization") === 'en'?"en":"es"}
                              value={values.checkoutDate}
                              customInput={<CustomInput/>}
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
                           />
                           {/* <FontAwesomeIcon
                              icon={faCalendarAlt}
                              className={`${styles.fa_btn_icon} ${styles.fa_calendar}`}
                           /> */}
                           <div className={`${searchWidgetStyles.invalid_feedback} d-block`}>{errors.checkoutDate && touched.checkoutDate ? (
                              <div>{errors.checkoutDate}</div>
                           ) : null}</div>
                        </div>
                     </div>
                     <div className="form-row mb-3">
                        <div className="col">
                           <label className="text-white">{ this.props.t('search_widget.nights')}</label>
                           <Select
                              instanceId="id_noOfNights"
                              name="noNights"
                              placeholder={this.props.t('placeholders.no_of_nights')}
                              value={nights.find((obj) => obj.value === values.noNights)}
                              options={nights}
                              styles={selectWidth175}
                              onChange={val => {
                                 setFieldValue('noNights', parseInt(val.value));
                                 if (values.checkinDate !== null) {
                                    setFieldValue('checkoutDate', addDaysHelper( (val.value), values.checkinDate));
                                 }
                                 this.setState({ noNights: parseInt(val.value) });
                              }}
                           />
                           <div className={`${searchWidgetStyles.invalid_feedback} d-block`}>{errors.noNights && touched.noNights ? (
                              <div>{errors.noNights}</div>
                           ) : null}</div>
                        </div>
                        <div className="col">
                           <label className="text-white">{ this.props.t('search_widget.rooms')}</label>
                           <Select
                              instanceId="id_noOfRooms"
                              name="noOfRooms"
                              placeholder={this.props.t('placeholders.no_of_nights')}
                              value={roomOptions.find((obj) => parseInt(obj.value) === values.noRooms)}
                              options={roomOptions}
                              styles={selectWidth175}
                              onChange={val => {
                                 setFieldValue('noRooms', parseInt(val.value));
                                 this.onNoOfRoomsChange(val.value);
                              }}
                           />
                           <div className={`${searchWidgetStyles.invalid_feedback} d-block`}>{errors.noRooms && touched.noRooms ? (
                              <div>{errors.noRooms}</div>
                           ) : null}</div>
                        </div>
                     </div>
                     <div className="form-row mb-3">
                        <div className="col-12">
                           <div className="row">
                              <div className="col-3 text-right p-0"></div>
                              <div className="col-3 text-right p-0">
                                 <label className="text-white">{this.props.t('search_widget.adults')}</label>
                              </div>
                              <div className="col-3 text-right pr-2">
                                 <label className="text-white">{this.props.t('search_widget.children')}</label>
                              </div>
                              <div className={`col-3 text-right`}>
                                 <label className="text-white">{this.props.t('search_widget.age_of_children')}</label>
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
                              {this.props.t('search_widget.search')}
                           </button>
                        </div>
                     </div>
                  </form>
               );
            }}
         </Formik>);
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
                  className="justify-content-end d-flex mb-1"
                  key={`${pRoomInx}_${i}_ageKey`}
                  instanceId={`${pRoomInx}_${i}_age`}
                  value={children_age.find(
                     (obj) => obj.value === pRoom.children_age[i]
                  )}
                  styles={smallSelectStyles}
                  options={children_age}
                  onChange={(obj) => this.onAgeChange(obj, pRoomInx, i)}
               />
            );
         }
         return ageSelectArr;
      };

      return occupancies.map((item,inx) => (
         <div
            className={`row ${searchWidgetStyles.room_row}`}
            key={inx}
         >
            <div className="col-3 d-flex justify-content-end text-white mt-2 p-0">{` ${this.props.t('search_widget.room')} ${inx}`}</div>
            <div className="col-3 d-flex justify-content-end p-0">
               <Select
                  instanceId="id_noOfAdults"
                  value={adults.find((obj) => obj.value === item.adults)}
                  styles={smallSelectStyles}
                  options={adults}
                  onChange={(obj) => this.onNoOfAdultsChange(obj, item, inx)}
               />
            </div>
            <div className="col-3 d-flex justify-content-end p-0">
               <Select
                  instanceId="id_noOfChildren"
                  value={children.find((obj) => obj.value === item.children)}
                  styles={smallSelectStyles}
                  options={children}
                  onChange={(obj) => this.onNoOfChildrenChange(obj, item, inx)}
               />
            </div>
            <div id={`${inx}_age`} className="col-3 p-0">
               {renderAgeSelect(item.children, item, inx)}
            </div>
         </div>
      ));
   }
}

const mapStateToProps = state => ({
   search: state.search.searchObj
});

const mapDispatchToProps = (dispatch) => ({
   updateSearchObj: (pSearchObj) => {
      dispatch(updateSearchObj(pSearchObj));
   },
});

export default withTranslation("home")(connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchWidget)));