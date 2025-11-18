import React from "react";
import { Navigate } from "react-router-dom";

const RoleGuard = ({ allowedRoles, children }) => {
  const user = JSON.parse(localStorage.getItem("schoolSoftUser"));

  const userRoles = user?.roles;


  if (userRoles) {
    const hasRole = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      if (userRoles.includes("sales")) {
        window.location.href = "/sales";
        return null

      } else if (userRoles.includes("stock")) {
        window.location.href = "/stock";
        return null

      } else if (userRoles.includes("reports")) {
        window.location.href = "/reports";
        return null
      }
    }
  }



  return children;
};

export default RoleGuard;
