import './index.css'

const SimilarJob = props => {
  const {jobDetails} = props
  const {
    location,
    rating,
    title,
    jobDescription,
    companyLogoUrl,
    employmentType,
  } = jobDetails
  return (
    <li className="container-main-j">
      <div className="container-1-j">
        <img
          className="similar-job-img"
          src={companyLogoUrl}
          alt="similar job company logo"
        />
        <div className="container-1-1-j">
          <h1>{title}</h1>
          <p>{rating}</p>
        </div>
      </div>
      <div className="container-2-j">
        <h1>Description</h1>
        <p>{jobDescription}</p>
      </div>
      <div className="container-3-j">
        <div>
          <p>{location}</p>
        </div>
        <div>
          <p>{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJob
