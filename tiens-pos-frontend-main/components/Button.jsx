import * as React from 'react';
import '../assets/styles/login.css';

const Button = ({
  value,
  onClick = null,
  variant = 'primary', // 'primary', 'outline', 'danger', 'success'
  disabled = false,
  className = '',
  type = 'button',
  children, // optional if we want to pass JSX instead of value
  ...rest
}) => {
  const baseStyles = `px-4 py-2 rounded-lg font-medium text-center transition-all duration-200 cursor-pointer select-none `;


  const variants = {
    primary: `bg-primary text-white disabled:bg-blue-400
    hover:text-[#01b763] hover:bg-white hover:border hover:border-[#01b763] hover:no-underline`,
    outline: `border border-gray-400 text-gray-700 hover:bg-gray-100 disabled:text-gray-400`,
    danger: `bg-red text-white hover:bg-red-700 disabled:bg-red-400`,
    success: `bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400`,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      {...rest}
    >
      {children || value}
    </button>
  );
};

export default Button;
