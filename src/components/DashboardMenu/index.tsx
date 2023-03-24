import { useState, useEffect, useCallback } from "react"
import moment from "moment"
import { useDispatch, useSelector } from "react-redux"
import Accordion from 'react-bootstrap/Accordion';
import { NavLink } from "react-router-dom";

const DashboardMenu = (props: any) => {
    const { search = true } = props
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const setCurrentRoutePath = (path: string) => dispatch({ type: "SET_CURENT_ROUTE_PATH", payload: path })
    const currentRoutePath = useSelector((state: any) => state.rootReducer.currentRoutePath)
    const [isRoleCheck, setIsRoleCheck] = useState(false);
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
                    'name': 'Overtime',
                    'link': '/overtime'

                },
                {
                    'name': 'Undertime',
                    'link': '/undertime'

                },
                {
                    'name': 'Attendance Reversal',
                    'link': '/attendance/correction'

                },
                {
                    'name': 'Schedule Adjustment',
                    'link': '/schedule/adjustment'

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
            "menu": []
        },
        {
            "name": "Announcements",
            "menu": []
        },
        {
            "name": "Actimai Directory",
            "menu": []
        },
        {
            "name": "Payroll",
            "menu": []
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
                    'link': '/roles/access'
                },
                {
                    'name': 'Report',
                    'link': '/Report'
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
        let userRole = userData.data.profile.role
        
        if(userRole == 'EMPLOYEE'){
            setNav([
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
                            'name': 'Overtime',
                            'link': '/overtime'
                        },
                        {
                            'name': 'Undertime',
                            'link': '/undertime'
                        },
                        {
                            'name': 'Attendance Reversal',
                            'link': '/attendance/correction'
                        },
                        {
                            'name': 'Schedule Adjustment',
                            'link': '/schedule/adjustment'
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
                    "menu": []
                },
                {
                    "name": "Announcements",
                    "menu": []
                },
                {
                    "name": "Actimai Directory",
                    "menu": []
                },
            ])
        }else if (userRole == 'APPROVER'){
            setNav([
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
                            'name': 'Overtime',
                            'link': '/overtime'
        
                        },
                        {
                            'name': 'Undertime',
                            'link': '/undertime'
        
                        },
                        {
                            'name': 'Attendance Reversal',
                            'link': '/attendance/correction'
        
                        },
                        {
                            'name': 'Schedule Adjustment',
                            'link': '/schedule/adjustment'
        
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
                    "menu": []
                },
                {
                    "name": "My Squad",
                    "menu": []
                },
                {
                    "name": "Announcements",
                    "menu": []
                },
                {
                    "name": "Actimai Directory",
                    "menu": []
                },
                {
                    "name": "Payroll",
                    "menu": []
                },
            ])
        }
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
    }, [nav])

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
