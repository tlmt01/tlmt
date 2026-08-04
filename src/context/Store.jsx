"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { decryptData, deleteCookie, getCookie } from "../modules/encryption";

import { FirebaseProvider } from "./FirebaseContext";

export const initialSessionState = {
  loggedIn: false,
  userType: "",
  desig: "",
  authReady: false,
};
const SESSION_STORAGE_KEY = "tlmt-auth-session";
export const emptyUser = {
  userType: "customer",
  desig: "customer",
  disabled: false,
  email: "",
  empid: "",
  id: "",
  docId: "",
  phone: "",
  photoPath: "",
  customerID: "",
  name: "",
  url: "",
  address: "",
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
    docId: "",
    phone: "",
    photoPath: "",
    customerID: "",
    name: "",
    url: "",
    address: "",
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
      try {
        const encryptedUser = getCookie("user");
        const savedSession = window.localStorage.getItem(SESSION_STORAGE_KEY);
        const parsedSavedSession = savedSession
          ? JSON.parse(savedSession)
          : null;
        const savedUser = encryptedUser
          ? decryptData(encryptedUser)
          : parsedSavedSession;

        if (!savedUser?.phone) {
          setState({ ...initialSessionState, authReady: true });
          return;
        }

        const normalizedUser = {
          ...emptyUser,
          ...savedUser,
          loggedIn: true,
          userType: savedUser.userType || "customer",
          desig: savedUser.desig || "customer",
          authReady: true,
        };

        setUSER(normalizedUser);
        setState({
          ...initialSessionState,
          ...normalizedUser,
          loggedIn: true,
          authReady: true,
        });
        window.localStorage.setItem(
          SESSION_STORAGE_KEY,
          JSON.stringify(normalizedUser),
        );
      } catch {
        deleteCookie("user");
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
        setState({ ...initialSessionState, authReady: true });
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
