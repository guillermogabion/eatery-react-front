import React , { useCallback, useEffect, useRef, useState } from "react"
import { Button, Modal, Form} from "react-bootstrap"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Api, RequestAPI } from "../../api"
import Table from "react-bootstrap/Table"
import { Formik } from "formik"
import ContainerWrapper from "../../components/ContainerWrapper"
import { tr } from "date-fns/locale"
import { async } from "validate.js"

const ErrorSwal = withReactContent(Swal)



export const Access = ( props: any ) => {
    const [ roleList, setRoleList ] = useState<any>([]);

    const tableHeaders = [
        'ID',
        'Role Name',
        'Manage',
    ];


    const getAllRoles = () => {
        RequestAPI.getRequest (
            `${Api.getRoles}`,
            "",
            {},
            {},
            async ( res: any) => {
                const { status, body = { data : {}, error: {}}} : any = res
                if ( status === 200 && body && body.data) {
                    if (body.data ) {
                        setRoleList(body.data)
                    }
                } 
            }
        )
    }

    const getRoleInfo = (roleId : any = 0 ) => {
        RequestAPI.getRequest (
            `${Api.getRolesAuth}?id=${roleId}`,
            "",
            {},
            {},
            async(res: any) => { 
                console.log("Response:", res);
                const { status, body = { data: {}, error: {}}} : any= res;
                if ( status === 200 && body && body.data) {
                    if (body.error && body.error.message) {

                    }
                }
            }
        )
    }


    useEffect(() => {
        getAllRoles()
    }, [])

    return (
        <ContainerWrapper contents={<>
            <div className="w-100 px-5 py-5">
                <div>
                    <div className="w-100 pt-2">
                        <Table responsive="lg">
                            <thead>
                                <tr>
                                    {
                                    tableHeaders &&
                                    tableHeaders.length &&
                                    tableHeaders.map((item: any, index: any) => {
                                        return (
                                        <th style={{ width: 'auto' }}>{item}</th>
                                        )
                                    })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    roleList &&
                                    roleList.length > 0 &&
                                    roleList.map((item: any, index: any) => {
                                        return (
                                            <tr>
                                                <td> { item.roleId }</td>
                                                <td> { item.name }</td>
                                                <td>
                                                    <label
                                                     onClick={() => {
                                                        getRoleInfo(item.roleId)
                                                    }}
                                                    >
                                                        Manage
                                                    </label>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>

                    </div>
                </div>
            </div>
        </>}

        />
    )
}