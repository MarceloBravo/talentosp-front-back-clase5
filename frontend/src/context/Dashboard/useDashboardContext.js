import { useContext } from "react";
import DashboardContext from "./DashboardContext";

export const useDashboardContext = () => {
    return useContext(DashboardContext);
}