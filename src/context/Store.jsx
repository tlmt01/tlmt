"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  decryptData,
  deleteCookie,
  getCookie,
  encryptObjData,
} from "../modules/encryption";

import { FirebaseProvider } from "./FirebaseContext";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";

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
    const restoreSession = async () => {
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

        // Try to fetch the authoritative user record directly from Firestore
        let serverUser = null;
        try {
          const idOrPhone = savedUser.id || savedUser.phone || "";
          if (idOrPhone) {
            // Try primary document by ID first
            const userRef = doc(firestore, "users", idOrPhone);
            const primaryDoc = await getDoc(userRef);
            if (primaryDoc.exists()) {
              serverUser = {
                docId: primaryDoc.id,
                ...primaryDoc.data(),
                id: primaryDoc.data().id || primaryDoc.id,
              };
            } else {
              const usersRef = collection(firestore, "users");
              const idQuery = query(usersRef, where("id", "==", idOrPhone));
              const snapshot = await getDocs(idQuery);
              if (!snapshot.empty) {
                const firstMatch = snapshot.docs[0];
                serverUser = {
                  docId: firstMatch.id,
                  ...firstMatch.data(),
                  id: firstMatch.data().id || firstMatch.id,
                };
              } else {
                const phoneQuery = query(
                  usersRef,
                  where("phone", "==", idOrPhone),
                );
                const phoneSnap = await getDocs(phoneQuery);
                if (!phoneSnap.empty) {
                  const first = phoneSnap.docs[0];
                  serverUser = {
                    docId: first.id,
                    ...first.data(),
                    id: first.data().id || first.id,
                  };
                }
              }
            }
          }
        } catch {}

        const effectiveUser = serverUser || savedUser;

        const normalizedUser = {
          ...emptyUser,
          ...effectiveUser,
          loggedIn: true,
          userType: effectiveUser.userType || "customer",
          desig: effectiveUser.desig || "customer",
          authReady: true,
        };

        // update cookie + localStorage so client reflects server-side changes
        try {
          encryptObjData("user", normalizedUser, 15 * 24 * 60);
        } catch {}

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
