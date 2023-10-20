import React, { useEffect, useState } from "react";
import { RequestAPI, Api } from "../api";
import { Table, Button, Carousel } from "react-bootstrap";
import { user, evaluate, evaluate_disabled } from "../assets/images";
import icon_search_white from "../assets/images/icon_search_white.png";

const NewHire = () => {
  const [clickedItem, setClickedItem] = useState(null);
  const [defaultSelectedItem, setDefaultSelectedItem] = useState(null);
  const [newHire, setNewHire] = useState<any>([]);
  const [filterData, setFilterData] = React.useState({ month: '', name: '' });

  const numberMonth = [
    { id: 1, label: "All", value: '' },
    { id: 2, label: "3rd Month", value: 3 },
    { id: 3, label: "5th Month", value: 5 },
    { id: 4, label: "6th Month", value: 6 },
  ];

  const newHireList = (month: any, name: string) => {
    let queryString = `?month=${month}`;
    if (name) {
      queryString += `&name=${name}`;
    }

    RequestAPI.getRequest(
      `${Api.getNewHire}${queryString}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res;
        console.log(month);
        if (status === 200 && body) {
          if (body.error && body.error.message) {
            // Handle errors
          } else {
            console.log(body.data);
            setNewHire(body.data);
          }
        }
      }
    );
  };

  const makeFilterData = (event: any) => {
    const { name, value } = event.target;
    setFilterData({ ...filterData, [name]: value });
  };

  const handleItemClick = (index: any, itemValue: any) => {
    setClickedItem(index);
    newHireList(itemValue, filterData.name);
  };

  useEffect(() => {
    setClickedItem(0);
    newHireList(numberMonth[0].value, filterData.name);
  }, []);

  useEffect(() => {
    if (defaultSelectedItem !== null) {
      handleItemClick(defaultSelectedItem.index, defaultSelectedItem.itemValue);
    }
  }, [defaultSelectedItem]);

  return (
    <div className="time-card-width">
      <div className="card-header">
        <span className="">New Hire Tracker</span>
      </div>
      <div className="time-card-body row">
        <div className="d-flex pt-2 justify-content-center text-center" style={{ height: '20px', alignContent: 'center', textAlign: 'center' }}>
          {numberMonth &&
            numberMonth.map((item, index) => (
              <div
                id={"newhire_month_button_" + item.id}
                key={item.id}
                className={`new-hire-tab pa-1 custom-slider-item ${clickedItem === index ? "text-primary text-bold" : ""}`}
                style={{
                  cursor: "pointer",
                  fontWeight: clickedItem === index ? "bold" : "",
                  borderBottom: clickedItem === index ? "2px solid #189FB5" : "none",
                  paddingBottom: clickedItem === index ? "40px" : "",
                  display: "inline-block",
                  position: "relative",
                }}
                onClick={() => handleItemClick(index, item.value)}
              >
                {item.label}
              </div>
            ))}
        </div>
        <div className="d-flex justify-content-center align-items-center pt-8">
          <div className="col-10">
            <input
              id="newhiretracker_name_input"
              type="text"
              name="name"
              autoComplete="off"
              className="formControl pl-3"
              onChange={(e) => makeFilterData(e)}
            />
          </div>
          <div className="col-2 ml-2">
            <Button
              onClick={() => newHireList(numberMonth[clickedItem].value, filterData.name)}
              style={{
                width: '100%',
                padding: '0',
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <img src={icon_search_white} alt="" width={20} />
            </Button>
          </div>
        </div>
        {newHire &&
          newHire.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '30px' }}>
              No Record Found
            </div>
          ) : null}
        <div>
          <Table className="table-responsive custom-table">
            <div className="new-hire-table">
              <tbody>
                {newHire.length > 0 &&
                  newHire.map((item: any, index: any) => {
                    return (
                      <tr key={item.id}>
                        <td id={"newhire_name_td_" + item.name} className="text-primary font-bold d-flex custom-td-width custom-td-width-mobile">
                          <img src={user} width={40} style={{ borderRadius: '50%', color: 'black', margin: '10px' }}></img>
                          <span style={{ marginTop: '22px' }}>{item.name}</span>
                        </td>
                        <td style={{ paddingLeft: '50px' }} id={"newhire_button_td_" + item.id}>
                          <img src={evaluate_disabled} alt="" />
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </div>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default NewHire;
