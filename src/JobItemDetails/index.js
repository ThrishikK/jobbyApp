import {Component} from 'react'
import Cookies from 'js-cookie'
import {BiLinkExternal} from 'react-icons/bi'

import Loader from 'react-loader-spinner'
// import {FaLocationDot} from 'react-icons/fa'
// import {MdLocationPin} from 'react-icons/md'

import Header from '../Header'
import SimilarJob from '../SimilarJob'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  loading: 'LOADING',
  failure: 'FAILURE',
  noJobs: 'NOJOBS',
}

class JobItemDetails extends Component {
  state = {
    selectedJob: '',
    apiStatus: apiStatusConstants.initial,
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobInfo()
  }

  getJobInfo = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)
    console.log(id)
    const jobUrl = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobUrl, options)
    if (response.ok === true) {
      // console.log(response)
      const data = await response.json()
      console.log(data)
      // eslint-disable-next-line camelcase
      const {job_details, similar_jobs} = data
      // eslint-disable-next-line camelcase
      const jobDetails = job_details
      // eslint-disable-next-line camelcase
      const similarJobs = similar_jobs
      //   console.log(jobDetails)
      const formattedJobDetails = this.formatJobInfo(jobDetails)
      const {formattedSimilarJobs} = this.formatSimilarJobs(similarJobs)
      this.setState({
        selectedJob: formattedJobDetails,
        apiStatus: apiStatusConstants.success,
        similarJobs: formattedSimilarJobs,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  formatJobInfo = jobDetails => ({
    companyLogoUrl: jobDetails.company_logo_url,
    title: jobDetails.title,
    companyWebsiteUrl: jobDetails.company_website_url,
    employmentType: jobDetails.employment_type,
    id: jobDetails.id,
    jobDescription: jobDetails.job_description,
    packagePerAnnum: jobDetails.package_per_annum,
    location: jobDetails.location,
    rating: jobDetails.rating,
    skills: jobDetails.skills.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    })),
    lifeAtCompany: jobDetails.life_at_company,
  })

  formatSimilarJobs = similarJobs => ({
    formattedSimilarJobs: similarJobs.map(eachJob => ({
      companyLogoUrl: eachJob.company_logo_url,
      id: eachJob.id,
      employmentType: eachJob.employment_type,
      location: eachJob.location,
      jobDescription: eachJob.job_description,
      rating: eachJob.rating,
      title: eachJob.title,
    })),
  })

  renderSelectedJob = () => {
    const {selectedJob} = this.state
    // const {skills} = selectedJob
    // console.log(skills)
    // console.log(selectedJob.skills)
    // console.log(selectedJob)
    return (
      <div className="selected-job-container">
        <div className="container-1">
          <div className="logo-container">
            <img
              className="company-logo"
              alt="job details company logo"
              src={selectedJob.companyLogoUrl}
            />
            <div className="title-and-stars-container">
              <h1>{selectedJob.title}</h1>
              <div className="rating-container">
                <p>{selectedJob.rating}</p>
              </div>
            </div>
          </div>
          <div className="location-and-type-container-1">
            <div className="location-and-type-container-2">
              <div className="location-container">
                {/* <MdLocationPin /> */}
                {/* <p>
                  <FaLocationDot />
                </p> */}
                <p>{selectedJob.location}</p>
              </div>
              <div className="job-type-container">
                <p>{selectedJob.employmentType}</p>
              </div>
            </div>
            <p>{selectedJob.packagePerAnnum}</p>
          </div>
        </div>
        <hr className="hr-rule" />
        <div className="container-2">
          <div className="container-2-1">
            <h1>Description</h1>
            <a className="anchor" href={selectedJob.companyWebsiteUrl}>
              Visit
              <BiLinkExternal />
            </a>
          </div>
          <p>{selectedJob.jobDescription}</p>
        </div>
        <div className="container-3">
          <h1>Skills</h1>
          <ul className="un-ol-skills-container">
            {selectedJob.skills.map(eachSkill => (
              <li key={eachSkill.name} className="skill-name-li-item">
                <img src={eachSkill.imageUrl} alt={eachSkill.name} />
                <p className="skill-name-p">{eachSkill.name}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="container-4-life-at-company">
          <h1>Life at Company</h1>
          <div className="container-4-1">
            <p>{selectedJob.lifeAtCompany.description}</p>
            <img
              alt="life at company"
              src={selectedJob.lifeAtCompany.image_url}
            />
          </div>
        </div>
      </div>
    )
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderBasedOnApi = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.loading:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderSelectedJob()
      default:
        return null
    }
  }

  render() {
    const {similarJobs} = this.state
    console.log(similarJobs)
    return (
      <div className="main-job-details-container">
        <Header />
        <div className="second-container">
          {this.renderBasedOnApi()}
          <ul className="un-ol-similar-jobs-container">
            {similarJobs.map(eachJob => (
              <SimilarJob jobDetails={eachJob} />
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default JobItemDetails
