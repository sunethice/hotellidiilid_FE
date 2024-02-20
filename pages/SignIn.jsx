import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { getPWDGrantToken } from "../core/frontend/http-service/api.http";
import Select from "react-select";
import { useFormik  } from "formik";
import * as Yup from 'yup';
import styles from "../styles/Signin.module.scss";
import Cookies from "js-cookie";
import { getDuration, getTwelveHourDateTime } from "../components/Data/helper";


const SignIn = () => {
    const router = useRouter();
    const formik = useFormik({
        initialValues:{
            username: "",
            password:""
        },
        validationSchema: Yup.object({
            username: Yup.string()
              .required('Required'),
            password: Yup.string()
              .required('Required'),
        }),
        onSubmit: values => {
            let mPostData = {
                username: values.username,
                password: values.password,
                scope: "admin"
            }
            console.log("mPostData",mPostData)
            getPWDGrantToken(mPostData).then((response) => {
                console.log('response', response);
                if (response.status == 200) {
                    // var mTwelveHourDateTime = getTwelveHourDateTime(new Date());
                    // var durationInMinutes = getDuration(mTwelveHourDateTime,new Date(response.data.pResultObj.expires_at));
                    // Cookies.set('loggedin', response.data.pResultObj.access_token, {
                    //     expires: durationInMinutes
                    // });
                    router.push('/Admin');
                }
            }).catch((error)=>{
                console.log(error);
            });
        }
    })

    return (
        <div className={`container d-flex justify-content-center mt-4`}>
            <div className="flex-column">
                <div className="h4 mb-4 text-center">
                    Sign In
                </div>
                <div  className="row"  style={{ display: "block", width: "423px", maxWidth: "500px" }}>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-row mb-3">
                            <div className="col">
                                <input
                                    type="text"
                                    name="username"
                                    value={formik.values.username}
                                    className="form-control signinEntry"
                                    placeholder="Username"
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.username && formik.errors.username ? (
                                    <div className={`${styles.invalid_feedback} d-block`}>{formik.errors.username}</div>
                                ) : null}
                            </div>
                        </div>
                        <div className="form-row mb-3">
                            <div className="col">
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control signinEntry"
                                    placeholder="Password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.password && formik.errors.password ? (
                                    <div className={`${styles.invalid_feedback} d-block`}>{formik.errors.password}</div>
                                ) : null}
                            </div>
                        </div>
                        <div className="form-row mb-3 text-center">
                            <div className="col">
                                <button
                                    type="submit"
                                    className="btn btn-success w-100"
                                >
                                    Sign in
                                </button>
                            </div>
                        </div>
                        {/* <div className="form-row mb-3">
                            <div className={`col text-left ${styles.signInWrap}`}>
                                Don't have an account?&nbsp;
                                <a
                                    href="/SignUp"
                                    className=""
                                >
                                    Sign Up
                                </a>
                            </div>
                            <div className={`col text-right ${styles.signInWrap}`}>
                                <a
                                    href="/ForgetPassword"
                                    className=""
                                >
                                    Forgot Password
                                </a>
                            </div>
                        </div> */}
                    </form>
                </div>
            </div>
        </div>);
}

export default SignIn;
