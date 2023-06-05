import { createContext, useEffect, useReducer } from "react";
import Reducer from "./Reducer";
import axiosBaseURL from "../pages/httpCommon";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isFetching: false,
  error: false,
  token: JSON.parse(localStorage.getItem("token")) || null,
};

export const Context = createContext(INITIAL_STATE);

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
    localStorage.setItem("token", JSON.stringify(state.token));
    axiosBaseURL.interceptors.request.use((req) => {
        req.headers.Authorization = `Bearer ${JSON.parse(
          localStorage.getItem("token")
        )}`;
    return req;
    });
  }, [state.user, state.token]);

  return (
    <Context.Provider
      value={{
        user: state.user,
        token: state.token,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </Context.Provider>
  );
};
