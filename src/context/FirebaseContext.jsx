"use client";

import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { createContext, useContext } from "react";
import { set, ref } from "firebase/database";
import {
  doc,
  deleteDoc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

import { database, firebaseAuth, firestore, storage } from "@/lib/firebase";

const FirebaseContext = createContext(null);
export const useFirebase = () => useContext(FirebaseContext);
export const FirebaseProvider = (props) => {
  const signupUserWithEmailAndPass = (email, password) => {
    return createUserWithEmailAndPassword(firebaseAuth, email, password);
  };

  const putData = (key, data) => {
    set(ref(database, key), data);
  };

  const deleteData = (email) => {
    return deleteUser(email);
  };

  const getUserByPhone = async (phone) => {
    const userSnapshot = await getDoc(doc(firestore, "users", phone));
    return userSnapshot.exists() ? userSnapshot.data() : null;
  };

  const registerUserProfile = async ({
    name,
    phone,
    email = "",
    userType = "customer",
    desig = "customer",
    disabled = false,
    empid = "",
    id = "",
    photoName = "",
    customerID = "",
    url = "",
  }) => {
    const userRef = doc(firestore, "users", phone);
    await runTransaction(firestore, async (transaction) => {
      const existingUser = await transaction.get(userRef);
      if (existingUser.exists()) {
        throw new Error("A profile with this mobile number already exists.");
      }
      transaction.set(userRef, {
        name: name.trim(),
        phone,
        email: email.trim().toLowerCase(),
        userType,
        desig,
        disabled,
        empid,
        id,
        photoName,
        customerID,
        url,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });
  };

  const uploadUserPhoto = async ({ file, userId }) => {
    if (!file) {
      return { url: "", photoName: "" };
    }

    try {
      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const photoRef = storageRef(
        storage,
        `users/${userId}/${Date.now()}-${safeFileName}`,
      );
      await uploadBytes(photoRef, file, { contentType: file.type });
      return {
        url: await getDownloadURL(photoRef),
        photoName: file.name,
      };
    } catch (error) {
      console.error("Unable to upload profile photo:", error);
      return { url: "", photoName: "" };
    }
  };

  const verifyEmailOTP = async ({ email, otp }) => {
    const otpRef = doc(firestore, "otps", otp);
    const otpSnapshot = await getDoc(otpRef);
    if (!otpSnapshot.exists()) return false;

    const otpData = otpSnapshot.data();
    const isValid =
      otpData.email?.toLowerCase() === email.trim().toLowerCase() &&
      otpData.code === otp &&
      Number(otpData.expiresIn) > Date.now();
    if (isValid || Number(otpData.expiresIn) <= Date.now()) {
      await deleteDoc(otpRef);
    }
    return isValid;
  };
  return (
    <FirebaseContext.Provider
      value={{
        signupUserWithEmailAndPass,
        putData,
        deleteData,
        getUserByPhone,
        registerUserProfile,
        uploadUserPhoto,
        verifyEmailOTP,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
