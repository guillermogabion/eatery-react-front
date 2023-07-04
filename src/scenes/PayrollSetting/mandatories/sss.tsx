import React, { useCallback, useEffect, useRef, useState } from "react"
import { Button, Modal, Form } from "react-bootstrap"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Api, RequestAPI } from "../../../api"
import Table from 'react-bootstrap/Table'
import FileUpload from "./SSSUpload"
const ErrorSwal = withReactContent(Swal)




const sss = (props: any) => {
    
    const [sss, setSss] = useState([]);
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
                            <tbody>
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
                                                <td colSpan={2}>{item.range_lower}</td>
                                                <td colSpan={2}>{item.range_upper}</td>
                                                </>
                                            );
                                            }
                                            if (header === 'Monthly Salary Credit') {
                                            return (
                                                <>
                                                <td colSpan={2}>{item.mscRegular}</td>
                                                <td colSpan={2}>{item.mscWisp}</td>
                                                <td colSpan={2}>{item.mscTotal}</td>
                                                </>
                                            );
                                            }
                                            if (header === 'Regular SSS') {
                                            return (
                                                <>
                                                <td colSpan={2}>{item.regularEr}</td>
                                                <td colSpan={2}>{item.regularEe}</td>
                                                <td colSpan={2}>{item.regularTotal}</td>
                                                </>
                                            );
                                            }
                                            if (header === 'EC') {
                                            return (
                                                <>
                                                <td colSpan={2}>{item.ecEr}</td>
                                                <td colSpan={2}>{item.ecEe}</td>
                                                <td colSpan={2}>{item.ecTotal}</td>
                                                </>
                                            );
                                            }
                                            if (header === 'WISP') {
                                            return (
                                                <>
                                                <td colSpan={2}>{item.wispEr}</td>
                                                <td colSpan={2}>{item.wispEe}</td>
                                                <td colSpan={2}>{item.wispTotal}</td>
                                                </>
                                            );
                                            }
                                            if (header === 'Total') {
                                            return (
                                                <>
                                                <td colSpan={2}>{item.totalEr}</td>
                                                <td colSpan={2}>{item.totalEe}</td>
                                                <td colSpan={2}>{item.totalTotal}</td>
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
            <div className="d-flex justify-content-end mt-3" >
                <div>
                    <Button
                        className="mx-2"
                        onClick={downloadTemplate}>Download Template</Button>
                </div>
                <div>
                    <Button
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
