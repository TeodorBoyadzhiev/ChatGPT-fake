import { Link } from 'react-router-dom'
import './landingpage.css'

const Homepage = () => {
  return (
    <div className='homepage'>
      <Link to="/dashboard">Dashboard</Link>
    </div>
  )
}

export default Homepage