import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import {employmentTypesList, salaryRangesList} from '../GivenData'
import './index.css'

const urlProfile = 'https://apis.ccbp.in/profile'
const urlJobs = 'https://apis.ccbp.in/jobs'
const employmentStringList = []

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  loading: 'LOADING',
  failure: 'FAILURE',
  noJobs: 'NOJOBS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    profileDetails: {},
    apiProfileStatus: apiStatusConstants.initial,
    apiJobStatus: apiStatusConstants.initial,
    searchInput: '',
    employmentString: '',
    minimumPackage: '',
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsDetails()
  }

  //   LEFT CONTAINER START
  getProfileData = async () => {
    console.log('GET PROFILE DATA CALLED')
    this.setState({apiProfileStatus: apiStatusConstants.loading})
    const jwtToken = Cookies.get('jwt_token')
    // console.log(jwtToken)
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responseProfile = await fetch(urlProfile, options)
    console.log(responseProfile)
    if (responseProfile.ok) {
      const dataProfile = await responseProfile.json()
      // eslint-disable-next-line camelcase
      const {profile_details} = dataProfile
      // console.log(profile_details)
      const updatedProfile = {
        name: profile_details.name,
        profileImageUrl: profile_details.profile_image_url,
        shortBio: profile_details.short_bio,
      }
      this.setState({
        profileDetails: updatedProfile,
        apiProfileStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiProfileStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSuccessProfile = () => {
    const {profileDetails} = this.state
    return (
      <div className="profile-container">
        <img
          alt="profile"
          className="profile-img"
          src={profileDetails.profileImageUrl}
        />
        <h1>{profileDetails.name}</h1>
        <p>{profileDetails.shortBio}</p>
      </div>
    )
  }

  renderRetryButton = () => (
    <button
      className="btn-retry-styles"
      type="button"
      onClick={this.getProfileData()}
    >
      Retry
    </button>
  )

  renderProfile = () => {
    const {apiProfileStatus} = this.state
    // console.log(profileDetails)
    switch (apiProfileStatus) {
      case apiStatusConstants.loading:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderSuccessProfile()
      case apiStatusConstants.failure:
        return this.renderRetryButton()
      default:
        return null
    }
  }

  employmentChange = event => {
    // console.log(event)
    // console.log(event.target)
    console.log(event.target.id)
    console.log(event.target.checked)
    if (event.target.checked) {
      employmentStringList.push(event.target.id)
    } else if (employmentStringList.includes(event.target.id)) {
      employmentStringList.pop(event.target.id)
    }
    const employmentString = employmentStringList.join(',')
    console.log(employmentStringList)
    console.log(employmentString)
    this.setState({employmentString}, this.getJobsDetails)
  }

  renderTypesOfEmployment = () => (
    <>
      <h1>Type of Employment</h1>
      <ul className="employment-types">
        {employmentTypesList.map(eachType => (
          <li key={eachType.employmentTypeId}>
            <input
              type="checkbox"
              id={eachType.employmentTypeId}
              onChange={this.employmentChange}
            />
            <label htmlFor={eachType.employmentTypeId}>{eachType.label}</label>
          </li>
        ))}
      </ul>
    </>
  )

  salaryChanges = event => {
    // // console.log(event)
    // console.log(event.target)
    const {value} = event.target
    console.log(value)
    let filteredValue = value.split(' ')
    filteredValue = parseInt(filteredValue[0])
    filteredValue *= 100000
    console.log(filteredValue)
    this.setState({minimumPackage: filteredValue}, this.getJobsDetails)
  }

  renderSalaryRanges = () => (
    <>
      <h1>Salary Range</h1>
      <ul className="employment-types">
        {salaryRangesList.map(eachType => (
          <li key={eachType.id}>
            <input
              type="radio"
              name="salary ranges"
              id={eachType.salaryRangeId}
              value={eachType.label}
              onChange={this.salaryChanges}
            />
            <label htmlFor={eachType.salaryRangeId}>{eachType.label}</label>
          </li>
        ))}
      </ul>
    </>
  )

  //   LEFT CONTAINER END

  //   RIGHT CONTAINER START
  getJobsDetails = async () => {
    const {searchInput, employmentString, minimumPackage} = this.state
    console.log(minimumPackage)
    this.setState({apiJobStatus: apiStatusConstants.loading})
    const jwtToken = Cookies.get('jwt_token')
    // console.log(jwtToken)
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const urlJobFilter = `${urlJobs}?search=${searchInput}&employment_type=${employmentString}&minimum_package=${minimumPackage}`
    console.log(urlJobFilter)
    const responseJobs = await fetch(urlJobFilter, options)
    const dataJobs = await responseJobs.json()
    // console.log(dataJobs)
    const {jobs} = dataJobs
    // console.log(jobs)
    if (jobs.length === 0) {
      this.setState({apiJobStatus: apiStatusConstants.noJobs})
    } else {
      const updatedJobs = jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      // console.log(updatedJobs)
      this.setState({
        jobsList: updatedJobs,
        apiJobStatus: apiStatusConstants.success,
      })
    }
  }

  renderSuccessJobs = () => {
    const {jobsList} = this.state
    // console.log(jobsList)
    return (
      <ul className="un-ol-job-container">
        {jobsList.map(eachJob => (
          <Link to={`/jobs/${eachJob.id}`} className="Link-Styles">
            <li className="li-job-container" key={eachJob.id}>
              <div className="logo-container">
                <img
                  className="job-logo"
                  alt="company logo"
                  src={eachJob.companyLogoUrl}
                />
                <div>
                  <h1>{eachJob.title}</h1>
                  <p>{eachJob.rating}</p>
                </div>
              </div>
              <div className="package-container">
                <div className="loc-type-container">
                  <div className="loc-container">
                    <p>{eachJob.location}</p>
                  </div>
                  <div className="type-container">
                    <p>{eachJob.employmentType}</p>
                  </div>
                </div>
                <p>{eachJob.packagePerAnnum}</p>
              </div>
              <hr className="hr-rule" />
              <p>{eachJob.jobDescription}</p>
            </li>
          </Link>
        ))}
      </ul>
    )
  }

  renderNojobs = () => (
    <div className="no-jobs-found-container">
      <img
        alt="no jobs"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs.Try another filters</p>
    </div>
  )

  renderAllJobs = () => {
    const {apiJobStatus} = this.state
    switch (apiJobStatus) {
      case apiStatusConstants.loading:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderSuccessJobs()
      case apiStatusConstants.noJobs:
        return this.renderNojobs()

      default:
        return null
    }
  }

  //   RIGHT CONTAINER END
  // FILTERS START
  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  handleSearchBtnClick = () => {
    this.setState(
      {apiJobStatus: apiStatusConstants.loading},
      this.getJobsDetails,
    )
  }

  // FILTERS END

  render() {
    const {searchInput} = this.state
    return (
      <div className="main-jobs-container">
        <Header />
        <div className="jobs-container">
          {/* PROFILE CONTAINER */}
          <div className="left-jobs-container">
            {this.renderProfile()}
            <hr className="hr-rule" />
            {this.renderTypesOfEmployment()}
            <hr className="hr-rule" />
            {this.renderSalaryRanges()}
          </div>
          {/* JOB DETAILS CONTAINER */}
          <div className="right-jobs-container">
            <div className="search-input-container">
              <input
                value={searchInput}
                type="search"
                className="job-search-input"
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-btn"
                onClick={this.handleSearchBtnClick}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderAllJobs()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
