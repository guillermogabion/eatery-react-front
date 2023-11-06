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
    // const [nav, setNav] = useState(userData.data.profile.menus)

    useEffect(() => {
        // nav.map((a: any, index: any) => {
        //     const { name, menu } = a
        //     menu.map((d: any, i: any) => {
        //         const { route } = d
        //         if (currentRoutePath == route) {
        //             setIndex(index)
        //         }
        //     })
        // })
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
                    <FaRegWindowClose size={25} color={"#ffffff"} />
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


                {
                   
                }

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
