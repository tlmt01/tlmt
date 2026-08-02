import nodemailer from "nodemailer";

const sendEmail = async ({ email, code, name }: any) => {
  try {
    const mail = process.env.TLMT_GMAIL_ID;
    const mailpassword = process.env.TLMT_GMAIL_PASSWORD;

    // Validate environment variables
    if (!mail || !mailpassword) {
      throw new Error("Email credentials are missing in environment variables");
    }

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: mail,
        pass: mailpassword,
      },
    });

    await new Promise((resolve, reject) => {
      transport.verify((error: any, success: any) => {
        error ? reject(error) : resolve(success);
      });
    });

    // Fixed mailData with guaranteed string values
    const mailData = {
      from: `The Little Mango Tree <${mail}>`, // Using string format instead of object
      replyTo: email,
      to: email,
      subject: `Verify your email: Mail no ${Math.floor(
        Math.random() * 1000 + 1,
      )}`,
      text: `Hello Dear ${name}!`,
      html: `<h1 style="text-align:center; color:blue; ">Hello Dear ${name}</h1>
        <h2 style="text-align:center; color:blue;">Your OTP is ${code}. Please use this OTP to verify your email.</h2>`,
    };

    await new Promise((resolve, reject) => {
      transport.sendMail(mailData, (err: any, info: any) => {
        err ? reject(err) : resolve(info);
      });
    });

    return "Email sent successfully";
  } catch (error) {
    console.error(error);
    throw error; // Propagate error to caller
  }
};

export default sendEmail;
