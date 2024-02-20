import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

export const displayIcon = (type) => {
  switch (type) {
    case "success":
      return <div></div>;
    case "info":
      return <div></div>;
    case "error":
      return <div></div>;
    case "warning":
      return <div></div>;
    default:
        return <div></div>;
    }
};

const ToastMessage = ({ type, message }) =>
  toast[type](
    <div style={{ display: "flex" }}>
      <div
        style={{
          fontSize: 13,
          paddingTop: 8,
          flexShrink: 0,
          textAlign: "center",
          width: "30px"
        }}
      >
        {displayIcon(type)}
      </div>
      <div style={{ flexGrow: 1, fontSize: 13, padding: "8px 12px" }}>
        {message}
      </div>
    </div>
  );

ToastMessage.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

ToastMessage.dismiss = toast.dismiss;

export default ToastMessage;
