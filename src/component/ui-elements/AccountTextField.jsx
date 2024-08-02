import React from "react";

const AccountTextField = ({ id, name, value, onChange, error, type, label, secondaryLabel, icon, disabled }) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <div>
        {icon}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={secondaryLabel}
          disabled={disabled}
        />
      </div>
      {error && <p>{error}</p>}
    </div>
  );
};

export default AccountTextField;
