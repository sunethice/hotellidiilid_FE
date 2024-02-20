import { Formik } from "formik";
import React, { Component } from "react";
import * as Yup from "yup";
import { updateGeneralMarkup } from "../../core/frontend/http-service/hb.http";
import toast from '../Toast';
import styles from "../../styles/Common.module.scss";

class GeneralMarkup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialValues : {
                markup: ""
            },
            SearchSchema: Yup.object().shape({
                markup: Yup.number().required('Markup value is required')
            })
        };
    }

    resetField(){
        this.setState({initialValues : {
            markup: ""
        }});
    }

    onChangeClick(pValues){
        const pPostData = {
            'config_type': "General_Markup",
            'configuration': pValues.markup
        }
        updateGeneralMarkup(pPostData).then((response)=>{
            if(response.status == 200){
                toast({type:'success',message:response.data.pMessage});
            }
        }).catch((error)=>{
            toast({type:'error',message:error});
        })
    }

    render() {
        const {initialValues, SearchSchema} = this.state;
        return (
            <Formik
                initialValues={initialValues}
                validationSchema={SearchSchema}
                onSubmit={(values, {resetForm}) => {
                    this.onChangeClick(values);
                    resetForm({values:""});
                }}
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
                        <div className="container pt-3">
                            <form className={`${styles.font_size_13}`} onSubmit={formik.handleSubmit}>
                                <div className="row">
                                    <div className="col">
                                        <label className={`${styles.font_size_13}`}>Set Common Markup</label>    
                                    </div>    
                                </div>
                                <div className="row">
                                    <div className="col-3">
                                        <input 
                                            type="text" 
                                            className={`form-control w-100 p-3 ${styles.font_size_13}`} 
                                            placeholder="General Markup"
                                            value={values.markup}
                                            onChange={(event)=>{
                                                setFieldValue('markup',event.target.value);
                                            }}
                                        ></input>
                                        <div className={`${styles.invalid_feedback} d-block`}>{errors.markup && touched.markup ? (
                                            <div>{errors.markup}</div>
                                            ) : null}</div>
                                    </div>
                                    <div className="col">
                                        <button type="submit" className={`btn btn-primary ${styles.font_size_13}`}>
                                            Change
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    );
                }}
            </Formik>);
    }
}

export default GeneralMarkup;
