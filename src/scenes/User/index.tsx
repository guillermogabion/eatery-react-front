import { RBank_Digital_Logo } from "../../assets/images"

export const User = (props: any) => {
  return (
    <div className="body">
      <div className="wraper">
        <aside className="sidebarMain" id="mobileMenu">
          <div className="sidebar">
            <a className="logo" href="/">
              <img src={RBank_Digital_Logo} alt="RBank" />
            </a>
            <div className="sidebarItems">
              <ul>
                <li>
                  <a href="/">
                    <span>
                      <img src="./assets/images/Icon-feather-user-list2.png" alt="User List" />
                      <span>User List</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href="/">
                    <span>
                      <img src="./assets/images/Icon-feather-user-plus.png" alt="Create User" />
                      <span>Create User</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a className="active" href="/">
                    <span>
                      <img src="./assets/images/Icon feather-user-check2.png" alt="User Roles" />
                      <span>User Roles</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href="/">
                    <span>
                      <img src="./assets/images/menu_logout_dark.png" alt="User Roles" />
                      <span>Logout</span>
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </aside>
        <div className="contentRightSection">
          <div className="contentRightFrame">
            <div className="topHeader">
              <div className="contentRightMain">
                <h1>User Management</h1>
                <div className="TopHeaderRight">
                  <div className="mainSearch">
                    <input name="name" placeholder="Search DPU Client" type="text" className="formControl" required />
                    <button>
                      <img src="./assets/images/icon_search_grey.png" alt="user" />
                    </button>
                  </div>
                  <div className="userNotification">
                    <img src="./assets/images/menu_notifications.png" alt="notifications" />
                    <div className="notificationDropdown">
                      <ul>
                        <li>
                          <a href="#">
                            You have receaved one request for approval{" "}
                            <img src="./assets/images/Icon-close-circle.png" alt="user" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            You have receaved one request for approval{" "}
                            <img src="./assets/images/Icon-close-circle.png" alt="user" />
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            You have receaved one request for approval{" "}
                            <img src="./assets/images/Icon-close-circle.png" alt="user" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="todayDate">
                    Today is <br />
                    July 28, 2021
                  </div>
                  <div className="UserdetailWrap">
                    <div className="UserIcon">
                      <img src="./assets/images/user.png" alt="user" />
                    </div>
                    <div className="Userdetail">
                      <h3>Hello Jonathan</h3>
                      <small>
                        1000
                        <br />
                        Bonificio Global City
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="contentContainer">
              <div className="contentbuttonSet">
                <button type="button" className="addUser">
                  <span>+</span>ADD NEW ROLE
                </button>
              </div>
              <div className="contentDataSet">
                <table id="myTable" className="RoleTable">
                  <tbody>
                    <tr>
                      <th style={{ cursor: "pointer", width: "5%" }}>
                        <label className="main">
                          <input type="checkbox" id="sort" name="sort" defaultValue="sort" />
                          <span className="geenmask" />
                        </label>
                      </th>
                      <th style={{ cursor: "pointer" }}>ROLE NAME</th>
                      <th style={{ cursor: "pointer" }}>FEATURES</th>
                      <th style={{ width: "25%" }}>ACCESS RIGHTS</th>
                      <th style={{ cursor: "pointer", width: "18%" }}>ACTIONS</th>
                    </tr>
                    <tr className="item">
                      <td>
                        <label className="main">
                          <input type="checkbox" id="sort" name="sort" defaultValue="sort" />
                          <span className="geenmask" />
                        </label>
                      </td>
                      <td>
                        <select name="status" id="status" className="formControlSelect">
                          <option value="Status">Select</option>
                          <option value="saab">Saab</option>
                          <option value="mercedes">Mercedes</option>
                          <option value="audi">Audi</option>
                        </select>
                      </td>
                      <td>
                        <select name="status" id="status" className="formControlSelect">
                          <option value="Status">Select</option>
                          <option value="saab">Saab</option>
                          <option value="mercedes">Mercedes</option>
                          <option value="audi">Audi</option>
                        </select>
                      </td>
                      <td>
                        <div id="DropDownSelect" className="MainDropDown">
                          <a href="#" className="ClickList">
                            Print downloaded report
                          </a>
                          <div className="DropDownList">
                            <ul>
                              <li>
                                <label className="main">
                                  <input type="checkbox" id="sort" name="sort" defaultValue="sort" />
                                  <span className="geenmask" /> View
                                </label>
                              </li>
                              <li>
                                <label className="main">
                                  <input type="checkbox" id="sort" name="sort" defaultValue="sort" />
                                  <span className="geenmask" /> Search
                                </label>
                              </li>
                              <li>
                                <label className="main">
                                  <input type="checkbox" id="sort" name="sort" defaultValue="sort" />
                                  <span className="geenmask" /> Download
                                </label>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="action">
                          <a href="#" className="update">
                            UPDATE
                          </a>{" "}
                          <a href="#">
                            <img src="./assets/images/dlt.png" alt="Remove" />
                          </a>
                        </span>
                      </td>
                    </tr>
                    <tr className="item">
                      <td>
                        <label className="main">
                          <input type="checkbox" id="sort" name="sort" defaultValue="sort" />
                          <span className="geenmask" />
                        </label>
                      </td>
                      <td>
                        <select name="status" id="status" className="formControlSelect">
                          <option value="Status">Select</option>
                          <option value="saab">Saab</option>
                          <option value="mercedes">Mercedes</option>
                          <option value="audi">Audi</option>
                        </select>
                      </td>
                      <td>
                        <select name="status" id="status" className="formControlSelect">
                          <option value="Status">Select</option>
                          <option value="saab">Saab</option>
                          <option value="mercedes">Mercedes</option>
                          <option value="audi">Audi</option>
                        </select>
                      </td>
                      <td>
                        <select name="status" id="status" className="formControlSelect">
                          <option value="Status">Select</option>
                          <option value="saab">Saab</option>
                          <option value="mercedes">Mercedes</option>
                          <option value="audi">Audi</option>
                        </select>
                      </td>
                      <td>
                        <span className="action">
                          <a href="#" className="update disabled">
                            UPDATE
                          </a>{" "}
                          <a href="#">
                            <img src="./assets/images/dlt.png" alt="Remove" />
                          </a>
                        </span>
                      </td>
                    </tr>
                    <tr className="item">
                      <td>
                        <label className="main">
                          <input type="checkbox" id="sort" name="sort" defaultValue="sort" />
                          <span className="geenmask" />
                        </label>
                      </td>
                      <td>
                        <select name="status" id="status" className="formControlSelect">
                          <option value="Status">Select</option>
                          <option value="saab">Saab</option>
                          <option value="mercedes">Mercedes</option>
                          <option value="audi">Audi</option>
                        </select>
                      </td>
                      <td>
                        <select name="status" id="status" className="formControlSelect">
                          <option value="Status">Select</option>
                          <option value="saab">Saab</option>
                          <option value="mercedes">Mercedes</option>
                          <option value="audi">Audi</option>
                        </select>
                      </td>
                      <td>
                        <select name="status" id="status" className="formControlSelect">
                          <option value="Status">Select</option>
                          <option value="saab">Saab</option>
                          <option value="mercedes">Mercedes</option>
                          <option value="audi">Audi</option>
                        </select>
                      </td>
                      <td>
                        <span className="action">
                          <a href="#" className="update disabled">
                            UPDATE
                          </a>{" "}
                          <a href="#">
                            <img src="./assets/images/dlt.png" alt="Remove" />
                          </a>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
