import React, { Component } from "react";
import { connect } from "react-redux"
import { withRouter } from "next/router";
import Select from "react-select";
import { getCountyList, processBooking } from "../../core/frontend/http-service/hb.http";
import { selectStyles, summarySelectStyles } from "../../styles/SelectStyles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { renderReview, formatDateHelper, noOfDaysHelper, formatDateHelper3, formatDateHelper5 } from "../Data/helper";
import { titles } from "../Data/SummaryData";
import styles from "../../styles/SummaryContentWrap.module.scss";
import { updateSearchObj, updateIsLoading, updateAvailabilityList, updateAvailabilityMeta, updateSelectedBoards } from '../../redux/actions/searchActions';
import { Formik } from "formik";
import * as Yup from 'yup';
import { onProceedToBooking, onBookNow } from "../../core/frontend/http-service/api.http";
import { withTranslation } from "next-i18next";
import SummaryContext from '../../context/SummaryContext';
import Cookies from "js-cookie";

class ContentWrap extends Component {
   static contextType = SummaryContext;
   constructor(props) {
      super(props);
      this.state = {
         isBookNowDisabled:true,
         countries: [],
         contactDetails: Cookies.get('contactDetails')? JSON.parse(Cookies.get('contactDetails')):{
            country: "",
            email: "",
            confirm_email: "",
            mobile: "",
            message:""
         },
         holder_name :"",
         holder_surname: "",
         remark:"",
         rooms:[], //rate_key
         pax: Cookies.get('pax') !== undefined ? JSON.parse(Cookies.get('pax')):this.props.pax,
         reqInfo: {
            room_count: 0,
            adult_count: 0,
            children_count:0
         },
         lead_passenger:""
      };
      this.initialValues = {};
   }

   componentDidMount() {
      // debugger;
      const {pax} = this.state;
      this.listCountry();
      if(pax.length == 0)
         this.manipulateReqInfo();
   }

   componentWillUnmount() {
      // debugger;
      const { contactDetails, pax } = this.state;
      Cookies.set('contactDetails', contactDetails, { expires: 1 });
      if(pax.length !== 0)
         Cookies.set('pax',JSON.stringify(pax), { expires: 1 });
   }

   listCountry() {
      getCountyList().then((response) => {
         if (response.status == 200) {
            if (response.data.pResultObj !== null) {
               let countryList = response.data.pResultObj.map((country)=>{
                  return { value: country.country_code, label:country.description}
               });
               this.setState({ countries: countryList });
            }
         }
      }).catch((error) => {
         console.log(error)
      })
   }

   manipulateReqInfo() {
      let mRoomCount = this.props.search.occupancies.length;
      let mAdultCount = 0, mChildCount = 0;
      this.props.search.occupancies.forEach((occupancyItem) => {
         mAdultCount += occupancyItem.adults;
         mChildCount += occupancyItem.children;
      });
      this.setState({
         reqInfo: {
            room_count: mRoomCount,
            adult_count: mAdultCount,
            children_count: mChildCount
         }
      });
   }

   onTitleChange(obj, pPaxId) {
      let rateKey = pPaxId.substring(0, pPaxId.length - 5);
      let mRoomNo = pPaxId.substring(pPaxId.length - 4, pPaxId.length - 3);
      let paxState = { ...this.state.pax };
      paxState[`${rateKey}_${mRoomNo}`][pPaxId].title = obj.label;
      this.setState({ pax: paxState });
   }

   onFirstNameChange(value, pPaxId) {
      let rateKey = pPaxId.substring(0, pPaxId.length - 5);
      let mRoomNo = pPaxId.substring(pPaxId.length - 4, pPaxId.length - 3);
      let paxState = {...this.state.pax};
      paxState[`${rateKey}_${mRoomNo}`][pPaxId].name = value;
      this.setState({ pax: paxState });
      if (pPaxId.endsWith("1AD0")) {
         this.setState({lead_passenger:value});
      }
   }

   onLastNameChange(value, pPaxId) {
      let { lead_passenger } = this.state;
      let rateKey = pPaxId.substring(0, pPaxId.length - 5);
      let mRoomNo = pPaxId.substring(pPaxId.length - 4, pPaxId.length - 3);
      let paxState = {...this.state.pax};
      paxState[`${rateKey}_${mRoomNo}`][pPaxId].surname = value;
      this.setState({ pax: paxState });
   }

   onConditionsSelect(event) {
      if (event.target.value) {
         this.setState({ isBookNowDisabled: false });
      }
      else {
         this.setState({ isBookNowDisabled: true });
      }
   }

   onProceedClick(pObj) {
      console.log("pObj00", pObj);
      const { pax, contactDetails } = this.state;
      const { setPage } = this.context;
      console.log("pObj-1",pax);
      console.log("paxKeys",this.props.paxKeys);
      const paxContent = Object.values(pax);
      console.log("pObj-2",paxContent);
      let paxArr = [];
      paxContent.forEach(function (value) {
         Object.entries(value).map(([key,value]) => {
            let mRateKey = key.substring(0,key.length - 5);
            console.log("mRateKey",mRateKey);
            if(paxArr.hasOwnProperty(mRateKey)){
               paxArr[mRateKey].push(value);
            }
            else{
               paxArr[mRateKey] = [value];
            }
            console.log("paxArr==",paxArr);
         });
      });
      
      console.log("this.props.selectedRooms", this.props.selectedRooms);
      const bookingObj = {
         'holder_name': pObj[`firstname${this.props.paxKeys[0]}`],
         'holder_surname': pObj[`lastname${this.props.paxKeys[0]}`],
         'client_reference': 'clientreference',
         'remark': pObj.message,
         'tolerance': 0,
         'rooms': [
            {
               rate_key: this.props.selectedRooms[0].rateKey,
               pax: paxContent
            }
         ],
         "total_net_sales": this.props.selectedRooms[0].netWithMarkup,
         "contact_details": contactDetails
      }
      console.log("bookingObj",bookingObj);
      // const mCached = onProceedToBooking(this.props.selectedRooms[0].rateKey, bookingObj);
      // setPage(2);
   }

   async onBookNowClick() {
      try {
         const resp = await onBookNow(this.props.selectedRooms[0].rateKey);
         if (resp.status == 200) {
            if (resp.data.data.pSuccess) {
               this.props.router.push({
                  pathname: "/Thankyou",
                  query: { bookingDetails: resp.data.data.pResultObj }
               });
            }
            else {

            }
         }
      }
      catch(error){
         console.log("booknow-err",error);
      };
   }

   renderGuestRow(pIsAdult, pNo, pRoomNo, index, pFormik) {
      return (
         <div className="row" key={`${pNo}`}>
            <div className={`col-lg-2 ${styles.person_col} ${styles.content_text}`}>{`${pIsAdult?this.props.t('adult'):this.props.t('child')} ${index}`}</div>
            <div className="col-lg-2">
               <Select
                  instanceId="id_titles"
                  placeholder={this.props.t("placeholders.title")}
                  value={titles.find((obj) => obj.value === pFormik.values[`title${pNo}`])}
                  options={titles}
                  styles={summarySelectStyles}
                  onChange={(obj) => this.onTitleChange(obj,pNo)}
                  inputValue={pFormik.values[`title${pNo}`]}
               />
            </div>
            <div className="col-lg-3">
               <input
                  type="text"
                  name={`firstname${pNo}`}
                  value={pFormik.values[`firstname${pNo}`]}
                  className={`form-control ${styles.form_control} ${styles.content_text}`}
                  placeholder={this.props.t("placeholders.first_name")}
                  onChange={event => {
                     pFormik.setFieldValue(`firstname${pNo}`,event.target.value)
                     this.onFirstNameChange(event.target.value, pNo)
                  }}
               />
               <div className={`${styles.invalid_feedback} d-block`}>{pFormik.errors[`firstname${pNo}`] && pFormik.touched[`firstname${pNo}`] ? (
                  <div>{pFormik.errors[`firstname${pNo}`]}</div>
               ) : null}</div>
            </div>
            <div className="col-lg-3">
               <input
                  type="text"
                  name={`lastname${pNo}`}
                  value={pFormik.values[`lastname${pNo}`]}
                  className={`form-control ${styles.form_control} ${styles.content_text}`}
                  placeholder={this.props.t("placeholders.last_name")}
                  onChange={event => {
                     pFormik.setFieldValue(`lastname${pNo}`, event.target.value)
                     this.onLastNameChange(event.target.value, pNo)
                  }}
               />
               <div className={`${styles.invalid_feedback} d-block`}>{pFormik.errors[`lastname${pNo}`] && pFormik.touched[`lastname${pNo}`] ? (
                  <div>{pFormik.errors[`lastname${pNo}`]}</div>
               ) : null}</div>
            </div>
            {pIsAdult && pNo.endsWith("1AD0") && pRoomNo == 1? <div className={`col-lg-2 ${styles.person_col} ${styles.content_text}`}>{this.props.t("lead_passenger")}</div>:""}
         </div>);
   }

   renderRoomInfo() {
      let that = this;
      const { pax } = this.state;
      let contactInfo = [];
      Object.entries(pax).forEach(([occupancyKey, occupancyList]) => {
         contactInfo.push(<div className="border-bottom py-1 mb-2" key={occupancyKey}><b>{`${this.props.t("room")} ${occupancyKey} - `}</b> {this.props.selectedRooms ? `${this.props.selectedRooms[0].name} : ${this.props.selectedRooms[0].boardName}` : ""}</div>);
         Object.values(occupancyList).map((occupancyItem, inx) => {
            contactInfo.push(<div key={`${occupancyKey}_${inx}`}><b>{`${occupancyItem.type == "AD" ? this.props.t("adult") : this.props.t("child")} 1`} - </b> {`${occupancyItem.name} ${occupancyItem.surname}`}</div>)
         });
      });
      return contactInfo;
   }

   render() {
      const { cCurrentPage } = this.context;
      const { isBookNowDisabled, countries, contactDetails,
         contactDetails: {
            country, email, confirm_email, mobile, message
         },
         reqInfo: {
            room_count, adult_count, children_count
         },
         lead_passenger,
         pax
      } = this.state;

      if(Object.keys(this.initialValues).length === 0){
         this.initialValues = {
            country: country,
            email: email,
            confirmEmail: confirm_email,
            phoneNumber: mobile,
            message: message
         };
      }

      const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
      const schemaObj = {
         country: Yup.string().required('Country is required'),
         email: Yup.string().email('Input should be an email').required('Email is required'),
         confirmEmail: Yup.string().email('Input should be an email')
            .oneOf([Yup.ref('email'), null], 'Email must match')
            .required('Confirm email is required'),
         phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required('Phone number is required'),
         message: Yup.string()
      }

      // for (let i = 0; i < (adult_count + children_count); i++){
      //    schemaObj[`firstname${i}`] = Yup.string().required('First name is required');
      //    schemaObj[`lastname${i}`] = Yup.string().required('Last name is required');
      //    if (Object.keys(this.initialValues).length === 5) {
      //       this.initialValues[`firstname${i}`] = "";
      //       this.initialValues[`lastname${i}`] = "";
      //    }
      // }

      // this.props.search.occupancies.map((occupancyItem, inx) => {
      //    {[...Array(occupancyItem.adults)].map((x, i) => {
      //       schemaObj[`firstname${occupancyItem.room_no}_AD_${i}`] = Yup.string().required('First name is required');
      //       schemaObj[`lastname${occupancyItem.room_no}_AD_${i}`] = Yup.string().required('Last name is required');
      //       if (Object.keys(this.initialValues).length >= 5) {
      //          this.initialValues[`title${occupancyItem.room_no}_AD_${i}`] = Object.keys(pax).length !== 0 && pax[occupancyItem.room_no][`${occupancyItem.room_no}AD${i}`]?pax[occupancyItem.room_no][`${occupancyItem.room_no}AD${i}`]["title"]:"";
      //          this.initialValues[`firstname${occupancyItem.room_no}_AD_${i}`] = Object.keys(pax).length !== 0 && pax[occupancyItem.room_no][`${occupancyItem.room_no}AD${i}`]?pax[occupancyItem.room_no][`${occupancyItem.room_no}AD${i}`]["name"]:"";
      //          this.initialValues[`lastname${occupancyItem.room_no}_AD_${i}`] = Object.keys(pax).length !== 0 && pax[occupancyItem.room_no][`${occupancyItem.room_no}AD${i}`]?pax[occupancyItem.room_no][`${occupancyItem.room_no}AD${i}`]["surname"]:"";
      //       }
      //    })}
      //    {[...Array(occupancyItem.children)].map((x, i) => {
      //       schemaObj[`firstname${occupancyItem.room_no}_CH_${i}`] = Yup.string().required('First name is required');
      //       schemaObj[`lastname${occupancyItem.room_no}_CH_${i}`] = Yup.string().required('Last name is required');
      //       if (Object.keys(this.initialValues).length >= 5) {
      //          this.initialValues[`title${occupancyItem.room_no}_CH_${i}`] = Object.keys(pax).length !== 0 && pax[occupancyItem.room_no][`${occupancyItem.room_no}AD${i}`]?pax[occupancyItem.room_no][`${occupancyItem.room_no}CH${i}`]["title"]:"";
      //          this.initialValues[`firstname${occupancyItem.room_no}_CH_${i}`] = Object.keys(pax).length !== 0 && pax[occupancyItem.room_no][`${occupancyItem.room_no}CH${i}`]?pax[occupancyItem.room_no][`${occupancyItem.room_no}CH${i}`]["name"]:"";
      //          this.initialValues[`lastname${occupancyItem.room_no}_CH_${i}`] = Object.keys(pax).length !== 0 && pax[occupancyItem.room_no][`${occupancyItem.room_no}CH${i}`]?pax[occupancyItem.room_no][`${occupancyItem.room_no}CH${i}`]["name"]:"";
      //       }
      //    })}
      // });

      this.props.paxKeys.map((key, inx) => {
         let rateKey = key.substring(0, key.length - 5);
         let mRoomNo = key.substring(key.length - 4, key.length - 3);
         schemaObj[`firstname${key}`] = Yup.string().required('First name is required');
         schemaObj[`lastname${key}`] = Yup.string().required('Last name is required');
         if (Object.keys(this.initialValues).length >= 5) {
            this.initialValues[`title${key}`] = Object.keys(pax).length !== 0?pax[`${rateKey}_${mRoomNo}`][`${key}`]["title"]:"";
            this.initialValues[`firstname${key}`] = Object.keys(pax).length !== 0?pax[`${rateKey}_${mRoomNo}`][`${key}`]["name"]:"";
            this.initialValues[`lastname${key}`] = Object.keys(pax).length !== 0?pax[`${rateKey}_${mRoomNo}`][`${key}`]["surname"]:"";
         }
      });

      const SummarySchema = Yup.object().shape(schemaObj);
      return (
         <div className={`col-lg-8 ${styles.outerwrap}`}>
            <div className={`row m-1 ${styles.basic_info_wrap}`}>
               <div className={`col-xs-12 ${styles.tab_bar}`}>
                  <div className={`col-xs-6 ${cCurrentPage == 1 ? styles.active : ""} ${styles.tab}`} >
                     <div className="float-right">
                        <strong className="mr-1">01</strong> {this.props.t('personal_details')}
                     </div>
                  </div>
                  <div className={`col-xs-6 ${cCurrentPage == 2 ? styles.active : ""} ${styles.tab}`} >
                     <div className="float-left">
                        <strong className="mr-1">02</strong> {this.props.t('reservation_summary')}
                     </div>
                  </div>
               </div>
            </div>
            <div className={`row mt-3 mx-1 ${styles.content_wrap}`}>
               <div className="col-lg-2">
                  <img
                     className={`${styles.content_img}`}
                     width="100%"
                     src="https://res.cloudinary.com/muhammederdem/image/upload/v1535759872/kuldar-kalvik-799168-unsplash.jpg"
                  />
               </div>
               <div className="col-lg-4">
                  <div className={`pr-3 ${styles.hotel_name}`}>
                     <b>{this.props.selectedHotel?this.props.selectedHotel.name:"<<hotel name>>"}</b>
                  </div>
                  <div>
                     { renderReview(this.props.selectedHotel?this.props.selectedHotel.categoryCode:null) }
                  </div>
                  <div className={`${styles.address}`}>
                     <FontAwesomeIcon icon={faMapMarkerAlt} />&nbsp;&nbsp;
                     {
                        this.props.selectedHotelStatic?
                           this.props.selectedHotelStatic.address_number + " " +
                           this.props.selectedHotelStatic.address_street + " " +
                           this.props.selectedHotelStatic.address_city + " " +
                           this.props.selectedHotelStatic.address_postal_code : ""
                     }
                  </div>
               </div>
               <div className="col-lg-3">
                  <div className={`${styles.content_text}`}><b>{this.props.t('check_in')}:</b>{formatDateHelper3(this.props.search.check_in)}</div>
                  <div className={`${styles.content_text}`}><b>{this.props.t('check_out')}:</b>{formatDateHelper3(this.props.search.check_out)}</div>
                  <div className={`${styles.content_text}`}><b>{this.props.t('nights')}:</b>{noOfDaysHelper(this.props.search.check_in,this.props.search.check_out)}</div>
               </div>
               <div className="col-lg-3">
                  <div className={`${styles.content_text}`}><b>{this.props.t('room')}:</b>{ room_count }</div>
                  <div className={`${styles.content_text}`}><b>{this.props.t('adults')}:</b>{ adult_count }</div>
                  <div className={`${styles.content_text}`}><b>{this.props.t('children')}:</b>{ children_count }</div>
               </div>
            </div>
            <Formik
               initialValues={this.initialValues}
               validationSchema={SummarySchema}
               onSubmit={(values) => this.onProceedClick(values)}
            >
               {(formik) => {
                  const {
                     values,
                     handleSubmit,
                     errors,
                     touched,
                     setFieldValue
                  } = formik;
                  return (
                     <form onSubmit={handleSubmit}>
                        <div className={`row mt-3 mx-1 ${styles.content_wrap} ${cCurrentPage == 1 ? styles.show : styles.hide}`} >
                           <div className={`col-12 ${styles.content_heading}`}>{this.props.t('guest_details')}</div>
                           {
                              Object.values(this.props.pax).map((paxItem, inx) => {
                                 return (
                                    <>
                                       <div className={`col-12 ${styles.content_sub_heading}`}>
                                       <div><b>{ this.props.t('room')} {inx+1} - </b> {this.props.selectedRooms ? `${this.props.selectedRooms[inx].name} : ${this.props.selectedRooms[inx].boardName}` : ""}</div>
                                       </div>
                                       <div className="col-12">
                                          {/* {[...Array(occupancyItem.adults)].map((x, i) => {
                                             return this.renderGuestRow(true, `${occupancyItem.room_no}_AD_${i}`, occupancyItem.room_no, i, formik);
                                          })}
                                          {[...Array(occupancyItem.children)].map((x, i) => {
                                             return this.renderGuestRow(false, `${occupancyItem.room_no}_CH_${i}`, occupancyItem.room_no, i, formik);
                                          })} */}
                                          {Object.entries(paxItem).map(([key, value], index)=>{
                                             return this.renderGuestRow(value.type==="AD", key, value.room_id, parseInt(key.substring(key.length - 1)) + 1, formik);
                                          })}
                                       </div>
                                    </>
                                 )
                              })
                           }
                           <div className="col-12">
                              <div className={`row ${styles.cancellation}`}>
                                 <div className="col-4">{this.props.t('cancellation_policy')}</div>
                                 <div className="col-8">
                                    {`${this.props.t('cancel_stmt_1')} ${formatDateHelper5(this.props.selectedRooms[0].cancellationPolicies[0].from)} ${this.props.t('cancel_stmt_2')} ${this.props.selectedRooms[0].cancellationPolicies[0].amount}€ ${this.props.t('cancel_stmt_3')}`}
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className={`row mt-3 mx-1 ${styles.content_wrap} ${cCurrentPage == 1 ? styles.show : styles.hide}`}>
                           <div className={`col-12 ${styles.content_heading}`}>{this.props.t('contact_info')}</div>
                           <div className="w-100 p-3">
                              <div className="form-row mb-3">
                                 <div className={`col-6 ${styles.country_padding}`}>
                                    <Select
                                       instanceId="id_titles"
                                       name="country"
                                       placeholder={this.props.t('placeholders.country')}
                                       value={countries.find((obj) => obj.value === values.country)}
                                       options={countries}
                                       styles={summarySelectStyles}
                                       onChange={(obj) =>
                                          {
                                             setFieldValue('country', obj.value);
                                             this.setState({
                                                contactDetails: {
                                                   ...contactDetails,
                                                   country: obj.value
                                                }
                                             })
                                          }
                                       }
                                    />
                                    <div className={`${styles.invalid_feedback} d-block`}>{errors.country && touched.country ? (
                                       <div>{errors.country}</div>
                                    ) : null}</div>
                                 </div>
                                 <div className="col-6 p-2">
                                    <input
                                       type="email"
                                       name="email"
                                       className={`form-control ${styles.form_control} ${styles.content_text}`}
                                       value={values.email}
                                       placeholder={this.props.t('placeholders.email')}
                                       onChange={pEmail =>
                                          {
                                             setFieldValue('email', pEmail.currentTarget.value);
                                             this.setState({
                                                contactDetails: {
                                                   ...contactDetails,
                                                   email: pEmail.currentTarget.value
                                                }
                                             })
                                          }
                                       }
                                    />
                                    <div className={`${styles.invalid_feedback} d-block`}>{errors.email && touched.email ? (
                                       <div>{errors.email}</div>
                                    ) : null}</div>
                                 </div>
                              </div>
                              <div className="form-row mb-3">
                                 <div className="col-6 p-2">
                                    <input
                                       type="tel"
                                       name="phoneNumber"
                                       value={values.phoneNumber}
                                       className={`form-control ${styles.form_control} ${styles.content_text}`}
                                       placeholder={this.props.t('placeholders.telephone')}
                                       onChange={pPHNo => {
                                          setFieldValue('phoneNumber', pPHNo.currentTarget.value);
                                          this.setState({
                                             contactDetails: {
                                                ...contactDetails,
                                                mobile: pPHNo.currentTarget.value
                                             }
                                          })
                                       }}
                                    />
                                    <div className={`${styles.invalid_feedback} d-block`}>{errors.phoneNumber && touched.phoneNumber ? (
                                       <div>{errors.phoneNumber}</div>
                                    ) : null}</div>
                                 </div>
                                 <div className="col-6 p-2">
                                    <input
                                       type="email"
                                       name="confirmEmail"
                                       value={values.confirmEmail}
                                       className={`form-control ${styles.form_control} ${styles.content_text}`}
                                       placeholder={this.props.t('placeholders.confirm_email')}
                                       onChange={pEmail => {
                                          setFieldValue('confirmEmail', pEmail.currentTarget.value);
                                          this.setState({
                                             contactDetails: {
                                                ...contactDetails,
                                                confirm_email: pEmail.currentTarget.value
                                             }
                                          })
                                       }}
                                    />
                                    <div className={`${styles.invalid_feedback} d-block`}>{errors.confirmEmail && touched.confirmEmail ? (
                                       <div>{errors.confirmEmail}</div>
                                    ) : null}</div>
                                 </div>
                              </div>
                              <div className="form-row mb-3">
                                 <div className="col-12">
                                    <textarea
                                       id="messageTxt"
                                       value={values.message}
                                       className={`form-control ${styles.form_control} ${styles.msgTxtArea} ${styles.content_text}`}
                                       rows="3"
                                       maxLength="100"
                                       placeholder={this.props.t('placeholders.comment')}
                                       onChange={event =>{
                                          setFieldValue('message',event.target.value);
                                          this.setState({
                                             contactDetails: {
                                                ...contactDetails,
                                                message: event.target.value
                                             }
                                          })
                                       }}
                                    ></textarea>
                                    <div className={`${styles.commentIns}`}>{this.props.t('comment_instr')}</div>
                                 </div>
                              </div>
                              <div className="form-row mb-3">
                                 <div className="col-12">
                                    <button
                                       type="submit"
                                       className="btn btn-primary"
                                       // onClick={event => {
                                       //    this.onProceedClick(event);
                                       // }}
                                    >
                                       {this.props.t('proceed')}
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </form>
                  )}}
            </Formik>
            <div className={`row mt-3 mx-1 ${styles.content_wrap}  ${cCurrentPage == 2 ? styles.show : styles.hide}`}>
               <div className={`col-12 ${styles.content_heading}`}>{this.props.t("room_info")}</div>
               <div className={`col-12 ${styles.content_sub_heading}`}>
                  <div><b>{this.props.t('lead_passenger')}</b> {lead_passenger}</div>
               </div>
               <div className={`col-12 ${styles.content_sub_heading}`}>
                  {
                     this.renderRoomInfo()
                  }
               </div>
               <div className="col-12 pt-4">
                  <div className={`row ${styles.cancellation}`}>
                     <div className="col-4">{this.props.t('cancellation_policy')}</div>
                     <div className="col-8">
                        {`${this.props.t('cancel_stmt_1')} ${formatDateHelper5(this.props.selectedRooms[0].cancellationPolicies[0].from)} ${this.props.t('cancel_stmt_2')} ${this.props.selectedRooms[0].cancellationPolicies[0].amount}€ ${this.props.t('cancel_stmt_3')}`}
                     </div>
                  </div>
               </div>
            </div>
            <div className={`row mt-3 mx-1 ${styles.content_wrap} ${cCurrentPage == 2 ? styles.show : styles.hide}`}>
               <div className="col-8">
                  <div className={`${styles.content_sub_heading}`}>{this.props.t("total_cost")}: {`${this.props.selectedRooms.totalCost}`}&#8364;</div>
                  <div className={`${styles.content_text} pt-3`}>
                     <input type="checkbox" name="starcheckbox" className="mr-2"
                        onChange={(event) =>
                           this.onConditionsSelect(event)
                        }
                     />
                     {this.props.t("payment_confirmation")}
                  </div>
                  <div className={`${styles.content_text} pt-3`}>
                     <button className={`btn btn-primary ${styles.book_now}`} disabled={isBookNowDisabled}
                        onClick={(event) =>
                           this.onBookNowClick()
                        }>
                        {this.props.t("book_now")}
                     </button>
                  </div>
               </div>
               <div className="col-4">
                  <div className={`${styles.content_heading}`}>{this.props.t("payment_options")}</div>
                  <div className={`${styles.content_heading}`}>
                     <img
                        className={`${styles.content_img}`}
                        width="100%"
                        src="/images/paymentOptions.jpg"
                     />
                  </div>
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
   isLoading: state.search.isLoading,
   selectedHotel: state.search.selectedHotel,
   selectedHotelStatic: state.search.selectedHotelStatic,
   selectedRooms: state.search.selectedRooms,
   paxKeys: state.search.paxKeys,
   pax: state.search.pax
});

const mapDispatchToProps = (dispatch) => ({
   updateSearchObj: (pSearchObj) => {
      dispatch(updateSearchObj(pSearchObj));
   },
   onGetAvalList: (pList) => dispatch(updateAvailabilityList(pList)),
   onGetAvalMeta: (pMeta) => dispatch(updateAvailabilityMeta(pMeta)),
   updateIsLoading: (pIsLoading) => dispatch(updateIsLoading(pIsLoading)),
   updateSelectedBoards: (pBoards) => dispatch(updateSelectedBoards(pBoards))
});

export default withTranslation('summary')(connect(mapStateToProps, mapDispatchToProps)(withRouter(ContentWrap)));
