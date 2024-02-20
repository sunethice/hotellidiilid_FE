import React, { Component } from 'react';
import AdminLayout from '../../components/AdminView/AdminLayout';
import Link from "next/link";

class Dashboard extends Component{

    render(){
        return (
            <AdminLayout>
                <div className="container-fluid w-100 p-5">
                     {/* style={{backgroundImage : "url(../images/dashboard_bg.jpg", height: "100vh"}}> */}
                    <div className="container ">
                        <div className="row">
                            <div  className="col-4">
                                <Link href="/Admin/TurnoverReport">
                                    <a className="btn btn-lg btn-warning text-white">Turnover Report</a>
                                </Link>
                            </div>
                            <div  className="col-4">
                                <Link href="/Admin/ReservReport">
                                    <a className="btn btn-lg btn-warning text-white">Reservation Report</a>
                                </Link>
                            </div>
                            <div  className="col-4">
                                <Link href="/Admin/ProfitMarkupReport">
                                    <a className="btn btn-lg btn-warning text-white">Profit Markup Report</a>
                                </Link>
                            </div>
                        </div>
                        <div className="row pt-3">
                            <div  className="col-4">
                                <Link href="/Admin/ProfitMarkupSetup">
                                    <a className="btn btn-lg btn-warning text-white">Profit Markup Setup</a>
                                </Link>
                            </div>
                            <div  className="col-4">
                                <Link href="/Admin/BookingCancellation">
                                    <a className="btn btn-lg btn-warning text-white">Booking Cancellation</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }
}

export default Dashboard;
