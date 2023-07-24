import React, { useCallback, useEffect, useRef, useState } from "react"
import { Button, Modal, Form } from "react-bootstrap"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Api, RequestAPI } from "../../../api"
import Table from 'react-bootstrap/Table'
import FileUploadMonthly from "./MonthlyTaxUpload"
import FileUploadYearly from "./AnnualTaxUpload"
const ErrorSwal = withReactContent(Swal)




const tax = (props: any) => {
    
    const [taxMonth, setTaxMonth] = useState([]);
    const [taxYear, setTaxYear] = useState([]);
    const [modalMonthlyUploadShow, setModalMonthlyUploadShow] = React.useState(false);
    const [modalYearlyUploadShow, setModalYearlyUploadShow] = React.useState(false);

    const tableMonthlyHeaders = [
        'Compensation Range 1',
        'Compensation Range 2',
        'Fixed Tax',
        'Prescribed Witholding Tax (Decimal)',
        'Non-Taxable Compensation',
    ];
    const tableAnnualHeaders = [
        'Taxable Income Range 1',
        'Taxable Income Range 2',
        'Tax Rate',
        'Fixed Tax',
        'In Excess of Amount',
    ];

    
    const getMonthlyTaxInfo = () => {
        RequestAPI.getRequest(
          `${Api.getMonthTax}`,
          "",
          {},
          {},
          async (res: any) => {
            const { status, body = { data: {}, error: {} } }: any = res
            if (status === 200 && body && body.data) {
            if (body.data) {

                setTaxMonth(body.data)
            }
            } else {

            }
        }
        );
      };
    const getYearlyTaxInfo = () => {
        RequestAPI.getRequest(
          `${Api.getYearTax}`,
          "",
          {},
          {},
          async (res: any) => {
            const { status, body = { data: {}, error: {} } }: any = res
            if (status === 200 && body && body.data) {
            if (body.data) {

                setTaxYear(body.data)
            }
            } else {

            }
        }
        );
      };
    
    
      
      

     useEffect(() => {
        getMonthlyTaxInfo()
        getYearlyTaxInfo()
     }, [])
       
    
    
    const downloadMonthlyTemplate = () => {
        RequestAPI.getFileAsync(
          `${Api.downloadTaxMonthly}`,
          "",
          "TaxMonthlyTemplate.xlsx",
          async (res: any) => {
            if (res) {
            }
          }
        )
      };
    const downloadYearlyTemplate = () => {
        RequestAPI.getFileAsync(
          `${Api.downloadTaxYearly}`,
          "",
          "TaxAnnualTemplate.xlsx",
          async (res: any) => {
            if (res) {
            }
          }
        )
      };
      const handleCloseModal = () => {
        setModalMonthlyUploadShow(false);
        setModalYearlyUploadShow(false);
      };
    return (
        <div>
             <div className="hide-x">
                <div className="w-100 pt-2">
                    <div className="row">
                        <div className="col-md-6">
                            <h3 style={{ fontWeight: 'bold', padding: '10px' }} >Tax Table (Monthly)</h3>
                            <div className="tax-table-container">

                                <Table responsive="lg">
                                        <thead>
                                            <tr className="tax-sticky-header">
                                                {
                                                    tableMonthlyHeaders &&
                                                    tableMonthlyHeaders.length &&
                                                    tableMonthlyHeaders.map((item: any, index: any) => {
                                                        return (
                                                            <th style={{ width: '20px' }}>{item}</th>
                                                            )
                                                            
                                                    })
                                                }
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {
                                                taxMonth &&
                                                taxMonth.length > 0 &&
                                                taxMonth.map((item: any, index: any) => {
                                                    return (
                                                        <tr>
                                                <td id="payrollsettingstax_basicrangelower_data"> { item.basicRangeLower }</td>
                                                <td id="payrollsettingstax_basicrangeupper_data"> { item.basicRangeUpper }</td>
                                                <td id="payrollsettingstax_fixedtax_data"> { item.fixedTax }</td>
                                                <td id="payrollsettingstax_prescribedwitholdingtax_data"> { item.prescribedWitholdingTax }</td>    
                                                <td id="payrollsettingstax_nontaxablecompensation_data"> { item.nonTaxableCompensation }</td>    
                                                </tr>
                                                )
                                            })
                                        }
                                        </tbody>
                                    
                                </Table>
                            </div>
                            <div className="d-flex justify-content-end mt-6 pt-6" >
                                <div>
                                    <Button
                                        id="payrollsettingstax_downloadtemplatemonthly_btn"
                                        className="mx-2"
                                        onClick={downloadMonthlyTemplate}>Download Template ( Monthly )</Button>
                                </div>
                                <div>
                                    <Button
                                        id="payrollsettingstax_uploadtableformonthlytax_btn"
                                        className="mx-2"
                                        onClick={() => {
                                            setModalMonthlyUploadShow(true)
                                        }}>Upload Table for Monthly Tax</Button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h3 style={{ fontWeight: 'bold', padding: '10px' }} >Tax Table (Yearly)</h3>

                            <div className="tax-table-container">
                                <Table responsive="lg">
                                        <thead>
                                            <tr className="tax-sticky-header">
                                                {
                                                    tableAnnualHeaders &&
                                                    tableAnnualHeaders.length &&
                                                    tableAnnualHeaders.map((item: any, index: any) => {
                                                        return (
                                                            <th style={{ width: '20px' }}>{item}</th>
                                                            )
                                                            
                                                    })
                                                }
                                            </tr>
                                        </thead>
                                        <tbody >
                                            {
                                            taxYear &&
                                            taxYear.length > 0 &&
                                            taxYear.map((item: any, index: any) => {
                                                return (
                                                    <tr>
                                                        <td id="payrollsettingstax_basicrangelower_taxyeardata"> { item.basicRangeLower }</td>
                                                        <td id="payrollsettingstax_basicrangeupper_taxyeardata"> { item.basicRangeUpper }</td>
                                                        <td id="payrollsettingstax_taxrate_taxyeardata"> { item.taxRate }</td>
                                                        <td id="payrollsettingstax_fixedtax_taxyeardata"> { item.fixedTax }</td>
                                                        <td id="payrollsettingstax_excessamount_taxyeardata"> { item.excessAmount }</td>    
                                                    </tr>
                                                )
                                            })
                                        }
                                        </tbody>
                                    
                                </Table>
                                </div>
                                <div className="d-flex justify-content-end mt-6 pt-6" >
                                    <div>
                                        <Button
                                            id="payrollsettingstax_downloadtemplateyearly_btn"
                                            className="mx-2"
                                            onClick={downloadYearlyTemplate}>Download Template ( Yearly )</Button>
                                    </div>
                                    <div>
                                        <Button
                                            id="payrollsettingstax_uploadtableforannualtax_btn"
                                            className="mx-2"
                                            onClick={() => {
                                                setModalYearlyUploadShow(true)
                                            }}>Upload Table for Annual Tax</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
            
            <Modal
                show={modalMonthlyUploadShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                onHide={() => setModalMonthlyUploadShow(false)}
                dialogClassName="modal-90w"
            >
                <Modal.Header closeButton>
                <Modal.Title>
                    Upload Excel File (Monthly Tax)
                </Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex align-items-center justify-content-center">
                <div>
                    <FileUploadMonthly onCloseModal={handleCloseModal} />
                </div>

                </Modal.Body>

            </Modal>
            <Modal
                show={modalYearlyUploadShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                onHide={() => setModalYearlyUploadShow(false)}
                dialogClassName="modal-90w"
            >
                <Modal.Header closeButton>
                <Modal.Title>
                    Upload Excel File (Annual Tax)
                </Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex align-items-center justify-content-center">
                <div>
                    <FileUploadYearly onCloseModal={handleCloseModal} />
                </div>

                </Modal.Body>

            </Modal>
          
        </div>
        
        
        
        
    );
    


}

export default tax;
