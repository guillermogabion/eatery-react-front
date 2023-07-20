
import { Container } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
    actimai_logo
} from "../../assets/images";
import { useDispatch, useSelector } from "react-redux"
import { NavLink } from "react-router-dom";
const ErrorSwal = withReactContent(Swal);
const CryptoJS = require("crypto-js")


export const Page404 = () => {
    const dispatch = useDispatch()
    const setCurrentRoutePath = (path: string) => dispatch({ type: "SET_CURENT_ROUTE_PATH", payload: path })
    return (
        <>
            <div className="w-full bg-light h-[100vh] flex justify-center items-center">
                <div className="">
                    <div id="notfound" className="text-center ">
                        <h1 className="text-[50px]">😮</h1>
                        <h2 className="text-[20px] mt-[20px] font-bold">Oops! Page Not Found</h2>
                        <p>Sorry but the page you are looking for does not exist.</p>
                        <NavLink to={"/timekeeping"}
                            id="page404_backtohomepage_navlink"
                            className="text-[#007BFF]"
                            onClick={() => {
                                setCurrentRoutePath('/timekeeping')
                            }}>
                                Back to homepage
                        </NavLink>
                    </div>
                </div>
            </div>
        </>
    )
}
