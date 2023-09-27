import React, { useState, useEffect, useRef } from "react";
import { RequestAPI, Api } from "../api";
import { Utility } from "../utils"
import { async } from "validate.js";
import { Table, Button, Carousel } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux"
import { hmo_icon } from "../assets/images";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { tr } from "date-fns/locale";


const EmployeeDirectory = () => {
    const dispatch = useDispatch()
    const [ allSquad, setAllSquad ] = useState<any>([])
    const [ allEmployee, setAllEmployee ] = useState<any>([])
    const [scrollPosition, setScrollPosition] = useState(0);
    const [clickedItem, setClickedItem] = useState(null);
    const [defaultSelectedItem, setDefaultSelectedItem] = useState(null);
    const scrollContainerRef = useRef(null);
    const [slider, setSlider] = useState(null);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const sliderRef = useRef(null); 

    
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
        setClickedItem(0);
        employeeList(allSquadWithAllOption[0].id);
      }, []); 
    const employeeList = (squadId: any) => {
        RequestAPI.getRequest(
            `${Api.getEmployeeDirectory}?squadId=${squadId}`,
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
        // When the component mounts, set the slider reference
    setSlider(sliderRef.current);
    }, []);
    useEffect(() => {
    // Check if we're at the start or end of the slider
    if (sliderRef.current) {
        setIsAtStart(sliderRef.current.state.currentSlide === 0);
        setIsAtEnd(sliderRef.current.state.currentSlide === sliderRef.current.slideCount - 1);
    }
    }, [sliderRef]);
    const handleItemClick = (index, itemId) => {
        setClickedItem(index);
        employeeList(itemId);
    };

    const allSquadWithAllOption = [{ id: '', name: 'All' }, ...allSquad];

    const handleNextClick = () => {
        // Check if we're not at the end of the slider
        if (!isAtEnd) {
          sliderRef.current.slickNext();
        }
      };
    
      const handlePrevClick = () => {
        // Check if we're not at the start of the slider
        if (!isAtStart) {
          sliderRef.current.slickPrev();
        }
      };
    const NextArrow = (props) => (
        <button
          {...props}
          className="slick-arrow slick-next"
          style={{ right: '10px', zIndex: 1, marginRight: '-50px' }}
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

      


    return (
        <div className="time-card-width">
             <div className="card-header">
                <span className="">Employee Directory</span>
            </div>
            <div className="time-card-body row">
                
                <div className="col-12 pb-3" style={{maxHeight: '20px'}}>
                    <Slider {...settings} ref={sliderRef} className="custom-slider">
                        {allSquadWithAllOption &&
                        allSquadWithAllOption.map((item, index) => (
                            <div
                            key={item.id}
                            className={`pa-1 text-primary text-bold custom-slider-item ${clickedItem === index ? 'underline' : ''}`}
                            style={{
                                cursor: 'pointer',
                                borderBottom: clickedItem === index ? '10px solid' : 'none', // Solid underline when clicked
                            }}
                            onClick={() => handleItemClick(index, item.id)}
                            >
                            {item.name}
                            </div>
                        ))}
                    </Slider>
                </div>
                <div className="col-12" style={{height: '100%'}}>
                    <Table responsive >
                        <div style={{ minHeight: '350px', maxHeight: '350px', overflowY: 'auto', paddingTop: '40px', marginLeft: '20px' }}>
                        <tbody>
                            {allEmployee.map((item: any, index: any) => {
                                return (
                                    <tr key={item.id}>
                                        <td style={{width: '300px'}}>{item.name}</td>
                                        <td style={{width: '300px'}}></td>
                                        <td style={{width: '100%'}}>{item.squadName}</td>
                                    </tr>
                                )
                            })}
                            
                        </tbody>
                        </div>
                    </Table>

                </div>
                
                {/* <span className="profile-full-name">{userData.data.profile.firstName} {userData.data.profile.lastName} </span>     */}
                
            </div>
        </div>
       
    )
}

export default EmployeeDirectory