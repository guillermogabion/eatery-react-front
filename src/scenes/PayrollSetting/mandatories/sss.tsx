import React, { useCallback, useEffect, useRef, useState } from "react"
import { Button, Modal, Form } from "react-bootstrap"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Api, RequestAPI } from "../../../api"
import Table from 'react-bootstrap/Table'
import FileUpload from "./SSSUpload"
import { Utility } from "../../../utils"

const ErrorSwal = withReactContent(Swal)




const sss = (props: any) => {
    
    const [sss, setSss] = useState([]);
    const [sssModalShow, setSssModalShow] = React.useState(false);
    const [modalUploadShow, setModalUploadShow] = React.useState(false);

    const tableHeaders = [
        'Range of Compensation',
        'Monthly Salary Credit',
        'Regular SSS',
        'EC',
        'WISP',
        'Total'
    ];

    const subHeaders = [
        'Range 1',
        'Range 2',
        'Regular SSS/EC',
        'WISP',
        'Total',
        'ER',
        'EE',
        'Total',
        'ER',
        'EE',
        'Total',
        'ER',
        'EE',
        'Total',
        'ER',
        'EE',
        'Total',

        
    ];
    const getSSSInfo = () => {
        RequestAPI.getRequest(
          `${Api.getSSS}`,
          "",
          {},
          {},
          async (res: any) => {
            const { status, body = { data: {}, error: {} } }: any = res
            if (status === 200 && body && body.data) {
            if (body.data) {

                setSss(body.data)
            }
            } else {

            }
        }
        );
      };
    
    
      
      

     useEffect(() => {
        getSSSInfo()
     }, [])
       
    
    
    const downloadTemplate = () => {
        RequestAPI.getFileAsync(
          `${Api.downloadTemplateSSS}`,
          "",
          "SSSTemplate.xlsx",
          async (res: any) => {
            if (res) {
            }
          }
        )
      };
      const handleCloseModal = () => {
        setModalUploadShow(false);
      };
    return (
        <div>
            <Modal
               show={sssModalShow}
               size="xl"
               aria-labelledby="contained-modal-title-vcenter"
               centered
               backdrop="static"
               keyboard={false}
               onHide={() => {
                setSssModalShow(false)
               }}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        SSS Table
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="row w-100 px-5">
                    <div style={{ width: '100%', overflowX: 'auto' }}>
                        <div className="w-100 pt-2">
                            <Table responsive="lg">
                                <thead>
                                    <tr>
                                        {
                                            tableHeaders &&
                                            tableHeaders.length &&
                                            tableHeaders.map((item: any, index: any) => {
                                                if(item === 'Range of Compensation') {
                                                    return (
                                                        <>
                                                            <th colSpan={4} className="subheader-cell  bg-grey" style={{ color: 'black', backgroundColor: '#009FB5', width: 'auto' }}>Range of Compensation</th>
                                                        </>
                                                    );
                                                }
                                                if(item === 'Monthly Salary Credit') {
                                                    return (
                                                        <>
                                                            <th colSpan={6} className="subheader-cell  bg-grey" style={{ color: 'black', backgroundColor: '#009FB5', width: 'auto' }}>Monthly Salary Credit</th>
                                                        </>
                                                    );
                                                }
                                                if(item === 'Regular SSS') {
                                                    return (
                                                        <>
                                                            <th colSpan={6} className="subheader-cell  bg-grey" style={{ color: 'black', backgroundColor: '#009FB5', width: 'auto' }}>Regular SSS</th>
                                                        </>
                                                    );
                                                }
                                                if(item === 'EC') {
                                                    return (
                                                        <>
                                                            <th colSpan={6} className="subheader-cell  bg-grey" style={{ color: 'black', backgroundColor: '#009FB5', width: 'auto' }}>EC</th>
                                                        </>
                                                    );
                                                }
                                                if(item === 'WISP') {
                                                    return (
                                                        <>
                                                            <th colSpan={6} className="subheader-cell  bg-grey" style={{ color: 'black', backgroundColor: '#009FB5', width: 'auto'  }}>WISP</th>
                                                        </>
                                                    );
                                                }
                                                if(item === 'Total') {
                                                    return (
                                                        <>
                                                            <th colSpan={6} className="subheader-cell  bg-grey" style={{ color: 'black', background: '#009FB5', width: 'auto' }}>TOTAL</th>
                                                        </>
                                                    
                                                    );
                                                }
                                            })
                                        }
                                    </tr>


                                    <tr>
                                        {
                                            tableHeaders &&
                                            tableHeaders.length &&
                                            tableHeaders.map((item: any, index: any) => {
                                                // return (
                                                //     <th className="header-cell">{item}</th>
                                                // );
                                                if(item === 'Range of Compensation') {
                                                    return (
                                                        <>
                                                            <th colSpan={2} className="subheader-cell" style={{ width: 'auto' }} >
                                                                Range 1
                                                            </th>
                                                            <th colSpan={2} className="subheader-cell" style={{ width: 'auto' }}>
                                                                Range 2
                                                            </th>
                                                        </>
                                                    );
                                                }
                                                if(item === 'Monthly Salary Credit') {
                                                    return (
                                                        <>
                                                            <th colSpan={2} className="subheader-cell" style={{ width: 'auto' }}>Regular SSS/EC</th>
                                                            <th colSpan={2} className="subheader-cell" style={{ width: 'auto' }}>WISP</th>
                                                            <th colSpan={2} className="subheader-cell" style={{ width: 'auto' }}>Total</th>
                                                        </>
                                                    );
                                                }
                                                if(item === 'Regular SSS') {
                                                    return (
                                                        <>
                                                            <th colSpan={2} className="subheader-cell" style={{ width: 'auto' }}>ER</th>
                                                            <th colSpan={2} className="subheader-cell" style={{ width: 'auto' }}>EE</th>
                                                            <th colSpan={2} className="subheader-cell" style={{ width: 'auto' }}>Total</th>
                                                        </>
                                                    );
                                                }
                                                if(item === 'EC') {
                                                    return (
                                                        <>
                                                            <th colSpan={2} className="subheader-cell" style={{ width: 'auto' }}>ER</th>
                                                            <th colSpan={2} className="subheader-cell" style={{ width: 'auto' }}>EE</th>
                                                        <th colSpan={2} className="subheader-cell" style={{ width: 'auto' }}>Total</th>
                                                    </>
                                                    );
                                                }
                                                if(item === 'WISP') {
                                                    return (
                                                        <>
                                                            <th colSpan={2} className="subheader-cell" style={{ width: 'auto' }}>ER</th>
                                                            <th colSpan={2} className="subheader-cell" style={{ width: 'auto' }}>EE</th>
                                                            <th colSpan={2} className="subheader-cell" style={{ width: 'auto' }}>Total</th>
                                                        </>
                                                    );
                                                }
                                                if(item === 'Total') {
                                                    return (
                                                        <>
                                                            <th colSpan={2} className="subheader-cell" style={{ width: 'auto' }}>ER</th>
                                                            <th colSpan={2} className="subheader-cell" style={{ width: 'auto' }}>EE</th>
                                                            <th colSpan={2} className="subheader-cell" style={{ width: 'auto' }}>Total</th>
                                                        </>
                                                    ); 
                                                }
                                            })
                                        }
                                    </tr>
                                </thead>
                            </Table>
                            <Table>
                                <div style={{ height: '400px', overflowY: 'scroll' }}>
                                    <tbody className="custom-row">
                                        {
                                        sss &&
                                        sss.length > 0 &&
                                        sss.map((item: any, index: any) => {
                                            return (
                                            <tr>
                                                {
                                                tableHeaders &&
                                                tableHeaders.length &&
                                                tableHeaders.map((header: any) => {
                                                    if (header === 'Range of Compensation') {
                                                        return (
                                                            <>
                                                                <td id="payrollsettingsss_rangelower_data" colSpan={2}>{Utility.formatToCurrency(item.range_lower)}</td>
                                                                <td id="payrollsettingsss_rangeupper_data" colSpan={2}>{Utility.formatToCurrency(item.range_upper)}</td>
                                                            </>
                                                        );
                                                    }
                                                    if (header === 'Monthly Salary Credit') {
                                                        return (
                                                            <>
                                                                <td id="payrollsettingsss_mscregular_data" colSpan={2}>{Utility.formatToCurrency(item.mscRegular)}</td>
                                                                <td id="payrollsettingsss_mscwisp_data" colSpan={2}>{Utility.formatToCurrency(item.mscWisp)}</td>
                                                                <td id="payrollsettingsss_msctotal_data" colSpan={2}>{Utility.formatToCurrency(item.mscTotal)}</td>
                                                            </>
                                                        );
                                                    }
                                                if (header === 'Regular SSS') {
                                                        return (
                                                            <>
                                                                <td id="payrollsettingsss_regularer_data" colSpan={2}>{Utility.formatToCurrency(item.regularEr)}</td>
                                                                <td id="payrollsettingsss_regularee_data" colSpan={2}>{Utility.formatToCurrency(item.regularEe)}</td>
                                                                <td id="payrollsettingsss_regulartotal_data" colSpan={2}>{Utility.formatToCurrency(item.regularTotal)}</td>
                                                            </>
                                                        );
                                                    }
                                                    if (header === 'EC') {
                                                        return (
                                                            <>
                                                                <td id="payrollsettingsss_ecer_data" colSpan={2}>{Utility.formatToCurrency(item.ecEr)}</td>
                                                                <td id="payrollsettingsss_ecee_data" colSpan={2}>{Utility.formatToCurrency(item.ecEe)}</td>
                                                                <td id="payrollsettingsss_ectotal_data" colSpan={2}>{Utility.formatToCurrency(item.ecTotal)}</td>
                                                            </>
                                                        );
                                                    }
                                                    if (header === 'WISP') {
                                                        return (
                                                            <>
                                                                <td id="payrollsettingsss_wisper_data" colSpan={2}>{Utility.formatToCurrency(item.wispEr)}</td>
                                                                <td id="payrollsettingsss_wispee_data" colSpan={2}>{Utility.formatToCurrency(item.wispEe)}</td>
                                                                <td id="payrollsettingsss_wisptotal_data" colSpan={2}>{Utility.formatToCurrency(item.wispTotal)}</td>
                                                            </>
                                                        );
                                                    }
                                                if (header === 'Total') {
                                                    return (
                                                            <>
                                                                <td id="payrollsettingsss_totaler_data" colSpan={2}>{Utility.formatToCurrency(item.totalEr)}</td>
                                                                <td id="payrollsettingsss_totalee_data" colSpan={2}>{Utility.formatToCurrency(item.totalEe)}</td>
                                                                <td id="payrollsettingsss_totaltotal_data" colSpan={2}>{Utility.formatToCurrency(item.totalTotal)}</td>
                                                            </>
                                                    );
                                                    }
                                                })
                                                }
                                            </tr>
                                            )
                                        })
                                        }
                                    </tbody>
                                </div>
                            </Table>
                        </div>
                    </div>
                    
                </Modal.Body>
            </Modal>
            <div className="d-flex justify-content-start mt-3 pb-4" >
                <div>
                    <Button
                        // id="payrollsettingsss_downloadtemplate_btn"
                        className="mx-2"
                        onClick={() => {setSssModalShow(true)}}>View Table</Button>
                </div>
                <div>
                    <Button
                        id="payrollsettingsss_downloadtemplate_btn"
                        className="mx-2"
                        onClick={downloadTemplate}>Download Template</Button>
                </div>
                <div>
                    <Button
                        id="payrollsettingsss_uploadtable_btn"
                        className="mx-2"
                        onClick={() => {
                            setModalUploadShow(true)
                          }}>Upload Table</Button>
                </div>
            </div>
            <Modal
                show={modalUploadShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                onHide={() => setModalUploadShow(false)}
                dialogClassName="modal-90w"
            >
                <Modal.Header closeButton>
                <Modal.Title>
                    Upload Excel File
                </Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex align-items-center justify-content-center">
                <div>
                    <FileUpload onCloseModal={handleCloseModal} />
                </div>

                </Modal.Body>

            </Modal>
        </div>
        
        
        
        
    );
    


}

export default sss;
