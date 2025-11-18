import * as React from 'react';
import '../assets/styles/login.css'

const ButtonAlt = ({ value, onClick = null }) => {
  return (
    <div onClick={onClick} className="Btn px-3 py-2 text-sm rounded-lg text-center w-auto cursor-pointer">
      {value}
    </div>
  )
}

export default ButtonAlt
