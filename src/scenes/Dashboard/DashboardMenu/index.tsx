import { useCallback, useState } from "react"
import moment from "moment"
import { useSelector, useDispatch } from "react-redux"
import Accordion from 'react-bootstrap/Accordion';
const DashboardMenu = (props: any) => {
    const { search = true } = props
    const dispatch = useDispatch()
    const [menu, setMenu] = useState([
        {
            "name": "Attendance",
            "menu": [
                "Overview",
                "Leaves & Absences",
                "Official Business",
                "Summary"
            ]
        },
        {
            "name": "Resolution Center",
            "menu": [
                "Attendance Logs",
                "HR Memo",
                "Overtime & Undertime",
                "Employee Requirements"
            ]
        },
        {
            "name": "Resolution Center",
            "menu": [
                "Attendance Logs",
                "HR Memo",
                "Overtime & Undertime",
                "Employee Requirements"
            ]
        },
    ])

    return (
        <Accordion defaultActiveKey="0" alwaysOpen>
            <Accordion.Item eventKey="0" style={{ borderRadius: 0 }}>
                <Accordion.Header >Accordion Item #1</Accordion.Header>
                <Accordion.Body className="p-0 cursor-pointer">
                    <div className="text-center d-flex align-items-center justify-content-center cursor-pointer bg-danger" style={{ minHeight: 60 }}>Time in & Time out</div>
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1" style={{ borderRadius: 0 }}>
                <Accordion.Header >Accordion Item #1</Accordion.Header>
                <Accordion.Body className="p-0 cursor-pointer">
                    <div className="text-center d-flex align-items-center justify-content-center cursor-pointer bg-danger" style={{ minHeight: 60 }}>Time in & Time out</div>
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2" style={{ borderRadius: 0 }}>
                <Accordion.Header >Accordion Item #1</Accordion.Header>
                <Accordion.Body className="p-0 cursor-pointer">
                    <div className="text-center d-flex align-items-center justify-content-center cursor-pointer bg-danger" style={{ minHeight: 60 }}>Time in & Time out</div>
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3" style={{ borderRadius: 0 }}>
                <Accordion.Header >Accordion Item #1</Accordion.Header>
                <Accordion.Body className="p-0 cursor-pointer">
                    <div className="text-center d-flex align-items-center justify-content-center cursor-pointer bg-danger" style={{ minHeight: 60 }}>Time in & Time out</div>
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4" style={{ borderRadius: 0 }}>
                <Accordion.Header>Accordion Item #2</Accordion.Header>
                <Accordion.Body>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}
export default DashboardMenu
