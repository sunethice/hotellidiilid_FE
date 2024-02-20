import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { getCountyList, registerClient } from "../core/frontend/http-service/hb.http";
import Select from "react-select";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from "../styles/Signup.module.scss";

const SignUp = () => {
    const router = useRouter();
    const formik = useFormik({
        initialValues:{
            first_name: "",
            last_name:"",
            password:"",
            confirm_password:"",
            country:"",
            mobile_number:"",
            email:"",
            confirm_email:""
        },
        validationSchema: Yup.object({
            first_name: Yup.string()
              .required('Required'),
            last_name: Yup.string()
              .required('Required'),
            password: Yup.string()
              .required('Required'),
            confirm_password: Yup.string()
              .required('Required'),
            country:Yup.string()
              .required('Required'),
            mobile_number:Yup.string()
              .required('Required'),
            email:Yup.string()
              .required('Required'),
            confirm_email:Yup.string()
              .required('Required')
        }),
        onSubmit: values => {
            let mPostData = {
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
                country: values.country,
                mobile: values.mobile_number,
                password: values.password,
                password_confirmation: values.confirm_password
            }
            registerClient(mPostData).then((response) => {
                if (response.status == 200) {
                    router.push('/SignIn');
                    // console.log("response", response);
                }
            }).catch((error)=>{
                console.log(error);
            });
        }
    })
    const [countries, setCountries] = useState([]);

    useEffect(() => {
        listCountry();
    },[]);

    const listCountry = () => {
        let countryList = [];
        getCountyList().then((response) => {
            if (response.status == 200) {
                if (response.data.pResultObj !== null) {
                    countryList = response.data.pResultObj.map((pCountry)=>{
                        return { value: pCountry.country_code, label:pCountry.description}
                    });
                }
            }
        }).catch((error) => {
            console.log(error)
        }).finally(()=>{
            setCountries(countryList);
        })
    }

    return (
        <div className={`container d-flex justify-content-center mt-4`}>
            <div className="flex-column">
                <div className="h4 mb-4 text-center">
                    Sign Up
                </div>
                <div className="row"  style={{ display: "block", maxWidth: "500px", flex: "1 0 auto"  }}>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="form-row mb-3">
                            <div className="col">
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formik.values.first_name}
                                    className="form-control signinEntry"
                                    placeholder="First Name"
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.first_name && formik.errors.first_name ? (
                                    <div className={`${styles.invalid_feedback} d-block`}>{formik.errors.first_name}</div>
                                ) : null}
                            </div>
                            <div className="col">
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formik.values.last_name}
                                    className="form-control signinEntry"
                                    placeholder="Last Name"
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.last_name && formik.errors.last_name ? (
                                    <div className={`${styles.invalid_feedback} d-block`}>{formik.errors.last_name}</div>
                                ) : null}
                            </div>
                        </div>
                        <div className="form-row mb-3">
                            <div className="col">
                                <Select
                                    instanceId="id_country"
                                    name="country"
                                    placeholder="Country"
                                    value={countries.find((obj) => obj.value === formik.values.country)}
                                    options={countries}
                                    // styles={summarySelectStyles}
                                    onChange={selectedOption => {
                                        let event = { target : { name:'country',value: selectedOption.value}}
                                        formik.handleChange(event)
                                    }}
                                />
                                {formik.touched.country && formik.errors.country ? (
                                    <div className={`${styles.invalid_feedback} d-block`}>{formik.errors.country}</div>
                                ) : null}
                            </div>
                            <div className="col">
                                <input
                                    type="tel"
                                    name="mobile_number"
                                    value={formik.values.mobile_number}
                                    className={`form-control`}
                                    placeholder="Mobile Number"
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.mobile_number && formik.errors.mobile_number ? (
                                    <div className={`${styles.invalid_feedback} d-block`}>{formik.errors.mobile_number}</div>
                                ) : null}
                            </div>
                        </div>
                        <div className="form-row mb-3">
                            <div className="col">
                                <input
                                    type="email"
                                    name="email"
                                    value={formik.values.email}
                                    className="form-control signinEntry"
                                    placeholder="Email"
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <div className={`${styles.invalid_feedback} d-block`}>{formik.errors.email}</div>
                                ) : null}
                            </div>
                        </div>
                        <div className="form-row mb-3">
                            <div className="col">
                                <input
                                    type="email"
                                    name="confirm_email"
                                    value={formik.values.confirm_email}
                                    className="form-control"
                                    placeholder="Confirm Email"
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.confirm_email && formik.errors.confirm_email ? (
                                    <div className={`${styles.invalid_feedback} d-block`}>{formik.errors.confirm_email}</div>
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
                        <div className="form-row mb-3">
                            <div className="col">
                                <input
                                    type="password"
                                    name="confirm_password"
                                    className="form-control signinEntry"
                                    placeholder="Confirm Password"
                                    value={formik.values.confirm_password}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.confirm_password && formik.errors.confirm_password ? (
                                    <div className={`${styles.invalid_feedback} d-block`}>{formik.errors.confirm_password}</div>
                                ) : null}
                            </div>
                        </div>
                        <div className="form-row mb-3 text-center">
                            <div className="col">
                                <button
                                    type="submit"
                                    className="btn btn-success w-100"
                                >
                                    Sign up
                                </button>
                            </div>
                        </div>
                        <div className="form-row mb-3">
                            <div className="col text-center signUpWrap">
                                Have an account?&nbsp;
                                <a
                                    href="/SignIn"
                                    className="signUp"
                                    onClick={() => {
                                        this.setState({
                                            signup: false
                                        });
                                    }}
                                >
                                    Sign In
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>);
}

export default SignUp;
