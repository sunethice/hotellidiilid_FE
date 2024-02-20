import React, { Component } from "react";
import { withRouter } from 'next/router'
import styles from "../../styles/AdminSideBar.module.scss";
import Link from "next/link";

class SideBar extends Component {
    
    render() {
        return (
            <nav id="sidebar" className={`${styles.sidebar}`}>
                <div className="pt-5 pb-3">
                    <img
                        className={`${styles.sidebar_img} rounded-circle d-flex mx-auto`}
                        src="/images/default_user.png"
                        href="#d"
                    ></img>
                    <h4 className="text-center py-3" style={{color:"#2c2c2c"}}>Default User</h4>
                </div>
                <ul className="list-unstyled">
                    <li className={`${styles.sidebar_link_wrap}`}>
                        <Link href="/Admin/Dashboard" className={`${styles.sidebar_links}`}>
                            <a className={`px-3 ${styles.sidebar_links} ${this.props.router.pathname == "/Admin/Dashboard" ? styles.sidebar_links_active : ""}`}>Home</a>
                        </Link>
                    </li>
                    <li className={`${styles.sidebar_link_wrap}`}>
                        <Link href="/Admin/ProfitMarkupSetup" className={`${styles.sidebar_links}`}>
                            <a className={`px-3 ${styles.sidebar_links} ${this.props.router.pathname == "/Admin/ProfitMarkupSetup" ? styles.sidebar_links_active : ""}`}>Profit mark-up setup</a>
                        </Link>
                    </li>
                    <li className={`${styles.sidebar_link_wrap}`}>
                        <Link href="/Admin/TurnoverReport" className={`${styles.sidebar_links}`}>
                            <a className={`px-3 ${styles.sidebar_links} ${this.props.router.pathname == "/Admin/TurnoverReport" ? styles.sidebar_links_active : ""}`}>Turnover Report</a>
                        </Link>
                    </li>
                    <li className={`${styles.sidebar_link_wrap}`}>
                        <Link href="/Admin/ReservReport"className={`${styles.sidebar_links}`}>
                            <a className={`px-3 ${styles.sidebar_links} ${this.props.router.pathname == "/Admin/ReservReport" ? styles.sidebar_links_active : ""}`}>Reservation Report</a>
                        </Link>
                    </li>
                    <li className={`${styles.sidebar_link_wrap}`}>
                        <Link href="/Admin/ProfitMarkupReport" className={`${styles.sidebar_links}`}>
                            <a className={`px-3 ${styles.sidebar_links} ${this.props.router.pathname == "/Admin/ProfitMarkupReport" ? styles.sidebar_links_active : ""}`}>Profit mark-up Report</a>
                        </Link>
                    </li>
                    <li className={`${styles.sidebar_link_wrap}`}>
                        <Link href="/Admin/BookingCancellation" className={`${styles.sidebar_links}`}>
                            <a className={`px-3 ${styles.sidebar_links} ${this.props.router.pathname == "/Admin/BookingCancellation" ? styles.sidebar_links_active : ""}`}>Booking Cancellation</a>
                        </Link>
                    </li>
                </ul>
            </nav>
        );
    }
}
export default withRouter(SideBar);
