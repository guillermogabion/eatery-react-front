import { useState, useEffect, useCallback } from "react"
import moment from "moment"
import { useDispatch, useSelector } from "react-redux"
import Accordion from 'react-bootstrap/Accordion';
import { NavLink } from "react-router-dom";

const DashboardMenu = (props: any) => {
    const { search = true } = props
    const setCurrentRoutePath = (path: string) => dispatch({ type: "SET_CURENT_ROUTE_PATH", payload: path })
    const currentRoutePath = useSelector((state: any) => state.rootReducer.currentRoutePath)
    const dispatch = useDispatch()
    const [index, setIndex] = useState<any>("")
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
            "name": "Profile",
            "menu": [
                {
                    'name': 'Change Password',
                    'link': '/change/password'
                },
            ]
        },
        {
            "name": "Resolution Center",
            "menu": [
                {
                    'name': 'Menu 1',
                    'link': '/attendance5'
                },
            ]
        },
        {
            "name": "Announcements",
            "menu": [
                {
                    'name': 'Menu 1',
                    'link': '/attendance5'
                },
            ]
        },
        {
            "name": "Actimai Directory",
            "menu": [
                {
                    'name': 'Menu 1',
                    'link': '/attendance5'
                },
            ]
        },
        {
            "name": "Payroll",
            "menu": [
                {
                    'name': 'Menu 1',
                    'link': '/attendance2'
                },
            ]
        },
        {
            "name": "Manage",
            "menu": [
                {
                    'name': 'Employee',
                    'link': '/employee'
                },
                {
                    'name': 'Roles & Access',
                    'link': '/attendance1'
                },
            ]
        },
    ])

    useEffect(() => {
        nav.map((a: any, index: any) => {
            const { name, menu } = a
            menu.map((d: any, i: any) => {
                const { link } = d
                if (currentRoutePath == link) {
                    setIndex(index)
                }
            })
        })

    }, [index])


    const leftMenu = useCallback((menu_index: any) => {
        return (
            <div className="col-md-12 col-lg-2 p-0 pt-4" style={{ backgroundColor: "#604195", borderRadius: 0, border: 0 }}>
                    <Accordion defaultActiveKey={menu_index} style={{ borderRadius: 0, border: 0 }} >
                        {
                            nav.length > 0 && nav.map((d: any, i: any) => {
                                const { name, menu } = d

                                return (
                                    <Accordion.Item eventKey={i} key={i} style={{ borderRadius: 0, border: 0, backgroundColor: "#604195" }} >
                                        <Accordion.Header >{name}</Accordion.Header>
                                        <Accordion.Body className="p-0 cursor-pointer " style={{ backgroundColor: '#604195' }}>
                                            {
                                                menu.length > 0 && menu.map((menu_data: any, index: any) => {
                                                    const { name, link } = menu_data
                                                    return (
                                                        <NavLink
                                                            key={index}
                                                            activeClassName="activeMenu"
                                                            className="text-center text-white d-flex align-items-center justify-content-center cursor-pointer accordionMenu"
                                                            style={{ minHeight: 60, textDecoration: 'none' }}
                                                            to={link}
                                                            onClick={() => {
                                                                setCurrentRoutePath(link)
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
                </div>
        )
    }, [])


    return <>
        {
            index ?
                leftMenu(index)
                :
                <>
                    {
                        !index ?
                            leftMenu(0)
                            :
                            null
                    }
                </>
        }
    </>
}

export default DashboardMenu
