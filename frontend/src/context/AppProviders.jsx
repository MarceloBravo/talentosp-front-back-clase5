import React from "react";
import { AuthProvider } from "./Auth/AuthProvider";

export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
        {children}
    </AuthProvider>
  );
};