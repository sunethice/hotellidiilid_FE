import React, { Component } from "react";
import toast from '../Toast';
import TableRow from "./TableRow";
import { addDaysHelper, formatDateHelper4, getDay } from "../../components/Data/helper";
import { cancelBooking } from '../../core/frontend/http-service/hb.http'; 
import styles from "../../styles/cancelpolicy.module.scss";
import commonStyles from "../../styles/Common.module.scss";
import tbl_styles from '../../styles/table.module.scss';


class CancellationPolicy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            booking : this.props.booking
        };
    }

    componentDidMount() {}

    onCancelReservation(){
        const { booking } = this.state;
        cancelBooking(booking.reference).then((response) => {
            if(response.status == 200){
                toast({type:'success', message:response.data.pMessage}); 
            }
        }).catch((pError) => {
            toast({type:'error',message:pError});
        })
    }

    render() {
        const { booking } = this.state;
        let intPolBookingAmt = 0;
        let intPolSupplierAmt = 0;
        let supPolBookingAmt = 0;
        let supPolSupplierAmt = 0;
        return (
            <>
                <div className={`container py-3 px-5 border border-light rounded bg-white ${styles.cancellation_typography} ${commonStyles.font_size_13}`}>
                    <div className="row">
                        <div className="col-12 d-flex justify-content-center">
                            <div className={`${commonStyles.font_size_22}`}>Cancellation Policy</div>
                        </div>
                        <hr className={`${styles.hr_line}`}></hr>
                    </div>
                    <div className="row text-left pl-2">
                        <div className="col-3">Reservation Number</div>
                        <div className="col-9">: {booking.reference}</div>
                    </div>
                    <div className="row text-left pl-2">
                        <div className="col-3">User Type</div>
                        <div className="col-9">: Admin</div>
                    </div>
                    <div className="row text-left pl-2 py-3">
                        <div className={`col-3 ${commonStyles.font_size_16}`}>Hotel</div>
                    </div>
                    <div className="row text-left pl-2">
                        <div className="col-3">Supplier Name</div>
                        <div className="col-9">: {booking.hotel.supplier.name}</div>
                    </div>
                    <div className="row text-left pl-2">
                        <div className="col-3">Supplier Confirmation ID</div>
                        <div className="col-9">: {booking.hotel.supplier.vatNumber}</div>
                    </div>
                    <div className="row text-left pl-2">
                        <div className="col-3">Hotel Name</div>
                        <div className="col-9">: {booking.hotel.name}</div>
                    </div>
                    <div className="row text-left pl-2">
                        <div className="col-3">Reservation Date</div>
                        <div className="col-9">: {formatDateHelper4(booking.created_at)}</div>
                    </div>
                    <div className="row text-left pl-2">
                        <div className="col-3">Guest Name</div>
                        <div className="col-9">: {booking.holder_name} {booking.holder_surname}</div>
                    </div>
                    <div className="row text-left pl-2">
                        <div className="col-3">Check-in</div>
                        <div className="col-9">: {booking.check_in}</div>
                    </div>
                    <div className="row text-left pl-2">
                        <div className="col-3">Check-out</div>
                        <div className="col-9">: {booking.check_out}</div>
                    </div>
                    <div className="row pt-3">
                        <table className={`table table-sm m-3`}>
                            <thead>
                                <tr className={`${tbl_styles.tble_head}`}>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`} colSpan={4}>Total Booking Cost</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`} colSpan={4}>Cancellation Cost Summary</td>
                                </tr>
                            </thead>
                            <tbody className={`${tbl_styles.tbl_gray_border}`}>
                                <tr> 
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`} colSpan={2}>Sell Rate</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`} colSpan={2}>Net Rate</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`} colSpan={2}>Customer needs to pay to us</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`} colSpan={2}>We need to pay to supplier</td>
                                </tr>
                                <tr>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.td_gray_bg} ${tbl_styles.tbl_gray_border}`}>Booking Currency</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.td_gray_bg} ${tbl_styles.tbl_gray_border}`}>Supplier Currency</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.td_gray_bg} ${tbl_styles.tbl_gray_border}`}>Booking Currency</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.td_gray_bg} ${tbl_styles.tbl_gray_border}`}>Supplier Currency</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.td_gray_bg} ${tbl_styles.tbl_gray_border}`}>Booking Currency</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.td_gray_bg} ${tbl_styles.tbl_gray_border}`}>Supplier Currency</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.td_gray_bg} ${tbl_styles.tbl_gray_border}`}>Booking Currency</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.td_gray_bg} ${tbl_styles.tbl_gray_border}`}>Supplier Currency</td>
                                </tr>
                                <tr>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`}>60</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`}>50</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`}>60</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`}>50</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`}>{booking.net_with_markup}</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`}>{booking.net_with_markup}</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`}>{booking.total_net}</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`}>{booking.total_net}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="row pt-3">
                        <table className={`table table-sm m-3 ${tbl_styles.tbl_gray_border}`}>
                            <thead >
                                <tr className={`${tbl_styles.tbl_gray_border}`}>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`} rowSpan={2}>Room</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`} rowSpan={2}>Type</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`} rowSpan={2}>Meal</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`} colSpan={3}>Internal Policies</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`} colSpan={3}>Supplier Policies</td>
                                </tr>
                                <tr>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`}>Cut-off date</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`}>Amount(Booking currency)</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`}>Amount(Supplier currency)</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`}>Cut-off date</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`}>Amount(Booking currency)</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`}>Amount(Supplier currency)</td>
                                </tr>
                            </thead>
                            <tbody className={`${tbl_styles.tbl_gray_border}`}>
                                {booking.hotel.rooms &&
                                    booking.hotel.rooms.length != 0 ? (
                                        React.Children.toArray(booking.hotel.rooms.map(item => {
                                            intPolBookingAmt = intPolBookingAmt + parseFloat(item.rates[0].net);
                                            intPolSupplierAmt = intPolSupplierAmt + parseFloat(item.rates[0].net);
                                            supPolBookingAmt = supPolBookingAmt + parseFloat(item.rates[0].net);
                                            supPolSupplierAmt = supPolSupplierAmt + parseFloat(item.rates[0].net);
                                            return (
                                                <tr key={item.id}>
                                                    <td className="text-center">{item.id}</td>
                                                    <td className="text-center">{item.rates[0].boardName}</td>
                                                    <td className="text-center">{item.rates[0].boardName}</td>
                                                    <td className="text-center bg-primary">{formatDateHelper4(item.rates[0].cancellationPolicies[0].from)}</td>
                                                    <td className="text-center bg-primary">{item.rates[0].net}</td>
                                                    <td className="text-center bg-primary">{item.rates[0].net}</td>
                                                    <td className="text-center bg-primary">{formatDateHelper4(item.rates[0].cancellationPolicies[0].from)}</td>
                                                    <td className="text-center bg-primary">{item.rates[0].net}</td>
                                                    <td className="text-center bg-primary">{item.rates[0].net}</td>
                                                </tr>
                                            )
                                    }))) : (
                                        <tr>
                                            <td className="text-center" colSpan="9">
                                                No data found
                                            </td>
                                        </tr>
                                    )}
                                <tr>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.td_gray_bg} ${tbl_styles.tbl_gray_border}`} colSpan={3}>Applicable total of</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.td_bold_txt} ${tbl_styles.tbl_gray_border}`}>Internal Policies</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`}>{intPolBookingAmt}</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`}>{intPolSupplierAmt}</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.td_bold_txt} ${tbl_styles.tbl_gray_border}`}>Supplier Policies</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`}>{supPolBookingAmt}</td>
                                    <td className={`${tbl_styles.tble_data} ${tbl_styles.tbl_gray_border}`}>{supPolSupplierAmt}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="row">
                        <div className="col d-flex justify-content-end">
                            <button className={`btn btn-primary ${commonStyles.font_size_13}`} onClick={()=> this.onCancelReservation()}>
                                Cancel Reservation
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default CancellationPolicy;
