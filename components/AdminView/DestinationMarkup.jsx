import React, { Component } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Formik } from "formik";
import * as Yup from "yup";
import Switch from "react-switch";
import toast from '../Toast';
import styles from "../../styles/DestinationMarkup.module.scss";
import { markupSelectStyles_2 } from "../../styles/SelectStyles";
import tbl_styles from '../../styles/table.module.scss';
import "react-datepicker/dist/react-datepicker.css";
import { addDaysHelper, formatDateHelper4, getDay } from "../../components/Data/helper";
import { getCountyList, getDestByCountry, getMarkupReport, createDestinationMarkup, updateDestinationMarkup } from '../../core/frontend/http-service/hb.http'; 
import commonStyles from "../../styles/Common.module.scss";
import { connect } from "react-redux";
import { updateMarkupResultList } from "../../redux/actions/reportActions";
import TableRow from "./TableRow";
import { Modal, Container, Row, Col, Button } from "react-bootstrap";


class DestinationMarkup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialValues : {
                country: "",
                city:"",
                from: null,
                to: null,
                sunday_pct: 0.0,
                monday_pct: 0.0,
                tuesday_pct: 0.0,
                wednesday_pct: 0.0,
                thursday_pct: 0.0,
                friday_pct: 0.0,
                saturday_pct: 0.0,
                overwite_zero: false
            },
            minDateFrom: new Date(),
            minDateTo: addDaysHelper(1),
            SearchSchema: Yup.object().shape({
                country: Yup.string().required('Country is required'),
                city: Yup.string(),
                from: Yup.date()
                   .nullable()
                   .default(null)
                //    .min(new Date(), 'Date-from must be later than today')
                   .required("Date-from is required"),
                to: Yup.date()
                   .nullable()
                   .default(null)
                   .min(Yup.ref('from'), 'Date-to must be later date-from date')
                   .required("Date-to is required"),
                sunday: Yup.number().nullable().default(0.0),
                monday: Yup.number().nullable().default(0.0),
                tuesday: Yup.number().nullable().default(0.0),
                wednedsday: Yup.number().nullable().default(0.0),
                thursday: Yup.number().nullable().default(0.0),
                friday: Yup.number().nullable().default(0.0),
                saturday: Yup.number().nullable().default(0.0)
            }),
            markupOpt: 'Country',
            countries: [],
            destinations: [],
            totalItemCount: 0,
            markUpAvailable: false,
            showModal: false,
            updatingEntry: {},
            updatingMarkupValue: 0
        };
    }

    componentDidMount() { 
        this.listCountry();
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

    onResetClick(){
        this.setState({initialValues : {
            country: "",
            city:"",
            from: null,
            to: null,
            sunday_pct: 0.0,
            monday_pct: 0.0,
            tuesday_pct: 0.0,
            wednesday_pct: 0.0,
            thursday_pct: 0.0,
            friday_pct: 0.0,
            saturday_pct: 0.0,
            overwite_zero: false
        }});
    }

    onSaveClick(pValues){
        pValues['from'] = formatDateHelper4(pValues['from']);
        pValues['to'] = formatDateHelper4(pValues['to']);
        createDestinationMarkup(pValues).then((response)=>{
            if(response.status == 200){
                toast({type:'success',message:response.data.pMessage});
            }
        }).catch((error)=>{
            toast({type:'error',message:error});
        })
    }

    serachForMarkup(pValues){
        const { activePage } = this.state;
        if(pValues.country !== "" && pValues.from != null && pValues.to !== null){
            const pData = {
                "country":pValues.country,
                "city":pValues.city,
                "start_date":formatDateHelper4(pValues.from),
                "end_date":formatDateHelper4(pValues.to)
            }
            getMarkupReport(pData,activePage).then((response)=>{
                if(response.status == 200){
                    if (response.data.pResultObj != null) {
                        this.props.onGetMarkupReport(response.data.pResultObj.data);
                        if(response.data.pResultObj.total > 0){
                            this.setState({markUpAvailable: true});
                            toast({type:'success',message:"Exsting markup entries found."});
                        }
                        else{
                            toast({type:'warning',message:"Could not find any existing values."});
                        }
                        this.setState({ totalItemCount : response.data.pResultObj.total});
                    }
                    else {
                        this.props.onGetMarkupReport([]);
                    }
                }
            }).catch((pError)=>{
                console.log("pError", pError);
            });
        }
    }

    onEditClick(pId, pSelectedEntry){
        this.setState({updatingEntry : pSelectedEntry})
        this.modalToggle();
    }

    modalToggle() {
        this.setState({ showModal: !this.state.showModal });
    }

    handleSaveChanges(){
        const {updatingEntry, updatingMarkupValue} = this.state;
        const pData = {
            "country":updatingEntry.country,
            "city":updatingEntry.city,
            "stay_date":updatingEntry.stay_date,
            "markup_pct":updatingMarkupValue
        }
        updateDestinationMarkup(pData).then((response)=>{
            if(response.data.pSuccess){
                toast({type:'success',message:response.data.pMessage});
                console.log("results",this.props.markupResults);
                this.refreshMarkupTable(updatingEntry._id,updatingMarkupValue);
                this.modalToggle();
            }
            else{
                toast({type:'error',message:response.data.pMessage});
            }
        }).catch((error)=>{
            toast({type:'error',message:"Markup could not be updated"});
        })
    }

    refreshMarkupTable(pId,pMarkupVal){
        let markupArr = this.props.markupResults;
        let obj = markupArr.find((o, i) => {
            if (o._id === pId) {
                markupArr[i] = { ...markupArr[i], markup_pct: pMarkupVal };
                return true; // stop searching
            }
        });
        this.props.onGetMarkupReport(markupArr);
    }

    render() {
        const {initialValues, minDateFrom, minDateTo, SearchSchema, countries, destinations, markUpAvailable, showModal, updatingEntry } = this.state;
        return (
            <Formik
                initialValues={initialValues}
                validationSchema={SearchSchema}
                onSubmit={(values, {resetForm}) => {
                    this.onSaveClick(values);
                    resetForm({values:""});
                }}
            >
                {(formik) => {
                const {
                    values,
                    handleChange,
                    handleSubmit,
                    handleReset,
                    errors,
                    touched,
                    handleBlur,
                    isValid,
                    setFieldValue,
                    setValues,
                    dirty
                } = formik;
                return (
                        <>
                            <form className={`${commonStyles.font_size_13}`} onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
                                <div className="container pt-3">
                                    <div className={`row d-flex justify-content-center pb-3`}>
                                        <div className={`col-3`}>
                                            <Select
                                                instanceId="id_titles"
                                                name="country"
                                                placeholder="Country"
                                                value={countries.find((obj) => obj.value === values.country)}
                                                options={countries}
                                                styles={markupSelectStyles_2}
                                                onChange={(obj) =>
                                                    {
                                                        setFieldValue('country', obj.value);
                                                        this.onCountrySelect(obj.value);
                                                    }
                                                }
                                            />
                                            <div className={`${commonStyles.invalid_feedback} d-block`}>{errors.country && touched.country ? (
                                            <div>{errors.country}</div>
                                            ) : null}</div>
                                        </div>
                                        <div className={`col-3`}>
                                            <Select
                                                instanceId="id_titles"
                                                name="city"
                                                placeholder="City"
                                                value={destinations.find((obj) => {
                                                    if(obj !== undefined)
                                                        return obj.value === values.city
                                                })}
                                                options={destinations}
                                                styles={markupSelectStyles_2}
                                                onChange={(obj) =>
                                                    {
                                                        setFieldValue('city', obj.value);
                                                    }
                                                }
                                            />
                                            <div className={`${commonStyles.invalid_feedback} d-block`}>{errors.city && touched.city ? (
                                            <div>{errors.city}</div>
                                            ) : null}</div>
                                        </div>
                                        <div className={`col-2`}></div>
                                    </div> 
                                    <div className={`row d-flex justify-content-center`}>
                                        <div className={`col-3`}>
                                            <label>Profit markup period:</label>
                                        </div>
                                        <div className={`col-3`}></div>
                                        <div className={`col-2`}></div>
                                    </div>
                                    <div className={`row d-flex justify-content-center`}>
                                        <div className={`col-3`}>
                                            <DatePicker
                                                name="from"
                                                placeholderText="Date From"
                                                className={`form-control ${commonStyles.form_control} ${commonStyles.font_size_13}`}
                                                dateFormat="dd/MM/yyyy"
                                                type="date"
                                                value={values.from}
                                                onBlur={handleBlur}
                                                selected={values.from}
                                                minDate={minDateFrom}
                                                autoComplete='off'
                                                onChange={date => {
                                                    setFieldValue('from', date);
                                                    let toDt = addDaysHelper(1,date)
                                                    setFieldValue('to', toDt);
                                                    //  onCheckinUpdate(date);
                                                    //  onCheckoutUpdate(checkoutDt);
                                                }}
                                            />
                                            <div className={`${commonStyles.invalid_feedback} d-block`}>{errors.from && touched.from ? (
                                            <div>{errors.from}</div>
                                            ) : null}</div>
                                        </div>
                                        <div className={`col-3`}>
                                            <DatePicker
                                                name="to"
                                                placeholderText="Date To"
                                                className={`form-control ${commonStyles.form_control} ${commonStyles.font_size_13}`}
                                                dateFormat="dd/MM/yyyy"
                                                value={values.to}
                                                onBlur={handleBlur}
                                                selected={values.to}
                                                minDate={values.from !== null?addDaysHelper(1,values.from): minDateTo}
                                                autoComplete='off'
                                                onChange={date => {
                                                    setFieldValue('to', date);
                                                }}
                                            />
                                            <div className={`${commonStyles.invalid_feedback} d-block`}>{errors.to && touched.to ? (
                                            <div>{errors.to}</div>
                                            ) : null}</div>    
                                        </div>
                                        <div className={`col-2`}>
                                            <button
                                                type="button"
                                                className={`btn btn-primary w-100 ${commonStyles.font_size_13}`}
                                                onClick={()=>this.serachForMarkup(values)}
                                            >Search</button>
                                        </div>
                                    </div>
                                    {markUpAvailable?<div className={`row pt-3`}>
                                        <table className={`table table-sm ${tbl_styles.tbl}`}>
                                            <thead>
                                                <tr className={`${tbl_styles.tble_head}`}>
                                                    <td className={`${tbl_styles.tble_data}`}>Country</td>
                                                    <td className={`${tbl_styles.tble_data}`}>City</td>
                                                    <td className={`${tbl_styles.tble_data}`}>Stay date</td>
                                                    <td className={`${tbl_styles.tble_data}`}>Markup value</td>
                                                    <td className={`${tbl_styles.tble_data}`}>Edit</td>
                                                    {/* <td className={`${tbl_styles.tble_data}`}>Delete</td> */}
                                                    </tr>
                                            </thead>
                                            <tbody>
                                                {this.props.markupResults &&
                                                this.props.markupResults.length != 0 ? (
                                                    this.props.markupResults.map(item => {
                                                        return (
                                                            <TableRow
                                                                key={item._id}
                                                                className={`text-center`}
                                                                tableRow={{
                                                                    "country":item.location.description,
                                                                    "city":item.destination !== undefined? item.destination.name:"-",
                                                                    "stay_date":`${item.stay_date} (${getDay(item.stay_date)})`,
                                                                    "markup":item.markup_pct,
                                                                    "edit":<button
                                                                            type="button"
                                                                            className={`btn btn-info w-100 ${commonStyles.font_size_13}`}
                                                                            onClick={()=>this.onEditClick(item._id,item)}
                                                                        >Edit</button>
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
                                    </div>:<></>}
                                </div>
                                <hr className="py-1"></hr>
                                <div className={`container px-3 pb-3`}>
                                    <div className={`row no-gutters mb-2`}>
                                        <div className={`col d-flex justify-content-start`}>
                                            <label>
                                                <span className={`${styles.switch_lable}`}>Overwrite exiting markup with zeros</span>
                                                <Switch 
                                                    onColor="#25aae1"
                                                    height={21}
                                                    width={48}
                                                    onChange={checked => {
                                                        setFieldValue('overwite_zero', checked);
                                                    }} 
                                                    checked={values.overwite_zero} 
                                                />
                                            </label>
                                        </div>
                                        <div className={`col d-flex justify-content-end`}>
                                            <button type="reset" className={`btn btn-warning ml-2 ${commonStyles.font_size_13}`}>Reset</button>
                                            <button type="submit" className={`btn btn-primary ml-2 ${commonStyles.font_size_13}`}>Save</button>
                                        </div>
                                    </div>
                                    <div className={`row`}>
                                        <table className={`table table-sm ${tbl_styles.tbl}`}>
                                            <thead>
                                                <tr className={`${tbl_styles.tble_head}`}>
                                                    <td className={`${tbl_styles.tble_data}`}>Sunday</td>
                                                    <td className={`${tbl_styles.tble_data}`}>Monday</td>
                                                    <td className={`${tbl_styles.tble_data}`}>Tuesday</td>
                                                    <td className={`${tbl_styles.tble_data}`}>Wednesday</td>
                                                    <td className={`${tbl_styles.tble_data}`}>Thursday</td>
                                                    <td className={`${tbl_styles.tble_data}`}>Friday</td>
                                                    <td className={`${tbl_styles.tble_data}`}>Saturday</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="text-center">
                                                        <input 
                                                            type="number" 
                                                            className={`form-control w-100 p-1 ${commonStyles.font_size_13}`} 
                                                            placeholder="Sunday" 
                                                            value={values.sunday_pct}
                                                            onChange={event => {
                                                                setFieldValue('sunday_pct', parseFloat(event.target.value));
                                                            }}
                                                        ></input>
                                                    </td>
                                                    <td className="text-center">
                                                        <input 
                                                            type="number" 
                                                            className={`form-control w-100 p-1 ${commonStyles.font_size_13}`} 
                                                            placeholder="Monday" 
                                                            value={values.monday_pct}
                                                            onChange={event => {
                                                                setFieldValue('monday_pct', parseFloat(event.target.value));
                                                            }}
                                                        ></input>
                                                    </td>
                                                    <td className="text-center">
                                                        <input 
                                                            type="number" 
                                                            className={`form-control w-100 p-1 ${commonStyles.font_size_13}`} 
                                                            placeholder="Tuesday" 
                                                            value={values.tuesday_pct}
                                                            onChange={event => {
                                                                setFieldValue('tuesday_pct', parseFloat(event.target.value));
                                                            }}
                                                        ></input>
                                                    </td>
                                                    <td className="text-center">
                                                        <input 
                                                            type="number" 
                                                            className={`form-control w-100 p-1 ${commonStyles.font_size_13}`} 
                                                            placeholder="Wednesday" 
                                                            value={values.wednesday_pct}
                                                            onChange={event => {
                                                                setFieldValue('wednesday_pct', parseFloat(event.target.value));
                                                            }}
                                                        ></input>
                                                    </td>
                                                    <td className="text-center">
                                                        <input 
                                                            type="number" 
                                                            className={`form-control w-100 p-1 ${commonStyles.font_size_13}`} 
                                                            placeholder="Thursday" 
                                                            value={values.thursday_pct}
                                                            onChange={event => {
                                                                setFieldValue('thursday_pct', parseFloat(event.target.value));
                                                            }}
                                                        ></input>
                                                    </td>
                                                    <td className="text-center">
                                                        <input 
                                                            type="number" 
                                                            className={`form-control w-100 p-1 ${commonStyles.font_size_13}`} 
                                                            placeholder="Friday" 
                                                            value={values.friday_pct}
                                                            onChange={event => {
                                                                setFieldValue('friday_pct', parseFloat(event.target.value));
                                                            }}
                                                        ></input>
                                                    </td>
                                                    <td className="text-center">
                                                        <input 
                                                            type="number" 
                                                            className={`form-control w-100 p-1 ${commonStyles.font_size_13}`} 
                                                            placeholder="Saturday" 
                                                            value={values.saturday_pct}
                                                            onChange={event => {
                                                                setFieldValue('saturday_pct', parseFloat(event.target.value));
                                                            }}
                                                        ></input>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </form>
                            <Modal
                                className="AuthModal no-gutters"
                                show={showModal}
                                onHide={() => this.modalToggle()}
                                centered
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>Modal title</Modal.Title>
                                </Modal.Header>
                                <Modal.Body className="no-gutters">
                                    <Container className="no-gutters">
                                        <Row>
                                            <Col xs={12} md={12}>
                                                <label className={`${styles.font_size_13}`}>
                                                    {Object.keys(updatingEntry).length !== 0?`Set Markup value for 
                                                        ${updatingEntry.location.description} 
                                                        ${updatingEntry.city !== ""?"("+updatingEntry.destination.name+")":""} - 
                                                        ${updatingEntry.stay_date}
                                                    `:""}
                                                </label> 
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={12} md={12}>
                                                <input 
                                                    className={`form-control w-100 p-3 ${styles.font_size_13}`} 
                                                    placeholder="Markup value"
                                                    onChange={(event)=>{
                                                        this.setState({updatingMarkupValue:event.target.value});
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                    </Container>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="primary" onClick={() => this.handleSaveChanges()}>
                                        Save Changes
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </>
                    );
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

export default connect(mapStateToProps, mapDispatchToProps)(DestinationMarkup);
