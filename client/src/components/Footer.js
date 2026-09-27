import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    < div  >
      
     <div className=" d-flex flex-wrap justify-content-between align-items-center py- my-4 border-top">
    <div className=" col-md-4 d-flex align-items-center centered-div">
      <Link to="/" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
        <svg className="bi" width="30" height="24"></svg>
      </Link>
     </div>
  </div>
 
  <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }} className='justify-center text-muted'>© 2026 FoodNest · Sakhya Sharma</div>
      </div>
 
 
  )
}
