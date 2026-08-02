import { NextRequest, NextResponse } from "next/server";
import sendEmail from "../../../helpers/mailer";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

function generateOTP() {
  // Generate a random number between 100000 and 999999
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString(); // Convert it to string if you need the OTP as a string
}
export async function POST(request: NextRequest) {
  try {
    const reqBody: unknown = await request.json();
    const { email, name } = reqBody as { email?: unknown; name?: unknown };
    if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 },
      );
    }
    const otp = generateOTP();
    await setDoc(doc(firestore, "otps", otp), {
      email: email.trim().toLowerCase(),
      code: otp,
      expiresIn: new Date().getTime() + 300 * 1000,
    });

    await sendEmail({
      email,
      code: otp,
      name: typeof name === "string" ? name : "there",
    });

    return NextResponse.json(
      {
        message: "OTP Sent, Please check your Email",
        success: true,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to send OTP." },
      { status: 500 },
    );
  }
}
