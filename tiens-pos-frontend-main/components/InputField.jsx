import React, { useState } from "react";

function InputField({
  value,
  label,
  name,
  placeholder,
  type = "text",
  icon,
  onChange,
  editable = true,
  className = "",  // Accept external class names gracefully
}) {
  return (
    <div className="my-5">
      {label && <label className="text-gray4">{label}</label>}
      <div className="border-2 border-gray1 flex bg-gray1 rounded-lg my-2">
        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          readOnly={!editable}
          className={`py-1 px-4 rounded-lg my-1 w-full bg-gray1 text-xs text-gray5 h-8 ${className}`}
        />
        <div>{icon}</div>
      </div>
    </div>
  );
}

export default InputField;
