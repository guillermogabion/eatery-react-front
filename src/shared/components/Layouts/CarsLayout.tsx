import { Outlet } from 'react-router-dom'

const CarsLayout = () => {

    return (
      <>
        <div className="root-main">
          <div>This is car layout</div>
            <Outlet context={{test2 : 'test2 '}} />  
          <div>Cars Footer Layout</div>
        </div>
      </>
    )
  }
  
  export default CarsLayout
  