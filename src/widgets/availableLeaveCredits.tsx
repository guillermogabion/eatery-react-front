import React, { useState, useEffect, useRef } from "react";
import { RequestAPI, Api } from "../api";
import { Utility } from "../utils"
import { async } from "validate.js";
import { Card, Button, Modal, Form, Table } from "react-bootstrap";
import { vacation_leave, sick_leave, leave_button } from "../assets/images";
import { auto } from "@popperjs/core";
import { Formik } from "formik"
import * as Yup from "yup"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { useSelector } from "react-redux"
import moment from "moment"
import http from "../helpers/axios"

const ErrorSwal = withReactContent(Swal)

let initialPayload = {
  "dateFrom": "",
  "dateTo": "",
  "type": 1,
  "status": "PENDING",
  "reason": "",
  "leaveBreakdown": [],
  "file": null 
}



const AvailableLeaveCredits = () => {
  const [getMyLeaves, setGetMyLeaves] = useState<any>([])
  const [ showModal , setShowModal ] = React.useState(false)
  const [initialValues, setInitialValues] = useState<any>(initialPayload)
  const [leaveBreakdown, setLeaveBreakdown] = useState<any>([]);
  const [leaveTypes, setLeaveTypes] = useState<any>([]);
  const [holidays, setHolidays] = useState<any>([])
  const [dayTypes, setDayTypes] = useState<any>([]);
  const [leaveId, setLeaveId] = useState<any>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const formRef: any = useRef()
  const [values, setValues] = useState({
    dateFrom: '',
    dateTo: '',
  });

  function calculateWorkingDays(startDate, endDate) {
    let currentDate = new Date(startDate);
    let totalDays = 0;
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sundays (0) and Saturdays (6)
        totalDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  return totalDays;
  }
  const setFormField = (e: any, setFieldValue: any) => {
    if (setFieldValue) {
      const { name, value } = e.target
      setFieldValue(name, value)
      setFieldValue("formoutside", true)
    }
  }
  const setDateOption = (index: any, value: any, dayType: any = null) => {
    if (leaveBreakdown) {
      const valuesObj: any = { ...leaveBreakdown }
      if (valuesObj) {
        valuesObj[index].credit = value
        valuesObj[index].dayType = dayType
      }
      const valuesObjDayType: any = { ...dayTypes }
      if (valuesObjDayType) {
        if (value == .5) {
          valuesObjDayType[index] = true
        }
        else {
          valuesObjDayType[index] = false
        }
        setDayTypes(valuesObjDayType)
      }
    }
  }
  const dateBreakdown = (dFrom: any, dTo: any) => {
    const date1 = moment(dFrom);
    const date2 = moment(dTo);
    let leavesBreakdown = [];
    let dayTypesArray = [];
    let diffInDays = date2.diff(date1, 'days') + 1;
    let dateCounter = 0;
  
    for (let index = 1; index <= diffInDays; index++) {
      var added_date = moment(dFrom).add(dateCounter, 'days');
      let new_date = new Date(added_date.format('YYYY-MM-DD'));
  
      if (new_date.getDay() == 0 || new_date.getDay() == 6) {
        dateCounter += 1;
      } else if (new_date.getDay() == 6) {
        dateCounter += 2;
      } else {
        let new_date_with_counter = moment(dFrom).add(dateCounter, 'days').format('YYYY-MM-DD');
        if (!holidays.includes(new_date_with_counter)) {
          leavesBreakdown.push({
            "date": new_date_with_counter,
            "credit": 1,
            "dayType": 'WHOLEDAY'
          });
        }
        dayTypesArray.push(false);
        dateCounter += 1;
      }
    }
  
    setDayTypes(dayTypesArray);
    setLeaveBreakdown(leavesBreakdown);
  
    if (leavesBreakdown.length <= 30) {
      console.log(leavesBreakdown.length);
    } else {

      if (!leaveId) {
        initialValues.breakdown = [];
        setLeaveBreakdown([]);
        setDayTypes([]);
        formRef.current?.resetForm();
      }else{
        leavesBreakdown.pop(); 
        setShowModal(false)
      }
      
      ErrorSwal.fire({
        title: 'Error!',
        text: 'Total number of leave should not exceed 30 days',
        didOpen: () => {
          const confirmButton = Swal.getConfirmButton();
          if (confirmButton)
            confirmButton.id = "availableleavecredits_errorconfirm_alertbtn";
        },
        icon: 'error',
      });
    }
  };
  useEffect(() => {
    RequestAPI.getRequest(
      `${Api.getMyLeave}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body && body.data) {
          setGetMyLeaves(body.data)
          console.log(body.data);
        } else {
        }
      }
    )
    RequestAPI.getRequest(
      `${Api.leaveTypes}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body && body.data) {
          setLeaveTypes(body.data)
        } else {
        }
      }
    )
    RequestAPI.getRequest(
      `${Api.leaveDayTypes}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body && body.data) {
          setLeaveTypes(body.data)
        } else {
        }
      }
    )
    
    RequestAPI.getRequest(
      `${Api.allHoliday}?size=10&sort=id&sortDir=desc&dateBefore=${moment().year() + "-01-01"}&dateAfter=${moment().year() + "-12-31"}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body && body.data) {
          let tempArray: any = []
          body.data.content.forEach((element: any, index: any) => {
            if (!tempArray.includes(element.holidayDate)) {
              tempArray.push(element.holidayDate)
            }
          });
          setHolidays(tempArray)
        }
      }
    )
    }, 
  [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };
  const handleSubmit = (values: any) => {
    const dateFromChecker = new Date(values.dateFrom);
    const currentDateChecker = new Date();
    const timeDifferenceInMilliseconds = dateFromChecker.getTime() - currentDateChecker.getTime();
    const timeDifferenceInDays = calculateWorkingDays(currentDateChecker, dateFromChecker);
    const breakdownLength = leaveBreakdown.length;
    console.log("breakdownLength:", breakdownLength);
  
    if (breakdownLength >= 8 && values.type === 1) {
      ErrorSwal.fire({
        title: 'Error!',
        text: `Leave type SICK LEAVE must not exceed 7 working days. The user requested a total of ${breakdownLength} days`,
        didOpen: () => {
          const confirmButton = Swal.getConfirmButton();
          if (confirmButton)
            confirmButton.id = "availableleavecredits_errorconfirm2_alertbtn";
        },
        icon: 'error',
      });
    }else if (timeDifferenceInDays >= 7 && values.type === 1) {
      ErrorSwal.fire({
        title: 'Error!',
        text: "Selected 'Date From' must be within 7 working days from the date of selection.",
        didOpen: () => {
          const confirmButton = Swal.getConfirmButton();
          if (confirmButton)
            confirmButton.id = "availableleavecredits_errorconfirm3_alertbtn";
        },
        icon: 'error',
      });
    }else {
      const loadingSwal = Swal.fire({
        title: '',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const formData = new FormData();
      formData.append('dateFrom', values.dateFrom);
      formData.append('dateTo', values.dateTo);
      formData.append('type', values.type);
      formData.append('status', values.status);
      formData.append('reason', values.reason);
      leaveBreakdown.forEach((item:any, index:any) => {
        formData.append(`breakdown[${index}].date`, item.date);
        formData.append(`breakdown[${index}].credit`, item.credit);
        formData.append(`breakdown[${index}].dayType`, item.dayType);
      })
      if (values.file) {
        formData.append("file", values.file);
      }
      return http
        .post(`${Api.requestLeaveCreate}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${Utility.getUserToken() || ""}`,
            credentials: true,
          },
        })
        .then((response) => {
          if (response.data.error){
            ErrorSwal.fire({
              title: 'Error!',
              text: response.data.error.message || "",
              didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                if (confirmButton)
                  confirmButton.id = "availableleavecredits_errorconfirm4_alertbtn";
              },
              icon: 'error',
            });
            return 

          }else{
            ErrorSwal.fire({
              title: 'Success!',
              text: response.data.data || "",
              didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                if (confirmButton)
                  confirmButton.id = "availableleavecredits_successconfirm_alertbtn";
              },
              icon: 'success',
            });
            setShowModal(false)
          }
          
          return response;
        })
        .catch((error) => {
          console.error("Error:", error);
          ErrorSwal.fire({
            title: 'Error!',
            text: error.data.data || "",
            didOpen: () => {
              const confirmButton = Swal.getConfirmButton();
              if (confirmButton)
                confirmButton.id = "availableleavecredits_errorconfirm5_alertbtn";
            },
            icon: 'error',
          });
        }
      );
    };
  }
  return (
    <div className="time-card-width">
      <div className="card-header">
        <span>Available Leave Credits</span>
      </div>
      <div className="card-leave">
        <div className="row credit-record ">
          <div className="col-6 pl-12">
              <img src={vacation_leave} width={120} alt="" />
          </div>
          <div className="col-6 pl-12">
          {getMyLeaves.map((leave: any) => (
            <div key={leave.id}>
              <p className="card-leave-credit" id="leaves_name_leavecreditsp">
                {leave.leaveName === "Vacation Leave" ? ` ${leave.creditsLeft}` : ''}
              </p>
              <span className="leave-label">
                {leave.leaveName === "Vacation Leave" ? "Vacation Days" : ''}
              </span>
            </div>
          ))
          }
          </div>
          <div className="col-6 pl-12">
            <img src={sick_leave} width={120} alt="" />
          </div>
          <div className="col-6 pl-12">
          {getMyLeaves.map((leave: any) => (
            <div key={leave.id}>
              <p className="card-leave-credit" id="leaves_name_leavecreditsp">
                  {leave.leaveName === "Sick Leave" ? ` ${leave.creditsLeft}` : ''}
              </p>
              <span className="leave-label">
                  {leave.leaveName === "Sick Leave" ? "Sickness Days" : ''}
              </span>
            </div>
            ))
          }
          </div>
            
        </div>
        <div className="d-flex justify-content-center row request-leave-button mx-3 ">
          <Button id="availableleavecredits_requestimeoff_btn"
          style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
          onClick={() => {setShowModal(true)}}
          >
            <img src={leave_button} width={20} alt="" style={{ marginRight: '8px' }}/>
            Request Time-Off
          </Button>
        </div>
      </div>
      <Modal
        show={showModal}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        onHide={() => {
          setShowModal(false)
        }}
        dialogClassName="modal-90w"
      >  
        <Modal.Header>
          <Modal.Title className="text-center mx-auto">
            Leave Application
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="row px-5">
          <Formik
            innerRef={formRef}
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={
              Yup.object().shape({
                dateFrom: Yup.string().required("Date from is required !"),
                dateTo: Yup.string().required("Date to is required !"),
                status: Yup.string().required("Status is required !"),
                type: Yup.string().required("Status is required !"),
                reason: Yup.string().required('Reason is required').max(250, 'Reason must be at most 200 characters'),
              })
            }
            onSubmit={handleSubmit}
          >
          {({ values, setFieldValue, handleSubmit, errors, touched }) => {
            return (
              <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
                <div className="row mb-2">
                  <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                    
                      <label>Leave Type</label>
                      <select
                        className="form-select"
                        name="type"
                        id="availableleavecredits_leavetype_input"
                        value={values.type}
                        // onChange={(e) => setFormField(e, setFieldValue)}>
                        onChange={(e) => {
                        setFormField(e, setFieldValue);

                        }}
                      >
                        {leaveTypes &&
                        leaveTypes.length &&
                        leaveTypes.map((item: any, index: string) => (
                          <option key={`${index}_${item.id}`} value={item.id}>
                          {item.name}
                          </option>
                        ))}
                      </select>
                  </div>
                  <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <div className="">
                      <label>Remaining Leave Credits</label>
                        {getMyLeaves.map((leave: any) => (
                          <div key={leave.id}>
                            <div className="row">
                              <div className="col-6">
                                <span className="leave-credits">{leave.leaveName} :</span>
                              </div>
                              <div className="col-6" style={{textAlign: 'right'}}> {leave.creditsLeft}</div>
                            </div>
                          </div>
                          ))
                        }
                    </div>
                  </div>

                  </div>
                  
                  <div className="row pb-2">
                    <div className="col-12">
                      <label>Date(s)</label>
                    </div>
                      <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 mb-2">
                          {/* <div className="pb-5"> */}
                              <input type="date"
                                  name="dateFrom"
                                  id="availableleavecredits_datefrom_input"
                                  className="form-control"
                                  value={values.dateFrom}
                                  // max={(new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]}
                                  onChange={(e) => {
                                  setFormField(e, setFieldValue)
                                  dateBreakdown(e.target.value, values.dateTo)
                                  }}
                                  placeholder="dd/mm/yyyy"
                              />
                              {errors && errors.dateFrom && (
                                  <p id="availableleavecredits_leavetypeerror_p" style={{ color: "red", fontSize: "12px" }}>{errors.dateFrom}</p>
                              )}
                          </div>
                          {/* </div> */}
                          {/* <div>
                              <span className="font-bold">Please State a Reason</span>
                              <br />
                              <label>Maximum of 250 characters only</label>
                              <textarea
                                  rows={4}
                                  name="reason"
                                  id="availableleavecredits_reason_input"
                                  className={`form-control p-2${touched.reason && errors.reason ? 'is-invalid' : ''}`}
                                  value={values.reason}
                                  onChange={(e) => setFormField(e, setFieldValue)}
                              />
                              {errors && errors.reason && (
                                  <p id="availableleavecredits_reasonerror_p" style={{ color: "red", fontSize: "12px" }}>{errors.reason}</p>
                              )}
                              <small className="form-text text-muted">{values.reason.length}/250 characters</small>
                          </div> */}
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 ">
                            {/* <div className="mt-4"> */}
                                <input type="date"
                                    name="dateTo"
                                    id="availableleavecredits_dateto_input"
                                    className="form-control"
                                    value={values.dateTo}
                                    min={values.dateFrom}
                                    onChange={(e) => {
                                    setFormField(e, setFieldValue)
                                    dateBreakdown(values.dateFrom, e.target.value)
                                    if (leaveBreakdown.length > 30) {
                                        const lastDate = leaveBreakdown[29].date;
                                        setFieldValue('dateTo', values.dateTo);
                                    }
                                    }}
                                />
            
            
                                {errors && errors.dateTo && (
                                    <p id="availableleavecredits_datetoerror_p" style={{ color: "red", fontSize: "12px" }}>{errors.dateTo}</p>
                                )}
                          </div>
                        </div>
                        <div className="row d-flex">
                          <div className="col-12">
                            <span className="font-bold">Please State a Reason</span>
                            <br />
                            <label>Maximum of 250 characters only</label>
                          </div>
                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 ">
                            <textarea
                                rows={4}
                                name="reason"
                                id="availableleavecredits_reason_input"
                                className={`form-control p-2${touched.reason && errors.reason ? 'is-invalid' : ''}`}
                                value={values.reason}
                                onChange={(e) => setFormField(e, setFieldValue)}
                            />
                            {errors && errors.reason && (
                                <p id="availableleavecredits_reasonerror_p" style={{ color: "red", fontSize: "12px" }}>{errors.reason}</p>
                            )}
                            <small className="form-text text-muted">{values.reason.length}/250 characters</small>
                            </div>

                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 ">
                              <input type="file" accept=".jpg, .png, .pdf, .doc" name="fileInput" style={{width: '100%', marginBottom: '0'}} className="file-input-style" onChange={(e) => {
                                  setFieldValue("file", e.currentTarget.files[0]);
                                }} />
                                <small className="form-text text-muted " style={{lineHeight: '0'}}>(3MB maximum file size. Allowed file types; jpg, png, pdf, doc)</small>
                            </div>
                        </div>
                           
                       
                      

                  <div className="pt-4">
                      <span className="font-bold">BREAKDOWN</span>
                      <Table responsive style={{ maxHeight: '100vh' }}>
                      <thead>
                        <tr>
                          <th style={{ width: 'auto' }}>Date</th>
                          <th style={{ width: 'auto' }}>Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          leaveBreakdown &&
                          leaveBreakdown.length > 0 &&
                          leaveBreakdown.map((item: any, index: any) => {
                            const { date } = item
                            return (
                              <tr>
                                <td key={index + 'date'} >{date}</td>
                                <td key={index} >
                                  <div className="row d-flex">
                                    <div className="col-xs-6 col-sm-6 col-md-2 col-lg-2">
                                      <input
                                        type="radio"
                                        name={"leaveCredit" + index.toString()}
                                        id={"availleaveCreditWhole" + index.toString()}
                                        checked={item.credit == 1}
                                        onChange={() => {
                                          setDateOption(index, 1, 'WHOLEDAY')
                                        }}
                                      />
                                      <label id="leaves_wholeday_leavebreakdownlabel" htmlFor={"leaveCreditWhole" + index.toString()}
                                        style={{ marginRight: 10 }}>Whole Day</label>
                                      </div>
                                    <div className="col-xs-6 col-sm-6 col-md-2 col-lg-2">
                                      <input
                                        type="radio"
                                        name={"leaveCredit" + index.toString()}
                                        id={"availleaveCreditDay" + index.toString()}
                                        checked={item.credit == 0.5}
                                        onChange={() => {
                                          setDateOption(index, .5, "FIRST_HALF")
                                        }}
                                      /> <label id="leaves_halfday_leavebreakdownlabel" htmlFor={"leaveCreditDay" + index.toString()}
                                        style={{ paddingTop: -10, marginRight: 10 }}>Half Day</label>
                                    </div>
                                  </div>
                                  
                                  
                                  {
                                    item.dayType != 'WHOLEDAY' ?
                                      <>
                                        <br />
                                        <div className="row d-flex">
                                          <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                                            <div className="row d-flex">
                                              <div className="col-6">
                                                <input
                                                  type="radio"
                                                  name={"dayTypes" + index.toString()}
                                                  id={"availleaveCreditWhole1" + index.toString()}
                                                  checked={item.dayType == 'FIRST_HALF'}
                                                  onChange={() => setDateOption(index, .5, "FIRST_HALF")}
                                                />
                                                <label id="leaves_leavecreditfirsthalf_leavebreakdownlabel" htmlFor={"leaveCreditWhole1" + index.toString()}
                                                style={{ marginRight: 10 }}>First Half</label>
                                              </div>
                                              <div className="col-6">
                                                <input
                                                  type="radio"
                                                  name={"dayTypes" + index.toString()}
                                                  checked={item.dayType == 'SECOND_HALF'}
                                                  id={"availleaveCreditDay1" + index.toString()}
                                                  onChange={() => setDateOption(index, .5, "SECOND_HALF")}
                                                />
                                                <label id="availleaves_leavecreditsecondhalf_leavebreakdownlabel" htmlFor={"leaveCreditDay1" + index.toString()}
                                                style={{ paddingTop: -10, marginRight: 10, fontSize: '10px' }}>Second Half</label>
                                              </div>
                                              
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                      :
                                      null
                                  }
                                </td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </Table>
                    {
                      leaveBreakdown &&
                        leaveBreakdown.length == 0 ?
                        <div className="w-100 text-center">
                          <label htmlFor="">No Records Found</label>
                        </div>
                        :
                        null
                    }

                  </div>
                <br />
                {/* <Modal.Footer>
                <div className="d-flex flex-column justify-content-center align-items-center">
                  <div className="row d-flex flex-column px-3">
                    <div className="col-12 mb-2">
                      <button
                        id="availableleavecredits_save_btn"
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={leaveBreakdown.length === 0 || leaveBreakdown.length > 30}
                      >
                        Save
                      </button>
                    </div>
                    <div className="col-12">
                      <button
                        onClick={() => {
                          setShowModal(false);
                        }}
                        id="availableleavecredits_btn_cancel"
                        type="button"
                        className="btn btn-outline custom-grey-button w-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>

                </Modal.Footer> */}
                <Modal.Footer>
                  <div className="d-flex justify-content-end ">
                    
                      <div className="mb-2">
                        <button
                          style={{width: '100px', textAlign: 'center', }}
                          id="availableleavecredits_save_btn"
                          type="submit"
                          className="btn btn-primary mr-2"
                          disabled={leaveBreakdown.length === 0 || leaveBreakdown.length > 30}
                        >
                          <span className="mt-1 pt-2"> Save</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowModal(false);
                          }}
                          id="availableleavecredits_btn_cancel"
                          type="button"
                          className="btn btn-outline custom-grey-button pb-2"
                        >
                          Cancel
                        </button>
                      </div>
                      {/* <div className="col-12">
                        <button
                          onClick={() => {
                            setShowModal(false);
                          }}
                          id="availableleavecredits_btn_cancel"
                          type="button"
                          className="btn btn-outline custom-grey-button w-100"
                        >
                          Cancel
                        </button>
                      </div> */}
                  </div>
                </Modal.Footer>

              </Form>
            )
          }}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  )
}
export default AvailableLeaveCredits