import { useState, useEffect, useCallback } from "react"
import moment from "moment"
import { useDispatch, useSelector } from "react-redux"
import Accordion from 'react-bootstrap/Accordion';
import { NavLink } from "react-router-dom";
import Announcements from "../../assets/images/dist/menu/Announcements.png"
import Directory from "../../assets/images/dist/menu/Directory.png"
import Payroll from "../../assets/images/dist/menu/Payroll.png"
import Profile from "../../assets/images/dist/menu/Profile.png"
import ResolutionCenter from "../../assets/images/dist/menu/ResolutionCenter.png"
import Attendance from "../../assets/images/dist/menu/Attendance.png"
import Manage from "../../assets/images/dist/menu/Manage.png"
import { actimai_logo_white1 } from "../../assets/images";
import { FaRegWindowClose } from "react-icons/fa";

const DashboardMenu = (props: any) => {
    const { search = true, onToggle } = props
    const userData = useSelector((state: any) => state.rootReducer.userData)
    const setCurrentRoutePath = (path: string) => dispatch({ type: "SET_CURENT_ROUTE_PATH", payload: path })
    const currentRoutePath = useSelector((state: any) => state.rootReducer.currentRoutePath)
    const [isRoleCheck, setIsRoleCheck] = useState(false);
    const dispatch = useDispatch()
    const [index, setIndex] = useState<any>("")
    const [nav, setNav] = useState(userData.data.profile.menus)

    useEffect(() => {
        nav.map((a: any, index: any) => {
            const { name, menu } = a
            menu.map((d: any, i: any) => {
                const { route } = d
                if (currentRoutePath == route) {
                    setIndex(index)
                }
            })
        })
    }, [index])

    const getMenuIcon = (iconName: any) => {
        let icon = null
        let iconNameLower = iconName.toLowerCase()
        switch (iconNameLower) {
            case "announcements":
                icon = Announcements
                break;
            case "actimai_directory":
                icon = Directory
                break;
            case "payroll":
                icon = Payroll
                break;
            case "profile":
                icon = Profile
                break;
            case "resolution_center":
                icon = ResolutionCenter
                break;
            case "attendance":
                icon = Attendance
                break;
            case "manage":
                icon = Manage
                break;
            default:
                icon = Profile
                break;
        }
        return icon
    }

    const leftMenu = useCallback((menu_index: any) => {
        return (
            <div>
                <div className="w-full flex justify-end p-3 dashboardMenuClose pointer" onClick={onToggle}>
                    <FaRegWindowClose size={25} color={"#ffffff"}/>
                </div>
                <div className="p-3 px-5 mb-3 d-flex justify-content-center align-items-center">
                    <NavLink to={"/timekeeping"}
                        className="logo"
                        onClick={() => {
                            // setCurrentRoutePath("/timekeeping")
                        }}>
                        <img src={actimai_logo_white1} alt="Actimai logo" />
                    </NavLink>
                </div>

                <Accordion defaultActiveKey={menu_index} style={{ borderRadius: 0, border: 0 }} >
                    {
                        nav.length > 0 && nav.map((d: any, i: any) => {
                            const { name, menu } = d

                            return (
                                <Accordion.Item eventKey={i} key={i} style={{ borderRadius: 0, border: 0, backgroundColor: "#009FB5" }} >
                                    <Accordion.Header style={{ fontWeight: 'bolder' }}>
                                        <img src={getMenuIcon(name)} width={20} style={{ marginRight: 12 }} alt={name} />
                                        {name}
                                    </Accordion.Header>
                                    <Accordion.Body className="p-0 cursor-pointer " style={{ backgroundColor: '#009FB5' }}>
                                        {
                                            menu.length > 0 && menu.map((menu_data: any, index: any) => {
                                                const { label, route } = menu_data

                                                return (
                                                    <NavLink
                                                        key={index}
                                                        activeClassName={currentRoutePath == route ? "activeMenu" : ""}
                                                        className="text-white d-flex align-items-center cursor-pointer accordionMenu"
                                                        style={{ minHeight: 60, textDecoration: 'none', paddingLeft: 50 }}
                                                        to={route}
                                                        onClick={() => {
                                                            setCurrentRoutePath(route)
                                                        }}>
                                                        <span>
                                                            <span>{label}</span>
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
