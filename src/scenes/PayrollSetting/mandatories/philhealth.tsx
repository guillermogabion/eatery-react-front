import React, { useCallback, useEffect, useRef, useState } from "react"
import { Button, Modal, Form } from "react-bootstrap"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Api, RequestAPI } from "../../../api"
import Table from 'react-bootstrap/Table'
import ReactPaginate from 'react-paginate'
import { Formik } from "formik"
import { async } from "validate.js"
import { Utility } from "../../../utils"
import { action_decline, action_edit } from "../../../assets/images"


const ErrorSwal = withReactContent(Swal)


const philhealth = (props: any) => {

  const [ph, setPH] = useState([]);
  const formRef: any = useRef()
  const [ modalShow, setModalShow ] = React.useState(false);
  const [id, setId] = useState(null);
  const [basicLowerRange, setBasicLowerRange] = useState(0);
  const [basicUpperRange, setBasicUpperRange] = useState(0);
  const [hdmfData, setHdmfData] = useState({
      basicLowerRange: 0,
      basicUpperRange: 0,
      premiumRate: 0,
    });
  const [initialValues, setInitialValues] = useState<any>({
          "amount" : "",
  })
  const tableHeaders = [
      'Basic Lower Range',
      'Basic Upper Range',
      'Premium',
      'Action',
  ];

  const getPHInfo = () => {
      RequestAPI.getRequest(
        `${Api.getPH}`,
        "",
        {},
        {},
        async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res;
          if (status === 200 && body.data) {
            if (body.error && body.error.message) {
              // Handle error if necessary
            } else {
              let tempArray: any[] = [];
              if (typeof body.data === 'object') {
                tempArray.push({
                  basicLowerRange: body.data.basicLowerRange,
                  basicUpperRange: body.data.basicUpperRange,
                  premiumRate: body.data.premiumRate,
                });
              }
              setPH(tempArray);
            }
          } else {
            // Handle error if necessary
          }
        }
      );
    };
    const getHdmfUpdate = () => {
      RequestAPI.getRequest(
        `${Api.getHdmf}`,
        "",
        {},
        {},
        async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res;
          if (status === 200 && body.data) {
            if (body.error && body.error.message) {
              // Handle error if necessary
            } else {
              const { basicLowerRange, basicUpperRange, premiumRate } = body.data;
              setHdmfData({
                basicLowerRange,
                basicUpperRange,
                premiumRate,
              });
            }
          } else {
            // Handle error if necessary
          }
        }
      );
    } 

    useEffect(() => {
      getPHInfo(0)
      getHdmfUpdate();
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
            ErrorSwal.fire({
              title: 'Error!',
              text: body.error.message || '',
              didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
      
                if(confirmButton)
                  confirmButton.id = "payrollsettingphilhealth_errorconfirm_alertbtn"
              },
              icon: 'error',
          })
          } else {
            Swal.close();
            getPHInfo(0)
            ErrorSwal.fire({
              title: 'Success!',
              text: body.data || '',
              didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
      
                if(confirmButton)
                  confirmButton.id = "payrollsettingphilhealth_successconfirm_alertbtn"
              },
              icon: 'success',
          })
          }
        } else {
          Swal.close();
          ErrorSwal.fire({
            title: 'Error!',
            text: 'Somthing went wrong.',
            didOpen: () => {
              const confirmButton = Swal.getConfirmButton();
              if(confirmButton)
                confirmButton.id = "payrollsettingphilhealth_errorconfirm2_alertbtn"
            },
            icon: 'error',
        })
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
          {ph &&
            ph.length > 0 &&
            ph.map((item, index) => {
            return (
              <tr key={index}>
                <td id="payrollsettingphilhealth_basiclowerrange_data">{Utility.formatToCurrency(item.basicLowerRange)}</td>
                <td id="payrollsettingphilhealth_basicupperrange_data">{Utility.formatToCurrency(item.basicUpperRange)}</td>
                <td id="payrollsettingphilhealth_premiumrate_data">  {`${(item.premiumRate / 100).toLocaleString(undefined, {
                    style: 'percent',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}`}
                </td>
                <td>
                  <label
                  id="payrollsettingphilhealth_update_btn"
                  onClick={() => {
                    setModalShow(true)
                    setHdmfData(item);
                  }}
                  className="text-muted cursor-pointer"
                  >
                    <img src={action_edit} width={20} className="hover-icon-pointer mx-1" title="Update" />
                  </label>
                  <br />
                </td>
              </tr>
            );
            })}
          </tbody>
        </Table>
          <Modal
            show={modalShow}
            size="lg"
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
                  Update Philhealth Rates
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="row w-100 px-5">
              <Formik
              innerRef={formRef}
              enableReinitialize={true}
              validationSchema={null}
              initialValues={hdmfData}
              onSubmit={(values, actions) => {
                const loadingSwal = Swal.fire({
                  title: '',
                  allowOutsideClick: false,
                  didOpen: () => {
                      Swal.showLoading();
                  }
                });
                const valuesObj : any = {...values}
                console.log(valuesObj   )
                RequestAPI.postRequest(Api.updatePH, "", valuesObj, {}, async (res: any) => {
                  const { status, body = { data: {}, error: {} } }: any = res
                  console.log("create", valuesObj)
                  if (status === 200 || status === 201) {
                  if (body.error && body.error.message) {
                      ErrorSwal.fire({
                        title: 'Error!',
                        text: (body.error && body.error.message) || '',
                        didOpen: () => {
                          const confirmButton = Swal.getConfirmButton();
                
                          if(confirmButton)
                            confirmButton.id = "payrollsettingphilhealth_errorconfirm3_alertbtn"
                        },
                        icon: 'error',
                    })
                  } else {
                    ErrorSwal.fire({
                      title: 'Updated Successfully!',
                      text: (body.data) || '',
                      didOpen: () => {
                        const confirmButton = Swal.getConfirmButton();
              
                        if(confirmButton)
                          confirmButton.id = "payrollsettingphilhealth_successconfirm2_alertbtn"
                      },
                      icon: 'success',
                    })
                    getPHInfo(0)
                    setModalShow(false)
                  }
                  } else {
                  ErrorSwal.fire({
                    title: 'Error!',
                    text: 'Something Error.',
                    didOpen: () => {
                      const confirmButton = Swal.getConfirmButton();
                      if(confirmButton)
                        confirmButton.id = "payrollsettingphilhealth_errorconfirm4_alertbtn"
                    },
                    icon: 'error',
                  })
                  }
                })
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
                        <div className="form-group col-md-4 mb-3">
                          <label>Basic Lower Range</label>
                            <input
                              type="text"
                              name="basicLowerRange"
                              id="basicLowerRange"
                              className="form-control"
                              value={hdmfData.basicLowerRange}
                              onChange={(e) => {
                                const { value } = e.target;
                                setHdmfData((prevData) => ({
                                  ...prevData,
                                  basicLowerRange: value,
                                }));
                              }}
                            />
                        </div>
                        <div className="form-group col-md-4 mb-3">
                          <label>Basic Upper Range</label>
                          <input
                            type="text"
                            name="basicUpperRange"
                            id="basicUpperRange"
                            className="form-control"
                            value={hdmfData.basicUpperRange}
                            onChange={(e) => {
                              const { value } = e.target;
                              setHdmfData((prevData) => ({
                                ...prevData,
                                basicUpperRange: value,
                              }));
                            }}
                          />
                        </div>
                        <div className="form-group col-md-4 mb-3">
                          <label>Premium Rate</label>
                          <input
                            type="text"
                            name="premiumRate"
                            id="premiumRate"
                            className="form-control"
                            value={hdmfData.premiumRate}
                            onChange={(e) => {
                                const { value } = e.target;
                                setHdmfData((prevData) => ({
                                  ...prevData,
                                  premiumRate: value,
                                }));
                              }}
                          />
                        </div>
                      </div>
                      <div className="d-flex justify-content-end px-5">
                        <button
                          id="payrollsettingphilhealth_save_formbtn"
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

export default philhealth;
