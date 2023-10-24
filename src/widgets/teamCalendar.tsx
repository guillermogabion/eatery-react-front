
import React, { useState, useEffect, useRef } from "react";
import { Dropdown, Tabs, Tab,Card, Button } from 'react-bootstrap';
import Calendar from 'react-calendar';
import { activeWeek, inactiveWeek, activeCalendar, inactiveCalendar } from "../assets/images";
import { Api, RequestAPI } from "../api"
import user from "../assets/images/dist/User1.png"
import Accordion from 'react-bootstrap/Accordion';
import Carousel from 'react-bootstrap/Carousel';
import moment from "moment";
import { async } from "validate.js";

function CustomHeader({ date }) {
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <h2 style={{ marginRight: '10px' }}>{month}</h2>
      <h2>{year}</h2>
    </div>
  );
}
const CalendarComponent = () => {

  const [date, setDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState(""); 
  const [ dataMonth, setDataMonth ] = useState<any>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const hasLeavesThisWeek = dataMonth.some((item) => item.leavesList && item.leavesList.length > 0);
  const hasHolidaysThisWeek = dataMonth.some((item) => item.holidaysList && item.holidaysList.length > 0);
  const hasBirthdaysThisWeek = dataMonth.some((item) => item.bdayList && item.bdayList.length > 0);
  const hasNewHiresThisWeek = dataMonth.some((item) => item.newHiresList && item.newHiresList.length > 0);
  const [calendarInteracted, setCalendarInteracted] = useState(false);


  useEffect(() => {
    const today = new Date();
    const currentMonth = new Date().getMonth() + 1;
    setSelectedMonth(currentMonth);
    setSelectedDate(today)

    
  }, []);
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      .react-calendar__tile--range {
        background-color: transparent !important;
      }
      .react-calendar__tile--now {
        background-color: #189FB5 !important;
      }
    `;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  useEffect(() => {
    if (selectedMonth !== null) {
      const newDate = new Date();
      newDate.setMonth(selectedMonth - 1); 
      newDate.setDate(1);
      setDate(newDate);
    }
  }, [selectedMonth]);

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    const newDate = new Date(date);
    newDate.setMonth(month - 1);
    newDate.setDate(1);
    setDate(newDate);
  };

  const handleDateClick = (clickedDate) => {
    setCalendarInteracted(true);
    setSelectedDate(clickedDate);
    const dateClickedFrom = `${clickedDate.getFullYear()}-${(clickedDate.getMonth() + 1).toString().padStart(2, '0')}-${clickedDate.getDate().toString().padStart(2, '0')}`;
    const dateClickedTo = `${clickedDate.getFullYear()}-${(clickedDate.getMonth() + 1).toString().padStart(2, '0')}-${clickedDate.getDate().toString().padStart(2, '0')}`;
    setFromDate(dateClickedFrom);
    setToDate(dateClickedTo);

    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      .react-calendar__tile--range {
        background-color: #189FB5 !important;
      }
    `;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };

  };
  
  function getCurrentDate() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    currentDate.setDate(currentDate.getDate() + 3 - ((currentDate.getDay() + 6) % 7));
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const getData = async (fromDate, toDate) => {
    try {
      const response = await RequestAPI.getRequest(
        `${Api.getDataWeekWidget}`,
        "",
        {fromDate, toDate},
        {},
        async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res;
          if (status === 200 && body && body.data) {
           setDataMonth(body.data)
          }
        }
      );

    } catch (error) {
      console.error("Error request:", error);
    }
  };

  useEffect(() => {
    if (fromDate && toDate ) {
      getData(fromDate, toDate);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    let today = moment().format("YYYY-MM-DD")
      RequestAPI.getRequest(
        `${Api.getDataWeekWidget}?fromDate=${today}&toDate=${today}`,
        "",
        {},
        {},
        async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res;
          if (status === 200 && body && body.data) {
            setDataMonth(body.data)
          }
        }
      )
    }, 
  [])

  function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  

  const scrollLeft = () => {
    const scrollContainer = document.getElementById('horizontal-scroll-container-1st');
    if (scrollContainer) {
      setScrollPosition(scrollPosition - 100);
      scrollContainer.scrollLeft -= 100;
    }
  };

  const scrollRight = () => {
    const scrollContainer = document.getElementById('horizontal-scroll-container-1st');
    if (scrollContainer) {
      setScrollPosition(scrollPosition + 100);
      scrollContainer.scrollLeft += 100;
    }
  };

  

  return (
  <div>
    <div>
      <div className="calendar-container mb-2 pb-6">
        <Calendar
        onChange={setDate}
        calendarType="US"
        value={date}
        className="custom-calendar"
        onClickDay={handleDateClick}
        tileContent={() => <div />} 
        renderHeader={({ date  }) => <CustomHeader date={date} />}
        />
      </div>
      </div>
      <div className="pt-12 mt-4">
        <Tabs defaultActiveKey="tab1" id="my-tabs" className=" justify-content-center custom-tab-calendar custom-calendar-tab-2nd pt-1 mt-4">
          <Tab className="custom-tabs"  eventKey="tab1" title="Holiday">
          {hasHolidaysThisWeek ? (
            dataMonth.map((item: any, index: any) => (
              <div key={index}>
                {item.holidaysList && item.holidaysList.length > 0 && (
                  <ul>
                  {item.holidaysList.map((holidayItem: any, holidayIndex: any) => (
                    <div key={holidayIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', paddingTop: '10px', paddingLeft: '45px' }}>
                        {holidayItem.holidayName}
                    </div>
                  ))}
                  </ul>
                )}
              </div>
            ))
            ) : (
              <div style={{ paddingLeft: '45px', display: 'flex', flexDirection: 'column', alignItems: 'left', paddingTop: '10px' }}>
                Not a holiday today
              </div>
            )}
          </Tab>
          <Tab  className="custom-tabs" eventKey="tab2" title="Birthday">
            
            {hasBirthdaysThisWeek ? (
            <div className="">
              {dataMonth.map((item: any, index: any) => (
                <div key={index}>
                  {item.bdayList && item.bdayList.length > 3 ? (
                  <div className="horizontal-scroll">
                    <div className="row d-flex position-relative">
                      <div className="col-1">
                        <button className="scroll-button left" style={{position:'absolute', paddingTop: '20px'}} onClick={scrollLeft}>
                          &#9664;
                        </button>
                      </div>
                      <div className="col-10">
                        <div className="horizontal-scroll-container" id="horizontal-scroll-container" style={{paddingLeft: '50px'}}>
                          <ul className="horizontal-scroll-list" style={{marginLeft: '30px'}}>
                            <div className="col-3" >
                              {item.bdayList.map((bdayItem: any, bdayIndex: any) => (
                                <li key={bdayIndex} className="horizontal-scroll-item ma-5 pa-5"  style={{ textAlign: 'left', padding: '20px' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <img src={user} alt="" width={30} />
                                    <div style={{alignItems: 'center', textAlign: 'center', display: 'flex'}}>
                                      {bdayItem.firstName} <br />{bdayItem.lastName}
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </div>
                            
                          </ul>
                        </div>
                      </div>
                      <div className="col-1">
                        <button className="scroll-button right" style={{position:'absolute', paddingTop: '18px'}} onClick={scrollRight} >
                          &#9654;
                        </button>
                      </div>
                    </div>
                 
                  </div>
                  ) : item.bdayList && item.bdayList.length <= 3 ? (
                    <div className="horizontal-scroll-container" id="horizontal-scroll-container">
                      <ul className="horizontal-scroll-list" style={{marginLeft: '30px'}}>
                        {item.bdayList.map((bdayItem: any, bdayIndex: any) => (
                          <li key={bdayIndex} className="horizontal-scroll-item">
                            {/* <div key={bdayIndex}  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10px' }}> */}
                            <div style={{ margin: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <img src={user} alt="" width={30} />
                              <div style={{alignItems: 'center', textAlign: 'center', display: 'flex', fontSize: '12px', lineHeight: '12px'}}>
                                {bdayItem.firstName} <br />{bdayItem.lastName}
                              </div>
                            </div>
                            {/* </div> */}
                           </li>
                        ))}
                      </ul>
                    </div>
                  ) : ""
                  
                  }
                </div>
              ))}
            </div>
          ) : (
            <div style={{ paddingLeft: '45px', display: 'flex', flexDirection: 'column', alignItems: 'left', paddingTop: '10px' }}>
              No Birthdays today
            </div>
          )}
          </Tab>
          <Tab  className="custom-tabs" eventKey="tab3" title="On Leave">
          {hasLeavesThisWeek ? (
            <div className="">
              {dataMonth.map((item: any, index: any) => (
                <div key={index}>
                  {item.leavesList && item.leavesList.length > 3 ? (
                   <div className="horizontal-scroll">
                   <div className="row d-flex position-relative">
                     <div className="col-1">
                       <button className="scroll-button left" style={{position:'absolute', paddingTop: '20px', color: '#009FB5'}} onClick={scrollLeft}>
                         &#9664;
                       </button>
                     </div>
                     <div className="col-10">
                       <div className="horizontal-scroll-container" id="horizontal-scroll-container-1st">
                         <ul className="horizontal-scroll-list">
                           <div className="col-3">
                             {item.leavesList.map((leaveItem: any, leaveIndex: any) => (
                               <li key={leaveIndex} className="horizontal-scroll-item m-2"  style={{ textAlign: 'center' }}>
                                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                   <img src={user} alt="" width={30} className="flex-wrap" />
                                     <div style={{alignItems: 'center', textAlign: 'center', display: 'flex', fontSize: '12px', lineHeight: '12px'}}>
                                       {leaveItem.firstName} <br /> {leaveItem.lastName}
                                       <br />
                                       {leaveItem.leaveName === "Actimai Angel Benefits" ? "(AAB)" : leaveItem.leaveName === "Vacation Leave" ? "(VL)" :  leaveItem.leaveName === "Sick Leave" ? "(SL)" : ""}
                                     </div>
                                 </div>
                               </li>
                             ))}
                           </div>
                           
                         </ul>
                       </div>
                     </div>
                     <div className="col-1">
                       <button className="scroll-button right" style={{position:'absolute', paddingTop: '18px', color: '#009FB5'}} onClick={scrollRight} >
                         &#9654;
                       </button>
                     </div>
                   </div>
                 </div>
                  ) : item.leavesList && item.leavesList.length <= 3 ? (
                    <div className="horizontal-scroll-container" id="horizontal-scroll-container">
                      <ul className="horizontal-scroll-list" style={{marginLeft: '30px'}}>
                        {item.leavesList.map((leaveItem: any, leaveIndex: any) => (
                          <li key={leaveIndex} className="horizontal-scroll-item">
                            <div style={{ margin: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <img src={user} alt="" width={30} />
                              <div style={{alignItems: 'center', textAlign: 'center', display: 'flex', fontSize: '12px', lineHeight: '12px'}}>
                              {leaveItem.firstName}<br />{leaveItem.lastName}
                              <br />
                              {leaveItem.leaveName === "Actimai Angel Benefits" ? "(AAB)" : leaveItem.leaveName === "Vacation Leave" ? "(VL)" :  leaveItem.leaveName === "Sick Leave" ? "(SL)" : ""}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : ""
                  
                  }
                </div>
              ))}
            </div>
          ) : (
            <div style={{ paddingLeft: '45px', display: 'flex', flexDirection: 'column', alignItems: 'left', paddingTop: '10px' }}>
              No employee on leave today
            </div>
          )}

          </Tab>
          <Tab  className="custom-tabs" eventKey="tab4" title="New Hire">
           
          {hasNewHiresThisWeek ? (
            <div className="">
              {dataMonth.map((item: any, index: any) => (
                <div key={index}>
                  {item.newHiresList && item.newHiresList.length > 3 ? (
                  <div className="horizontal-scroll">
                    <div className="row d-flex position-relative">
                      <div className="col-1">
                        <button className="scroll-button left" style={{position:'absolute', paddingTop: '20px', color: '#009FB5'}} onClick={scrollLeft}>
                          &#9664;
                        </button>
                      </div>
                      <div className="col-10">
                        <div className="horizontal-scroll-container" id="horizontal-scroll-container">
                          <ul className="horizontal-scroll-list" style={{marginLeft: '30px'}}>
                            <div className="col-3  ">
                              {item.newHiresList.map((newHireItem: any, newHireIndex: any) => (
                                <li key={newHireIndex} className="horizontal-scroll-item ma-5 pa-5"  style={{ textAlign: 'center', padding: '20px' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <img src={user} alt="" width={30} />
                                    <div style={{alignItems: 'center', textAlign: 'center', display: 'flex', fontSize: '12px', lineHeight: '12px'}}>
                                      {newHireItem.firstName}<br />{newHireItem.lastName}
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </div>
                            
                          </ul>
                        </div>
                      </div>
                      <div className="col-1">
                        <button className="scroll-button right" style={{position:'absolute', paddingTop: '18px', color: '#009FB5'}} onClick={scrollRight} >
                          &#9654;
                        </button>
                      </div>
                    </div>
                 
                  </div>
                  ) : item.newHiresList && item.newHiresList.length <= 3 ? (
                    <div className="horizontal-scroll-container" id="horizontal-scroll-container">
                      <ul className="horizontal-scroll-list" style={{marginLeft: '30px'}}>
                        {item.newHiresList.map((newHireItem: any, newHireIndex: any) => (
                          <li key={newHireIndex} className="horizontal-scroll-item">
                            <div style={{ margin: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <img src={user} alt="" width={30} />
                              <div style={{alignItems: 'center', textAlign: 'center', display: 'flex', fontSize: '12px', lineHeight: '12px'}}>
                                {newHireItem.firstName}<br />{newHireItem.lastName}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : ""
                  
                  }
                </div>
              ))}
            </div>
          ) : (
            <div style={{ paddingLeft: '45px', display: 'flex', flexDirection: 'column', alignItems: 'left', paddingTop: '10px' }}>
              No newly hired today
            </div>
          )}
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

const TeamCalendar = () => {
  const [activeWeekTab, setActiveWeekTab] = useState('tab1');
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeekNumber());
  const [currentWeek, setCurrentWeek] = useState(0);
  const [year, setYear] = useState(new Date().getFullYear());
  const [ dataWeek, setDataWeek ] = useState<any>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState(""); 
  const scrollContainerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenBirth, setIsOpenBirth] = useState(false);
  const [isOpenOut, setIsOpenOut] = useState(false);
  const [isOpenHire, setIsOpenHire] = useState(false);
  const [activeAccordionKey, setActiveAccordionKey] = useState(null);

  const handleAccordionToggle = (key : any) => {
    setActiveAccordionKey(activeAccordionKey === key ? null : key);
  };



  const options = {
    timeZone: 'Asia/Manila',
    month: 'long',
    day: 'numeric',
  };

  const hasLeavesThisWeek = dataWeek.some((item : any) => item.leavesList && item.leavesList.length > 0);
  const hasHolidaysThisWeek = dataWeek.some((item : any) => item.holidaysList && item.holidaysList.length > 0);
  const hasBirthdaysThisWeek = dataWeek.some((item : any) => item.bdayList && item.bdayList.length > 0);
  const hasNewHiresThisWeek = dataWeek.some((item : any) => item.newHiresList && item.newHiresList.length > 0);
  
  function getCurrentWeekNumber() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    currentDate.setDate(currentDate.getDate() + 3 - ((currentDate.getDay() + 6) % 7));
    const weekNumber = 1 + Math.floor((currentDate.getTime() - new Date(currentDate.getFullYear(), 0, 4).getTime()) / 86400000 / 7);
    return weekNumber;
  }

  function getCurrentDate() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    currentDate.setDate(currentDate.getDate() + 3 - ((currentDate.getDay() + 6) % 7));
  
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
  const changeWeek = (increment : any) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + increment * 7);
    setDate(newDate);
  };

  const getWeekDays = (currentDate : any) => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const weekDays = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      weekDays.push(day);
    }

    return weekDays;
  };

  const weekDays = getWeekDays(date);
  const currentDate = new Date();

  const handleDateClick = (clickedDate : any) => {
    setSelectedDate(clickedDate);
  
    const startDateFormatted = `${clickedDate.getFullYear()}-${(clickedDate.getMonth() + 1).toString().padStart(2, '0')}-${clickedDate.getDate().toString().padStart(2, '0')}`;
    const endDateFormatted = `${clickedDate.getFullYear()}-${(clickedDate.getMonth() + 1).toString().padStart(2, '0')}-${clickedDate.getDate().toString().padStart(2, '0')}`;
    
    console.log(`Date From (Start Date): ${startDateFormatted}`);
    console.log(`Date To (End Date): ${endDateFormatted}`);
    setFromDate(startDateFormatted);
    setToDate(endDateFormatted);
  };

  const updateCurrentWeek = () => {
    const currentWeekNumber = getWeekNumber(new Date());
    setCurrentWeek(currentWeekNumber);
  };

  useEffect(() => {
    updateCurrentWeek();
  }, []);

  const getWeekNumber = (inputDate: any) => {
    const date = new Date(inputDate);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    const weekNumber = 1 + Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 4).getTime()) / 86400000 / 7);
    return weekNumber;
  };

  const getWeekNumbersForYear = (year: any) => {
    const weekNumbers = [];
    const startDate = new Date(year, 0, 1);

    while (startDate.getFullYear() === year) {
      weekNumbers.push(getWeekNumber(startDate));
      startDate.setDate(startDate.getDate() + 7);
    }

    return weekNumbers;
  };

  const weekNumbersForYear = getWeekNumbersForYear(year);

  const formatWeekLabel = (weekNumber: any) => {
    const firstDayOfWeek = new Date(year, 0, 1); 
    const daysToAdd = (weekNumber - 1) * 7;
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() + daysToAdd);
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
    const startDateString = firstDayOfWeek.toLocaleDateString("en-US", { month: "long", day: "numeric" });
    const endDateString = lastDayOfWeek.toLocaleDateString("en-US", { month: "long", day: "numeric" });
    return `Week ${weekNumber} ${startDateString} - ${endDateString}`;
  };

  const handleWeekSelect = (weekNumber: any) => {
    setSelectedWeek(weekNumber);
    setDate(getStartDateOfWeek(weekNumber));
    const startDate = getStartDateOfWeek(weekNumber);
    };

  const getStartDateOfWeek = (weekNumber: any) => {
    const firstDayOfWeek = new Date(year, 0, 1); 
    const daysToAdd = (weekNumber - 1) * 7;
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() + daysToAdd);
    return firstDayOfWeek;
  };
  const formatWeekLabelForDates = (startDate : any, endDate : any) => {
    const startDateFormat = startDate.toLocaleDateString("en-US", options);
    const endDateFormat = endDate.toLocaleDateString("en-US", options);
    return `${startDateFormat} - ${endDateFormat}`;
  };
   const handleWeekTabSelect = (selectedTab: any) => {
    setActiveWeekTab(selectedTab);
  };
  const getData = async (fromDate: any, toDate: any) => {
    try {
      const response = await RequestAPI.getRequest(
        `${Api.getDataWeekWidget}`,
        "",
        {fromDate, toDate},
        {},
        async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res;
          if (status === 200 && body && body.data) {
           setDataWeek(body.data)
          }
        }
      );
    } catch (error) {
      console.error("Error request:", error);
    }
  };
  useEffect(() => {
    if (fromDate && toDate) {
      getData(fromDate, toDate);
    }
  }, [fromDate, toDate]);
  useEffect(() => {
    let today = moment().format("YYYY-MM-DD")
    RequestAPI.getRequest(
      `${Api.getDataWeekWidget}?fromDate=${today}&toDate=${today}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res;
        if (status === 200 && body && body.data) {
          setDataWeek(body.data)
        }
      }
    )
  }, [])
 
  const scrollLeft = () => {
    const scrollContainer = document.getElementById('horizontal-scroll-container');
    if (scrollContainer) {
      setScrollPosition(scrollPosition - 100);
      scrollContainer.scrollLeft -= 100;
    }
  };

  const scrollRight = () => {
    const scrollContainer = document.getElementById('horizontal-scroll-container');
    if (scrollContainer) {
      setScrollPosition(scrollPosition + 100);
      scrollContainer.scrollLeft += 100;
    }
  };

  const handleLeftArrowClick = () => {
    setSelectedWeek(selectedWeek === 1 ? 52 : selectedWeek - 1);
  };

  const handleRightArrowClick = () => {
    setSelectedWeek((selectedWeek + 1) % 53 || 1);
  };
  return (
    <div className="time-card-width">
      <div className="card-header">
        <span className="">Employee Calendar</span>
      </div>
      <div className="calendar-card-body">
        <div className="row d-flex">
          { activeWeekTab === 'tab1' && (
            <div className="col-6">
              <Dropdown style={{backgroundColor: "", position: 'absolute', fontSize:"5px"}}  className="custom-dropdown">
                <Dropdown.Toggle id="week-selector" style={{ color: '' }}  className="text-primary dropdown-text">
                  {selectedWeek === null ? `Today ${formatWeekLabelForDates(weekDays[0], weekDays[6])}` : formatWeekLabel(selectedWeek)}
                </Dropdown.Toggle>
                <Dropdown.Menu
                  style={{
                    maxHeight: '200px', 
                    overflowY: 'auto',  
                    }}
                  >
                  {weekNumbersForYear.map((weekNumber) => (
                    <Dropdown.Item
                      key={weekNumber}
                      value={weekNumber}
                      onClick={() => handleWeekSelect(weekNumber)}
                      disabled={selectedWeek === weekNumber}
                    >
                      {formatWeekLabel(weekNumber)}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            )
          }
          <Tabs 
          defaultActiveKey="tab1" 
          id="my-tabs" 
          className="custom-calendar-tab 
          justify-content-end pr-8"
          activeKey={activeWeekTab}
            onSelect={handleWeekTabSelect}
          >
            <Tab
              className="custom-calendar-tabs"
              eventKey="tab1"
              title={<img className="ma-0 pa-0" src={activeWeekTab === 'tab1' ? activeWeek : inactiveWeek} alt="Tab 1" />}
            >
                <div className="row d-flex pb-3">
                  <div className="col-1 arrow-space">
                    <div className="arrow-button left">
                      <div onClick={() => { changeWeek(-1); handleLeftArrowClick(); }} className="triangle-left "></div>
                    </div>
                  </div>
                  <div className="col-10">
                    <div className="week-days ">
                    {weekDays.map((day) => (
                      <div
                      key={day.toDateString()}
                      className={`day ${selectedDate && day.toDateString() === selectedDate.toDateString() ? "current-day" : ""}`}
                      onClick={() => handleDateClick(day)}
                      >
                        <div className={`day-date text-primary ${selectedDate && day.toDateString() === selectedDate.toDateString() ? "" :  day.getDate() > 9 ? "font-adjust" : ""}`}>
                            {day.getDate()}
                        </div>
                        <div className="day-name">
                            {day.getDate() === currentDate.getDate() && day.getMonth() === currentDate.getMonth() && day.getFullYear() === currentDate.getFullYear()
                            ? "Today"
                            : day.toLocaleDateString("en-US", { weekday: "short" })}
                        </div>
                      </div>
                    ))}
                    </div>
                  </div>
                  <div className="col-1 arrow-space">
                      <div className="arrow-button right">
                          <div onClick={() => { changeWeek(1); handleRightArrowClick();}} className="triangle-right text-primary"></div>
                      </div>
                  </div>
              </div>
  {/* leaves  */}
            <div  className="pt-2" style={{ height: '320px', overflowY: 'auto', marginTop: '-10px'  }}>
              {/* <div> */}
                <Accordion activeKey={activeAccordionKey} onSelect={handleAccordionToggle} style={{ border: 'none' }} className="custom-accordion">
                  <Accordion.Item style={{paddingBottom: '10px'}} className="custom-arrow-accordion" eventKey="0">
                    <Accordion.Header className="accordion-custom-header" style={{cursor: 'not-allowed'}}>
                      <div className="col-12 d-flex">
                        <div className="col-6 pt-1">
                          <span>Holidays</span>
                        </div>
                        <div className="col-6">
                          <div className="d-flex justify-content-end">
                            <span className="accordion-custom-button">
                              <Button
                                variant="text"
                                aria-controls="accordion-body"
                                aria-expanded={activeAccordionKey === '0'}
                                style={{ color: 'white', height: '30px', lineHeight: '10px', cursor: 'pointer' }}
                                className="pt-0 mt-0"
                              >
                                {activeAccordionKey === '0' ? '▼' : '►'}
                              </Button>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Accordion.Header>
                      <Accordion.Body style={{borderRadius: '10px'}}>
                      {hasHolidaysThisWeek ? (
                          dataWeek.map((item : any, index : any) => (
                              <div key={index}>
                              {item.holidaysList && item.holidaysList.length > 0 && (
                                  <ul>
                                  {item.holidaysList.map((holidayItem : any, holidayIndex : any) => (
                                      <li key={holidayIndex}>
                                      {holidayItem.holidayName}
                                      </li>
                                  ))}
                                  </ul>
                              )}
                              </div>
                          ))
                          ) : (
                          <p>Not a holiday today</p>
                          )}
                      </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item style={{paddingBottom: '10px'}} eventKey="1" className="custom-arrow-accordion">
                    <Accordion.Header className="accordion-birthday-header">
                      <div className="col-12 d-flex">
                        <div className="col-6 pt-1">
                          <span>Birthdays</span>
                        </div>
                        <div className="col-6">
                          <div className="d-flex justify-content-end">
                            <div className="col-6" style={{ textAlign: 'right'}}>
                              {hasBirthdaysThisWeek ? (
                                dataWeek.map((item: any, index: any) => (
                                  <div key={index}>
                                  {item.bdayList && item.bdayList.length > 0 && (
                                    <ul style={{ listStyle: 'none', paddingLeft: '5px', margin: 0, whiteSpace: 'nowrap' }}>
                                    {item.bdayList.slice(0, 2).map((birthdayItem: any, birthdayIndex: any) => (
                                      <li key={birthdayIndex} style={{ display: 'inline-block', marginLeft: '5px', marginRight: '5px'}}>
                                        <img src={user} alt="" width={30} className="m-0 p-0 flex-wrap"/>
                                      </li>
                                    ))}
                                    </ul>
                                  )}
                                  </div>
                                ))
                                ) : (
                                null
                              )}
                            </div>
                            {dataWeek.reduce((total: any, item: any) => total + (item.bdayList ? item.bdayList.length : 0), 0) > 2 && (
                              <div
                                style={{
                                  
                                  
                                }}
                                className="custom-numbered-icon"
                              >
                                +{dataWeek.reduce((total: any, item: any) => total + (item.bdayList ? item.bdayList.length : 0), 0) - 2}
                              </div>
                              )} 
                              <span className="accordion-custom-button">
                                <Button
                                  variant="text"
                                  aria-controls="accordion-body"
                                  aria-expanded={activeAccordionKey === '1'}
                                  style={{ color: 'white', height: '30px', lineHeight: '10px', cursor: 'pointer' }}
                                  className="pt-0 mt-0"
                                >
                                  {activeAccordionKey === '1' ? '▼' : '►'}
                                </Button>
                              </span>
                          </div>
                        </div>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      {hasBirthdaysThisWeek ? (
                        dataWeek.map((item : any, index: any) => (
                          <div key={index}>
                          {item.bdayList && item.bdayList.length > 0 && (
                            <ul>
                            {item.bdayList.map((bdayItem: any, bdayIndex: any) => (
                              <li key={bdayIndex}  className="horizontal-scroll-item">
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 10px 10px 0 ' }}>
                                  <img src={user} alt="" width={30} className="flex-wrap" />
                                  <div style={{alignItems: 'center', textAlign: 'center', display: 'flex', fontSize: '12px', lineHeight: '12px'}}>
                                    {bdayItem.firstName}<br />{bdayItem.lastName}
                                  </div>
                                </div>
                              </li>
                            ))}
                            </ul>
                          )}
                          </div>
                        ))
                        ) : (
                        <p>No Birthdays today</p>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item style={{paddingBottom: '10px'}} eventKey="2" className="custom-arrow-accordion">
                      <Accordion.Header className="accordion-leave-header" >
                        <div className="col-12 d-flex">
                          <div className="col-6 pt-1">
                            <span>Who's Out</span>
                          </div>
                          <div className="col-6">
                            <div className="d-flex justify-content-end">
                              <div className="col-6" style={{ textAlign: 'right'}}>
                                {/* <div style={{display: 'flex', alignItems: 'center', overflow: 'hidden'}}>
                                  
                                </div> */}
                                {hasLeavesThisWeek ? (
                                  dataWeek.map((item: any, index: any) => (
                                    <div key={index}>
                                    {item.leavesList && item.leavesList.length > 0 && (
                                      <ul style={{ listStyle: 'none', paddingLeft: '5px', margin: 0, whiteSpace: 'nowrap' }}>
                                      {item.leavesList.slice(0, 2).map((leaveItem: any, leaveIndex: any) => (
                                        <li key={leaveIndex} style={{ display: 'inline-block', marginLeft: '5px', marginRight: '5px'}}>
                                          <img src={user} alt="" width={30} className="m-0 p-0 flex-wrap"/>
                                        </li>
                                      ))}
                                      </ul>
                                    )}

                                    </div>
                                  ))
                                  
                                  
                                  
                                  ) : (
                                  null
                                )}
                              </div>
                              {dataWeek.reduce((total: any, item: any) => total + (item.leavesList ? item.leavesList.length : 0), 0) > 2 && (
                                <div className="col-3 custom-numbered-icon">
                                  +{dataWeek.reduce((total: any, item: any) => total + (item.leavesList ? item.leavesList.length : 0), 0) - 2}
                                </div>
                              )} 
                              
                             
                              <span className="accordion-custom-button">
                                <Button
                                  variant="text"
                                  aria-controls="accordion-body"
                                  aria-expanded={activeAccordionKey === '2'}
                                  style={{ color: 'white', height: '30px', lineHeight: '10px', marginTop: '10px', cursor: 'pointer' }}
                                  className="pt-0 mt-0"
                                >
                                  {activeAccordionKey === '2' ? '▼' : '►'}
                                </Button>
                              </span>
                            </div>
                          </div>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                      {hasLeavesThisWeek ? (
                        <div className="">
                          {dataWeek.map((item: any, index: any) => (
                            <div key={index}>
                              {item.leavesList && item.leavesList.length > 3 ? (
                              <div className="horizontal-scroll">
                                <div className="row d-flex position-relative">
                                  <div className="col-1">
                                    <button className="scroll-button left" style={{position:'absolute', paddingTop: '20px', color: '#009FB5'}} onClick={scrollLeft}>
                                      &#9664;
                                    </button>
                                  </div>
                                  <div className="col-10">
                                    <div className="horizontal-scroll-container" id="horizontal-scroll-container">
                                      <ul className="horizontal-scroll-list">
                                        <div className="col-3">
                                          {item.leavesList.map((leaveItem: any, leaveIndex: any) => (
                                            <li key={leaveIndex} className="horizontal-scroll-item m-2"  style={{ textAlign: 'center' }}>
                                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <img src={user} alt="" width={30} className="flex-wrap" />
                                                  <div style={{alignItems: 'center', textAlign: 'center', display: 'flex', fontSize: '12px', lineHeight: '12px'}}>
                                                    {leaveItem.firstName} <br /> {leaveItem.lastName}
                                                    <br />
                                                    {leaveItem.leaveName === "Actimai Angel Benefits" ? "(AAB)" : leaveItem.leaveName === "Vacation Leave" ? "(VL)" :  leaveItem.leaveName === "Sick Leave" ? "(SL)" : ""}
                                                  </div>
                                              </div>
                                            </li>
                                          ))}
                                        </div>
                                        
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="col-1">
                                    <button className="scroll-button right" style={{position:'absolute', paddingTop: '18px', color: '#009FB5'}} onClick={scrollRight} >
                                      &#9654;
                                    </button>
                                  </div>
                                </div>
                              </div>
                              ) : item.leavesList && item.leavesList.length <= 3 ? (
                                <div className="horizontal-scroll-container" id="horizontal-scroll-container">
                                  <ul className="horizontal-scroll-list">
                                    {item.leavesList.map((leaveItem : any, leaveIndex: any) => (
                                      <li key={leaveIndex} className="horizontal-scroll-item">
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                          <img src={user} alt="" width={30} />
                                          <div style={{alignItems: 'center', textAlign: 'center', display: 'flex', display: 'flex', fontSize: '12px', lineHeight: '12px'}}>
                                          {leaveItem.firstName} <br /> {leaveItem.lastName}
                                          <br />
                                          {leaveItem.leaveName === "Actimai Angel Benefits" ? "(AAB)" : leaveItem.leaveName === "Vacation Leave" ? "(VL)" :  leaveItem.leaveName === "Sick Leave" ? "(SL)" : ""} 
                                          </div>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : ""
                              
                              }
                            </div>
                          ))}
                        </div>
                      ) : (
                        "No Employee on Leave today"
                      )}
                      </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item style={{paddingBottom: '10px'}} eventKey="3" className="custom-arrow-accordion">
                    <Accordion.Header className="accordion-hire-header">
                      <div className="col-12 d-flex">
                        <div className="col-6 pt-1">
                          <span>New Hires</span>
                        </div>
                        <div className="col-6">
                          <div className="d-flex justify-content-end">
                            <div className="col-6" style={{ textAlign: 'right'}}>
                              {hasNewHiresThisWeek ? (
                                dataWeek.map((item: any, index: any) => (
                                  <div key={index}>
                                  {item.newHiresList && item.newHiresList.length > 0 && (
                                      <ul style={{ listStyle: 'none', paddingLeft: '5px', margin: 0, whiteSpace: 'nowrap' }}>
                                      {item.newHiresList.slice(0, 2).map((hireItem: any, hireIndex: any) => (
                                        <li key={hireIndex} style={{ display: 'inline-block', marginLeft: '5px', marginRight: '5px'}}>
                                          <img src={user} alt="" width={30} className="m-0 p-0 flex-wrap" />
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                  </div>
                                ))
                                ) : (
                                null
                              )}
                            </div>
                            {dataWeek.reduce((total: any, item: any) => total + (item.newHiresList ? item.newHiresList.length : 0), 0) > 2 && (
                              <div className="custom-numbered-icon">
                                +{dataWeek.reduce((total: any, item: any) => total + (item.newHiresList ? item.newHiresList.length : 0), 0) - 2}
                              </div>
                            )} 
                            <span className="accordion-custom-button">
                                <Button
                                  variant="text"
                                  aria-controls="accordion-body"
                                  aria-expanded={activeAccordionKey === '3'}
                                  style={{ color: 'white', height: '30px', lineHeight: '10px', cursor: 'pointer' }}
                                  className="pt-0 mt-0"
                                >
                                  {activeAccordionKey === '3' ? '▼' : '►'}
                                </Button>
                              </span>
                          </div>
                        </div>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                         {hasNewHiresThisWeek ? (
                        <div className="">
                          {dataWeek.map((item: any, index: any) => (
                            <div key={index}>
                              {item.newHiresList && item.newHiresList.length > 3 ? (
                              <div className="horizontal-scroll">
                                <div className="row d-flex position-relative">
                                  <div className="col-1">
                                    <button className="scroll-button left" style={{position:'absolute', paddingTop: '20px', color: '#009FB5'}} onClick={scrollLeft}>
                                      &#9664;
                                    </button>
                                  </div>
                                  <div className="col-10">
                                    <div className="horizontal-scroll-container" id="horizontal-scroll-container">
                                      <ul className="horizontal-scroll-list">
                                        <div className="col-3  ">
                                          {item.newHiresList.map((newHireItem: any, newHireIndex: any) => (
                                            <li key={newHireIndex} className="horizontal-scroll-item ma-5 pa-5"  style={{ textAlign: 'center', padding: '20px' }}>
                                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <img src={user} alt="" width={30} className="flex-wrap" />
                                                  <div style={{alignItems: 'center', textAlign: 'center', display: 'flex', display: 'flex', fontSize: '12px', lineHeight: '12px'}}>
                                                    {newHireItem.firstName} <br /> {newHireItem.lastName}
                                                  </div>
                                              </div>
                                            </li>
                                          ))}
                                        </div>
                                        
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="col-1">
                                    <button className="scroll-button right" style={{position:'absolute', paddingTop: '18px', color: '#009FB5'}} onClick={scrollRight} >
                                      &#9654;
                                    </button>
                                  </div>
                                </div>
                              </div>
                              ) : item.newHiresList && item.newHiresList.length <= 3 ? (
                                <div className="horizontal-scroll-container" id="horizontal-scroll-container">
                                  <ul className="horizontal-scroll-list">
                                    {item.newHiresList.map((newHireItem: any, newHireIndex: any) => (
                                      <li key={newHireIndex} className="horizontal-scroll-item">
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                          <img src={user} alt="" width={30} />
                                          <div style={{alignItems: 'center', textAlign: 'center', display: 'flex', fontSize: '12px', lineHeight: '12px'}}>
                                          {newHireItem.firstName} <br /> {newHireItem.lastName}
                                          </div>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : ""
                              
                              }
                            </div>
                          ))}
                        </div>
                      ) : (
                        "No Newly Hired Employee Today"
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              {/* </div> */}
            </div>
            </Tab>
            <Tab
              className="custom-calendar-tabs"
              eventKey="tab2"
              title={<img src={activeWeekTab !== 'tab1' ? activeCalendar : inactiveCalendar} alt="Tab 2" />}
            >
              <div style={{ height: '350px', overflowY: 'auto' }}>
                <CalendarComponent />
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
export default TeamCalendar;

