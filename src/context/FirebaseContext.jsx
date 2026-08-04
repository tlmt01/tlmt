"use client";

import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { createContext, useContext } from "react";
import { set, ref } from "firebase/database";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

import { database, firebaseAuth, firestore, storage } from "@/lib/firebase";

const FirebaseContext = createContext(null);
const getStoragePathFromUrl = (photoUrl = "") => {
  if (!photoUrl) return "";

  try {
    const encodedPath = photoUrl.split("/o/")[1]?.split("?")[0];
    return encodedPath ? decodeURIComponent(encodedPath) : "";
  } catch {
    return "";
  }
};

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
    const usersRef = collection(firestore, "users");
    const phoneQuery = query(usersRef, where("phone", "==", phone));
    const snapshot = await getDocs(phoneQuery);

    if (!snapshot.empty) {
      const matches = snapshot.docs.map((item) => ({
        docId: item.id,
        ...item.data(),
        id: item.data().id || item.id,
      }));
      return (
        matches.find((user) => user.id !== user.docId) || matches[0] || null
      );
    }

    return null;
  };

  const getUserById = async (userId) => {
    const userRef = doc(firestore, "users", userId);
    const primaryDoc = await getDoc(userRef);
    if (primaryDoc.exists()) {
      return {
        docId: primaryDoc.id,
        ...primaryDoc.data(),
        id: primaryDoc.data().id || primaryDoc.id,
      };
    }

    const usersRef = collection(firestore, "users");
    const idQuery = query(usersRef, where("id", "==", userId));
    const snapshot = await getDocs(idQuery);
    if (!snapshot.empty) {
      const firstMatch = snapshot.docs[0];
      return {
        docId: firstMatch.id,
        ...firstMatch.data(),
        id: firstMatch.data().id || firstMatch.id,
      };
    }

    return null;
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
    photoPath = "",
    customerID = "",
    url = "",
    address = "",
  }) => {
    const stableUserId = id || customerID || phone;
    const userRef = doc(firestore, "users", stableUserId);
    const existingUser = await getDoc(userRef);
    if (existingUser.exists()) {
      throw new Error("A profile with this user ID already exists.");
    }

    const phoneMatch = await getDocs(
      query(collection(firestore, "users"), where("phone", "==", phone)),
    );
    if (!phoneMatch.empty) {
      throw new Error("A profile with this mobile number already exists.");
    }

    await setDoc(userRef, {
      name: name.trim(),
      phone,
      email: email.trim().toLowerCase(),
      userType,
      desig,
      disabled,
      empid,
      id: stableUserId,
      photoPath,
      customerID,
      url,
      address: address.trim(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const updateUserProfile = async ({
    userId,
    name,
    phone,
    email = "",
    userType = "customer",
    desig = "customer",
    disabled = false,
    empid = "",
    photoPath = "",
    customerID = "",
    url = "",
    address = "",
  }) => {
    const currentProfile = await getUserById(userId);
    if (!currentProfile) {
      throw new Error("Your profile could not be found. Please sign in again.");
    }

    const normalizedPhone = phone.replace(/\D/g, "").slice(-10);
    const phoneMatches = await getDocs(
      query(
        collection(firestore, "users"),
        where("phone", "==", normalizedPhone),
      ),
    );
    const duplicate = phoneMatches.docs.find(
      (item) => item.id !== currentProfile.docId,
    );
    if (duplicate) {
      throw new Error("That mobile number already belongs to another user.");
    }

    const userRef = doc(firestore, "users", currentProfile.docId);
    await updateDoc(userRef, {
      name: name.trim(),
      phone: normalizedPhone,
      email: email.trim().toLowerCase(),
      userType,
      desig,
      disabled,
      empid,
      id: currentProfile.id || userId,
      photoPath,
      customerID,
      url,
      address: address.trim(),
      updatedAt: serverTimestamp(),
    });

    return {
      ...currentProfile,
      name: name.trim(),
      phone: normalizedPhone,
      email: email.trim().toLowerCase(),
      userType,
      desig,
      disabled,
      empid,
      id: currentProfile.id || userId,
      photoPath,
      customerID,
      url,
      address: address.trim(),
    };
  };

  const uploadUserPhoto = async ({
    file,
    userId,
    oldPhotoPath = "",
    oldPhotoUrl = "",
  }) => {
    if (!file) {
      return { url: "", photoPath: "" };
    }

    try {
      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const photoPath = `users/${userId}/${Date.now()}-${safeFileName}`;
      const photoRef = storageRef(storage, photoPath);
      await uploadBytes(photoRef, file, { contentType: file.type });

      const resolvedOldPhotoPath =
        oldPhotoPath || getStoragePathFromUrl(oldPhotoUrl);

      if (resolvedOldPhotoPath) {
        try {
          await deleteObject(storageRef(storage, resolvedOldPhotoPath));
        } catch {
          console.warn("Unable to remove the previous profile photo.");
        }
      }

      return {
        url: await getDownloadURL(photoRef),
        photoPath,
      };
    } catch (error) {
      console.error("Unable to upload profile photo:", error);
      return { url: "", photoPath: "" };
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
        getUserById,
        registerUserProfile,
        updateUserProfile,
        uploadUserPhoto,
        verifyEmailOTP,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
