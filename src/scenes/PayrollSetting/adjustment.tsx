import React, { useCallback, useEffect, useRef, useState } from "react"
import { Button, Modal, Form } from "react-bootstrap"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Api, RequestAPI } from "../../api"
import Table from 'react-bootstrap/Table'
import ReactPaginate from 'react-paginate'
import TimeDate from "../../components/TimeDate"
import { Formik } from "formik"
import { User } from "../User"
import { async } from "validate.js"
const ErrorSwal = withReactContent(Swal)


const Adjustment = (props: any) => {

    const [ adjustmentType, setAdjustmentType ] = React.useState([]);
    const formRef: any = useRef()
    const [ modalShow, setModalShow ] = React.useState(false);
    const [id, setId] = useState(null);
    const [initialValues, setInitialValues] = useState<any>({
            "name" : "",
            "description": "",
            "type": "",
            "deduction": true
    })
    const tableHeaders = [
        'Adjustment Name',
        'Adjusment Description',
        'Type',
        'Add/Deduct',
        // 'Gross Salary Affected',
        'Action',
    ];

    const getAllAdjustmentType = (pageNo: any) => {
        RequestAPI.getRequest(
            `${Api.getAllAdjustmentSetting}?size=10&page${pageNo}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                if (body.data.content) {
                    setAdjustmentType(body.data)
                }
                } else {

                }
            }

        )
    }

    useEffect(() => {
        getAllAdjustmentType(0)
    }, [])
    const setFormField = (e: any, setFieldValue: any) => {
        const { name, value } = e.target
        if (setFieldValue) {
          setFieldValue(name, value)
        }
      }
       
    const getAdjustmentData = (id: any = 0) => {
        RequestAPI.getRequest(
            `${Api.getAdjustmentTypeInfo}?id=${id}`,
            "",
            {},
            {},
            async (res: any) => {
                console.log("Response:", res);
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                if (body.error && body.error.message) {
                } else {
                    const valueObj: any = body.data
                    setInitialValues(valueObj)
                    setModalShow(true)

                    console.log("Data:", body.data);
                }
                }
            }
        )
    } 
    const deleteRecurringData = (id: any = 0) => {
        RequestAPI.putRequest(`${Api.deleteAdjustmentType}?id=${id}`, "", { "id": id }, {}, async (res) => {
            const { status, body = { data: {}, error: {} } } = res;
            if (status === 200 || status === 201) {
              if (body.error && body.error.message) {
                Swal.close();
                ErrorSwal.fire(
                  'Error!',
                  body.error.message,
                  'error'
                );
              } else {
                Swal.close();
                getAllAdjustmentType(0)
                ErrorSwal.fire(
                  'Success!',
                  body.data || "",
                  'success'
                );
              }
            } else {
              Swal.close();
              ErrorSwal.fire(
                'Error!',
                'Something went wrong.',
                'error'
              );
            }
          })
    } 
    
    const handleModalHide = useCallback(() => {
        setModalShow(false);
        formRef.current?.resetForm();
        setInitialValues({
          name: "",
          description: "",
          type: "",
          deduction: true,
        });
      }, []);

    return (
        <div>

            <Table responsive="lg">
                <thead>
                    <tr>
                        {
                        tableHeaders &&
                        tableHeaders.length &&
                        tableHeaders.map((item: any, index: any) => {
                            return (
                            <th style={{ width: 'auto' }}>{item}</th>
                            )
                        })
                    }
                    </tr>
                </thead>
                <tbody>
                    {
                        adjustmentType &&
                        adjustmentType.content &&
                        adjustmentType.content.length > 0 &&
                        adjustmentType.content.map((item: any, index: any) => {
                            return(
                                <tr>
                                    <td> {item.name} </td>
                                    <td> {item.description}</td>
                                    <td> {item.type}</td>
                                    <td> {item.deduction == true ? "Deduct" : "Add" }</td>
                                    <td>
                                        <label
                                        onClick={() => {
                                            getAdjustmentData(item.id)
                                        }}
                                        className="text-muted cursor-pointer">
                                        Update
                                        </label>
                                        <br />
                                        <label
                                        onClick={() => {
                                            deleteRecurringData(item.id)
                                        }}
                                        className="text-muted cursor-pointer">
                                        Delete
                                        </label>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
            <div className="d-flex justify-content-end mt-3" >
                <div>
                    <Button
                        className="mx-2"
                        onClick={() => {
                            setModalShow(true)
                        }}>Add Adjustment</Button>
                </div>
            </div>
            <Modal
             show={modalShow}
             size="xl"
             aria-labelledby="contained-modal-title-vcenter"
             centered
             backdrop="static"
             keyboard={false}
             dialogClassName="modal-90w"
             onHide={
                handleModalHide
            }
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-v-center">
                        Create New Adjustment Type
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="row w-100 px-5">
                    <Formik
                    innerRef={formRef}
                    enableReinitialize={true}
                    validationSchema={null}
                    initialValues={initialValues}
                    onSubmit={(values, actions) => {
                        const loadingSwal = Swal.fire({
                            title: '',
                            allowOutsideClick: false,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });
                        const valuesObj : any = {...values}
                        if(values.id) {
                            RequestAPI.putRequest(Api.editAdjustmentType, "" , valuesObj, {}, async (res: any) => {
                                Swal.close()
                                const { status, body = {data: {}, error: {}}}: any = res

                                if (status === 200 || status === 201) {
                                    console.log("update")
                                    if (body.error && body.error.message) {
                                        ErrorSwal.fire(
                                          'Error!',
                                          (body.error && body.error.message) || "",
                                          'error'
                                        )
                                      } else {
                                        ErrorSwal.fire(
                                          'Updated Successfully!',
                                          (body.data || ""),
                                          'success'
                                        )
                                        setModalShow(false)
                                        getAllAdjustmentType(0)
                                        values.id = null


                        
                                      }
                                }else {
                                    ErrorSwal.fire(
                                        'Error!',
                                        'Something Error.',
                                        'error'
                                      )
                                }
                            })
                        }else{
                            RequestAPI.postRequest(Api.addAdjustmentType, "", valuesObj, {}, async (res: any) => {
                                const { status, body = { data: {}, error: {} } }: any = res
                                console.log("create")

                                if (status === 200 || status === 201) {
                                if (body.error && body.error.message) {
                                    ErrorSwal.fire(
                                    'Error!',
                                    (body.error && body.error.message) || "",
                                    'error'
                                    )
                                } else {
                                    ErrorSwal.fire(
                                        'Success!',
                                        (body.data) || "",
                                        'success'
                                        )
                                    getAllAdjustmentType(0)
                                    setModalShow(false)

                                }
                                } else {
                                ErrorSwal.fire(
                                    'Error!',
                                    'Something Error.',
                                    'error'
                                )
                                }
                            })
                        }
                    }}
                    >
                    {({ values, setFieldValue, handleSubmit, errors, touched}) => {
                        return (
                            <Form
                                noValidate
                                onSubmit={handleSubmit}
                                id="_formid"
                                autoComplete="off"
                            >
                                <div className="row w-100 px-5">
                                    <div className="form-group col-md-6 mb-3">
                                        <label>Name</label>
                                        <input type="text"
                                            name="name"
                                            id="name"
                                            className="form-control"
                                            value={values.name}
                                            onChange={(e) => setFormField(e, setFieldValue)}
                                            />
                                    </div>
                                    <div className="form-group col-md-6 mb-3">
                                        <label>Description</label>
                                        <input type="text"
                                            name="description"
                                            id="description"
                                            className="form-control"
                                            value={values.description}
                                            onChange={(e) => setFormField(e, setFieldValue)}
                                            />
                                    </div>
                                    <div className="form-group col-md-6 mb-3">
                                        <label>Type</label>
                                        {/* <input type="text"
                                            name="type"
                                            id="type"
                                            className="form-control"
                                            value={values.type}
                                            onChange={(e) => setFormField(e, setFieldValue)}
                                            /> */}

                                            <select 
                                            name="type" 
                                            id="type"
                                            value={values.type}
                                            onChange={(e) => setFormField(e, setFieldValue)}
                                            className="formControl"
                                            >
                                                <option value="" disabled selected>
                                                    Type
                                                </option>
                                                <option value="Taxable">Taxable</option>
                                                <option value="Non_Taxable">Non-Taxable</option>
                                                <option value="Gross_up">Gross Up</option>
                                            </select>
                                    </div>
                                    <div className="form-group col-md-6 mb-3">
                                        <label>Action</label>
                                        <select
                                            name="deduction"
                                            id="deduction"
                                            className="form-control"
                                            value={values.deduction }
                                            onChange={(e) => setFormField(e, setFieldValue)}
                                            >
                                                <option value="" disabled selected>
                                                    Action
                                                </option>
                                                <option value={true}>Deduct</option>
                                                <option value={false}>Add</option>
                                            </select>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end px-5">
                                    <button
                                        type="submit"
                                        className="btn btn-primary mx-2"
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
        
    );


}

export default Adjustment;
