import React, { useCallback, useEffect, useRef, useState } from "react"
import { Button, Modal, Form } from "react-bootstrap"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Api, RequestAPI } from "../../../api"
import Table from 'react-bootstrap/Table'
import FileUploadMonthly from "./MonthlyTaxUpload"
import FileUploadYearly from "./AnnualTaxUpload"
import { Utility } from "../../../utils"

const ErrorSwal = withReactContent(Swal)




const tax = (props: any) => {
    
    const [taxMonth, setTaxMonth] = useState([]);
    const [taxYear, setTaxYear] = useState([]);
    const [modalMonthlyUploadShow, setModalMonthlyUploadShow] = React.useState(false);
    const [modalYearlyUploadShow, setModalYearlyUploadShow] = React.useState(false);
    const [ taxAnnualModalShow, setTaxAnnualModalShow ] = React.useState(false)
    const [ taxMonthlyModalShow, setTaxMonthlyModalShow ] = React.useState(false)

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
                <div>

                    <Modal
                        show={taxAnnualModalShow}
                        size="xl"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        backdrop="static"
                        keyboard={false}
                        onHide={() => {
                         setTaxAnnualModalShow(false)
                        }}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                            Tax Table (Annual)
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="row w-100 px-5">
                            <div className="w-100 pb-2">
                                <div className="tax-table-container">
                                    <Table responsive>
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
                                                        <td id="payrollsettingstax_basicrangelower_taxyeardata">{Utility.formatToCurrency(item.basicRangeLower)} </td>
                                                        <td id="payrollsettingstax_basicrangeupper_taxyeardata">{Utility.formatToCurrency(item.basicRangeUpper)} </td>
                                                        <td id="payrollsettingstax_taxrate_taxyeardata">{Utility.formatToCurrency(item.taxRate)}</td>
                                                        <td id="payrollsettingstax_fixedtax_taxyeardata"> {Utility.formatToCurrency(item.fixedTax)}</td>
                                                        <td id="payrollsettingstax_excessamount_taxyeardata">{Utility.formatToCurrency(item.excessAmount)}</td>    
                                                    </tr>
                                                )
                                            })
                                        }
                                        </tbody>
                                    
                                    </Table>
                                </div>
                            </div>                  
                        </Modal.Body>
                    </Modal>
                    <Modal
                        show={taxMonthlyModalShow}
                        size="xl"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        backdrop="static"
                        keyboard={false}
                        onHide={() => {
                         setTaxMonthlyModalShow(false)
                        }}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                            Tax Table (Monthly)
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="row w-100 px-5">
                            <div className="w-100 pb-2">
                                <div className="tax-table-container">
                                    <Table responsive>
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
                                                    <td id="payrollsettingstax_basicrangelower_data">{Utility.formatToCurrency(item.basicLowerRange)}</td>
                                                    <td id="payrollsettingstax_basicrangeupper_data"> {Utility.formatToCurrency(item.basicRangeUpper)}</td>
                                                    <td id="payrollsettingstax_fixedtax_data"> { item.fixedTax }</td>
                                                    <td id="payrollsettingstax_prescribedwitholdingtax_data"> {Utility.formatToCurrency(item.prescribedWitholdingTax)}</td>    
                                                    <td id="payrollsettingstax_nontaxablecompensation_data"> {Utility.formatToCurrency(item.nonTaxableCompensation)}</td>    
                                                    </tr>
                                                    )
                                                })
                                            }
                                            </tbody>
                                        
                                    </Table>
                                </div>
                            </div>                  
                        </Modal.Body>
                    </Modal>
                    
                </div>
                <div className="d-flex flex-wrap justify-content-start mt-3 pb-4" >
                    <div>
                        <Button
                            id="payrollsettingstax_downloadtemplatemonthly_btn"
                            className="mx-2 my-1"
                            onClick={() => {setTaxAnnualModalShow(true)}}
                            >View Annual</Button>
                    </div>
                    <div>
                        <Button
                            id="payrollsettingstax_uploadtableformonthlytax_btn"
                            className="mx-2 my-1"
                            onClick={() => {setTaxMonthlyModalShow(true)}}
                            >
                                View Monthly
                            </Button>
                    </div>
                    <div>
                        <Button
                            id="payrollsettingstax_downloadtemplatemonthly_btn"
                            className="mx-2 my-1"
                            onClick={downloadMonthlyTemplate}>Download Template ( Monthly )</Button>
                    </div>
                    <div>
                        <Button
                            id="payrollsettingstax_uploadtableformonthlytax_btn"
                            className="mx-2 my-1"
                            onClick={() => {
                                setModalMonthlyUploadShow(true)
                            }}>Upload Table for Monthly Tax</Button>
                    </div>
                    <div>
                        <Button
                            id="payrollsettingstax_downloadtemplateyearly_btn"
                            className="mx-2 my-1"
                            onClick={downloadYearlyTemplate}>Download Template ( Yearly )</Button>
                    </div>
                    <div>
                        <Button
                            id="payrollsettingstax_uploadtableforannualtax_btn"
                            className="mx-2 my-1"
                            onClick={() => {
                                setModalYearlyUploadShow(true)
                            }}>Upload Table for Annual Tax</Button>
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
