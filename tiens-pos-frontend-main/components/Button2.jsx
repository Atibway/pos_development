import * as React from 'react';
import '../assets/styles/login.css'
import { TbPlus } from "react-icons/tb"

const Button2 = ({ value, onClick }) => {
  return (
    <div onClick={onClick} className="loginBtn px-4 py-2 flex rounded-lg text-center cursor-pointer">
      <TbPlus className='w-6 h-6 -ml-1' /><p className='ml-3'>{value}</p>
    </div>
  )
}

export default Button2
