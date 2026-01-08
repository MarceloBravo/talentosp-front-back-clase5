import { useReducer } from "react";
import DashboardContext from "./DashboardContext";
import { dashboardReducer, initialState } from "./DashboardReducer";

export const DashboardProvider = ({children}) => {
    const [state, dispatch] = useReducer(dashboardReducer, initialState);

    return (
        <DashboardContext.Provider value={{state, dispatch}}>
            {children}
        </DashboardContext.Provider>
    )
}