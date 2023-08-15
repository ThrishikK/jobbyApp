import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showError: false,
    errorMessage: '',
  }

  onChangeUsername = event => {
    // console.log(event.target.value)
    this.setState({username: event.target.value})
  }

  renderUserName = () => {
    const {username} = this.state
    return (
      <>
        <label className="label-element" htmlFor="username">
          USERNAME
        </label>
        <input
          className="input-element"
          type="text"
          value={username}
          placeholder="Username"
          onChange={this.onChangeUsername}
          id="username"
        />
      </>
    )
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  renderPassword = () => {
    const {password} = this.state
    return (
      <>
        <label htmlFor="password" className="label-element">
          PASSWORD
        </label>
        <input
          className="input-element"
          type="password"
          value={password}
          placeholder="Password"
          onChange={this.onChangePassword}
          id="password"
        />
      </>
    )
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMessage => {
    this.setState({showError: true, errorMessage})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    console.log(response)
    const data = await response.json()
    console.log(data)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {showError, errorMessage} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="main-login-container">
        <form className="login-form-container" onSubmit={this.submitForm}>
          <img
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          />
          <div className="input-container">{this.renderUserName()}</div>
          <div className="input-container">{this.renderPassword()}</div>
          <button className="log-btn-styles" type="submit">
            Login
          </button>
          {showError && <p className="error">{errorMessage}</p>}
        </form>
      </div>
    )
  }
}

export default Login
