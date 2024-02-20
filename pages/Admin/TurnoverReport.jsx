import React, { Component } from "react";
import AdminLayout from "../../components/AdminView/AdminLayout";
import DatePicker from "react-datepicker";
import TableRow from "../../components/AdminView/TableRow";
import { addDaysHelper } from "../../components/Data/helper";
import { Formik } from "formik";
import * as Yup from "yup";
import toast from '../../components/Toast';
import { getTurnoverReport } from '../../core/frontend/http-service/hb.http'; 
import { connect } from "react-redux"
import { updateTurnoverResultList } from '../../redux/actions/reportActions';
import Pagination from "react-js-pagination";
import "react-datepicker/dist/react-datepicker.css";
import tbl_styles from '../../styles/table.module.scss';
import styles from '../../styles/Turnover.module.scss';
import paginationStyles from "../../styles/pagination.module.scss";

class TurnoverReport extends Component {

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
                //    .min(new Date(), 'Date-from must be later than today')
                   .required("Date-from is required"),
                dateTo: Yup.date()
                   .nullable()
                   .default(null)
                   .min(Yup.ref('dateFrom'), 'Date-to must be later date-from date')
                   .required("Date-to is required"),
            }),
            activePage: 1,
            totalItemCount : 0,
            total_sales_value : 0,
            total_cost_of_sales: 0,
            total_profit: 0,
            total_profit_margin: 0
        };
    }

    componentDidMount() { }

    componentWillUnmount() {
        this.props.onGetTurnoverReport([]);
    }

    onSearchClick(pValues){
        const { activePage } = this.state;
        const pData = {
            "start":pValues.dateFrom,
            "end":pValues.dateTo
        }
        getTurnoverReport(pData,activePage).then((response)=>{
            if(response.status == 200){
                if (response.data.pResultObj != null) {
                    this.props.onGetTurnoverReport(response.data.pResultObj.data);
                    this.setState({ 
                        totalItemCount : response.data.pResultObj.total,
                        total_sales_value: response.data.pResultObj.total_sales_value.toFixed(2),
                        total_cost_of_sales: response.data.pResultObj.total_cost_of_sales.toFixed(2),
                        total_profit : (response.data.pResultObj.total_sales_value - response.data.pResultObj.total_cost_of_sales).toFixed(2),
                        total_profit_margin : ((response.data.pResultObj.total_sales_value - response.data.pResultObj.total_cost_of_sales) / response.data.pResultObj.total_cost_of_sales * 100).toFixed(2)
                    });
                    toast({type:'success',message:response.data.pMessage});
                }
                else {
                    toast({type:'warning',message:"Results not found for the given criteria."});
                    this.props.onGetTurnoverReport([]);
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
        const {
            initialValues, minDateFrom, minDateTo, SearchSchema, activePage, 
            totalItemCount, total_sales_value, total_cost_of_sales, total_profit, total_profit_margin
        } = this.state;
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
                    <AdminLayout headerTitle={"Turnover Report"}>
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
                                            // minDate={minDateFrom}
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
                                            <td>Cost of Sales</td>
                                            <td>Profit</td>
                                            <td>Profit Margin</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.turnoverResults &&
                                        this.props.turnoverResults.length != 0 ? (
                                            this.props.turnoverResults.map(item => {
                                                const mProfit = item.net_with_markup - item.total_net;
                                                const mProfitMargin = (mProfit / item.total_net * 100).toFixed(2);
                                                return (
                                                    <TableRow
                                                        key={item._id}
                                                        tableRow={{
                                                            "Reservation_no":item.reference,
                                                            "Reservation_date":item.check_in,
                                                            "Sales_value":item.net_with_markup,
                                                            "Cost_of_sales":item.total_net,
                                                            "Profit":mProfit.toFixed(2), 
                                                            "Profit_margin":mProfitMargin
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
                            <br/>
                            <div className={`row h4`}>
                                Profit table
                            </div>
                            <div className={`row`}>
                                <table className={`table table-sm ${tbl_styles.tbl}`}>
                                    <thead>
                                        <tr className={`${tbl_styles.tble_head}`}>
                                            <td>Sales Value</td>
                                            <td>Cost of Sales</td>
                                            <td>Profit</td>
                                            <td>Profit Margin</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {total_sales_value != 0 && total_cost_of_sales != 0 ? (
                                            <TableRow
                                                key={total_sales_value}
                                                tableRow={{
                                                    "Sales_value":total_sales_value,
                                                    "Cost_of_sales":total_cost_of_sales,
                                                    "Profit":total_profit, 
                                                    "Profit_margin":total_profit_margin
                                                }}
                                            ></TableRow>
                                        ) : (
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
    turnoverResults: state.reports.turnoverResults
});
 
const mapDispatchToProps = (dispatch) => ({
    onGetTurnoverReport: (pList) => dispatch(updateTurnoverResultList(pList))
});

export default connect(mapStateToProps, mapDispatchToProps)(TurnoverReport);