import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const Loading: React.FC = () => {
  return <div className="loading">
    <FontAwesomeIcon icon={faSpinner} spin={true} />
  </div>
}

export default Loading