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
import * as Yup from "yup"
import { Utility } from "../../utils"
import { action_decline, action_edit } from "../../assets/images"



const ErrorSwal = withReactContent(Swal)


const Adjustment = (props: any) => {

    const [ adjustmentType, setAdjustmentType ] = React.useState([]);
    const formRef: any = useRef()
    const [ modalShow, setModalShow ] = React.useState(false);
    // const [id, setId] = useState(null);
    const [filterData, setFilterData] = useState<{ [key: string]: string }>({});
    const [isDeduction, setIsDeduction] = useState("");
    const [typeType, setTypetype] = useState("");
    const [showButtonIsDeduction, setShowButtonIsDeduction] = useState(false);
    const [showButtonTypetype, setShowButtonTypetype] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [id, setId] = React.useState("");



    const [initialValues, setInitialValues] = useState<any>({
            "name" : "",
            "description": "",
            "type": "",
            "deduction": true,
            "affectsGross": true
    })
    const tableHeaders = [
        'ID',
        'Adjustment Name',
        'Adjustment Description',
        'Type',
        'Add/Deduct',
        'Gross Salary Affected',
        'Action',
    ];
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        description: Yup.string().required("Description is required"),
        type: Yup.string().required("Type is required"),
        deduction: Yup.string().required("Action is required"),
      });

    const getAllAdjustmentType = (pageNo: any, pageSize: any) => {
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
            `${Api.getAllAdjustmentSetting}?size=${pageSize ? pageSize : '10'}&page=${pageNo}${queryString}&sort=id&sortDir=desc`,
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
    const makeFilterData = (event: any) => {
        const { name, value } = event.target
            const filterObj: any = { ...filterData }
            filterObj[name] = name && value !== "Select" ? value : ""
            setFilterData(filterObj)
    }
    
    const handlePageClick = (event: any) => {
        const selectedPage = event.selected
        getAllAdjustmentType(selectedPage, pageSize)
    };
    const handlePageSizeChange = (event) => {
        const selectedPageSize = parseInt(event.target.value, 10);
        setPageSize(selectedPageSize);
        getAllAdjustmentType(0, selectedPageSize);
    };


    useEffect(() => {
        getAllAdjustmentType(0, pageSize)
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
                    setId(body.data.id)
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
                ErrorSwal.fire({
                    title: 'Error!',
                    text: (body.error && body.error.message) || "",
                    didOpen: () => {
                      const confirmButton = Swal.getConfirmButton();
            
                      if(confirmButton)
                        confirmButton.id = "payrollsettingadjustment_errorconfirm_alertbtn"
                    },
                    icon: 'error',
                })
              } else {
                Swal.close();
                getAllAdjustmentType(0)
                ErrorSwal.fire({
                    title: 'Success!',
                    text: (body.data) || "",
                    didOpen: () => {
                      const confirmButton = Swal.getConfirmButton();
            
                      if(confirmButton)
                        confirmButton.id = "payrollsettingadjustment_successconfirm_alertbtn"
                    },
                    icon: 'success',
                })
              }
            } else {
              Swal.close();
              ErrorSwal.fire({
                title: 'Error!',
                text: "Something went wrong.",
                didOpen: () => {
                  const confirmButton = Swal.getConfirmButton();
        
                  if(confirmButton)
                    confirmButton.id = "payrollsettingadjustment_errorconfirm2_alertbtn"
                },
                icon: 'error',
            })
            }
          })
    } 
    
    const handleModalHide = useCallback(() => {
        setId(false)
        setModalShow(false);
        formRef.current?.resetForm();
        setInitialValues({
          name: "",
          description: "",
          type: "",
          deduction: true,
        });
      }, []);
      const resetIsDeduction = () => {
        
        setIsDeduction("");
        const selectElement = document.getElementById("deduction");
            if (selectElement) {
            selectElement.selectedIndex = 0;
            }
            setShowButtonIsDeduction(false);
            setFilterData(prevFilterData => {
                const filterObj = { ...prevFilterData };
                delete filterObj.isDeduction;
                return filterObj;
              });

      }
      const resetTypetype = () => {
        
        setTypetype("");
        const selectElement = document.getElementById("typeType");
            if (selectElement) {
            selectElement.selectedIndex = 0;
            }
            setShowButtonTypetype(false);   
            setFilterData(prevFilterData => {
                const filterObj = { ...prevFilterData };
                delete filterObj.typeType;
                return filterObj;
              });
        

      }
      

    return (
        <div>
            <div className="w-100 pt-2">
                <div className="fieldtext row">
                <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12">
                    <div className="input-container">
                            <label>Adjustment Name</label>
                            <input 
                            type="text"
                            className="formControl"
                            name="name"
                            id="payrollsettings_adjname"
                            onChange={(e) => makeFilterData(e)}
                            />
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 clearable-select">
                    <div className="input-container">
                        <label> Type </label>
                        <select 
                            name="typeType" 
                            id="typeType"
                            onChange={(e) => { makeFilterData(e)
                                setShowButtonTypetype(e.target.value !== 'default')    
                            }}
                            className="formControl"
                            >
                                <option value="default" disabled selected>
                                    Type
                                </option>
                                <option value="Taxable">Taxable</option>
                                <option value="NonTaxable">Non-Taxable</option>
                            </select>
                            {showButtonTypetype && (
                                <span id="payrollsettingadjustment_closetype_span" className="clear-icon" style={{paddingTop: '10%', paddingRight: '5%'}} onClick={resetTypetype}>
                                X
                                </span>
                            )}
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 clearable-select">
                    <div className="input-container">
                        <label>Action</label>
                        <select
                            name="isDeduction"
                            id="payroll_settings_deduction"
                            className="form-control"
                            onChange={(e) => {makeFilterData(e)
                                    setShowButtonIsDeduction(e.target.value !== 'default')
                            }}
                            >
                                <option value="default" disabled selected>
                                    Action
                                </option>
                                <option value={true}>Deduct</option>
                                <option value={false}>Add</option>
                            </select>
                            {showButtonIsDeduction && (
                                <span id="payrollsettingadjustment_closeaction_span" className="clear-icon" style={{paddingTop: '10%', paddingRight: '5%'}} onClick={resetIsDeduction}>
                                X
                                </span>
                            )}
                    </div>
                </div>
                <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 ">
                    <div className="input-container">
                            <Button
                            id="payrollsettingadjustment_search_btn"
                            style={{ width: '100%' }}
                            onClick={() => getAllAdjustmentType(0)}
                            className="btn btn-primary mx-2 mt-4">
                            Search
                            </Button>
                    </div>
                </div>
                    
                    
                    
                </div>
            </div>
            <Table responsive>
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
                <tbody className="custom-row">
                    {
                        adjustmentType &&
                        adjustmentType.content &&
                        adjustmentType.content.length > 0 &&
                        adjustmentType.content.map((item: any, index: any) => {
                            return(
                                <tr>
                                    <td id={"payrollsettingadjustment_id_adjtypedata_" + item.id}> {item.id} </td>
                                    <td id={"payrollsettingadjustment_name_adjtypedata_" + item.id}> {item.name} </td>
                                    <td id={"payrollsettingadjustment_description_adjtypedata_" + item.id}> {item.description}</td>
                                    <td id={"payrollsettingadjustment_type_adjtypedata_" + item.id}> {Utility.removeUnderscore(item.type)}</td>
                                    <td id={"payrollsettingadjustment_deduction_adjtypedata_" + item.id}> {item.deduction == true ? "Deduct" : "Add" }</td>
                                    <td id={"payrollsettingadjustment_affectsgross_adjtypedata_" + item.id}> {item.affectsGross == true ? "YES" : "NO" }</td>
                                    <td>
                                        <label
                                        id={"payrollsettingadjustment_update_adjtypelabel_" + item.id}
                                        onClick={() => {
                                            getAdjustmentData(item.id)
                                        }}
                                        className="text-muted cursor-pointer">
                                            <img src={action_edit} width={20} className="hover-icon-pointer mx-1" title="Update" />
                                        </label>
                                        <br />
                                        {/* <label
                                        onClick={() => {
                                            deleteRecurringData(item.id)
                                        }}
                                        className="text-muted cursor-pointer">
                                        Delete
                                        </label> */}
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
            {
                adjustmentType &&
                adjustmentType.content &&
                adjustmentType.content.length == 0 ?
                <div className="w-100 text-center">
                    <label htmlFor="">No Records Found</label>
                </div>
            :
            null
            }
           
            <div className="row">
                <div className="col-md-6">
                    <div className="justify-content-start">
                        <span className="font-bold mr-8 text-muted">Total Entries : {adjustmentType.totalElements}</span>
                        <br />
                        <div className="flex items-center">
                        <span className="text-muted mr-3">Select Page Size:</span>
                        <select id="pageSizeSelect" value={pageSize} className="form-select rounded-md py-2" style={{ fontSize: "16px", width: "150px" }} onChange={handlePageSizeChange}>
                            <option value={10}>10</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="d-flex justify-content-end">
                        <div className="">
                            <ReactPaginate
                                className="d-flex justify-content-center align-items-center"
                                breakLabel="..."
                                nextLabel=">"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={5}
                                pageCount={(adjustmentType && adjustmentType.totalPages) || 0}
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
                </div>
            </div>
            
            
            <div className="d-flex justify-content-end mt-3" >
                <div>
                    <Button
                        id="payrollsettingadjustment_addadjustment_adjtypebtn"
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
                        {id ? 'Update Recurring' : 'Create Recurring'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="row w-100 px-5">
                    <Formik
                    innerRef={formRef}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
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
                            ErrorSwal.fire({
                                title: 'Warning!',
                                text: "Please fill all the required fields",
                                didOpen: () => {
                                  const confirmButton = Swal.getConfirmButton();
                        
                                  if(confirmButton)
                                    confirmButton.id = "payrollsettingadjustment_warningconfirm_alertbtn"
                                },
                                icon: 'warning',
                            })
                           }else{
                            if(values.id) {
                                RequestAPI.putRequest(Api.editAdjustmentType, "" , valuesObj, {}, async (res: any) => {
                                    Swal.close()
                                    const { status, body = {data: {}, error: {}}}: any = res
    
                                    if (status === 200 || status === 201) {
                                        console.log("update")
                                        if (body.error && body.error.message) {
                                            ErrorSwal.fire({
                                                title: 'Error!',
                                                text: (body.error && body.error.message) || "",
                                                didOpen: () => {
                                                  const confirmButton = Swal.getConfirmButton();
                                        
                                                  if(confirmButton)
                                                    confirmButton.id = "payrollsettingadjustment_errorconfirm3_alertbtn"
                                                },
                                                icon: 'error',
                                            })
                                          } else {
                                            ErrorSwal.fire({
                                                title: 'Update Successfully!',
                                                text: (body.data) || "",
                                                didOpen: () => {
                                                  const confirmButton = Swal.getConfirmButton();
                                        
                                                  if(confirmButton)
                                                    confirmButton.id = "payrollsettingadjustment_successconfirm2_alertbtn"
                                                },
                                                icon: 'success',
                                            })
                                            setModalShow(false)
                                            getAllAdjustmentType(0)
                                            values.id = null
    
    
                            
                                          }
                                    }else {
                                          ErrorSwal.fire({
                                            title: 'Error!',
                                            text: "Something Error.",
                                            didOpen: () => {
                                              const confirmButton = Swal.getConfirmButton();
                                    
                                              if(confirmButton)
                                                confirmButton.id = "payrollsettingadjustment_errorconfirm4_alertbtn"
                                            },
                                            icon: 'error',
                                        })
                                    }
                                })
                            }else{
                                RequestAPI.postRequest(Api.addAdjustmentType, "", valuesObj, {}, async (res: any) => {
                                    const { status, body = { data: {}, error: {} } }: any = res
                                    console.log("create")
    
                                    if (status === 200 || status === 201) {
                                    if (body.error && body.error.message) {
                                        ErrorSwal.fire({
                                            title: 'Error!',
                                            text: (body.error && body.error.message) || "",
                                            didOpen: () => {
                                              const confirmButton = Swal.getConfirmButton();
                                    
                                              if(confirmButton)
                                                confirmButton.id = "payrollsettingadjustment_errorconfirm5_alertbtn"
                                            },
                                            icon: 'error',
                                        })
                                    } else {
                                            ErrorSwal.fire({
                                                title: 'Success!',
                                                text: (body.data) || "",
                                                didOpen: () => {
                                                  const confirmButton = Swal.getConfirmButton();
                                        
                                                  if(confirmButton)
                                                    confirmButton.id = "payrollsettingadjustment_successconfirm3_alertbtn"
                                                },
                                                icon: 'success',
                                            })
                                        getAllAdjustmentType(0, pageSize)
                                        setModalShow(false)
    
                                    }
                                    } else {
                                    ErrorSwal.fire({
                                        title: 'Error!',
                                        text: "Something Error",
                                        didOpen: () => {
                                          const confirmButton = Swal.getConfirmButton();
                                
                                          if(confirmButton)
                                            confirmButton.id = "payrollsettingadjustment_errorconfirm6_alertbtn"
                                        },
                                        icon: 'error',
                                    })
                                    }
                                })
                            }
                           }
                        
                    }}
                    >
                    {({ values, setFieldValue, handleSubmit, errors, touched, isValid}) => {
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
                                            {errors.name && touched.name && (
                                                <p id="payrollsettingadjustment_errorname_formp" style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>
                                            )}
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
                                            {errors.description && touched.description && (
                                                <p id="payrollsettingadjustment_errordescription_formp" style={{ color: "red", fontSize: "12px" }}>{errors.description}</p>
                                            )}
                                    </div>
                                    <div className="form-group col-md-4 mb-3">
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
                                            id="payrollsettings_type2"
                                            value={values.type}
                                            onChange={(e) => setFormField(e, setFieldValue)}
                                            className="formControl"
                                            >
                                                <option value="" disabled selected>
                                                    Type
                                                </option>
                                                <option value="Taxable">Taxable</option>
                                                <option value="Non_Taxable">Non-Taxable</option>
                                            </select>
                                            {errors.type && touched.type && (
                                                <p id="payrollsettingadjustment_errortype_formp" style={{ color: "red", fontSize: "12px" }}>{errors.type}</p>
                                            )}
                                    </div>
                                    <div className="form-group col-md-4 mb-3">
                                        <label>Action</label>
                                        <select
                                            name="deduction"
                                            id="payrollsettings_adj_action"
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
                                            {errors.deduction && touched.deduction && (
                                                <p id="payrollsettingadjustment_erroraction_formp" style={{ color: "red", fontSize: "12px" }}>{errors.deduction}</p>
                                            )}
                                    </div>
                                    <div className="form-group col-md-4 mb-3">
                                        <label>Gross Affected</label>
                                        <select
                                            name="affectsGross"
                                            id="payrollsetting_adj_grossaffected"
                                            className="form-control"
                                            value={values.affectsGross}
                                            onChange={(e) => setFormField(e, setFieldValue)}
                                            >
                                                <option value="" disabled selected>Gross Affected</option>
                                                <option value={true}>Yes</option>
                                                <option value={false}>No</option>
                                            </select>
                                            {errors.affectsGross && touched.affectsGross && (
                                                <p id="payrollsettingadjustmentent_errorgaffectsgross_formp" style={{ color: "red", fontSize: "12px" }}>{errors.affectsGross}</p>
                                            )}
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end px-5">
                                    <button
                                        id="payrollsettingadjustment_save_formbtn"
                                        type="submit"
                                        className="btn btn-primary mx-2"
                                        disabled={!isValid}
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
