import nodemailer from "nodemailer";


const domain = process.env.NEXT_PUBLIC_PRODUCTION_URL;






export const sendVerificationEmail = async (
  email: string, 
  token: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PIN,
    },
  });


  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Welcome to Tasks.io!",
    html: `<p>Your verification code is ${token}</p>`,
  };

  await transporter.sendMail(mailOptions);
}






export const sendPasswordResetEmail = async (
  email: string, 
  token: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PIN,
    },
  });

  const resetLink = `${domain}/auth/new-password?token=${token}`


  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
  };

  await transporter.sendMail(mailOptions);
}






export const sendTwoFactorEmail = async (
  email: string, 
  token: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PIN,
    },
  });


  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Two factor code",
    html: `<p>Your two factor code is ${token}</p>`,
  };

  await transporter.sendMail(mailOptions);
}