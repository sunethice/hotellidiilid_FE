import React,{useState} from "react";
import { Navbar, Nav } from "react-bootstrap";
import Header from "./Header";
import SideBar from "./SideBar";
import styles from "../../styles/Admin.module.scss";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const AdminLayout = ({ children, headerTitle }) => {
    const router = useRouter();
    var token = Cookies.get('access_token');
    const decoded = jwt_decode(token);
    if(!decoded.scopes.includes('admin'))
        router.push('/SignIn');
    return (
        <>
        {decoded.scopes.includes('admin')?
            <div className={`${styles.wrapper}`}>
                <SideBar></SideBar>
                <div className={`${styles.contentWrap}`}>
                    <div>
                        <Header hdTitle={headerTitle}></Header>
                    </div>
                    <div id="dashboard_content" className={`${styles.content}`}>
                        {children}
                    </div>
                </div>
            </div>:<></>
        }
        </>
    );
};

export default AdminLayout;
