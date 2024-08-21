import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

// Function to send an email
export const sendMail = async (email, subject, link) => {
  const __fileName = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__fileName);
  // Define the path to the EJS template
  const templatePath = path.join(__dirname, "../../../views/verifyToken.ejs");

  // Render the EJS template with the verification URL
  const html = await ejs.renderFile(templatePath, { link });
  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL_USER,
      pass: process.env.NODEMAILER_EMAIL_PASS, // App-specific password generated from Google Account
    },
  });

  // Define email options
  let mailOptions = {
    from: process.env.NODEMAILER_EMAIL_USER,
    to: email,
    subject,
    html,
  };

  return new Promise((resolve, reject) => {
    // Send the email using the transporter
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      } else {
        return resolve("Email Sent Successfully: " + info.response);
      }
    });
  });
};
