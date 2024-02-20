import React, { Component } from "react";
import AdminLayout from "../../components/AdminView/AdminLayout";
import DatePicker from "react-datepicker";
import TableRow from "../../components/AdminView/TableRow";
import { addDaysHelper } from "../../components/Data/helper";
import { Formik } from "formik";
import * as Yup from "yup";
import toast from '../../components/Toast';
import { getReservationReport } from '../../core/frontend/http-service/hb.http'; 
import { connect } from "react-redux"
import { updateReservationResultList } from '../../redux/actions/reportActions';
import Pagination from "react-js-pagination";
import "react-datepicker/dist/react-datepicker.css";
import tbl_styles from '../../styles/table.module.scss';
import styles from '../../styles/Turnover.module.scss';
import paginationStyles from "../../styles/pagination.module.scss";

class ReservReport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            initialValues : {
                dateFrom: null,
                dateTo: null
            },
            minDateFrom: new Date(),
            minDateTo: addDaysHelper(1),
            SearchSchema: Yup.object().shape({
                dateFrom: Yup.date()
                   .nullable()
                   .default(null)
                   .min(new Date(), 'Date-from must be later than today')
                   .required("Date-from is required"),
                dateTo: Yup.date()
                   .nullable()
                   .default(null)
                   .min(Yup.ref('dateFrom'), 'Date-to must be later date-from date')
                   .required("Date-to is required"),
            }),
            activePage: 1,
            totalItemCount : 0
        };
    }

    componentDidMount() { }

    componentWillUnmount() {
        this.props.onGetReservationReport([]);
    }

    onSearchClick(pValues){
        const { activePage } = this.state;
        const pData = {
            "start":pValues.dateFrom,
            "end":pValues.dateTo
        }
        getReservationReport(pData,activePage).then((response)=>{
            if(response.status == 200){
                if (response.data.pResultObj != null) {
                    this.props.onGetReservationReport(response.data.pResultObj.data);
                    this.setState({ totalItemCount : response.data.pResultObj.total});
                    toast({type:'success',message:response.data.pMessage});
                }
                else {
                    toast({type:'warning',message:"Results not found for the given criteria."});
                    this.props.onGetReservationReport([]);
                }
            }
        }).catch((pError)=>{
            toast({type:'error',message:"Could not process request."});
        });
    }

    handlePageChange(pPageNumber, pValues) {
        this.setState({ activePage: pPageNumber }, () => { this.onSearchClick(pValues) });
    }
    
    render() {
        const {initialValues, minDateFrom, minDateTo, SearchSchema, activePage, totalItemCount} = this.state;
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
                    <AdminLayout headerTitle={"Reservation Report"}>
                        <form className={`${styles.font_size_13}`} onSubmit={formik.handleSubmit}>
                            <div className={`container p-3 mb-2`} style={{backgroundColor : "#444"}}>
                                <div className={`row d-flex justify-content-center`}>
                                    <div className={`col-3`}>
                                        <DatePicker
                                            name="dateFrom"
                                            placeholderText="Date From"
                                            className={`form-control ${styles.form_control}`}
                                            dateFormat="dd/MM/yyyy"
                                            value={values.dateFrom}
                                            onBlur={handleBlur}
                                            selected={values.dateFrom}
                                            minDate={minDateFrom}
                                            autoComplete='off'
                                            onChange={date => {
                                                setFieldValue('dateFrom', date);;
                                                let toDt = addDaysHelper(1,date)
                                                setFieldValue('dateTo', toDt);
                                                //  onCheckinUpdate(date);
                                                //  onCheckoutUpdate(checkoutDt);
                                            }}
                                        />
                                    </div>
                                    <div className={`col-3`}>
                                        <DatePicker
                                            name="dateTo"
                                            placeholderText="Date To"
                                            className={`form-control ${styles.form_control}`}
                                            dateFormat="dd/MM/yyyy"
                                            value={values.dateTo}
                                            onBlur={handleBlur}
                                            selected={values.dateTo}
                                            minDate={values.dateFrom !== null?addDaysHelper(1,values.dateFrom): minDateTo}
                                            autoComplete='off'
                                            onChange={date => {
                                                setFieldValue('dateTo', date);
                                            }}
                                        />
                                    </div>
                                    <div className={`col-2`}>
                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100"
                                        >Search</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className={`container p-3`}>
                            <div className="row d-flex justify-content-right">
                            <Pagination
                                linkClass={`${paginationStyles.page_link}`}
                                activeClass={`${paginationStyles.active_page}`}
                                activePage={activePage}
                                itemsCountPerPage={10}
                                totalItemsCount={totalItemCount}
                                pageRangeDisplayed={3}
                                onChange={(pageNumber) => this.handlePageChange(pageNumber, values)}
                            />
                            </div>
                            <div className={`row`}>
                                <table className={`table table-sm ${tbl_styles.tbl}`}>
                                    <thead>
                                        <tr className={`${tbl_styles.tble_head}`}>
                                            <td>Reservation No.</td>
                                            <td>Reservation Date</td>
                                            <td>Sales Value</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.reservationResults &&
                                        this.props.reservationResults.length != 0 ? (
                                            this.props.reservationResults.map(item => {
                                                return (
                                                    <TableRow
                                                        key={item._id}
                                                        tableRow={{
                                                            "Reservation_no":item.reference,
                                                            "Reservation_date":item.check_in,
                                                            "Sales_value":item.net_with_markup
                                                        }}
                                                    ></TableRow>
                                                )
                                        })) : (
                                            <tr>
                                                <td className="text-center" colSpan="9">
                                                    No data found
                                                </td>
                                            </tr>
                                          )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ReservReport);