import React,{Component, useCallback} from 'react';
import { connect } from "react-redux"
import { GoogleMap, LoadScript, Marker, Circle   } from '@react-google-maps/api';
import styles from "../../styles/map.module.scss";
// import { computeDistanceBetween, LatLng } from 'spherical-geometry-js';

class Map extends Component {
   constructor(props) {
      super(props);
      this.state = {
         map: null,
      }
   }

   onLoad = (map) => {
      const bounds = new window.google.maps.LatLngBounds(); 
      map.fitBounds(bounds);
      this.setState({ map })
   }

   onUnmount = (map) => {
      this.setState({ map : null})
   }

   render() {
      return (
         <div style={{ height: '100vh', width: '100%' }}>
            {this.props.avalMeta !== undefined ? <LoadScript
               googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_KEY}
            >
               <GoogleMap
                  id="circle-example"
                  mapContainerStyle={{
                     width: '100%',
                     height: '100%'
                  }}
                  center={{ lat: parseFloat(this.props.avalMeta.avalMarkers[0].latitude), lng: parseFloat(this.props.avalMeta.avalMarkers[0].longitude) }}
                  zoom={this.props.zoomLevel}
               >
                  {this.props.avalMeta.avalMarkers.map((pMarker) => {
                     const position = {
                        lat: parseFloat(pMarker.latitude),
                        lng: parseFloat(pMarker.longitude)
                     }
                     return <Marker
                        key={pMarker.code}
                        // onLoad={() => ()}
                        position={position}
                     />
                  })}

                  <Circle
                     center={{ lat: parseFloat(this.props.avalMeta.avalMarkers[0].latitude), lng: parseFloat(this.props.avalMeta.avalMarkers[0].longitude) }}
                     options={this.props.options}
                  />
               </GoogleMap>
            </LoadScript> : <></>}
         </div>
      );
   }
}

const mapStateToProps = state => ({
   avalMeta: state.search.avalMeta
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);