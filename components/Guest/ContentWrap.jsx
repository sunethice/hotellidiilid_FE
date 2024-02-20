import React, { Component } from "react";
import { Tabs, Tab } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { GoogleMap, Marker } from '@react-google-maps/api';
import { connect } from "react-redux"
import { withRouter } from "next/router";
import styles from "../../styles/GuestContentWrap.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCheck, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { getHotelDetails } from "../../core/frontend/http-service/hb.http";
import { updateSearchObj, updateIsLoading, 
   updateSelectedBoards, updateSelectedRooms, 
   updateSelectedHotelStatic, updatePaxKeys, updatePaxDetails } from '../../redux/actions/searchActions';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import { withTranslation } from "next-i18next";
import Cookies from "js-cookie";
import { SRLWrapper } from "simple-react-lightbox";

class ContentWrap extends Component {
   constructor(props) {
      super(props);
      this.state = {
         hotel: null,
         facility_col1: [],
         facility_col2: [],
         facility_col3: [],
         roomList: [],
         onComponenetDidMount: false,
         mapModal: false
      };
   }

   componentDidMount() {
      this.props.updateIsLoading(true);
      this.prepareRoomList(this.props.selectedHotel);
      this.setState({ onComponenetDidMount: true }, () => {
         this.updateBoardList();
         this.getHotel();
      });
   }

   prepareRoomList(selectedHotel) {
      let mRoomList = [];
      let mOccupOccuranceList = this.getOccupKeyList();
      console.log("mOccupOccuranceList",mOccupOccuranceList)
      if (selectedHotel) {
         selectedHotel.rooms.forEach(function (pRoom, index) {
            pRoom.rates.forEach((pRate, inx) => {
               if (pRate.rateType === "RECHECK" || pRate.rateType === "BOOKABLE") {
                  pRate.code = pRoom.code;
                  pRate.name = pRoom.name;
                  let mKey = `${pRate.adults}-${pRate.children}`;
                  if(pRate.children > 0){
                     let ageString = pRate.childrenAges.split(",").sort().join('-');
                     mKey = `${mKey}-${ageString}`;
                  }
                  if(mRoomList[`${mKey}`] == undefined){
                     mRoomList[`${mKey}`] = [pRate];
                  }
                  else{
                     mRoomList[`${mKey}`].push(pRate);
                  }
               }
            });
         });
         let mListCombinations = this.createCombinations(...Object.values(mRoomList));
         this.setState({ roomList: mListCombinations });
      }
   }


   createCombinations(...pRoomList){
      let mCombinationList = pRoomList.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
      mCombinationList = mCombinationList.filter((pArrEle) => {
         if(pArrEle[0].boardCode === pArrEle[1].boardCode){
            return true;
         }
         else{
            return false;
         }
      });
      return mCombinationList;
   }

   getOccupCombOccuranceList(){
      let mOccurances = {};
      this.props.search.occupancies.map((pOccupancy) => {
         let mCombination = `${pOccupancy.adults}-${pOccupancy.children}`;
         if(Object.keys(mCombination).indexOf(mCombination) !== -1){
            mOccurances[mCombination] = ++mOccurances[mCombination];
        }
        else{ 
            mOccurances[mCombination] = 1;
        }
      });
      return mOccurances;
   }

   getOccupKeyList(){
      let mKeys = [];
      this.props.search.occupancies.map((pOccupancy) => {
         let mCombination = `${pOccupancy.adults}-${pOccupancy.children}`;
         if(pOccupancy.children > 0){
            let ageString = pOccupancy.children_age.join("-");
            mCombination = `${mCombination}-${ageString}`;
         }
         if(!mKeys.includes(mCombination)){
            mKeys.push(mCombination);
         }
      });
      return mKeys;
   }

   updateBoardList() {
      const { roomList, onComponenetDidMount } = this.state;
      if(onComponenetDidMount){
         let mBoardList = [];
         roomList.forEach((pCombination) => {
            if (!mBoardList.includes(pCombination[0].boardName)) {
               mBoardList.push(pCombination[0].boardName);
            }
         });
         this.props.updateSelectedBoards(mBoardList);
      }
   }

   componentWillReceiveProps(nextProps) {
      this.prepareRoomList(nextProps.selectedHotel);
   }

   componentDidUpdate() {
      var that = this;
      setTimeout(() => {
         that.props.updateIsLoading(false);
      }, 2000);

   }

   getHotel() {
      // setTimeout(() =>
      getHotelDetails(this.props.selectedHotel.code)
         .then((response) => {
            if (response.status == 200) {
               if (response.data.pResultObj != null) {
                  this.props.updateSelectedHotelStatic(response.data.pResultObj);
                  this.setState({ hotel: response.data.pResultObj }, () => {
                     this.listFacilities();
                  });
               }
            }
         })
         .catch((error) => {
            console.log(error);
         })
         // , 1000);
   }

   listFacilities() {
      const { hotel,facility_col1,facility_col2,facility_col3 } = this.state;
      if (hotel !== null && hotel.facilities.length !== 0) {
         let columnItems = Math.ceil(hotel.facilities.length / 3);
         let resultHtml1 = [],resultHtml2 = [],resultHtml3 = [];
         hotel.facilities.map((pFacility, inx) => {
            if (((inx + 1) % 3) == 1) {
               resultHtml1.push(<div className="d-flex"><span className="mr-1"><FontAwesomeIcon className={`${styles.feature_check}`} icon={faCheck} /></span><span>{pFacility.description}</span></div>);
            }
            else if (((inx + 1) % 3) == 2) {
               resultHtml2.push(<div className="d-flex"><span className="mr-1"><FontAwesomeIcon className={`${styles.feature_check}`} icon={faCheck} /></span><span>{pFacility.description}</span></div>);
            }
            else {
               resultHtml3.push(<div className="d-flex"><span className="mr-1"><FontAwesomeIcon className={`${styles.feature_check}`} icon={faCheck} /></span><span>{pFacility.description}</span></div>);
            }
         });
         this.setState({ facility_col1: resultHtml1, facility_col2: resultHtml2,facility_col3: resultHtml3 });
      }
   }

   onBookNowSelect(pSelectedRooms) {
      console.log("pSelectedRoom",pSelectedRooms)
      let sumNet = 0;
      pSelectedRooms.map((pRoom)=> {
         sumNet = pRoom.netWithMarkup + sumNet;
      });
      pSelectedRooms.totalNetSaleWithMarkup = sumNet;
      this.props.updateSelectedRooms(pSelectedRooms);
      this.listPaxKeys(pSelectedRooms);
      this.props.router.push({
         pathname: `${Cookies.get("X-localization") === 'en'?"/en":""}/Summary`
      });
   }

   listPaxKeys(pSelectedRooms){
      let mPaxKeyArr = [];
      let roomCounter = [];
      let mKeyArr = [];
      let mPax = {}, mOccupancy = {};
      pSelectedRooms.forEach((pRoom) => {
         mKeyArr[`${pRoom.adults}-${pRoom.children}`] = {
            rateKey : pRoom.rateKey,
            noRooms : pRoom.rooms
         }; 
      });
      this.props.search.occupancies.map((occupancyItem, inx) => {
         let rateKey = mKeyArr[`${occupancyItem.adults}-${occupancyItem.children}`].rateKey;
         let modifiedRateKey = rateKey.replaceAll(".","~dot~");
         let roomNo = 0;
         if(!Object.keys(roomCounter).includes(modifiedRateKey)){
            roomNo = 1;
            roomCounter[modifiedRateKey] = roomNo;
         }
         else{
            roomNo = roomCounter[modifiedRateKey] + 1;
            roomCounter[modifiedRateKey] = roomNo;
         }
         [...Array(occupancyItem.adults)].map((x, i) => {
            let mADKey = `${modifiedRateKey}-${roomNo}AD${i}`;
            mPaxKeyArr.push(mADKey);
            mOccupancy[mADKey] = {
               room_id: inx + 1,
               title:"",
               type: "AD",
               age: 0,
               name: '',
               surname: '',
               isLead: (mPaxKeyArr.length === 1)?true:false
            }
         });
         [...Array(occupancyItem.children)].map((x, i) =>{
            let mCHKey = `${modifiedRateKey}-${roomNo}CH${i}`;
            mPaxKeyArr.push(mCHKey);
            mOccupancy[mCHKey] = {
               room_id: inx + 1,
               title:"",
               type: "CH",
               age: occupancyItem.children_age[i],
               name: '',
               surname: ''
            }
         });
         mPax[`${modifiedRateKey}_${roomNo}`] = mOccupancy;
         mOccupancy = {};
      });
      // console.log("mPax",mPax);
      // console.log("mPaxKeyArr",mPaxKeyArr);
      this.setState({ paxKeyArr :mPaxKeyArr });
      this.props.updatePaxKeys(mPaxKeyArr);
      this.props.updatePaxDetails(mPax);
   }

   createGallery() {
      const { hotel } = this.state;
      const mGalleryImg = [];
      if (hotel) {
         for (let i = 0; i < hotel.images.length; i++){
            if (i < 8) {
               mGalleryImg.push(<img
                  key={hotel.images[i]._id}
                  src={`https://photos.hotelbeds.com/giata/${hotel.images[i].path}`}
                  className={`${styles.gallery_item}`}
               />);
            }
            else if(i == 8){
               mGalleryImg.push(
                  <div style={{padding : "3px"}}>
                     <div
                     onClick={()=>this.inputElement.click()}
                     className={`${styles.gallery_view_more}`}
                     >{this.props.t('view_more')}</div>
                  </div>
               );
            }
            else {
               mGalleryImg.push(<img
                  key={hotel.images[i]._id}
                  ref={input => this.inputElement = input}
                  src={`https://photos.hotelbeds.com/giata/${hotel.images[i].path}`}
                  style={{display: "none" }}
               />);
            }
         }
      }
      return mGalleryImg;
   }

   onViewMapClick() {
      this.setState({ mapModal: true });
   }

   handleClose() {
      this.setState({ mapModal: false });
   }

   render() {
      const { hotel, facility_col1, facility_col2, facility_col3, roomList, mapModal } = this.state;
      return (
         <div className={`col-lg-8 ${styles.outerwrap}`}>
            <div className={`row m-1`}>
               <div className="col-lg-12 bg-white">
                  <div className="row">
                     <div className="col-8 p-4">
                        <div className="row pl-2">
                           <div className="pr-3">
                              <b>{ hotel !== null?hotel.name:""}</b>
                           </div>
                           <div>
                              <FontAwesomeIcon
                                 icon={faStar}
                                 className={`${styles.star} ${styles.checked}`}
                              />
                              <FontAwesomeIcon
                                 icon={faStar}
                                 className={`${styles.star} ${styles.checked}`}
                              />
                              <FontAwesomeIcon
                                 icon={faStar}
                                 className={`${styles.star} ${styles.checked}`}
                              />
                           </div>
                        </div>
                        <div className="row pl-2">
                           <img src="/images/guestTripAdvisor/3.png" style={{width: "20%"}}/>
                        </div>
                        <div className="row pl-2">
                           <div className={`${styles.address}`}>
                              <FontAwesomeIcon icon={faMapMarkerAlt} />&nbsp;&nbsp;
                              {hotel !== null ? hotel.address_number + " " + hotel.address_street + " " + hotel.address_city + " " + hotel.address_postal_code:""}
                           </div>
                        </div>
                        
                     </div>
                     <div className="col-4 text-right py-4 pl-0 d-lg-none d-md-block">
                        <button className={`btn btn-primary ${styles.textsize}`} onClick={() => this.onViewMapClick()}>{this.props.t('view_map')}</button>
                     </div>
                  </div>
                  <SRLWrapper>
                     <ResponsiveMasonry
                     columnsCountBreakPoints={{350: 1, 750: 3, 900: 3}}
                     >
                        <Masonry columnsCount={3}>
                           { this.createGallery()}
                        </Masonry>
                     </ResponsiveMasonry>
                  </SRLWrapper>
               </div> 
            </div>
            <div className={`row mt-3 mx-1`}>
               <div className="col-lg-12 bg-white">
                  <div className="row p-4">
                     <div className="">
                        <b>{this.props.t('rooms_results.heading')}</b>
                     </div>
                  </div>
                  <div className="row px-2 py-1 room_result_headings">
                     <div className="col-4">
                        <b>{this.props.t('rooms_results.tb_head_1')}</b>
                     </div>
                     <div className="col-2 text-right">
                        <b>{this.props.t('rooms_results.tb_head_2')}</b>
                     </div>
                     <div className="col-3 text-right">
                        <b>{this.props.t('rooms_results.tb_head_3')}</b>
                     </div>
                     <div className="col-3 text-center"></div>
                  </div>
                  {
                     this.props.isLoading ?
                     (<div className="d-flex justify-content-center">
                        <img
                           className={`${styles.loading_gif}`}
                           src="/images/loading.gif"
                        />
                     </div>) :
                     roomList.map((pRooms, inx) => {
                        let sumNet = 0;
                        pRooms.map((pRoom)=> {
                           sumNet = pRoom.netWithMarkup + sumNet;
                        });
                        return (
                           <div className={`row px-2 py-3 border-top ${styles.aval_room}`} key={inx}>
                              <div className="col-4">
                                 {pRooms.map((pRoom)=>{
                                    return (
                                       <>
                                          <div><b>{`${pRoom.name}`}</b></div>
                                          <div><small>{`${pRoom.boardName}`}</small></div>
                                       </>
                                    );
                                 })}
                              </div>
                              <div className="col-2 text-right">
                                 {pRooms.map((pRoom)=>{
                                    return (
                                       <div className="row mb-4">
                                          <b>x{pRoom.rooms}</b>
                                       </div>
                                    );
                                 })}
                              </div>
                              <div className={`col-3 text-right pr-4 ${styles.room_rate}`}>
                                 <b>{sumNet.toFixed(2)}&#8364;</b>
                              </div>
                              <div className="col-3 text-center p-0">
                                 <button className={`btn btn-primary ${styles.book_now}`}
                                    onClick={(event) =>
                                       this.onBookNowSelect(
                                          pRooms
                                       )
                                    }>
                                    {this.props.t('rooms_results.book_now')}
                                 </button>
                              </div>
                           </div>);
                     })
                  }
               </div>
            </div>
            <div className={`row w-100 mt-3 mx-1 ${styles.room_info_wrap}`}>
               <Tabs
                  id="controlled-tab-example"
                  activeKey={this.state.key}
                  className={`${styles.tabs}`}
                  onSelect={key => this.setState({ key })}
               >
                  <Tab eventKey="description" title={this.props.t("hotel_details")} className={`${styles.tab}`}>
                     {hotel !== null?hotel.description:""}
                  </Tab>
                  <Tab eventKey="features" title={this.props.t("features")} className={`${styles.tab}`}>
                     <div className="row">
                        <div className="col-4">
                           {facility_col1}
                        </div>
                        <div className="col-4">
                           {facility_col2}
                        </div>
                        <div className="col-4">
                           {facility_col3}
                        </div>
                     </div>
                  </Tab>
               </Tabs>
            </div>
            <Modal show={mapModal} onHide={()=> this.handleClose()}>
               <Modal.Header closeButton></Modal.Header>
               <Modal.Body>
                  <div className={`${styles.map_wrapper}`}>
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
               </Modal.Body>
            </Modal>
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
   selectedRooms: state.search.selectedRooms
});

const mapDispatchToProps = (dispatch) => ({
   updateSearchObj: (pSearchObj) => {
      dispatch(updateSearchObj(pSearchObj));
   },
   updateIsLoading: (pIsLoading) => dispatch(updateIsLoading(pIsLoading)),
   updateSelectedBoards: (pBoards) => dispatch(updateSelectedBoards(pBoards)),
   updateSelectedRooms: (pRoom) => dispatch(updateSelectedRooms(pRoom)),
   updateSelectedHotelStatic: (pHotel) => dispatch(updateSelectedHotelStatic(pHotel)),
   updatePaxKeys: (pPaxKeys) => dispatch(updatePaxKeys(pPaxKeys)),
   updatePaxDetails: (pPax) => dispatch(updatePaxDetails(pPax))
});

export default withTranslation('guest')(connect(mapStateToProps, mapDispatchToProps)(withRouter(ContentWrap)));
