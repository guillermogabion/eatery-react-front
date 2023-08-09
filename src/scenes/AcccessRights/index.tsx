import React, { useEffect, useState } from "react";
import { Button, Modal, Table, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Api, RequestAPI } from "../../api";
import { Formik } from "formik";
import ContainerWrapper from "../../components/ContainerWrapper";
import ReactPaginate from "react-paginate";
import { async } from "validate.js";
import { tr } from "date-fns/locale";


const ErrorSwal = withReactContent(Swal);

export const Access = (props: any) => {
    const [roleList, setRoleList] = useState<any>([]);
    const [roleAuthList, setRoleAuthList] = useState<any>([]);
    const [availableAuthList, setAvailableAuthList] = useState<any>([]);
    const [manageModalShow, setManageModalShow] = useState(false);
    const [addAccessModalShow, setAddAccessModalShow] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
    const tableHeaders = [
      "ID", 
      "Role Name", 
      "Manage"
    ];
    const tableRoleAuth = [
      "ID", 
      "Auth Name", 
      "Action"
    ];
    const tableAddAccess = [
      " ",
      "ID",
      "Auth Name"
    ]
  
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
    const addAccess = (roleId : any = 0) => {
       RequestAPI.getRequest(
        `${Api.getAvailableAuth}?id=${roleId}`,
        "",
        {},
        {},
        async (res : any) => {
          const { status , body = { data: {}, error: {}}}: any = res;
          if (status === 200 && body && body.data) {
            if (body.error && body.error.message) {

            }else{
              setAvailableAuthList(body.data)
              setAddAccessModalShow(true)
              setSelectedRoleId(roleId);

            }
          }
        }
       )
    }



  useEffect(() => {
    getAllRoles();
  }, []);
    const deleteAccess = ( id : any = 0, roleId: any = 0,  currentPage: any = 0) => {
        console.log(selectedRoleId)

        ErrorSwal.fire({
            title: 'Are you sure?',
            text: "You want to remove the user's Access?",
            didOpen: () => {
              const confirmButton = Swal.getConfirmButton();
              const cancelButton = Swal.getCancelButton();
    
              if(confirmButton)
                confirmButton.id = "accessrights_deleteconfirm_alertbtn"
    
              if(cancelButton)
                cancelButton.id = "accessrights_deletecancel_alertbtn"
            },
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

    const onChangeCheckbox = (index: any, boolCheck: any) => {
      const valuesObj: any = [...availableAuthList]
      valuesObj[index].isCheck = boolCheck
      setAvailableAuthList([...valuesObj])
    };

    // const addCheckedAccess = async () => {
    //   const checkedItems = availableAuthList.filter((item) => item.isCheck);
    //   const toAccess = checkedItems.map((item) => {
    //     return {
    //       roleId: selectedRoleId, 
    //       authorityId: item.authorityId,
    //     };
    //   });

    //   try {
    //     const response = await RequestAPI.postRequest(Api.addRoleAuth, "", toAccess, {}, async (res: any) => {
    //       const { status, body = { data: {}, error: {} } }: any = res;
    //       if (status === 200 || status === 201) {
    //         if (body.error && body.error.message) {
    //           ErrorSwal.fire('Error!', body.error.message, 'error');
    //         } else {
          
    //           ErrorSwal.fire('Success!', 'Data saved successfully', 'success');
    //           setAddAccessModalShow(false); 
    //         }
    //       } else {
    //         ErrorSwal.fire('Error!', 'Something went wrong.', 'error');
    //       }
    //     });
    
     
    //   } catch (error) {
    //     console.error("Error saving data:", error);
    //     ErrorSwal.fire('Error!', 'An error occurred while saving data.', 'error');
    //   }
    // }

    // const addCheckedAccess = async () => {
    //   const checkedItems = availableAuthList.filter((item) => item.isCheck);
    //   const toAccess = checkedItems.map((item) => {
    //     return {
    //       roleId: selectedRoleId,
    //       authorityId: item.authorityId,
    //     };
    //   });
    
    //   try {
    //     // Replace 'Api.addRoleAuth' with the actual API endpoint for saving the checked items
    //     const response = await RequestAPI.postRequest(Api.addRoleAuth, "", toAccess, {}, async (res: any) => {
    //       const { status, body = { data: {}, error: {} } }: any = res;
    //       if (status === 200 || status === 201) {
    //         if (body.error && body.error.message) {
    //           ErrorSwal.fire('Error!', body.error.message, 'error');
    //         } else {
    //           ErrorSwal.fire('Success!', 'Data saved successfully', 'success');
    //           setAddAccessModalShow(false);
    //         }
    //       } else {
    //         ErrorSwal.fire('Error!', 'Something went wrong.', 'error');
    //       }
    //     });
    
    //     // Handle any additional logic based on the response if needed
    //     // For example, if the response contains an ID or any other data you need to update your state or perform further actions.
    //     // const { id } = response.data; // Replace 'id' with the actual key in the response data.
    
    //   } catch (error) {
    //     console.error("Error saving data:", error);
    //     ErrorSwal.fire('Error!', 'An error occurred while saving data.', 'error');
    //   }
    // };


    const addCheckedAccess = async () => {
      const checkedItems = availableAuthList.filter((item) => item.isCheck);
      const toAccess = checkedItems.map((item) => {
        return {
          roleId: selectedRoleId,
          authorityId: item.authorityId,
        };
      });
    
      const requestData = {
        data: toAccess,
      };
    
      try {
        const response = await RequestAPI.postRequest(
          Api.addRoleAuth,
          "",
          requestData,
          {},
          async (res: any) => {
            const { status, body = { data: {}, error: {} } }: any = res;
            if (status === 200 || status === 201) {
              if (body.error && body.error.message) {
                ErrorSwal.fire('Error!', body.error.message, 'error');
              } else {
                ErrorSwal.fire('Success!', 'Data saved successfully', 'success');
                setAddAccessModalShow(false);
              }
            } else {
              ErrorSwal.fire('Error!', 'Something went wrong.', 'error');
            }
          }
        );
      } catch (error) {
        console.error("Error saving data:", error);
        ErrorSwal.fire('Error!', 'An error occurred while saving data.', 'error');
      }
    };
    
    

    
    

  return (
    <ContainerWrapper
      contents={
        <>
          <div className="w-100 px-5 py-5">
            <div>
              <div className="w-100 pt-2">
              
                <Table responsive>
                  <thead>
                    <tr>
                      {tableHeaders &&
                        tableHeaders.length &&
                        tableHeaders.map((item: any, index: any) => {
                          return <th id={"accessrights_"+item+"_header"} style={{ width: "auto" }}>{item}</th>;
                        })}
                    </tr>
                  </thead>
                  <tbody>
                    {roleList &&
                      roleList.length > 0 &&
                      roleList.map((item: any, index: any) => {
                        return (
                          <tr>
                            <td id="accessrights_roleid_data"> {item.roleId}</td>
                            <td id="accessrights_name_data"> {item.name}</td>
                            <td id="accessrights_labels_data">
                              <label id="accessrights_roleid_label"
                                onClick={() => {
                                  getRoleInfo(item.roleId, 0);
                                }}
                              >
                                Manage
                              </label>
                              <br />
                              <label id="accessrights_roleid_label"
                                onClick={() => {
                                  addAccess(item.roleId);
                                }}
                              >
                                Add Access
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
                id="accessrights_authlist_modal"
              >
                <Modal.Header closeButton>
                  <Modal.Title id="contained-modal-title-vcenter">
                    User Auth List 
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="row w-100 px-5">
                  <div>
                    <Table responsive>
                      <thead>
                        <tr>
                          {tableRoleAuth &&
                            tableRoleAuth.length &&
                            tableRoleAuth.map((item: any, index: any) => {
                              return <th id={"accessrights_"+item+"_mheader"} style={{ width: "auto" }}>{item}</th>;
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
                                <td id={"accessrights_authorityid_data_" + item.authorityId}> {item.authorityId}</td>
                                <td id={"accessrights_authname_data_" + item.authorityId}> {item.name}</td>
                                <td id={"accessrights_labels_mdata_" + item.authorityId}>
                                  <label id={"accessrights_delete_label_" + item.authorityId}
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
               
              </Modal>
              <Modal
                 show={addAccessModalShow}
                 size={"lg"}
                 aria-labelledby="contained-modal-title-vcenter"
                 centered
                 backdrop="static"
                 keyboard={false}
                 onHide={() => setAddAccessModalShow(false)}
                 dialogClassName="modal-90w access-dialog"
              >
                <Modal.Header closeButton>
                  <Modal.Title id="contained-modal-title-vcenter">
                    Add User Access 
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="row w-100 px-5">
                  <div>
                  <div className="table-body-container" style={{ maxHeight: "500px", overflowY: "auto" }}>
                  <Table responsive>
                      <thead>
                        <tr>
                          { tableAddAccess &&
                            tableAddAccess.length &&
                            tableAddAccess.map((item: any, index: any) => {
                              return <th style={{ width: "auto" }}>{item}</th>;
                            })
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {availableAuthList &&
                          availableAuthList.length > 0 &&
                          availableAuthList.map((item: any, index: any) => {
                            return (
                              <tr>  
                                 <td>
                                    <Form.Check
                                        type="checkbox"
                                        label=""
                                        checked={item.isCheck}
                                        onChange={(e) => {
                                            onChangeCheckbox(index, e.target.checked)
                                        }}
                                    />
                                    </td>
                                <td> {item.authorityId}</td>
                                <td> {item.name}</td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </Table>
                  </div>
                    
                   
                  </div>

                </Modal.Body>
                <Modal.Footer>
                  <div className="d-flex justify-content-end px-5">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={addCheckedAccess}
                    >
                  {/* {selectedRoleId} */}
                      Save 
                    </button>
                  </div>
                </Modal.Footer>

              </Modal>
            </div>
          </div>
        </>
      }
    />
  );
};
