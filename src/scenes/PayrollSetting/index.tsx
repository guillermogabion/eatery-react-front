import React from "react"
import UserTopMenu from "../../components/UserTopMenu"

import moment from "moment"
import { Button, Modal, Tabs, Tab } from "react-bootstrap"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Api, RequestAPI } from "../../api"
import DashboardMenu from "../../components/DashboardMenu"
import TableComponent from "../../components/TableComponent"
import Recurring from "./recurring"
import TimeDate from "../../components/TimeDate"
const ErrorSwal = withReactContent(Swal)



export const PayrollSetting = (props: any) => {
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const { data } = useSelector((state: any) => state.rootReducer.userData)

    const { history } = props
    const [downloadModalShow, setDownloadModalShow] = React.useState(false);
    const [fromDate, setFromDate] = React.useState(moment().format('YYYY-MM-DD'));
    const [toDate, setToDate] = React.useState(moment().format('YYYY-MM-DD'));
    const [isSubmit, setIsSubmit] = React.useState(false);


    const tableHeaders = [
        'Date Filed',
        'Effectivity Date',
        'Shift Start',
        'Shift Type',
        'Reason',
        'Status',
        'Action',
    ]

    const downloadExcel = (fromDate: any, toDate: any) => {
        setIsSubmit(true)
        RequestAPI.getFileAsync(
            `${Api.downloadTimeKeeping}?fromDate=${fromDate}&toDate=${toDate}`,
            "",
            "timekeeping.xlsx",
            async (res: any) => {
                if(res){
                    setIsSubmit(false)
                }
                
            }
        )
        // console.log(download)
    }

    return (
        <div className="body">
            <div className="wraper">
                <div className="w-100">
                    <div className="topHeader">
                        <UserTopMenu />
                    </div>
                    <div className="contentContainer row p-0 m-0" style={{ minHeight: '100vh' }}>
                        <DashboardMenu />
                        <div className="col-md-12 col-lg-10 px-5 py-5">
                            <div className="row">
                                <div className="col-md-6">
                                    <h2 className="bold-text">Good Day, {userData.data.profile.firstName}</h2>
                                </div>
                                <div className="col-md-6" style={{ textAlign: 'right' }}>
                                    <TimeDate />
                                </div>
                            </div>
                            <div>
                                <h3>Payroll Settings</h3>

                                <div className="w-100 pt-4">

                                <Tabs defaultActiveKey="tab1" id="my-tabs">
                                    <Tab eventKey="tab1" title="Mandatories">
                                        <p>Content for Tab 1</p>
                                    </Tab>
                                    <Tab eventKey="tab2" title="Adjustments">
                                        <p>Content for Tab 2</p>
                                    </Tab>
                                    <Tab eventKey="tab3" title="Recurring">
                                        <Recurring/>
                                    </Tab>
                                    <Tab eventKey="tab4" title="New Record">
                                        <p>Content for Tab 3</p>
                                    </Tab>
                                </Tabs>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
