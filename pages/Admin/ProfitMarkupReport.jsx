import React, { Component } from "react";
import AdminLayout from "../../components/AdminView/AdminLayout";
import DatePicker from "react-datepicker";
import TableRow from "../../components/AdminView/TableRow";
import Select from "react-select";
import { addDaysHelper } from "../../components/Data/helper";
import toast from '../../components/Toast';
import { Formik } from "formik";
import * as Yup from "yup";
import { getMarkupReport, getCountyList, getDestByCountry } from '../../core/frontend/http-service/hb.http'; 
import { connect } from "react-redux";
import { updateMarkupResultList } from '../../redux/actions/reportActions';
import Pagination from "react-js-pagination";
import "react-datepicker/dist/react-datepicker.css";
import styles from '../../styles/ProfitMarkup.module.scss';
import tbl_styles from '../../styles/table.module.scss';
import { markupSelectStyles } from "../../styles/SelectStyles";
import paginationStyles from "../../styles/pagination.module.scss";

class ProfitMarkupReport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            initialValues : {
                country: "",
                city:"",
                dateFrom: null,
                dateTo: null
            },
            minDateFrom: new Date(),
            minDateTo: addDaysHelper(1),
            SearchSchema: Yup.object().shape({
                country: Yup.string().required('Country is required'),
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
            markupOpt: 'Country',
            countries: [],
            destinations: []
        };
    }

    componentDidMount() { 
        this.listCountry();
    }

    componentWillUnmount() {
        this.props.onGetMarkupReport([]);
    }

    onSearchClick(pValues){
        const { activePage } = this.state;
        const pData = {
            "country":pValues.country,
            "city":pValues.city,
            "start_date":pValues.dateFrom,
            "end_date":pValues.dateTo
        }
        getMarkupReport(pData,activePage).then((response)=>{
            if(response.status == 200){
                if (response.data.pResultObj != null) {
                    this.props.onGetMarkupReport(response.data.pResultObj.data);
                    toast({type:'success',message:response.data.pMessage});
                    this.setState({ totalItemCount : response.data.pResultObj.total});
                }
                else {
                    toast({type:'warning',message:"Results not found for the given criteria."});
                    this.props.onGetMarkupReport([]);
                }
            }
        }).catch((pError)=>{
            toast({type:'error',message:"Could not process request."});
            console.log("pError", pError);
        });
    }

    handlePageChange(pPageNumber, pValues) {
        this.setState({ activePage: pPageNumber }, () => { this.onSearchClick(pValues) });
    }

    onMarkupOptChange(event){
        this.setState({ markupOpt : event.target.value });
    }

    listCountry() {
        getCountyList().then((response) => {
           if (response.status == 200) {
              if (response.data.pResultObj !== null) {
                 let countryList = response.data.pResultObj.map((country)=>{
                    return { value: country.country_code, label:country.description}
                 });
                 this.setState({ countries: countryList });
              }
           }
        }).catch((error) => {
           console.log(error)
        });
    }

    onCountrySelect(pCountryCode){
        const {markupOpt} = this.state;
        if(markupOpt == "City"){
            getDestByCountry(pCountryCode).then((response) => {
                if (response.status == 200) {
                    if (response.data.pResultObj !== null) {
                        let destinationList = response.data.pResultObj.map((destination)=>{
                            if(destination.name !== "" || destination.name !== "ul")
                                return { value: destination.destination_code, label:destination.name}
                        });
                        this.setState({ destinations: destinationList });
                    }
                }
            }).catch((error) => {
                console.log(error)
            });
        }
    }
    
    render() {
        const {initialValues, minDateFrom, minDateTo, SearchSchema, activePage, totalItemCount, countries, destinations, markupOpt} = this.state;
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
                    <AdminLayout headerTitle={"Profit Markup Report"}>
                        <div className={`container p-3 mb-2`} style={{backgroundColor : "#444"}}>
                            <div className={`row d-flex justify-content-center pb-3`}>
                                <div className={`px-3`}>
                                    Mark-up option:
                                </div>
                                <div onChange={(event) => this.onMarkupOptChange(event)}>
                                    <input type="radio" value="Country" name="markup" className={`ml-4 mr-1`} defaultChecked={true}/> Country
                                    <input type="radio" value="City" name="markup"className={`ml-4 mr-1`}/> City
                                </div>
                            </div>
                            <form className={`${styles.font_size_13}`} onSubmit={formik.handleSubmit}>
                                <div className={`row d-flex justify-content-center pb-3`}>
                                    <div className={`col-3`}>
                                        <Select
                                            instanceId="id_titles"
                                            name="country"
                                            placeholder="Country"
                                            value={countries.find((obj) => obj.value === values.country)}
                                            options={countries}
                                            styles={markupSelectStyles}
                                            onChange={(obj) =>
                                                {
                                                    setFieldValue('country', obj.value);
                                                    this.onCountrySelect(obj.value);
                                                }
                                            }
                                        />
                                        <div className={`${styles.invalid_feedback} d-block`}>{errors.country && touched.country ? (
                                        <div>{errors.country}</div>
                                        ) : null}</div>
                                    </div>
                                   <div className={`col-3`}>
                                        {markupOpt === 'City' ? (
                                            <>
                                                <Select
                                                    instanceId="id_titles"
                                                    name="city"
                                                    placeholder="City"
                                                    value={destinations.find((obj) => {
                                                        if(obj !== undefined)
                                                            return obj.value === values.city
                                                    })}
                                                    options={destinations}
                                                    styles={markupSelectStyles}
                                                    onChange={(obj) =>
                                                        {
                                                            setFieldValue('city', obj.value);
                                                        }
                                                    }
                                                />
                                                <div className={`${styles.invalid_feedback} d-block`}>{errors.country && touched.country ? (
                                                <div>{errors.country}</div>
                                                ) : null}</div>
                                            </>) : (
                                            <></>
                                          )}
                                    </div>
                                    <div className={`col-2`}></div>
                                </div> 
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
                                            // minDate={values.dateFrom !== null?addDaysHelper(1,values.dateFrom): minDateTo}
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
                            </form>
                        </div>
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
                                            <td>Country</td>
                                            <td>City</td>
                                            <td>Stay Date</td>
                                            <td>Profit Markup %</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.markupResults &&
                                        this.props.markupResults.length != 0 ? (
                                            this.props.markupResults.map(item => {
                                                return (
                                                    <TableRow
                                                        key={item._id}
                                                        tableRow={{
                                                            "country":item.location.description,
                                                            "city":item.destination !== undefined? item.destination.name:"-",
                                                            "stay_date":item.stay_date,
                                                            "markup":item.markup_pct
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
    markupResults: state.reports.markupResults
});
 
const mapDispatchToProps = (dispatch) => ({
    onGetMarkupReport: (pList) => dispatch(updateMarkupResultList(pList))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfitMarkupReport);