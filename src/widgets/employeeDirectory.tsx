import React, { useState, useEffect, useRef } from "react";
import { RequestAPI, Api } from "../api";
import { Utility } from "../utils"
import { async } from "validate.js";
import { Table, Button, Carousel } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux"
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { tr } from "date-fns/locale";
import user from "../assets/images/dist/User1.png"
import EmployeeDropdown from "../components/EmployeeDropdown";
import icon_search_white from "../assets/images/icon_search_white.png"




const EmployeeDirectory = () => {
  const dispatch = useDispatch()
  const [ allSquad, setAllSquad ] = useState<any>([])
  const [ allEmployee, setAllEmployee ] = useState<any>([])
  const [scrollPosition, setScrollPosition] = useState(0);
  const [clickedItem, setClickedItem] = useState("" );
  const [defaultSelectedItem, setDefaultSelectedItem] = useState(null);
  const scrollContainerRef = useRef(null);
  const [slider, setSlider] = useState(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const sliderRef = useRef(null); 
  const [filterData, setFilterData] = useState<{ [key: string]: string }>({});
  const [ squadId , setSquadId] = useState("")
    
  useEffect (() => {
    RequestAPI.getRequest(
      `${Api.getAllSquad}`,
      "",
      {},
      {},
      async(res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res
        if (status === 200 && body && body.data) {
        setAllSquad(body.data)
        console.log(body.data);

         setDefaultSelectedItem({
            index: 0, // Index of "All" in the allSquadWithAllOption array
            itemId: '', // ID of the "All" item
          });
        } else {
        }

      }
    )
  },[])
  useEffect(() => {
    if (defaultSelectedItem !== null) {
      handleItemClick(defaultSelectedItem.index, defaultSelectedItem.itemId);
    }
  }, [defaultSelectedItem]);
    
  useEffect(() => {
    setClickedItem("");
    employeeList(allSquadWithAllOption[0].id);
  }, []); 
  const employeeList = (squadId: any = "", userId : any = "") => {
    let queryString = ""
      let filterDataTemp = { ...filterData }
      if (filterDataTemp) {
        Object.keys(filterDataTemp).forEach((d: any) => {
          if (filterDataTemp[d]) {
              queryString += `&${d}=${filterDataTemp[d]}`
          } else {
              queryString = queryString.replace(`&${d}=${filterDataTemp[d]}`, "")
          }
        })
      }
      RequestAPI.getRequest(
        `${Api.getEmployeeDirectory}?squadId=${squadId}${queryString}`,
        "",
        {},
        {},
        async (res: any) => {
          const { status , body = { data: {}, error : {}}} : any = res
          if (status === 200 && body ) {
            if (body.error && body.error.message) {
            } else {
              console.log(body.data)
              setAllEmployee(body.data)
            }
          }
        }
      )
  }

      
  useEffect(() => {
  setSlider(sliderRef.current);
  }, []);
  useEffect(() => {
  if (sliderRef.current) {
    setIsAtStart(sliderRef.current.state.currentSlide === 0);
    setIsAtEnd(sliderRef.current.state.currentSlide === sliderRef.current.slideCount - 1);
  }
  }, [sliderRef]);
  const handleItemClick = (index: any, itemId: any ) => {
    setClickedItem(index);
    employeeList(itemId);
  };
  const allSquadWithAllOption = [{ id: '', name: 'All' , value : '' }, ...allSquad];
  const handleNextClick = () => {
    if (!isAtEnd) {
      sliderRef.current.slickNext();
    }
  };
  const handlePrevClick = () => {
    if (!isAtStart) {
      sliderRef.current.slickPrev();
    }
  };
  const NextArrow = (props: any) => (
    <button
      {...props}
      className="slick-arrow slick-next"
      style={{ right: '10px', zIndex: 1, marginRight: '5px' }}
      onClick={handleNextClick}
    >
      Next
    </button>
  );
    
  const PrevArrow = (props) => (
    <button
      {...props}
      className="slick-arrow slick-prev"
      style={{ left: '10px', zIndex: 1, marginLeft: '-25px'}}
      onClick={handlePrevClick}
    >
      Previous
    </button>
  );
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    centerMode: false,
    variableWidth: true, // Enable variable width
    cssEase: 'linear', // Optional, smooth sliding
  
  };
  const singleChangeOption = (option: any, name: any) => {

    const filterObj: any = { ...filterData }
    filterObj[name] = name && option && option.value !== "Select" ? option.value : ""
    setFilterData(filterObj)
  }

  return (
    <div className="time-card-width">
      <div className="card-header">
        <span className="">Employee Directory</span>
      </div>
      <div className="directory-card-body ">
        <div className="col-12 pb-3 pt-3" style={{maxHeight: '20px'}}>
          <Slider {...settings} ref={sliderRef} className="custom-slider">
              {allSquadWithAllOption &&
              allSquadWithAllOption.map((item, index) => (
                <div
                id="dashboardemployeedirectory_div_slider"
                key={item.id}
                className={`pa-1 text-primary text-bold custom-slider-item ${clickedItem === index ? 'underline' : ''}`}
                style={{
                  cursor: 'pointer',
                  borderBottom: clickedItem === index ? '10px solid' : 'none', 
                }}
                onClick={() => handleItemClick(index, item.id)}
                >
                {item.name}
                </div>
              ))}
            </Slider>
        </div>
        <div className="row header-input">
          <div className="col-9 ml-3" style={{ display: 'flex', alignItems: 'center' }}>
            <div className="" style={{ flex: 1 }}>
              <EmployeeDropdown
                id="dashboardemployeedirectory_search_input2"
                squad={false}
                placeholder={"Employee"}
                singleChangeOption={singleChangeOption}
                name="userId"
                value={filterData && filterData['userId']}
              />
            </div>
          </div>
          <div className="col-2" style={{ display: 'flex', alignItems: 'center' }}>
            <Button
            onClick={() => employeeList(clickedItem)}
            id="dashboardemployeedirectory_search_btn"
            style={{ width: '100%',
            padding: '0',
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            }} 
            >
              <img src={icon_search_white} alt="" width={20} />
            </Button>
          </div>
        </div>
        <div className="employee-directory-table">
          <Table responsive className="custom-directory-table">
            <tbody>
              {allEmployee.length > 0 ? (allEmployee.map((item: any, index: any) => {
                return (
                  <tr key={item.id}>
                    <td id={"dashboardemployeedirectory_td_itemname_"} className="text-primary font-bold custom-td-width" style={{width: 'auto'}} >
                      <div className="d-flex">
                          <img src={user} width={20} style={{ borderRadius: '50%', margin: '20px 10px 10px 10px'}} alt="User" />
                          <div className="pt-3">
                            {item.name}
                          </div>
                      </div>
                    </td>
                    <td id={"dashboardemployeedirectory_td_squadname_"} style={{ textAlign: 'center'}} className="text-primary">{item.squadName}</td>
                  </tr>
                )
              })) : (
                <tr>
                  <td colSpan="2" className="text-center">
                      No Record Found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
  </div>
</div>
      
  )
}

export default EmployeeDirectory