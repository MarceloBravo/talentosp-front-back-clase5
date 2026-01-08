import { useContext } from "react";
import DashboardContext from "./DashboardContext";

export const useDashboard = () => {
    return useContext(DashboardContext);
}