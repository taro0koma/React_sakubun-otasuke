import React from "react";

export const AccountFormFooter = ({ disabled, text, icon, secondaryText, onClick }) => {
  return (
    <div>
      <button type="submit" disabled={disabled}>
        {icon}
        {text}
      </button>
      <button type="button" onClick={onClick} disabled={disabled}>
        {secondaryText}
      </button>
    </div>
  );
};
