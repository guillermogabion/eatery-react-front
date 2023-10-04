import React, { useEffect, useState } from "react";
import { RequestAPI, Api } from "../api";
import { Table, Button, Carousel } from "react-bootstrap";
import user from "../assets/images/dist/User1.png"

const NewHire = () => {
  const [clickedItem, setClickedItem] = useState(null);
  const [defaultSelectedItem, setDefaultSelectedItem] = useState(null);
  const [newHire, setNewHire] = useState<any>([]);
  

  const numberMonth = [
    { id: 1, label: "All", value: '' },
    { id: 2, label: "3rd Month", value: 3 },
    { id: 3, label: "5th Month", value: 5 },
    { id: 4, label: "6th Month", value: 6 },
  ];

  const newHireList = (month: any) => {
    RequestAPI.getRequest(
        `${Api.getNewHire}?month=${month}`,
        "",
        {},
        {},
        async (res: any) => {
            const { status , body = { data: {}, error : {}}} : any = res
            console.log(month)
            if (status === 200 && body ) {
              if (body.error && body.error.message) {
              } else {
                console.log(body.data)
                setNewHire(body.data)
              }
            }
        }
    )
}

  const handleItemClick = (index: any, itemValue: any) => {
    setClickedItem(index);
    newHireList(itemValue);
  };

  useEffect(() => {
    setClickedItem(0);
    newHireList(numberMonth[0].value)
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
        <div className="d-flex" style={{maxHeight: '20px', textAlign: 'center'}}>
          {numberMonth &&
            numberMonth.map((item, index) => (
              <div
                key={item.id}
                className={`pa-1 text-primary text-bold custom-slider-item ${
                  clickedItem === index ? "underline" : ""
                }`}
                style={{
                  cursor: "pointer",
                  // borderBottom:
                  //   clickedItem === index ? "2px solid #007bff" : "none", 
                  fontSize: "20px",
                }}
                onClick={() => handleItemClick(index, item.value)}
              >
                {item.label}
              </div>
            ))}
            
        </div>
        { newHire &&
            newHire.length == 0 ?
            <div className="w-100 text-center pt-10">
            <label htmlFor="">No Records Found</label>
            </div>
            :
            null
          }
        <div className="col-12" style={{height: '100%'}}>
            <Table responsive >
                <div style={{ minHeight: '350px', maxHeight: '350px', overflowY: 'auto', paddingTop: '40px', marginLeft: '20px' }}>
                <tbody>
                    {newHire.length > 0 &&
                    newHire.map((item: any, index: any) => {
                        return (
                            <tr key={item.id}>
                                <td className="text-primary font-bold d-flex" style={{width: '300px'}}>
                                  <img src={user} width={30} style={{borderRadius: '50%', color: 'black', margin: '10px'}}></img>
                                  <span style={{ marginTop: '22px' }}>{item.name}</span>
                                  </td>
                                <td style={{width: '100%'}}>{item.squadName}</td>
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