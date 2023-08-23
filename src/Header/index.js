import Cookies from 'js-cookie'
import {withRouter, Link} from 'react-router-dom'
import './index.css'

const Header = props => {
  const handleLogOutClick = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <ul className="mainHeader-container">
      <li>
        <Link to="/" className="link-styles">
          <img
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          />
        </Link>
      </li>
      <li className="middle-h-container">
        <Link to="/" className="link-styles">
          <p style={{color: 'black', cursor: 'pointer'}}>Home</p>
        </Link>
        <Link className="link-styles" to="/jobs">
          <p style={{color: 'black', cursor: 'pointer'}}>Jobs</p>
        </Link>
      </li>
      <li>
        <button
          className="btn-head-styles"
          type="button"
          onClick={handleLogOutClick}
        >
          Logout
        </button>
      </li>
    </ul>
  )
}
export default withRouter(Header)
