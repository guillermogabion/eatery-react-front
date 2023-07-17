import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Api, RequestAPI } from "../../api";
import { Formik } from "formik";
import ContainerWrapper from "../../components/ContainerWrapper";
import ReactPaginate from "react-paginate";

const ErrorSwal = withReactContent(Swal);

export const Access = (props: any) => {
    const [roleList, setRoleList] = useState<any>([]);
    const [roleAuthList, setRoleAuthList] = useState<any>([]);
    const [manageModalShow, setManageModalShow] = useState(false);
    const [addAccessModalShow, setAddAccessModalShow] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
    const tableHeaders = ["ID", "Role Name", "Manage"];
    const tableRoleAuth = ["ID", "Auth Name", "Action"];
  
    const getAllRoles = () => {
        RequestAPI.getRequest(`${Api.getRoles}`, "", {}, {}, async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res;
        if (status === 200 && body && body.data) {
            if (body.data) {
            setRoleList(body.data);
            }
        }
        });
    };

    const getRoleInfo = (roleId: any = 0, pageNo: any) => {
        RequestAPI.getRequest(
        `${Api.getRolesAuth}?id=${roleId}&page=${pageNo}`,
        "",
        {},
        {},
        async (res: any) => {
            console.log("Response:", res);
            const { status, body = { data: {}, error: {} } }: any = res;
            if (status === 200 && body && body.data.content) {
            if (body.error && body.error.message) {
            } else {
                setRoleAuthList(body.data);
                setSelectedRoleId(roleId);
                if (status === 200 && body && (!body.data.content || body.data.content.length === 0) && pageNo > 0) {
                    // getRoleInfo(roleId, pageNo - 1);
                    RequestAPI.getRequest(
                        `${Api.getRolesAuth}?id=${roleId}&page=${pageNo - 1 }`,
                        "",
                        {},
                        {},
                        async (res: any) => {
                            console.log("Response:", res);
                            const { status, body = { data: {}, error: {} } }: any = res;
                            if (status === 200 && body && body.data.content) {
                            if (body.error && body.error.message) {
                            } else {
                                setRoleAuthList(body.data);
                                setSelectedRoleId(roleId);
                
                
                                if (!manageModalShow) {
                                setManageModalShow(true);
                                }
                            }
                            }
                            // else if (status === 200 && body && (!body.data.content || body.data.content.length === 0) && pageNo > 0) {
                            //     // getRoleInfo(roleId, pageNo - 1);
                                
                            //   }
                        }
                        );
                  }


                if (!manageModalShow) {
                setManageModalShow(true);
                }
            }
            }
        }
        );
    };



  useEffect(() => {
    getAllRoles();
  }, []);
    const deleteAccess = ( id : any = 0, roleId: any = 0,  currentPage: any = 0) => {
        console.log(selectedRoleId)

        ErrorSwal.fire({
            title: 'Are you sure?',
            text: "You want to remove the user's Access?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, proceed!'
        }).then((result) => {
            if (result.isConfirmed) {
            const loadingSwal = Swal.fire({
                title: '',
                allowOutsideClick: false,
                didOpen: () => {
                Swal.showLoading();
                }
            });
            
            RequestAPI.postRequest(Api.deleteRoleAuth, "", { "id": id }, {}, async (res : any) => {
                
                console.log(roleId)
                const { status, body = { data: {}, error: {} } }: any = res;
                if (status === 200 || status === 201) {
                if (body.error && body.error.message) {
                    Swal.close();
                    ErrorSwal.fire(
                    'Error!',
                    body.error.message,
                    'error'
                    );
                } else {
                    Swal.close();
                 
                    getRoleInfo(roleId, currentPage);
                    ErrorSwal.fire(
                    'Success!',
                    body.data || "",
                    'success'
                    );
                }
                } else {
                Swal.close();
                ErrorSwal.fire(
                    'Error!',
                    'Something went wrong.',
                    'error'
                );
                }
            })
            }
        })

    }
    const handlePageClick = (selectedRoleId: number, { selected }: { selected: number }) => {
    getRoleInfo(selectedRoleId, selected);
    };

    // const addAccess = (id : any) => {
    //     RequestAPI.postRequest(Api.addRoleAuth, "")
    // }
    

  return (
    <ContainerWrapper
      contents={
        <>
          <div className="w-100 px-5 py-5">
            <div>
              <div className="w-100 pt-2">
              
                <Table responsive="lg">
                  <thead>
                    <tr>
                      {tableHeaders &&
                        tableHeaders.length &&
                        tableHeaders.map((item: any, index: any) => {
                          return <th style={{ width: "auto" }}>{item}</th>;
                        })}
                    </tr>
                  </thead>
                  <tbody>
                    {roleList &&
                      roleList.length > 0 &&
                      roleList.map((item: any, index: any) => {
                        return (
                          <tr>
                            <td> {item.roleId}</td>
                            <td> {item.name}</td>
                            <td>
                              <label
                                onClick={() => {
                                  getRoleInfo(item.roleId, 0);
                                }}
                              >
                                Manage
                              </label>
                              <label
                                onClick={() => {
                                  addAccess(item.roleId);
                                }}
                              >
                                Manage
                              </label>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </div>
              <Modal
                show={manageModalShow}
                size={"lg"}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                keyboard={false}
                onHide={() => setManageModalShow(false)}
                dialogClassName="modal-90w"
              >
                <Modal.Header closeButton>
                  <Modal.Title id="contained-modal-title-vcenter">
                    User Auth List 
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="row w-100 px-5">
                  <div>
                    <Table responsive="lg">
                      <thead>
                        <tr>
                          {tableRoleAuth &&
                            tableRoleAuth.length &&
                            tableRoleAuth.map((item: any, index: any) => {
                              return <th style={{ width: "auto" }}>{item}</th>;
                            })}
                        </tr>
                      </thead>
                      <tbody>
                        {roleAuthList &&
                        roleAuthList.content &&
                          roleAuthList.content.length > 0 &&
                          roleAuthList.content.map((item: any, index: any, roleId: any) => {
                            return (
                              <tr>  
                                <td> {item.authorityId}</td>
                                <td> {item.name}</td>
                                <td>
                                  <label
                                    onClick={() => {
                                      deleteAccess(item.id,selectedRoleId, roleAuthList.pageable.pageNumber);
                                    }}
                                  >
                                    delete
                                  </label>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </Table>
                  </div>
                  <div className="d-flex justify-content-end">
                    <div className="">
                      <ReactPaginate
                        className="d-flex justify-content-center align-items-center"
                        breakLabel="..."
                        nextLabel=">"
                        onPageChange={( event) => handlePageClick( selectedRoleId, event)}
                        pageRangeDisplayed={5}
                        pageCount={
                          (roleAuthList && roleAuthList.totalPages) || 0
                        }
                        previousLabel="<"
                        previousLinkClassName="prev-next-pagination"
                        nextLinkClassName="prev-next-pagination"
                        activeLinkClassName="active-page-link"
                        disabledLinkClassName="prev-next-disabled"
                        pageLinkClassName="page-link"
                        renderOnZeroPageCount={null}
                      />
                    </div>
                  </div>
                 
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                  {/* <Button
                    onClick={() => downloadExcel(fromDate, toDate)}
                    disabled={isSubmit}>
                    {isSubmit ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : ""} Proceed
                  </Button> */}
                </Modal.Footer>
              </Modal>
              <Modal
                 show={addAccessModalShow}
                 size={"lg"}
                 aria-labelledby="contained-modal-title-vcenter"
                 centered
                 backdrop="static"
                 keyboard={false}
                 onHide={() => setAddAccessModalShow(false)}
                 dialogClassName="modal-90w"
              >

              </Modal>
            </div>
          </div>
        </>
      }
    />
  );
};
