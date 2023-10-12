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

const CompensationDepartment = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.rootReducer.userData);
  const [compensation, setCompensation] = useState<any>([]);

  useEffect(() => {
    RequestAPI.getRequest(
      `${Api.compensationByDepartment}`,
      "",
      {},
      {},
      async (res: any) => {
        const { status, body = { data: {}, error: {} } }: any = res;
        if (status === 200 && body && body.data) {
            setCompensation(body.data);
        } else {
          // Handle the error case if needed
        }
      }
    );
  }, []);

const labels = compensation?.compDeptList?.map((dept: any) => dept.departmentName) || [];
const dataValues = compensation?.compDeptList?.map((dept: any) => dept.compensation) || [];
const totalCompensation = compensation.totalCompensation || 0; 

  const data = {
    labels: labels,
    datasets: [
      {
        backgroundColor: labels.map(() => generateRandomColor()),
        hoverBackgroundColor: 'rgba(75,192,192,0.4)',
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
        <span className="">Compensation By Department</span>
      </div>
      <div className="time-card-body row">
        <Bar id={"compensationdepartment_data_bar"} data={data} options={options} className="pb-0 m-0" style={{ maxHeight: '600px' }} />
        <div className="p-4">
            <div className="row d-flex">
                {labels.map((label, index) => (
                    <div key={index} className="col-6">
                        <div className="d-flex align-items-center">
                            <div id={"compensationdepartment_data_label"} style={{ borderRadius: '50%', width: '20px', height: '20px', backgroundColor: data.datasets[0].backgroundColor[index], marginRight: '5px' }}></div>
                            <div>{Utility.removeUnderscore(label)}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className="row">
            <div className="col-12 d-flex m-2" style={{ alignItems: 'center' }}>
                <div>Total Compensation:</div>
                <div id={"compensationdepartment_data_label"}> {totalCompensation.toLocaleString()}</div>
            </div>
        </div>
      </div>
     
    </div>
  );
};

export default CompensationDepartment;
