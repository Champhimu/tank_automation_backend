// const { isValidObjectId } = require('mongoose');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const User = require('../model/userSchema');
const verificationToken = require('../model/verificationToken');
const VerificationToken = require('../model/verificationToken');
// const {mailTransport} = require('./mail');
const { sendError } = require('./helper');

exports.generateOTP = () => {
  let otp = '';
  for (let i = 0; i <= 5; i++) {
    const randVal = Math.round(Math.random() * 9);
    otp += randVal;
  }
  return otp;
}

// other way to export function
async function sendMail(details,res) {
  try {
    const { from, to, subject, html } = details;
    const oauth2Client = new OAuth2(
      process.env.MAIL_CLIENT_ID,
      process.env.MAIL_SECRET,
      "https://developers.google.com/oauthplayground" // Redirect URL
    );
    oauth2Client.setCredentials({
      refresh_token: process.env.MAIL_REFRESH_TOKEN,
    });
    const accessToken = await oauth2Client.getAccessToken();
    const smtpTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.MAIL_USERNAME,
        clientId: process.env.MAIL_CLIENT_ID,
        clientSecret: process.env.MAIL_SECRET,
        refresh_token: process.env.MAIL_REFRESH_TOKEN,
        accessToken: accessToken.token
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    // console.log('my Access token : ',accessToken.token);

    const mailOptions = {
      from,
      to,
      subject,
      html,
    };
    smtpTransport.sendMail(mailOptions, (error, response) => {
      error ? console.log(error) : console.log('Verification email sent');
      smtpTransport.close();
    });
  } catch (error) {
    console.log(error);
    throw new Error("Unable to send Email");
  }
}

exports.isEmailVerified = async (req, res) => {
  const userEmail= req.body.email;
  console.log(userEmail);
  const user= await User.findOne({email:userEmail});
  if (!user) return res.json({ msg: 'user not found' });
  const verified= user.verified;
  if (!verified) return res.json({ msg: 'not verified' });
  else return res.json({ msg: 'verified' });
}

exports.verifyOtpToken = async(email,otp)=>{
  try{
    console.log(email);
    const user = await User.findOne({email:email});
    if (!user) return 'Sorry User not found';
    // console.log("User : ",user);
    // if (user.verified) return sendError(res, 'User already Verified');
    const token = await VerificationToken.findOne({ owner: user._id });
    if (!token) return 'Sorry Token not found';
    const isMatched = await token.compareToken(otp);
    console.log("Matched : ", isMatched);
    if (!isMatched) return "invalid otp";
    user.verified = true;
    await verificationToken.findByIdAndDelete(token._id);
    await user.save();
    return true;
  }catch(error){
    console.log(error);
    return "failed to verify email";
  }
}

exports.verifyEmail = async (req, res) => {
  try {
    userEmail= req.body.email;
    otp = req.body.otp;
    console.log(userEmail);
    if (!userEmail || !otp) {
      return sendError(res, "Invalid request missing parameters")
    }
    const checkVerified= this.verifyOtpToken(userEmail,otp);
    if(checkVerified){
    res.json({ msg: "Email verified Successfully" });
    }else{
      sendError(res,checkVerified);
    }
  } catch (error) {
    console.log(error);
    sendError(res,"Unable to verify Email")
    return false;
  }
}

exports.sendMail = sendMail;