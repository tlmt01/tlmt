import { NextRequest, NextResponse } from "next/server";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";

export async function GET(request: NextRequest) {
  try {
    const userId = String(
      request.nextUrl.searchParams.get("userId") || "",
    ).trim();
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    // Try primary document by ID first
    const userRef = doc(firestore, "users", userId);
    const primaryDoc = await getDoc(userRef);
    if (primaryDoc.exists()) {
      return NextResponse.json(
        {
          docId: primaryDoc.id,
          ...primaryDoc.data(),
          id: primaryDoc.data().id || primaryDoc.id,
        },
        { status: 200 },
      );
    }

    // Fallback to searching by `id` field
    const usersRef = collection(firestore, "users");
    const idQuery = query(usersRef, where("id", "==", userId));
    const snapshot = await getDocs(idQuery);
    if (!snapshot.empty) {
      const firstMatch = snapshot.docs[0];
      return NextResponse.json(
        {
          docId: firstMatch.id,
          ...firstMatch.data(),
          id: firstMatch.data().id || firstMatch.id,
        },
        { status: 200 },
      );
    }

    // Also try phone lookup
    const phoneQuery = query(usersRef, where("phone", "==", userId));
    const phoneSnap = await getDocs(phoneQuery);
    if (!phoneSnap.empty) {
      const first = phoneSnap.docs[0];
      return NextResponse.json(
        { docId: first.id, ...first.data(), id: first.data().id || first.id },
        { status: 200 },
      );
    }

    return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    );
  }
}
