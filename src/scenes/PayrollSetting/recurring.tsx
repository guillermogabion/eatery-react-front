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


const Recurring = (props: any) => {

    const [ recurringType, setRecurringType ] = React.useState([]);
    const formRef: any = useRef()
    const [ modalShow, setModalShow ] = React.useState(false);
    const [id, setId] = useState(null);
    const [filterData, setFilterData] = React.useState([]);

    const [initialValues, setInitialValues] = useState<any>({
            "name" : "",
            "description": "",
            "type": "Taxable",
            "deduction": true,
            "affectsGross" : true
    })
    const tableHeaders = [
        'Recurring Name',
        'Recurring Description',
        'Type',
        'Add/Deduct',
        'Gross Salary Affected',
        'Action',
    ];

    const getAllRecurringType = (pageNo: any) => {
        let queryString = ""
        let filterDataTemp = { ...filterData }
        if (filterDataTemp) {
            Object.keys(filterDataTemp).forEach((d: any) => {
                if (filterDataTemp [d]) {
                    queryString += `&${d}=${filterDataTemp[d]}`
                }else {
                    queryString = queryString.replace(`&${d}=${filterDataTemp[d]}`, "")
                }
            })
        }
        RequestAPI.getRequest(
            `${Api.getAllRecurringTypeSetting}?size=10&page=${pageNo}${queryString}&sort=id&sortDir=desc`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                if (body.data.content) {
                    setRecurringType(body.data)
                }
                } else {

                }
            }

        )
    }
    const makeFilterData = (event: any) => {
        const { name, value } = event.target
            const filterObj: any = { ...filterData }
            filterObj[name] = name && value !== "Select" ? value : ""
            setFilterData(filterObj)
    }
    const handlePageClick = (event: any) => {
        getAllRecurringType(event.selected)
    };

    useEffect(() => {
        getAllRecurringType(0)
    }, [])
    const setFormField = (e: any, setFieldValue: any) => {
        const { name, value } = e.target
        if (setFieldValue) {
          setFieldValue(name, value)
        }
      }
       
    const getRecurringData = (id: any = 0) => {
        RequestAPI.getRequest(
            `${Api.getRecurringTypeInfo}?id=${id}`,
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
        RequestAPI.putRequest(`${Api.deleteRecurringType}?id=${id}`, "", { "id": id }, {}, async (res) => {
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
                getAllRecurringType(0);
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
            <div className="w-100 pt-2">
                <div className="fieldtext d-flex">
                    <div className="input-container col-md-3">
                        <input 
                        type="text"
                        className="formControl"
                        name="name"
                        id="type"
                        onChange={(e) => makeFilterData(e)}
                        />
                    </div>
                    <div className="input-container col-md-3">
                        <Button
                        style={{ width: 210 }}
                        onClick={() => getAllRecurringType(0)}
                        className="btn btn-primary mx-2">
                        Search
                        </Button>
                    </div>
                </div>
            </div>

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
                        recurringType &&
                        recurringType.content &&
                        recurringType.content.length > 0 &&
                        recurringType.content.map((item: any, index: any) => {
                            return(
                                <tr>
                                    <td> {item.name} </td>
                                    <td> {item.description}</td>
                                    <td> {item.type}</td>
                                    <td> {item.deduction == true ? "Deduct" : "Add" }</td>
                                    <td> {item.affectsGross == true ? "YES" : "NO" }</td>
                                    <td>
                                        <label
                                        onClick={() => {
                                            getRecurringData(item.id)
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
            <div className="d-flex justify-content-end">
                <div className="">
                    <ReactPaginate
                        className="d-flex justify-content-center align-items-center"
                        breakLabel="..."
                        nextLabel=">"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={(recurringType && recurringType.totalPages) || 0}
                        previousLabel="<"
                        previousLinkClassName="prev-next-pagination"
                        nextLinkClassName="prev-next-pagination"
                        activeLinkClassName="active-page-link"
                        disabledLinkClassName="prev-next-disabled"
                        pageLinkClassName="page-link"
                        renderOnZeroPageCount={null}
                    />
                </div>
            </div>
            <div className="d-flex justify-content-end mt-3" >
                <div>
                    <Button
                        className="mx-2"
                        onClick={() => {
                            setModalShow(true)
                        }}>Add Recurring</Button>
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
                        Create New Recurring Type
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

                        let hasError = false;

                       
                        if(!values.name || values.name.trim() === "") {
                            hasError = true
                        }
                        if(!values.description || values.description.trim() === "") {
                            hasError = true
                        }

                        if (hasError) {
                            ErrorSwal.fire(
                                'Warning!',
                                'Please fill all the required fields',
                                'warning'
                            )
                           }else{

                            if(values.id) {
                         
                                RequestAPI.putRequest(Api.updateRecurringTypeSetting, "" , valuesObj, {}, async (res: any) => {
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
                                            getAllRecurringType(0)
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
                           
                                RequestAPI.postRequest(Api.createRecurringTypeSetting, "", valuesObj, {}, async (res: any) => {
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
                                        getAllRecurringType(0)
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
                                    <div className="form-group col-md-4 mb-3">
                                        <label>Type</label>
                                            <select 
                                            name="type" 
                                            id="type"
                                            value={values.type}
                                            onChange={(e) => setFormField(e, setFieldValue)}
                                            className="formControl"
                                            >
                                                <option value="Taxable">Taxable</option>
                                                <option value="Non_Taxable">Non-Taxable</option>
                                                <option value="Gross_up">Gross Up</option>
                                            </select>
                                    </div>
                                    <div className="form-group col-md-4 mb-3">
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
                                    <div className="form-group col-md-4 mb-3">
                                        <label>Gross Affected</label>
                                        <select
                                            name="affectsGross"
                                            id="deduction"
                                            className="form-control"
                                            value={values.deduction }
                                            onChange={(e) => setFormField(e, setFieldValue)}
                                            >
                                                <option value={true}>Yes</option>
                                                <option value={false}>No</option>
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

export default Recurring;
