import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

class JobItemDetails extends Component {
  state = {
    selectedJob: '',
  }

  componentDidMount() {
    this.getJobInfo()
  }

  getJobInfo = async () => {
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
    // console.log(response)
    const data = await response.json()
    // console.log(data)
    // eslint-disable-next-line camelcase
    const {job_details} = data
    // eslint-disable-next-line camelcase
    const jobDetails = job_details
    console.log(jobDetails)
    const formattedJobDetails = this.formatJobInfo(jobDetails)
    this.setState({selectedJob: formattedJobDetails})
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
            <img alt="company" src={selectedJob.companyLogoUrl} />
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
            <p>Link</p>
          </div>
          <p>{selectedJob.jobDescription}</p>
        </div>
        <div className="container-3">
          <h1>Skills</h1>
          <ul className="un-ol-skills-container">
            {selectedJob.skills.map(eachSkill => (
              <li>
                <img src={eachSkill.imageUrl} alt="skill" />
                <p>{eachSkill.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="main-job-details-container">
        <Header />
        {this.renderSelectedJob()}
      </div>
    )
  }
}

export default JobItemDetails
