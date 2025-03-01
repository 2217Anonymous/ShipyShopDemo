import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function GoBack() {
    const navigate = useNavigate()
  return (
    <>
        <Link onClick={() => navigate(-1)} className="btn btn-light btn-label left rounded-pill shadow mx-2"> 
            <i className="ri-arrow-left-fill label-icon align-middle rounded-pill fs-16 ms-2"></i>Go Back 
        </Link> 
    </>
  )
}
