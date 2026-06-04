import ApiResponse from "../types/ApiResponse.js";

import nodemailer from "nodemailer";


export default async function sendVerificationEmail(
  email: string,
  verifyCode: string,
  username: string,
): Promise<ApiResponse> {
  try {
    console.log(
      "verification email credentials ",
      process.env.EMAIL_USER,
      process.env.EMAIL_PASSWORD,
    );
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const emailHtml = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Hello ${username},</h2>
                <p>Thank you for registering. Please use the following verification code to complete your registration:</p>
                <h1 style="color: #4A90E2;">${verifyCode}</h1>
                <p>This code will expire in 30 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
            </div>
        `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verification Code | FinPay ",
      html: emailHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      "Verification code sent successfully, code sent to ",
      info.response,
    );

    return { success: true, message: "verification code sent successfully" };
  } catch (error) {
    console.error("error occured while sending verification email");
    return {
      success: false,
      message: "status : error occured while sending verification email",
    };
  }
}
