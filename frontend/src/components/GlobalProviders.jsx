import React from 'react'
import { ToastContainer, toast, Bounce } from 'react-toastify';

export default function GlobalProviders({children}) {
  return (
    <div>
      {children}
    <ToastContainer/>
    </div>
  )
}
