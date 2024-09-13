const express = require('express');
require('dotenv').config();
const axios = require('axios');
const app = express();
const port = 7001;


//getAccessToken
const getAccessToken = async () => {
  const consumerKey = process.env.MPESA_CONSUMER_KEY; // Use environment variables
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET; // Use environment variables

  // Choose one depending on your development environment
   const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";  // Sandbox
  //const url = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";  // Live


  try {
    const encodedCredentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    const headers = {
      'Authorization': `Basic ${encodedCredentials}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.get(url, { headers });
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error.message);
    throw new Error('Failed to get access token.');
  }
};

//Variables
const amount = "amount";
const phone = "replace_with_your_phone_number";
const shortCode = process.env.MPESA_PAYBILL;
const passkey = process.env.MPESA_PASSKEY;


//STK push
app.post('/stk', async (req, res) => {
  const token = await getAccessToken();
  const date = new Date();
  const timestamp =
    date.getFullYear() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2);

  //you can use momentjs to generate the same in one line 

  const stk_password = Buffer.from(shortCode + passkey + timestamp).toString(
    "base64"
  );

  //choose one depending on you development environment
  const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
  // const url = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest",

  const headers = {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  };

  const requestBody = {
    "BusinessShortCode": shortCode,
    "Password": stk_password,
    "Timestamp": timestamp,
    "TransactionType": "CustomerPayBillOnline", //till "CustomerBuyGoodsOnline"
    "Amount": amount,
    "PartyA": phone,
    "PartyB": shortCode,
    "PhoneNumber": phone,
    "CallBackURL": "https://yourwebsite.co.ke/callbackurl", //Call back url
    "AccountReference": "account",
    "TransactionDesc": "test"
  };

  try {
    const response = await axios.post(url, requestBody, { headers });
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
})

//start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
