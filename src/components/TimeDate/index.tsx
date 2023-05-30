import {  useState,useEffect } from "react"
import moment from "moment"

const TimeDate = (props: any) => {
    const { textColor } = props
    const [currentTime, setCurrentTime] = useState(moment().format("hh:mm:ss A"));
    const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MMMM-DD"));

    useEffect(() => {
        const intervalId = setInterval(() => {
        setCurrentTime(moment().format("hh:mm:ss A"));
        setCurrentDate(moment().format("MMMM DD, YYYY"));
        }, 1000);
        
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="p-0" style={{textAlign:'right',color: textColor ? textColor: 'black'}}>
            <h6>Today is</h6>
            <h6>{currentDate}</h6>
            <h3 style={{fontWeight: 'bolder'}}>{currentTime}</h3>
        </div>
    )
}

export default TimeDate
