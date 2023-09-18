import { useEffect, useState } from "react";
import { Api, RequestAPI } from "../../../api";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { Utility } from "../../../utils";
import ReactPaginate from "react-paginate";
import { action_decline, eye } from "../../../assets/images";
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const ErrorSwal = withReactContent(Swal)

export const UploadReceipt = (props: any) => {
    const [allLeaves, setAllLeaves] = useState<any>([]);
    const [reimbursementList, setReimbursementList] = useState<any>([]);
    const [viewReceiptModal, setViewReceiptModal] = useState<any>(false);
    const [isDisplayData, setIsDisplayData] = useState<any>(true);
    const [displayData, setDisplayData] = useState<any>(null);
    const [isEditReceipt, setIsEditReceipt] = useState<any>(false);
    const [receiptImage, setReceiptImage] = useState<any>("");
    const [filterData, setFilterData] = useState([]);

    const tableHeaders = [
        'ID',
        'File Name',
        'Type',
        'Company Name',
        'Uploaded',
        'Used',
        'Status',
        'Actions',
    ];

    useEffect(() => {
        getUploadedReceipts(0)
    }, [])
    useEffect(() => {
        getUploadedReceipts(0)
    }, [filterData])

    const getUploadedReceipts = (pageNo: any) => {
        let queryString = ""
        let filterDataTemp = { ...filterData }

        if (filterDataTemp) {
            Object.keys(filterDataTemp).forEach((d: any) => {
                if (filterDataTemp[d]) {
                    queryString += `&${d}=${filterDataTemp[d]}`
                } else {
                    queryString = queryString.replace(`&${d}=${filterDataTemp[d]}`, "")
                }
            })
        }
        RequestAPI.getRequest(
            `${Api.getAllReceiptReimbursement}?size=10${queryString}&page=${pageNo}&sort=id&sortDir=DESC`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        let reimTemp: any = { ...body.data }
                        if (reimTemp.content) {
                            let tempArray = [...reimTemp.content]
                            tempArray.forEach((d: any, i: any) => {
                                d.isCheck = false
                            });
                            setReimbursementList(reimTemp)
                        }
                        // setReimbursementList(body.data)
                    }
                }
            }
        )
    }

    const handlePageClick = (event: any) => {
        getUploadedReceipts(event.selected)
    };

    const deleteReceipt = (id: any = 0) => {
        ErrorSwal.fire({
            title: 'Are you sure?',
            text: "You want to delete this receipt.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!',
            didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                const cancelButton = Swal.getCancelButton();
      
                if(confirmButton)
                  confirmButton.id = "reimbursementupload_deletereceiptconfirm_alertbtn"
      
                if(cancelButton)
                  cancelButton.id = "reimbursementupload_deletereceiptcancel_alertbtn"
              },
        }).then((result) => {
            if (result.isConfirmed) {
                RequestAPI.deleteRequest(`${Api.deleteReimbursementReceipt}`, "", { "id": id }, async (res: any) => {
                    const { status, body = { data: {}, error: {} } }: any = res
                    if (status === 200) {
                        getUploadedReceipts(0)
                        ErrorSwal.fire({
                            title: 'Deleted!',
                            text: (body && body.data) || "",
                            didOpen: () => {
                              const confirmButton = Swal.getConfirmButton();
                    
                              if(confirmButton)
                                confirmButton.id = "reimbursementupload_successconfirm_alertbtn"
                            },
                            icon: 'success',
                        })
                    } else {
                        //error
                        ErrorSwal.fire({
                            title: 'Failed!',
                            text: (body.error && body.error.message) || "",
                            didOpen: () => {
                              const confirmButton = Swal.getConfirmButton();
                    
                              if(confirmButton)
                                confirmButton.id = "reimbursementupload_errorconfirm_alertbtn"
                            },
                            icon: 'error',
                        })
                    }
                })
            }
        })
    }

    const updateData = (key: any, value: any) => {
        const valuesObj: any = { ...displayData }
        valuesObj[key] = value
        setDisplayData({ ...valuesObj })
    }

    const updateReceipt = () => {
        if (displayData) {
            const valuesObj: any = { ...displayData }
            RequestAPI.putRequest(
                Api.updateReceipt,
                "",
                valuesObj,
                {},
                async (res) => {
                    const { status, body = { data: {}, error: {} } } = res;
                    if (status === 200 || status === 201) {
                        if (body.error && body.error.message) {
                            ErrorSwal.fire({
                                title: 'Error!',
                                text: (body.error && body.error.message) || "",
                                didOpen: () => {
                                  const confirmButton = Swal.getConfirmButton();
                        
                                  if(confirmButton)
                                    confirmButton.id = "reimbursementupload_errorconfirm2_alertbtn"
                                },
                                icon: 'error',
                            })
                        } else {
                            ErrorSwal.fire({
                                title: 'Success!',
                                text: (body.data) || body.data.message,
                                didOpen: () => {
                                  const confirmButton = Swal.getConfirmButton();
                        
                                  if(confirmButton)
                                    confirmButton.id = "reimbursementupload_successconfirm2_alertbtn"
                                },
                                icon: 'success',
                            })
                            getUploadedReceipts(0)
                            setIsEditReceipt(false)
                            setViewReceiptModal(false)
                        }
                    } else {
                        ErrorSwal.fire({
                            title: 'Error!',
                            text: 'Something Error.',
                            didOpen: () => {
                              const confirmButton = Swal.getConfirmButton();
                    
                              if(confirmButton)
                                confirmButton.id = "reimbursementupload_errorconfirm3_alertbtn"
                            },
                            icon: 'error',
                        })
                    }
                }
            );
        }
    }

    const getReceiptImage = (path: any) => {
        RequestAPI.getRequest(
            `${Api.getFile}?path=${path}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                console.log(body)
                if (status === 200 && body) {
                    setReceiptImage(body)
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

    const singleChangeOption = (option: any, name: any) => {
        const filterObj: any = { ...filterData }
        filterObj[name] = name && option && option.value !== "Select" ? option.value : ""
        setFilterData(filterObj)
    }

    const onChangeCheckbox = (index: any, boolCheck: any) => {
        const valuesObj: any = { ...reimbursementList }
        if (valuesObj.content) {
            let tempArray = [...valuesObj.content]
            tempArray[index].isCheck = boolCheck
            setReimbursementList({ ...valuesObj })
            checkIfHasSelected()
        }
    }

    const [hasReceiptSelected, setHasReceiptSelected] = useState(false);
    const checkIfHasSelected = () => {
        const valuesObj: any = { ...reimbursementList }
        if (valuesObj.content) {
            let tempArray = [...valuesObj.content]
            let hasSelected = false
            tempArray.forEach((data: any, index: any) => {
                if (data.isCheck) {
                    hasSelected = true
                }
            });
            setHasReceiptSelected(hasSelected)
        }
    }

    const extractData = () => {
        ErrorSwal.fire({
            title: 'Are you sure?',
            text: "You want to extract data.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!',
            didOpen: () => {
                const confirmButton = Swal.getConfirmButton();
                const cancelButton = Swal.getCancelButton();
      
                if(confirmButton)
                  confirmButton.id = "reimbursementupload_extractdataconfirm_alertbtn"
      
                if(cancelButton)
                  cancelButton.id = "reimbursementupload_extractdatacancel_alertbtn"
              },
        }).then((result) => {
            if (result.isConfirmed) {
                const valuesObj: any = { ...reimbursementList }
                let payload: any = {}
                if (valuesObj.content) {
                    let tempArray = [...valuesObj.content]
                    let ids: any = []
                    tempArray.forEach((d: any, i: any) => {
                        if (d.isCheck) {
                            ids.push(d.id)
                        }
                    });
                    payload = {
                        "ids": ids
                    }
                }
                RequestAPI.putRequest(Api.extractFailedReceipts, "", payload, {}, async (res: any) => {
                    const { status, body = { data: {}, error: {} } }: any = res
                    if (status === 200 || status === 201) {
                        if (body.error && body.error.message) {
                            ErrorSwal.fire({
                                title: 'Error!',
                                text: (body.error && body.error.message) || "",
                                didOpen: () => {
                                  const confirmButton = Swal.getConfirmButton();
                        
                                  if(confirmButton)
                                    confirmButton.id = "reimbursementupload_errorconfirm4_alertbtn"
                                },
                                icon: 'error',
                            })
                        } else {
                            ErrorSwal.fire({
                                title: 'Success!',
                                text: (body.data) || (body.data.message),
                                didOpen: () => {
                                  const confirmButton = Swal.getConfirmButton();
                        
                                  if(confirmButton)
                                    confirmButton.id = "reimbursementupload_successconfirm3_alertbtn"
                                },
                                icon: 'success',
                            })
                            getUploadedReceipts(0)
                            setHasReceiptSelected(false)
                        }
                    } else {
                        ErrorSwal.fire({
                            title: 'Error!',
                            text: "Something Error.",
                            didOpen: () => {
                              const confirmButton = Swal.getConfirmButton();
                    
                              if(confirmButton)
                                confirmButton.id = "reimbursementupload_errorconfirm5_alertbtn"
                            },
                            icon: 'error',
                        })
                    }
                })
            }
        })
    }

    return (
        <div>
            <div className="w-100 px-2 py-3">
                <div className="pl-3 text-[#009FB5] text-lg ">
                    Search By:
                </div>
                <div className="row m-0 p-0 d-flex col-md-12">
                    <div className="col-md-3 col-lg-3">
                        <label className="">File Type</label>
                        <div >
                            <select
                                className={`form-select `}
                                name="fileType"
                                id={"reimbursementuploadreceipt_filetype_searchby"}
                                style={{ height: 42 }}
                                value={filterData["fileType"]}
                                onChange={(e) => makeFilterData(e)}>
                                <option value="Select" disabled selected>
                                    Select file type
                                </option>
                                <option value="image/jpeg">JPEG</option>
                                <option value="image/png">PNG</option>
                                <option value="image/bmp">BMP</option>
                                <option value="image/gif">GIF</option>
                                <option value="application/pdf">PDF</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3 col-lg-2">
                        <label className="">Date From</label>
                        <input
                            id={"reimbursementuploadreceipt_datefrom_searchby"}
                            name="dateFrom"
                            type="date"
                            autoComplete="off"
                            className="formControl"
                            maxLength={40}
                            value={filterData["dateFrom"]}
                            onChange={(e) => makeFilterData(e)}
                            onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                        />
                    </div>

                    <div className="col-md-3 col-lg-2">
                        <label className="">Date To</label>
                        <div >
                            <input
                                id={"reimbursementuploadreceipt_dateto_searchby"}
                                name="dateTo"
                                type="date"
                                autoComplete="off"
                                className="formControl"
                                maxLength={40}
                                value={filterData["dateTo"]}
                                onChange={(e) => makeFilterData(e)}
                                onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                            />
                        </div>
                    </div>
                    <div className="col-md-3 col-lg-2">
                        <label className="">Status</label>
                        <div >
                            <select
                                className={`form-select `}
                                name="status"
                                id={"reimbursementuploadreceipt_status_searchby"}
                                style={{ height: 42 }}
                                value={filterData["status"]}
                                onChange={(e) => makeFilterData(e)}>
                                <option value="Select" disabled selected>
                                    Select Status
                                </option>
                                <option value="success">Success</option>
                                <option value="ongoing">Ongoing</option>
                                <option value="failed">Failed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="uploaded">Uploaded</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mt-2">
                    <Button
                        disabled={!hasReceiptSelected}
                        id={"reimbursementuploadreceipt_extractdata_searchbybtn"}
                        onClick={() => {
                            extractData()
                        }}
                        className="px-3 py-2 rounded-md text-white bg-[#189FB5] text-normal" >
                        Extract Data
                    </Button>
                </div>
                <div>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th style={{ width: 10 }}>
                                    Select
                                </th>
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
                                reimbursementList &&
                                reimbursementList.content &&
                                reimbursementList.content.length > 0 && (
                                    reimbursementList.content.map((item: any, index: any) => {
                                        return (
                                            <tr>
                                                <td>
                                                    <Form.Check
                                                        id="payrollgenerate_ischeck_employeelistdata2"
                                                        type="checkbox"
                                                        label=""
                                                        checked={item.isCheck}
                                                        onChange={(e) => {
                                                            onChangeCheckbox(index, e.target.checked)
                                                        }}
                                                    />
                                                </td>
                                                <td id={"reimbursementuploadreceipt_id_searchbytable_" + item.id}> {item.id} </td>
                                                <td id={"reimbursementuploadreceipt_filename_searchbytable_" + item.id}> {item.fileName} </td>
                                                <td id={"reimbursementuploadreceipt_filecontent_searchbytable_" + item.id}> {item.fileContentType} </td>
                                                <td id={"reimbursementuploadreceipt_companyname_searchbytable_" + item.id}> {item.companyName} </td>
                                                <td id={"reimbursementuploadreceipt_uploaddate_searchbytable_" + item.id}> {Utility.formatDate(item.uploadDate, 'MM-DD-YYYY')}</td>
                                                <td id={"reimbursementuploadreceipt_used_searchbytable_" + item.id}> {item.used} </td>
                                                <td id={"reimbursementuploadreceipt_status_searchbytable_" + item.id}> <label className={`bg-[${Utility.uploadReceiptStatus(item.status)}] rounded-md px-3 py-1 text-white`}>{item.status}</label>  </td>
                                                <td>
                                                    <label
                                                        id={"reimbursementuploadreceipt_displaymodal_searchbytablebtn_" + item.id}
                                                        onClick={() => {
                                                            getReceiptImage(item.fileNamePath)
                                                            setIsDisplayData(true)
                                                            setDisplayData(item)
                                                            setViewReceiptModal(true)
                                                        }}
                                                        className="text-muted cursor-pointer">
                                                        <img id="reimbursementuploadreceipt_displaymodal_img" src={eye} width={20} className="hover-icon-pointer mx-1" title="Delete" />
                                                    </label>
                                                    {
                                                        item.status == "Failed" && (
                                                            <label
                                                                id={"reimbursementuploadreceipt_deletereceipt_searchbytable_" + item.id}
                                                                onClick={() => {
                                                                    deleteReceipt(item.id)
                                                                }}
                                                                className="text-muted cursor-pointer">
                                                                <img id="reimbursementuploadreceipt_deletereceipt_img" src={action_decline} width={20} className="hover-icon-pointer mx-1" title="Delete" />
                                                            </label>
                                                        )
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                )
                            }
                        </tbody>
                    </Table>
                    {
                        reimbursementList &&
                            reimbursementList.content &&
                            reimbursementList.content.length == 0 ?
                            <div className="w-100 text-center">
                                <label htmlFor="">No Records Found</label>
                            </div>
                            :
                            null
                    }
                </div>
            </div>
            <div className="d-flex justify-content-end px-4">
                <div className="">
                    <ReactPaginate
                        className="d-flex justify-content-center align-items-center"
                        breakLabel="..."
                        nextLabel=">"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={(reimbursementList && reimbursementList.totalPages) || 0}
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
            <Modal
                show={viewReceiptModal}
                size={"lg"}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                onHide={() => setViewReceiptModal(false)}
                dialogClassName="modal-90w"
                id="accessrights_authlist_modal"
            >
                <Modal.Header className="text-center flex justify-center">
                    <Modal.Title id="contained-modal-title-vcenter" className="font-bold text-md">
                        View Receipt Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="row w-100 px-3 m-0">
                    <div className="w-100 px-3 py-3 flex flex-column justify-center mb-5 cursor-pointer" >
                        <div className="row m-0 p-0">
                            <div className="form-group col-md-3 mb-3" >
                                <label>File Name:</label>
                                <input type="text"
                                    disabled={true}
                                    name="reason"
                                    id={"reimbursementuploadreceipt_reason_modalinput"}
                                    className="form-control"
                                    value={displayData && displayData.fileName}
                                />
                            </div>
                            <div className="form-group col-md-3 mb-3" >
                                <label>Receipt Upload Date:</label>
                                <input type="text"
                                    disabled={true}
                                    name="reason"
                                    id={"reimbursementuploadreceipt_receiptuploaddate_modalinput"}
                                    className="form-control"
                                    value={displayData && Utility.formatDate(displayData.uploadDate, 'MM-DD-YYYY')}
                                />
                            </div>
                            <div className="form-group col-md-3 mb-3" >
                                <label>Status:</label>
                                <input type="text"
                                    disabled={true}
                                    name="reason"
                                    id={"reimbursementuploadreceipt_status_modalinput"}
                                    className="form-control"
                                    value={displayData && displayData.status}
                                />
                            </div>
                            <div className="col-md-3 flex items-center">
                                <div className="flex items-center ">
                                    <Form.Check // prettier-ignore
                                        type="switch"
                                        id={"reimbursementuploadreceipt_customswitch_modalinput"}
                                        checked={isDisplayData}
                                        onChange={(e) => {
                                            setIsDisplayData(e.target.checked)
                                        }}
                                        style={{ fontSize: 18 }}
                                    />

                                    <label className="mb-1" style={{ fontSize: 12 }} htmlFor={"reimbursementuploadreceipt_customswitch_modalinput"}>Display Extracted Data</label>
                                </div>
                            </div>
                        </div>
                        {
                            isDisplayData ?
                                <div className="row m-0 p-0 rounded-md py-2 mb-2" style={{ border: 1, borderStyle: 'solid', borderColor: "#DADADA" }}>
                                    <div className="form-group col-md-4 mb-3" >
                                        <label>Company Name:</label>
                                        <input type="text"
                                            disabled={!isEditReceipt}
                                            name="companyName"
                                            id={"reimbursementuploadreceipt_companyname_modalinput"}
                                            className="form-control"
                                            value={displayData && displayData.companyName}
                                            onChange={(e) => {
                                                updateData('companyName', e.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className="form-group col-md-4 mb-3" >
                                        <label>Invoice/OR #:</label>
                                        <input type="text"
                                            disabled={!isEditReceipt}
                                            name="invoice"
                                            id={"reimbursementuploadreceipt_invoiceor_modalinput"}
                                            className="form-control"
                                            value={displayData && displayData.invoice}
                                            onChange={(e) => {
                                                updateData('invoice', e.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className="form-group col-md-4 mb-3" >
                                        <label>TIN:</label>
                                        <input type="text"
                                            disabled={!isEditReceipt}
                                            name="tin"
                                            id={"reimbursementuploadreceipt_tin_modalinput"}
                                            className="form-control"
                                            value={displayData && displayData.tin}
                                            onChange={(e) => {
                                                updateData('tin', e.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className="form-group col-md-4 mb-3" >
                                        <label>Date of Transaction:</label>
                                        <input type="date"
                                            disabled={!isEditReceipt}
                                            name="transactionDate"
                                            id={"reimbursementuploadreceipt_transactionDate_modalinput"}
                                            className="form-control"
                                            value={displayData && displayData.transactionDate}
                                            onChange={(e) => {
                                                updateData('transactionDate', e.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className="form-group col-md-4 mb-3" >
                                        <label>Total Amount:</label>
                                        <input type="number"
                                            disabled={!isEditReceipt}
                                            name="amount"
                                            id={"reimbursementuploadreceipt_amount_modalinput"}
                                            className="form-control"
                                            value={displayData && displayData.amount}
                                            onChange={(e) => {
                                                updateData('amount', e.target.value)
                                            }}
                                        />
                                    </div>
                                </div>
                                :
                                null
                        }

                        <div>
                            <label>Receipt Preview</label>
                            <div className="w-full flex justify-center object-contain">
                                <img id={"reimbursementuploadreceipt_receiptimg_modalimg"} src={`${receiptImage}`} alt="Base64 Image" />;
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <Button
                            id={"reimbursementuploadreceipt_cancel_modalbtn"}
                            variant="secondary"
                            onClick={() => {
                                setViewReceiptModal(false)
                                setIsEditReceipt(false)
                            }}
                            className="w-[150px] mr-2 text-[#189FB5]" style={{ borderColor: '#189FB5' }}>
                            Cancel
                        </Button>
                        {/* <Button
                            onClick={() => {
                                if (isEditReceipt) {
                                    updateReceipt()
                                } else {
                                    setIsEditReceipt(true)
                                }
                            }}
                            className="w-[150px] mr-2">
                            {isEditReceipt ? "Save Changes" : "Modify"}
                        </Button> */}
                        {
                            !isEditReceipt && displayData && displayData.status == "Failed" ?
                                <button
                                    id={"reimbursementuploadreceipt_delete_modalbtn"}
                                    onClick={() => {
                                        if (displayData) {
                                            deleteReceipt(displayData.id)
                                            setViewReceiptModal(false)
                                        }
                                    }}
                                    className="w-[150px] form-control text-white  mr-2" style={{ backgroundColor: "#FF3838" }}>
                                    Delete
                                </button>
                                :
                                null
                        }
                    </div>
                </Modal.Body>
            </Modal>
        </div>);
}