import { useEffect, useRef, useState } from 'react'
// import { useOutletContext } from 'react-router-dom'
import { RequestAPI, Api } from '../api';

const Home = () => {

    const [ count, setCount ] = useState(0)
    const buttonRef = useRef(null)
      
    const handleIncrement = () => setCount(count + 1)   
    useEffect(() => {
        console.log(process.env)
    
        RequestAPI.getRequest(
          `${Api.Test}`,
          "",
          {},
          {},
          async (res: any) => {
            const { status, body = { data: {}, error: {} } }: any = res;
      
            if (status === 200) {
              const data = body.data;
              console.log(data)
            }
          }
        );
      }, []);

    useEffect(()=>{
        // if(buttonRef.current) {
        //     setTimeout(()=> {
        //         buttonRef.current.style.display = "none"
        //     }, 3000)
        // }
    }, [])
    return (
        <>
            <div>
                This is Home Page
                Count : {count}
                <button ref={buttonRef} onClick={handleIncrement}>Add</button>
            </div>
        </>
  )
}

export default Home
