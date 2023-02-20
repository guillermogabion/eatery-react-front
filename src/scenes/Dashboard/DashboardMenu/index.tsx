import { useCallback, useState } from "react"
import moment from "moment"
import { useSelector, useDispatch } from "react-redux"
import Accordion from 'react-bootstrap/Accordion';
import { NavLink } from "react-router-dom";

const DashboardMenu = (props: any) => {
    const { search = true } = props
    const dispatch = useDispatch()
    const [nav, setNav] = useState([
        {
            "name": "Attendance",
            "menu": [
                {
                    'name': 'Time In & Time Out',
                    'link': '/attendance'
                },
                {
                    'name': 'Leaves & Time off',
                    'link': '/leaves/timeoff'

                },
                {
                    'name': 'Overtime & Undertime',
                    'link': '/overtime/undertime'

                },
                {
                    'name': 'Attendance Correction',
                    'link': '/attendance/correction'

                },
                {
                    'name': 'Schedule Adjustment',
                    'link': '/schedule/adjustment'

                },
                {
                    'name': 'Summary',
                    'link': '/summary'

                },
            ]
        },
        {
            "name": "Resolution Center",
            "menu": [
                {
                    'name': 'Time In & Time Out',
                    'link': '/attendance'
                },
                {
                    'name': 'Leaves & Time off',
                    'link': '/leaves/timeoff'

                },
                {
                    'name': 'Overtime & Undertime',
                    'link': '/overtime/undertime'

                },
                {
                    'name': 'Attendance Correction',
                    'link': '/attendance/correction'

                },
                {
                    'name': 'Schedule Adjustment',
                    'link': '/schedule/adjustment'

                },
                {
                    'name': 'Summary',
                    'link': '/summary'

                },
            ]
        },
        {
            "name": "Resolution Center",
            "menu": [
                {
                    'name': 'Time In & Time Out',
                    'link': '/attendance'
                },
                {
                    'name': 'Leaves & Time off',
                    'link': '/leaves/timeoff'

                },
                {
                    'name': 'Overtime & Undertime',
                    'link': '/overtime/undertime'

                },
                {
                    'name': 'Attendance Correction',
                    'link': '/attendance/correction'

                },
                {
                    'name': 'Schedule Adjustment',
                    'link': '/schedule/adjustment'

                },
                {
                    'name': 'Summary',
                    'link': '/summary'

                },
                {
                    'name': 'Summary1',
                    'link': '/summary1'

                },
            ]
        },
        {
            "name": "Resolution Center",
            "menu": [
                {
                    'name': 'Time In & Time Out',
                    'link': '/attendance'
                },
                {
                    'name': 'Leaves & Time off',
                    'link': '/leaves/timeoff'

                },
                {
                    'name': 'Overtime & Undertime',
                    'link': '/overtime/undertime'

                },
                {
                    'name': 'Attendance Correction',
                    'link': '/attendance/correction'

                },
                {
                    'name': 'Schedule Adjustment',
                    'link': '/schedule/adjustment'

                },
                {
                    'name': 'Summary',
                    'link': '/summary'
                },
            ]
        },
    ])

    return (
        <Accordion defaultActiveKey="0" alwaysOpen>
            {
                nav.length > 0 && nav.map((d: any, index: any) => {
                    const { name , menu} = d

                    return (
                        <Accordion.Item eventKey={index} key={index} style={{ borderRadius: 0 }}>
                            <Accordion.Header >{name}</Accordion.Header>
                            <Accordion.Body className="p-0 cursor-pointer">
                                {
                                    menu.length > 0 && menu.map((menu_data: any, menu_index: any) => {
                                        const { name, link} = menu_data
                                        return (
                                            <NavLink
                                                key = {menu_index}
                                                activeClassName="active"
                                                className="text-center d-flex align-items-center justify-content-center cursor-pointer bg-danger"
                                                style={{ minHeight: 60, color: 'white', textDecoration: 'none' }}
                                                to={link}
                                                onClick={() => {
                                                    alert('Go to ' + name)
                                                }}>
                                                <span>
                                                <span>{name}</span>
                                                </span>
                                            </NavLink>
                                        )
                                    })
                                }
                            </Accordion.Body>
                        </Accordion.Item>
                    )
                })
            }
        </Accordion>
    )
}

export default DashboardMenu
