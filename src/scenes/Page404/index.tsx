
import { Container } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
    actimai_logo
} from "../../assets/images";
const ErrorSwal = withReactContent(Swal);
const CryptoJS = require("crypto-js")


export const Page404 = () => {
    return (
        <>
            <div className="row bg-dark w-100 h-100 p-0 m-0" style={{ minHeight: '100vh', height: '100vh' }}>
                <Container className="d-flex flex-column text-white justify-content-center align-items-center p-0 m-0 loginBackground ">
                    <label className="mb-5 text-white" style={{fontSize: '6em'}}>404</label> <br />
                    <label className="text-white" style={{fontSize: '2em'}}>Page not found</label>
                </Container>
            </div>
        </>
    )
}
