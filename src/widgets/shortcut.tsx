import React, { useState, useRef, useEffect } from "react";
import { RequestAPI, Api } from "../api";
import { async } from "validate.js";
import { Button, Modal, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux"
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import * as Yup from "yup";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import { action_decline } from "../assets/images"




const ErrorSwal = withReactContent(Swal);
const Shortcut = () => {

    const [ modalShow, setModalShow] = useState(false)
    const [ shortcut, setShortcut] = useState<any>([]) 
    const dispatch = useDispatch()
    const userData = useSelector((state: any) => state.rootReducer.userData)


    const formRef = useRef();


    const [initialValues, setInitialValues] = useState<any>({
        "name" : "",
        "endpoint" : ""
    })

    const AddShortcut = (values, actions) => {
        const loading = Swal.fire({
            title: '',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        })

        const valuesObj : any = { ...values }
        
        RequestAPI.postRequest(Api.addShortcut, "", valuesObj, {},
            async (res) => {
                const { status, body = {data : {}, error: {}}} = res;
                if (status === 200 || status == 201) {
                    if (body.error && body.error.message) {
                        ErrorSwal.fire({
                          title: 'Error!',
                          text: (body.error && body.error.message) || "",
                         
                          icon: 'error',
                      })
                    }else{
                        ErrorSwal.fire({
                            title: 'Created Successfully!',
                            text: (body.data) || "",
                            icon: 'success',
                        }).then((result) => {
                              if (result.isConfirmed) {
                              location.reload();
                              }
                        });
                    }
                 
                }
            }
        )
    }

    useEffect (() => {
        RequestAPI.getRequest(
            `${Api.getShortcut}`,
            "",
            {},
            {},
            async(res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                setShortcut(body.data)
                console.log(body.data);
                } else {
                }
            }
        )
    }, [])
    const setFormField = (e: any, setFieldValue: any) => {
        const { name, value } = e.target
        if (setFieldValue) {
            setFieldValue(name, value)
        }
    }

    return (
        <div className="time-card-width">
            <div className="card-header">
                <span className="">Quick Shortcut</span>
            </div>
            <div className="time-card-body" style={{ height: '400px', overflowY: 'auto' }}>
                <div  >

                    <div className="row d-flex pr-2">
                        {
                            shortcut && shortcut.length > 0 ? (
                                shortcut.map((item: any, index: any) => (
                                <div key={index} className="col-6 pb-2">
                                    <Link
                                        className="non-transparent-border"
                                        to={item.endpoint}
                                        >

                                        <span style={{ lineHeight: "0%", color: "white" }}>
                                            {item.name}
                                        </span>
                                        
                                        </Link>
                                    </div>
                                ))
                            ) : ""
                        }
                            

                        <div className="col-6 ">
                            <p className="transparent-border"
                            onClick={() => setModalShow(true)}
                            style={{cursor:'pointer'}}
                            >
                                <p style={{fontSize:"50px", fontWeight: "bold", lineHeight: "0%", color:"#189FB5"}}>+</p> 
                                <br />
                                <span style={{lineHeight: "0%", color:"#189FB5"}}>Add Shortcut</span>
                            </p>
                        </div>
                        
                    </div>
                </div>

               
            </div>
            <Modal
                show={modalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                onHide={() => {
                setModalShow(false)
                }}
                dialogClassName="modal-90w"
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Create Shortcut
                </Modal.Title>
            </Modal.Header>
                <Modal.Body className="row w-100 px-5">
                    <Formik
                        innerRef={formRef}
                        initialValues={initialValues}
                        enableReinitialize={true}
                        validationSchema={
                            Yup.object().shape({
                                name: Yup.string().required("This Field is Required"),
                                endpoint : Yup.string().required("This Field is Required")
                            })
                        }
                        onSubmit={AddShortcut}
                    >
                         {({ values, setFieldValue, handleSubmit, errors, touched }) => {
                            return (
                                <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
                                    <div className="row w-100 px-5">
                                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                            <label>Shortcut Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                                                value={values.name}
                                                onChange={(e) => {
                                                    setFieldValue('name', e.target.value);
                                                }}
                                                />
                                                {touched.name && errors.name && <div id="payrollsettingot_errorname_modalp" className="invalid-feedback">{errors.name}</div>}
                                        </div>
                                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                          
                                            <label>Shortcut Link</label>
                                            <select
                                                className={`form-control ${touched.endpoint && errors.endpoint ? 'is-invalid' : ''}`}
                                                name="endpoint"
                                                value={values.endpoint}
                                                onChange={(e) => {
                                                    setFormField(e, setFieldValue);
                                                }}
                                                >
                                                <option value="" disabled selected>
                                                    Select A Link Address
                                                </option>

                                                {userData.data.profile.menus.flatMap((menuItem, index) => (
                                                menuItem.menu.map((submenuItem, subIndex) => (
                                                    <option key={`${index}-${subIndex}`} value={submenuItem.route}>
                                                    {submenuItem.route}
                                                    </option>
                                                ))
                                                ))}
                                            </select>
                                            {touched.endpoint && errors.endpoint && <div className="invalid-feedback">{errors.endpoint}</div>}
                                            
                                        </div>

                                    </div>
                                    <div className="d-flex justify-content-center px-5">
                                        <button
                                            type="submit"
                                            className="btn btn-primary mx-2 mt-3"
                                            style={{width: '120px'}}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </Form>
                            )
                         }}
                    </Formik>
                </Modal.Body>
            </Modal>

        </div>
    )
}

export default Shortcut