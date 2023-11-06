
import {Link, useOutletContext} from 'react-router-dom'

const Cars = () => {

    const {test, test2} = useOutletContext()
    return (
      <>
          <div style={{display: 'grid'}}>
              <Link to="/cars/add">Add Car </Link>
              <Link to="/cars/1">Car 1</Link>
              <Link to="/cars/2">Car 2</Link>
              <Link to="/cars/3">Car 3</Link>
              <Link to="/cars/4">Car 4</Link>
              context: { test2 }
          </div>
      </>
    )
  }
  
  export default Cars
  