import React, { useEffect, useRef, useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import Table from 'react-bootstrap/Table'
import ReactPaginate from 'react-paginate'
import { useSelector } from "react-redux"
import { Api, RequestAPI } from "../../../api"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
const ErrorSwal = withReactContent(Swal)
import { Formik } from "formik"

export default function Recurring(props: any) {
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const { data } = useSelector((state: any) => state.rootReducer.userData)
    const [recurringList, setRecurringList] = React.useState([]);
    const formRef: any = useRef()
    const [modalShow, setModalShow] = React.useState(false);
    const [employee, setEmployee] = useState<any>([]);
    const [recurring, setRecurring] = useState<any>([]);
    const [recurringTypes, setRecurringTypes] = useState<any>([]);
    const [filterData, setFilterData] = React.useState([]);
    const [userId, setUserId] = React.useState("");

    const [initialValues, setInitialValues] = useState<any>({

        recurring: [
            {
                "userId": "",
                "recurringTypeId": "",
                "adjustmentAmount": "",
                "endDate": "",
                "active": "",
            }
        ],
        "userId": "",
        "recurringTypeId": "",
        "adjustmentAmount": "",
        "endDate": "",
        "active": "",
    })
    const tableHeaders = [
        'Employee ID',
        'Employee Name',
        'Amount',
        'Recurring Name',
        'Action',
    ];

    const handleAddField = () => {
        setRecurring([...recurring, {}])
    }
    const setFormField = (e: any, setFieldValue: any) => {
        const { name, value } = e.target
        if (setFieldValue) {
            setFieldValue(name, value)
        }
    }

    useEffect(() => {
        if (filterData) {
            getAllRecurringList(0)
        }
    }, [filterData])

    const handleRemoveField = (index: number) => {
        if (recurring.length === 1) {
            return; // Do not remove the only field row
        }
        const updatedFields = [...recurring];
        updatedFields.splice(index, 1);
        setRecurring(updatedFields);
    }

    const getAllRecurringList = (pageNo: any) => {
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
            `${Api.getAllRecurringList}?size=10&page${pageNo}${queryString}&sort=id&sortDir=desc`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.data.content) {
                        setRecurringList(body.data)
                    }
                } else {

                }
            }

        )
    }
    
    useEffect(() => {
        getAllRecurringList(0)
        RequestAPI.getRequest(
            `${Api.getAllRecurringType}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        let tempArray: any = []
                        body.data.forEach((d: any, i: any) => {
                            tempArray.push({
                                recurringTypeId: d.id,
                                recurringName: d.name,
                                // deduction : d.deduction
                            })
                        });
                        setRecurringTypes(tempArray)
                    }
                }
            }
        )

        RequestAPI.getRequest(
            `${Api.employeeList}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                    } else {
                        let tempArray: any = []
                        body.data.forEach((d: any, i: any) => {
                            tempArray.push({
                                userId: d.userAccountId,
                                label: d.firstname + " " + d.lastname
                            })
                        });
                        setEmployee(tempArray)
                    }
                }
            }
        )

    }, [])

    const handlePageClick = (event: any) => {
        getAllRecurringList(event.selected)
    };

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

    const getRecurring = (id: any = 0) => {
        RequestAPI.getRequest(
            `${Api.recurringInfo}?id=${id}`,
            "",
            {},
            {},
            async (res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res;
                if (status === 200 && body && body.data) {
                    if (body.error && body.error.message) {
                        // Handle error
                    } else {
                        const valueObj: any = body.data;
                        setInitialValues(valueObj);
                        setModalShow(true);
                    }
                }
            }
        );
    }

    return (
        <>
            <div className="w-100">
                <div>
                    <div className="w-100 pt-2">
                        <div className="fieldtext d-flex col-md-6">
                            <div className="mx-1">
                                <label>Employee Name</label>
                                <input
                                    name="employeeName"
                                    placeholder="Employee Name"
                                    type="text"
                                    autoComplete="off"
                                    className="formControl"
                                    style={{ width: 100 }}
                                    maxLength={40}
                                    onChange={(e) => makeFilterData(e)}
                                // onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                                />
                            </div>
                            <div className="mx-1">
                                <label>Amount</label>
                                <input
                                    name="adjustmentAmount"
                                    placeholder="Amount"
                                    type="text"
                                    autoComplete="off"
                                    className="formControl"
                                    maxLength={40}
                                    onChange={(e) => makeFilterData(e)}
                                    onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                                />
                            </div>
                            <div className="mx-1">
                                <label>Add or Deduct</label>
                                <input
                                    name="isDeduction"
                                    placeholder="Add or Deduct"
                                    type="text"
                                    autoComplete="off"
                                    className="formControl"
                                    maxLength={40}
                                    onChange={(e) => makeFilterData(e)}
                                    onKeyDown={(evt) => !/^[a-zA-Z 0-9-_]+$/gi.test(evt.key) && evt.preventDefault()}
                                />
                            </div>
                        </div>
                    </div>
                    <Table responsive="lg">
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
                        <tbody>
                            {
                                recurringList &&
                                recurringList.content &&
                                recurringList.content.length > 0 &&
                                recurringList.content.map((item: any, index: any) => {

                                    return (
                                        <tr>
                                            <td> {item.employeeId} </td>
                                            <td> {item.employeeName} </td>
                                            <td> {item.adjustmentAmount} </td>
                                            <td> {item.recurringName} </td>
                                            <td>
                                                <label
                                                    onClick={() => {
                                                        setModalShow(true)
                                                    }}
                                                    className="text-muted cursor-pointer">
                                                    Update
                                                </label>
                                            </td>

                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                    {
                        recurringList &&
                            recurringList.content &&
                            recurringList.content.length == 0 ?
                            <div className="w-100 text-center">
                                <label htmlFor="">No Records Found</label>
                            </div>
                            :
                            null
                    }
                </div>
            </div>
            <div className="d-flex justify-content-end">
                <div className="">
                    <ReactPaginate
                        className="d-flex justify-content-center align-items-center"
                        breakLabel="..."
                        nextLabel=">"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={(recurringList && recurringList.totalPages) || 0}
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
                show={modalShow}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                dialogClassName="modal-90w"
                onHide={() => setModalShow(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-v-center">
                        {userId ? 'Update Recurring' : 'Create Recurring'}
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



                            const recurringTransactions = recurring.map((item) => ({
                                userId: item.userId,
                                recurringTypeId: item.recurringTypeId,
                                adjustmentAmount: item.adjustmentAmount,
                                endDate: item.endDate,
                                active: item.active
                            }));

                            const payload = {
                                recurring: recurringTransactions
                            };


                            if (values.userId) {
                                const valuesObj: any = { ...values }
                                RequestAPI.putRequest(
                                    Api.updateRecurringTransaction,
                                    "",
                                    valuesObj,
                                    {},
                                    async (res) => {
                                        const { status, body = { data: {}, error: {} } } = res;

                                        if (status === 200 || status === 201) {
                                            if (body.error && body.error.message) {
                                                ErrorSwal.fire(
                                                    "Error!",
                                                    body.error.message || "",
                                                    "error"

                                                );
                                                // handleCloseModal();
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
                                        } else {
                                            ErrorSwal.fire("Error!", "Something Error.", "error");
                                        }
                                    }
                                );
                            } else {
                                RequestAPI.postRequest(Api.createRecurringTransaction, "", payload, {}, async (res: any) => {
                                    Swal.close();
                                    const { status, body = { data: {}, error: {} } }: any = res

                                    if (status === 200 || status === 201) {
                                        if (body.error && body.error.message) {
                                            ErrorSwal.fire(
                                                'Error!',
                                                (body.error && body.error.message) || "",
                                                'error'
                                            )
                                            // setRecurring([]);

                                        } else {
                                            setModalShow(false)
                                            ErrorSwal.fire(
                                                'Success!',
                                                (body.data) || "",
                                                'success'
                                            )

                                        }
                                    } else {
                                        ErrorSwal.fire(
                                            'Error!',
                                            'Something Error.',
                                            'error'
                                        )
                                    }
                                })
                            }
                        }}
                    >



                        {({ values, setFieldValue, handleSubmit, errors, touched }) => {
                            return (
                                <Form
                                    noValidate
                                    onSubmit={handleSubmit}
                                    id="_formid"
                                    autoComplete="off"
                                >

                                    {values.userId ? (
                                        <div>
                                            {/* with userId  */}

                                            {/* <div className="col-md-2 mb-3">
                                        <label>Amount</label>
                                        <input
                                        className="form-control"
                                        name="adjustmentAmount"
                                        value={values.adjustmentAmount ? values.adjustmentAmount : values.amount}
                                        onChange={(e) => {
                                            setFieldValue('adjustmentAmount', e.target.value);
                                        }}
                                        />
                                    </div> */}
                                            <div className="form-group row">
                                                <div className="col-md-3 mb-3">
                                                    <label>Employee ID</label>
                                                    <input
                                                        readOnly
                                                        className="formControl"
                                                        name="userId"
                                                        value={values.userId ? values.userId : ''}
                                                        onChange={(e) => {
                                                            setFieldValue('userId', e.target.value);
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-md-3 mb-3">
                                                    <label>Employee Name *</label>
                                                    <select
                                                        disabled
                                                        className="form-select"
                                                        value={values.userId}
                                                        onChange={(e) => {
                                                            const selectedValue = e.target.value;
                                                            setFieldValue('userId', e.target.value);
                                                            const selectedEmployee = employee.find(
                                                                (item) => item.userId === selectedValue
                                                            );
                                                            const employeeIdField = document.getElementsByName('userId')[0];
                                                            if (selectedEmployee) {
                                                                employeeIdField.value = selectedEmployee.userId;
                                                            } else {
                                                                employeeIdField.value = '';
                                                            }
                                                        }}
                                                    >
                                                        <option value="" disabled selected>
                                                            Select Employee
                                                        </option>
                                                        {employee &&
                                                            employee.length &&
                                                            employee.map((item: any, index: string) => (
                                                                <option key={`${index}_${item.userId}`} value={item.userId}>
                                                                    {item.label}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                                <div className="col-md-3 mb-3">
                                                    <label>Recurring Name *</label>
                                                    <select
                                                        disabled
                                                        placeholder="Recurring Name"
                                                        className="form-select"
                                                        name="recurringTypeId"
                                                        id="type"
                                                        value={values.recurringTypeId}
                                                        onChange={(e) => {
                                                            setFormField(e, setFieldValue);
                                                        }}
                                                    >
                                                        <option value="" disabled selected>
                                                            Select Recurring Name
                                                        </option>
                                                        {recurringTypes &&
                                                            recurringTypes.length &&
                                                            recurringTypes.map((item: any, index: string) => (
                                                                <option key={`${index}_${item.recurringTypeId}`} value={item.recurringTypeId}>
                                                                    {item.recurringName}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>

                                                <div className="col-md-3 mb-3">
                                                    <label>Recurring Action *</label>
                                                    <select
                                                        disabled
                                                        placeholder="Recurring Name"
                                                        className="form-select"
                                                        name="recurringTypeId"
                                                        id="type"
                                                        value={values.recurringTypeId}
                                                        onChange={(e) => {
                                                            setFieldValue('recurringTypeId', e.target.value);
                                                        }}
                                                    >
                                                        <option value="" disabled selected>
                                                            Recurring Action
                                                        </option>
                                                        {recurringTypes &&
                                                            recurringTypes.length &&
                                                            recurringTypes.map((item, index) => (
                                                                <option key={`${index}_${item.recurringTypeId}`} value={item.recurringTypeId}>
                                                                    {item.recurringDeduction === true ? "Deduct" : "Add"}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <label>Amount</label>
                                                    <input
                                                        className="form-control"
                                                        name="adjustmentAmount"
                                                        value={values.adjustmentAmount ? values.adjustmentAmount : values.amount}
                                                        onChange={(e) => {
                                                            setFieldValue('adjustmentAmount', e.target.value);
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <label>End Date</label>
                                                    <input
                                                        type="date"
                                                        className="formControl"
                                                        name="endDate"
                                                        value={values.endDate}
                                                        onChange={(e) => {
                                                            setFieldValue('endDate', e.target.value);
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <label>Status</label>
                                                    <select
                                                        disabled
                                                        name="active"
                                                        className="formControl"
                                                        value={values.active}
                                                        onChange={(e) => {
                                                            setFieldValue('active', e.target.value);
                                                        }}
                                                    ><option value="" disabled selected>
                                                            Status
                                                        </option>
                                                        <option value={true}>Active</option>
                                                        <option value={false}>Inactive</option>
                                                    </select>
                                                </div>
                                            </div>

                                        </div>

                                    ) :

                                        <div>
                                            {recurring.map((values: any, index: any) => {
                                                return (
                                                    <div key={`recurring-${index}`}>
                                                        <div className="form-group row">
                                                            <div className="col-md-3 mb-3">
                                                                <label>Employee ID</label>
                                                                <input
                                                                    readOnly
                                                                    className="formControl"
                                                                    name="userId"
                                                                    value={values.userId ? values.userId : ''}
                                                                    onChange={(e) => {
                                                                        const updatedFields = [...recurring];
                                                                        updatedFields[index].userId = e.target.value;
                                                                        setRecurring(updatedFields);
                                                                        setFormField(e, setFieldValue)
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col-md-3 mb-3">
                                                                <label>Employee Name *</label>
                                                                <select
                                                                    placeholder="Employee Name"
                                                                    className="form-select"
                                                                    value={values.userId}
                                                                    onChange={(e) => {
                                                                        const selectedValue = e.target.value;
                                                                        const updatedFields = [...recurring];
                                                                        updatedFields[index].userId = selectedValue;
                                                                        setRecurring(updatedFields);
                                                                        setFormField(e, setFieldValue)

                                                                        // Update the employee ID field with the selected employee's userId
                                                                        const selectedEmployee = employee.find(
                                                                            (item) => item.userId === selectedValue
                                                                        );
                                                                        const employeeIdField = document.getElementsByName('userId')[0];
                                                                        if (selectedEmployee) {
                                                                            employeeIdField.value = selectedEmployee.userId;
                                                                        } else {
                                                                            employeeIdField.value = '';
                                                                        }
                                                                    }}
                                                                >
                                                                    <option value="" disabled selected>
                                                                        Select Employee
                                                                    </option>
                                                                    {employee &&
                                                                        employee.length &&
                                                                        employee.map((item: any, index: string) => (
                                                                            <option key={`${index}_${item.userId}`} value={item.userId}>
                                                                                {item.label}
                                                                            </option>
                                                                        ))}
                                                                </select>
                                                            </div>


                                                            <div className="col-md-3 mb-3">
                                                                <label>Recurring Name *</label>
                                                                <select
                                                                    placeholder="Recurring Name"
                                                                    className="form-select"
                                                                    name="recurringTypeId"
                                                                    id="type"
                                                                    value={values.recurringTypeId}
                                                                    onChange={(e) => {
                                                                        const selectedValue = e.target.value;
                                                                        const updatedFields = [...recurring];
                                                                        updatedFields[index].recurringTypeId = selectedValue;
                                                                        setRecurring(updatedFields);
                                                                        setFormField(e, setFieldValue);
                                                                        const selectedType = recurringTypes.find(
                                                                            (item) => item.recurringTypeId === selectedValue
                                                                        );
                                                                        const isDeductionField = document.getElementsByName('recurringTypeId')[0];
                                                                        if (selectedType) {
                                                                            isDeductionField.value = selectedType.deduction;
                                                                        } else {
                                                                            isDeductionField.value = '';
                                                                        }
                                                                    }}
                                                                >
                                                                    <option value="" disabled={!index} selected={!index}>
                                                                        Select Recurring Name
                                                                    </option>
                                                                    {recurringTypes &&
                                                                        recurringTypes.length &&
                                                                        recurringTypes.map((item, index) => (
                                                                            <option key={`${index}_${item.recurringTypeId}`} value={item.recurringTypeId}>
                                                                                {item.recurringName}
                                                                            </option>
                                                                        ))}
                                                                </select>
                                                            </div>

                                                            {/* start of test  */}
                                                            <div className="col-md-3 mb-3">
                                                                <label>Recurring Action *</label>
                                                                <select
                                                                    disabled
                                                                    placeholder="Recurring Name"
                                                                    className="form-select"
                                                                    name="recurringTypeId"
                                                                    id="type"
                                                                    value={values.recurringTypeId}
                                                                    onChange={(e) => {
                                                                        const selectedValue = e.target.value;
                                                                        const updatedFields = [...recurring];
                                                                        updatedFields[index].recurringTypeId = selectedValue;
                                                                        setRecurring(updatedFields);
                                                                        setFormField(e, setFieldValue);
                                                                        const selectedType = recurringTypes.find(
                                                                            (item) => item.recurringDeduction === selectedValue
                                                                        );
                                                                        const isDeductionField = document.getElementsByName('recurringDeduction')[0];
                                                                        if (selectedType) {
                                                                            isDeductionField.value = selectedType.recurringDeduction;
                                                                        } else {
                                                                            isDeductionField.value = '';
                                                                        }
                                                                    }}
                                                                >
                                                                    <option value="" disabled={!index} selected={!index}>
                                                                        Recurring Action
                                                                    </option>
                                                                    {recurringTypes &&
                                                                        recurringTypes.length &&
                                                                        recurringTypes.map((item, index) => (
                                                                            <option key={`${index}_${item.recurringTypeId}`} value={item.recurringTypeId}>
                                                                                {item.recurringDeduction === true ? "Deduct" : "Add"}
                                                                            </option>
                                                                        ))}
                                                                </select>
                                                            </div>
                                                            {/* end of test  */}
                                                            <div className="col-md-4 mb-3">
                                                                <label>Amount</label>
                                                                <input
                                                                    className="form-control"
                                                                    name="adjustmentAmount"
                                                                    value={values.adjustmentAmount ? values.adjustmentAmount : values.amount}
                                                                    onChange={(e) => {
                                                                        setFieldValue('adjustmentAmount', e.target.value);
                                                                        const updatedFields = [...recurring];
                                                                        updatedFields[index].adjustmentAmount = e.target.value;
                                                                        setRecurring(updatedFields);
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col-md-4 mb-3">
                                                                <label>End Date</label>
                                                                <input
                                                                    type="date"
                                                                    className="formControl"
                                                                    name="endDate"
                                                                    value={values.endDate}
                                                                    onChange={(e) => {
                                                                        setFieldValue('endDate', e.target.value);
                                                                        const updatedFields = [...recurring];
                                                                        updatedFields[index].endDate = e.target.value;
                                                                        setRecurring(updatedFields);
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col-md-4 mb-3">
                                                                <label>Status</label>
                                                                <select
                                                                    name="active"
                                                                    className="formControl"
                                                                    value={values.active}
                                                                    onChange={(e) => {
                                                                        const selectedValue = e.target.value === 'true';
                                                                        setFieldValue('active', selectedValue);
                                                                        const updatedFields = [...recurring];
                                                                        updatedFields[index].active = e.target.value;
                                                                        setRecurring(updatedFields);
                                                                    }}
                                                                ><option value="" disabled={!index} selected={!index}>
                                                                        Status
                                                                    </option>
                                                                    <option value={true}>Active</option>
                                                                    <option value={false}>Inactive</option>
                                                                </select>
                                                            </div>

                                                            {values.employeeId}

                                                            {recurring.length > 1 && (
                                                                <div className="col-md-3 mb-3">
                                                                    <label>&nbsp;</label>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-danger"
                                                                        onClick={() => handleRemoveField(index)}
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            }


                                            )
                                            }
                                        </div>
                                    }


                                    <div className="d-flex justify-content-end px-5">
                                        {values.userId ? null : (
                                            <button
                                                type="button"
                                                className="btn btn btn-outline-primary me-2 mb-2 mt-2"
                                                onClick={handleAddField}
                                            >
                                                Add Field
                                            </button>
                                        )}
                                    </div>
                                    <Modal.Footer>
                                        <button
                                            type="submit"
                                            className="btn btn-primary">
                                            Save
                                        </button>
                                    </Modal.Footer>

                                </Form>
                            )
                        }}
                    </Formik>
                </Modal.Body>
            </Modal>
        </>

    )
}

