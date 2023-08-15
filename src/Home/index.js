import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <div className="mainH-container">
    <Header />
    <div className="subH-container">
      <h1>Find the Job that fits your life</h1>
      <p>Millions of people searching for jobs,salary information.</p>
      <Link to="/jobs">
        <button className="btn-home-styles" type="button">
          Find Jobs
        </button>
      </Link>
    </div>
  </div>
)

export default Home
