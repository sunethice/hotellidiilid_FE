import React, { Component } from "react";
import AdminLayout from "../../components/AdminView/AdminLayout";
import { addDaysHelper } from "../../components/Data/helper";
import { Formik } from "formik";
import * as Yup from "yup";
import toast from '../../components/Toast';
import { connect } from "react-redux"
import styles from '../../styles/Common.module.scss';
import { getBookingDetails } from "../../core/frontend/http-service/hb.http";
import CancellationPolicy from "../../components/AdminView/CancellationPolicy";

class BookingCancellation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            initialValues : {
                referenceNo: ""
            },
            SearchSchema: Yup.object().shape({
                referenceNo: Yup.string().required('Reference number is required')
            }),
            bookingDetails: {}
        };
    }

    componentDidMount() {}
    
    onSearchClick(pValues){

        getBookingDetails(pValues.referenceNo).then((response) => {
            if (response.status == 200) {
                this.setState({bookingDetails:response.data.pResultObj});
                toast({type:'success', message:response.data.pMessage});  
            }
        }).catch((pError) => {
            toast({type:'error',message:pError});
        });
    }

    render() {
        const {initialValues, SearchSchema, bookingDetails} = this.state;
        return (
            <Formik
                initialValues={initialValues}
                validationSchema={SearchSchema}
                onSubmit={(values) => this.onSearchClick(values)}
            >
            {(formik) => {
                const {
                    values,
                    handleChange,
                    handleSubmit,
                    errors,
                    touched,
                    handleBlur,
                    isValid,
                    setFieldValue,
                    setValues,
                    dirty
                } = formik;
            return (
                <AdminLayout headerTitle={"Booking Cancellation"}>
                    <div className={`container p-3 mb-2`} style={{backgroundColor : "#444"}}>
                        <div className={`row d-flex justify-content-center pb-3`}>
                            <div className="">
                                <label className={`${styles.font_size_13} text-white`}>Search by reference number</label>    
                            </div>    
                        </div>
                        <form className={`${styles.font_size_13}`} onSubmit={formik.handleSubmit}>
                            <div className={`row d-flex justify-content-center pb-3`}>
                                <div className="mr-2">
                                    <input 
                                        type="text" 
                                        className={`form-control w-100 p-3 ${styles.font_size_13}`} 
                                        placeholder="Reference Number"
                                        value={values.referenceNo}
                                        onChange={(event)=>{
                                            setFieldValue('referenceNo',event.target.value);
                                        }}
                                    ></input>
                                    <div className={`${styles.invalid_feedback} d-block`}>{errors.markup && touched.markup ? (
                                        <div>{errors.markup}</div>
                                        ) : null}</div>
                                </div>
                                <div className=""> 
                                    <button type="submit" className={`btn btn-primary ${styles.font_size_13}`}>
                                        Search
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    {Object.keys(bookingDetails).length == 0 || <CancellationPolicy booking={bookingDetails}></CancellationPolicy>}
                </AdminLayout>);
            }}
        </Formik>);
    }
}

const mapStateToProps = state => ({
    reservationResults: state.reports.reservationResults
});
 
const mapDispatchToProps = (dispatch) => ({
    onGetReservationReport: (pList) => dispatch(updateReservationResultList(pList))
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingCancellation);