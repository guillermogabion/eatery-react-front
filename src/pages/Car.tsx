import { useParams } from 'react-router-dom'


const CarPage = () => {
    const {id} = useParams()
    return (
      <>
          <div>
              This is CarPage with an id of { id  }
          </div>
      </>
    )
  }
  
  export default CarPage
  