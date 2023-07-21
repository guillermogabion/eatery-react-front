import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Api, RequestAPI } from "../../api";
import Table from 'react-bootstrap/Table';
import { Formik } from "formik";
import * as Yup from "yup";
import { async } from "validate.js";

const ErrorSwal = withReactContent(Swal);

const Overtime = (props) => {
  const [overtime, setOvertime] = useState([]);
  const [overtimeInfo, setOvertimeInfo] = useState([]);
  const formRef = useRef();
  const [modalShow, setModalShow] = useState(false);
  const [selectedOvertime, setSelectedOvertime] = useState(null);

  const tableHeaders = [
    '',
    'First 8 Hours',
    'OT',
    'ND',
    'NDOT',
    'Action',
  ];

  const getAllOvertime = () => {
    RequestAPI.getRequest(
      `${Api.getOvertimeSetting}`,
      "",
      {},
      {},
      async (res) => {
        const { status, body = { data: {}, error: {} } } = res;
        if (status === 200 && body && body.data) {
          if (body.data) {
            setOvertime(body.data);
          }
        } else {
          // Handle error
        }
      }
    );
  };

  useEffect(() => {
    getAllOvertime();
    RequestAPI.getRequest(
      `${Api.getAllOvertime}`,
      "",
      {},
      {},
      async (res) => {
        const { status, body = { data: {}, error: {} } } = res;
        if (status === 200 && body && body.data) {
          if (body.error && body.error.message) {
            // Handle error
          } else {
            let tempArray = [];
            body.data.forEach((d, i) => {
              tempArray.push({
                overtimeName: d.name,
              });
            });
            setOvertimeInfo(tempArray);
          }
        }
      }
    );
  }, []);

  const executeSubmit = (values, actions) => {
    const loading = Swal.fire({
        title: '',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    })
    const valueObj : any = { ...values }

    RequestAPI.postRequest(Api.updateOvertimeSetting, "", valueObj, {},
        async (res) => {
            const { status, body = { data: {}, error: {} } } = res;
                
            if (status === 200 || status == 201) {
                if (body.error && body.error.message) {
                    ErrorSwal.fire(
                        "Error!",
                        body.error.message || "",
                        "error"
        
                    );
                } else {
                    setModalShow(false)
                    ErrorSwal.fire(
                        "Updated Successfully!",
                        body.data || "",
                        "success"
                    ).then((result) => {
                        if (result.isConfirmed) {
                        location.reload();
                        }
                    });
                    // handleCloseModal();
                    }
            }else {
                ErrorSwal.fire("Error!", "Something Error.", "error");
            }
        }
    )
  }

  const handleModalHide = useCallback(() => {
    setModalShow(false);
    formRef.current?.resetForm();
  }, []);

  return (
    <div>
      <Table responsive="lg">
        <thead>
          <tr>
            {tableHeaders &&
              tableHeaders.length &&
              tableHeaders.map((item, index) => {
                return (
                  <th style={{ width: 'auto' }} key={index}>{item}</th>
                );
              })}
          </tr>
        </thead>
        <tbody>
          {overtime &&
            overtime.length > 0 &&
            overtime.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.firstEight}</td>
                  <td>{item.ot}</td>
                  <td>{item.nd}</td>
                  <td>{item.ndot}</td>
                  <td>
                    <label
                      onClick={() => {
                        setModalShow(true);
                        setSelectedOvertime(item);
                      }}
                      className="text-muted cursor-pointer"
                    >
                      Update
                    </label>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      {overtime && overtime.length === 0 ? (
        <div className="w-100 text-center">
          <label htmlFor="">No Records Found</label>
        </div>
      ) : null}
      <Modal
        show={modalShow}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-90w"
        onHide={handleModalHide}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-v-center">
             Update Overtime Setting
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="row w-100 px-5">
          {selectedOvertime !== null && (
            <Formik
              innerRef={formRef}
              enableReinitialize={true}
              validationSchema={Yup.object().shape({
                name: Yup.string().required("Name is required"),
                firstEight: Yup.number().required("This Field is required"),
                ot: Yup.number().required("This Field is required"),
                nd: Yup.number().required("This Field is required"),
                ndot: Yup.number().required("This Field is required"),
              })}
              initialValues={{
                name: selectedOvertime.name || "",
                firstEight: selectedOvertime.firstEight || 0,
                ot: selectedOvertime.ot || 0,
                nd: selectedOvertime.nd || 0,
                ndot: selectedOvertime.ndot || 0,
              }}
              onSubmit={executeSubmit}
            >
              {({ values, setFieldValue, handleSubmit, errors, touched, isValid }) => {
                return (
                  <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
                    <div className="row w-100 px-5">
                      <div className="form-group col-md-6 mb-3">
                        <label>Name</label>
                        <input
                          readOnly
                          type="text"
                          name="name"
                          className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                          value={values.name}
                          onChange={(e) => {
                            setFieldValue('name', e.target.value);
                          }}
                        />
                        {touched.name && errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>
                      <div className="form-group col-md-6 mb-3">
                        <label>First 8 Hours</label>
                        <input
                          type="number"
                          name="firstEight"
                          className={`form-control ${touched.firstEight && errors.firstEight ? 'is-invalid' : ''}`}
                          value={values.firstEight}
                          onChange={(e) => {
                            setFieldValue('firstEight', e.target.value);
                          }}
                        />
                        {touched.firstEight && errors.firstEight && <div className="invalid-feedback">{errors.firstEight}</div>}
                      </div>
                      <div className="form-group col-md-4 mb-3">
                        <label>OT</label>
                        <input
                        type="number"
                        name="ot"
                        className={`form-control ${touched.ot && errors.ot ? 'is-invalid' : ''}`}
                        value={values.ot}
                        onChange={(e) => {
                            setFieldValue('ot', e.target.value);
                        }}
                        onKeyPress={(e) => {
                            if (e.key === '-' || e.key === '+') {
                                e.preventDefault();
                            }
                        }}
                        />
                        {touched.ot && errors.ot && <div className="invalid-feedback">{errors.ot}</div>}
                      </div>
                     
                      <div className="form-group col-md-4 mb-3">
                        <label>ND</label>
                        <input
                        type="number"
                        name="nd"
                        className={`form-control ${touched.nd && errors.nd ? 'is-invalid' : ''}`}
                        value={values.nd}
                        onChange={(e) => {
                            setFieldValue('nd', e.target.value);
                        }}
                        onKeyPress={(e) => {
                            if (e.key === '-' || e.key === '+') {
                                e.preventDefault();
                            }
                        }}
                        />
                        {touched.nd && errors.nd && <div className="invalid-feedback">{errors.nd}</div>}
                      </div>
                      <div className="form-group col-md-4 mb-3">
                        <label>NDOT</label>
                        <input
                        type="number"
                        name="ndot"
                        className={`form-control ${touched.ot && errors.ot ? 'is-invalid' : ''}`}
                        value={values.ndot}
                        onChange={(e) => {
                            setFieldValue('ndot', e.target.value);
                        }}
                        onKeyPress={(e) => {
                            if (e.key === '-' || e.key === '+') {
                                e.preventDefault();
                            }
                        }}
                        />
                        {touched.ot && errors.ot && <div className="invalid-feedback">{errors.ot}</div>}
                      </div>
                    </div>
                   
                    <div className="d-flex justify-content-end px-5">
                      <button
                        type="submit"
                        className="btn btn-primary mx-2"
                        disabled={!isValid}
                      >
                        Save
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Overtime;
