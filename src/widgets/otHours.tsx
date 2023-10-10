import React, { useState, useEffect } from "react";
import { RequestAPI, Api } from "../api";
import { Button, Tabs, Tab } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import { Utility } from "../utils"

Chart.register(...registerables);

const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const OtHours = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.rootReducer.userData);
  const [otHours, setOtHours] = useState<any>([]);
  const [dateFromState, setDateFrom] = useState("");
  const [dateToState, setDateTo] = useState("");

  const getDefaultDate = () => {
    const currentYear = new Date().getFullYear();
    const defaultDateFrom = `${currentYear}-01-01`;
    const defaultDateTo = `${currentYear}-12-31`;
    return { defaultDateFrom, defaultDateTo };
  };

  const { defaultDateFrom, defaultDateTo } = getDefaultDate();

  const getData = async (dateFrom, dateTo) => {
    try {
      const response = await RequestAPI.getRequest(
        `${Api.departmentOtHours}`,
        "",
        { dateFrom: defaultDateFrom, dateTo: defaultDateTo },
        {},
        async (res: any) => {
          const { status, body = { data: {}, error: {} } }: any = res;
          if (status === 200 && body && body.data) {
            setOtHours(body.data);
          }
        }
      );
    } catch (error) {
      console.error("Error Request", error);
    }
  };

  useEffect(() => {
    getData(dateFromState, dateToState);
  }, [dateFromState, dateToState]);

  // const labels = otHours.map((dept: any) => dept.departmentName);
  // const dataValues = otHours.map((dept: any) => dept.otHours);

  const labels = otHours?.otDeptList?.map((dept: any) => dept.departmentName) || [];
  const dataValues = otHours?.otDeptList?.map((dept: any) => dept.otHours) || [];
  const totalOt = otHours.totalOt || 0;

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Overtime Hours',
        backgroundColor: labels.map(() => generateRandomColor()),
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.4)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: dataValues,
      },
    ],
  };
  const options = {
    scales: {
      x: {
        type: 'category',
        labels: labels,
        display: false,
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
          display: false,
      },
    },
  };

  return (
    <div className="time-card-width">
      <div className="card-header">
        <span className="">Overtime Hours By Department</span>
      </div>
      <div className="time-card-body row">
        <Bar data={data} options={options} className="pb-0 m-0" style={{ maxHeight: '600px' }} />
        <div className="p-4">
          <div className="row d-flex">
            {labels.map((label, index) => (
              <div key={index} className="col-6">
                <div className="d-flex align-items-center">
                  <div style={{ borderRadius: '50%', width: '20px', height: '20px', backgroundColor: data.datasets[0].backgroundColor[index], marginRight: '5px' }}></div>
                  {Utility.removeUnderscore(label)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="row">
          <div className="col-12 d-flex m-2" style={{ alignItems: 'center' }}>
            <div>Total Overtime:</div>
            <div>{totalOt.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>  
  );
};

export default OtHours;
