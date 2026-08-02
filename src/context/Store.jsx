"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { decryptData, deleteCookie, getCookie } from "../modules/encryption";

import { FirebaseProvider } from "./FirebaseContext";

export const initialSessionState = { loggedIn: false, userType: "", desig: "" };
export const emptyUser = {
  userType: "customer",
  desig: "customer",
  disabled: false,
  email: "",
  empid: "",
  id: "",
  phone: "",
  photoName: "",
  customerID: "",
  name: "",
  url: "",
};

const GlobalContext = createContext({
  state: null,
  setState: () => null,
  USER: {
    userType: "customer",
    desig: "customer",
    disabled: false,
    email: "",
    empid: "",
    id: "",
    phone: "",
    photoName: "",
    customerID: "",
    name: "",
    url: "",
  },
  setUSER: () => {},
  stateArray: [],
  setStateArray: () => [],
  stateObject: {},
  setStateObject: () => {},
});

export const GlobalContextProvider = ({ children }) => {
  const [state, setState] = useState(initialSessionState);
  const [USER, setUSER] = useState(emptyUser);
  const [stateArray, setStateArray] = useState([]);
  const [stateObject, setStateObject] = useState({});

  useEffect(() => {
    const restoreSession = () => {
      const encryptedUser = getCookie("user");
      if (!encryptedUser) return;
      try {
        const savedUser = decryptData(encryptedUser);
        if (!savedUser?.phone) return;
        setUSER({ ...emptyUser, ...savedUser });
        setState({
          ...initialSessionState,
          ...savedUser,
          loggedIn: true,
        });
      } catch {
        deleteCookie("user");
      }
    };
    const timer = window.setTimeout(restoreSession, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        state,
        setState,
        USER,
        setUSER,
        stateArray,
        setStateArray,
        stateObject,
        setStateObject,
      }}
    >
      <FirebaseProvider>{children}</FirebaseProvider>
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
