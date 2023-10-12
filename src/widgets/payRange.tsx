import React, { useState, useEffect } from "react";
import { RequestAPI, Api } from "../api";
import { Button, Tabs, Tab } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const PayRange = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.rootReducer.userData);
  const [payRange, setPayRange] = useState<any>([]);

  useEffect(() => {
    RequestAPI.getRequest(
      `${Api.employeePayRange}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res;
        if (status === 200 && body && body.data) {
          setPayRange(body.data);
        } else {
          // Handle the error case if needed
        }
      }
    );
  }, []);

  const labels = Object.keys(payRange);
  const dataValues = Object.values(payRange);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Number of Employees',
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
        display: false, // Set this to false to hide x-axis labels
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
        <span className="">Employee Statistics by Pay Range</span>
      </div>
      <div className="time-card-body row">
        <Bar id={"payrange_data_bar"} data={data} options={options} className="pb-0 m-0" style={{ maxHeight: '600px' }} />
        <div style={{ width: '100%', height: '50px' }}>
            <div className="row d-flex">
                {labels.map((label, index) => (
                  <div key={index} className="col-6">
                    <div className="d-flex align-items-center">
                      <div id={"othours_data_label"} style={{ borderRadius: '50%', width: '20px', height: '20px', backgroundColor: data.datasets[0].backgroundColor[index], marginRight: '5px' }}></div>
                      {label}
                    </div>
                  </div>
                ))}
            </div>
        </div>

      </div>
     
    </div>
  );
};

export default PayRange;
