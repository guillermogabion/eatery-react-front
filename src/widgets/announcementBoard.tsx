import React, { useState, useEffect, useRef } from "react";
import { RequestAPI, Api } from "../api";
import { Utility } from "../utils"
import { async } from "validate.js";
import { Card, Tabs, Tab, Table, Button, Modal, Form } from "react-bootstrap";
import { useSelector } from "react-redux"
import { Formik } from "formik"
import http from "../helpers/axios"



const AllAnnouncement = () => {
    const [ allAnnouncement , setAllAnnouncement] = useState<any>([])

    useEffect (() => {
        RequestAPI.getRequest(
            `${Api.getAllAnnouncements}`,
            "",
            {},
            {},
            async(res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                setAllAnnouncement(body.data)
                console.log(body.data);
                } else {
                }
            }
        )
    }, [])

    return (
        <div style={{height: '52vh'}}>
            
            { allAnnouncement && allAnnouncement.length > 0 ? (
                allAnnouncement.map((item, index) => (
                    <div key={index}>
                        {item.subject}
                    </div>
                ))

            ): "No Announcement Yet" }
        
        </div>
    )

}
const Events = () => {
    const [ events , setEvents] = useState<any>([])

    useEffect (() => {
        RequestAPI.getRequest(
            `${Api.getEvents}`,
            "",
            {},
            {},
            async(res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                setEvents(body.data)
                console.log(body.data);
                } else {
                }
            }
        )
    }, [])

    return (
        <div style={{height: '52vh'}}>
            { events && events.length > 0 ? (
                events.map((item, index) => (
                    <div key={index}>
                        {item.subject}
                    </div>
                ))

            ): "No posted Announcement about events Yet" }
        </div>
    )

}
const IT = () => {
    const [ IT , setIT] = useState<any>([])

    useEffect (() => {
        RequestAPI.getRequest(
            `${Api.getIT}`,
            "",
            {},
            {},
            async(res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                setIT(body.data)
                console.log(body.data);
                } else {
                }
            }
        )
    }, [])

    return (
        <div style={{height: '52vh'}}>
            { IT && IT.length > 0 ? (
                IT.map((item, index) => (
                    <div key={index}>
                        {item.subject}
                    </div>
                ))

            ): "No posted Announcement about IT Security Yet" }
        </div>
    )

}
const Policy = () => {
    const [ policy , setPolicy] = useState<any>([])

    useEffect (() => {
        RequestAPI.getRequest(
            `${Api.getPolicy}`,
            "",
            {},
            {},
            async(res: any) => {
                const { status, body = { data: {}, error: {} } }: any = res
                if (status === 200 && body && body.data) {
                setPolicy(body.data)
                console.log(body.data);
                } else {
                }
            }
        )
    }, [])

    return (
        <div style={{height: '52vh'}}>
            { policy && policy.length > 0 ? (
                policy.map((item, index) => (
                    <div key={index}>
                        {item.subject}
                    </div>
                ))

            ): "No posted Announcement about Policy Updates Yet" }
        </div>
    )

}



const AnnouncementBoard = () => {
  const { data } = useSelector((state: any) => state.rootReducer.userData)
  const { authorizations } = data?.profile
  const [ modalShow, setModalShow ] = React.useState(false) 
  const [ dropdown, getDropdown ]  = React.useState([])
  const [ dropdownAudience, getDropdownAudience ]  = React.useState([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const formRef: any = useRef()


  let initialValues = {
    
        "type" : "",
        "audience" : "",
        "target" : "",
        "subject" : "",
        "description" : "",
        "startDate" : "",
        "endDate" : "",
        "file" : ""
  }

  useEffect  (() => {
    RequestAPI.getRequest(`${Api.getAnnouncementDropdown}`, "", {}, {},
        async(res: any ) => {
            const { status, body = { data: {}, error: {} } }: any = res
            if (status === 200 && body && body.types) {
            getDropdown(body.types)
            console.log(body.types);
            } else {
            }
        }
    )
    RequestAPI.getRequest(`${Api.getAnnouncementDropdown}`, "", {}, {},
        async(res: any ) => {
            const { status, body = { data: {}, error: {} } }: any = res
            if (status === 200 && body && body.types) {
            getDropdownAudience(body.audiences)
            console.log(body.audiences);
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

    const submitAnnouncement = (values) => {
        const formData = new FormData();

        formData.append("type", values.type)
        formData.append("audience", values.audience)
        formData.append("target", values.target)
        formData.append("subject", values.subject)
        formData.append("description", values.description)
        formData.append("startDate", values.startDate)
        formData.append("endDate", values.endDate)
        if (values.file) {
            formData.append("file", values.file);
          }
        console.log(formData)

        for (const pair of formData.entries()) {
            console.log(`FormData Entry: ${pair[0]}, ${pair[1]}`);
          }

          return http.post(`${Api.createAnnouncement}`, formData, {
            headers: {
                "Content-Type" : "multipart/form-data",
                Authorization: `Bearer ${Utility.getUserToken() || ""}`,
                credentials: true,
            }
          }).then((response) => {
            // Log the response data to the console
            console.log("Response Data:", response.data);
      
            // You can return the response if needed
            return response;
          })
          .catch((error) => {
            // Handle any errors here
            console.error("Error:", error);
          });

    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // Use optional chaining to safely access the first file
      
        if (file) {
          setSelectedFile(file);
        }
      };




    return (
        <div className="time-card-width">
            <div className="card-header">
                <span className="">Announcement Board</span>
            </div>
            <div className="time-card-body">
                <div className="announcement-space">
                    <Tabs defaultActiveKey="tab1" id="my-tabs" className="custom-tab-announcement justify-content-center">
                        <Tab className="custom-tabs" id="announcementboards_tab_all"  eventKey="tab1" title="All">
                        <AllAnnouncement/>
                        </Tab>
                        <Tab  className="custom-tabs" id="announcementboards_tab_events" eventKey="tab2" title="Events">
                            <Events />
                        </Tab>
                        <Tab  className="custom-tabs" id="announcementboards_tab_itsecurity" eventKey="tab3" title="IT Security">
                            <IT/>
                        </Tab>
                        <Tab  className="custom-tabs" id="announcementboards_tab_policyupdates" eventKey="tab4" title="Policy Updates">
                            <Policy/>
                        </Tab>
                    </Tabs>
                </div>
                
                <div className="d-flex justify-content-center">
                { data.profile.role != 'EMPLOYEE' ?
                    <>
                        <div className="col-12 announcement-button">
                            <Button 
                                id="announcementboards_btn_createannouncement"
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                onClick={() => setModalShow(true)}
                                >
                                    Create Announcement
                                </Button>
                        </div>
                    </> : null
                }
                </div>
            </div>
            <Modal
                show={modalShow}
                size="xl"
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
                        Create Announcement
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="row w-100 px-5">
                    <Formik
                        innerRef={formRef}
                        initialValues={initialValues}
                        enableReinitialize={true}
                        validationSchema={null}
                        onSubmit={submitAnnouncement}
                    >
                         {({ values, setFieldValue, handleSubmit, errors, touched }) => {
                            return (
                                <Form noValidate onSubmit={handleSubmit} id="_formid" autoComplete="off">
                                    <div className="row w-100 px-5">
                                        
                                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 my-2">
                                            <label>Types</label>
                                            <select 
                                            id="announcementboards_types_input"
                                            className="form-select"
                                            name="type"
                                            value={values.type}
                                            onChange={(e) => {
                                                setFormField(e, setFieldValue);
                                            }}
                                            style={{width: '100%'}}
                                            >
                                                <option value="" disabled selected>
                                                    Select Announcement Type
                                                </option>
                                                {dropdown && dropdown.length && (
                                                    dropdown.map ((item, index) => (
                                                        <option key={index} value={item}> {Utility.removeUnderscore(item)}</option>
                                                    ))
                                                )}
                                                {/* { dropdown.map((item, index) => (
                                                    <option key={index} value={item}>{item.types}</option>
                                                ))} */}
                                            </select>
                                        </div>
                                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 my-2">
                                            <label>Audiences</label>
                                            <select 
                                                id="announcementboards_audience_input"
                                                className="form-select"
                                                name="audience"
                                                value={values.audience}
                                                onChange={(e) => {
                                                    setFormField(e, setFieldValue);
                                                }}
                                                style={{width: '100%'}}
                                                >
                                                    <option value="" disabled selected>
                                                        Select Audiences
                                                    </option>
                                                    {dropdownAudience && dropdownAudience.length && (
                                                        dropdownAudience.map ((item, index) => (
                                                            <option key={index} value={item}> {Utility.removeUnderscore(item) }</option>
                                                        ))
                                                    )}
                                            </select>
                                        </div>
                                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 my-2">
                                            <label>Target</label>
                                            <input 
                                            id="announcementboards_target_input"
                                            className="form-control"
                                            type="text" 
                                            name="target"
                                            value={values.target}
                                            onChange={(e) => {
                                                setFormField(e, setFieldValue)
                                            }}
                                            style={{width: '100%'}}
                                            />
                                        </div>
                                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 my-2">
                                            <label>Subject</label>
                                            <textarea id="announcementboards_subject_input" name="subject" className="form-control" value={values.subject} 
                                             onChange={(e) => {
                                                setFormField(e, setFieldValue)
                                            }}/>
                                        </div>
                                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 my-2">
                                            <label>Description</label>
                                            <textarea name="description" id="announcementboards_description_input" className="form-control" value={values.description} 
                                             onChange={(e) => {
                                                setFormField(e, setFieldValue)
                                            }}/>
                                        </div>
                                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 my-2">
                                            <label>Start Date</label>
                                            <input 
                                            className="form-control"
                                            type="date" 
                                            id="announcementboards_startdate_input"
                                            name="startDate"
                                            value={values.startDate}
                                            onChange={(e) => {
                                                setFormField(e, setFieldValue)
                                            }}
                                            style={{width: '100%'}}
                                            />  
                                        </div>  
                                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 my-2">
                                            <label>End Date</label>
                                            <input 
                                            className="form-control"
                                            type="date" 
                                            id="announcementboards_enddate_input"
                                            name="endDate"
                                            value={values.endDate}
                                            onChange={(e) => {
                                                setFormField(e, setFieldValue)
                                            }}
                                            style={{width: '100%'}}
                                            />  
                                        </div>
                                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 my-2">
                                            <label>File</label>
                                            <input
                                                className="form-control"
                                                type="file"
                                                id="announcementboards_file_input"
                                                name="file"
                                                // value={values.file}
                                                accept=".jpg, .png, .pdf, .doc"
                                                onChange={(e) => {
                                                    // Set the 'file' property in form values to the selected file
                                                    setFieldValue("file", e.currentTarget.files[0]);
                                                  }}
                                                style={{ width: '100%' }}
                                            />
                                        </div>

                                    </div>
                                    <div className="d-flex justify-content-end">
                                    <button
                                        id="announcementboards_save_btn"
                                        type="submit"
                                        className="btn btn-primary"
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

export default AnnouncementBoard