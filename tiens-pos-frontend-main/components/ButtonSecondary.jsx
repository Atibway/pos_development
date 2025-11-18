import * as React from 'react';
import '../assets/styles/login.css'

const ButtonSecondary = ({value}) => {
  return (
    <div className="loginBtnSecondary px-4 py-2 rounded-lg text-center cursor-pointer">
     {value}
    </div>
  )
}

export default ButtonSecondary
