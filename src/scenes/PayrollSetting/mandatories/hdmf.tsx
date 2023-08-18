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

interface HDMFItem {
  amount: string; // Replace string with the appropriate type for amount
}


const hdmf = (props: any) => {
    
    const [hdmf, setHdmf] = useState([]);
    const formRef: any = useRef()
    const [ modalShow, setModalShow ] = React.useState(false);
    const [id, setId] = useState(null);
    const [initialValues, setInitialValues] = useState<any>({
        amount: "",
    })
    const [amount, setAmount] = useState('');

    const tableHeaders = [
        'Employee Share',
        'Employer Share',
        'Action',
    ];

    const getHdmfInfo = () => {
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
                let tempArray: any[] = [];
                if (typeof body.data === 'object' && body.data.amount) {
                  tempArray.push({
                    amount: body.data.amount,
                  });
                }
                setHdmf(tempArray);
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
                const { amount } = body.data;
                setAmount(amount);
              }
            } else {
              // Handle error if necessary
            }
          }
        );
      };
      

    useEffect(() => {
        getHdmfInfo(0)
        getHdmfUpdate()
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
                    text: body.error.message,
                    didOpen: () => {
                      const confirmButton = Swal.getConfirmButton();
            
                      if(confirmButton)
                        confirmButton.id = "payrollsettinghdmf_errorconfirm_alertbtn"
                    },
                    icon: 'error',
                })
              } else {
                Swal.close();
                getHdmfInfo(0)
                ErrorSwal.fire({
                  title: 'Success!',
                  text: body.data || "",
                  didOpen: () => {
                    const confirmButton = Swal.getConfirmButton();
          
                    if(confirmButton)
                      confirmButton.id = "payrollsettinghdmf_successconfirm_alertbtn"
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
                    confirmButton.id = "payrollsettinghdmf_errorconfirm2_alertbtn"
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
      const amountValue = hdmf.length > 0 ? hdmf[0]?.amount : '';
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
  {hdmf &&
    hdmf.length > 0 &&
    hdmf.map((item, index) => {
      return (
        <tr key={index}>
          <td id="payrollsettinghdmf_amount_data">{Utility.formatToCurrency(item.amount)}</td>
          <td id="payrollsettinghdmf_amount2_data">{Utility.formatToCurrency(item.amount)}</td>
          <td>
            <label
              id="payrollsettinghdmf_update_label"
              onClick={() => {
               
                setModalShow(true)
              }}
              className="text-muted cursor-pointer"
            >
              <img src={action_edit} width={20} className="hover-icon-pointer mx-1" title="Update" />
            </label>
            <br />
            {/* <label
              onClick={() => {
                setModalShow(true);
              }}
              className="text-muted cursor-pointer"
            >
              Delete
            </label> */}
          </td>
        </tr>
      );
    })}
</tbody>
            </Table>
            <Modal
             show={modalShow}
             size="sm"
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
                        Update HDMF
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
                        const valuesObj : any = {amount}

                        console.log(valuesObj)
                        RequestAPI.postRequest(Api.updateHDMF, "" , valuesObj, {}, async (res: any) => {
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
                                        confirmButton.id = "payrollsettinghdmf_errorconfirm3_alertbtn"
                                    },
                                    icon: 'error',
                                })
                                } else {
                                  Swal.fire({
                                      title: 'Updated Successfully!',
                                      text: (body.data || ""),
                                      didOpen: () => {
                                        const confirmButton = Swal.getConfirmButton();
                              
                                        if(confirmButton)
                                          confirmButton.id = "payrollsettinghdmf_successconfirm2_alertbtn"
                                      },
                                      icon: 'success',
                                  })
                                  setModalShow(false)
                                  getHdmfInfo()
                                  values.id = null


                  
                                }
                          }else {
                              ErrorSwal.fire({
                                  title: 'Error!',
                                  text: "Something Error.",
                                  didOpen: () => {
                                    const confirmButton = Swal.getConfirmButton();
                          
                                    if(confirmButton)
                                      confirmButton.id = "payrollsettinghdmf_errorconfirm4_alertbtn"
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
                                <div className="row ">
                                    <div className="col-md-12 mb-3">
                                        <label>Amount</label>
                                        <input
                                          type="text"
                                          name="amount"
                                          id="amount"
                                          className="form-control"
                                          value={amount}
                                          onChange={(e) => {
                                            setAmount(e.target.value);
                                          }}
                                        />
                                    </div>
                                   
                                </div>
                                <div className="d-flex justify-content-end px-5">
                                    <button
                                        id="payrollsettinghdmf_save_formbtn"
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

export default hdmf;
