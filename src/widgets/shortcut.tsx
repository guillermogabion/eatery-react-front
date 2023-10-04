import React, { useState, useRef, useEffect } from "react";
import { RequestAPI, Api } from "../api";
import { async } from "validate.js";
import { Button, Modal, Form, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux"
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import * as Yup from "yup";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import { trash, plus, check, action_edit, check_circle, save } from "../assets/images"
import { tr } from "date-fns/locale";




const ErrorSwal = withReactContent(Swal);
const Shortcut = () => {

    const [ modalShow, setModalShow] = useState(false)
    const [ shortcut, setShortcut] = useState<any>([]) 
    const [ menu, setMenu] = useState<any>([]) 
    const [showShortcut, setShowShortcut] = useState(true);
    const [showManage, setShowManage] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const dispatch = useDispatch()
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const [clickedSubmenuItem, setClickedSubmenuItem] = useState(null);
    const [submenuItemInputValue, setSubmenuItemInputValue] = useState("");
    const [isSwitchOn, setSwitchOn] = useState(false);
    const [initialSubmenuItemInputValue, setInitialSubmenuItemInputValue] = useState("");
    

    const formRef = useRef();


    const [initialValues, setInitialValues] = useState<any>({
        "name" : "",
        "endpoint" : ""
    })

    const AddShortcut = (name : any, endpoint: any, parent: any) => {

        console.log(name)
        console.log(endpoint)
        console.log(parent)

        RequestAPI.postRequest(
            Api.addShortcut,
            "",
            { name: name, endpoint : endpoint, parent : parent },
            {},
            async (res) => {
                const { status, body = { data: {}, error: {} } } = res;
                if (status === 200 || status === 201) {
                getShortcut();
                console.log('success');
                } else {
                console.log("Failed to update");
                }
            }
        )
        // const loading = Swal.fire({
        //     title: '',
        //     allowOutsideClick: false,
        //     didOpen: () => {
        //         Swal.showLoading();
        //     }
        // })

        // const valuesObj : any = { ...values }
        
        // RequestAPI.postRequest(Api.addShortcut, "", valuesObj, {},
        //     async (res) => {
        //         const { status, body = {data : {}, error: {}}} = res;
        //         if (status === 200 || status == 201) {
        //             if (body.error && body.error.message) {
        //               ErrorSwal.fire({
        //                 title: 'Error!',
        //                 text: (body.error && body.error.message) || "",
        //                 didOpen: () => {
        //                   const confirmButton = Swal.getConfirmButton();
        //                   if (confirmButton)
        //                     confirmButton.id = "dashboardshortcut_errorconfirm_alertbtn";
        //                 },
        //                 icon: 'error',
        //               });
        //             }else{
        //                 ErrorSwal.fire({
        //                     title: 'Create Successfully!!',
        //                     text: (body.data) || "",
        //                     didOpen: () => {
        //                       const confirmButton = Swal.getConfirmButton();
        //                       if (confirmButton)
        //                         confirmButton.id = "dashboardshortcut_succsessconfirm_alertbtn";
        //                     },
        //                     icon: 'success',
        //                   }).then((result) => {
        //                       if (result.isConfirmed) {
        //                       location.reload();
        //                       }
        //                 });
        //             }
                 
        //         }
        //     }
        // )


        console.log('test')
    }

    const getShortcut = () => {
        RequestAPI.getRequest(
            `${Api.getShortcut}`,
            "",
            {},
            {},
            async(res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                setShortcut(body.data)
                console.log(body.data);
                } else {
                }
            }
        )
    }

    useEffect (() => {
        getShortcut()
        RequestAPI.getRequest(
            `${Api.viewMenu}`,
            "",
            {},
            {},
            async(res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                setMenu(body.data)
                console.log(body.data);
                } else {
                }
            }
        )
    }, [])
    const setFormField = (e: any, setFieldValue: any) => {
        const { name, value } = e.target
        if (setFieldValue) {
            setFieldValue(name, value)
        }
    }

    const toggleDivs = () => {
        setShowShortcut(!showShortcut);
        setShowManage(!showManage);
    };
    const toggleDivs2 = () => {
        setShowAdd(!showAdd);
        setShowManage(!showManage);
    };
    const toggleDivs3 = () => {
        setShowAdd(!showAdd);
        setShowShortcut(!showShortcut);
    };
    const hasSimilarShortcut = (submenuItem) => {
    const trimmedSubmenuItemRoute = submenuItem.route.trim().toLowerCase();
    
    const hasSimilar = shortcut.some((item) => {
        const trimmedShortcutEndpoint = item.endpoint.trim().toLowerCase();
        return trimmedShortcutEndpoint.includes(trimmedSubmenuItemRoute);
        });
    
        return hasSimilar;
    };
    const handleSubmenuItemClick = (submenuItem) => {
        setInitialSubmenuItemInputValue(submenuItemInputValue);
        
        if (clickedSubmenuItem === submenuItem) {
            setClickedSubmenuItem(null);
            setSubmenuItemInputValue("");
        } else {
            setClickedSubmenuItem(submenuItem);
            setSubmenuItemInputValue(submenuItem.label);
        }
    };

    const initialVisibilityStates = {};
    shortcut.forEach((item) => {
    initialVisibilityStates[item.id] = item.isVisible;
    });
      

    const visibility = (id : any) => {
        RequestAPI.postRequest(
          Api.changeVisibility,
          "",
          { id: id },
          {},
            async (res) => {
                const { status, body = { data: {}, error: {} } } = res;
                if (status === 200 || status === 201) {
                    getShortcut()
                console.log("success");
                } else {
                console.log("failed");
                }
            }
        );
    };
    const deleteItem = (id: any) => {
        RequestAPI.deleteRequest(
            // Api.deleteShortcut,
            `${Api.deleteShortcut}?id=${id}`,
            "",  // This is an empty string, which is the second argument
            {},  // This is an empty object, which is the third argument
            async (res) => {
                const { status, body = { data: {}, error: {} } } = res;
                if (status === 200 || status === 201) {
                    getShortcut();
                    console.log(id + ' deleted');
                } else {
                    console.log("Failed");
                }
            }
        );
    };
    

    const changeName = () => {

    }


    const handleToggle = (id) => {
        console.log("Toggling visibility for item with id:", id);
        setVisibilityStates((prevStates) => ({
          ...prevStates,
          [id]: !prevStates[id],
        }));
      };  
        // Rest of your code...
    const [visibilityStates, setVisibilityStates] = useState(() => {
        return shortcut.reduce((acc, item) => {
            acc[item.id] = item.isVisible;
            return acc;
        }, {});
    });

    const saveSecondaryName = (endpoint: any, secondaryName: any) => {
        console.log('Attempting to save secondary name:', endpoint, secondaryName);
        RequestAPI.postRequest(
          Api.changeName,
          "",
          { endpoint: endpoint, secondaryName: secondaryName },
          {},
          async (res) => {
            const { status, body = { data: {}, error: {} } } = res;
            if (status === 200 || status === 201) {
              console.log(endpoint + ' updated');
              getShortcut();
            } else {
              console.log("Failed to update. Response:", res);
            }
          }
        );
        console.log('Save attempt completed:', endpoint, secondaryName);
      };
    return (
        <div className="time-card-width">
            <div className="card-header">
                <span className="">Quick Shortcut</span>
            </div>
            <div className="shortcut-card-body">
                {showShortcut && 
                    <div className="">
                        <div className="shortcut-inner-body">
                            <div style={{ maxHeight: '320px', overflowY: 'auto', overflowX: 'hidden'}}>
                            <div className="row d-flex pr-2" >
                                {
                                    shortcut && shortcut.length > 0 ? (
                                        shortcut.map((item: any, index: any) => (
                                            item.isVisible ? (
                                                <div key={index} id={"dashboardshortcut_div_" + item.endpoint} className="col-6 pb-2">
                                                  <Link
                                                    className="non-transparent-border"
                                                    to={item.endpoint}
                                                    id={"dashboardshortcut_link_" + item.endpoint}
                                                  >
                                                    <span style={{ lineHeight: "0%", color: "white" }}>
                                                      {item.name}
                                                    </span>
                                                  </Link>
                                                </div>
                                              ) : null
                                        ))
                                    ) : ""
                                }
                                <div className="col-6 ">
                                    <p className="transparent-border"
                                    id={"dashboardshortcut_addshortcut_btn"}
                                    onClick={toggleDivs3}
                                    style={{cursor:'pointer'}}
                                    >
                                        <p style={{fontSize:"50px", fontWeight: "bold", lineHeight: "0%", color:"#189FB5"}}>+</p> 
                                        <br />
                                        <span style={{lineHeight: "0%", color:"#189FB5"}}>Add Shortcut</span>
                                    </p>
                                </div>

                            </div>
                            </div>
                           
                        </div>
                       
                    </div>
                }
                { showManage && 
                    <div className="shortcut-inner-body">
                        <div>
                            <Table>
                                <div style={{ height: '320px', overflowY: 'auto', overflowX: 'hidden', marginLeft: '30px' }}>

                                    <thead>
                                        <tr>
                                            <th>Shortcut Name</th>
                                            <th>Display</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                       
                                        { shortcut &&
                                            shortcut.length > 0 ?
                                            shortcut.map((item: any, index: any) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{item.name}</td>
                                                        <td>
                                                            <label className="switch">
                                                            <input
                                                                type="checkbox"
                                                                checked={item.isVisible}
                                                                onClick={() => {visibility(item.id)}}
                                                                style={{height: '10px'}}
                                                            />
                                                            <span className="slider round" style={{height: '25px'}}></span>
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <label>
                                                                <img src={trash} alt="Delete Shortcut"  onClick={() => {deleteItem(item.id)}} width={50} style={{cursor: 'pointer'}} />
                                                            </label>
                                                        </td>

                                                    </tr>
                                                )
                                            }) :  (
                                                <div className="w-100 text-center">
                                                    <label>No Shortcuts Added Yet</label>
                                                </div>
                                            )
                                        }
                                          
                                    </tbody>
                                </div>
                            </Table>
                        </div>
                    </div>
                }

                { showAdd &&
                    <div className="shortcut-inner-body">
                    <div>
                        <Table responsive style={{ width: '100%' }}>
                            <div style={{ height: '350px', overflowY: 'auto', overflowX: 'hidden', marginLeft: '30px' }}>
                                <thead>
                                    <tr style={{ border: 'none' }}>
                                        <th style={{ width: 'auto'}}>Parent / Page Name</th>
                                        <th style={{ width: 'auto', textAlign: 'center'}}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {menu.flatMap((menuItem, index) => (
                                        menuItem.menu.map((submenuItem, subIndex) => {
                                            const hasSimilar = hasSimilarShortcut(submenuItem);

                                            return (
                                                <tr
                                                    key={`${index}-${subIndex}`}
                                                    style={{ border: 'none' }}
                                                >
                                                    <td
                                                    className=""
                                                    style={{
                                                        fontWeight: hasSimilar ? 'bold' : 'normal',
                                                        fontStyle: hasSimilar ? 'italic' : 'normal',
                                                        padding: '8px 0 8px 0',
                                                        margin: '0',
                                                        textAlign: 'left',
                                                        height: '25px',
                                                    }}
                                                    >
                                                        {clickedSubmenuItem === submenuItem ? (
                                                            hasSimilar && (
                                                                <div style={{ whiteSpace: 'nowrap' }}>
                                                                    <span style={{ cursor: hasSimilar ? 'pointer' : 'not-allowed', margin: '0' }} onClick={() => hasSimilar && handleSubmenuItemClick(submenuItem)}>
                                                                        {submenuItem.type.charAt(0).toUpperCase() + submenuItem.type.slice(1).toLowerCase()}/
                                                                    </span>
                                                                    <input
                                                                        className="formControl mx-1"
                                                                        type="text"
                                                                        name="secondaryName"
                                                                        value={submenuItemInputValue}
                                                                        onChange={(e) => {setSubmenuItemInputValue(e.target.value)
                                                                                        saveSecondaryName(submenuItem.route, submenuItemInputValue)
                                                                        }}
                                                                        onBlur={() => setClickedSubmenuItem(null)}
                                                                        style={{ height: '25px', fontSize: '15px', maxWidth: '200px' }}
                                                                    />
                                                                 
                                                                </div>
                                                            )
                                                        ) : (
                                                            <div style={{ whiteSpace: 'nowrap' }}>
                                                                <span
                                                                style={{ cursor: hasSimilar ? 'pointer' : 'not-allowed', paddingRight: '100px' }}
                                                                onClick={() => hasSimilar && handleSubmenuItemClick(submenuItem)}
                                                                >
                                                                    {submenuItem.type.charAt(0).toUpperCase() + submenuItem.type.slice(1).toLowerCase()}/{submenuItem.label}
                                                                </span>
                                                            </div>
                                                            
                                                        )}
                                                    </td>
                                                    <td style={{ height: '25px', margin: '0', padding: '15px', textAlign: 'center' }}>
                                                        <label>
                                                            {hasSimilar ? (
                                                                clickedSubmenuItem !== submenuItem ? (
                                                                    <img src={check_circle} alt="" width={20} style={{ cursor: 'pointer' }} />
                                                                ) : <img src={save} onClick={() => saveSecondaryName(submenuItem.route, submenuItemInputValue)} alt="" width={20} style={{ cursor: 'pointer', position: 'relative', zIndex: '9999' }} />
                                                            ) : (
                                                                <img src={plus} alt="" onClick={() => {AddShortcut(submenuItem.label, submenuItem.route, submenuItem.type)}} width={20}  style={{ cursor: 'pointer' }} />
                                                            )}
                                                        </label>
                                                    </td>

                                                </tr>
                                            );
                                        })
                                    ))}
                                </tbody>
                            </div>
                        </Table>
                    </div>
                </div>
                }

                {showShortcut &&
                    <div className="col-12 pt-12 px-2 pb-1 mt-3">
                        <Button
                        style={{width:'100%'}}
                        onClick={toggleDivs}
                        className="btn btn-primary"
                        >Manage Quick Shortcut</Button>
                    </div>
                }
                 { showManage && 
                    <div className="row d-flex mx-1 pt-12 mt-4">
                        <div className="col-6">
                            <button
                            style={{width:'100%', height: '45px'}}
                            onClick={toggleDivs}
                            className="btn btn btn-outline-primary"
                            >Back to Previous</button>
                        </div>
                        <div className="col-6">
                            <button
                            style={{width:'100%'}}
                            onClick={toggleDivs2}
                            className="btn btn-primary"
                            >Add Shortcut</button>
                        </div>
                    </div>
                }
                 { showAdd && 
                    <div>
                        <div className="row d-flex  mx-1 pt-12 mt-4">
                            <div className="col-6">
                                <button
                                style={{width:'100%', height: '45px'}}
                                onClick={toggleDivs2}
                                className="btn btn btn-outline-primary"
                                >Back to Previous</button>
                            </div>
                            <div className="col-6">
                                <button
                                style={{width:'100%'}}
                                onClick={toggleDivs3}
                                className="btn btn-primary"
                                >Shortcut List</button>
                            </div>  
                        </div>
                    </div>
                }
                

               
            </div>
            <Modal
                show={modalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                onHide={() => {
                setModalShow(false)
                }}
                dialogClassName="modal-90w"
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Create Shortcut
                </Modal.Title>
            </Modal.Header>
                <Modal.Body className="row w-100 px-5">
                    <Formik
                        innerRef={formRef}
                        initialValues={initialValues}
                        enableReinitialize={true}
                        validationSchema={
                            Yup.object().shape({
                                name: Yup.string().required("This Field is Required"),
                                endpoint : Yup.string().required("This Field is Required")
                            })
                        }
                        onSubmit={AddShortcut}
                    >
                         {({ values, setFieldValue, handleSubmit, errors, touched }) => {
                            return (
                                <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
                                    <div className="row w-100 px-5">
                                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                            <label>Shortcut Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                id={"dashboardshortcut_shortcutname_input"}
                                                className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                                                value={values.name}
                                                onChange={(e) => {
                                                    setFieldValue('name', e.target.value);
                                                }}
                                                />
                                                {touched.name && errors.name && <div id="payrollsettingot_errorname_modalp" className="invalid-feedback">{errors.name}</div>}
                                        </div>
                                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                          
                                            <label>Shortcut Link</label>
                                            <select
                                                id={"dashboardshortcut_shortcutlink_input"}
                                                className={`form-control ${touched.endpoint && errors.endpoint ? 'is-invalid' : ''}`}
                                                name="endpoint"
                                                value={values.endpoint}
                                                onChange={(e) => {
                                                    setFormField(e, setFieldValue);
                                                }}
                                                >
                                                <option value="" disabled selected>
                                                    Select A Link Address
                                                </option>

                                                {userData.data.profile.menus.flatMap((menuItem, index) => (
                                                menuItem.menu.map((submenuItem, subIndex) => (
                                                    <option key={`${index}-${subIndex}`} value={submenuItem.route}>
                                                    {submenuItem.label}
                                                    </option>
                                                ))
                                                ))}
                                            </select>
                                            {touched.endpoint && errors.endpoint && <div className="invalid-feedback">{errors.endpoint}</div>}
                                            
                                        </div>

                                    </div>
                                    <div className="d-flex justify-content-center px-5">
                                        <button
                                            id={"dashboardshortcut_save_btn"}
                                            type="submit"
                                            className="btn btn-primary mx-2 mt-3"
                                            style={{width: '120px'}}
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
    )
}

export default Shortcut