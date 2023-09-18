
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
    // Extract the month and year from the selected date
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
  const [selectedDate, setSelectedDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState(""); 
  const [ dataMonth, setDataMonth ] = useState<any>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const hasLeavesThisWeek = dataMonth.some((item) => item.leavesList && item.leavesList.length > 0);
  const hasHolidaysThisWeek = dataMonth.some((item) => item.holidaysList && item.holidaysList.length > 0);
  const hasBirthdaysThisWeek = dataMonth.some((item) => item.bdaysList && item.bdayList.length > 0);
  const hasNewHiresThisWeek = dataMonth.some((item) => item.newHiresList && item.newHiresList.length > 0);
  


  useEffect(() => {
    // Set the default selected month to the current month
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-based
    setSelectedMonth(currentMonth);
  }, []);

  useEffect(() => {
    // Update the calendar's displayed month whenever selectedMonth changes
    if (selectedMonth !== null) {
      const newDate = new Date(date);
      newDate.setMonth(selectedMonth - 1); // JavaScript months are 0-based
      newDate.setDate(1); // Set the day of the month to 1
      setDate(newDate);
    }
  }, [selectedMonth]);



    const handleMonthSelect = (month) => {
        setSelectedMonth(month);
        // Update the calendar's displayed month
        const newDate = new Date(date);
        newDate.setMonth(month - 1); // JavaScript months are 0-based
        newDate.setDate(1); // Set the day of the month to 1
        setDate(newDate);
    };

    const handleDateClick = (clickedDate) => {
        setSelectedDate(clickedDate);

        const dateClickedFrom = `${clickedDate.getFullYear()}-${(clickedDate.getMonth() + 1).toString().padStart(2, '0')}-${clickedDate.getDate().toString().padStart(2, '0')}`;
        const dateClickedTo = `${clickedDate.getFullYear()}-${(clickedDate.getMonth() + 1).toString().padStart(2, '0')}-${clickedDate.getDate().toString().padStart(2, '0')}`;
        setFromDate(dateClickedFrom);
        setToDate(dateClickedTo);
    
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
          //  if (body.data.length > 0 && body.data[0].leavesList && body.data[0].leavesList.length > 0) {
          //   setSelectedDate(new Date(body.data[0].leavesList[0].date));
          // }

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
  // useEffect(() => {
  //   const today = getCurrentDate(); 
  //   setFromDate(today);
  //   getData(today, today);
  // }, []);
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
  }, [])

  function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

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

  

  return (
    <div>
      {/* <Dropdown style={{ backgroundColor: '', position: 'absolute', fontSize: '5px' }} className="custom-calendar-dropdown">
        <Dropdown.Toggle id="month-selector" style={{ color: '' }} className="text-primary dropdown-text">
          {selectedMonth !== null ? new Date(date.getFullYear(), selectedMonth - 1, 1).toLocaleDateString('en-US', { month: 'long' }) : 'Select Month'}
        </Dropdown.Toggle>
        <Dropdown.Menu
          style={{
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
            <Dropdown.Item
              key={month}
              value={month}
              onClick={() => handleMonthSelect(month)}
              active={selectedMonth === month}
            >
              {new Date(date.getFullYear(), month - 1, 1).toLocaleDateString('en-US', { month: 'long' })}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown> */}
      {/* <div className="d-flex calendar-button " style={{ position: 'absolute', justifyContent: 'flex-end' }}>
        <div className="arrow-button left" style={{ marginRight: '25px' }}>
          <div
            onClick={() => {
              const newDate = new Date(date);
              newDate.setMonth(newDate.getMonth() - 1);
              setDate(newDate);
            }}
            className="triangle-left text-primary"
          ></div>
        </div>
        <div className="arrow-button right ">
          <div
            onClick={() => {
              const newDate = new Date(date);
              newDate.setMonth(newDate.getMonth() + 1);
              setDate(newDate);
            }}
            className="triangle-right text-primary"
          ></div>
        </div>
      </div> */}
      <div>
        <div className="calendar-container">
            <Calendar
            onChange={setDate}
            calendarType="US"
            value={date}
            className="custom-calendar"
            onClickDay={handleDateClick}
            tileContent={() => <div />} // Disable tile content for this example
            renderHeader={({ date }) => <CustomHeader date={date} />}
            />
        </div>
      </div>
      <div className="pt-12 mt-4">
        <Tabs defaultActiveKey="tab1" id="my-tabs" className="custom-tab-calendar pt-5  mt-4">
          <Tab className="custom-tabs"  eventKey="tab1" title="Holiday">
          {hasHolidaysThisWeek ? (
            dataMonth.map((item, index) => (
                <div key={index}>
                {item.holidaysList && item.holidaysList.length > 0 && (
                    <ul>
                    {item.holidaysList.map((holidayItem, holidayIndex) => (
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
          </Tab>
          <Tab  className="custom-tabs" eventKey="tab2" title="Birthday">
            {hasBirthdaysThisWeek ? (
              dataMonth.map((item, index) => (
                  <div key={index}>
                  {item.bdaysList && item.bdaysList.length > 0 && (
                      <ul>
                      {item.bdaysList.map((bdayItem, bdayIndex) => (
                          <li key={bdayIndex}>
                          {bdayItem.firstName} {bdayItem.lastName}
                          </li>
                      ))}
                      </ul>
                  )}
                  </div>
              ))
              ) : (
              <p>No Birthdays today</p>
              )}
          </Tab>
          <Tab  className="custom-tabs" eventKey="tab3" title="On Leave">
          {/* {hasLeavesThisWeek ? (
            <div className="">
              {dataMonth.map((item, index) => (
                <div key={index}>
                  {item.leavesList && item.leavesList.length > 0 ? (
                    <div className="horizontal-scroll-container mx-5" id="horizontal-scroll-container">
                      <ul className="horizontal-scroll-list">
                        {item.leavesList.map((leaveItem, leaveIndex) => (
                          <li key={leaveIndex} className="horizontal-scroll-item">
                            <img src={user} alt="" width={40} />
                            {leaveItem.firstName}
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
          )} */}

          {hasLeavesThisWeek ? (
            <div className="">
              {dataMonth.map((item, index) => (
                <div key={index}>
                  {item.leavesList && item.leavesList.length > 3 ? (
                  <div className="horizontal-scroll">
                    <div className="d-flex justify-content-start">
                      <button className="scroll-button left" style={{position:'absolute', paddingTop: '20px'}} onClick={scrollLeft}>
                        &#9664;
                      </button>
                    </div>
                    <div className="d-flex justify-content-end" >
                      <button className="scroll-button right" style={{position:'absolute', paddingTop: '18px'}} onClick={scrollRight} >
                        &#9654;
                      </button>
                    </div>
                    <div className="horizontal-scroll-container mx-5" id="horizontal-scroll-container">
                      <ul className="horizontal-scroll-list">

                        <div className="col-3  ">
                          {item.leavesList.map((leaveItem, leaveIndex) => (
                            <li key={leaveIndex} className="horizontal-scroll-item ma-5 pa-5"  style={{ textAlign: 'center', padding: '20px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <img src={user} alt="" width={40} />
                              {leaveItem.leaveName === "Actimai Angel Benefits" ? "(AAB)" : leaveItem.leaveName === "Vacation Leave" ? "(VL)" :  leaveItem.leaveName === "Sick Leave" ? "(SL)" : ""} {leaveItem.firstName} {leaveItem.lastName}
                              </div>
                              
                            </li>
                          ))}
                        </div>
                        
                      </ul>
                    </div>
                    
                    
                  </div>
                  ) : item.leavesList && item.leavesList.length <= 3 ? (
                    <div className="horizontal-scroll-container mx-5" id="horizontal-scroll-container">
                      <ul className="horizontal-scroll-list">
                        {item.leavesList.map((leaveItem, leaveIndex) => (
                          <li key={leaveIndex} className="horizontal-scroll-item">
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <img src={user} alt="" width={40} />
                              {leaveItem.leaveName === "Actimai Angel Benefits" ? "(AAB)" : leaveItem.leaveName === "Vacation Leave" ? "(VL)" :  leaveItem.leaveName === "Sick Leave" ? "(SL)" : ""} {leaveItem.firstName} {leaveItem.lastName}
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

          </Tab>
          <Tab  className="custom-tabs" eventKey="tab4" title="New Hire">
          {hasNewHiresThisWeek ? (
            dataMonth.map((item, index) => (
                <div key={index}>
                {item.newHiresList && item.newHiresList.length > 0 && (
                    <ul>
                    {item.newHiresList.map((newHireItem, newHireIndex) => (
                        <li key={newHireIndex}>
                        {newHireItem.firstName} {newHireItem.lastName}
                        </li>
                    ))}
                    </ul>
                )}
                </div>
            ))
            ) : (
            "No newly hired Employee today"
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


  const options = {
    timeZone: 'Asia/Manila',
    month: 'long',
    day: 'numeric',
  };

  const hasLeavesThisWeek = dataWeek.some((item) => item.leavesList && item.leavesList.length > 0);
  const hasHolidaysThisWeek = dataWeek.some((item) => item.holidaysList && item.holidaysList.length > 0);
  const hasBirthdaysThisWeek = dataWeek.some((item) => item.bdaysList && item.bdayList.length > 0);
  const hasNewHiresThisWeek = dataWeek.some((item) => item.newHiresList && item.newHiresList.length > 0);
  
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
  const changeWeek = (increment) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + increment * 7);
    setDate(newDate);
  };

  const getWeekDays = (currentDate) => {
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

  const handleDateClick = (clickedDate) => {
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

  const getWeekNumber = (inputDate) => {
    const date = new Date(inputDate);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    const weekNumber = 1 + Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 4).getTime()) / 86400000 / 7);
    return weekNumber;
  };

  const getWeekNumbersForYear = (year) => {
    const weekNumbers = [];
    const startDate = new Date(year, 0, 1);

    while (startDate.getFullYear() === year) {
      weekNumbers.push(getWeekNumber(startDate));
      startDate.setDate(startDate.getDate() + 7);
    }

    return weekNumbers;
  };

  const weekNumbersForYear = getWeekNumbersForYear(year);

  const formatWeekLabel = (weekNumber) => {
    const firstDayOfWeek = new Date(year, 0, 1); 
    const daysToAdd = (weekNumber - 1) * 7;
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() + daysToAdd);

    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

    const startDateString = firstDayOfWeek.toLocaleDateString("en-US", { month: "long", day: "numeric" });
    const endDateString = lastDayOfWeek.toLocaleDateString("en-US", { month: "long", day: "numeric" });

    return `Week ${weekNumber} ${startDateString} - ${endDateString}`;
  };

  const handleWeekSelect = (weekNumber) => {
    setSelectedWeek(weekNumber);
    setDate(getStartDateOfWeek(weekNumber));

    const startDate = getStartDateOfWeek(weekNumber);
    };

  const getStartDateOfWeek = (weekNumber) => {
    const firstDayOfWeek = new Date(year, 0, 1); 
    const daysToAdd = (weekNumber - 1) * 7;
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() + daysToAdd);
    return firstDayOfWeek;
  };
  const formatWeekLabelForDates = (startDate, endDate) => {
    const startDateFormat = startDate.toLocaleDateString("en-US", options);
    const endDateFormat = endDate.toLocaleDateString("en-US", options);
    return `${startDateFormat} - ${endDateFormat}`;
  };
  

   const handleWeekTabSelect = (selectedTab) => {
    setActiveWeekTab(selectedTab);
  };
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
  // useEffect(() => {
  //   const today = getCurrentDate(); 
  //   setFromDate(today);
  //   getData(today, today);
  // }, []);

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
          justify-content-end"
          activeKey={activeWeekTab}
            onSelect={handleWeekTabSelect}
          >
          <Tab
                className="custom-calendar-tabs"
                eventKey="tab1"
                title={<img src={activeWeekTab === 'tab1' ? activeWeek : inactiveWeek} alt="Tab 1" />}
            >
                <div style={{ height: '380px', overflowY: 'auto' }}>
                    <div className="row d-flex">
                    <div className="col-1">
                        <div className="arrow-button left">
                          <div onClick={() => changeWeek(-1)} className="triangle-left text-primary"></div>
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
                    <div className="col-1">
                        <div className="arrow-button right">
                            <div onClick={() => changeWeek(1)} className="triangle-right text-primary"></div>
                        </div>
                    </div>
                </div>

{/* leaves  */} 
                <div className="pt-4">
                <Accordion defaultActiveKey="0" style={{border: 'none'}} >
                    <Accordion.Item style={{paddingBottom: '10px'}} className="holiday-accordion"   eventKey="0">
                        <Accordion.Header className="accordion-custom-header" >Holidays</Accordion.Header>
                        <Accordion.Body style={{borderRadius: '10px'}}>
                        {hasHolidaysThisWeek ? (
                            dataWeek.map((item, index) => (
                                <div key={index}>
                                {item.holidaysList && item.holidaysList.length > 0 && (
                                    <ul>
                                    {item.holidaysList.map((holidayItem, holidayIndex) => (
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
                    <Accordion.Item style={{paddingBottom: '10px'}} eventKey="1">
                        <Accordion.Header className="accordion-birthday-header">Birthdays</Accordion.Header>
                        <Accordion.Body>
                        {hasBirthdaysThisWeek ? (
                            dataWeek.map((item, index) => (
                                <div key={index}>
                                {item.bdaysList && item.bdaysList.length > 0 && (
                                    <ul>
                                    {item.bdaysList.map((bdayItem, bdayIndex) => (
                                        <li key={bdayIndex}>
                                        {bdayItem.firstName} {bdayItem.lastName}
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
                    <Accordion.Item style={{paddingBottom: '10px'}} eventKey="2">
                        <Accordion.Header className="accordion-leave-header">
                            <div style={{ textAlign: 'left' }}>
                              Who's Out
                            </div>
                            <div className="col-6" style={{ textAlign: 'right'}}>
                              {hasLeavesThisWeek ? (
                                dataWeek.map((item, index) => (
                                    <div key={index}>
                                    {item.leavesList && item.leavesList.length > 0 && (
                                        <ul style={{ listStyle: 'none', paddingLeft: '10px', margin: 0 }}>
                                        {item.leavesList.slice(0, 2).map((leaveItem, leaveIndex) => (
                                          <li key={leaveIndex} style={{ display: 'inline-block', marginRight: '5px' }}>
                                            <img src={user} alt="" width={40} />
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
                            {dataWeek.reduce((total, item) => total + (item.leavesList ? item.leavesList.length : 0), 0) > 2 && (
                                  <div
                                      style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'black',
                                        fontSize: '15px',
                                        fontWeight: 'bold',
                                        marginBottom: '5px'
                                      }}
                                    >
                                      +{dataWeek.reduce((total, item) => total + (item.leavesList ? item.leavesList.length : 0), 0) - 2}
                                    </div>
                                )} 
                            
                            


                              
                        </Accordion.Header>
                        <Accordion.Body>
                        {hasLeavesThisWeek ? (
                          <div className="">
                            {dataWeek.map((item, index) => (
                              <div key={index}>
                                {item.leavesList && item.leavesList.length > 3 ? (
                                <div className="horizontal-scroll">
                                  <div className="d-flex justify-content-start">
                                    <button className="scroll-button left" style={{position:'absolute', paddingTop: '20px'}} onClick={scrollLeft}>
                                      &#9664;
                                    </button>
                                  </div>
                                  <div className="d-flex justify-content-end" >
                                    <button className="scroll-button right" style={{position:'absolute', paddingTop: '18px'}} onClick={scrollRight} >
                                      &#9654;
                                    </button>
                                  </div>
                                  <div className="horizontal-scroll-container mx-5" id="horizontal-scroll-container">
                                    <ul className="horizontal-scroll-list">

                                      <div className="col-3  ">
                                        {item.leavesList.map((leaveItem, leaveIndex) => (
                                          <li key={leaveIndex} className="horizontal-scroll-item ma-5 pa-5"  style={{ textAlign: 'center', padding: '20px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <img src={user} alt="" width={40} />
                                            {leaveItem.leaveName === "Actimai Angel Benefits" ? "(AAB)" : leaveItem.leaveName === "Vacation Leave" ? "(VL)" :  leaveItem.leaveName === "Sick Leave" ? "(SL)" : ""} {leaveItem.firstName} {leaveItem.lastName}
                                            </div>
                                            
                                          </li>
                                        ))}
                                      </div>
                                      
                                    </ul>
                                  </div>
                                 
                                 
                                </div>
                                ) : item.leavesList && item.leavesList.length <= 3 ? (
                                  <div className="horizontal-scroll-container mx-5" id="horizontal-scroll-container">
                                    <ul className="horizontal-scroll-list">
                                      {item.leavesList.map((leaveItem, leaveIndex) => (
                                        <li key={leaveIndex} className="horizontal-scroll-item">
                                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <img src={user} alt="" width={40} />
                                            {leaveItem.leaveName === "Actimai Angel Benefits" ? "(AAB)" : leaveItem.leaveName === "Vacation Leave" ? "(VL)" :  leaveItem.leaveName === "Sick Leave" ? "(SL)" : ""} {leaveItem.firstName} {leaveItem.lastName}
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
                    <Accordion.Item style={{paddingBottom: '10px'}} eventKey="3">
                        <Accordion.Header className="accordion-hire-header">New Hires
                          
                        </Accordion.Header>
                        <Accordion.Body>
                        {hasNewHiresThisWeek ? (
                            dataWeek.map((item, index) => (
                                <div key={index}>
                                {item.newHiresList && item.newHiresList.length > 0 && (
                                    <ul>
                                    {item.newHiresList.map((newHireItem, newHireIndex) => (
                                        <li key={newHireIndex}>
                                        <img src={user} alt="" width={40} />
                                        {newHireItem.firstName} {newHireItem.lastName}
                                        </li>
                                    ))}
                                    </ul>
                                )}
                                </div>
                            ))
                            ) : (
                            "No newly hired Employee today"
                            )}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                </div>
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

