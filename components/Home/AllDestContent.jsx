import { object } from 'prop-types';
import React, {Component} from 'react';
import { getCountyList, getDestByCountry, getZonesByDestination, getHotelsByZone } from  "../../core/frontend/http-service/hb.http";

class AllDestContent extends Component{
    constructor(props){
        super(props);
        this.state = {
            allCountries : [],
            destinations: [],
            zones:[],
            hotels:[],
            activeCountry: null,
            activeDestination: null,
            activeZone: null
        }
    }

    componentDidMount(){
        getCountyList().then((response) => {
            if (response.status == 200) {
               if (response.data.pResultObj !== null) {
                  let countryList = response.data.pResultObj.map((country)=>{
                     return { value: country.country_code, label:country.description}
                  });
                  this.setState({ allCountries: countryList });
               }
            }
         }).catch((error) => {
            console.log(error);
         });
    }

    onCountryClick(pCountryCode){
        this.setState({activeCountry:pCountryCode});
        getDestByCountry(pCountryCode).then((response)=>{
            if (response.data.pResultObj !== null) {
                let destList = response.data.pResultObj.map((destination)=>{
                    console.log("destination",destination)
                   return { value: destination.destination_code, label:destination.name}
                });
                this.setState({ destinations: destList, zones:[],  hotels:[] });
             }
        }).catch((error)=>{
            console.log(error)
        });
    }

    onDestClick(pDestCode){
        this.setState({activeDestination:pDestCode});
        getZonesByDestination(pDestCode).then((response)=>{
            if (response.data.pResultObj !== null) {
                let zoneList = response.data.pResultObj.map((zone)=>{
                   return { value: zone.zone_code, label:zone.name}
                });
                this.setState({ zones: zoneList });
             }
        }).catch((error)=>{
            console.log(error)
        });
    }

    onZoneClick(pZoneCode){
        const {activeCountry, activeDestination} = this.state;
        this.setState({activeZone:pZoneCode});
        getHotelsByZone(activeCountry,activeDestination,pZoneCode).then((response)=>{
            if (response.data.pResultObj !== null) {
                console.log("type ", typeof response.data.pResultObj);
                if(typeof response.data.pResultObj === 'object'){
                    console.log("yes object");
                    response.data.pResultObj = Object.values(response.data.pResultObj);
                }console.log("response",response.data.pResultObj);
                let hotelList = response.data.pResultObj.map((hotel)=>{
                   return { value: hotel.code, label:hotel.name.content}
                });
                console.log("hotelList",hotelList);
                this.setState({ hotels: hotelList });
             }
        }).catch((error)=>{
            console.log(error)
        });
    }

    render(){

        const {allCountries,destinations, zones, hotels, activeCountry,activeDestination, activeZone} = this.state;
        return (
            <div className="container pt-3">
                <div className="row pb-3 text-center">
                    <div className="col-lg-3">Countries</div>
                    <div className="col-lg-3">Destinations</div>
                    <div className="col-lg-3">Zones</div>
                    <div className="col-lg-3">Hotels</div>
                </div>
                <div className="row">
                    <div className="col-lg-3">
                        <div className="list-group" id="list-tab" role="tablist">
                            {
                                allCountries.map((val,inx)=>{
                                    return (
                                        <a className={"list-group-item list-group-item-action " + (val.value === activeCountry ? " active" : "")} key={val.value} onClick={()=>this.onCountryClick(val.value)}>
                                            { val.label }
                                        </a>
                                    );
                                })
                            }
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="list-group" id="list-tab" role="tablist">
                            {
                                destinations.map((val,inx)=>{
                                    if(val.label != "")
                                        return (
                                            <a className={"list-group-item list-group-item-action " + (val.value === activeDestination ? " active" : "")} key={val.value} onClick={()=>this.onDestClick(val.value)}>
                                                {val.label}
                                            </a>);
                                })
                            }
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="list-group" id="list-tab" role="tablist">
                            {
                                zones.map((val,inx)=>{
                                    if(val.label != "")
                                        return (
                                            <a className={"list-group-item list-group-item-action " + (val.value === activeZone ? " active" : "")} key={val.value} onClick={()=>this.onZoneClick(val.value)}>
                                                {val.label}
                                            </a>);
                                })
                            }
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="list-group" id="list-tab" role="tablist">
                            {
                                hotels.map((val,inx)=>{
                                    if(val.label != "")
                                        return (
                                            <a className={"list-group-item list-group-item-action " + (val.value === activeZone ? " active" : "")} key={val.value}>
                                                {val.label}
                                            </a>);
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default AllDestContent;