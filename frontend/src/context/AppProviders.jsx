import React from "react";
import { AuthProvider } from "./Auth/AuthProvider";
import { DashboardProvider } from "./Dashboard/DashboardProvider";

export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <DashboardProvider>
        {children}
      </DashboardProvider>
    </AuthProvider>
  );
};