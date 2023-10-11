import { useState, useEffect } from "react";
import { RequestAPI, Api } from "../api";
import {  Tabs, Tab } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux"
import { empStat } from "../assets/images";
import { Pie } from 'react-chartjs-2';



const Statistics = () => {
    const dispatch = useDispatch()
    const userData = useSelector((state: any) => state.rootReducer.userData)
    return (
        <div className="time-card-width">
             <div className="card-header">
                <span className="">Statistics</span>
            </div>
            <div className="time-card-body">
                <Tabs defaultActiveKey="tab1" id="my-tabs" className="custom-tab custom-stat justify-content-center">
                    <Tab id="dashboardstatistic_tab1" className="custom-tabs" eventKey="tab1" title="Employee Status">
                        <EmployeeStatus />

                    </Tab>
                    <Tab id="dashboardstatistic_tab2" className="custom-tabs fs-sm-4" eventKey="tab2" title="Gender">
                       <Gender />
                    </Tab>
                    <Tab id="dashboardstatistic_tab3" className="custom-tabs fs-sm-4" eventKey="tab3" title="Employment Level">
                    </Tab>
                </Tabs>
            </div>
        </div>
       
    )
}

const EmployeeStatus = () => {
    const [headCount, setHeadCount ] = useState([])
    const [statusCounts, setStatusCounts] = useState({});
    const [squadStatusCounts, setSquadStatusCounts] = useState({});

    useEffect (() => {
        RequestAPI.getRequest(
            `${Api.headCount}`,
            "",
            {},
            {},
            async(res: any) => {
                const { status, body = { data: {}, error: {}}} : any = res
                if ( status === 200 && body && body.data) {
                    setHeadCount(body.data)

                    const counts = body.data.reduce((acc, item) => {
                        const squad = item.squad;
                        const status = item.status; 
                        if (!acc[squad]) {
                            acc[squad] = { Regular: 0, Probationary: 0 };
                        }

                        acc[squad][status]++;
                        return acc;
                    }, {});
                    setSquadStatusCounts(counts);

                    const countTotal = body.data.reduce((acc, item) => {
                        const status = item.status; 
                        acc[status] = (acc[status] || 0) + 1;
                        return acc;
                    }, {});
                    setStatusCounts(countTotal);
                    
                }
            }
        )

        

    }, [])

    const totalNonSquadCount = Object.entries(squadStatusCounts)
    .filter(([squad]) => !squad.includes('Squad'))
    .reduce((acc, [, statusCounts]) => acc + statusCounts.Probationary, 0);
    
    const totalNonSquadCountRegular = Object.entries(squadStatusCounts)
    .filter(([squad]) => !squad.includes('Squad'))
    .reduce((acc, [, statusCounts]) => acc + statusCounts.Regular, 0);

    let nonSquadDisplayed = false;

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    const squadColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#f0f0f0'];

    const nonSquadColor = ['grey'];

   
      

    return (
        <div className="row flex-wrap p-0 m-0 statistic-tab" >
            {/* <Doughnut data={maleFemaleData} /> */}
            <div className="col-8">
                <div className="d-flex justify-content-center align-items-center">
                    <img src={empStat} alt="" width={170}/>

                </div>

                <div className="row d-flex pt-4">
                    <div className="row" >

                        
                    <div style={{ display: 'flex' }}>
                        {Object.entries(squadStatusCounts).map(([squad, statusCounts], index) => (
                            <div
                            key={squad}
                            style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                // borderRadius: `${
                                //   index === 0 ? '8px 0 0 8px' : index === squadStatusCounts.length - 1 ? '8px 8px 0 0' : '0'
                                // }`,
                              }}
                            >
                            {squad.includes('Squad') ? (
                                <>
                                <div
                                    style={{
                                    backgroundColor: squadColors[index % squadColors.length],
                                    width: `${statusCounts.Probationary * 15}px`,
                                    height: '20px',
                                    }}
                                />
                                </>
                            ) : !nonSquadDisplayed && (
                                <>
                                <div
                                    style={{
                                    backgroundColor: nonSquadColor,
                                    width: `${totalNonSquadCount * 15}px`,
                                    height: '20px',
                                    borderRadius: '0 8px 8px 0',

                                    }}
                                />
                                </>
                            )}
                            {squad.includes('Squad') || (nonSquadDisplayed = true)}
                            </div>
                        ))}
                        {nonSquadDisplayed = false}

                    </div>

                    {Object.entries(squadStatusCounts).map(([squad, statusCounts], index) => (
                       <div
                        key={squad}
                        className="col-6 p-1"
                        style={{ whiteSpace: 'nowrap' }}
                        >
                        {squad.includes('Squad') ? (
                            <>
                            <div style={{  backgroundColor: squadColors[index % squadColors.length], borderRadius: '50%', width: '20px', height: '20px', marginRight: '0' }}>
                                <span className="pl-6 pb-1">
                                    {`${squad.replace(/Squad/g, '')}- ${statusCounts.Probationary}`}
                                </span>
                            </div>
                            </>
                        ) : !nonSquadDisplayed && (
                            <>
                            <div style={{ backgroundColor: nonSquadColor, borderRadius: '50%', width: '20px', height: '20px', marginRight: '0' }}>
                                <span className="pl-6 pb-1">
                                    {`Non-Squad - ${totalNonSquadCount}`}
                                </span>
                            </div>
                            </>
                        )}
                        {squad.includes('Squad') || (nonSquadDisplayed = true)}
                        </div>
                        ))}
                        {nonSquadDisplayed = false}
                    </div>
                </div>
                <div className="row d-flex">
                    <div className="row">
                    <div style={{ display: 'flex' }}>
                        {Object.entries(squadStatusCounts).map(([squad, statusCounts], index) => (
                            <div
                            key={squad}
                            style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                              }}
                            >
                            {squad.includes('Squad') ? (
                                <>
                                <div
                                    style={{
                                    backgroundColor: squadColors[index % squadColors.length],
                                    width: `${statusCounts.Regular * 15}px`,
                                    height: '20px',
                                    }}
                                />
                                </>
                            ) : !nonSquadDisplayed && (
                                <>
                                <div
                                    style={{
                                    backgroundColor: nonSquadColor,
                                    width: `${totalNonSquadCountRegular * 15}px`,
                                    height: '20px',
                                    borderRadius: '0 8px 8px 0',

                                    }}
                                />
                                </>
                            )}
                            {squad.includes('Squad') || (nonSquadDisplayed = true)}
                            </div>
                        ))}
                        {nonSquadDisplayed = false}

                        </div>
                       
                        {Object.entries(squadStatusCounts).map(([squad, statusCounts], index) => (
                        <div
                            key={squad}
                            className="col-6 p-1"
                            style={{ whiteSpace: 'nowrap' }}
                            >
                            {squad.includes('Squad') ? (
                                <>
                                <div style={{  backgroundColor: squadColors[index % squadColors.length], borderRadius: '50%', width: '20px', height: '20px', marginRight: '0' }}>
                                    <span className="pl-6 pb-1">
                                        {`${squad.replace(/Squad/g, '')}- ${statusCounts.Regular}`}
                                    </span>
                                </div>
                                </>
                            ) : !nonSquadDisplayed && (
                                <>
                                <div style={{ backgroundColor: nonSquadColor, borderRadius: '50%', width: '20px', height: '20px', marginRight: '0' }}>
                                    <span className="pl-6 pb-1">
                                        {`Non-Squad - ${totalNonSquadCountRegular}`}
                                    </span>
                                </div>
                                </>
                            )}
                            {squad.includes('Squad') || (nonSquadDisplayed = true)}
                        </div>
                        ))}
                        {nonSquadDisplayed = false}
                    </div>
                </div>
               
            </div>
            <div className="col-4 align-items-center text-center">
                <div className="text-bold fs-3 text-primary text-center d-flex align-items-center flex-column">
                    {headCount.length}
                    <div className="" style={{fontSize: '12px'}}>
                    Total <br />
                    Head Count
                </div>
                <div className="pt-5">
                    {Object.entries(statusCounts).map(([status, count]) => (
                        <div key={status}>
                            {`${status == 'Probationary' ? count : ""}`}
                        </div>
                    ))}
                    <div className="text-bold text-primary text-center d-flex align-items-center flex-column">
                        <span  style={{fontSize: '12px'}}>Under<br />Probation</span>
                    </div>
                </div>
                <div className="regular-employee-text">
                    {Object.entries(statusCounts).map(([status, count]) => (
                        <div key={status}>
                            {`${status == 'Regular' ? count : ""}`}
                        </div>
                    ))}
                    <div className="text-bold text-primary text-center d-flex align-items-center flex-column">
                        <span  style={{fontSize: '12px'}}>Regular<br />Employee</span>
                    </div>
                </div>

            </div>
                
                

               
            </div>
        </div>
    )

}

const Gender = () => {
    const [headCount, setHeadCount] = useState([]);
    const [squadStatusCounts, setSquadStatusCounts] = useState({});
    const [statusCounts, setStatusCounts] = useState({});
  
    useEffect(() => {
      RequestAPI.getRequest(
        `${Api.headCount}`,
        '',
        {},
        {},
        async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res;
          if (status === 200 && body && body.data) {
            setHeadCount(body.data);
  
            const counts = body.data.reduce((acc, item) => {
              const squad = item.squad;
              const status = item.gender;
  
              if (!acc[squad]) {
                acc[squad] = { MALE: 0, FEMALE: 0 };
              }
  
              acc[squad][status]++;
              return acc;
            }, {});
            setSquadStatusCounts(counts);
  
            const countTotal = body.data.reduce((acc, item) => {
              const status = item.gender; 
              acc[status] = (acc[status] || 0) + 1;
              return acc;
            }, {});
            setStatusCounts(countTotal);
          }
        }
      );
    }, []);
    const totalNonSquadCount = Object.entries(squadStatusCounts)
    .filter(([squad]) => !squad.includes('Squad'))
    .reduce((acc, [, statusCounts]) => acc + statusCounts.MALE, 0);
    
    const totalNonSquadCountFemale = Object.entries(squadStatusCounts)
    .filter(([squad]) => !squad.includes('Squad'))
    .reduce((acc, [, statusCounts]) => acc + statusCounts.FEMALE, 0);

    let nonSquadDisplayed = false;
  
    const maleFemaleData = {
      labels: ['Male', 'Female'],
      datasets: [
        {
          data: [statusCounts.MALE || 0, statusCounts.FEMALE || 0],
          backgroundColor: ['#36A2EB', '#FF6384'],
          hoverBackgroundColor: ['#36A2EB', '#FF6384'],
        },
      ],
    };
    const options = {
        maintainAspectRatio: false,
        responsive: true,
        width: 400, 
        height: 400,
        plugins: {
            legend: {
                display: false,
            },
          },
    };
    const squadColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#f0f0f0'];

    const nonSquadColor = ['grey'];
    
  
    return (
      <div>
        <div className="row d-flex">
            <div className="col-8">
                <div className="pt-4 text-center d-flex justify-content-center" style={{ margin: 'auto',width: '120px', height: '120px' }}>
                    <Pie data={maleFemaleData} options={options} />
                </div>
                <div className="row d-flex pl-4 pt-2">
                <div style={{ display: 'flex' }}>
                        {Object.entries(squadStatusCounts).map(([squad, statusCounts], index) => (
                            <div
                            key={squad}
                            style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                // borderRadius: `${
                                //   index === 0 ? '8px 0 0 8px' : index === squadStatusCounts.length - 1 ? '8px 8px 0 0' : '0'
                                // }`,
                              }}
                            >
                            {squad.includes('Squad') ? (
                                <>
                                <div
                                    style={{
                                    backgroundColor: squadColors[index % squadColors.length],
                                    width: `${statusCounts.MALE * 15}px`,
                                    height: '20px',
                                    }}
                                />
                                </>
                            ) : !nonSquadDisplayed && (
                                <>
                                <div
                                    style={{
                                    backgroundColor: nonSquadColor,
                                    width: `${totalNonSquadCount * 15}px`,
                                    height: '20px',
                                    borderRadius: '0 8px 8px 0',

                                    }}
                                />
                                </>
                            )}
                            {squad.includes('Squad') || (nonSquadDisplayed = true)}
                            </div>
                        ))}
                        {nonSquadDisplayed = false}

                    </div>
                    {Object.entries(squadStatusCounts).map(([squad, statusCounts], index) => (
                        <div
                        key={squad}
                        className="col-6 p-1"
                        style={{ whiteSpace: 'nowrap' }}
                        >
                        {squad.includes('Squad') ? (
                            <>
                            <div style={{  backgroundColor: squadColors[index % squadColors.length], borderRadius: '50%', width: '20px', height: '20px', marginRight: '0' }}>
                                <span className="pl-6 pb-1">
                                    {`${squad.replace(/Squad/g, '')}- ${statusCounts.MALE}`}
                                </span>
                            </div>
                            </>
                        ) : !nonSquadDisplayed && (
                            <>
                            <div style={{ backgroundColor: nonSquadColor, borderRadius: '50%', width: '20px', height: '20px', marginRight: '0' }}>
                                <span className="pl-6 pb-1">
                                    {`Non-Squad - ${totalNonSquadCount}`}
                                </span>
                            </div>
                            </>
                        )}
                        {squad.includes('Squad') || (nonSquadDisplayed = true)}
                        </div>
                    ))}
                    {nonSquadDisplayed = false}
                </div>
                <div className="row d-flex pl-4"><div style={{ display: 'flex' }}>
                        {Object.entries(squadStatusCounts).map(([squad, statusCounts], index) => (
                            <div
                            key={squad}
                            style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                // borderRadius: `${
                                //   index === 0 ? '8px 0 0 8px' : index === squadStatusCounts.length - 1 ? '8px 8px 0 0' : '0'
                                // }`,
                              }}
                            >
                            {squad.includes('Squad') ? (
                                <>
                                <div
                                    style={{
                                    backgroundColor: squadColors[index % squadColors.length],
                                    width: `${statusCounts.FEMALE * 15}px`,
                                    height: '20px',
                                    }}
                                />
                                </>
                            ) : !nonSquadDisplayed && (
                                <>
                                <div
                                    style={{
                                    backgroundColor: nonSquadColor,
                                    width: `${totalNonSquadCountFemale * 15}px`,
                                    height: '20px',
                                    // borderRadius: '0 8px 8px 0',

                                    }}
                                />
                                </>
                            )}
                            {squad.includes('Squad') || (nonSquadDisplayed = true)}
                            </div>
                        ))}
                        {nonSquadDisplayed = false}

                    </div>
                    {Object.entries(squadStatusCounts).map(([squad, statusCounts], index) => (
                        <div
                        key={squad}
                        className="col-6 p-1"
                        style={{ whiteSpace: 'nowrap' }}
                        >
                        {squad.includes('Squad') ? (
                            <>
                            <div style={{  backgroundColor: squadColors[index % squadColors.length], borderRadius: '50%', width: '20px', height: '20px', marginRight: '0' }}>
                                <span className="pl-6 pb-1">
                                    {`${squad.replace(/Squad/g, '')}- ${statusCounts.FEMALE}`}
                                </span>
                            </div>
                            </>
                        ) : !nonSquadDisplayed && (
                            <>
                            <div style={{ backgroundColor: nonSquadColor, borderRadius: '50%', width: '20px', height: '20px', marginRight: '0' }}>
                                <span className="pl-6 pb-1">
                                    {`Non-Squad - ${totalNonSquadCountFemale}`}
                                </span>
                            </div>
                            </>
                        )}
                        {squad.includes('Squad') || (nonSquadDisplayed = true)}
                        </div>
                    ))}
                    {nonSquadDisplayed = false}
                </div>
            </div>
            <div className="col-4">
                <div className="text-primary fs-1 pt-1 text-center">
                    <span className="fs-3">{(parseFloat((statusCounts.MALE / statusCounts.FEMALE) * 100).toFixed(2))}</span>
                    <div className="text-bold text-primary d-flex text-center flex-column">
                        <span  style={{fontSize: '15px'}}>Gender Ratio</span>
                    </div>
                </div>
                <div className="text-primary fs-1 pt-8 text-center gender-space">
                    <span className="fs-3">{statusCounts.MALE}</span>
                    <div className="text-bold text-primary d-flex text-center flex-column">
                        <span  style={{fontSize: '15px'}}>Male</span>
                    </div>
                </div>
                <div className="text-primary fs-1 pt-4 text-center gender-space">
                    <span className="fs-3">{statusCounts.FEMALE}</span>
                    <div className="text-bold text-primary d-flex text-center flex-column">
                        <span  style={{fontSize: '15px'}}>Female</span>
                    </div>
                </div>
                
            </div>
        </div>
       
       
      </div>
    );
  };




export default Statistics